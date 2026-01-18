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
          <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
            <div className="bg-white p-6 rounded-lg w-[400px]">
              {!clientSecret ? (
                <>
                  <p className="mb-2">Enter Amount</p>
                  <input
                    type="number"
                    className="bg-gray-200 p-2 rounded w-full"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                  />
                  <div className="flex justify-between mt-4">
                    <button
                      onClick={startPayment}
                      className="bg-green-500 text-white px-4 py-2 rounded"
                    >
                      Proceed
                    </button>
                    <button
                      onClick={() => setShowModal(false)}
                      className="bg-gray-400 px-4 py-2 rounded"
                    >
                      Cancel
                    </button>
                  </div>
                </>
              ) : (
                <Elements stripe={stripePromise} options={{ clientSecret }}>
                  <CheckoutForm
                    amount={amount}
                    closeModal={() => setShowModal(false)}
                  />
                </Elements>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Donate;
