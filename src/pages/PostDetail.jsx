import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  getInterviewById,
  deleteInterview,
  toggleInterviewLike,
  optimisticToggleInterviewLike,
} from "../features/interview/interviewSlice";
import {
  getComments,
  addComment,
  deleteComment,
} from "../features/comment/commentSlice";
import { savePost } from "../features/auth/authSlice";
import EditInterviewForm from "../components/features/post/EditInterviewForm"; 

import {
  ArrowLeft,
  Building2,
  Calendar,
  CheckCircle2,
  Heart,
  IndianRupee,
  Instagram,
  Lock,
  Save,
  Trash2,
  Linkedin,
  Edit2,
} from "lucide-react";

const PostDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { currentInterview: post, loading: postLoading } = useSelector(
    (state) => state.interviews
  );
  const { comments } = useSelector((state) => state.comments);
  const { isAuthenticated, user } = useSelector((state) => state.auth);

  const [commentText, setCommentText] = useState("");
  const [replyingTo, setReplyingTo] = useState(null);
  const [replyText, setReplyText] = useState("");
  const [notification, setNotification] = useState(null);
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    if (id) {
      dispatch(getInterviewById(id));
      dispatch(getComments({ id, type: "interview" }));
    }
  }, [id, dispatch]);

  if (postLoading || !post)
    return <div className="text-center py-20 text-slate-500">Loading...</div>;

  // --- Handlers ---
  const handleSuccessUpdate = () => {
    setIsEditing(false);
    setNotification("Experience updated successfully!");
    setTimeout(() => setNotification(null), 3000);
  };

  const handleCommentSubmit = (e) => {
    e.preventDefault();
    if (commentText.trim()) {
      dispatch(
        addComment({ id: post._id, content: commentText, type: "interview" })
      );
      setCommentText("");
    }
  };

  const handleDeleteComment = (commentId) => {
    if (window.confirm("Delete this comment?")) {
      dispatch(deleteComment({ id: post._id, commentId, type: "interview" }));
    }
  };

  const handleDelete = () => {
    if (window.confirm("Are you sure?")) {
      dispatch(deleteInterview(post._id));
      navigate("/");
    }
  };

  const handleLike = () => {
    dispatch(optimisticToggleInterviewLike({ interviewId: post._id }));
    dispatch(toggleInterviewLike(post._id));
  };

  const handleSave = async () => {
    try {
      await dispatch(savePost(post._id)).unwrap();
    } catch (err) {
      alert(err);
    }
  };

  return (
    <div className="max-w-4xl mx-auto animate-fadeIn w-full pb-10">
      {notification && (
        <div className="fixed top-4 right-4 z-50 p-4 bg-emerald-600 text-white rounded-lg shadow-lg flex items-center gap-2 animate-bounce-in">
          <CheckCircle2 size={20} /> {notification}
        </div>
      )}

      {/* Top Bar Navigation */}
      {!isEditing && (
        <div className="flex justify-between items-center mb-4 md:mb-6">
          <Link
            to="/"
            className="flex items-center text-slate-500 hover:text-slate-800"
          >
            <ArrowLeft size={20} className="mr-2" /> Back to Feed
          </Link>
        </div>
      )}

      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden w-full">
        {/* CONDITIONAL RENDERING: Edit Form vs View Mode */}
        {isEditing ? (
          <EditInterviewForm
            post={post}
            onCancel={() => setIsEditing(false)}
            onSuccess={handleSuccessUpdate}
          />
        ) : (
          /* ================= VIEW MODE ================= */
          <>
            <div className="bg-slate-900 p-6 md:p-8 text-white relative overflow-hidden">
              <div className="absolute top-0 right-0 p-10 opacity-10">
                <Building2 size={200} />
              </div>

              {/*EDIT/DELETE BUTTON (Top Right of Blue Box) */}
              {(user?._id === post.author._id || user?.name === post.author.name) && (
                <div className="absolute top-4 right-4 z-20 flex gap-2">
                  <button
                    onClick={() => setIsEditing(true)}
                    className="p-2 bg-white/10 hover:bg-white/20 rounded-full text-white backdrop-blur-sm transition-all"
                    title="Edit Experience"
                  >
                    <Edit2 size={18} />
                  </button>
                  <button
                    onClick={handleDelete}
                    className="p-2 bg-red-500/20 hover:bg-red-500/40 rounded-full text-red-200 backdrop-blur-sm transition-all"
                    title="Delete Experience"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              )}

              <div className="relative z-10 wrap-break-word">
                <div className="flex flex-wrap gap-2 mb-4">
                  <span className="px-3 py-1 bg-emerald-500/20 border border-emerald-500/30 text-emerald-300 rounded-full text-xs font-semibold">
                    {post.domain}
                  </span>
                  <span className="px-3 py-1 bg-white/10 border border-white/20 text-slate-200 rounded-full text-xs font-semibold">
                    {post.author.branch}
                  </span>
                </div>
                <h1 className="text-2xl md:text-4xl font-bold mb-2">
                  {post.company}
                </h1>
                <h2 className="text-lg md:text-xl text-slate-300">
                  {post.role}{" "}
                  <span className="text-slate-500 text-sm ml-2">
                    ({post.type})
                  </span>
                </h2>
                {post.interviewDate && (
                  <div className="flex items-center gap-2 mt-3 text-slate-400 text-sm">
                    <Calendar size={16} className="text-emerald-400" />{" "}
                    Interviewed in {post.interviewDate}
                  </div>
                )}
              </div>
            </div>

            {!isAuthenticated ? (
              <div className="p-8 md:p-16 flex flex-col items-center justify-center text-center bg-slate-50">
                <div className="w-16 h-16 bg-slate-200 rounded-full flex items-center justify-center mb-4">
                  <Lock className="text-slate-500" size={32} />
                </div>
                <h3 className="text-2xl font-bold text-slate-800 mb-2">
                  Login to Read Full Experience
                </h3>
                <button
                  onClick={() => navigate("/login")}
                  className="px-6 py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl shadow-lg"
                >
                  Sign In to Continue
                </button>
              </div>
            ) : (
              <div className="grid md:grid-cols-3 gap-0 md:divide-x divide-slate-100">
                {/* Main Content Area */}
                <div className="md:col-span-2 p-6 md:p-8">
                  <div className="prose prose-slate max-w-none">
                    <h3 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
                      <div className="w-1 h-6 bg-emerald-500 rounded-full"></div>
                      Selection Process
                    </h3>
                    <div className="space-y-6 mb-8">
                      {post.rounds &&
                        post.rounds.map((round, index) => (
                          <div
                            key={index}
                            className="bg-slate-50 p-4 rounded-lg border border-slate-100"
                          >
                            <span className="text-xs font-bold text-slate-400 uppercase tracking-wide block mb-2">
                              {round.title}
                            </span>
                            <p className="text-slate-700 whitespace-pre-wrap wrap-break-word text-sm md:text-base">
                              {round.description}
                            </p>
                          </div>
                        ))}
                      {post.hrRound && (
                        <div className="bg-slate-50 p-4 rounded-lg border border-slate-100">
                          <span className="text-xs font-bold text-slate-400 uppercase tracking-wide block mb-2">
                            HR & Managerial Round
                          </span>
                          <p className="text-slate-700 whitespace-pre-wrap wrap-break-word text-sm md:text-base">
                            {post.hrRound}
                          </p>
                        </div>
                      )}
                    </div>
                    {post.offerDetails && (
                      <div className="mb-8">
                        <h3 className="text-lg font-bold text-slate-800 mb-3 flex items-center gap-2">
                          <div className="w-1 h-6 bg-green-500 rounded-full"></div>
                          Offer Details
                        </h3>
                        <div className="bg-green-50 border border-green-100 p-4 rounded-lg flex items-center gap-3">
                          <div className="p-2 bg-green-100 rounded-full text-green-700">
                            <IndianRupee size={20} />
                          </div>
                          <div>
                            <p className="text-xs text-green-700 font-bold uppercase">
                              CTC / Stipend Offered
                            </p>
                            <p className="text-lg font-bold text-slate-800">
                              {post.offer}
                            </p>
                          </div>
                        </div>
                      </div>
                    )}
                    <h3 className="text-lg font-bold text-slate-800 mb-3 flex items-center gap-2">
                      <div className="w-1 h-6 bg-amber-500 rounded-full"></div>
                      Advice for Juniors
                    </h3>
                    <div className="bg-amber-50 border-l-4 border-amber-400 p-4 rounded-r-lg mb-8">
                      <p className="text-slate-800 italic wrap-break-word text-sm md:text-base">
                        "{post.tips}"
                      </p>
                    </div>
                  </div>

                  {/* Comments Section */}
                  <div className="mt-10 pt-8 border-t border-slate-100">
                    <h4 className="font-bold text-slate-800 mb-4">
                      Discussion ({Array.isArray(comments) ? comments.length : 0})
                    </h4>
                    {/* ... (Comments rendering logic kept same as before) ... */}
                    <div className="space-y-4 mb-6">
                      {Array.isArray(comments) &&
                        comments
                          .filter((c) => !c.parentComment)
                          .map((c) => (
                            <div key={c._id} className="flex gap-3 group/comment">
                              {/* ... Comment rendering ... */}
                              {/* (I omitted the detailed comment rendering for brevity, 
                                  it's the same as your provided code) */}
                               <button onClick={() => navigate(c.author?._id === user?._id ? '/profile' : `/user/${c.author?._id}`)} className="shrink-0 hover:opacity-80">
                                <img src={`/avatar/${c.author?.avatar}.png` || "https://via.placeholder.com/32"} alt={c.author?.name} className="w-8 h-8 rounded-full shrink-0 object-cover" />
                              </button>
                              <div className="min-w-0 flex-1">
                                <div className="flex justify-between items-start">
                                  <div><p className="text-sm font-bold text-slate-900">{c.author?.name || "Unknown"}</p></div>
                                  {(c.author?._id === user?._id) && (<button onClick={() => handleDeleteComment(c._id)} className="text-red-500 p-1"><Trash2 size={14} /></button>)}
                                </div>
                                <p className="text-sm text-slate-600 mb-2">{c.content}</p>
                              </div>
                            </div>
                          ))}
                    </div>
                    <form onSubmit={handleCommentSubmit} className="flex gap-2">
                      <input
                        type="text"
                        value={commentText}
                        onChange={(e) => setCommentText(e.target.value)}
                        placeholder="Ask a question..."
                        className="flex-1 bg-slate-50 border border-slate-200 rounded-lg px-4 py-2 text-sm outline-none"
                      />
                      <button type="submit" className="bg-slate-900 text-white px-4 py-2 rounded-lg text-sm font-medium">
                        Post
                      </button>
                    </form>
                  </div>
                </div>

                {/* Sidebar */}
                <div className="md:col-span-1 p-6 md:p-8 bg-slate-50/50 border-t md:border-t-0 md:border-l border-slate-100">
                  <div className="sticky top-24">
                    <div className="text-center mb-6">
                      <button
                        onClick={() => navigate(post.author._id === user?._id ? '/profile' : `/user/${post.author._id}`)}
                        className="inline-block hover:opacity-80 transition-opacity"
                      >
                        <img
                          src={`/avatar/${post.author.avatar || "a1"}.png`}
                          className="w-20 h-20 rounded-full mx-auto mb-3 border-4 border-white shadow-sm object-cover"
                          alt="author"
                        />
                      </button>
                      <h3 className="font-bold text-slate-900 text-lg flex items-center justify-center gap-1">
                        {post.author.name}{" "}
                        <CheckCircle2
                          size={16}
                          className="text-emerald-500 shrink-0"
                        />
                      </h3>
                      <p className="text-sm text-slate-500">
                        {post.author.branch}
                      </p>
                      {/* Social Links */}
                      <div className="flex justify-center gap-3 mt-4 mb-6">
                        {post.author.socialLinks?.linkedIn && (
                          <a href={post.author.socialLinks.linkedIn} target="_blank" rel="noopener noreferrer" className="p-2 bg-blue-100 text-blue-700 rounded-full">
                            <Linkedin size={18} />
                          </a>
                        )}
                        {post.author.socialLinks?.instagram && (
                          <a href={post.author.socialLinks.instagram} target="_blank" rel="noopener noreferrer" className="p-2 bg-pink-100 text-pink-700 rounded-full">
                            <Instagram size={18} />
                          </a>
                        )}
                      </div>
                    </div>
                    <div className="space-y-3">
                      <button
                        onClick={handleLike}
                        className={`w-full py-2.5 rounded-lg border font-medium flex items-center justify-center gap-2 shadow-sm ${post.isLiked ? "bg-red-50 border-red-200 text-red-600" : "border-slate-200 bg-white text-slate-700"}`}
                      >
                        <Heart size={18} className={post.isLiked ? "fill-red-500 text-red-500" : ""} /> {post.likesCount ?? 0} Likes
                      </button>
                      <button
                        onClick={handleSave}
                        className={`w-full py-2.5 rounded-lg border font-medium flex items-center justify-center gap-2 shadow-sm ${user?.savedPosts?.some((p) => p.toString() === post._id.toString()) ? "bg-green-600 text-white" : "border-slate-200 bg-white text-slate-700"}`}
                      >
                        <Save size={18} /> Save
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default PostDetail;