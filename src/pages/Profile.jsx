import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { LogOut, Edit2, Lock, Linkedin, Instagram, Plus, X } from "lucide-react";
import { logout, changePassword } from "../features/auth/authSlice";
import { updateAvatar, updateAccount } from "../features/auth/authSlice";
import { AVATAR_OPTIONS, AVATAR_MAP } from "../constant.js";
import { getMyPosts } from "../features/auth/authSlice";

import api from "../utils/axios.js";

const Profile = () => {
  const { user, myPostsData } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { userId } = useParams();
  const [profileUser, setProfileUser] = useState(null);
  const [loading, setLoading] = useState(userId ? true : false);
  const [showAvatarModal, setShowAvatarModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editFormData, setEditFormData] = useState({ name: "", branch: "", currentPassword: "", newPassword: "", linkedIn: "", instagram: "" });

  const isOwnProfile = !userId || userId === user?._id;
  const displayUser = isOwnProfile ? user : profileUser;

  useEffect(() => {
    if (userId && userId !== user?._id) {
      const fetchUser = async () => {
        try {
          const response = await api.get(`/users/user/${userId}`);
          setProfileUser(response.data.data);
        } catch (error) {
          console.error("Failed to fetch user:", error);
        } finally {
          setLoading(false);
        }
      };
      fetchUser();
    } else if (user) {
      dispatch(getMyPosts());
      setEditFormData({
        name: user?.name || "",
        branch: user?.branch || "",
        currentPassword: "",
        newPassword: "",
        linkedIn: user?.socialLinks?.linkedIn || "",
        instagram: user?.socialLinks?.instagram || ""
      });
      setLoading(false);
    }
  }, [userId, user, dispatch]);

  const handleLogout = () => {
    dispatch(logout());
    navigate("/login");
  };

  const handleAvatarChange = (avatarId) => {
    dispatch(updateAvatar(avatarId));
    setShowAvatarModal(false);
  };

  const handleEditModalOpen = () => {
    setEditFormData({
      name: user?.name || "",
      branch: user?.branch || "",
      currentPassword: "",
      newPassword: "",
      linkedIn: user?.socialLinks?.linkedIn || "",
      instagram: user?.socialLinks?.instagram || ""
    });
    setShowEditModal(true);
  };

  const handleSaveProfile = async () => {
    try {
      // Update account info
      if (editFormData.name || editFormData.branch) {
        await dispatch(updateAccount({ 
          name: editFormData.name, 
          branch: editFormData.branch 
        }));
      }

      // Update social links
      if (editFormData.linkedIn || editFormData.instagram) {
        await api.patch("/users/update-social-links", {
          linkedIn: editFormData.linkedIn,
          instagram: editFormData.instagram
        });
      }

      // Change password if provided
      if (editFormData.currentPassword && editFormData.newPassword) {
        await dispatch(changePassword({
          oldPassword: editFormData.currentPassword,
          password: editFormData.newPassword
        })).unwrap();

      }

      alert("Profile updated successfully!");
      setShowEditModal(false);
    } catch (error) {
      alert("Failed to update profile");
      console.error(error);
    }
  };

  if (loading) {
    return <div className="text-center py-20">Loading...</div>;
  }

  if (!displayUser) {
    return <div className="text-center py-20">User not found</div>;
  }

  return (
    <div className="max-w-2xl mx-auto w-full pb-12">
      <div className="bg-white rounded-2xl shadow-md overflow-hidden border border-slate-100">
        <div className="h-32 bg-linear-to-r from-slate-800 to-slate-900 relative">
          {isOwnProfile && (
            <button
              onClick={handleLogout}
              className="absolute top-4 right-4 bg-white/20 hover:bg-white/30 text-white px-3 py-1 rounded-lg text-sm font-medium backdrop-blur-sm flex items-center gap-2"
            >
              <LogOut size={14} /> Sign Out
            </button>
          )}
        </div>
        <div className="px-6 md:px-8 pb-8">
          <div className="relative -top-12 flex justify-between items-end mb-2">
            <div className="relative">
              <img
                src={`/avatar/${displayUser?.avatar || "a1"}.png`}
                alt="Profile"
                className="w-24 h-24 shrink-0 rounded-full border-4 border-white bg-white object-cover"
                onError={(e) => (e.target.src = `${process.env.PUBLIC_URL}/avatar/a1.png`)}
              />
              {isOwnProfile && (
                <button
                  onClick={() => setShowAvatarModal(true)}
                  className="absolute bottom-0 right-0 bg-emerald-600 hover:bg-emerald-700 text-white p-2 rounded-full shadow-lg border-2 border-white transition-colors"
                  title="Change Avatar"
                >
                  <Plus size={16} />
                </button>
              )}
            </div>
          </div>
          <div className="flex justify-between items-start mb-4">
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-2xl font-bold text-slate-900">{displayUser?.name}</h1>
                {isOwnProfile && (
                  <button
                    onClick={handleEditModalOpen}
                    className="p-1.5 text-slate-400 hover:text-emerald-600 hover:bg-emerald-50 rounded transition-colors"
                    title="Edit Profile"
                  >
                    <Edit2 size={18} />
                  </button>
                )}
              </div>
              <p className="text-slate-500 font-medium mb-3">
                {displayUser?.branch} | Batch of {displayUser?.batch}
              </p>
              {displayUser?.socialLinks && (Object.keys(displayUser.socialLinks).some(key => displayUser.socialLinks[key])) && (
                <div className="flex gap-2">
                  {displayUser.socialLinks.linkedIn && (
                    <a
                      href={displayUser.socialLinks.linkedIn}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-2 bg-blue-100 text-blue-700 rounded-full hover:bg-blue-200 transition-colors"
                    >
                      <Linkedin size={16} />
                    </a>
                  )}
                  {displayUser.socialLinks.instagram && (
                    <a
                      href={displayUser.socialLinks.instagram}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-2 bg-pink-100 text-pink-700 rounded-full hover:bg-pink-200 transition-colors"
                    >
                      <Instagram size={16} />
                    </a>
                  )}
                </div>
              )}
            </div>
            
          </div>

          {/* Avatar Selection Modal */}
          {showAvatarModal && isOwnProfile && (
            <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
              <div className="bg-white rounded-2xl shadow-lg max-w-2xl w-full max-h-[80vh] overflow-y-auto">
                <div className="sticky top-0 bg-white p-6 border-b border-slate-200 flex justify-between items-center">
                  <h2 className="text-xl font-bold text-slate-900">Choose Your Avatar</h2>
                  <button
                    onClick={() => setShowAvatarModal(false)}
                    className="p-1 text-slate-400 hover:text-slate-600"
                  >
                    <X size={24} />
                  </button>
                </div>
                <div className="p-6">
                  <div className="grid grid-cols-4 sm:grid-cols-5 md:grid-cols-6 gap-4">
                    {AVATAR_OPTIONS.map((avatarId) => (
                      <button
                        key={avatarId}
                        onClick={() => handleAvatarChange(avatarId)}
                        className={`flex flex-col items-center gap-2 p-3 rounded-xl transition-all hover:scale-105 ${
                          user?.avatar === avatarId
                            ? "bg-emerald-100 ring-2 ring-emerald-500"
                            : "bg-slate-50 hover:bg-slate-100"
                        }`}
                      >
                        <img
                          src={`/avatar/${avatarId}.png`}
                          alt={`Avatar ${avatarId}`}
                          className="w-12 h-12 rounded-full object-cover"
                          onError={(e) => (e.target.src = `${process.env.PUBLIC_URL}/avatar/a1.png`)}
                        />
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Edit Profile Modal */}
          {showEditModal && isOwnProfile && (
            <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
              <div className="bg-white rounded-2xl shadow-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                <div className="sticky top-0 bg-white p-6 border-b border-slate-200 flex justify-between items-center">
                  <h2 className="text-xl font-bold text-slate-900">Edit Profile</h2>
                  <button
                    onClick={() => setShowEditModal(false)}
                    className="p-1 text-slate-400 hover:text-slate-600"
                  >
                    <X size={24} />
                  </button>
                </div>
                <div className="p-6 space-y-4">
                  {/* Name Field */}
                  <div>
                    <label className="text-sm font-medium text-slate-700 block mb-2">Full Name</label>
                    <input
                      type="text"
                      value={editFormData.name}
                      onChange={(e) => setEditFormData({ ...editFormData, name: e.target.value })}
                      className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    />
                  </div>

                  {/* Branch Field */}
                  <div>
                    <label className="text-sm font-medium text-slate-700 block mb-2">Branch</label>
                    <input
                      type="text"
                      value={editFormData.branch}
                      onChange={(e) => setEditFormData({ ...editFormData, branch: e.target.value })}
                      className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    />
                  </div>

                  {/* Social Links Section */}
                  <div className="border-t border-slate-200 pt-4 mt-4">
                    <h3 className="font-semibold text-slate-900 mb-3">Social Links</h3>
                    
                    <div className="mb-3">
                      <label className="text-sm font-medium text-slate-700 block mb-2">LinkedIn URL</label>
                      <input
                        type="url"
                        value={editFormData.linkedIn}
                        onChange={(e) => setEditFormData({ ...editFormData, linkedIn: e.target.value })}
                        placeholder="https://linkedin.com/in/your-profile"
                        className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                      />
                    </div>

                    <div className="mb-3">
                      <label className="text-sm font-medium text-slate-700 block mb-2">Instagram URL</label>
                      <input
                        type="url"
                        value={editFormData.instagram}
                        onChange={(e) => setEditFormData({ ...editFormData, instagram: e.target.value })}
                        placeholder="https://instagram.com/your-profile"
                        className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                      />
                    </div>
                  </div>

                  {/* Password Change Section */}
                  <div className="border-t border-slate-200 pt-4 mt-4">
                    <h3 className="font-semibold text-slate-900 mb-3 flex items-center gap-2">
                      <Lock size={16} /> Change Password
                    </h3>
                    
                    <div className="mb-3">
                      <label className="text-sm font-medium text-slate-700 block mb-2">Current Password</label>
                      <input
                        type="password"
                        value={editFormData.currentPassword}
                        onChange={(e) => setEditFormData({ ...editFormData, currentPassword: e.target.value })}
                        placeholder="Enter current password"
                        className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                      />
                    </div>

                    <div className="mb-3">
                      <label className="text-sm font-medium text-slate-700 block mb-2">New Password</label>
                      <input
                        type="password"
                        value={editFormData.newPassword}
                        onChange={(e) => setEditFormData({ ...editFormData, newPassword: e.target.value })}
                        placeholder="Enter new password"
                        className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                      />
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex gap-3 mt-6 pt-4 border-t border-slate-200">
                    <button
                      onClick={handleSaveProfile}
                      className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-lg font-medium transition-colors"
                    >
                      Save Changes
                    </button>
                    <button
                      onClick={() => setShowEditModal(false)}
                      className="flex-1 bg-slate-200 hover:bg-slate-300 text-slate-700 px-4 py-2 rounded-lg font-medium transition-colors"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {isOwnProfile && (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
                
                {/* MY POSTS CARD */}
                <div
                  onClick={() => navigate("/my-posts")}
                  className="group relative p-4 bg-slate-50 rounded-xl border border-slate-100 cursor-pointer hover:bg-white hover:border-emerald-200 hover:shadow-md transition-all duration-200 active:scale-95 active:bg-slate-100"
                >
                  <div className="flex justify-between items-center">
                    <div>
                      <span className="text-slate-400 text-xs font-bold uppercase tracking-wider">
                        My Posts
                      </span>
                      <p className="text-2xl font-bold text-slate-800 mt-1">
                        {myPostsData?.length || 0}
                      </p>
                    </div>
                  </div>
                </div>

                {/* SAVED POSTS CARD */}
                <div
                  onClick={() => navigate("/saved")}
                  className="group relative p-4 bg-slate-50 rounded-xl border border-slate-100 cursor-pointer hover:bg-white hover:border-emerald-200 hover:shadow-md transition-all duration-200 active:scale-95 active:bg-slate-100"
                >
                  <div className="flex justify-between items-center">
                    <div>
                      <span className="text-slate-400 text-xs font-bold uppercase tracking-wider">
                        Saved Posts
                      </span>
                      <p className="text-2xl font-bold text-slate-800 mt-1">
                        {user.savedPosts?.length || 0}
                      </p>
                    </div>
                  </div>
                </div>

              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default Profile;