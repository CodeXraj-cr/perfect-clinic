import React from 'react';
import { Award, ShieldCheck, Heart, Clock, Send, Sparkles } from 'lucide-react';
import { Phlebotomist, ClinicInfo } from '../types/clinic';

interface PhlebotomistSectionProps {
  phlebotomist: Phlebotomist;
  clinic: ClinicInfo;
  onBookBloodTestClick: () => void;
}

export const PhlebotomistSection: React.FC<PhlebotomistSectionProps> = ({
  phlebotomist,
  clinic,
  onBookBloodTestClick,
}) => {
  const photoUrl =
    phlebotomist.photo ||
    '/src/assets/images/phlebotomist_portrait_1790442856267.jpg';

  return (
    <div className="bg-gradient-to-br from-teal-50/80 via-white to-sky-50/60 rounded-3xl p-6 sm:p-10 border border-teal-100 shadow-sm relative overflow-hidden">
      {/* Decorative background circle */}
      <div className="absolute -bottom-10 -right-10 w-60 h-60 bg-teal-100/50 rounded-full blur-3xl pointer-events-none" />

      <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center relative z-10">
        
        {/* Phlebotomist Photo Card */}
        <div className="md:col-span-4 flex justify-center">
          <div className="relative group">
            <div className="w-56 h-56 sm:w-64 sm:h-64 rounded-2xl overflow-hidden border-4 border-white shadow-lg bg-slate-100">
              <img
                src={photoUrl}
                alt={phlebotomist.name}
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover object-top group-hover:scale-103 transition-transform duration-500"
              />
            </div>

            {/* Experience Badge */}
            <div className="absolute -bottom-3 left-1/2 -translate-x-1/2 bg-teal-700 text-white text-xs font-bold px-3.5 py-1.5 rounded-full shadow-md whitespace-nowrap flex items-center gap-1.5">
              <Award className="w-3.5 h-3.5 text-teal-300" />
              <span>{phlebotomist.experience} Experience</span>
            </div>
          </div>
        </div>

        {/* Phlebotomist Information */}
        <div className="md:col-span-8 flex flex-col justify-center">
          <div className="inline-flex items-center gap-2 mb-2 text-xs font-bold uppercase tracking-wider text-teal-700 bg-teal-100/70 px-3 py-1 rounded-full w-max">
            <ShieldCheck className="w-3.5 h-3.5 text-teal-600" />
            <span>Certified Diagnostic Phlebotomy</span>
          </div>

          <h3 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Meet Our Phlebotomist
          </h3>

          <h4 className="text-xl font-bold text-teal-800 mt-1">
            {phlebotomist.name}
          </h4>

          <p className="text-xs font-semibold text-slate-500 mt-0.5">
            {phlebotomist.qualification}
          </p>

          <blockquote className="mt-4 p-4 rounded-2xl bg-white/80 border border-teal-100/80 text-sm text-slate-700 italic leading-relaxed">
            "{phlebotomist.description}"
          </blockquote>

          {/* Collection Service Hours */}
          <div className="mt-4 flex flex-wrap items-center gap-x-6 gap-y-2 text-xs text-slate-600">
            <div className="flex items-center gap-1.5">
              <Clock className="w-4 h-4 text-teal-600" />
              <span>Sample Collection: <strong>{phlebotomist.availableHours || 'Mon–Sat 8:00 AM – 3:00 PM'}</strong></span>
            </div>
            <div className="flex items-center gap-1.5">
              <Heart className="w-4 h-4 text-rose-500" />
              <span>Gentle & Painless Vein Puncture</span>
            </div>
          </div>

          {/* Action button */}
          <div className="mt-6 flex flex-wrap gap-3">
            <button
              onClick={onBookBloodTestClick}
              className="py-3 px-6 rounded-xl bg-teal-600 hover:bg-teal-700 active:scale-98 text-white font-extrabold text-xs shadow-sm hover:shadow transition-all flex items-center gap-2 cursor-pointer"
            >
              <Send className="w-3.5 h-3.5" />
              <span>Book Blood Test via WhatsApp</span>
            </button>
          </div>

        </div>

      </div>
    </div>
  );
};
