import React, { useContext, useEffect, useState } from "react";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import { AppContext } from "../Context/Appcontext";
import toast from "react-hot-toast";

// Skeleton component for Community page
const CommunitySkeleton = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-purple-50/50 to-indigo-50 dark:from-gray-950 dark:via-purple-950/20 dark:to-gray-900">
      {/* Header Skeleton */}
      <div className="pt-16 pb-8 px-4 text-center relative overflow-hidden">
        <div className="absolute -top-20 -right-20 w-60 h-60 bg-purple-300/30 dark:bg-purple-600/20 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-20 -left-20 w-60 h-60 bg-pink-300/30 dark:bg-pink-600/20 rounded-full blur-3xl"></div>

        <div className="relative flex flex-col items-center">
          <Skeleton width={100} height={32} borderRadius={20} className="mb-4" />
          <Skeleton width={350} height={48} className="mb-3" />
          <Skeleton width={300} height={20} />

          {/* Stats skeleton */}
          <div className="flex justify-center gap-6 mt-6">
            <div className="text-center">
              <Skeleton width={50} height={32} />
              <Skeleton width={60} height={16} className="mt-1" />
            </div>
            <div className="text-center">
              <Skeleton width={50} height={32} />
              <Skeleton width={60} height={16} className="mt-1" />
            </div>
          </div>
        </div>
      </div>

      {/* Gallery Skeleton */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {[...Array(10)].map((_, i) => (
            <div key={i} className="rounded-2xl overflow-hidden bg-white dark:bg-gray-800 shadow-md">
              <Skeleton
                height={0}
                style={{ paddingBottom: '100%' }}
                className="aspect-square"
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

const Community = () => {
  const [content, setContent] = useState([]);
  const [loading, setLoading] = useState(true);
  const { axios } = useContext(AppContext);

  const fetchContent = async () => {
    try {
      const { data } = await axios.get("/api/auth/published-images");
      if (data.success) {
        setContent(data.images);
      } else {
        toast.error(data.message || "Failed to load community images");
      }
    } catch (error) {
      toast.error(error.response?.data?.message || error.message || "Failed to load community images");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchContent();
  }, []);

  // Show skeleton while loading
  if (loading) return <CommunitySkeleton />;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-purple-50/50 to-indigo-50 dark:from-gray-950 dark:via-purple-950/20 dark:to-gray-900">
      {/* Header Section */}
      <div className="pt-16 pb-8 px-4 text-center relative overflow-hidden">
        {/* Decorative blobs */}
        <div className="absolute -top-20 -right-20 w-60 h-60 bg-purple-300/30 dark:bg-purple-600/20 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-20 -left-20 w-60 h-60 bg-pink-300/30 dark:bg-pink-600/20 rounded-full blur-3xl"></div>

        <div className="relative">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-purple-100 dark:bg-purple-900/50 rounded-full mb-4">
            <span className="w-2 h-2 bg-purple-500 rounded-full animate-pulse"></span>
            <span className="text-sm font-medium text-purple-700 dark:text-purple-300">AI Gallery</span>
          </div>

          <h1 className="text-4xl md:text-5xl font-bold text-gray-800 dark:text-white mb-3">
            Community <span className="bg-gradient-to-r from-purple-600 to-pink-500 bg-clip-text text-transparent">Gallery</span>
          </h1>

          <p className="text-gray-600 dark:text-gray-400 max-w-md mx-auto">
            Explore stunning AI-generated artworks shared by our creative community
          </p>

          {/* Stats */}
          <div className="flex justify-center gap-6 mt-6">
            <div className="text-center">
              <p className="text-2xl font-bold text-purple-600 dark:text-purple-400">{content.length}</p>
              <p className="text-xs text-gray-500 dark:text-gray-500">Artworks</p>
            </div>
            <div className="w-px bg-gray-300 dark:bg-gray-700"></div>
            <div className="text-center">
              <p className="text-2xl font-bold text-purple-600 dark:text-purple-400">
                {new Set(content.map(item => item.userName)).size}
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-500">Artists</p>
            </div>
          </div>
        </div>
      </div>

      {/* Gallery Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
        {content.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {content.map((item, index) => (
              <div
                key={item._id || index}
                className="group relative rounded-2xl overflow-hidden bg-white dark:bg-gray-800 shadow-md hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
              >
                <a href={item.imageUrl} target="_blank" rel="noopener noreferrer">
                  <div className="aspect-square bg-gray-100 dark:bg-gray-700 overflow-hidden">
                    <img
                      src={item.imageUrl}
                      alt="AI Art"
                      className="w-full h-full object-cover transform transition-transform duration-500 group-hover:scale-110"
                      loading="lazy"
                    />
                  </div>

                  {/* Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-all duration-300">
                    <div className="absolute bottom-0 left-0 right-0 p-3">
                      <div className="flex items-center gap-2">
                        <div className="w-7 h-7 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-white text-xs font-bold shadow-lg">
                          {item.userName?.charAt(0)?.toUpperCase() || 'U'}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-white text-sm font-medium truncate">
                            {item.userName || 'Anonymous'}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Download icon */}
                  <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-all duration-300">
                    <div className="p-1.5 bg-white/90 dark:bg-gray-800/90 rounded-full shadow-lg">
                      <svg className="w-4 h-4 text-gray-700 dark:text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                      </svg>
                    </div>
                  </div>
                </a>
              </div>
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-20">
            <div className="w-24 h-24 mb-6 rounded-full bg-gradient-to-br from-purple-100 to-pink-100 dark:from-purple-900/50 dark:to-pink-900/50 flex items-center justify-center">
              <svg className="w-12 h-12 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-gray-800 dark:text-white mb-2">
              No Artworks Yet
            </h3>
            <p className="text-gray-500 dark:text-gray-400 text-center max-w-sm mb-6">
              Be the first to share your AI masterpiece with the community!
            </p>
            <button
              onClick={() => window.location.href = '/'}
              className="px-6 py-2.5 bg-gradient-to-r from-purple-600 to-pink-500 hover:from-purple-700 hover:to-pink-600 text-white font-medium rounded-xl shadow-lg shadow-purple-500/25 hover:shadow-purple-500/40 transition-all duration-300"
            >
              Start Creating
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Community;
