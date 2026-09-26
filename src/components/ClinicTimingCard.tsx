import React from 'react';
import { Clock, CheckCircle2, AlertCircle, Phone, Calendar } from 'lucide-react';
import { ClinicInfo } from '../types/clinic';
import { getClinicLiveStatus } from '../utils/clinicStatus';

interface ClinicTimingCardProps {
  clinic: ClinicInfo;
  onBookClick?: () => void;
}

export const ClinicTimingCard: React.FC<ClinicTimingCardProps> = ({
  clinic,
  onBookClick,
}) => {
  const status = getClinicLiveStatus(clinic);

  return (
    <div className="bg-white rounded-2xl p-6 sm:p-7 border border-sky-100 shadow-sm hover:shadow-md transition-shadow relative overflow-hidden">
      {/* Decorative subtle medical pulse glow */}
      <div className="absolute top-0 right-0 w-32 h-32 bg-sky-50 rounded-full blur-2xl -mr-10 -mt-10 pointer-events-none" />

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 border-b border-slate-100">
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-xl bg-sky-50 flex items-center justify-center text-sky-600 shrink-0">
            <Clock className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-slate-900 tracking-tight">Clinic Timings</h3>
            <p className="text-xs text-slate-500">Walk-ins and scheduled appointments</p>
          </div>
        </div>

        {/* Live Status indicator */}
        <div className="inline-flex items-center gap-2 self-start sm:self-auto px-3.5 py-1.5 rounded-full text-xs font-semibold border transition-all">
          {status.isOpen ? (
            <span className="flex items-center gap-1.5 text-emerald-700 bg-emerald-50 border-emerald-200">
              <span className="relative flex h-2.5 w-2.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
              </span>
              <span>Open Now</span>
            </span>
          ) : (
            <span className="flex items-center gap-1.5 text-amber-700 bg-amber-50 border-amber-200">
              <span className="h-2.5 w-2.5 rounded-full bg-amber-500"></span>
              <span>{status.statusText}</span>
            </span>
          )}
          <span className="text-slate-400 text-xs font-normal">({status.nextScheduleText})</span>
        </div>
      </div>

      {/* Schedule grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 my-5">
        <div className="p-3.5 rounded-xl bg-slate-50/80 border border-slate-100">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-400 block mb-1">
            Monday – Saturday
          </span>
          <p className="text-base font-extrabold text-slate-800">
            {clinic.openingTime || '8:00 AM'} – {clinic.closingTime || '8:00 PM'}
          </p>
          <span className="text-xs text-sky-700 font-medium">Full consultations & Diagnostics</span>
        </div>

        <div className="p-3.5 rounded-xl bg-slate-50/80 border border-slate-100">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-400 block mb-1">
            Sunday
          </span>
          <p className="text-base font-extrabold text-slate-800">
            {clinic.sundayOpeningTime || '9:00 AM'} – {clinic.sundayClosingTime || '2:00 PM'}
          </p>
          <span className="text-xs text-emerald-700 font-medium">Morning Special Clinic & Blood Tests</span>
        </div>
      </div>

      {/* Holiday / Notice alert */}
      {clinic.holidayNotice && (
        <div className="mb-5 p-3 rounded-xl bg-sky-50/70 border border-sky-100 flex items-start gap-2.5 text-xs text-slate-700">
          <AlertCircle className="w-4 h-4 text-sky-600 shrink-0 mt-0.5" />
          <p className="leading-relaxed">
            <strong className="text-sky-900 font-semibold">Special Notice:</strong> {clinic.holidayNotice}
          </p>
        </div>
      )}

      {/* Quick helpline footer */}
      <div className="pt-4 border-t border-slate-100 flex flex-wrap items-center justify-between gap-3 text-xs text-slate-600">
        <div className="flex items-center gap-2">
          <Phone className="w-3.5 h-3.5 text-sky-600" />
          <span>Reception: <a href={`tel:${clinic.phone}`} className="font-semibold text-slate-900 hover:text-sky-600">{clinic.phone}</a></span>
        </div>

        {onBookClick && (
          <button
            onClick={onBookClick}
            className="text-xs font-bold text-sky-600 hover:text-sky-700 flex items-center gap-1 cursor-pointer"
          >
            <span>View Available Slots</span>
            <span aria-hidden="true">&rarr;</span>
          </button>
        )}
      </div>
    </div>
  );
};
