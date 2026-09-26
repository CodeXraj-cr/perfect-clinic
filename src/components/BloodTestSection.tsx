import React, { useState } from 'react';
import {
  Droplets,
  AlertTriangle,
  Clock,
  FileText,
  Search,
  CheckCircle2,
  Send,
  Sparkles,
  Info,
  ShieldCheck,
  Filter,
} from 'lucide-react';
import { BloodTest, Phlebotomist, ClinicInfo } from '../types/clinic';
import { PhlebotomistSection } from './PhlebotomistSection';

interface BloodTestSectionProps {
  bloodTests: BloodTest[];
  phlebotomist: Phlebotomist;
  clinic: ClinicInfo;
  onBookTest: (test?: BloodTest) => void;
}

export const BloodTestSection: React.FC<BloodTestSectionProps> = ({
  bloodTests,
  phlebotomist,
  clinic,
  onBookTest,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [fastingFilter, setFastingFilter] = useState<'all' | 'fasting' | 'no-fasting'>('all');

  const filteredTests = bloodTests.filter((test) => {
    if (test.status !== 'active') return false;
    const matchesSearch =
      test.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      test.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      test.code?.toLowerCase().includes(searchQuery.toLowerCase());

    if (!matchesSearch) return false;

    if (fastingFilter === 'fasting') return test.fastingRequired;
    if (fastingFilter === 'no-fasting') return !test.fastingRequired;
    return true;
  });

  return (
    <section id="blood-test" className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
        
        {/* Section Header */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 pb-6 border-b border-slate-200">
          <div>
            <div className="inline-flex items-center gap-2 mb-2 text-xs font-bold uppercase tracking-wider text-teal-700 bg-teal-50 border border-teal-200 px-3 py-1 rounded-full">
              <Droplets className="w-3.5 h-3.5 text-rose-500 fill-rose-500" />
              <span>Laboratory Diagnostic Services</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
              Blood Testing & Clinical Pathology
            </h2>
            <p className="mt-2 text-base text-slate-600 max-w-2xl">
              Accurate, certified laboratory blood tests with sterile sample collection, clear fasting guidelines, and rapid reporting turnaround.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-3">
            <button
              onClick={() => onBookTest()}
              className="py-3 px-5 rounded-xl bg-teal-600 hover:bg-teal-700 active:scale-98 text-white font-bold text-xs shadow-sm flex items-center justify-center gap-2 cursor-pointer transition-all"
            >
              <Send className="w-3.5 h-3.5" />
              <span>Book Any Blood Test via WhatsApp</span>
            </button>
          </div>
        </div>

        {/* SECTION 11: Blood Test Rules & Preparation Instructions */}
        <div className="bg-slate-50 rounded-3xl p-6 sm:p-8 border border-slate-200">
          <div className="flex items-center gap-2.5 mb-4">
            <div className="w-8 h-8 rounded-lg bg-amber-100 text-amber-700 flex items-center justify-center">
              <Info className="w-5 h-5" />
            </div>
            <h3 className="text-xl font-bold text-slate-900 tracking-tight">
              Important Instructions Before Blood Test
            </h3>
          </div>

          {/* 5 Clear Demo Rules */}
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4 my-6">
            <div className="p-4 rounded-2xl bg-white border border-slate-200/80 shadow-2xs">
              <span className="w-6 h-6 rounded-full bg-sky-100 text-sky-800 font-extrabold text-xs flex items-center justify-center mb-2.5">
                1
              </span>
              <h4 className="text-xs font-bold text-slate-900 mb-1">
                Fasting Guidelines
              </h4>
              <p className="text-[11px] text-slate-600 leading-relaxed">
                Follow fasting requirements when specified (typically 10–12 hrs for Lipid, 8–10 hrs for Glucose/LFT).
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-white border border-slate-200/80 shadow-2xs">
              <span className="w-6 h-6 rounded-full bg-sky-100 text-sky-800 font-extrabold text-xs flex items-center justify-center mb-2.5">
                2
              </span>
              <h4 className="text-xs font-bold text-slate-900 mb-1">
                Drink Plain Water
              </h4>
              <p className="text-[11px] text-slate-600 leading-relaxed">
                Drink ample plain water unless instructed otherwise. Good hydration makes vein puncture gentle and smooth.
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-white border border-slate-200/80 shadow-2xs">
              <span className="w-6 h-6 rounded-full bg-sky-100 text-sky-800 font-extrabold text-xs flex items-center justify-center mb-2.5">
                3
              </span>
              <h4 className="text-xs font-bold text-slate-900 mb-1">
                Mention Medications
              </h4>
              <p className="text-[11px] text-slate-600 leading-relaxed">
                Inform the phlebotomist about regular medications (especially thyroid supplements, insulin, or blood thinners).
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-white border border-slate-200/80 shadow-2xs">
              <span className="w-6 h-6 rounded-full bg-sky-100 text-sky-800 font-extrabold text-xs flex items-center justify-center mb-2.5">
                4
              </span>
              <h4 className="text-xs font-bold text-slate-900 mb-1">
                Previous Reports
              </h4>
              <p className="text-[11px] text-slate-600 leading-relaxed">
                Carry previous medical reports or doctor’s prescription slip if available for comparative reference.
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-white border border-slate-200/80 shadow-2xs">
              <span className="w-6 h-6 rounded-full bg-sky-100 text-sky-800 font-extrabold text-xs flex items-center justify-center mb-2.5">
                5
              </span>
              <h4 className="text-xs font-bold text-slate-900 mb-1">
                Professional Advice
              </h4>
              <p className="text-[11px] text-slate-600 leading-relaxed">
                Always follow the exact custom instructions provided by your consulting doctor or clinical pathologist.
              </p>
            </div>
          </div>

          {/* Medical Disclaimer per Prompt */}
          <div className="p-3.5 rounded-xl bg-amber-50/80 border border-amber-200 text-xs text-amber-900 flex items-start gap-2.5">
            <AlertTriangle className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
            <p className="leading-relaxed">
              <strong>Medical Disclaimer:</strong> These are general demo instructions. Patients should follow the specific instructions provided by their healthcare professional or laboratory. Demo content may be updated by the clinic administrator.
            </p>
          </div>
        </div>

        {/* SECTION 12: Meet Our Phlebotomist */}
        <PhlebotomistSection
          phlebotomist={phlebotomist}
          clinic={clinic}
          onBookBloodTestClick={() => onBookTest()}
        />

        {/* Available Blood Tests Catalog & Search Filter */}
        <div>
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
            <div>
              <h3 className="text-2xl font-bold text-slate-900 tracking-tight">
                Available Blood Tests Directory
              </h3>
              <p className="text-xs text-slate-500">
                Transparent test details, sample requirements, and reporting schedules
              </p>
            </div>

            {/* Search and Fasting Filter */}
            <div className="flex flex-wrap items-center gap-2.5">
              <div className="relative">
                <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Search test name or code..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-8 pr-3 py-1.5 text-xs rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-teal-500 bg-white w-48 sm:w-56"
                />
              </div>

              {/* Fasting filter tabs */}
              <div className="inline-flex p-1 rounded-lg bg-slate-100 border border-slate-200">
                <button
                  onClick={() => setFastingFilter('all')}
                  className={`px-2.5 py-1 text-[11px] font-semibold rounded-md transition-colors cursor-pointer ${
                    fastingFilter === 'all'
                      ? 'bg-white text-slate-900 shadow-2xs'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  All
                </button>
                <button
                  onClick={() => setFastingFilter('fasting')}
                  className={`px-2.5 py-1 text-[11px] font-semibold rounded-md transition-colors cursor-pointer ${
                    fastingFilter === 'fasting'
                      ? 'bg-white text-slate-900 shadow-2xs'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  Fasting Required
                </button>
                <button
                  onClick={() => setFastingFilter('no-fasting')}
                  className={`px-2.5 py-1 text-[11px] font-semibold rounded-md transition-colors cursor-pointer ${
                    fastingFilter === 'no-fasting'
                      ? 'bg-white text-slate-900 shadow-2xs'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  Non-Fasting
                </button>
              </div>
            </div>
          </div>

          {/* Test Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredTests.map((test) => (
              <div
                key={test.id}
                className="bg-white rounded-2xl p-6 border border-slate-200 hover:border-teal-300 shadow-xs hover:shadow-md transition-all flex flex-col justify-between"
              >
                <div>
                  {/* Top tags */}
                  <div className="flex items-center justify-between gap-2 mb-3">
                    <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-slate-400 bg-slate-100 px-2 py-0.5 rounded">
                      {test.code}
                    </span>

                    {test.fastingRequired ? (
                      <span className="text-[11px] font-bold text-amber-700 bg-amber-50 border border-amber-200 px-2.5 py-0.5 rounded-full">
                        Fasting: {test.fastingDuration || '10–12 hrs'}
                      </span>
                    ) : (
                      <span className="text-[11px] font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2.5 py-0.5 rounded-full">
                        No Fasting Required
                      </span>
                    )}
                  </div>

                  <h4 className="text-base font-bold text-slate-900 mb-2 leading-snug">
                    {test.name}
                  </h4>

                  <p className="text-xs text-slate-600 leading-relaxed mb-4">
                    {test.description}
                  </p>

                  {/* Specifications */}
                  <div className="space-y-1.5 text-xs text-slate-600 bg-slate-50 p-3 rounded-xl mb-4">
                    <div className="flex items-center justify-between">
                      <span className="text-slate-400">Sample:</span>
                      <span className="font-medium text-slate-800">{test.sampleType}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-slate-400">Reporting Time:</span>
                      <span className="font-semibold text-teal-700">{test.reportTime}</span>
                    </div>
                    {test.price && (
                      <div className="flex items-center justify-between pt-1 border-t border-slate-200/60">
                        <span className="text-slate-400">Standard Fee:</span>
                        <span className="font-extrabold text-slate-900">{test.price}</span>
                      </div>
                    )}
                  </div>

                  {/* Preparation Instructions */}
                  <p className="text-[11px] text-slate-500 italic bg-sky-50/50 p-2.5 rounded-lg border border-sky-100">
                    <strong className="text-sky-900 not-italic">Prep: </strong>{test.instructions}
                  </p>
                </div>

                <div className="pt-4 mt-4 border-t border-slate-100">
                  <button
                    onClick={() => onBookTest(test)}
                    className="w-full py-2.5 px-3 rounded-xl bg-teal-50 hover:bg-teal-600 text-teal-800 hover:text-white font-bold text-xs border border-teal-200 hover:border-teal-600 transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>Book Test via WhatsApp</span>
                  </button>
                </div>
              </div>
            ))}
          </div>

          {filteredTests.length === 0 && (
            <div className="p-12 text-center bg-slate-50 rounded-2xl border border-dashed border-slate-200">
              <p className="text-sm text-slate-500 font-medium">
                No tests found matching "{searchQuery}".
              </p>
            </div>
          )}
        </div>

      </div>
    </section>
  );
};
