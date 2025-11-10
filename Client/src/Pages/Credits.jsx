import React, { useEffect, useState } from "react";
import { dummyPlans } from "../assets/assets";
import Loading from "./Loading";

// ...existing code...
const Credits = () => {
  const [credits, setCredits] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchCredits = async () => {
    // simulated fetch — replace with real API call if needed
    setCredits(dummyPlans);
    setLoading(false);
  };

  useEffect(() => {
    fetchCredits();
  }, []);

  if (loading) return <Loading />;

  return (
    <div className="max-w-7xl h-screen overflow-y-scroll mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h2 className="text-2xl font-black text-center mb-10 text-gray-800 dark:text-white">
        Credits Plans
      </h2>

      <div className="flex flex-wrap justify-center p-3 gap-4 ">
        {credits.map((plan) => (
          <div
            key={plan._id}
            className={`border border-black rounded-lg dark:border-purple-900 shadow hover:shadow-lg transition-transform  p-6 min-w-[300px] flex flex-col ${
              plan._id == "pro"
                ? "bg-purple-200 dark:bg-purple-900"
                : "bg-gray-200 dark:bg-transparent"
            }`}
          >
            <div className="flex-1">
              <h3 className="text-xl font-semibold mb-2 text-gray-800 dark:text-white">
                {plan.name}
              </h3>

              <p className="text-2xl font-semibold mb-4 text-purple-600 dark:text-purple-300 ">
                {" "}
                ₹{plan.price}{" "}
                <span className="text-base font-normal text-gray-600 dark:text-purple-200">
                  / {plan.credits} credits
                </span>{" "}
              </p>

              <ul className="list-disc list-inside mb-2 text-gray-600 dark:text-purple-200">
                {plan.features.map((feature, idx) => (
                  <li key={idx}>{feature}</li>
                ))}
              </ul>

              <button className="px-4 py-2 bg-purple-600 hover:bg-purple-800 text-white rounded-lg w-full  ">
                Buy Now
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Credits;
