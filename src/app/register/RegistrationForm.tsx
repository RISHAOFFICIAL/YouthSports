"use client";

import React, { useState, useEffect } from "react";
import { PlayerData, CoachSettings } from "@/lib/types";
import { Check } from "lucide-react";

interface Props {
  onSubmit: (player: PlayerData) => void;
  settings: CoachSettings;
}

const DOCUMENT_POSITIONS = ["Pitcher", "Catcher", "Infield", "Outfield"];
const JERSEY_SIZES = ["Youth S", "Youth M", "Youth L", "Adult S", "Adult M", "Adult L", "Adult XL"];

export default function RegistrationForm({ onSubmit, settings }: Props) {
  const primaryColor = settings.primaryColor || "#b91c1c";
  const [agreed, setAgreed] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const [form, setForm] = useState<PlayerData>({
    firstName: "", lastName: "", age: "", school: "", position: "",
    jerseyNumber: "", jerseySize: "", throws: "Right",
    parentName: "", parentEmail: "", parentPhone: "",
    emergencyName: "", emergencyPhone: "",
    medicalNotes: "", paymentAmount: "150.00", paymentStatus: "Pending",
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setForm(p => ({ ...p, [name]: value }));
    if (errors[name]) setErrors(p => { const n = { ...p }; delete n[name]; return n; });
  };

  const togglePosition = (pos: string) => {
    setForm(p => ({
      ...p,
      position: p.position.includes(pos)
        ? p.position.replace(pos, "").replace(/,,/g, ",").replace(/^,\s*|\s*,,\s*/g, "").trim()
        : p.position ? `${p.position}, ${pos}` : pos,
    }));
  };

  const validate = (): boolean => {
    const e: Record<string, string> = {};
    if (!form.firstName) e.firstName = "Required";
    if (!form.lastName) e.lastName = "Required";
    if (!form.age) e.age = "Required";
    if (!form.parentName) e.parentName = "Required";
    if (!form.parentEmail) e.parentEmail = "Required";
    if (!form.parentPhone) e.parentPhone = "Required";
    if (!form.emergencyName) e.emergencyName = "Required";
    if (!form.emergencyPhone) e.emergencyPhone = "Required";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    if (!agreed) return;
    setSubmitting(true);
    setTimeout(() => {
      onSubmit(form);
      setSubmitted(true);
      setSubmitting(false);
    }, 400);
  };

  const inputClass = (field: string) =>
    `bg-white border ${errors[field] ? "border-red-500" : "border-gray-300"} text-gray-900 rounded px-4 py-3 w-full text-sm focus:outline-none focus:ring-2 transition placeholder:text-gray-400`;
  const labelClass = "block text-xs font-semibold uppercase tracking-wider text-gray-600 mb-1.5";
  const errorClass = "mt-0.5 text-xs text-red-600 font-medium";
  const fieldGroupClass = "border-b border-gray-200 pb-5 mb-5 last:border-b-0 last:pb-0 last:mb-0";

  if (submitted) {
    return (
      <div className="text-center py-10">
        <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full" style={{ backgroundColor: primaryColor }}>
          <Check size={28} className="text-white" />
        </div>
        <h3 className="text-xl font-bold text-gray-900">Registration Complete</h3>
        <p className="mt-2 text-sm text-gray-500">Thank you! Your registration has been submitted.</p>
        <p className="mt-1 text-xs text-gray-400">You will receive a confirmation from the coach.</p>
        <button
          type="button"
          onClick={() => { setSubmitted(false); setAgreed(false); setForm({
            firstName: "", lastName: "", age: "", school: "", position: "", jerseyNumber: "",
            jerseySize: "", throws: "Right", parentName: "", parentEmail: "", parentPhone: "",
            emergencyName: "", emergencyPhone: "", medicalNotes: "", paymentAmount: "150.00", paymentStatus: "Pending",
          }); }}
          className="mt-6 inline-flex items-center gap-2 rounded-lg px-6 py-3 text-sm font-bold text-white uppercase tracking-wider hover:opacity-90"
          style={{ backgroundColor: primaryColor }}
        >
          Register Another Player
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Document-style card */}
      <div className="rounded-xl border border-gray-200 bg-white shadow-sm overflow-hidden">
        
        {/* Letterhead Header */}
        <div className="border-b-2 px-6 py-5" style={{ borderColor: primaryColor }}>
          <div className="flex items-center gap-3">
            {settings.logoDataUrl && (
              <img src={settings.logoDataUrl} alt="Logo" className="h-12 w-12 rounded-lg border border-gray-200 object-contain" />
            )}
            <div>
              {settings.orgName && (
                <h2 className="text-lg font-bold uppercase tracking-tight" style={{ color: primaryColor }}>
                  {settings.orgName}
                </h2>
              )}
              {settings.teamName && <p className="text-sm text-gray-600">{settings.teamName}</p>}
              {settings.programName && (
                <p className="text-xs text-gray-500">{settings.programName}{settings.programYear ? ` · ${settings.programYear}` : ""}</p>
              )}
            </div>
          </div>
          <p className="mt-2 text-[10px] font-bold uppercase tracking-[0.15em] text-gray-400">
            Player Registration Form — Fill all required fields below
          </p>
        </div>

        {/* Form Body - Single page scrolling, document feel */}
        <div className="px-6 py-5">

          {/* Section 1: Player Info */}
          <div className={fieldGroupClass}>
            <h3 className="text-sm font-bold uppercase tracking-wider mb-3" style={{ color: primaryColor }}>Player Information</h3>
            <div className="grid grid-cols-2 gap-4 mb-4">
              <div>
                <label className={labelClass}>First Name *</label>
                <input type="text" name="firstName" value={form.firstName} onChange={handleChange} placeholder="Jackie" className={inputClass("firstName")} />
                {errors.firstName && <p className={errorClass}>{errors.firstName}</p>}
              </div>
              <div>
                <label className={labelClass}>Last Name *</label>
                <input type="text" name="lastName" value={form.lastName} onChange={handleChange} placeholder="Robinson" className={inputClass("lastName")} />
                {errors.lastName && <p className={errorClass}>{errors.lastName}</p>}
              </div>
            </div>
            <div className="grid grid-cols-3 gap-4 mb-4">
              <div>
                <label className={labelClass}>Age / DOB *</label>
                <input type="text" name="age" value={form.age} onChange={handleChange} placeholder="12" className={inputClass("age")} />
                {errors.age && <p className={errorClass}>{errors.age}</p>}
              </div>
              <div>
                <label className={labelClass}>Throws</label>
                <select name="throws" value={form.throws} onChange={handleChange} className={inputClass("throws")}>
                  <option value="Right">Right</option>
                  <option value="Left">Left</option>
                </select>
              </div>
              <div>
                <label className={labelClass}>Jersey #</label>
                <input type="text" name="jerseyNumber" value={form.jerseyNumber} onChange={handleChange} placeholder="42" className={inputClass("jerseyNumber")} />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4 mb-4">
              <div>
                <label className={labelClass}>Jersey Size</label>
                <select name="jerseySize" value={form.jerseySize} onChange={handleChange} className={inputClass("jerseySize")}>
                  <option value="">Select</option>
                  {JERSEY_SIZES.map(s => <option key={s} value={s}>{s}</option>)}
                </select>
              </div>
              <div>
                <label className={labelClass}>School</label>
                <input type="text" name="school" value={form.school} onChange={handleChange} placeholder="Brooklyn High" className={inputClass("school")} />
              </div>
            </div>
            <div>
              <label className={labelClass}>Position(s)</label>
              <div className="flex flex-wrap gap-2">
                {DOCUMENT_POSITIONS.map(pos => (
                  <button key={pos} type="button" onClick={() => togglePosition(pos)}
                    className={`px-4 py-2 rounded-lg border text-xs font-bold uppercase tracking-wider transition-all ${
                      form.position.includes(pos)
                        ? "text-white border-transparent"
                        : "border-gray-300 text-gray-500 hover:border-gray-400"
                    }`}
                    style={form.position.includes(pos) ? { backgroundColor: primaryColor, borderColor: primaryColor } : {}}
                  >
                    {pos}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Section 2: Parent/Guardian */}
          <div className={fieldGroupClass}>
            <h3 className="text-sm font-bold uppercase tracking-wider mb-3" style={{ color: primaryColor }}>Parent / Guardian</h3>
            <div>
              <label className={labelClass}>Full Name *</label>
              <input type="text" name="parentName" value={form.parentName} onChange={handleChange} placeholder="Mallie Robinson" className={inputClass("parentName")} />
              {errors.parentName && <p className={errorClass}>{errors.parentName}</p>}
            </div>
            <div className="grid grid-cols-2 gap-4 mt-4">
              <div>
                <label className={labelClass}>Email *</label>
                <input type="email" name="parentEmail" value={form.parentEmail} onChange={handleChange} placeholder="guardian@example.com" className={inputClass("parentEmail")} />
                {errors.parentEmail && <p className={errorClass}>{errors.parentEmail}</p>}
              </div>
              <div>
                <label className={labelClass}>Phone *</label>
                <input type="tel" name="parentPhone" value={form.parentPhone} onChange={handleChange} placeholder="(555) 000-0000" className={inputClass("parentPhone")} />
                {errors.parentPhone && <p className={errorClass}>{errors.parentPhone}</p>}
              </div>
            </div>
          </div>

          {/* Section 3: Emergency & Medical */}
          <div className={fieldGroupClass}>
            <h3 className="text-sm font-bold uppercase tracking-wider mb-3" style={{ color: primaryColor }}>Emergency & Medical</h3>
            <div className="grid grid-cols-2 gap-4 mb-4">
              <div>
                <label className={labelClass}>Emergency Contact *</label>
                <input type="text" name="emergencyName" value={form.emergencyName} onChange={handleChange} className={inputClass("emergencyName")} />
                {errors.emergencyName && <p className={errorClass}>{errors.emergencyName}</p>}
              </div>
              <div>
                <label className={labelClass}>Emergency Phone *</label>
                <input type="tel" name="emergencyPhone" value={form.emergencyPhone} onChange={handleChange} className={inputClass("emergencyPhone")} />
                {errors.emergencyPhone && <p className={errorClass}>{errors.emergencyPhone}</p>}
              </div>
            </div>
            <div className="mb-4">
              <label className={labelClass}>Medical Notes / Allergies</label>
              <textarea name="medicalNotes" value={form.medicalNotes} onChange={handleChange} rows={3} placeholder="Any allergies, medications, or conditions..." className={`${inputClass("medicalNotes")} resize-none`} />
            </div>
            <div>
              <label className={labelClass}>Registration Fee ($)</label>
              <input type="text" name="paymentAmount" value={form.paymentAmount} onChange={handleChange} className={inputClass("paymentAmount")} />
            </div>
          </div>

          {/* Section 4: Agreement */}
          <div className={fieldGroupClass}>
            <h3 className="text-sm font-bold uppercase tracking-wider mb-3" style={{ color: primaryColor }}>Agreement</h3>
            <label className="flex items-start gap-3 cursor-pointer">
              <input type="checkbox" checked={agreed} onChange={e => setAgreed(e.target.checked)}
                className="mt-0.5 h-5 w-5 rounded border-gray-300 text-gray-800 focus:ring-2" style={{ accentColor: primaryColor }} />
              <div>
                <p className="text-sm font-semibold text-gray-800">I agree to the terms and conditions</p>
                <p className="mt-1 text-xs text-gray-500 leading-relaxed">
                  I acknowledge that I am the parent or legal guardian and agree to all terms, conditions, 
                  and policies including code of conduct, medical release, liability waiver, and payment terms. 
                  I understand that sports activities carry inherent risks which I voluntarily assume.
                </p>
              </div>
            </label>
          </div>
        </div>
      </div>

      {/* Submit Button */}
      <button type="submit" disabled={!agreed || submitting}
        className="w-full rounded-xl py-4 text-sm font-black uppercase tracking-widest text-white shadow-lg transition-all hover:opacity-90 disabled:opacity-40 disabled:cursor-not-allowed"
        style={{ backgroundColor: primaryColor, boxShadow: `0 4px 14px 0 ${primaryColor}40` }}>
        {submitting ? "Submitting..." : "Submit Registration"}
      </button>
    </form>
  );
}