import { useDispatch, useSelector } from "react-redux";
import { useNavigate, Link } from "react-router-dom";
import { login, register, clearError } from "../features/auth/authSlice";
import { GraduationCap, AlertCircle, CheckCircle2 } from "lucide-react";
import { BRANCHES } from "../constant.js";
import { useState, useEffect } from "react";

const AuthPage = ({ type }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  
  const { error, loading, isAuthenticated, message } = useSelector((state) => state.auth);
  
  const isLogin = type === "login";
  
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    name: "",
    branch: "Computer Science",
    batch: "",
    avatarId: "a1"
  });

  // Clear previous errors or success messages when switching between Login/Register
  useEffect(() => {
    dispatch(clearError());
  }, [type, dispatch]);

  // Navigate to Home ONLY if actually logged in
  useEffect(() => {
    if (isAuthenticated && !loading) {
      navigate("/");
    }
  }, [isAuthenticated, loading, navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (isLogin) {
      dispatch(login({
        email: formData.email,
        password: formData.password,
      }));
    } else {
      dispatch(register({
        name: formData.name,
        email: formData.email,
        password: formData.password,
        branch: formData.branch,
        batch: formData.batch,
        avatarId: formData.avatarId,
      }));
    }
  };
  
  //SUCCESS STATE: If registered successfully, show "Check Email" screen instead of form
  if (!isLogin && message) {
    return (
      <div className="max-w-md mx-auto w-full pt-10 px-4">
        <div className="bg-white rounded-2xl shadow-xl border border-slate-200 overflow-hidden">
          <div className="bg-slate-900 p-6 text-center">
            <GraduationCap className="text-emerald-400 mx-auto mb-2" size={40} />
            <h2 className="text-2xl font-bold text-white">Check Your Email</h2>
            <p className="text-slate-400 text-sm">Action Required</p>
          </div>
          <div className="p-8 text-center">
            <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle2 className="text-emerald-600" size={32} />
            </div>
            <h3 className="text-xl font-bold text-slate-800 mb-2">Registration Successful!</h3>
            <p className="text-slate-500 mb-6 text-sm">
              We've sent a verification link to <strong>{formData.email}</strong>. 
              <br/>Please verify your email before logging in.
            </p>
            <button
              onClick={() => {
                dispatch(clearError()); // Clear the message so form resets
                navigate("/login");     // Go to login page
              }}
              className="w-full py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-lg transition-colors"
            >
              Go to Login
            </button>
          </div>
        </div>
      </div>
    );
  }

  //FORM STATE: Standard Login/Register Form
  return (
    <div className="max-w-md mx-auto w-full pt-10 px-4">
      <div className="bg-white rounded-2xl shadow-xl border border-slate-200 overflow-hidden">
        <div className="bg-slate-900 p-6 text-center">
          <GraduationCap className="text-emerald-400 mx-auto mb-2" size={40} />
          <h2 className="text-2xl font-bold text-white">
            {isLogin ? "Welcome Back" : "Join NIT Connect"}
          </h2>
          <p className="text-slate-400 text-sm">
            {isLogin
              ? "Sign in to access your account"
              : "Create your student account"}
          </p>
        </div>
        <div className="p-8">
          {error && (
            <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg flex gap-3 items-start">
              <AlertCircle className="text-red-600 flex-shrink-0 mt-0.5" size={20} />
              <div>
                <p className="text-red-800 text-sm font-semibold">Error:</p>
                <p className="text-red-700 text-sm">{error}</p>
              </div>
            </div>
          )}
          {isLogin && (
            <p className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-lg text-blue-700 text-xs">
              💡 Use your NITC email
            </p>
          )}
          <form onSubmit={handleSubmit} className="space-y-4">
            {!isLogin && (
              <>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  className="w-full p-3 bg-slate-50 border border-slate-200 rounded-lg outline-none"
                  placeholder="Full Name"
                />
                <select 
                  name="branch"
                  value={formData.branch}
                  onChange={handleChange}
                  className="w-full p-3 bg-slate-50 border border-slate-200 rounded-lg outline-none"
                >
                  {BRANCHES.map((b) => (
                    <option key={b}>{b}</option>
                  ))}
                </select>
                <input
                  type="text"
                  name="batch"
                  value={formData.batch}
                  onChange={handleChange}
                  required
                  className="w-full p-3 bg-slate-50 border border-slate-200 rounded-lg outline-none"
                  placeholder="Batch Year (e.g., 2024)"
                />
              </>
            )}
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              className="w-full p-3 bg-slate-50 border border-slate-200 rounded-lg outline-none"
              placeholder="rollno@nit.ac.in"
            />
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
              className="w-full p-3 bg-slate-50 border border-slate-200 rounded-lg outline-none"
              placeholder="••••••••"
            />
            {isLogin && (
              <div className="flex justify-end">
                <Link 
                  to="/forgot-password"
                  className="text-sm text-emerald-600 hover:text-emerald-700 font-medium hover:underline"
                >
                  Forgot Password?
                </Link>
              </div>
            )}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-lg mt-6 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (isLogin ? "Signing In..." : "Creating Account...") : (isLogin ? "Sign In" : "Create Account")}
            </button>
          </form>
          <div className="mt-6 text-center">
            {isLogin ? (
              <p className="text-sm text-slate-500">
                Don't have an account?{" "}
                <Link
                  to="/register"
                  className="text-emerald-600 font-bold hover:underline"
                >
                  Sign Up
                </Link>
              </p>
            ) : (
              <p className="text-sm text-slate-500">
                Already have an account?{" "}
                <Link
                  to="/login"
                  className="text-emerald-600 font-bold hover:underline"
                >
                  Sign In
                </Link>
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthPage;