import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Search, Filter } from "lucide-react";
import PostCard from "../components/features/post/PostCard";
import { BRANCHES, DOMAINS } from "../constant";
import { getAllInterviews } from "../features/interview/interviewSlice";

const Home = () => {
  const dispatch = useDispatch();
  const { interviews, loading, error } = useSelector((state) => state.interviews);
  const [searchTerm, setSearchTerm] = useState("");

  const [filters, setFilters] = useState({
    search: "",
    branch: "All",
    domain: "All",
  });

  useEffect(() => {
    const timer = setTimeout(() => {
      setFilters((prev) => {
        if (prev.search === searchTerm) return prev; 
        
        return { ...prev, search: searchTerm };
      });
    }, 500);

    return () => clearTimeout(timer);
  }, [searchTerm]);

  useEffect(() => {
    const apiParams = {
      company: filters.search || undefined,
      domain: filters.domain !== "All" ? filters.domain : undefined,
      branch: filters.branch !== "All" ? filters.branch : undefined,
    };
    
    Object.keys(apiParams).forEach(
      (key) => apiParams[key] === undefined && delete apiParams[key]
    );

    dispatch(getAllInterviews(apiParams));
  }, [dispatch, filters]);

  const FULL_SPAN_CLASS = "col-span-1 sm:col-span-2 lg:col-span-3";

  return (
    <div className="grid grid-cols-1 gap-8">
      <div className="min-w-0">
        <div className="mb-8">
          <h1 className="text-2xl md:text-3xl font-bold mb-2 text-slate-800">
            Find Interview Experiences
          </h1>
          <p className="text-slate-500 mb-6">
            Learn from seniors who cracked the code.
          </p>

          {/* Search */}
          <div className="mb-6 relative">
            <Search
              className="absolute left-4 top-3.5 text-slate-400"
              size={20}
            />
            <input
              type="text"
              placeholder="Search companies, roles..."
              className="w-full pl-12 pr-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-emerald-500 outline-none shadow-sm"
              value={filters.search}
              onChange={(e) =>
                setFilters((p) => ({ ...p, search: e.target.value }))
              }
            />
          </div>

          <div className="space-y-4">
            {/* Branch Filters */}
            <div>
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wide mb-2 block">
                By Branch
              </span>
              <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide -mx-4 px-4 md:mx-0 md:px-0">
                <button
                  onClick={() => setFilters((p) => ({ ...p, branch: "All" }))}
                  className={`whitespace-nowrap px-4 py-2 rounded-full text-sm font-medium border shrink-0 ${
                    filters.branch === "All"
                      ? "bg-slate-800 text-white"
                      : "bg-white text-slate-600"
                  }`}
                >
                  All Branches
                </button>

                {BRANCHES.map((branch) => (
                  <button
                    key={branch}
                    onClick={() => setFilters((p) => ({ ...p, branch }))}
                    className={`whitespace-nowrap px-4 py-2 rounded-full text-sm font-medium border shrink-0 ${
                      filters.branch === branch
                        ? "bg-slate-800 text-white"
                        : "bg-white text-slate-600"
                    }`}
                  >
                    {branch}
                  </button>
                ))}
              </div>
            </div>

            {/* Domain Filters */}
            <div>
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wide mb-2 block">
                By Category
              </span>

              <div className="flex flex-wrap gap-2">
                <button
                  onClick={() => setFilters((p) => ({ ...p, domain: "All" }))}
                  className={`px-4 py-1.5 rounded-lg text-sm font-medium ${
                    filters.domain === "All"
                      ? "bg-emerald-100 text-emerald-700"
                      : "text-slate-500 hover:bg-slate-100"
                  }`}
                >
                  All
                </button>

                {DOMAINS.map((domain) => (
                  <button
                    key={domain}
                    onClick={() => setFilters((p) => ({ ...p, domain }))}
                    className={`px-4 py-1.5 rounded-lg text-sm font-medium ${
                      filters.domain === domain
                        ? "bg-emerald-100 text-emerald-700"
                        : "text-slate-500 hover:bg-slate-100"
                    }`}
                  >
                    {domain}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-slate-700 font-bold text-sm md:text-base">
            {interviews.length} Experience(s) Found
          </h2>

          {(filters.branch !== "All" || filters.domain !== "All") && (
            <button
              onClick={() => setFilters({ search: "", branch: "All", domain: "All" })}
              className="text-sm text-red-500 hover:underline"
            >
              Clear Filters
            </button>
          )}
        </div>

        {/* Cards */}
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
            interviews.map((post) => <PostCard key={post._id} post={post} />)
          )}

          {!loading && !error && interviews.length === 0 && (
            <div
              className={`${FULL_SPAN_CLASS} min-h-[320px] flex flex-col items-center justify-center text-center py-16 bg-white rounded-xl border border-dashed border-slate-300`}
            >
              <Filter className="mx-auto text-slate-300 mb-2" size={48} />
              <p className="text-slate-500 font-medium">No experiences found.</p>

              <button
                onClick={() => setFilters({ search: "", branch: "All", domain: "All" })}
                className="mt-2 text-emerald-600 font-bold hover:underline"
              >
                Clear Filters
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Home;
