import Sidebar from "../components/Sidebar";
import { useState } from "react";
import {
  Elements,
  PaymentElement,
  useStripe,
  useElements,
} from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import { apiFetch } from "../services/api.js";

const stripePromise = loadStripe(
  "pk_test_51Sqoz0PvDsmMy4UHP9SVKzLcllelPSIos9Jtph46sN80jpF2UhvKSB9cPjcTB37Ux83CIYEaiBgzyONNiUDaeLli00cEfaOiMU",
);

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
  const campaigns = [
    {
      id: 1,
      title: "Clean Water for Rural Villages",
      category: "Environment",
      description: "Installing solar-powered water pumps to provide safe drinking water to over 500 families in remote areas.",
      image: "https://images.unsplash.com/photo-1538300342682-cf57afb97285?auto=format&fit=crop&q=80&w=800",
      raised: 12500,
      goal: 15000,
      donors: 320,
    },
    {
      id: 2,
      title: "Tech Education for Kids",
      category: "Education",
      description: "Equipping underprivileged schools with laptops and coding instructors to bridge the digital divide.",
      image: "https://images.unsplash.com/photo-1509062522246-3755977927d7?auto=format&fit=crop&q=80&w=800",
      raised: 8200,
      goal: 20000,
      donors: 145,
    },
    {
      id: 3,
      title: "Emergency Medical Relief",
      category: "Healthcare",
      description: "Providing essential medical supplies and mobile clinics to conflict-affected zones.",
      image: "https://images.unsplash.com/photo-1584515933487-779824d29309?auto=format&fit=crop&q=80&w=800",
      raised: 45000,
      goal: 50000,
      donors: 1205,
    },
  ];
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
      <div className="flex-1 p-8 relative">
        <div className="flex justify-center items-center mb-8">
          <button
            onClick={makeDonation}
            className="bg-green-500 hover:bg-green-600 text-white px-6 py-2 rounded-xl font-semibold shadow-md transition-all active:scale-95"
          >
            Make a Donation
          </button>
        </div>
        <h1 className="text-4xl text-gray-600">Recent Campains</h1>
        <div className="grid pt-20 grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {campaigns.map((campaign) => (
            <div key={campaign.id} className="bg-white border border-black rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
              <img src={campaign.image} alt={campaign.title} className="w-full h-64 object-cover" />
              <div className="p-5">
                <span className="text-xs font-bold text-indigo-600 uppercase tracking-wider">{campaign.category}</span>
                <h3 className="text-xl font-bold text-gray-900 mt-1">{campaign.title}</h3>
                <p className="text-gray-600 text-sm mt-2 line-clamp-2">{campaign.description}</p>
              </div>
            </div>
          ))}
        </div>

        {showModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden">
              <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center">
                <h3 className="text-xl font-semibold text-gray-800">
                  {!clientSecret ? "Add Funds" : "Complete Payment"}
                </h3>
                <button onClick={() => { setShowModal(false); setClientSecret(null); }} className="text-gray-400 hover:text-gray-600">
                  ✕
                </button>
              </div>

              <div className="p-8">
                {!clientSecret ? (
                  <div className="space-y-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Deposit Amount</label>
                      <div className="relative">
                        <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 font-medium">₹</span>
                        <input
                          type="number"
                          className="w-full pl-8 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl outline-none text-lg font-semibold"
                          value={amount}
                          onChange={(e) => setAmount(e.target.value)}
                        />
                      </div>
                    </div>
                    <button onClick={startPayment} className="w-full bg-indigo-600 text-white font-bold py-3 rounded-xl">
                      Proceed to Checkout
                    </button>
                  </div>
                ) : (
                  <Elements stripe={stripePromise} options={{ clientSecret }}>
                    <CheckoutForm amount={amount} closeModal={() => setShowModal(false)} />
                  </Elements>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Donate;