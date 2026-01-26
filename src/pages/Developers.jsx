import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { 
  Github, Linkedin, Instagram, Code2, Loader2, AlertCircle, 
  Plus, Trash2, Edit2, X, Save, Upload, Image as ImageIcon, ExternalLink
} from "lucide-react";
import { 
  getAllDevelopers, 
  createDeveloper, 
  updateDeveloper, 
  deleteDeveloper 
} from "../features/developer/developerSlice";

const INITIAL_FORM_STATE = {
  name: "",
  role: "Full Stack Developer",
  socialLinks: {
    github: "",
    linkedin: "",
    instagram: "" 
  }
};

const Developers = () => {
  const dispatch = useDispatch();
  // Optimized selector to prevent re-render warnings
  const developers = useSelector((state) => state.developers.developers);
  const loading = useSelector((state) => state.developers.loading);
  const error = useSelector((state) => state.developers.error);
  const { user } = useSelector((state) => state.auth);

  const [showModal, setShowModal] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [selectedDevId, setSelectedDevId] = useState(null);
  const [formData, setFormData] = useState(INITIAL_FORM_STATE);
  const [photoFile, setPhotoFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const isAdmin = user?.role === 'admin' || user?.isAdmin; 

  useEffect(() => {
    dispatch(getAllDevelopers());
  }, [dispatch]);

  useEffect(() => {
    return () => {
      if (previewUrl && previewUrl.startsWith('blob:')) {
        URL.revokeObjectURL(previewUrl);
      }
    };
  }, [previewUrl]);

  // --- Handlers ---
  const handleAddNew = () => {
    setFormData(INITIAL_FORM_STATE);
    setPhotoFile(null);
    setPreviewUrl(null);
    setIsEditing(false);
    setSelectedDevId(null);
    setShowModal(true);
  };

  const handleEdit = (dev) => {
    setFormData({
      name: dev.name,
      role: dev.role || "Full Stack Developer",
      socialLinks: {
        github: dev.socialLinks?.github || "",
        linkedin: dev.socialLinks?.linkedin || "",
        instagram: dev.socialLinks?.instagram || ""
      }
    });
    setPreviewUrl(dev.photoUrl || null); 
    setPhotoFile(null);
    setIsEditing(true);
    setSelectedDevId(dev._id);
    setShowModal(true);
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setPhotoFile(file);
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this developer?")) {
      await dispatch(deleteDeveloper(id));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    const data = new FormData();
    data.append("name", formData.name);
    data.append("role", formData.role);
    data.append("socialLinks[github]", formData.socialLinks.github);
    data.append("socialLinks[linkedin]", formData.socialLinks.linkedin);
    data.append("socialLinks[instagram]", formData.socialLinks.instagram);

    if (photoFile) {
      data.append("photo", photoFile);
    }

    try {
      if (isEditing) {
        // Passing ID and Data separately to fix the 400 error
        await dispatch(updateDeveloper({ id: selectedDevId, data })).unwrap();
      } else {
        await dispatch(createDeveloper(data)).unwrap();
      }
      setShowModal(false);
      setFormData(INITIAL_FORM_STATE);
      setPhotoFile(null);
      setPreviewUrl(null);
    } catch (err) {
      console.error("Failed to save:", err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (name.includes('.')) {
      const [parent, child] = name.split('.');
      setFormData(prev => ({
        ...prev,
        [parent]: { ...prev[parent], [child]: value }
      }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  if (loading && developers.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh] text-slate-500 gap-3">
        <Loader2 className="animate-spin text-emerald-600" size={40} />
        <p>Loading developers...</p>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto w-full pb-12 px-4 relative">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-center mb-16 pt-8 gap-4">
        <div className="text-center md:text-left">
          <h1 className="text-3xl font-bold text-slate-900 mb-2 flex items-center gap-2">
            <Code2 className="text-emerald-600" /> Meet the Developers
          </h1>
          <p className="text-slate-500">The minds behind the platform</p>
        </div>
        
        {isAdmin && (
          <button
            onClick={handleAddNew}
            className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white px-5 py-2.5 rounded-xl font-medium shadow-md shadow-emerald-200 transition-all hover:scale-105 active:scale-95"
          >
            <Plus size={20} /> Add Developer
          </button>
        )}
      </div>

      {error && (
        <div className="mb-6 p-4 bg-red-50 text-red-700 rounded-xl flex items-center gap-3 border border-red-100">
          <AlertCircle size={20} />
          {typeof error === 'string' ? error : "Something went wrong"}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-10">
        {developers.map((dev) => (
          <div 
            key={dev._id} 
            className="bg-white rounded-2xl shadow-lg overflow-hidden border border-slate-100 hover:shadow-xl transition-all duration-300 group relative flex flex-col"
          >
            {isAdmin && (
              <div className="absolute top-3 right-3 z-10 flex gap-2 opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-opacity">
                <button 
                  onClick={() => handleEdit(dev)}
                  className="p-2 bg-white/90 text-slate-600 hover:text-emerald-600 rounded-lg shadow-sm hover:shadow-md backdrop-blur-sm active:scale-95 transition-transform"
                >
                  <Edit2 size={16} />
                </button>
                <button 
                  onClick={() => handleDelete(dev._id)}
                  className="p-2 bg-white/90 text-slate-600 hover:text-red-600 rounded-lg shadow-sm hover:shadow-md backdrop-blur-sm active:scale-95 transition-transform"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            )}

            {/* Banner Area */}
            <div className="h-32 md:h-40 bg-gradient-to-r from-slate-800 to-slate-900" />

            <div className="px-6 pb-8 flex-1 flex flex-col items-center">
              
              <div className="relative -top-14 md:-top-18 mb-[-3.5rem] md:mb-[-4.5rem] flex justify-center group/photo">
                <a 
                  href={dev.photoUrl || "/avatar/a1.png"} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="relative cursor-pointer"
                  title="View full photo"
                >
                  <img
                    src={dev.photoUrl || "/avatar/a1.png"}
                    alt={dev.name}
                    className="w-28 h-28 md:w-36 md:h-36 rounded-full border-[6px] border-white bg-white object-cover shadow-lg transition-transform group-hover/photo:scale-105"
                    onError={(e) => { e.target.onerror = null; e.target.src = "/avatar/a1.png"; }}
                  />
                  <div className="absolute bottom-2 right-2 bg-black/50 p-1.5 rounded-full text-white opacity-0 group-hover/photo:opacity-100 transition-opacity">
                    <ExternalLink size={12} />
                  </div>
                </a>
              </div>

              {/* Card Content */}
              <div className="text-center mt-16 md:mt-20 flex-1 flex flex-col justify-between w-full">
                <div>
                  <h2 className="text-2xl md:text-3xl font-bold text-slate-900 mb-2">{dev.name}</h2>
                  <p className="text-emerald-600 font-semibold text-base md:text-lg mb-6">{dev.role}</p>
                </div>
                
                {/* Social Links */}
                <div className="flex justify-center gap-5 pt-6 border-t border-slate-100">
                  {dev.socialLinks?.github && (
                    <a href={dev.socialLinks.github} target="_blank" rel="noopener noreferrer" className="p-3 bg-slate-100 text-slate-700 rounded-full hover:bg-slate-800 hover:text-white transition-all transform hover:scale-110 shadow-sm active:scale-95">
                      <Github size={22} />
                    </a>
                  )}
                  {dev.socialLinks?.linkedin && (
                    <a href={dev.socialLinks.linkedin} target="_blank" rel="noopener noreferrer" className="p-3 bg-blue-50 text-blue-600 rounded-full hover:bg-blue-600 hover:text-white transition-all transform hover:scale-110 shadow-sm active:scale-95">
                      <Linkedin size={22} />
                    </a>
                  )}
                  {dev.socialLinks?.instagram && (
                    <a href={dev.socialLinks.instagram} target="_blank" rel="noopener noreferrer" className="p-3 bg-pink-50 text-pink-600 rounded-full hover:bg-pink-600 hover:text-white transition-all transform hover:scale-110 shadow-sm active:scale-95">
                      <Instagram size={22} />
                    </a>
                  )}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* --- ADD / EDIT MODAL --- */}
      {showModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-in fade-in duration-200">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-hidden flex flex-col">
            
            <div className="p-5 border-b border-slate-100 flex justify-between items-center bg-slate-50">
              <h2 className="text-lg font-bold text-slate-800">
                {isEditing ? "Edit Developer" : "Add New Developer"}
              </h2>
              <button 
                onClick={() => setShowModal(false)}
                className="p-2 hover:bg-slate-200 rounded-full text-slate-500 transition-colors"
              >
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 space-y-5">
              
              <div className="flex flex-col items-center gap-4">
                <div className="relative group">
                  <div className="w-32 h-32 rounded-full border-4 border-slate-100 overflow-hidden bg-slate-50 flex items-center justify-center shadow-inner">
                    {previewUrl ? (
                      <img 
                        src={previewUrl} 
                        alt="Preview" 
                        className="w-full h-full object-cover" 
                      />
                    ) : (
                      <ImageIcon className="text-slate-300" size={32} />
                    )}
                  </div>
                  <label className="absolute bottom-1 right-1 bg-emerald-600 text-white p-2.5 rounded-full cursor-pointer hover:bg-emerald-700 shadow-lg transition-all hover:scale-105 border-2 border-white">
                    <Upload size={18} />
                    <input 
                      type="file" 
                      accept="image/*" 
                      onChange={handleFileChange} 
                      className="hidden" 
                    />
                  </label>
                </div>
                <p className="text-xs text-slate-400 font-medium uppercase tracking-wide">
                  {isEditing ? "Tap to change photo" : "Tap to upload photo"}
                </p>
              </div>

              <div className="space-y-4">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-wider ml-1">Name</label>
                  <input
                    required
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 outline-none transition-all font-medium"
                    placeholder="e.g. Alex Johnson"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-wider ml-1">Role</label>
                  <input
                    name="role"
                    value={formData.role}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 outline-none transition-all font-medium"
                    placeholder="e.g. Lead Developer"
                  />
                </div>
              </div>

              <div className="pt-4 border-t border-slate-100">
                <h3 className="text-sm font-bold text-slate-800 mb-4 ml-1">Social Profiles</h3>
                <div className="grid grid-cols-1 gap-3">
                  <div className="relative">
                    <Github className="absolute left-4 top-3.5 text-slate-400" size={18} />
                    <input
                      name="socialLinks.github"
                      value={formData.socialLinks.github}
                      onChange={handleInputChange}
                      placeholder="GitHub Profile URL"
                      className="w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:border-emerald-500 outline-none transition-all"
                    />
                  </div>
                  <div className="relative">
                    <Linkedin className="absolute left-4 top-3.5 text-blue-400" size={18} />
                    <input
                      name="socialLinks.linkedin"
                      value={formData.socialLinks.linkedin}
                      onChange={handleInputChange}
                      placeholder="LinkedIn Profile URL"
                      className="w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:border-emerald-500 outline-none transition-all"
                    />
                  </div>
                  <div className="relative">
                    <Instagram className="absolute left-4 top-3.5 text-pink-400" size={18} />
                    <input
                      name="socialLinks.instagram"
                      value={formData.socialLinks.instagram}
                      onChange={handleInputChange}
                      placeholder="Instagram Profile URL"
                      className="w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:border-emerald-500 outline-none transition-all"
                    />
                  </div>
                </div>
              </div>

              <div className="pt-2 flex gap-3">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="flex-1 px-4 py-3 border border-slate-200 text-slate-600 rounded-xl hover:bg-slate-50 font-semibold transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="flex-1 px-4 py-3 bg-emerald-600 text-white rounded-xl hover:bg-emerald-700 font-semibold flex justify-center items-center gap-2 shadow-lg shadow-emerald-200 disabled:opacity-70 disabled:cursor-not-allowed transition-all active:scale-95"
                >
                  {isSubmitting ? <Loader2 className="animate-spin" size={20} /> : <><Save size={20} /> Save Changes</>}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Developers;