import Sidebar from "../components/Sidebar";
import { useState } from "react";
import { Elements, PaymentElement, useStripe, useElements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import { apiFetch } from "../services/api.js";

const stripePromise = loadStripe("pk_test_51Sqoz0PvDsmMy4UHP9SVKzLcllelPSIos9Jtph46sN80jpF2UhvKSB9cPjcTB37Ux83CIYEaiBgzyONNiUDaeLli00cEfaOiMU");

function CheckoutForm({ amount, closeModal }) {
  const stripe = useStripe();
  const elements = useElements();
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!stripe || !elements) return;
    setLoading(true);
    const { error } = await stripe.confirmPayment({
      elements,
      confirmParams: {
        return_url: "http://localhost:5173/donation-success",
      },
    });

    if (error) {
      window.location.href = "/donation-failed";
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <PaymentElement />
      <div className="flex justify-between mt-4">
        <button
          type="submit"
          disabled={!stripe || loading}
          className="bg-green-500 text-white px-4 py-2 rounded"
        >
          {loading ? "Processing..." : "Pay ₹{amount}"}
        </button>
        <button
          type="button"
          onClick={closeModal}
          className="bg-gray-400 px-4 py-2 rounded"
        >
          Cancel
        </button>
      </div>
    </form>
  );
}

const Donate = () => {
  const [showModal, setShowModal] = useState(false);
  const [amount, setAmount] = useState("");
  const [clientSecret, setClientSecret] = useState(null);

  const makeDonation = () => {
    setShowModal(true);
  };

  const startPayment = async () => {
    if (!amount || amount <= 0) {
      alert("Enter a valid amount");
      return;
    }
    try {
      const res = await apiFetch("/api/create-payment-intent/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ amount }),
      });
      if (!res.ok) throw new Error("Failed to create payment");
      const data = await res.json();
      setClientSecret(data.clientSecret);
    } catch {
      alert("Unable to initiate payment");
    }
  };
      
  return (
    <div className="flex min-h-screen bg-slate-50">
      <Sidebar />

      <div className="flex-1 flex justify-center items-center">
        <button
          onClick={makeDonation}
          className="bg-green-500 text-white p-4 rounded-xl"
        >
          Make a Donation
        </button>

        {showModal && (
  <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
    <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden transform transition-all">
      
      <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center">
        <h3 className="text-xl font-semibold text-gray-800">
          {!clientSecret ? "Add Funds" : "Complete Payment"}
        </h3>
        <button 
          onClick={() => setShowModal(false)}
          className="text-gray-400 hover:text-gray-600 transition-colors"
        >
          ✕
        </button>
      </div>

      <div className="p-8">
        {!clientSecret ? (
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Deposit Amount
              </label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 font-medium">₹</span>
                <input
                  type="number"
                  placeholder="0.00"
                  className="w-full pl-8 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all text-lg font-semibold"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                />
              </div>
            </div>

            <div className="flex flex-col gap-3">
              <button
                onClick={startPayment}
                className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 px-6 rounded-xl transition-all active:scale-[0.98]"
              >
                Proceed to Checkout
              </button>
              <button
                onClick={() => setShowModal(false)}
                className="w-full bg-red-500 hover:bg-red-600 text-white font-medium py-2 px-6 rounded-xl transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        ) : (
          <div className="animate-in slide-in-from-right-4 duration-300">
            <Elements stripe={stripePromise} options={{ clientSecret }}>
              <CheckoutForm
                amount={amount}
                closeModal={() => setShowModal(false)}
              />
            </Elements>
          </div>
        )}
      </div>
    </div>
  </div>
)}
      </div>
    </div>
  );
}
export default Donate;