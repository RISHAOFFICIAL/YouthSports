"use client";

import React, { useState } from "react";
import { PlayerData, CoachSettings } from "@/lib/types";
import { ChevronRight, ChevronLeft, Save, Check } from "lucide-react";

interface Props {
  onSubmit: (player: PlayerData) => void;
  settings: CoachSettings;
}

const positions = ["Pitcher", "Catcher", "Infield", "Outfield"];
const jerseySizes = ["Youth S", "Youth M", "Youth L", "Adult S", "Adult M", "Adult L", "Adult XL"];

export default function RegistrationForm({ onSubmit, settings }: Props) {
  const primaryColor = settings.primaryColor || "#b91c1c";
  const [step, setStep] = useState(1);
  const [agreed, setAgreed] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [form, setForm] = useState<PlayerData>({
    firstName: "",
    lastName: "",
    age: "",
    school: "",
    position: "",
    jerseyNumber: "",
    jerseySize: "",
    throws: "Right",
    parentName: "",
    parentEmail: "",
    parentPhone: "",
    emergencyName: "",
    emergencyPhone: "",
    medicalNotes: "",
    paymentAmount: "150.00",
    paymentStatus: "Pending",
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => {
        const next = { ...prev };
        delete next[name];
        return next;
      });
    }
  };

  const togglePosition = (pos: string) => {
    setForm((prev) => ({
      ...prev,
      position: prev.position.includes(pos)
        ? prev.position.replace(pos, "").replace(",,", ",").replace(/^,\s*/, "").replace(/\s*,,\s*/, ",").trim()
        : prev.position
        ? `${prev.position}, ${pos}`
        : pos,
    }));
  };

  const validate = (): boolean => {
    const e: Record<string, string> = {};
    if (step === 1) {
      if (!form.firstName) e.firstName = "Required";
      if (!form.lastName) e.lastName = "Required";
      if (!form.age) e.age = "Required";
    } else if (step === 2) {
      if (!form.parentName) e.parentName = "Required";
      if (!form.parentEmail) e.parentEmail = "Required";
      if (!form.parentPhone) e.parentPhone = "Required";
    } else if (step === 3) {
      if (!form.emergencyName) e.emergencyName = "Required";
      if (!form.emergencyPhone) e.emergencyPhone = "Required";
    }
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const nextStep = () => { if (validate()) setStep((s) => s + 1); };
  const prevStep = () => setStep((s) => s - 1);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    if (!agreed) return;
    setSubmitting(true);
    // Small delay for UX feedback
    setTimeout(() => {
      onSubmit(form);
      setForm({
        firstName: "", lastName: "", age: "", school: "", position: "", jerseyNumber: "",
        jerseySize: "", throws: "Right", parentName: "", parentEmail: "", parentPhone: "",
        emergencyName: "", emergencyPhone: "", medicalNotes: "", paymentAmount: "150.00", paymentStatus: "Pending",
      });
      setStep(1);
      setAgreed(false);
      setSubmitting(false);
    }, 300);
  };

  const inputClass = (field: string) =>
    `bg-slate-900 border ${errors[field] ? "border-red-500" : "border-slate-800"} text-white rounded-md p-4 w-full focus:outline-none transition-colors placeholder:text-slate-600`;
  const labelClass = "block text-slate-400 text-xs font-bold mb-2 uppercase tracking-wider";
  const errorClass = "mt-1 text-xs text-red-400 font-medium";

  return (
    <div className="rounded-2xl border border-slate-700 bg-slate-900/50 p-6 shadow-xl">
      <div className="mb-4 text-center">
        {settings.orgName && (
          <p className="text-xs font-bold uppercase tracking-widest" style={{ color: primaryColor }}>
            {settings.orgName}
          </p>
        )}
        <h2 className="text-lg font-bold text-white">Player Registration</h2>
      </div>

      {/* Progress */}
      <div className="mb-6">
        <div className="flex justify-between text-xs font-bold uppercase tracking-widest text-slate-500 mb-2">
          <span>{["Player", "Guardian", "Final"][step - 1]}</span>
          <span>Step {step} of 3</span>
        </div>
        <div className="h-1 w-full bg-slate-800 rounded-full overflow-hidden">
          <div className="h-full transition-all duration-300" style={{ backgroundColor: primaryColor, width: `${(step / 3) * 100}%` }}></div>
        </div>
      </div>

      <form onSubmit={handleSubmit}>
        {/* Step 1: Player Info */}
        {step === 1 && (
          <div className="space-y-5 animate-in fade-in slide-in-from-right-4">
            <h2 className="text-2xl font-extrabold uppercase tracking-tight border-l-4 pl-3 text-white" style={{ borderColor: primaryColor }}>
              Player Information
            </h2>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className={labelClass}>First Name</label>
                <input type="text" name="firstName" value={form.firstName} onChange={handleChange} placeholder="Jackie" className={inputClass("firstName")} />
                {errors.firstName && <p className={errorClass}>{errors.firstName}</p>}
              </div>
              <div>
                <label className={labelClass}>Last Name</label>
                <input type="text" name="lastName" value={form.lastName} onChange={handleChange} placeholder="Robinson" className={inputClass("lastName")} />
                {errors.lastName && <p className={errorClass}>{errors.lastName}</p>}
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className={labelClass}>Age / DOB</label>
                <input type="text" name="age" value={form.age} onChange={handleChange} placeholder="12" className={inputClass("age")} />
                {errors.age && <p className={errorClass}>{errors.age}</p>}
              </div>
              <div>
                <label className={labelClass}>Throws</label>
                <select name="throws" value={form.throws} onChange={handleChange} className={`${inputClass("throws")} appearance-none`}>
                  <option value="Right">Right</option>
                  <option value="Left">Left</option>
                </select>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className={labelClass}>Jersey Size</label>
                <select name="jerseySize" value={form.jerseySize} onChange={handleChange} className={`${inputClass("jerseySize")} appearance-none`}>
                  <option value="">Select Size</option>
                  {jerseySizes.map((s) => <option key={s} value={s}>{s}</option>)}
                </select>
              </div>
              <div>
                <label className={labelClass}>Jersey #</label>
                <input type="text" name="jerseyNumber" value={form.jerseyNumber} onChange={handleChange} placeholder="42" className={inputClass("jerseyNumber")} />
              </div>
            </div>
            <div>
              <label className={labelClass}>School</label>
              <input type="text" name="school" value={form.school} onChange={handleChange} placeholder="Brooklyn High" className={inputClass("school")} />
            </div>
            <div>
              <label className={labelClass}>Position(s)</label>
              <div className="flex flex-wrap gap-2">
                {positions.map((pos) => (
                  <button key={pos} type="button" onClick={() => togglePosition(pos)}
                    className={`px-4 py-2 rounded-full border text-sm font-medium transition-all ${
                      form.position.includes(pos) ? "text-amber-400 bg-amber-400/10" : "border-slate-700 text-slate-400 hover:border-slate-500"
                    }`}
                    style={form.position.includes(pos) ? { borderColor: primaryColor, color: primaryColor, backgroundColor: `${primaryColor}15` } : {}}
                  >
                    {pos}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Step 2: Guardian */}
        {step === 2 && (
          <div className="space-y-5 animate-in fade-in slide-in-from-right-4">
            <h2 className="text-2xl font-extrabold uppercase tracking-tight border-l-4 pl-3 text-white" style={{ borderColor: primaryColor }}>
              Guardian Details
            </h2>
            <div>
              <label className={labelClass}>Parent/Guardian Name</label>
              <input type="text" name="parentName" value={form.parentName} onChange={handleChange} placeholder="Mallie Robinson" className={inputClass("parentName")} />
              {errors.parentName && <p className={errorClass}>{errors.parentName}</p>}
            </div>
            <div>
              <label className={labelClass}>Phone Number</label>
              <input type="tel" name="parentPhone" value={form.parentPhone} onChange={handleChange} placeholder="(555) 000-0000" className={inputClass("parentPhone")} />
              {errors.parentPhone && <p className={errorClass}>{errors.parentPhone}</p>}
            </div>
            <div>
              <label className={labelClass}>Email Address</label>
              <input type="email" name="parentEmail" value={form.parentEmail} onChange={handleChange} placeholder="guardian@example.com" className={inputClass("parentEmail")} />
              {errors.parentEmail && <p className={errorClass}>{errors.parentEmail}</p>}
            </div>
          </div>
        )}

        {/* Step 3: Emergency, Payment, Agreement */}
        {step === 3 && (
          <div className="space-y-5 animate-in fade-in slide-in-from-right-4">
            <h2 className="text-2xl font-extrabold uppercase tracking-tight border-l-4 pl-3 text-white" style={{ borderColor: primaryColor }}>
              Emergency & Payment
            </h2>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className={labelClass}>Emergency Contact</label>
                <input type="text" name="emergencyName" value={form.emergencyName} onChange={handleChange} className={inputClass("emergencyName")} />
                {errors.emergencyName && <p className={errorClass}>{errors.emergencyName}</p>}
              </div>
              <div>
                <label className={labelClass}>Emergency Phone</label>
                <input type="tel" name="emergencyPhone" value={form.emergencyPhone} onChange={handleChange} className={inputClass("emergencyPhone")} />
                {errors.emergencyPhone && <p className={errorClass}>{errors.emergencyPhone}</p>}
              </div>
            </div>
            <div>
              <label className={labelClass}>Payment Amount ($)</label>
              <input type="text" name="paymentAmount" value={form.paymentAmount} onChange={handleChange} placeholder="150.00" className={inputClass("paymentAmount")} />
            </div>
            <div>
              <label className={labelClass}>Medical Notes / Allergies</label>
              <textarea name="medicalNotes" value={form.medicalNotes} onChange={handleChange} rows={3} placeholder="Any allergies or special requirements..." className={`${inputClass("medicalNotes")} resize-none`} />
            </div>

            {/* Agreement Checkbox */}
            <div className="rounded-xl border border-amber-400/30 bg-amber-400/5 p-4">
              <label className="flex items-start gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={agreed}
                  onChange={(e) => setAgreed(e.target.checked)}
                  className="mt-0.5 h-5 w-5 rounded border-slate-600 bg-slate-800 text-amber-400 focus:ring-amber-400 focus:ring-offset-0"
                />
                <div>
                  <p className="text-sm font-bold text-amber-400 uppercase tracking-wider">Parent/Guardian Agreement</p>
                  <p className="mt-1 text-xs text-slate-400 leading-relaxed">
                    I acknowledge that I am the parent or legal guardian of the player listed above and that I have read
                    and agree to all terms, conditions, and policies of this organization, including but not limited to:
                    code of conduct, medical release, liability waiver, and payment terms. I understand that participation
                    in sports activities carries inherent risks and I voluntarily assume all such risks.
                  </p>
                </div>
              </label>
            </div>
          </div>
        )}

        {/* Navigation Buttons */}
        <div className="mt-8 flex gap-4">
          {step > 1 && (
            <button type="button" onClick={prevStep}
              className="flex-1 border border-slate-700 text-white font-bold py-4 rounded-xl hover:bg-slate-800 transition-all uppercase tracking-widest flex items-center justify-center gap-2">
              <ChevronLeft size={18} /> Back
            </button>
          )}
          {step < 3 ? (
            <button type="button" onClick={nextStep}
              className="flex-[2] text-white font-black py-4 rounded-xl transition-all uppercase tracking-widest shadow-lg flex items-center justify-center gap-2 hover:opacity-90"
              style={{ backgroundColor: primaryColor, boxShadow: `0 10px 15px -3px ${primaryColor}33` }}>
              Next <ChevronRight size={18} />
            </button>
          ) : (
            <button type="submit" disabled={!agreed || submitting}
              className="flex-[2] text-white font-black py-4 rounded-xl transition-all uppercase tracking-widest shadow-lg flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed hover:opacity-90"
              style={{ backgroundColor: primaryColor, boxShadow: `0 10px 15px -3px ${primaryColor}33` }}>
              {submitting ? "Saving..." : <><Save size={18} /> Register Player</>}
            </button>
          )}
        </div>
      </form>
    </div>
  );
}