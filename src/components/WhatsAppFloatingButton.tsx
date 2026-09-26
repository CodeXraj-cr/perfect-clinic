import React, { useState } from 'react';
import { MessageCircle, X, Send } from 'lucide-react';
import { ClinicInfo } from '../types/clinic';

interface WhatsAppFloatingButtonProps {
  clinic: ClinicInfo;
  onQuickBookClick: () => void;
}

export const WhatsAppFloatingButton: React.FC<WhatsAppFloatingButtonProps> = ({
  clinic,
  onQuickBookClick,
}) => {
  const [showTooltip, setShowTooltip] = useState(false);

  const cleanNumber = clinic.whatsapp.replace(/[^0-9]/g, '');
  const directWaUrl = `https://wa.me/${cleanNumber}?text=${encodeURIComponent(
    `Hello ${clinic.clinicName || '+PERFECT+'} Clinic, I would like to inquire about appointments and clinic services.`
  )}`;

  return (
    <div className="fixed bottom-6 right-6 z-40 flex flex-col items-end gap-2">
      {/* Popover Bubble */}
      {showTooltip && (
        <div className="bg-white rounded-2xl p-4 shadow-xl border border-emerald-100 max-w-xs text-xs animate-in slide-in-from-bottom-2 duration-150 relative">
          <button
            onClick={() => setShowTooltip(false)}
            className="absolute top-2 right-2 text-slate-400 hover:text-slate-600 p-1"
          >
            <X className="w-3.5 h-3.5" />
          </button>
          <div className="flex items-center gap-2 mb-2 font-bold text-slate-900">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
            <span>Need Help Booking?</span>
          </div>
          <p className="text-slate-600 mb-3 leading-relaxed">
            Chat directly with {clinic.clinicName} reception for doctor availability or blood test appointments.
          </p>
          <div className="flex gap-2">
            <a
              href={directWaUrl}
              target="_blank"
              rel="noreferrer"
              className="flex-1 py-1.5 px-3 rounded-lg bg-emerald-600 text-white font-bold text-center hover:bg-emerald-700 transition-colors flex items-center justify-center gap-1"
            >
              <Send className="w-3 h-3" />
              <span>Chat Now</span>
            </a>
            <button
              onClick={() => {
                setShowTooltip(false);
                onQuickBookClick();
              }}
              className="py-1.5 px-3 rounded-lg bg-slate-100 text-slate-700 font-bold hover:bg-slate-200 transition-colors"
            >
              Book
            </button>
          </div>
        </div>
      )}

      {/* Main Floating Bubble */}
      <button
        onClick={() => setShowTooltip(!showTooltip)}
        className="group relative flex items-center justify-center w-14 h-14 rounded-full bg-emerald-500 hover:bg-emerald-600 active:scale-95 text-white shadow-lg hover:shadow-xl transition-all cursor-pointer"
        aria-label="Contact clinic via WhatsApp"
        title="Chat on WhatsApp"
      >
        <span className="absolute -top-1 -right-1 flex h-4 w-4">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-300 opacity-75"></span>
          <span className="relative inline-flex rounded-full h-4 w-4 bg-emerald-400 border-2 border-white"></span>
        </span>
        <MessageCircle className="w-7 h-7 fill-white" />
      </button>
    </div>
  );
};
