import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Search, Filter, ArrowLeft } from "lucide-react";
import { Link, Navigate } from "react-router-dom";
import PostCard from "../components/features/post/PostCard";
import { getSavedPosts } from "../features/auth/authSlice";

const SavedPosts = () => {
  const dispatch = useDispatch();

  const { savedPostsData = [], loading, error, isAuthenticated } = useSelector(
    (state) => state.auth
  );

  const [search, setSearch] = useState("");

  useEffect(() => {
    dispatch(getSavedPosts());
  }, [dispatch]);

  if (!isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  // Search filter (client-side)
  const filteredPosts = savedPostsData.filter((post) => {
    const q = search.toLowerCase().trim();
    if (!q) return true;

    return (
      post?.company?.toLowerCase().includes(q) ||
      post?.role?.toLowerCase().includes(q) ||
      post?.domain?.toLowerCase().includes(q) ||
      post?.author?.name?.toLowerCase().includes(q)
    );
  });

  const FULL_SPAN_CLASS = "col-span-1 sm:col-span-2 lg:col-span-3";

  return (
    <div className="grid grid-cols-1 gap-8">
      <div className="min-w-0">
        {/* Top Section Like Home */}
        <div className="mb-8">
          <Link
            to="/profile"
            className="mb-4 flex items-center text-slate-500 hover:text-slate-800 transition-colors"
          >
            <ArrowLeft size={20} className="mr-2" /> Back to Profile
          </Link>

          <h1 className="text-2xl md:text-3xl font-bold mb-2 text-slate-800">
            Saved Interview Experiences
          </h1>
          <p className="text-slate-500 mb-6">
            Your bookmarked experiences — quick access anytime.
          </p>

          {/* Search bar like Home */}
          <div className="mb-6 relative">
            <Search
              className="absolute left-4 top-3.5 text-slate-400"
              size={20}
            />
            <input
              type="text"
              placeholder="Search saved companies, roles..."
              className="w-full pl-12 pr-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-emerald-500 outline-none shadow-sm"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </div>

        {/* Count + Clear */}
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-slate-700 font-bold text-sm md:text-base">
            {filteredPosts.length} Saved Experience(s)
          </h2>

          {search.trim() && (
            <button
              onClick={() => setSearch("")}
              className="text-sm text-red-500 hover:underline"
            >
              Clear Search
            </button>
          )}
        </div>

        {/* Grid like Home */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {loading ? (
            <div className={`${FULL_SPAN_CLASS} text-center py-10`}>
              Loading...
            </div>
          ) : error ? (
            <div
              className={`${FULL_SPAN_CLASS} text-center py-10 bg-red-50 rounded-lg border border-red-200`}
            >
              <p className="text-red-600 font-medium">{error}</p>
            </div>
          ) : (
            filteredPosts.map((post) => <PostCard key={post._id} post={post} />)
          )}

          {/* Empty state like Home (full width) */}
          {!loading && !error && filteredPosts.length === 0 && (
            <div
              className={`${FULL_SPAN_CLASS} min-h-[320px] flex flex-col items-center justify-center text-center py-16 bg-white rounded-xl border border-dashed border-slate-300`}
            >
              <Filter className="mx-auto text-slate-300 mb-2" size={48} />
              <p className="text-slate-500 font-medium">
                {savedPostsData.length === 0
                  ? "No saved experiences yet."
                  : "No saved experiences match your search."}
              </p>

              {search.trim() && (
                <button
                  onClick={() => setSearch("")}
                  className="mt-2 text-emerald-600 font-bold hover:underline"
                >
                  Clear Search
                </button>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SavedPosts;
