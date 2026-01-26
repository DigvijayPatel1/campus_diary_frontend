import React, { useState, useEffect } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import {
  GraduationCap,
  Building2,
  MessageSquare,
  PenTool,
  Code,
  User,
  LogOut,
  Menu,
  X,
  ChevronRight
} from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "../../features/auth/authSlice";
import { AVATAR_MAP } from "../../constant.js";

function NavBar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user, isAuthenticated } = useSelector((state) => state.auth);

  // Added: Lock body scroll when mobile menu is open
  useEffect(() => {
    if (isMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
  }, [isMenuOpen]);

  const navClass = ({ isActive }) =>
    `flex items-center gap-2 text-sm font-medium transition-colors ${
      isActive ? "text-emerald-400" : "text-slate-300 hover:text-white"
    }`;

  const handleLogout = () => {
    dispatch(logout());
    navigate("/");
    setIsMenuOpen(false);
  };

  return (
    <nav className="sticky top-0 z-50 bg-slate-900 text-white shadow-lg w-full">
      <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
        
        {/* --- LEFT SIDE: Mobile Menu + Logo --- */}
        <div className="flex items-center gap-3">
          {/* Mobile Hamburger (Visible only on Mobile) */}
          <button
            className="md:hidden p-1 text-slate-300 hover:text-white"
            onClick={() => setIsMenuOpen(true)}
          >
            <Menu size={26} />
          </button>

          {/* LOGO SECTION (Shared) */}
          <Link
            to="/"
            className="flex items-center gap-2 cursor-pointer shrink-0"
          >
            <GraduationCap className="text-emerald-400" size={28} />
            <span className="text-xl font-bold tracking-tight">
              Campus<span className="text-emerald-400">Diary</span>
            </span>
          </Link>
        </div>

        {/* --- DESKTOP MENU (EXACTLY AS PROVIDED) --- */}
        <div className="hidden md:flex items-center gap-6">
          <NavLink to="/" className={navClass}>
            <Building2 size={18} /> <span>Interview Exp</span>
          </NavLink>
          <NavLink to="/discussion" className={navClass}>
            <MessageSquare size={18} /> <span>Campus Buzz</span>
          </NavLink>
          <NavLink to="/developers" className={navClass}>
            <Code size={18} /> <span>Developers</span>
          </NavLink>
          {isAuthenticated ? (
            <>
              <NavLink to="/write" className={navClass}>
                <PenTool size={18} /> <span>Share Story</span>
              </NavLink>
              <div className="h-6 w-px bg-slate-700 mx-2"></div>
              <NavLink to="/profile" className={navClass}>
                <img
                  src={AVATAR_MAP[user?.avatar] || AVATAR_MAP["a1"]}
                  className="w-6 h-6 rounded-full border border-slate-600 object-cover"
                  alt="profile"
                  onError={(e) => (e.target.src = AVATAR_MAP["a1"])}
                />
                <span>{user.name.split(" ")[0]}</span>
              </NavLink>
            </>
          ) : (
            <Link
              to="/login"
              className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-sm font-medium transition-colors"
            >
              Sign In
            </Link>
          )}
        </div>

        {/* --- RIGHT SIDE: Mobile Auth (New, matches Flipkart top-right) --- */}
        <div className="md:hidden">
            {isAuthenticated ? (
               <Link to="/profile">
                  <img
                    src={AVATAR_MAP[user?.avatar] || AVATAR_MAP["a1"]}
                    className="w-8 h-8 rounded-full border border-slate-600 object-cover"
                    alt="profile"
                  />
               </Link>
            ) : (
              <Link
                to="/login"
                className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-sm font-medium transition-colors"
              >
                Sign In
              </Link>
            )}
        </div>
      </div>

      {/* --- MOBILE DRAWER OVERLAY (New Functionality) --- */}
      {isMenuOpen && (
        <div className="fixed inset-0 z-50 md:hidden">
          
          {/* Dark Backdrop */}
          <div 
            className="absolute inset-0 bg-black/70 backdrop-blur-sm"
            onClick={() => setIsMenuOpen(false)}
          ></div>

          {/* Side Drawer */}
          <div className="absolute top-0 left-0 h-full w-[85%] max-w-sm bg-slate-900 shadow-2xl flex flex-col animation-slide-in">
            
            {/* Drawer Header */}
            <div className="bg-slate-800 p-6 flex flex-col justify-between border-b border-slate-700 relative">
              <button 
                onClick={() => setIsMenuOpen(false)}
                className="absolute top-4 right-4 text-slate-400 hover:text-white"
              >
                <X size={24} />
              </button>

              {isAuthenticated ? (
                <div className="flex items-center gap-4 mt-2">
                   <img
                      src={AVATAR_MAP[user?.avatar] || AVATAR_MAP["a1"]}
                      className="w-12 h-12 rounded-full border-2 border-emerald-500 object-cover"
                      alt="profile"
                   />
                   <div>
                     <p className="text-lg font-semibold text-white">{user.name}</p>
                     <Link to="/profile" onClick={() => setIsMenuOpen(false)} className="text-sm text-emerald-400 hover:underline">
                        View Profile
                     </Link>
                   </div>
                </div>
              ) : (
                <div className="mt-2">
                   <h3 className="text-xl font-bold text-white mb-1">Welcome Guest</h3>
                   <div className="flex gap-2 text-sm text-slate-300">
                      <Link to="/login" onClick={() => setIsMenuOpen(false)} className="text-emerald-400 font-semibold">Login</Link>
                      <span>or</span>
                      <Link to="/signup" onClick={() => setIsMenuOpen(false)} className="text-emerald-400 font-semibold">Sign Up</Link>
                   </div>
                </div>
              )}
            </div>

            {/* Drawer Links List */}
            <div className="flex-1 overflow-y-auto py-2">
               <div className="flex flex-col">
                  <Link to="/" onClick={() => setIsMenuOpen(false)} className="flex items-center gap-4 px-6 py-4 text-slate-300 hover:bg-slate-800 hover:text-white border-b border-slate-800">
                     <Building2 size={20} />
                     <span className="text-base font-medium flex-1">Interview Exp</span>
                     <ChevronRight size={16} className="text-slate-600" />
                  </Link>

                  <Link to="/discussion" onClick={() => setIsMenuOpen(false)} className="flex items-center gap-4 px-6 py-4 text-slate-300 hover:bg-slate-800 hover:text-white border-b border-slate-800">
                     <MessageSquare size={20} />
                     <span className="text-base font-medium flex-1">Campus Buzz</span>
                     <ChevronRight size={16} className="text-slate-600" />
                  </Link>

                  <Link to="/developers" onClick={() => setIsMenuOpen(false)} className="flex items-center gap-4 px-6 py-4 text-slate-300 hover:bg-slate-800 hover:text-white border-b border-slate-800">
                     <Code size={20} />
                     <span className="text-base font-medium flex-1">Developers</span>
                     <ChevronRight size={16} className="text-slate-600" />
                  </Link>

                  {isAuthenticated && (
                    <Link to="/write" onClick={() => setIsMenuOpen(false)} className="flex items-center gap-4 px-6 py-4 text-slate-300 hover:bg-slate-800 hover:text-white border-b border-slate-800">
                       <PenTool size={20} />
                       <span className="text-base font-medium flex-1">Share Story</span>
                       <ChevronRight size={16} className="text-slate-600" />
                    </Link>
                  )}
               </div>
            </div>

            {/* Drawer Footer */}
            {isAuthenticated && (
              <div className="p-4 border-t border-slate-800">
                 <button onClick={handleLogout} className="flex items-center justify-center gap-2 w-full py-3 text-red-400 hover:bg-slate-800 rounded-lg transition-colors font-medium">
                    <LogOut size={20} /> Sign Out
                 </button>
              </div>
            )}

          </div>
        </div>
      )}
    </nav>
  );
}

export default NavBar;