import { useNavigate } from "react-router-dom";
import {
  Heart,
  MessageCircle,
  Bookmark,
  Calendar,
  ChevronRight,
  IndianRupee,
} from "lucide-react";
import { AVATAR_MAP } from "../../../constant.js";
import { useDispatch, useSelector } from "react-redux";
import { useState } from "react";
import {
  toggleInterviewLike,
  optimisticToggleInterviewLike,
} from "../../../features/interview/interviewSlice";
import { savePost } from "../../../features/auth/authSlice";

const PostCard = ({ post }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [heartAnimation, setHeartAnimation] = useState({});

  const { user, isAuthenticated } = useSelector((state) => state.auth);
  const savedPosts = user?.savedPosts || [];
  const isSaved = savedPosts.some(
    (id) => id?.toString() === post._id?.toString()
  );

  const handleLikeInterview = async (e, interviewId) => {
    e.preventDefault();
    e.stopPropagation();

    if (!isAuthenticated) {
      navigate("/login");
      return;
    }

    setHeartAnimation((prev) => ({ ...prev, [interviewId]: true }));
    dispatch(optimisticToggleInterviewLike({ interviewId }));

    try {
      await dispatch(toggleInterviewLike(interviewId)).unwrap();
    } catch {
      dispatch(optimisticToggleInterviewLike({ interviewId }));
    }

    setTimeout(() => {
      setHeartAnimation((prev) => ({ ...prev, [interviewId]: false }));
    }, 600);
  };

  const handleSaveToggle = async (e) => {
    e.preventDefault();
    e.stopPropagation();

    if (!isAuthenticated) {
      navigate("/login");
      return;
    }

    try {
      await dispatch(savePost(post._id)).unwrap();
    } catch (err) {
      console.log(err);
    }
  };

  const handleCardClick = () => {
    navigate(`/posts/${post._id}`);
  };

  return (
    <div onClick={handleCardClick} className="block h-full cursor-pointer">
      <div className="group relative bg-white rounded-xl border border-slate-200 shadow-sm hover:shadow-md hover:border-emerald-200 transition-all overflow-hidden flex flex-col h-full w-full active:scale-[0.99]">

        {/* Save Button */}
        <button
          onClick={handleSaveToggle}
          className={`absolute top-4 right-4 z-10 p-2 rounded-full hover:bg-slate-50 transition ${
            isSaved
              ? "text-emerald-600"
              : "text-slate-300 hover:text-emerald-600"
          }`}
        >
          <Bookmark size={18} fill={isSaved ? "currentColor" : "none"} />
        </button>

        {/* Main Content */}
        <div className="p-4 md:p-5 flex-grow">
          {/* Tags */}
          <div className="flex flex-wrap justify-between items-start gap-2 mb-3">
            <div className="flex flex-wrap gap-2">
              <span
                className={`px-2 py-1 text-xs font-semibold rounded-full border ${
                  post.domain === "Core"
                    ? "bg-orange-50 text-orange-700 border-orange-100"
                    : post.domain === "Tech"
                    ? "bg-blue-50 text-blue-700 border-blue-100"
                    : "bg-purple-50 text-purple-700 border-purple-100"
                }`}
              >
                {post.domain}
              </span>

              <span className="px-2 py-1 text-xs font-medium bg-slate-100 text-slate-600 rounded-full border border-slate-200">
                {post.author.branch}
              </span>
            </div>

            <span className="text-xs text-slate-400 whitespace-nowrap">
              {post.timestamp}
            </span>
          </div>

          {/* Company + Offer */}
          <div className="flex items-center justify-between gap-2 mb-1">
            <h3 className="text-lg md:text-xl font-bold text-slate-800 group-hover:text-emerald-700 transition-colors truncate">
              {post.company}
            </h3>

            {post.offerDetails && (
              <div className="flex items-center gap-1 bg-emerald-50 px-2.5 py-1 rounded-md text-xs font-semibold text-emerald-700 border border-emerald-100 shadow-sm whitespace-nowrap">
                <IndianRupee size={12} />
                <span>{post.offerDetails}</span>
              </div>
            )}
          </div>

          {/* Role */}
          <p className="text-sm text-slate-500 font-medium mb-4 truncate">
            {post.role}
          </p>

          {/* Author + Interview */}
          <div className="flex items-center gap-3 mt-4 pt-4 border-t border-slate-100">
            <img
              src={AVATAR_MAP[post.author?.avatar] || AVATAR_MAP["a1"]}
              alt="avatar"
              className="w-8 h-8 rounded-full border border-slate-200 object-cover"
              onError={(e) => (e.target.src = AVATAR_MAP["a1"])}
            />

            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-slate-900 truncate">
                {post.author.name}
              </p>
              <p className="text-xs text-slate-500 truncate">{post.type}</p>
            </div>

            {/* Interview Date */}
            {post.interviewDate && (
              <div className="flex items-center gap-1 text-[11px] text-slate-500 transition-all duration-300 group-hover:translate-y-1 whitespace-nowrap">
                <Calendar size={12} />
                <span>{post.interviewDate}</span>
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="bg-slate-50 px-4 md:px-5 py-3 flex items-center justify-between text-slate-500 text-sm border-t border-slate-100">
          <div className="flex gap-4">
            {/* Like */}
            <div className="relative">
              <button
                onClick={(e) => handleLikeInterview(e, post._id)}
                className="flex items-center gap-1 hover:text-red-500 transition-colors"
              >
                <Heart
                  size={16}
                  className={`transition ${
                    post.isLiked
                      ? "text-red-500 fill-red-500"
                      : "text-slate-500"
                  }`}
                />
                {post.likesCount ?? 0}
              </button>

              {heartAnimation[post._id] && (
                <div className="absolute left-4 -top-2 pointer-events-none">
                  <Heart
                    size={28}
                    className="text-red-500 heart-pop"
                    fill="currentColor"
                  />
                </div>
              )}
            </div>

            {/* Comments */}
            <span className="flex items-center gap-1">
              <MessageCircle size={16} /> {post.commentCount || 0}
            </span>
          </div>

          {/* Read */}
          <span className="flex items-center gap-1 text-emerald-600 font-medium opacity-0 group-hover:opacity-100 transition-opacity">
            Read <ChevronRight size={16} />
          </span>
        </div>
      </div>
    </div>
  );
};

export default PostCard;
