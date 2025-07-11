const { Cashfree } = require("cashfree-pg");

// Initialize client in v5 style
const cashfree = new Cashfree(
  Cashfree.SANDBOX, // or Cashfree.PRODUCTION
  process.env.CASHFREE_CLIENT_ID,
  process.env.CASHFREE_CLIENT_SECRET
);

exports.createOrder = async (orderId, orderAmount, orderCurrency, customerID, customerPhone) => {
  try {
    const expiry = new Date(Date.now() + 60 * 60 * 1000).toISOString();

    const request = {
      order_id: orderId,
      order_amount: orderAmount,
      order_currency: orderCurrency,
      customer_details: { customer_id: customerID, customer_phone: customerPhone },
      order_meta: { return_url: `http://localhost:3000/payment-status/${orderId}` },
      order_expiry_time: expiry,
    };

    const response = await cashfree.PGCreateOrder(request);
    console.log("✅ Order Created:", response.data);
    return response.data.payment_session_id;
  } catch (err) {
    console.error("❌ Error creating order:", err.message);
    throw err;
  }
};

exports.getPaymentStatus = async (orderId) => {
  try {
    const response = await cashfree.PGFetchOrder(orderId);
    const data = response.data;

    if (data.payment_status === "PAID") return "Success";
    if (data.payment_status === "PENDING") return "Pending";
    return "Failure";
  } catch (err) {
    console.error("❌ Error fetching status:", err.message);
    throw err;
  }
};
