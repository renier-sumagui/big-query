import moment from "moment-timezone";
import { app } from "../../config";
import { OrderModel } from "./orderModel";
import { BigQueryService } from "../../services";
import { StoreRepository } from "../stores/repository/mongo";
import pLimit from "p-limit";
import { getStoreDayRange } from "../../utils/getStoreDayRange";
import { DateTime } from "luxon";
import * as employeeHandler from "../employees/employeeHandler";
import * as revenueCenterHandler from "../revenueCenters/revenueCenterHandler";
import * as paymentHandler from "../payments/paymentHandler";
import * as transactionHandler from "../transactions/transactionHandler";
import _ from 'lodash';

const dataset = app.bigQuery.dataset || "prod_hero_dataset";
const ordersTable = app.bigQuery.ordersTable || "orders";

const getOrdersByStoreCursor = (data: any) => {
    let parameters: any = {};
    if (data.merchantId) parameters.merchantId = data.merchantId;
    if (data.storeId) parameters.storeId = data.storeId;

    if (data.startDate && data.endDate == undefined)
        parameters.createdAt = { $gte: data.startDate };
    if (data.endDate && data.startDate == undefined)
        parameters.createdAt = { $lte: data.endDate };
    if (data.endDate && data.startDate)
        parameters.createdAt = { $gte: data.startDate, $lte: data.endDate };

    parameters.status = 1;

    return OrderModel.find(parameters)
        .sort({ orderNumber: -1 })
        .cursor();
};

const getOrders = async (data: any) => {
    let parameters: any = {};
    if (data.merchantId) parameters.merchantId = data.merchantId;
    if (data.storeId) parameters.storeId = data.storeId;

    if (data.startDate && data.endDate == undefined)
        parameters.createdAt = { $gte: data.startDate };
    if (data.endDate && data.startDate == undefined)
        parameters.createdAt = { $lte: data.endDate };
    if (data.endDate && data.startDate)
        parameters.createdAt = { $gte: data.startDate, $lte: data.endDate };

    const result: any = await OrderModel.find(parameters)
        .sort({ orderNumber: -1 })
        .limit(0)
        .skip(0);

    return result;
}


/**
 * Collects all orders for all stores for their respective local day (midnight to 23:59:59),
 * batching results for efficient processing (e.g., for BigQuery upload).
 * Uses each store's timezone to determine the correct day range, processes orders with enrichment,
 * and limits concurrency to avoid overloading the database.
 *
 * @returns {Promise<Array<any>>} An array of enriched order objects, suitable for bulk upload.
 *
 * @note Concurrency is limited to 10 stores at a time. Each store's orders are processed with full enrichment.
 */
const collectAllOrdersForBulkUpload = async () => {
    let stores = await StoreRepository.getAllStoresWithIntegrations();

    // TODO: Uncomment the lines below after testing
    // stores = stores.filter(store => {
    //     return store.integrations?.some((integration: any) => 
    //         integration.name === 'BigQuery' && integration.enabled === true
    //     );
    // });

    const limit = pLimit(10);
    let totalUploaded = 0;
    let totalFailed = 0;

    const processStore = async (store: any) => {
        const bigQueryService = new BigQueryService();
        let storeUploaded = 0;
        let storeFailed = 0;
        const storeTimezone = store.storeTimezone || 'America/Los_Angeles';
        const reportDate = DateTime.now().setZone(storeTimezone).toISO();
        const { startOfDay, endOfDay } = getStoreDayRange(storeTimezone);

        const params = {
            storeId: store._id.toString(),
            merchantId: store.merchantId,
            startDate: startOfDay,
            endDate: endOfDay,
            status: 1,
        };

        // const cursor = getOrdersByStoreCursor(params);
        // let batch: any[] = [];

        // for await (const order of cursor) {
        //     batch.push({
        //         id: order._id.toString(),
        //         data: JSON.stringify(order),
        //         reportDate: store.storeTimezone ? DateTime.now().setZone(store.storeTimezone).toISO() : DateTime.now().toISO()
        //     });
            
        //     if (batch.length === BATCH_SIZE) {
        //         allOrders.push(...batch);
        //         batch = [];
        //     }
        // }

        // if (batch.length > 0) {
        //     allOrders.push(...batch);
        // }

        const response: any = await getOrders(params);

        const employeeIds: string[] = []
        const revenueCenterIds: string[] = []
        const customerIds: string[] = []
        const orderIds: string[] = []
    
        let childOrderIds: string[] = []

        for (let order of response) {
            if (order.splitOrderType !== 1) {
                for (let childOrderId of order.splitOrderList) {
                    if (childOrderId?.length === 24) {
                        childOrderIds.push(childOrderId)
                    }
                }
            }
        }

        const childOrders: any[]  =
            childOrderIds.length > 0 ? await OrderModel.find({ _id: { $in: childOrderIds } }) : [];

        const mergedOrders = response.concat(childOrders);



        mergedOrders.forEach((order: any) => {
            if (order.seats?.length > 0 && order.seats[0].customerId) {
                customerIds.push(order.seats[0].customerId)
            }

            if (order.serverId && order.serverId != 0) {
                employeeIds.push(order.serverId);
            }

            if (order.revenueCenterId && order.revenueCenterId != 0) {
                revenueCenterIds.push(order.revenueCenterId);
            }
            orderIds.push(order._id);
        });
        
        const servers: any = employeeIds.length > 0 ? await employeeHandler.getEmployeeByIds(employeeIds.toString(), store._id.toString()) : [];
        const revenueCenters: any = revenueCenterIds.length > 0 ? await revenueCenterHandler.getRevenueCentersByIds(revenueCenterIds.toString()) : [];
        
        const payments: any = await paymentHandler.getPaymentsByOrderIds({ orderIds: orderIds.toString() });

        const groupedServers = _.groupBy(servers, 'employeeId')
        const groupedRevenueCenters = _.groupBy(revenueCenters, 'revenueCenterId')
        const groupedPayments = _.groupBy(payments, 'orderId')

        // Batch collect all transaction IDs to avoid N+1 query problem
        const allTransactionIds: string[] = [];
        const orderPaymentMap: { [orderId: string]: any } = {};

        // Collect all transaction IDs and create mapping for efficient lookup
        console.log(`Processing ${response.length} orders for transactions`);
        let ordersWithPayments = 0;
        for (let order of response) {
            const orderId = order._id.toString();
            if (groupedPayments[orderId]) {
                const payment = groupedPayments[orderId][0];
                orderPaymentMap[orderId] = payment;
                ordersWithPayments++;
                if (payment.transactionIds && Array.isArray(payment.transactionIds)) {
                    allTransactionIds.push(...payment.transactionIds);
                }
            } else {
                console.log(`Order ${orderId} has no payment data`);
            }
        }

        // Single batch query for all transactions
        let allTransactions: any[] = [];
        if (allTransactionIds.length > 0) {
            const uniqueTransactionIds = [...new Set(allTransactionIds)]; // Remove duplicates
            allTransactions = await transactionHandler.getTransactionsByIds({ 
                transactionIds: uniqueTransactionIds.join(",") 
            });
        }

        // Group transactions by payment ID for efficient lookup
        const groupedTransactions = _.groupBy(allTransactions, 'paymentId');

        let processedOrders = 0;

        for (let order of response) {
            order = order.toJSON();
            if (groupedServers[order.serverId]) {
                order.serverId = groupedServers[order.serverId][0];
            }
            if (groupedRevenueCenters[order.revenueCenterId]) {
                order.revenueCenter = groupedRevenueCenters[order.revenueCenterId][0]
            }
            if (groupedPayments[order.orderId]) {
                
                // Get transactions for this payment from the pre-fetched data
                const payment = groupedPayments[order.orderId][0];
                const paymentTransactions = groupedTransactions[payment.paymentId] || [];
                const paymentAmount = paymentTransactions.reduce((acc, curr) => acc + curr.transactionAmount, 0)
                let subAmount = 0
                let refunded = 0
                let serviceCharge = 0
                let tax = 0
                for (let i = 0; i < paymentTransactions?.length; i++) {
                    if (parseFloat(paymentTransactions[i].extraFields.subAmount) < 0) {
                        subAmount += parseFloat(paymentTransactions[i].extraFields.subAmount)
                    }
                    if (paymentTransactions[i].transactionAmount < 0) {
                        refunded += paymentTransactions[i].transactionAmount
                    }
                    if (parseFloat(paymentTransactions[i].extraFields.serviceCharge) < 0) {
                        serviceCharge += parseFloat(paymentTransactions[i].extraFields.serviceCharge)
                    }
                    if (parseFloat(paymentTransactions[i].extraFields.tax) < 0) {
                        tax += parseFloat(paymentTransactions[i].extraFields.tax)
                    }
                }

                order.subTotalAmount = parseFloat(
                    parseFloat(order.subTotalAmount + subAmount).toFixed(2)
                );

                const tip = groupedPayments[order.orderId][0].paymentTipAmount
                // console.log('tip: ', tip)
                order.totalAmount = tip ? parseFloat(parseFloat(order.totalAmount + refunded + tip).toFixed(2)) : parseFloat(parseFloat(order.totalAmount + refunded).toFixed(2))
                order.serviceChargeAmount = parseFloat(
                    parseFloat(order.serviceChargeAmount + serviceCharge).toFixed(2)
                );

                order.taxAmount = parseFloat(parseFloat(order.taxAmount + tax).toFixed(2))
                order.paymentNumber = groupedPayments[order.orderId][0].paymentNumber
                order.paymentId = groupedPayments[order.orderId][0].paymentId
                order.paymentAmount = paymentAmount.toFixed(2)
                order.paymentTipAmount = tip
            }

            // Upload order immediately
            const orderData = {
                id: order.orderId.toString(),
                data: JSON.stringify(order),
                reportDate: reportDate
            };

            try {
                await bigQueryService.uploadToBigQuery({
                    rows: [orderData],
                    dataset: dataset,
                    table: ordersTable
                });
                storeUploaded++;
                totalUploaded++;
                console.log(`Uploaded order ${order.orderId} for store ${store._id}`);
            } catch (error) {
                storeFailed++;
                totalFailed++;
                console.error(`Failed to upload order ${order.orderId} for store ${store._id}:`, error);
            }
            
            processedOrders++;
        }

        console.log(`Processing ${childOrders.length} child orders`);
        for (let order of childOrders) {
            order = order.toJSON()
            if (groupedServers[order.serverId]) {
                order.serverId = groupedServers[order.serverId][0]
            }
            if (groupedRevenueCenters[order.revenueCenterId]) {
                order.revenueCenter = groupedRevenueCenters[order.revenueCenterId][0]
            }
            if (groupedPayments[order.orderId]) {
                order.paymentNumber = groupedPayments[order.orderId][0].paymentNumber
            }
        
            // Upload child order immediately
            const childOrderData = {
                id: order.orderId.toString(),
                data: JSON.stringify(order),
                reportDate: reportDate
            };

            try {
                await bigQueryService.uploadToBigQuery({
                    rows: [childOrderData],
                    dataset: dataset,
                    table: ordersTable
                });
                storeUploaded++;
                totalUploaded++;
                console.log(`Uploaded child order ${order.orderId} for store ${store._id}`);
            } catch (error) {
                storeFailed++;
                totalFailed++;
                console.error(`Failed to upload child order ${order.orderId} for store ${store._id}:`, error);
            }
        }

        console.log(`Processed ${processedOrders} main orders, ${childOrders.length} child orders`);
        console.log(`Store ${store._id} (${store.storeName || 'Unknown'}): ${storeUploaded} uploaded, ${storeFailed} failed`);
        
        return {
            uploaded: storeUploaded,
            failed: storeFailed,
            total: processedOrders + childOrders.length
        };
    };

    // Process stores with concurrency limit
    const results = await Promise.allSettled(
        stores.map(store => limit(() => processStore(store)))
    );
    
    // Analyze results from Promise.allSettled
    const successfulResults = results.filter(result => result.status === 'fulfilled');
    const failedResults = results.filter(result => result.status === 'rejected');
    
    // Calculate totals from actual results
    const actualTotalUploaded = successfulResults.reduce((total, result) => {
        if (result.status === 'fulfilled' && result.value) {
            return total + result.value.uploaded;
        }
        return total;
    }, 0);
    
    const actualTotalFailed = successfulResults.reduce((total, result) => {
        if (result.status === 'fulfilled' && result.value) {
            return total + result.value.failed;
        }
        return total;
    }, 0);
    
    // Summary
    console.log(`Upload Summary:`);
    console.log(`   Total stores processed: ${stores.length}`);
    console.log(`   Successful stores: ${successfulResults.length}`);
    console.log(`   Failed stores: ${failedResults.length}`);
    console.log(`   Total orders uploaded: ${actualTotalUploaded}`);
    console.log(`   Total orders failed: ${actualTotalFailed}`);
    
    // Log failed stores if any
    if (failedResults.length > 0) {
        console.log(`Failed stores:`);
        failedResults.forEach((result, index) => {
            if (result.status === 'rejected') {
                console.log(`   Store ${index + 1}: ${result.reason}`);
            }
        });
    }
    
    return {
        totalUploaded: actualTotalUploaded,
        totalFailed: actualTotalFailed,
        successfulStores: successfulResults.length,
        failedStores: failedResults.length,
        totalStores: stores.length
    };
};

const handleError = (err: any) => {
    return new Promise((resolve, reject) => {
      reject(err);
    });
}

export { getOrdersByStoreCursor, collectAllOrdersForBulkUpload };