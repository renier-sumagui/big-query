export enum OrderSellStatus {
    Ordering = 1,
    PaymentInProgress,
    Paid,
    Completed,
    PartialRefund,
    Refunded,
    Canceled
  }
  
  export enum OrderServeStatus {
    Open = 1,
    Waiting,
    Preparing,
    Ready,
    Served,
    Canceled,
    Voided
  }
  
  export enum OnlineOrderServeStatus {
    Unconfirmed = 1,
    Confirmed,
    ActionRequired,
    Preparing,
    Prepared,
    PickingUp,
    PickedUp,
    Canceled,
    Schedule
  }
  
  export enum PaymentProviders {
    CardConnect = 16,
    Stripe = 28
  }
  