import { Schema } from "mongoose";
import { OrderServeStatus } from "../constant";

const validator: any = {
    validator: Number.isInteger,
    message: '{VALUE} is not an integer value'
};

// online ordering serve status
const OO_UNCONFIRMED = 1;
const OO_CONFIRMED = 2;
const OO_ACTION_REQUIRED = 3;
const OO_PREPARING = 4;
const OO_PREPARED = 5;
const OO_PICKING_UP = 6;
const OO_PICKED_UP = 7;
const OO_CANCELED = 8;
const OO_SCHEDULE = 9;

const OrderProductsSchema = new Schema(
    {
      orderedProductId: { type: String, default: '' },
      splitProductOriginId: { type: String, default: '' },
      splitOrderIds: [{ type: String, required: true }],
      totalVariantNumber: { type: Number, default: 0 },
      isNoTax: { type: Number, default: 0 },
      negativeInventory: { type: Number, default: 0 },
      inventoryTracking: { type: Number, default: 0 },
      productImage: { type: String, default: '' },
      productName: { type: String, default: '' },
      productNames: [
        {
          _id: false,
          language: {
            type: String,
            default: ''
          },
          value: {
            type: String,
            default: ''
          }
        }
      ],
      productId: { type: String, default: '' },
      productPrintName: { type: String, default: '' },
      productPrinterNames: [
        {
          _id: false,
          language: {
            type: String,
            default: ''
          },
          value: {
            type: String,
            default: ''
          }
        }
      ],
      courseId: { type: String, default: '' },
      coursePosition: { type: Number, default: 0 },
      courseName: { type: String, default: '' },
      courseNames: [
        {
          _id: false,
          language: {
            type: String,
            default: ''
          },
          value: {
            type: String,
            default: ''
          }
        }
      ],
      numberOfSplits: { type: String, default: 1 },
      productVariantName: { type: String, default: '' },
      productVariantSKU: { type: String, default: '' },
      productVariantId: { type: String, default: '' },
      productUnitPrice: { type: Number, default: 0 },
      productTaxValue: { type: Number, default: 0 },
      productServiceChargeValue: { type: Number, default: 0 },
      productOrderDiscountValue: { type: Number, default: 0 },
      productDiscountValue: { type: Number, default: 0 },
      productCalculatedPrice: { type: Number, default: 0 },
      calculatedPricebeforeOverride:{ type: String, default: '' },
      productSellStatus: { type: Number, default: 0 },
      productServeStatus: { type: Number, default: 0 },
      productQuantity: { type: Number, default: 0 },
      productMenuId: { type: String, default: '' },
      productMenu: { type: String, default: '' },
      productMenuName: { type: String, default: '' },
      productMenuNames: [
        {
          _id: false,
          language: {
            type: String,
            default: ''
          },
          value: {
            type: String,
            default: ''
          }
        }
      ],
      productDisplayNames: [
        {
          _id: false,
          language: {
            type: String,
            default: ''
          },
          value: {
            type: String,
            default: ''
          }
        }
      ],
      printerId: [String],
      kds: [String],
      splitSeatNumbers: [Number],
      ///======================================///
      prepTime: { type: Number },
      onlineOrderServeStatus: {
        type: Number,
        min: OO_UNCONFIRMED,
        max: OO_SCHEDULE, //OO_SCHEDULE
        validate: validator
      },
      ///======================================///
      productRefund: {
        refundTransactionId: String,
        quantity: Number,
        serviceChargeAmount: Number,
        taxAmount: Number,
        totalAmount: Number,
        discountAmount: Number,
        reason: String
      },
      productDiscount: {
        authorizerId: { type: String, default: '' },
        discountName: { type: String, default: '' },
        discountValue: { type: Number, default: 0 },
        discountType: { type: Number, default: 0 },
        discountId: { type: String, default: '' }
      },
      productTax: [
        {
          _id: false,
          authorizerId: { type: String, default: '' },
          taxName: { type: String, default: '' },
          taxValue: { type: Number, default: 0 },
          taxType: { type: Number, default: 0 },
          taxId: { type: String, default: '' },
          inclusive: { type: Boolean, default: false },
          calculatedTaxAmount: { type: Number, default: 0 },
          taxApplyFor: {
            delivery: { type: Boolean, default: false },
            here: { type: Boolean, default: false },
            pickup: { type: Boolean, default: false },
            toGo: { type: Boolean, default: false },
            cashRegister: { type: Boolean, default: false },
            banquet: { type: Boolean, default: false },
            customItem: { type: Boolean, default: false },
            serviceCharge: { type: Boolean, default: false },
            onlineOrdering: { type: Boolean, default: false }
          }
        }
      ],
      productServiceCharge: [
        {
          _id: false,
          authorizerId: { type: String, default: '' },
          taxName: { type: String, default: '' },
          taxValue: { type: Number, default: 0 },
          taxType: { type: Number, default: 0 },
          taxId: { type: String, default: '' }
        }
      ],
      productCategory: {
        parentCategoryName: { type: String, default: '' },
        parentCategoryNames: [
          {
            _id: false,
            language: {
              type: String,
              default: ''
            },
            value: {
              type: String,
              default: ''
            }
          }
        ],
        parentCategoryId: { type: String, default: '' },
        categoryName: { type: String, default: '' },
        categoryNames: [
          {
            _id: false,
            language: {
              type: String,
              default: ''
            },
            value: {
              type: String,
              default: ''
            }
          }
        ],
        categoryOrder: { type: Number, default: 0 },
        categoryId: { type: String, default: '' }
      },
      productSaleCategory: {
        saleCategoryName: { type: String, default: '' },
        saleCategoryOrder: { type: Number, default: 0 },
        saleCategoryId: { type: String, default: '' }
      },
      productModifiers: [
        {
          _id: false,
          modifierId: { type: String, default: '' },
          modifierName: { type: String, default: '' },
          modifierNames: [
            {
              _id: false,
              language: {
                type: String,
                default: ''
              },
              value: {
                type: String,
                default: ''
              }
            }
          ],
          modifierPrice: { type: Number, default: 0 },
          modifierType: { type: Number, default: 0 },
          modifierGroupId: { type: String, default: '' },
          modifierGroupName: { type: String, default: '' },
          modifierGroupNames: [
            {
              _id: false,
              language: {
                type: String,
                default: ''
              },
              value: {
                type: String,
                default: ''
              }
            }
          ],
          modifierOptionId: { type: String, default: '' },
          modifierOptionName: { type: String, default: '' },
          hasMultipleOptions: { type: Boolean, default: false },
          orderTypeId: { type: [Number], default: [1, 2, 3, 4, 5, 6, 7, 8] },
          isServable: { type: Boolean, default: false },
          quantity: { type: Number },
          modifierServeStatus: { type: Number, default: OrderServeStatus.Waiting },
          printerId: [String],
          kdsIds: [String],
        }
      ],
      productIngredients: [
        {
          _id: false,
          ingredientId: { type: String, default: '' },
          ingredientName: { type: String, default: '' },
          ingredientType: { type: Number, default: 1 },
          ingredientPrice: { type: Number, default: 0 },
          ingredientValue: { type: String, default: '' }
        }
      ],
      promoCode: {
        id: { type: String, default: '' },
        name: { type: String, default: '' },
        value: { type: Number, default: 0 }
      },
      promoCodeAmount: { type: Number, default: 0 },
      note: { type: String, default: '' },
      waitingToBePreparedAt: { type: Number, default: 0 },
      fireTime: { type: Number, default: 0 },
      totalProductPreparationTime: { type: Number, default: 0 },
      toaToFireTime: { type: Number, default: 0 },
      fireToSeenTime: { type: Number, default: 0 },
      seenToReadyTime: { type: Number, default: 0 },
      readyToServedTime: { type: Number, default: 0 },
      servedToCloseTime: { type: Number, default: 0 },
      beingPreparedAt: { type: Number, default: 0 },
      timeOfArrival: { type: Number, default: 0 },
      readyAt: { type: Number, default: 0 },
      servedAt: { type: Number, default: 0 },
      cancelledAt: { type: Number, default: 0 },
      cancelReason: { type: String, default: '' },
      voidedAt: { type: Number, default: 0 },
      specialEventId: { type: String, default: '' },
      specialEventName: { type: String, default: '' },
      specialEventAdjustedPrice: { type: Number, default: 0 },
      giftCardNumber: { type: String, default: '' },
      giftCardType: { type: Number, default: 0 },
      itemizedPrint: { type: Boolean, default: false },
    },
    { _id: false }
)

export { OrderProductsSchema }