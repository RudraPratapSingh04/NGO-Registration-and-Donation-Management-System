import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const DonationFailed = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const timer = setTimeout(() => {
      navigate("/profile");
    }, 3000);

    return () => clearTimeout(timer);
  }, [navigate]);

  return (
    <div className="flex h-screen items-center justify-center flex-col">
      <h1 className="text-2xl font-bold text-red-600">
        Donation Failed ❌
      </h1>
      <p>Redirecting to profile...</p>
    </div>
  );
};

export default DonationFailed;
