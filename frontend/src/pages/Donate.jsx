import Sidebar from "../components/Sidebar";
import { useState } from "react"

import  { apiFetch } from "../services/api.js";
// function makeDonation(id) {
//   fetch(`http://localhost:8000/api/create-donation/?id=${id}`)
//     .then((res) => res.json())
//     .then((obj) => {
//       const payment = {
//         sandbox: true,
//         merchant_id: "YOUR_MERCHANT_ID",
//         return_url: "http://localhost:3000/donation-success",
//         cancel_url: "http://localhost:3000/donation-cancel",
//         notify_url: "https://your-backend.com/api/payhere-notify/",

//         order_id: obj.order_id,
//         items: obj.items,
//         amount: obj.amount,
//         currency: obj.currency,
//         hash: obj.hash,

//         first_name: obj.first_name,
//         last_name: obj.last_name,
//         email: obj.email,
//         phone: obj.phone,
//         address: obj.address,
//         city: obj.city,
//         country: "Sri Lanka",
//       };

//       payhere.onCompleted = function (orderId) {
//         console.log("Payment completed. OrderID:", orderId);
//         window.location.href = "/donation-success";
//       };

//       payhere.onDismissed = function () {
//         console.log("Payment dismissed");
//       };

//       payhere.onError = function (error) {
//         console.log("PayHere Error:", error);
//       };

//       payhere.startPayment(payment);
//     })
//     .catch((err) => console.error(err));
// }

const Donate = () => {
const [showModal, setShowModal] = useState(false);
const [amount, setAmount] = useState(0);
const [error,setError]=useState("");
function makeDonation() {
  setShowModal(true);
}
function handlePayment() {
  if (!amount || amount <= 0) {
    alert("Please enter a valid amount");
    return;
  }

//   apiFetch("make_donation/", {
//     method: "POST",
//     credentials: "include",
//     headers: {
//       "Content-Type": "application/json",
//     },
//     body: JSON.stringify({ amount }),
//   })
//     .then((res) => {
//       if (!res.ok) {
//         throw new Error("Failed to create donation");
//       }
//       return res.json();
//     })
//     .then((obj) => {
//       const payment = {
//         sandbox: true,
//         merchant_id: "Mjk0NDg1MjE3MDIxNDU0MDg1MjE3Njg2MTIyNjIxMTIwODM1Nzg2",

//         return_url: "http://localhost:5173/donation-success",
//         cancel_url: "http://localhost:5173/donation-cancel",
//         notify_url: "https://localhost:8000/api/payhere-notify/",

//         order_id: obj.order_id,
//         items: "Donation",
//         amount: obj.amount,
//         currency: obj.currency,
//         hash: obj.hash,

//         first_name: obj.first_name,
//         last_name: obj.last_name,
//         email: obj.email,
//         phone: obj.phone,
//         address: obj.address,
//         city: obj.city,
//         country: "India",
//       };

//       setShowModal(false);

//       payhere.onCompleted = function (orderId) {
//         console.log("Payment completed:", orderId);
//         // DO NOT mark success here
//         window.location.href = "/donation-success";
//       };

//       payhere.onDismissed = function () {
//         console.log("Payment dismissed");
//         alert("Payment cancelled");
//       };

//       payhere.onError = function (error) {
//         console.error("PayHere error:", error);
//         alert("Payment failed");
//       };

//       payhere.startPayment(payment);
//     })
//     .catch((err) => {
//       console.error(err);
//       alert("Unable to initiate payment");
//     });
// }

apiFetch("http://localhost:8000/api/make_donation/", {
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
    payhere.startPayment(payment);
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
              onChange={(e)=>setAmount(e.target.value)}
              type="number" className="bg-gray-200 p-2 rounded" />
              <div className="flex justify-between mt-4">
                <button
                onClick={handlePayment}
                >Proceed to Pay</button>
                <button
                onClick={() => setShowModal(false)}
                >Cancel</button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Donate;
