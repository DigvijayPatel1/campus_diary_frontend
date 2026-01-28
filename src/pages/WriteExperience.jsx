import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { useForm, useFieldArray } from "react-hook-form";
import {
  createInterview,
  getAllInterviews,
} from "../features/interview/interviewSlice";
import { Plus, Trash2 } from "lucide-react";
import { BRANCHES, DOMAINS } from "../constant.js";

const WriteExperience = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm({
    defaultValues: {
      company: "",
      role: "",
      branch: "Computer Science",
      domain: "Tech",
      type: "Full Time",
      rounds: [{ title: "Round 1", description: "" }],
      hr: "",
      offerDetails: "",
      tips: "",
      interviewDate: "",
    },
  });

  const { fields, append, remove } = useFieldArray({ control, name: "rounds" });

  const onSubmit = async (data) => {
    const payload = {
      author: { ...user, branch: data.branch },
      ...data,
      hrRound: data.hr,
    };
    const result = await dispatch(createInterview(payload));
    if (result.type === createInterview.fulfilled.type) {
      // Refetch the interviews list to show the newly created one
      await dispatch(getAllInterviews({}));
      navigate("/");
    }
  };

  return (
    <div className="max-w-3xl mx-auto w-full px-1">
      <div className="text-center mb-8">
        <h2 className="text-2xl md:text-3xl font-bold text-slate-900 mb-2">
          Share Your Experience
        </h2>
        <p className="text-slate-500 text-sm md:text-base">
          Your insights can help hundreds of juniors get placed.
        </p>
      </div>
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="bg-white p-6 md:p-8 rounded-2xl shadow-lg border border-slate-100"
      >
        <div className="grid md:grid-cols-2 gap-6 mb-8">
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">
              Company Name
            </label>
            <input
              {...register("company", { required: true })}
              className="w-full p-3 bg-slate-50 border border-slate-200 rounded-lg outline-none"
              placeholder="e.g. Google"
            />
            {errors.company && (
              <span className="text-xs text-red-500 mt-1">
                Company is required
              </span>
            )}
          </div>
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">
              Job Role
            </label>
            <input
              {...register("role", { required: true })}
              className="w-full p-3 bg-slate-50 border border-slate-200 rounded-lg outline-none"
              placeholder="e.g. SDE-1"
            />
            {errors.role && (
              <span className="text-xs text-red-500 mt-1">
                Role is required
              </span>
            )}
          </div>
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">
              Branch
            </label>
            <select
              {...register("branch")}
              className="w-full p-3 bg-slate-50 border border-slate-200 rounded-lg outline-none"
            >
              {BRANCHES.map((b) => (
                <option key={b} value={b}>
                  {b}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">
              Category
            </label>
            <select
              {...register("domain")}
              className="w-full p-3 bg-slate-50 border border-slate-200 rounded-lg outline-none"
            >
              {DOMAINS.map((d) => (
                <option key={d} value={d}>
                  {d}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">
              Type
            </label>
            <select
              {...register("type")}
              className="w-full p-3 bg-slate-50 border border-slate-200 rounded-lg outline-none"
            >
              <option value="Full Time">Full Time Placement</option>
              <option value="Internship">Internship</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">
              Interview Date (Optional)
            </label>
            <input
              {...register("interviewDate")}
              type="text"
              className="w-full p-3 bg-slate-50 border border-slate-200 rounded-lg outline-none"
              placeholder="e.g. 5 Dec 2024 or Aug 2024"
            />
          </div>
        </div>
        <div className="space-y-6 mb-8 border-t border-slate-100 pt-6">
          <h3 className="text-lg font-bold text-slate-800 flex items-center gap-2">
            Interview Rounds
          </h3>
          {fields.map((field, index) => (
            <div
              key={field.id}
              className="bg-slate-50 p-4 rounded-xl border border-slate-200 relative"
            >
              <div className="flex justify-between items-center mb-3">
                <input
                  {...register(`rounds.${index}.title`)}
                  className="bg-transparent font-bold text-slate-700 text-sm focus:outline-none border-b border-transparent w-1/2"
                  placeholder="Round Title"
                />
                {fields.length > 1 && (
                  <button
                    type="button"
                    onClick={() => remove(index)}
                    className="text-slate-400 hover:text-red-500 p-1"
                  >
                    <Trash2 size={16} />
                  </button>
                )}
              </div>
              <textarea
                {...register(`rounds.${index}.description`, { required: true })}
                className="w-full p-3 bg-white border border-slate-200 rounded-lg outline-none h-24 text-sm"
                placeholder="Describe questions..."
              />
            </div>
          ))}
          <button
            type="button"
            onClick={() =>
              append({ title: `Round ${fields.length + 1}`, description: "" })
            }
            className="w-full py-3 border-2 border-dashed border-slate-200 rounded-xl text-slate-500 font-medium hover:text-emerald-600 flex items-center justify-center gap-2"
          >
            <Plus size={18} /> Add Round
          </button>
        </div>
        <div className="space-y-6 mb-8 border-t border-slate-100 pt-6">
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">
              HR Round
            </label>
            <textarea
              {...register("hr")}
              className="w-full p-3 bg-slate-50 border border-slate-200 rounded-lg outline-none h-24"
              placeholder="Behavioral questions..."
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">
              Offer (Optional)
            </label>
            <input
              {...register("offerDetails")}
              type="text"
              className="w-full p-3 bg-green-50/50 border border-green-200 rounded-lg outline-none"
              placeholder="12 LPA"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">
              Golden Advice
            </label>
            <textarea
              {...register("tips", { required: true })}
              className="w-full p-3 bg-amber-50 border border-amber-200 rounded-lg outline-none h-20"
              placeholder="Tips for juniors..."
            />
            {errors.tips && (
              <span className="text-xs text-red-500 mt-1">
                Advice is required
              </span>
            )}
          </div>
        </div>
        <button
          type="submit"
          className="w-full py-4 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl shadow-lg"
        >
          Publish
        </button>
      </form>
    </div>
  );
};

export default WriteExperience;
