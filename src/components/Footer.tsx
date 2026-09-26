import React from 'react';
import {
  Phone,
  Mail,
  MapPin,
  Clock,
  Instagram,
  Facebook,
  Shield,
  Heart,
  Send,
  ExternalLink,
} from 'lucide-react';
import { ClinicInfo } from '../types/clinic';

interface FooterProps {
  clinic: ClinicInfo;
  onNavigate: (sectionId: string) => void;
  onOpenLegalModal: (type: 'disclaimer' | 'privacy' | 'terms') => void;
  onOpenAdmin: () => void;
}

export const Footer: React.FC<FooterProps> = ({
  clinic,
  onNavigate,
  onOpenLegalModal,
  onOpenAdmin,
}) => {
  return (
    <footer className="bg-slate-900 text-white pt-16 pb-12 border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Main Footer Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 pb-12 border-b border-slate-800">
          
          {/* Col 1: Brand & About (Span 2) */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center gap-1.5 text-2xl font-extrabold tracking-tight text-white">
              <span className="text-sky-400">+</span>
              <span className="bg-gradient-to-r from-sky-400 to-teal-300 bg-clip-text text-transparent">
                {clinic.logoText || '+PERFECT+'}
              </span>
              <span className="text-teal-400">+</span>
            </div>

            <p className="text-xs text-slate-400 leading-relaxed max-w-sm">
              {clinic.about ||
                '+PERFECT+ Medical Clinic is committed to providing comprehensive, compassionate, and patient-centered healthcare. Combining experienced specialist physicians, state-of-the-art pathology diagnostics, and effortless appointment scheduling.'}
            </p>

            <div className="flex items-center gap-3 pt-2">
              {clinic.instagramUrl && (
                <a
                  href={clinic.instagramUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="w-8 h-8 rounded-lg bg-slate-800 hover:bg-sky-600 text-slate-300 hover:text-white flex items-center justify-center transition-colors"
                  aria-label="Clinic Instagram"
                >
                  <Instagram className="w-4 h-4" />
                </a>
              )}
              {clinic.facebookUrl && (
                <a
                  href={clinic.facebookUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="w-8 h-8 rounded-lg bg-slate-800 hover:bg-sky-600 text-slate-300 hover:text-white flex items-center justify-center transition-colors"
                  aria-label="Clinic Facebook"
                >
                  <Facebook className="w-4 h-4" />
                </a>
              )}
              <a
                href={`https://wa.me/${clinic.whatsapp.replace(/[^0-9]/g, '')}`}
                target="_blank"
                rel="noreferrer"
                className="w-8 h-8 rounded-lg bg-slate-800 hover:bg-emerald-600 text-slate-300 hover:text-white flex items-center justify-center transition-colors"
                aria-label="Clinic WhatsApp Chat"
              >
                <Send className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Col 2: Quick Links */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-sky-400">
              Quick Links
            </h4>
            <ul className="space-y-2 text-xs text-slate-300">
              <li>
                <button
                  onClick={() => onNavigate('home')}
                  className="hover:text-white transition-colors cursor-pointer"
                >
                  Home
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('services')}
                  className="hover:text-white transition-colors cursor-pointer"
                >
                  Medical Services
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('doctors')}
                  className="hover:text-white transition-colors cursor-pointer"
                >
                  Specialist Doctors
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('blood-test')}
                  className="hover:text-white transition-colors cursor-pointer"
                >
                  Blood Test & Pathology
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('appointment')}
                  className="hover:text-white transition-colors cursor-pointer"
                >
                  Book Appointment
                </button>
              </li>
            </ul>
          </div>

          {/* Col 3: Clinic Hours */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-teal-400">
              Clinic Hours
            </h4>
            <div className="space-y-2 text-xs text-slate-300">
              <div>
                <span className="text-[11px] text-slate-400 block font-semibold">Monday – Saturday</span>
                <span className="font-bold text-white">
                  {clinic.openingTime || '8:00 AM'} – {clinic.closingTime || '8:00 PM'}
                </span>
              </div>

              <div>
                <span className="text-[11px] text-slate-400 block font-semibold">Sunday</span>
                <span className="font-bold text-white">
                  {clinic.sundayOpeningTime || '9:00 AM'} – {clinic.sundayClosingTime || '2:00 PM'}
                </span>
              </div>

              <div className="pt-2">
                <span className="inline-flex items-center gap-1.5 text-[11px] text-emerald-400 font-semibold">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                  <span>Open for emergency visits</span>
                </span>
              </div>
            </div>
          </div>

          {/* Col 4: Contact & Location */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-amber-400">
              Contact & Location
            </h4>
            <div className="space-y-2 text-xs text-slate-300">
              <p className="flex items-start gap-2">
                <MapPin className="w-4 h-4 text-sky-400 shrink-0 mt-0.5" />
                <span className="leading-relaxed">{clinic.address}</span>
              </p>
              <p className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-sky-400 shrink-0" />
                <a href={`tel:${clinic.phone}`} className="hover:text-white font-medium">
                  {clinic.phone}
                </a>
              </p>
              <p className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-sky-400 shrink-0" />
                <a href={`mailto:${clinic.email}`} className="hover:text-white">
                  {clinic.email}
                </a>
              </p>
              <p className="flex items-center gap-2">
                <Send className="w-4 h-4 text-emerald-400 shrink-0" />
                <a
                  href={`https://wa.me/${clinic.whatsapp.replace(/[^0-9]/g, '')}`}
                  target="_blank"
                  rel="noreferrer"
                  className="hover:text-white"
                >
                  WhatsApp: {clinic.whatsapp}
                </a>
              </p>
            </div>
          </div>

        </div>

        {/* Legal & Policy Links */}
        <div className="py-6 flex flex-wrap items-center justify-between gap-4 text-xs text-slate-400 border-b border-slate-800">
          <div className="flex flex-wrap items-center gap-4">
            <button
              onClick={() => onOpenLegalModal('disclaimer')}
              className="hover:text-slate-200 cursor-pointer"
            >
              Medical Disclaimer
            </button>
            <span aria-hidden="true">·</span>
            <button
              onClick={() => onOpenLegalModal('privacy')}
              className="hover:text-slate-200 cursor-pointer"
            >
              Privacy Policy
            </button>
            <span aria-hidden="true">·</span>
            <button
              onClick={() => onOpenLegalModal('terms')}
              className="hover:text-slate-200 cursor-pointer"
            >
              Terms & Conditions
            </button>
          </div>

          <div>
            <button
              onClick={onOpenAdmin}
              className="text-xs text-slate-400 hover:text-sky-300 flex items-center gap-1 cursor-pointer"
            >
              <Shield className="w-3.5 h-3.5 text-sky-400" />
              <span>Clinic Owner Administration</span>
            </button>
          </div>
        </div>

        {/* SECTION 22: DEVELOPER CREDIT (Exact Requirement) */}
        <div className="pt-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-400">
          <div>
            &copy; {new Date().getFullYear()} {clinic.clinicName || '+PERFECT+'} Medical Clinic. All rights reserved.
          </div>

          <div className="flex items-center gap-2 font-medium">
            <span>Designed & Developed by <strong className="text-white">{clinic.developerName || 'Raj Dutta'}</strong></span>
            {clinic.developerInstagram && (
              <a
                href={clinic.developerInstagramUrl || 'https://instagram.com/rajdutta_official'}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-slate-800 hover:bg-slate-700 text-sky-300 hover:text-white transition-colors ml-1"
              >
                <Instagram className="w-3 h-3 text-rose-400" />
                <span>Instagram: {clinic.developerInstagram}</span>
              </a>
            )}
          </div>
        </div>

      </div>
    </footer>
  );
};
