import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { resetPassword, clearError } from "../features/auth/authSlice";
import { useParams, useNavigate, Link } from "react-router-dom";
import { Lock, CheckCircle2, AlertCircle, ArrowRight } from "lucide-react";

const ResetPassword = () => {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [localError, setLocalError] = useState("");
  
  const { token } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  
  const { loading, error, message } = useSelector((state) => state.auth);

  useEffect(() => {
    dispatch(clearError());
  }, [dispatch]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      setLocalError("Passwords do not match");
      return;
    }
    if (password.length < 6) {
      setLocalError("Password must be at least 6 characters");
      return;
    }
    setLocalError("");
    
    // Call the Thunk
    dispatch(resetPassword({ token, password }));
  };

  // If successful, redirect to login after 3 seconds
  useEffect(() => {
    if (message) {
      setTimeout(() => navigate("/login"), 3000);
    }
  }, [message, navigate]);

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-xl overflow-hidden border border-slate-200">
        
        <div className="bg-slate-900 p-6 text-center">
          <h2 className="text-2xl font-bold text-white">Reset Password</h2>
          <p className="text-slate-400 text-sm mt-1">
            Create a strong new password
          </p>
        </div>

        <div className="p-8">
          {message ? (
            <div className="text-center py-4">
              <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle2 className="text-emerald-600" size={32} />
              </div>
              <h3 className="text-lg font-bold text-slate-800">Success!</h3>
              <p className="text-slate-500 text-sm mt-2 mb-4">
                Your password has been updated. Redirecting to login...
              </p>
              <div className="w-full bg-slate-100 rounded-full h-1.5 overflow-hidden">
                <div className="bg-emerald-500 h-full animate-progress origin-left w-full"></div>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-5">
              {(error || localError) && (
                <div className="p-3 bg-red-50 border border-red-200 rounded-lg flex gap-3 items-start">
                  <AlertCircle className="text-red-600 mt-0.5" size={18} />
                  <p className="text-red-700 text-sm">{localError || error}</p>
                </div>
              )}

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">New Password</label>
                <div className="relative">
                  <Lock className="absolute left-3 top-3.5 text-slate-400" size={20} />
                  <input
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-lg outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
                    placeholder="••••••••"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Confirm Password</label>
                <div className="relative">
                  <Lock className="absolute left-3 top-3.5 text-slate-400" size={20} />
                  <input
                    type="password"
                    required
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-lg outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
                    placeholder="••••••••"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-lg transition-colors flex items-center justify-center gap-2"
              >
                {loading ? "Resetting..." : "Reset Password"}
                {!loading && <ArrowRight size={18} />}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default ResetPassword;