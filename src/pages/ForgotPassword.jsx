import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { forgotPassword, clearError } from "../features/auth/authSlice";
import { Mail, ArrowLeft, CheckCircle2, AlertCircle } from "lucide-react";
import { Link } from "react-router-dom";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const dispatch = useDispatch();
  
  const { loading, error, message } = useSelector((state) => state.auth);

  useEffect(() => {
    dispatch(clearError());
  }, [dispatch]);

  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch(forgotPassword(email));
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-xl overflow-hidden border border-slate-200">
        
        {/* Header */}
        <div className="bg-slate-900 p-6 text-center">
          <h2 className="text-2xl font-bold text-white">Forgot Password?</h2>
          <p className="text-slate-400 text-sm mt-1">
            No worries, we'll send you reset instructions.
          </p>
        </div>

        <div className="p-8">
          {/* Success State */}
          {message ? (
            <div className="text-center">
              <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle2 className="text-emerald-600" size={32} />
              </div>
              <h3 className="text-lg font-bold text-slate-800">Email Sent!</h3>
              <p className="text-slate-500 text-sm mt-2 mb-6">
                Check <strong>{email}</strong> for instructions to reset your password.
              </p>
              <Link 
                to="/login"
                className="block w-full py-3 bg-slate-900 text-white rounded-lg font-semibold hover:bg-slate-800 transition-colors text-center"
              >
                Back to Login
              </Link>
            </div>
          ) : (
            /* Form State */
            <form onSubmit={handleSubmit} className="space-y-6">
              {error && (
                <div className="p-3 bg-red-50 border border-red-200 rounded-lg flex gap-3 items-start">
                  <AlertCircle className="text-red-600 mt-0.5" size={18} />
                  <p className="text-red-700 text-sm">{error}</p>
                </div>
              )}
              
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Email Address</label>
                <div className="relative">
                  <Mail className="absolute left-3 top-3.5 text-slate-400" size={20} />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-lg outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all"
                    placeholder="Enter your registered email"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? "Sending Link..." : "Send Reset Link"}
              </button>

              <div className="text-center">
                <Link to="/login" className="inline-flex items-center text-sm text-slate-500 hover:text-slate-800 font-medium">
                  <ArrowLeft size={16} className="mr-2" />
                  Back to Login
                </Link>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;