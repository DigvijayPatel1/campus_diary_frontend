import { useEffect, useState } from "react";
import { Outlet } from "react-router-dom";
import Loading from "./components/common/Loading"
import Navbar from "./components/layout/NavBar"

export default function App() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    dispatch(getCurrentUser())
      .finally(() => {
        setLoading(false);
      });
  }, [dispatch]);

  if (loading) return <Loading />;

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-900 selection:bg-emerald-100 selection:text-emerald-900 overflow-x-hidden">
      <Navbar />

      <main className="max-w-6xl mx-auto px-4 py-8 w-full">
        {/* All routed pages render here */}
        <Outlet />
      </main>
    </div>
  );
}
