import React from 'react';
import {
  Stethoscope,
  Activity,
  Droplets,
  ShieldCheck,
  UserCheck,
  HeartPulse,
  ArrowRight,
  Sparkles,
} from 'lucide-react';
import { ClinicService } from '../types/clinic';

interface ServicesSectionProps {
  services: ClinicService[];
  onBookService: (service: ClinicService) => void;
}

// Icon mapper helper
const getServiceIcon = (iconName: string) => {
  switch (iconName?.toLowerCase()) {
    case 'stethoscope':
      return <Stethoscope className="w-6 h-6 text-sky-600" />;
    case 'activity':
      return <Activity className="w-6 h-6 text-emerald-600" />;
    case 'droplets':
      return <Droplets className="w-6 h-6 text-rose-500" />;
    case 'shieldcheck':
      return <ShieldCheck className="w-6 h-6 text-teal-600" />;
    case 'usercheck':
      return <UserCheck className="w-6 h-6 text-indigo-600" />;
    case 'heartpulse':
      return <HeartPulse className="w-6 h-6 text-amber-500" />;
    default:
      return <Stethoscope className="w-6 h-6 text-sky-600" />;
  }
};

const getServiceColorBg = (index: number) => {
  const backgrounds = [
    'bg-sky-50/70 border-sky-100 hover:border-sky-300',
    'bg-emerald-50/70 border-emerald-100 hover:border-emerald-300',
    'bg-rose-50/70 border-rose-100 hover:border-rose-300',
    'bg-teal-50/70 border-teal-100 hover:border-teal-300',
    'bg-indigo-50/70 border-indigo-100 hover:border-indigo-300',
    'bg-amber-50/70 border-amber-100 hover:border-amber-300',
  ];
  return backgrounds[index % backgrounds.length];
};

export const ServicesSection: React.FC<ServicesSectionProps> = ({
  services,
  onBookService,
}) => {
  const activeServices = services.filter((s) => s.status === 'active');

  return (
    <section id="services" className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-sky-600 block mb-2">
              Comprehensive Care
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
              Clinical & Diagnostic Services
            </h2>
            <p className="mt-3 text-base text-slate-600 max-w-2xl">
              From general physician checkups to computerized diagnostic lab testing, our clinic provides dedicated patient-first medical services.
            </p>
          </div>

          <div className="mt-4 md:mt-0">
            <span className="text-xs text-slate-400 font-medium">
              Real-time directory updated by clinic administration
            </span>
          </div>
        </div>

        {/* Services Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {activeServices.map((service, index) => {
            const cardBg = getServiceColorBg(index);
            return (
              <div
                key={service.id}
                className={`rounded-2xl p-6 sm:p-7 border transition-all duration-200 hover:-translate-y-1 hover:shadow-lg flex flex-col justify-between ${cardBg}`}
              >
                <div>
                  <div className="flex items-center justify-between mb-5">
                    <div className="w-13 h-13 rounded-2xl bg-white shadow-xs flex items-center justify-center border border-white">
                      {getServiceIcon(service.icon)}
                    </div>
                    <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                      {service.category || 'Clinical Care'}
                    </span>
                  </div>

                  <h3 className="text-xl font-bold text-slate-900 mb-2.5">
                    {service.title}
                  </h3>

                  <p className="text-sm text-slate-600 leading-relaxed mb-6">
                    {service.description}
                  </p>
                </div>

                <div className="pt-4 border-t border-slate-200/50 flex items-center justify-between">
                  <span className="text-xs font-semibold text-slate-500">
                    Clinic & Home Service
                  </span>
                  <button
                    onClick={() => onBookService(service)}
                    className="inline-flex items-center gap-1.5 text-xs font-bold text-sky-700 hover:text-sky-800 cursor-pointer group"
                  >
                    <span>Schedule</span>
                    <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
};
