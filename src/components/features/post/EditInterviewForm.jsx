import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { useForm, useFieldArray } from "react-hook-form";
import { updateInterview } from "../../../features/interview/interviewSlice";
import { Plus, Trash2, X } from "lucide-react";
import { DOMAINS } from "../../../constant";

const EditInterviewForm = ({ post, onCancel, onSuccess }) => {
  const dispatch = useDispatch();

  const {
    register,
    handleSubmit,
    control,
    reset,
    formState: { errors, isSubmitting },
  } = useForm({
    defaultValues: {
      company: "",
      role: "",
      domain: "Tech",
      type: "Full Time",
      rounds: [],
      hr: "",
      offer: "",
      tips: "",
      interviewDate: "",
    },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "rounds",
  });

  // Sync existing post data to form
  useEffect(() => {
    if (post) {
      reset({
        company: post.company || "",
        role: post.role || "",
        domain: post.domain || "Tech",
        type: post.type || "Full Time",
        rounds: post.rounds || [],
        hr: post.hrRound || "",
        offer: post.offer || "",
        tips: post.tips || "",
        interviewDate: post.interviewDate || "",
      });
    }
  }, [post, reset]);

  const onSubmit = async (data) => {
    const payload = {
      ...data,
      hrRound: data.hr, // Map form 'hr' back to backend 'hrRound'
    };

    try {
      await dispatch(updateInterview({ id: post._id, data: payload })).unwrap();
      onSuccess();
    } catch (error) {
      console.error(error);
      alert("Failed to update experience.");
    }
  };

  return (
    <div className="max-w-3xl mx-auto w-full px-1 py-6">
      <div className="text-center mb-8 relative">
        <h2 className="text-2xl md:text-3xl font-bold text-slate-900 mb-2">
          Edit Experience
        </h2>
        <p className="text-slate-500 text-sm md:text-base">
          Update your shared insights.
        </p>
        <button
          onClick={onCancel}
          className="absolute top-0 right-0 p-2 text-slate-400 hover:text-slate-600 bg-slate-100 rounded-full transition-colors"
        >
          <X size={20} />
        </button>
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
              className="w-full p-3 bg-slate-50 border border-slate-200 rounded-lg outline-none focus:ring-2 focus:ring-emerald-500 transition-all"
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
              className="w-full p-3 bg-slate-50 border border-slate-200 rounded-lg outline-none focus:ring-2 focus:ring-emerald-500 transition-all"
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
              Category
            </label>
            <select
              {...register("domain")}
              className="w-full p-3 bg-slate-50 border border-slate-200 rounded-lg outline-none focus:ring-2 focus:ring-emerald-500 transition-all"
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
              className="w-full p-3 bg-slate-50 border border-slate-200 rounded-lg outline-none focus:ring-2 focus:ring-emerald-500 transition-all"
            >
              <option value="Full Time">Full Time</option>
              <option value="Internship">Internship</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">
              Interview Date (Optional)
            </label>
            <input
              {...register("interviewDate")}
              className="w-full p-3 bg-slate-50 border border-slate-200 rounded-lg outline-none focus:ring-2 focus:ring-emerald-500 transition-all"
              placeholder="e.g. 5 Dec 2024"
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
                  className="bg-transparent font-bold text-slate-700 text-sm focus:outline-none border-b border-transparent focus:border-emerald-500 w-1/2 transition-all"
                  placeholder="Round Title"
                />
                {fields.length > 1 && (
                  <button
                    type="button"
                    onClick={() => remove(index)}
                    className="text-slate-400 hover:text-red-500 p-1 transition-colors"
                  >
                    <Trash2 size={16} />
                  </button>
                )}
              </div>
              <textarea
                {...register(`rounds.${index}.description`, { required: true })}
                className="w-full p-3 bg-white border border-slate-200 rounded-lg outline-none h-24 text-sm focus:border-emerald-500 transition-all"
                placeholder="Describe questions..."
              />
            </div>
          ))}
          <button
            type="button"
            onClick={() =>
              append({ title: `Round ${fields.length + 1}`, description: "" })
            }
            className="w-full py-3 border-2 border-dashed border-slate-200 rounded-xl text-slate-500 font-medium hover:text-emerald-600 hover:border-emerald-500 flex items-center justify-center gap-2 transition-all"
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
              className="w-full p-3 bg-slate-50 border border-slate-200 rounded-lg outline-none h-24 focus:ring-2 focus:ring-emerald-500 transition-all"
              placeholder="Behavioral questions..."
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">
              Offer (Optional)
            </label>
            <input
              {...register("offer")}
              type="text"
              className="w-full p-3 bg-green-50/50 border border-green-200 rounded-lg outline-none focus:ring-2 focus:ring-emerald-500 transition-all"
              placeholder="12 LPA"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">
              Golden Advice
            </label>
            <textarea
              {...register("tips", { required: true })}
              className="w-full p-3 bg-amber-50 border border-amber-200 rounded-lg outline-none h-20 focus:ring-2 focus:ring-amber-500 transition-all"
              placeholder="Tips for juniors..."
            />
            {errors.tips && (
              <span className="text-xs text-red-500 mt-1">
                Advice is required
              </span>
            )}
          </div>
        </div>

        <div className="flex gap-4">
          <button
            type="button"
            onClick={onCancel}
            className="flex-1 py-4 bg-slate-100 text-slate-700 font-bold rounded-xl hover:bg-slate-200 transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isSubmitting}
            className="flex-1 py-4 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl shadow-lg transition-colors disabled:opacity-70"
          >
            {isSubmitting ? "Updating..." : "Update Experience"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default EditInterviewForm;
