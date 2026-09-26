import React from 'react';
import { Stethoscope, Droplets, ArrowRight, ShieldCheck, Clock, Users } from 'lucide-react';
import { ClinicInfo } from '../types/clinic';
import { ClinicTimingCard } from './ClinicTimingCard';

interface HeroProps {
  clinic: ClinicInfo;
  onFindDoctorClick: () => void;
  onBloodTestClick: () => void;
  onBookAppointmentClick: () => void;
}

export const Hero: React.FC<HeroProps> = ({
  clinic,
  onFindDoctorClick,
  onBloodTestClick,
  onBookAppointmentClick,
}) => {
  const heroImg = clinic.heroImage || '/src/assets/images/hero_clinic_reception_1790442820365.jpg';

  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-sky-50/60 via-white to-slate-50 pt-8 pb-16 lg:py-20 border-b border-sky-100/60">
      {/* Background soft ambient accents */}
      <div className="absolute top-10 left-1/2 -translate-x-1/2 w-[1000px] h-[400px] bg-gradient-to-r from-sky-100/40 via-teal-100/30 to-sky-100/40 blur-3xl -z-10 pointer-events-none rounded-full" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-center">
          
          {/* Left Column: Heading, Value Prop, Action Buttons */}
          <div className="lg:col-span-7 flex flex-col justify-center">
            {/* Trust kicker */}
            <div className="inline-flex items-center gap-2 mb-4 text-xs font-bold uppercase tracking-wider text-sky-700 bg-sky-100/70 border border-sky-200/80 px-3 py-1.5 rounded-full w-max">
              <span className="w-2 h-2 rounded-full bg-teal-500 animate-pulse" />
              <span>Compassionate Care · Advanced Diagnostics</span>
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-slate-900 tracking-tight leading-[1.12] mb-5 text-balance">
              Your Health, <br className="hidden sm:inline" />
              <span className="bg-gradient-to-r from-sky-600 via-sky-700 to-teal-600 bg-clip-text text-transparent">
                Our Priority
              </span>
            </h1>

            <p className="text-base sm:text-lg text-slate-600 mb-8 max-w-xl leading-relaxed">
              Quality healthcare, experienced specialist doctors, and convenient diagnostic pathology services — all in one trusted, modern clinic.
            </p>

            {/* TWO PROMINENT FEATURE BUTTONS / CARDS (Section 4) */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-xl mb-8">
              
              {/* Button 1: Find a Doctor */}
              <button
                onClick={onFindDoctorClick}
                className="group relative flex items-center gap-4 p-4 rounded-2xl bg-white border-2 border-sky-200 hover:border-sky-500 shadow-sm hover:shadow-md transition-all text-left cursor-pointer active:scale-98"
              >
                <div className="w-13 h-13 rounded-xl bg-sky-500 text-white flex items-center justify-center text-2xl shadow-xs group-hover:scale-105 transition-transform shrink-0">
                  👨‍⚕️
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold uppercase tracking-wider text-sky-600">
                      Medical Staff
                    </span>
                    <ArrowRight className="w-4 h-4 text-sky-400 group-hover:text-sky-600 group-hover:translate-x-1 transition-all" />
                  </div>
                  <h3 className="text-lg font-extrabold text-slate-900 leading-snug">
                    Find a Doctor
                  </h3>
                  <p className="text-xs text-slate-500 mt-0.5">
                    View specialists & check availability
                  </p>
                </div>
              </button>

              {/* Button 2: Blood Test */}
              <button
                onClick={onBloodTestClick}
                className="group relative flex items-center gap-4 p-4 rounded-2xl bg-white border-2 border-teal-200 hover:border-teal-500 shadow-sm hover:shadow-md transition-all text-left cursor-pointer active:scale-98"
              >
                <div className="w-13 h-13 rounded-xl bg-teal-600 text-white flex items-center justify-center text-2xl shadow-xs group-hover:scale-105 transition-transform shrink-0">
                  🩸
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold uppercase tracking-wider text-teal-700">
                      Diagnostics
                    </span>
                    <ArrowRight className="w-4 h-4 text-teal-400 group-hover:text-teal-600 group-hover:translate-x-1 transition-all" />
                  </div>
                  <h3 className="text-lg font-extrabold text-slate-900 leading-snug">
                    Blood Test
                  </h3>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Fasting rules, tests & home sample
                  </p>
                </div>
              </button>

            </div>

            {/* Trust highlights */}
            <div className="flex flex-wrap items-center gap-y-2 gap-x-6 text-xs text-slate-500 pt-2 border-t border-slate-200/80">
              <span className="flex items-center gap-1.5 font-medium text-slate-700">
                <ShieldCheck className="w-4 h-4 text-teal-600" />
                Certified Practitioners
              </span>
              <span className="flex items-center gap-1.5 font-medium text-slate-700">
                <Clock className="w-4 h-4 text-sky-600" />
                Same-Day Lab Reports
              </span>
              <span className="flex items-center gap-1.5 font-medium text-slate-700">
                <Users className="w-4 h-4 text-amber-600" />
                Easy WhatsApp Booking
              </span>
            </div>
          </div>

          {/* Right Column: High-Res Clinic Reception Image & Integrated Timing Card */}
          <div className="lg:col-span-5 flex flex-col gap-6">
            <div className="relative rounded-3xl overflow-hidden shadow-xl border border-white/60 group">
              <img
                src={heroImg}
                alt="Modern Medical Clinic Reception"
                referrerPolicy="no-referrer"
                className="w-full h-72 sm:h-80 object-cover object-center group-hover:scale-102 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-900/70 via-slate-900/20 to-transparent" />
              
              <div className="absolute bottom-4 left-4 right-4 text-white">
                <p className="text-xs font-semibold uppercase tracking-wider text-sky-300">
                  {clinic.clinicName} Healthcare Facility
                </p>
                <h4 className="text-base font-bold">
                  Hygienic, Fully Equipped & Patient-First
                </h4>
              </div>
            </div>

            {/* Clinic Timing Card prominently placed on home page */}
            <ClinicTimingCard clinic={clinic} onBookClick={onFindDoctorClick} />
          </div>

        </div>
      </div>
    </section>
  );
};
