import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Send, Trash2, Heart, MessageCircle, X } from "lucide-react";
import { Link } from "react-router-dom";
import {
  getAllTweets,
  createTweet,
  deleteTweet,
  toggleTweetLike,
  optimisticToggleLike
} from "../features/tweet/tweetSlice";
import {
  addTweetCommentApi,
  getTweetCommentsApi,
  replyToTweetApi,
  deleteTweetCommentApi,
} from "../features/comment/commentApi.js";
import { AVATAR_MAP } from "../constant.js";

const Discussion = () => {
  const dispatch = useDispatch();
  const { tweets, loading } = useSelector((state) => state.tweets);
  const { isAuthenticated, user } = useSelector((state) => state.auth);
  const [newTweet, setNewTweet] = useState("");
  const [expandedTweets, setExpandedTweets] = useState(new Set());
  const [tweetComments, setTweetComments] = useState({});
  const [commentText, setCommentText] = useState({});
  const [loadingComments, setLoadingComments] = useState({});
  const [replyingTo, setReplyingTo] = useState(null); // { tweetId, commentId }
  const [replyText, setReplyText] = useState({});
  const [heartAnimation, setHeartAnimation] = useState({}); // { tweetId: true/false }
  const [notification, setNotification] = useState(null);

  useEffect(() => {
    dispatch(getAllTweets());
  }, [dispatch]);

  // Notification auto-dismiss
  useEffect(() => {
    if (notification) {
      const timer = setTimeout(() => {
        setNotification(null);
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [notification]);

  // Load comments for all tweets when they are fetched
  // useEffect(() => {
  //   if (tweets && tweets.length > 0) {
  //     tweets.forEach((tweet) => {
  //       if (!tweetComments[tweet._id]) {
  //         loadComments(tweet._id);
  //       }
  //     });
  //   }
  // }, [tweets]);

  const handlePost = (e) => {
    e.preventDefault();
    if (!newTweet.trim()) return;
    dispatch(createTweet(newTweet));
    setNewTweet("");
  };

  const handleDelete = (id) => {
    if (window.confirm("Delete this tweet?")) dispatch(deleteTweet(id));
  };

  const handleDeleteComment = async (tweetId, commentId) => {
    if (window.confirm("Delete this comment?")) {
      try {
        await deleteTweetCommentApi(tweetId, commentId);
        // Remove from local state
        setTweetComments((prev) => ({
          ...prev,
          [tweetId]: prev[tweetId].filter(
            (c) => c._id !== commentId && c.parentComment !== commentId
          ),
        }));
        setNotification({type: "success", message: "Comment deleted successfully"});
      } catch (error) {
        setNotification({type: "error", message: "Failed to delete comment"});
      }
    }
  };

  const handleLikeTweet = async (tweetId) => {
      setHeartAnimation((prev) => ({
        ...prev,
        [tweetId]: true,
      }));

      dispatch(optimisticToggleLike({ tweetId }));

      try {
        await dispatch(toggleTweetLike(tweetId)).unwrap();
      } catch (err) {
        console.error("Like API failed", err);
      }

      setTimeout(() => {
        setHeartAnimation((prev) => ({
          ...prev,
          [tweetId]: false,
        }));
      }, 600);
  };


  const toggleComments = async (tweetId) => {
    if (expandedTweets.has(tweetId)) {
      setExpandedTweets((prev) => {
        const newSet = new Set(prev);
        newSet.delete(tweetId);
        return newSet;
      });
    } else {
      setExpandedTweets((prev) => new Set(prev).add(tweetId));
      if (!tweetComments[tweetId]) {
        loadComments(tweetId);
      }
    }
  };

  const loadComments = async (tweetId) => {
    try {
      setLoadingComments((prev) => ({ ...prev, [tweetId]: true }));
      const { data } = await getTweetCommentsApi(tweetId);
      setTweetComments((prev) => ({
        ...prev,
        [tweetId]: data.data || [],
      }));
    } catch (error) {
      console.error("Failed to load comments:", error);
      setTweetComments((prev) => ({
        ...prev,
        [tweetId]: [],
      }));
    } finally {
      setLoadingComments((prev) => ({ ...prev, [tweetId]: false }));
    }
  };

  const handleAddComment = async (tweetId) => {
    const content = commentText[tweetId]?.trim();
    if (!content) return;

    try {
      const { data } = await addTweetCommentApi(tweetId, content);
      setTweetComments((prev) => {
        const updated = {
          ...prev,
          [tweetId]: [data.data, ...(prev[tweetId] || [])],
        };
        return updated;
      });
      setCommentText((prev) => ({
        ...prev,
        [tweetId]: "",
      }));
      // Force re-render by triggering state update
      setLoadingComments((prev) => ({ ...prev, [tweetId]: false }));
    } catch (error) {
      console.error("Failed to add comment:", error);
      alert("Failed to add comment. Please try again.");
    }
  };

  const handleReply = async (tweetId, commentId, parentAuthorName) => {
    const replyKey = `${tweetId}-${commentId}`;
    const content = replyText[replyKey]?.trim();
    if (!content) return;

    try {
      const { data } = await replyToTweetApi(tweetId, commentId, content);
      setTweetComments((prev) => {
        const updated = {
          ...prev,
          [tweetId]: [data.data, ...(prev[tweetId] || [])],
        };
        return updated;
      });
      setReplyText((prev) => ({
        ...prev,
        [replyKey]: "",
      }));
      setReplyingTo(null);
      // Force re-render by triggering state update
      setLoadingComments((prev) => ({ ...prev, [tweetId]: false }));
    } catch (error) {
      console.error("Failed to add reply:", error);
      alert("Failed to add reply. Please try again.");
    }
  };

  // Helper function to get replies for a comment
  const getRepliesForComment = (tweetId, commentId) => {
    return (
      tweetComments[tweetId]?.filter(
        (comment) => comment.parentComment === commentId,
      ) || []
    );
  };

  // Helper function to get top-level comments (no parent)
  const getTopLevelComments = (tweetId) => {
    return (
      tweetComments[tweetId]?.filter((comment) => !comment.parentComment) || []
    );
  };

  // Component to render a single comment with its nested replies
  const CommentThread = ({ tweet, comment, depth = 0 }) => {
    const replies = getRepliesForComment(tweet._id, comment._id);
    const isReplyingToThis =
      replyingTo?.commentId === comment._id &&
      replyingTo?.tweetId === tweet._id;

    return (
      <div
        key={comment._id}
        className={`${depth > 0 ? "ml-6 border-l-2 border-slate-200 pl-3" : ""}`}
      >
        <div className="flex gap-2 p-2 bg-slate-50 rounded-lg group/comment mb-2">
          <img
            src={AVATAR_MAP[comment.author?.avatar] || AVATAR_MAP["a1"]}
            alt="commenter"
            className="w-6 h-6 rounded-full object-cover flex-shrink-0"
          />
          <div className="flex-1">
            <div className="flex justify-between items-start mb-1">
              <div>
                <p className="font-semibold text-slate-900 text-sm">
                  {comment.author?.name || "Unknown"}
                </p>
                {comment.parentComment && (
                  <p className="text-xs text-blue-600">
                    Replying to a comment
                  </p>
                )}
              </div>
              {(comment.author?._id === user?._id || comment.author === user?._id) && (
                <button
                  onClick={() => handleDeleteComment(tweet._id, comment._id)}
                  title="Delete comment"
                  className="text-red-500 hover:text-red-700 hover:bg-red-50 p-0.5 rounded transition-colors"
                >
                  <Trash2 size={12} />
                </button>
              )}
            </div>
            <p className="text-slate-700 text-sm">{comment.content}</p>
            {!comment.parentComment && (
              <button
                onClick={() =>
                  setReplyingTo({ tweetId: tweet._id, commentId: comment._id })
                }
                className="text-xs text-blue-500 hover:text-blue-700 mt-1"
              >
                Reply
              </button>
            )}
          </div>
        </div>

        {/* Reply input box */}
        {isReplyingToThis && (
          <div className="flex gap-2 p-2 bg-white border border-blue-200 rounded-lg ml-6 mb-2">
            <img
              src={AVATAR_MAP[user?.avatar] || AVATAR_MAP["a1"]}
              alt="your avatar"
              className="w-6 h-6 rounded-full object-cover flex-shrink-0"
            />
            <div className="flex-1 flex gap-2">
              <input
                type="text"
                value={replyText[`${tweet._id}-${comment._id}`] || ""}
                onChange={(e) =>
                  setReplyText((prev) => ({
                    ...prev,
                    [`${tweet._id}-${comment._id}`]: e.target.value,
                  }))
                }
                placeholder={`Reply to ${comment.author?.name}...`}
                className="flex-1 px-2 py-1 bg-slate-50 border border-slate-200 rounded text-sm outline-none focus:border-blue-500"
                autoFocus
              />
              <button
                onClick={() =>
                  handleReply(tweet._id, comment._id, comment.author?.name)
                }
                disabled={!replyText[`${tweet._id}-${comment._id}`]?.trim()}
                className="px-2 py-1 bg-blue-600 hover:bg-blue-700 text-white rounded text-xs font-medium disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Send size={12} />
              </button>
              <button
                onClick={() => setReplyingTo(null)}
                className="px-2 py-1 bg-slate-200 hover:bg-slate-300 text-slate-700 rounded text-xs"
              >
                <X size={12} />
              </button>
            </div>
          </div>
        )}

        {/* Nested replies */}
        {replies.length > 0 && (
          <div className="space-y-2">
            {replies.map((reply) => (
              <CommentThread
                key={reply._id}
                tweet={tweet}
                comment={reply}
                depth={depth + 1}
              />
            ))}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="max-w-2xl mx-auto w-full">
      {notification && (
        <div className={`mb-4 p-3 rounded-lg text-sm font-medium ${
          notification.type === "success"
            ? "bg-green-100 text-green-800"
            : "bg-red-100 text-red-800"
        }`}>
          {notification.message}
        </div>
      )}
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-slate-900">Campus Buzz</h2>
        <p className="text-slate-500">
          General discussions about interviews and  placements.
        </p>
      </div>
      {isAuthenticated ? (
        <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-200 mb-6">
          <form onSubmit={handlePost}>
            <div className="flex gap-4">
              <img
                src={AVATAR_MAP[user?.avatar] || AVATAR_MAP["a1"]}
                alt="me"
                className="w-10 h-10 rounded-full border border-slate-200 object-cover flex-shrink-0"
                onError={(e) => (e.target.src = AVATAR_MAP["a1"])}
              />
              <div className="flex-1">
                <textarea
                  value={newTweet}
                  onChange={(e) => setNewTweet(e.target.value)}
                  className="w-full bg-slate-50 p-3 rounded-lg border border-slate-100 outline-none resize-none"
                  placeholder="What's happening?"
                  rows="3"
                />
                <div className="flex justify-between items-center mt-2">
                  <span className="text-xs text-slate-400">Keep it civil.</span>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-slate-900 text-white rounded-lg text-sm font-medium flex items-center gap-2"
                  >
                    Post <Send size={14} />
                  </button>
                </div>
              </div>
            </div>
          </form>
        </div>
      ) : (
        <div className="bg-blue-50 border border-blue-100 p-4 rounded-xl text-center mb-6">
          <p className="text-blue-800 mb-2 font-medium">
            Sign in to join the discussion!
          </p>
          <Link
            to="/login"
            className="inline-block text-sm bg-blue-600 text-white px-4 py-2 rounded-lg"
          >
            Sign In
          </Link>
        </div>
      )}
      <div className="space-y-4">
        {loading ? (
          <div>Loading...</div>
        ) : (
          tweets.map((tweet) => (
            <div
              key={tweet._id}
              className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm group"
            >
              <div className="flex justify-between items-start mb-2">
                <div className="flex items-center gap-3">
                  <img
                    src={AVATAR_MAP[tweet.author?.avatar] || AVATAR_MAP["a1"]}
                    alt={tweet.author?.name || "User"}
                    className="w-10 h-10 rounded-full border border-slate-200 object-cover flex-shrink-0"
                    onError={(e) => (e.target.src = AVATAR_MAP["a1"])}
                  />
                  <div>
                    <h4 className="font-bold text-slate-900 text-sm">
                      {tweet.author?.name || "Unknown"}
                    </h4>
                    <p className="text-xs text-slate-500">
                      {tweet.author?.handle || ""}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-xs text-slate-400">
                    {tweet.timestamp}
                  </span>
                  {(tweet.author?._id === user?._id || tweet.author === user?._id) && (
                    <button
                      onClick={() => handleDelete(tweet._id)}
                      title="Delete post"
                      className="text-red-500 hover:text-red-700 hover:bg-red-50 p-1 rounded transition-colors"
                    >
                      <Trash2 size={14} />
                    </button>
                  )}
                </div>
              </div>
              <p className="text-slate-800 text-sm leading-relaxed mb-4 pl-13 ml-13">
                {tweet.content}
              </p>
              <div className="flex gap-6 border-t border-slate-50 pt-3 relative">
                <div className="relative">
                  <button
                    onClick={() => handleLikeTweet(tweet._id)}
                    className={`flex items-center gap-2 text-xs transition-colors ${
                      tweet.isLiked ? "text-red-500" : "text-slate-500 hover:text-red-500"
                    }`}
                  >
                    <Heart 
                      size={16} 
                      fill={tweet.isLiked ? "currentColor" : "none"} // Fills with red if liked
                    /> 
                    {tweet.likesCount || 0}
                  </button>
                  
                  {/* Floating heart animation */}
                  {heartAnimation[tweet._id] && (
                    <div className="absolute left-6 top-0 pointer-events-none">
                      <Heart
                        size={32}
                        className="text-red-500 heart-pop"
                        fill="currentColor"
                      />
                    </div>
                  )}
                </div>
                <button
                  onClick={() => toggleComments(tweet._id)}
                  className={`flex items-center gap-2 text-xs transition-colors font-semibold ${
                    expandedTweets.has(tweet._id)
                      ? "text-blue-500"
                      : "text-slate-500 hover:text-blue-500"
                  }`}
                >
                  <MessageCircle size={16} />
                  <span className="inline-block min-w-[1.5rem] text-center">
                    {tweetComments[tweet._id] 
                      ? tweetComments[tweet._id].length 
                      : (tweet.commentsCount || 0)
                    }
                  </span>
                </button>
              </div>
              {expandedTweets.has(tweet._id) && isAuthenticated && (
                <div className="mt-4 pt-4 border-t border-slate-100 space-y-3">
                  <div className="flex gap-2">
                    <img
                      src={AVATAR_MAP[user?.avatar] || AVATAR_MAP["a1"]}
                      alt="your avatar"
                      className="w-7 h-7 rounded-full object-cover flex-shrink-0"
                    />
                    <div className="flex-1 flex gap-2">
                      <input
                        type="text"
                        value={commentText[tweet._id] || ""}
                        onChange={(e) =>
                          setCommentText((prev) => ({
                            ...prev,
                            [tweet._id]: e.target.value,
                          }))
                        }
                        placeholder="Write a comment..."
                        className="flex-1 px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm outline-none focus:border-emerald-500"
                      />
                      <button
                        onClick={() => handleAddComment(tweet._id)}
                        disabled={!commentText[tweet._id]?.trim()}
                        className="px-3 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        <Send size={14} />
                      </button>
                    </div>
                  </div>
                  {loadingComments[tweet._id] ? (
                    <div className="text-xs text-slate-400">
                      Loading comments...
                    </div>
                  ) : tweetComments[tweet._id]?.length > 0 ? (
                    <div className="space-y-2 max-h-96 overflow-y-auto">
                      {getTopLevelComments(tweet._id).map((comment) => (
                        <CommentThread
                          key={comment._id}
                          tweet={tweet}
                          comment={comment}
                          depth={0}
                        />
                      ))}
                    </div>
                  ) : (
                    <div className="text-xs text-slate-400 italic">
                      No comments yet. Be the first!
                    </div>
                  )}
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default Discussion;
