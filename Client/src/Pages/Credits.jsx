import React, { useContext, useEffect, useState } from "react";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import { AppContext } from "../Context/Appcontext";
import toast from "react-hot-toast";

// Skeleton component for Credits page
const CreditsSkeleton = () => {
  return (
    <div className="w-full h-full overflow-y-auto bg-gradient-to-br from-slate-50 via-purple-50/50 to-indigo-50 dark:from-gray-950 dark:via-purple-950/20 dark:to-gray-900">
      {/* Header Skeleton */}
      <div className="pt-16 pb-8 px-4 text-center relative overflow-hidden">
        <div className="absolute -top-20 -right-20 w-60 h-60 bg-purple-300/30 dark:bg-purple-600/20 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-20 -left-20 w-60 h-60 bg-pink-300/30 dark:bg-pink-600/20 rounded-full blur-3xl"></div>

        <div className="relative flex flex-col items-center">
          <Skeleton
            width={100}
            height={32}
            borderRadius={20}
            className="mb-4"
          />
          <Skeleton width={300} height={48} className="mb-3" />
          <Skeleton width={250} height={20} />

          <div className="mt-6">
            <Skeleton width={200} height={60} borderRadius={30} />
          </div>
        </div>
      </div>

      {/* Cards Skeleton */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="rounded-2xl border-2 border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800/50 p-6"
            >
              <div className="flex items-center gap-3 mb-4">
                <Skeleton width={48} height={48} borderRadius={12} />
                <div>
                  <Skeleton width={80} height={24} />
                  <Skeleton width={60} height={16} className="mt-1" />
                </div>
              </div>
              <Skeleton width={120} height={40} className="mb-6" />
              <div className="space-y-3 mb-6">
                <Skeleton width="100%" height={20} />
                <Skeleton width="90%" height={20} />
                <Skeleton width="95%" height={20} />
                <Skeleton width="85%" height={20} />
              </div>
              <Skeleton width="100%" height={48} borderRadius={12} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

const Credits = () => {
  const [credits, setCredits] = useState([]);
  const [loading, setLoading] = useState(true);
  const [purchaseLoading, setPurchaseLoading] = useState(null);
  const [purchasedPlanIds, setPurchasedPlanIds] = useState([]);
  const { axios, user } = useContext(AppContext);

  const fetchCredits = async () => {
    try {
      const { data } = await axios.get("/api/credit/plan", {
        withCredentials: true,
      });

      if (data.success) {
        setCredits(data.plans);
      } else {
        toast.error(data.message || "Failed to fetch plans");
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  const fetchPurchasedPlans = async () => {
    try {
      const { data } = await axios.get("/api/credit/purchased", {
        withCredentials: true,
      });

      if (data.success) {
        setPurchasedPlanIds(data.purchasedPlanIds || []);
      }
    } catch (error) {
      // User might not be logged in, silently handle
      console.log("Could not fetch purchased plans");
    }
  };

  const purchaseplans = async (planId) => {
    try {
      setPurchaseLoading(planId);
      const { data } = await axios.post(
        "/api/credit/purchase",
        { planId },
        { withCredentials: true },
      );

      if (data.success) {
        window.location.href = data.url;
      } else {
        toast.error(data.message);
        setPurchaseLoading(null);
      }
    } catch (error) {
      toast.error(error.message);
      setPurchaseLoading(null);
    }
  };

  useEffect(() => {
    const loadData = async () => {
      await Promise.all([fetchCredits(), fetchPurchasedPlans()]);
      setLoading(false);
    };
    loadData();
  }, []);

  // Check if a plan is already purchased
  const isPurchased = (planId) => purchasedPlanIds.includes(planId);

  // Show skeleton while loading
  if (loading) return <CreditsSkeleton />;

  // Helper to get plan styles
  const getPlanStyles = (planId) => {
    switch (planId) {
      case "pro":
        return {
          gradient: "from-purple-600 to-indigo-600",
          bg: "bg-gradient-to-br from-purple-50 to-indigo-50 dark:from-purple-900/30 dark:to-indigo-900/30",
          border: "border-purple-200 dark:border-purple-700/50",
          badge: "Most Popular",
          badgeColor: "bg-gradient-to-r from-purple-500 to-indigo-500",
          icon: "⚡",
        };
      case "premium":
        return {
          gradient: "from-amber-500 to-orange-500",
          bg: "bg-gradient-to-br from-amber-50 to-orange-50 dark:from-amber-900/30 dark:to-orange-900/30",
          border: "border-amber-200 dark:border-amber-700/50",
          badge: "Best Value",
          badgeColor: "bg-gradient-to-r from-amber-500 to-orange-500",
          icon: "👑",
        };
      default:
        return {
          gradient: "from-gray-600 to-gray-700",
          bg: "bg-white dark:bg-gray-800/50",
          border: "border-gray-200 dark:border-gray-700",
          badge: null,
          badgeColor: "",
          icon: "✨",
        };
    }
  };

  return (
    <div className="w-full h-full overflow-y-auto bg-gradient-to-br from-slate-50 via-purple-50/50 to-indigo-50 dark:from-gray-950 dark:via-purple-950/20 dark:to-gray-900">
      {/* Header Section */}
      <div className="pt-16 pb-8 px-4 text-center  overflow-hidden">
        <div className="relative">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-purple-100 dark:bg-purple-900/50 rounded-full mb-4">
            <span className="text-lg">💎</span>
            <span className="text-sm font-medium text-purple-700 dark:text-purple-300">
              Pricing
            </span>
          </div>

          <h1 className="text-4xl md:text-5xl font-bold text-gray-800 dark:text-white mb-3">
            Choose Your{" "}
            <span className="bg-gradient-to-r from-purple-600 to-pink-500 bg-clip-text text-transparent">
              Plan
            </span>
          </h1>

          <p className="text-gray-600 dark:text-gray-400 max-w-md mx-auto">
            Unlock the full potential of AI with our flexible credit packages
          </p>

          {/* Current Credits Display */}
          {user && (
            <div className="mt-6 inline-flex items-center gap-3 px-5 py-2.5 bg-white/80 dark:bg-gray-800/80 rounded-full shadow-lg border border-purple-200/50 dark:border-purple-700/30">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center shadow-inner">
                <span className="text-white text-lg">💎</span>
              </div>
              <div className="text-left">
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  Your Balance
                </p>
                <p className="text-xl font-bold bg-gradient-to-r from-purple-600 to-pink-500 bg-clip-text text-transparent">
                  {user.credits || 0}{" "}
                  <span className="text-sm font-normal text-gray-500">
                    credits
                  </span>
                </p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Pricing Cards */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {credits.map((plan) => {
            const styles = getPlanStyles(plan._id);
            const isLoading = purchaseLoading === plan._id;
            const purchased = isPurchased(plan._id);

            return (
              <div
                key={plan._id}
                className={`relative rounded-2xl border-2 ${styles.border} ${styles.bg} p-6 flex flex-col transition-all duration-300 hover:shadow-xl hover:-translate-y-1`}
              >
                {/* Badge */}
                {styles.badge && !purchased && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                    <span
                      className={`${styles.badgeColor} text-white text-xs font-bold px-4 py-1 rounded-full shadow-lg`}
                    >
                      {styles.badge}
                    </span>
                  </div>
                )}

                {/* Purchased Badge */}
                {purchased && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                    <span className="bg-gradient-to-r from-green-500 to-emerald-500 text-white text-xs font-bold px-4 py-1 rounded-full shadow-lg flex items-center gap-1">
                      <svg
                        className="w-3 h-3"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.857-9.809a.75.75 0 00-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 10-1.06 1.061l2.5 2.5a.75.75 0 001.137-.089l4-5.5z" />
                      </svg>
                      Purchased
                    </span>
                  </div>
                )}

                <div className="flex-1">
                  {/* Plan Icon & Name */}
                  <div className="flex items-center gap-3 mb-4">
                    <div
                      className={`w-12 h-12 rounded-xl bg-gradient-to-br ${styles.gradient} flex items-center justify-center text-2xl shadow-lg`}
                    >
                      {styles.icon}
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-gray-800 dark:text-white">
                        {plan.name}
                      </h3>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        {plan.credits} credits
                      </p>
                    </div>
                  </div>

                  {/* Price */}
                  <div className="mb-6">
                    <span className="text-4xl font-black text-gray-800 dark:text-white">
                      ₹{plan.price}
                    </span>
                    <span className="text-gray-500 dark:text-gray-400 ml-1">
                      one-time
                    </span>
                  </div>

                  {/* Features */}
                  <ul className="space-y-3 mb-6">
                    {plan.features.map((feature, idx) => (
                      <li
                        key={idx}
                        className="flex items-start gap-2 text-sm text-gray-600 dark:text-gray-300"
                      >
                        <svg
                          className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M5 13l4 4L19 7"
                          />
                        </svg>
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Buy Button or Already Purchased */}
                {purchased ? (
                  <button
                    disabled
                    className="w-full py-3 px-4 rounded-xl font-semibold text-white 
                      bg-gradient-to-r from-green-500 to-emerald-500
                      cursor-not-allowed opacity-90
                      flex items-center justify-center gap-2"
                  >
                    <svg
                      className="w-5 h-5"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.857-9.809a.75.75 0 00-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 10-1.06 1.061l2.5 2.5a.75.75 0 001.137-.089l4-5.5z" />
                    </svg>
                    Already Purchased
                  </button>
                ) : (
                  <button
                    onClick={() => purchaseplans(plan._id)}
                    disabled={isLoading}
                    className={`w-full py-3 px-4 rounded-xl font-semibold text-white 
                      bg-gradient-to-r ${styles.gradient} 
                      hover:opacity-90 hover:shadow-lg
                      disabled:opacity-50 disabled:cursor-not-allowed
                      transition-all duration-300 flex items-center justify-center gap-2`}
                  >
                    {isLoading ? (
                      <>
                        <svg
                          className="animate-spin w-5 h-5"
                          fill="none"
                          viewBox="0 0 24 24"
                        >
                          <circle
                            className="opacity-25"
                            cx="12"
                            cy="12"
                            r="10"
                            stroke="currentColor"
                            strokeWidth="4"
                          ></circle>
                          <path
                            className="opacity-75"
                            fill="currentColor"
                            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                          ></path>
                        </svg>
                        Processing...
                      </>
                    ) : (
                      <>
                        Get {plan.name}
                        <svg
                          className="w-4 h-4"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M17 8l4 4m0 0l-4 4m4-4H3"
                          />
                        </svg>
                      </>
                    )}
                  </button>
                )}
              </div>
            );
          })}
        </div>

        {/* Trust Badges */}
        <div className="mt-12 flex flex-wrap justify-center gap-6 text-sm text-gray-500 dark:text-gray-400">
          <div className="flex items-center gap-2">
            <svg
              className="w-5 h-5 text-green-500"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
              />
            </svg>
            <span>Secure Payment</span>
          </div>
          <div className="flex items-center gap-2">
            <svg
              className="w-5 h-5 text-blue-500"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M13 10V3L4 14h7v7l9-11h-7z"
              />
            </svg>
            <span>Instant Activation</span>
          </div>
          <div className="flex items-center gap-2">
            <svg
              className="w-5 h-5 text-purple-500"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
              />
            </svg>
            <span>24/7 Support</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Credits;
