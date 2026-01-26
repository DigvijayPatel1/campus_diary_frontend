import { useEffect, useState, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux"; // ✅ Redux Imports
import { verifyEmail } from "../features/auth/authSlice"; // ✅ Import Action
import { GraduationCap, CheckCircle2, XCircle, Loader2 } from "lucide-react";

const VerifyEmail = () => {
  const { token } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const verifyCalled = useRef(false);

  const [status, setStatus] = useState("verifying");

  useEffect(() => {
    if (!token) return;

    if (verifyCalled.current) return;
    verifyCalled.current = true;

    if (token) {
      dispatch(verifyEmail(token))
        .unwrap()
        .then(() => {
          setStatus("success");
          setTimeout(() => navigate("/login"), 3000);
        })
        .catch(() => {
          setStatus("error");
        });
    }
  }, [token, dispatch, navigate]);

  return (
    <div className="max-w-md mx-auto w-full pt-10 px-4">
      <div className="bg-white rounded-2xl shadow-xl border border-slate-200 overflow-hidden">
        
        {/* Header - Matches AuthPage exactly */}
        <div className="bg-slate-900 p-6 text-center">
          <GraduationCap className="text-emerald-400 mx-auto mb-2" size={40} />
          <h2 className="text-2xl font-bold text-white">
            Email Verification
          </h2>
          <p className="text-slate-400 text-sm">
            Validating your student identity
          </p>
        </div>

        <div className="p-8">
          {/* Loading State */}
          {status === "verifying" && (
            <div className="text-center py-4">
              <Loader2 className="animate-spin text-emerald-600 mx-auto mb-4" size={48} />
              <h3 className="text-lg font-semibold text-slate-800">Verifying...</h3>
              <p className="text-slate-500 text-sm mt-2">
                Please wait while we confirm your email.
              </p>
            </div>
          )}

          {/* Success State */}
          {status === "success" && (
            <div className="text-center py-2">
              <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle2 className="text-emerald-600" size={32} />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-2">Verified Successfully!</h3>
              <p className="text-slate-500 text-sm mb-6">
                Your account has been activated. Redirecting you to login...
              </p>
              <div className="w-full bg-slate-100 rounded-full h-1.5 overflow-hidden">
                <div className="bg-emerald-500 h-full animate-progress origin-left w-full"></div>
              </div>
            </div>
          )}

          {/* Error State */}
          {status === "error" && (
            <div className="text-center">
              <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex flex-col items-center gap-2">
                <XCircle className="text-red-600" size={32} />
                <div>
                  <p className="text-red-800 font-semibold">Verification Failed</p>
                  <p className="text-red-600 text-xs mt-1">
                    The link is invalid or has expired.
                  </p>
                </div>
              </div>
              
              <button
                onClick={() => navigate("/login")}
                className="w-full py-3 bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-lg transition-colors"
              >
                Back to Login
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default VerifyEmail;