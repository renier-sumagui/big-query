import mongoose, { Schema } from "mongoose";
import { OrderProductsSchema } from "./orderProducts/orderProductSchema";
import { orders } from "../../services/mongo";

const ObjectId = mongoose.Schema.Types.ObjectId

// STATUS
const SOFT_DELETED = 0
const ACTIVE = 1
const INACTIVE = 2

// SYNC STATUS
const NOT_SYNC = 0
const LOCAL_SYNC = 1
const CLOUD_SYNC = 2

// Sell STATUS
const ORDERING = 1
const PAYMENT_IN_PROGRESS = 2
const PAID = 3
const COMPLETED = 4
const PARTIAL_REFUND = 5
const REFUNDED = 6
const CANCELED = 7
const CUSTOM_REFUND = 8
const VOID = 9
const MUTLI = 10

// Serving STATUS
const OPEN = 1
const WAITING = 2
const PREPARING = 3
const READY = 4
const SERVED = 5
const CANCELLED = 6
const VOIDED = 7

// Order Type
const RESTAURANT = 1
const BAR = 2
const TAKEOUT = 3
const APP = 4
const DELIVERY = 5
const AHEAD = 6
const BANQUET = 7
const ONLINE_ORDERING = 8
const SQUARE = 9
const DRIVEIN = 10
// const NOTAX = 8

// online ordering types
const OO_DELIVERY = 1
const OO_SELF_PICKED = 2
const OO_CURBSIDE_PICKED = 3
const OO_DINE_IN = 4
const OO_UBER_EATS = 5
const OO_GRUB_HUB = 6
const OO_BITESSQUAD = 7
const OO_ZUPPLER = 8
const OO_CHOWNOW = 9
const OO_LOVETT = 10
const OO_PALETTE = 11
const OO_HUNGRYPANDA = 12
const OO_CAVIAR = 13
const OO_POSTMATES = 14
const OO_DOORDASH = 15
const OO_PHONE = 16
const OO_ZOMATO = 17
const OO_SWIGGY = 18
const OO_DUNZO = 19
const OO_DOTPE = 20
const OO_AMAZON = 21
const OO_JAHEZ = 22
const OO_TALABAT = 23
const OO_CAREEM = 24
const OO_DELIVEROO = 25
const OO_JUSTEAT = 26
const OO_HUNGERSTATION = 27
const OO_MRSOOL = 28
const OO_RADYES = 29
const OO_NOONFOOD = 30
const OO_EAZYDINER = 31
const OO_INRESTO = 32
const OO_MAGICPIN = 33
const OO_GUPSHUP = 34
const OO_CHATFOOD = 35
const OO_EATEASY = 36
const OO_UENGAGE = 37
const OO_BITSILA = 38
const OO_MASALABOX = 39
const OO_TIPPLR = 40
const OO_REZOY = 41
const OO_DROPTHEQ = 42
const OO_NEXTDOORHUB = 43
const OO_FIDOO = 44
const OO_HUNGERBOX = 45
const OO_PEPPO = 46
const OO_THRIVE = 47
const OO_SWIGGYSTORE = 48
const OO_ISTHARA = 49
const OO_INSTASHOP = 50
const OO_TOYOU = 51
const OO_DCA = 52
const OO_ORDABLE = 53
const OO_BEANZ = 54
const OO_CARI = 55
const OO_SMILES = 56
const OO_THECHEFZ = 57

// online ordering serve status
export const OO_UNCONFIRMED = 1
export const OO_CONFIRMED = 2
export const OO_ACTION_REQUIRED = 3
export const OO_PREPARING = 4
export const OO_PREPARED = 5
export const OO_PICKING_UP = 6
export const OO_PICKED_UP = 7
export const OO_CANCELED = 8
export const OO_SCHEDULE = 9
export const OO_DIVIDED_SCHEDULE = 10
export const OO_DELIVER = 11
// New statuses for delivery tracking
export const OO_PLACED = 12
export const OO_PENDING = 13
export const OO_IN_PROGRESS = 14
export const OO_READY_FOR_PICKUP = 15
export const OO_OUT_FOR_DELIVERY = 16
export const OO_ON_THE_WAY = 17
export const OO_NEARBY = 18
export const OO_ALMOST_THERE = 19
export const OO_ATTEMPTED_DELIVERY = 20
export const OO_DELAYED = 21
export const OO_AWAITING_PICKUP = 22
export const OO_REFUNDED = 23


// Service Type
const QUICK_SERVICE = 1
const TABLE_SERVICE = 2

//alert Type
const SMS = 0
const EMAIL = 1

const validator: any = {
    validator: Number.isInteger,
    message: '{VALUE} is not an integer value'
};

interface PluginSetNext extends Document {
    _id: typeof ObjectId
    isFirebase: boolean
    fromDevice: boolean,
    fromMongo: boolean,
    setNext: Function
    guestsNumber: Number
    driverId: String
    customerId: String
    customerFirstName: String
    customerLastName: String
    customerMobile: String
    customerEmail: String
    customerAddress: {
      _id: false
      customerAddress1: String
      customerAddress2: String
      customerCity: String
      customerState: String
      customerZip: String
    }
    deliveryAddressId: String
    splitOrderType: Number
    splitOrderList: [String]
    isLastSplit: Number
    isSplitLocked: Number
    parentId: String
    orderName: String
    orderNumberSuffix: String
    orderNumber: Number
    offlineOrderNumber: Number
    isOffline: Number
    tableId: String
    serverId: String
    serverJobtype: String
    cancelReason: String
    externalId: String
    readyTime: Number
    prepareStartAt: Number
    prepTime: Number
    isScheduled: Boolean
    scheduleTime: Number
    toaToFireTime: Number
    fireToSeenTime: Number
    seenToReadyTime: Number
    readyToServedTime: Number
    servedToCloseTime: Number
    issues: [String]
    orderSellStatus: Number
    orderServeStatus: Number
    onlineOrderServeStatus: Number
    orderType: Number
    onlineOrderType: Number
    serviceName: String
    serviceId: String
    shiftId: String
    shiftName: String
    scheduleId: String
    scheduleName: String
    weekDay: String
    serviceType: Number
    timeOfArrival: Number
    notes: String
    curbsideNotes: String
    paymentId: String
    reservationId: String
    subTotalAmount: Number
    refundedAmount: Number
    actualPaidAmount: Number
    totalAmount: Number
    taxAmount: Number
    tipAmount: Number
    serviceChargeAmount: Number
    orderServiceCharge: {
      authorizerId: String
      serviceChargeName: String
      serviceChargeValue: Number
      serviceChargeType: Number
      serviceChargeId: String
      asTips: Boolean
      appliedAs: String
      applicableTaxIds: Array<String>
    }
    discountAmount: Number
    generalDiscountAmount: Number
    deliveryAmount: Number
    receiptEmail: String
    receiptPhone: String
    globalDiscount: {
      authorizerId: String
      discountName: String
      discountValue: Number
      discountType: Number
      discountId: String
    }
    revenueCenterId: String
    trackerId: String
    orderGiftCard: [
      {
        _id: false
        givexNumber: Number
        amount: Number
        type: Number
        pin: Number
        seat: Number
      }
    ]
    seats: [
      {
        seatName: String
        seatNumber: String
        customerId: String
        customerName: String
        orderProducts: [typeof OrderProductsSchema]
      }
    ]
    originId: String
    squareId: String
    isSyncedMarketMan: Number
    waitingToBePreparedAt: Number
    totalProductPreparationTime: Number
    beingPreparedAt: Number
    readyAt: Number
    servedAt: Number
    cancelledAt: Number
    voidedAt: Number
    merchantId: String
    storeId: String
    deviceId: String
    createdEmployeeId: String
    updatedEmployeeId: String
    createdAt: Number
    updatedAt: Number
    isExternal: Boolean
    date: String
    seatCount: Number
    originalOrder: String
    isReplaced: Boolean
    deliveryExtras: Boolean
    deliveryUtensils: Boolean
    CalculatedPrice: String
    hasTipped: Boolean
    requiredPayment: Boolean,
    isDiscountFiredNotificationSent: Boolean,
    sevenshiftId: String,
    otter: { orderDetails: object },
    urbanpiper: { orderDetails: object },
    promoCode: {
      id: String
      name: String
      value: String
      type: Number
    },
    vehicleDetails: {
      vehicleNumber: String,
      vehicleType: String,
      vehicleColor: String,
      vehicleBrand: String,
    },
    kitchenhub: {
      orderId: String
      externalId: String
      deliveryProviderId: String
      number: String
      dailyNumber: Number,
      kitchenHubOrderDetails: Object
  
    }
    promoCodeAmount: Number
    olo: {
      delivery: String
      quote: String
      deliveryProvider: String
      ticket: Boolean
    }
    doorDash: {
      deliveryId: String,
      deliveryDetails: Object
    }
    serviceFee: {
      paymentIntentId: String
      paymentProvider: Number
      tip: Number
      serviceFee: Number
      comision: Number
      delivery: Number
      captured: Number
    }
    isLoyalty: Boolean,
    isOrderHistory: Boolean,
    subsidy: {
      type: Number
      eatos: Number
      merchant: Number
      customer: Number
    }
    isTizen: { type: Boolean, default: false },
    tizenPrint: { type: Boolean, default: false },
    orderServeType: String
    status: Number
    isSync: Number
    created_at: Number
    updated_at: Number
};

const Order = new Schema<PluginSetNext>(
    {
      _id: { type: ObjectId, auto: true },
      isFirebase: { type: Boolean, default: false },
      fromDevice: { type: Boolean, default: false },
      fromMongo: { type: Boolean, default: true },
      guestsNumber: {
        type: Number,
        default: 1
      },
      driverId: { type: String, default: '' },
      customerId: { type: String, default: '' },
      customerFirstName: { type: String, default: '' },
      customerLastName: { type: String, default: '' },
      customerMobile: { type: String, default: '' },
      customerEmail: { type: String, default: '' },
      customerAddress: {
        _id: false,
        customerAddress1: { type: String, default: '' },
        customerAddress2: { type: String, default: '' },
        customerCity: { type: String, default: '' },
        customerState: { type: String, default: '' },
        customerZip: { type: String, default: '' }
      },
      deliveryAddressId: { type: String, default: '' },
      splitOrderType: { type: Number, default: 1 },
      splitOrderList: [{ type: String, required: true }],
      isLastSplit: { type: Number, enum: [0, 1] },
      isSplitLocked: { type: Number, enum: [1, 2, 3] },
      parentId: { type: String, default: '' },
      orderName: { type: String, default: '' },
      orderNumberSuffix: { type: String, default: '' },
      orderNumber: { type: Number },
      offlineOrderNumber: { type: Number },
      isOffline: { type: Number, default: 0 },
      tableId: { type: String, default: '' },
      serverId: { type: String, default: '' },
      serverJobtype: { type: String, default: '' },
      cancelReason: { type: String, default: '' },
      externalId: { type: String, default: '' },
      readyTime: { type: Number },
      prepareStartAt: { type: Number },
      prepTime: { type: Number },
      isScheduled: {
        type: Boolean,
        default: false
      },
      scheduleTime: {
        type: Number,
        default: 0
      },
      issues: [{ type: String }],
      orderSellStatus: {
        type: Number,
        min: ORDERING,
        max: MUTLI,
        default: ORDERING,
        validate: validator
      },
      orderServeStatus: {
        type: Number,
        min: OPEN,
        max: VOIDED,
        default: OPEN,
        validate: validator
      },
      onlineOrderServeStatus: {
        type: Number,
        min: OO_UNCONFIRMED,
        max: OO_DELIVER,
        validate: validator
      },
      orderType: {
        type: Number,
        min: RESTAURANT,
        max: DRIVEIN,
        default: RESTAURANT,
        validate: validator
      },
      onlineOrderType: {
        type: Number,
        min: OO_DELIVERY,
        max: OO_EATEASY,
        validate: validator
      },
      isExternal: { type: Boolean, default: false },
      serviceName: { type: String, default: 'Others' },
      serviceId: { type: String, default: '' },
      shiftId: { type: String, default: '' },
      shiftName: { type: String, default: 'Others' },
      scheduleId: { type: String, default: '' },
      scheduleName: { type: String, default: 'Others' },
      weekDay: { type: String, default: 'Others' },
      serviceType: {
        type: Number,
        min: QUICK_SERVICE,
        max: TABLE_SERVICE,
        default: QUICK_SERVICE,
        validate: validator
      },
      timeOfArrival: { type: Number, default: 0 },
      toaToFireTime: { type: Number, default: 0 },
      fireToSeenTime: { type: Number, default: 0 },
      seenToReadyTime: { type: Number, default: 0 },
      readyToServedTime: { type: Number, default: 0 },
      servedToCloseTime: { type: Number, default: 0 },
      notes: { type: String, default: '' },
      curbsideNotes: { type: String, default: '' },
      paymentId: { type: String, default: '' },
      reservationId: { type: String, default: null },
      subTotalAmount: { type: Number, default: 0 },
      refundedAmount: { type: Number, default: 0 },
      actualPaidAmount: { type: Number, default: 0 },
      totalAmount: { type: Number, default: 0 },
      taxAmount: { type: Number, default: 0 },
      tipAmount: { type: Number, default: 0 },
      serviceChargeAmount: { type: Number, default: 0 },
      orderServiceCharge: {
        authorizerId: { type: String, default: '' },
        serviceChargeName: { type: String, default: '' },
        serviceChargeValue: { type: Number, default: 0 },
        serviceChargeType: { type: Number, default: 0 },
        serviceChargeId: { type: String, default: '' },
        asTips: { type: Boolean, default: false },
        appliedAs: { type: String, default: '' },
        applicableTaxIds: { type: Array, default: [] }
      },
      discountAmount: { type: Number, default: 0 },
      generalDiscountAmount: { type: Number, default: 0 },
      deliveryAmount: { type: Number, default: 0 },
      receiptEmail: { type: String, default: '' },
      receiptPhone: { type: String, default: '' },
      globalDiscount: {
        authorizerId: { type: String, default: '' },
        discountName: { type: String, default: '' },
        discountValue: { type: Number, default: 0 },
        discountType: { type: Number, default: 0 },
        discountId: { type: String, default: '' }
      },
      revenueCenterId: { type: String, default: '' },
      trackerId: { type: String, default: '' },
      orderGiftCard: [
        {
          _id: false,
          givexNumber: { type: Number, default: 0 },
          amount: { type: Number, default: 0 },
          type: { type: Number, default: 0 },
          pin: { type: Number, default: 0 },
          seat: { type: Number, default: 0 }
        }
      ],
      seats: [
        {
          seatName: { type: String, default: '' },
          seatNumber: { type: Number, default: 0 },
          customerId: { type: String, default: '' },
          customerName: { type: String, default: '' },
          orderProducts: [OrderProductsSchema]
        }
      ],
      originId: { type: String, default: '0' },
      squareId: { type: String, required: false },
      isSyncedMarketMan: { type: Number, default: 0 },
      waitingToBePreparedAt: { type: Number, default: 0 },
      beingPreparedAt: { type: Number, default: 0 },
      readyAt: { type: Number, default: 0 },
      servedAt: { type: Number, default: 0 },
      cancelledAt: { type: Number, default: 0 },
      voidedAt: { type: Number, default: 0 },
      merchantId: { type: String, required: true },
      storeId: { type: String, required: true },
      deviceId: { type: String, default: '' },
      createdEmployeeId: { type: String, default: '' },
      updatedEmployeeId: { type: String, default: '' },
      createdAt: { type: Number, default: () => Math.floor(Date.now() / 1000) },
      updatedAt: { type: Number, default: () => Math.floor(Date.now() / 1000) },
      date: { type: String },
      seatCount: { type: Number },
      originalOrder: { type: String, default: '' },
      isReplaced: { type: Boolean, default: false },
      deliveryExtras: { type: Boolean, default: false },
      deliveryUtensils: { type: Boolean, default: false },
      CalculatedPrice: { type: String },
      hasTipped: { type: Boolean, default: false },
      requiredPayment: { type: Boolean, default: false },
      isDiscountFiredNotificationSent: { type: Boolean, default: false },
      sevenshiftId: { type: String },
      promoCode: {
        id: { type: String, default: '' },
        name: { type: String, default: '' },
        value: { type: Number, default: 0 },
        type: { type: Number }
      },
      vehicleDetails: {
        vehicleNumber: { type: String, default: '' },
        vehicleType: { type: String, default: '' },
        vehicleColor: { type: String, default: '' },
        vehicleBrand: { type: String, default: '' },
      },
      promoCodeAmount: { type: Number, default: 0 },
      kitchenhub: {
        orderId: { type: String, default: 0 },
        externalId: { type: String, default: '' },
        deliveryProviderId: { type: String, default: '' },
        number: { type: String, default: '' },
        dailyNumber: { type: Number, default: 0 },
        kitchenHubOrderDetails: { type: Object, default: {} }
      },
      olo: {
        delivery: { type: String, default: '' },
        quote: { type: String, default: '' },
        deliveryProvider: { type: String, default: '' },
        ticket: { type: Boolean, default: false }
      },
      doorDash: {
        deliveryId: { type: String, default: '' },
        deliveryDetails: { type: Object, default: {} }
      },
      serviceFee: {
        paymentIntentId: { type: String, default: '' },
        paymentProvider: { type: Number, default: 0 },
        tip: { type: Number, default: 0 },
        serviceFee: { type: Number, default: 0 },
        comision: { type: Number, default: 0 },
        delivery: { type: Number, default: 0 },
        captured: { type: Boolean, default: false }
      },
      isLoyalty: { type: Boolean, default: false },
      isOrderHistory: { type: Boolean, default: false },
      subsidy: {
        type: { type: Number, default: 0 },
        eatos: { type: Number, default: 0 },
        merchant: { type: Number, default: 0 },
        customer: { type: Number, default: 0 }
      },
      orderServeType: { type: String, default: '' },
      otter: { type: Object },
      urbanpiper: { type: Object },
      status: {
        type: Number,
        min: SOFT_DELETED,
        max: INACTIVE,
        default: ACTIVE,
        validate: validator
      },
      tizenPrint: { type: Boolean, default: false },
      isTizen: { type: Boolean, default: false },
      isSync: {
        type: Number,
        min: NOT_SYNC,
        max: CLOUD_SYNC,
        default: CLOUD_SYNC,
        validate: validator
      },
      created_at: { type: Number },
      updated_at: { type: Number }
    },
    {
      timestamps: {
        createdAt: 'created_at',
        updatedAt: 'updated_at',
        currentTime: () => Math.floor(Date.now() / 1000)
      }
    }
);

Order.set('toJSON', {
    transform(doc, ret, options) {
      ret.orderId = ret._id.toString();
      ret.orderNumber = ret.orderNumber //.toString()
      delete ret._id
      delete ret.__v
      delete ret.isSync
      delete ret.orders_embedding
      // Set isTizen to false when orderSellStatus is != 4
      // if (ret.orderSellStatus != 4) {
      //   ret.isTizen = false;
      // }
    }
});

Order.set('toObject', {
    transform(doc, ret, options) {
      delete ret.__v
      // Uncomment this line for testing purposes. Probably mobile device expects orderNumber to be string
      // ret.orderNumber = ret.orderNumber.toString()
    }
});

// const OrderModel = mongoose.model("Order", Order);
const OrderModel = orders.connection.model('Order', Order);

export { OrderModel };