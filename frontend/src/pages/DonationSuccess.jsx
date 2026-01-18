import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const DonationSuccess = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const timer = setTimeout(() => {
      navigate("/profile");
    }, 3000);

    return () => clearTimeout(timer);
  }, [navigate]);

  return (
    <div className="flex h-screen items-center justify-center flex-col">
      <h1 className="text-2xl font-bold text-green-600">
        Donation Successful 🎉
      </h1>
      <p>Redirecting to profile...</p>
    </div>
  );
};

export default DonationSuccess;
