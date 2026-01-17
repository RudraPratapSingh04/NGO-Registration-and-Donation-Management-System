import Sidebar from "../components/Sidebar";
import { useState } from "react";

import { apiFetch } from "../services/api.js";


const Donate = () => {
  const [showModal, setShowModal] = useState(false);
  const [amount, setAmount] = useState(0);
  const [error, setError] = useState("");
  function makeDonation() {
    setShowModal(true);
  }
  function handlePayment() {
    if (!amount || amount <= 0) {
      alert("Please enter a valid amount");
      return;
    }

 

    apiFetch("/api/make_donation/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ amount }),
    })
      .then((res) => {
        if (!res.ok) {
          throw new Error("Failed to create donation");
        }
        return res.json();
      })
      .then((obj) => {
        const payment = {
          sandbox: true,
          merchant_id: "Mjk0NDg1MjE3MDIxNDU0MDg1MjE3Njg2MTIyNjIxMTIwODM1Nzg2",

          return_url: "http://localhost:5173/donation-success",
          cancel_url: "http://localhost:5173/donation-cancel",
          notify_url: "http://localhost:8000/api/payhere-notify/",

          order_id: obj.order_id,
          items: "Donation",
          amount: obj.amount,
          currency: obj.currency,
          hash: obj.hash,

          first_name: obj.first_name,
          last_name: obj.last_name,
          email: obj.email,
          phone: obj.phone,
          address: obj.address,
          city: obj.city,
          country: "India",
        };

        setShowModal(false);

        if (typeof window.payhere === "undefined") {
          alert("Payment gateway not loaded. Please refresh and try again.");
          return;
        }

        window.payhere.onCompleted = function (orderId) {
          console.log("Payment completed:", orderId);
          window.location.href = "/donation-success";
        };

        window.payhere.onDismissed = function () {
          console.log("Payment dismissed");
          alert("Payment cancelled");
        };

        window.payhere.onError = function (error) {
          console.error("PayHere error:", error);
          alert("Payment failed");
        };

        window.payhere.startPayment(payment);
      })
      .catch((err) => {
        console.error(err);
        alert("Unable to initiate payment");
      });
  }
  return (
    <div className="flex min-h-screen bg-slate-50">
      <Sidebar />
      <div className="flex-1 flex justify-center items-center">
        <button
          onClick={() => makeDonation()}
          className="bg-green-500 text-white p-4 rounded-xl"
        >
          Make a Donation
        </button>
        {showModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
            <div className="bg-white p-6 rounded-lg">
              <p>Enter Amount you wish to pay</p>
              <input
                onChange={(e) => setAmount(Number(e.target.value))}
                type="number"
                className="bg-gray-200 p-2 rounded"
              />
              <div className="flex justify-between mt-4">
                <button onClick={handlePayment}>Proceed to Pay</button>
                <button onClick={() => setShowModal(false)}>Cancel</button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Donate;
