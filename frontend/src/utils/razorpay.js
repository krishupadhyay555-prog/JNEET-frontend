// ============================================================
//  JNEET+ AI — utils/razorpay.js
//  Loads Razorpay Standard Checkout only when someone clicks "Pay"
//  (never on normal pages), opens it for an order made by OUR server,
//  and hands the signed result back for server-side verification.
//  The browser never decides the amount.
// ============================================================

const SRC = "https://checkout.razorpay.com/v1/checkout.js";
let loading = null;

export function loadCheckout() {
  if (window.Razorpay) return Promise.resolve(true);
  if (loading) return loading;
  loading = new Promise((resolve) => {
    const s = document.createElement("script");
    s.src = SRC;
    s.async = true;
    s.onload = () => resolve(Boolean(window.Razorpay));
    s.onerror = () => { loading = null; resolve(false); };
    document.body.appendChild(s);
  });
  return loading;
}

export function rupees(paise) {
  return `₹${(Number(paise) / 100).toLocaleString("en-IN", { maximumFractionDigits: 0 })}`;
}

export function istDate(d) {
  return d
    ? new Date(d).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric", timeZone: "Asia/Kolkata" })
    : "";
}

// Resolves with { orderId, paymentId, signature } on success, null if
// the payer closed the window, and rejects with a message on failure.
export function openCheckout(order) {
  return new Promise((resolve, reject) => {
    let settled = false;
    const rz = new window.Razorpay({
      key: order.keyId,
      order_id: order.orderId,
      amount: order.amount,
      currency: order.currency,
      name: "JNEET+ AI",
      description: order.description,
      image: `${window.location.origin}/icon-192.png`,
      prefill: order.prefill ?? {},
      theme: { color: "#4b3fd1" },
      modal: {
        confirm_close: true,
        ondismiss: () => { if (!settled) { settled = true; resolve(null); } },
      },
      handler: (r) => {
        settled = true;
        resolve({ orderId: r.razorpay_order_id, paymentId: r.razorpay_payment_id, signature: r.razorpay_signature });
      },
    });
    rz.on("payment.failed", (resp) => {
      // Razorpay keeps the window open so the payer can retry; we only
      // report it if they give up (ondismiss) — just log the reason.
      console.warn("[pay] attempt failed:", resp?.error?.reason);
    });
    try {
      rz.open();
    } catch {
      settled = true;
      reject(new Error("Payment window couldn't open. Please try again."));
    }
  });
}
