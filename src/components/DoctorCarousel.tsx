import React, { useState, useRef, useEffect } from 'react';
import {
  ChevronLeft,
  ChevronRight,
  Clock,
  Calendar,
  Award,
  ArrowRight,
  Sparkles,
  LayoutGrid,
  Columns3,
} from 'lucide-react';
import { Doctor } from '../types/clinic';

interface DoctorCarouselProps {
  doctors: Doctor[];
  onSelectDoctor: (doctor: Doctor) => void;
}

export const DoctorCarousel: React.FC<DoctorCarouselProps> = ({
  doctors,
  onSelectDoctor,
}) => {
  const activeDoctors = doctors.filter((d) => d.status === 'active');
  const [viewMode, setViewMode] = useState<'carousel' | 'grid'>('carousel');
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const touchStartX = useRef<number | null>(null);

  // Auto-slide effect for carousel
  useEffect(() => {
    if (viewMode !== 'carousel' || isPaused || activeDoctors.length <= 1) return;

    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % activeDoctors.length);
    }, 4500);

    return () => clearInterval(interval);
  }, [viewMode, isPaused, activeDoctors.length]);

  const handlePrev = () => {
    setCurrentIndex((prev) =>
      prev === 0 ? activeDoctors.length - 1 : prev - 1
    );
  };

  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 1) % activeDoctors.length);
  };

  // Touch handlers for mobile swipe
  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX.current === null) return;
    const touchEndX = e.changedTouches[0].clientX;
    const diff = touchStartX.current - touchEndX;
    if (diff > 50) {
      handleNext();
    } else if (diff < -50) {
      handlePrev();
    }
    touchStartX.current = null;
  };

  return (
    <section id="doctors" className="py-20 bg-slate-50 border-y border-sky-100/70">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-10">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-sky-600 block mb-2">
              Our Medical Team
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
              Experienced Doctors & Specialists
            </h2>
            <p className="mt-2 text-base text-slate-600 max-w-2xl">
              Meet our board-certified medical professionals. Select a doctor to inspect available consultation dates and schedule directly via WhatsApp.
            </p>
          </div>

          {/* Controls: Mode Switch & Arrows */}
          <div className="mt-5 md:mt-0 flex items-center gap-3">
            {/* Carousel / Grid toggle */}
            <div className="inline-flex p-1 rounded-xl bg-white border border-slate-200 shadow-2xs">
              <button
                onClick={() => setViewMode('carousel')}
                className={`px-3 py-1.5 text-xs font-semibold rounded-lg flex items-center gap-1.5 transition-colors cursor-pointer ${
                  viewMode === 'carousel'
                    ? 'bg-sky-600 text-white shadow-2xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <Columns3 className="w-3.5 h-3.5" />
                <span>Carousel</span>
              </button>
              <button
                onClick={() => setViewMode('grid')}
                className={`px-3 py-1.5 text-xs font-semibold rounded-lg flex items-center gap-1.5 transition-colors cursor-pointer ${
                  viewMode === 'grid'
                    ? 'bg-sky-600 text-white shadow-2xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <LayoutGrid className="w-3.5 h-3.5" />
                <span>All Doctors</span>
              </button>
            </div>

            {viewMode === 'carousel' && (
              <div className="flex items-center gap-1.5">
                <button
                  onClick={handlePrev}
                  className="w-9 h-9 rounded-xl bg-white border border-slate-200 hover:bg-sky-50 hover:border-sky-300 text-slate-700 flex items-center justify-center transition-colors shadow-2xs cursor-pointer"
                  aria-label="Previous doctor"
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>
                <button
                  onClick={handleNext}
                  className="w-9 h-9 rounded-xl bg-white border border-slate-200 hover:bg-sky-50 hover:border-sky-300 text-slate-700 flex items-center justify-center transition-colors shadow-2xs cursor-pointer"
                  aria-label="Next doctor"
                >
                  <ChevronRight className="w-5 h-5" />
                </button>
              </div>
            )}
          </div>
        </div>

        {/* View Mode: Carousel */}
        {viewMode === 'carousel' ? (
          <div
            className="relative overflow-hidden pt-2 pb-6"
            onMouseEnter={() => setIsPaused(true)}
            onMouseLeave={() => setIsPaused(false)}
            onTouchStart={handleTouchStart}
            onTouchEnd={handleTouchEnd}
          >
            {/* Doctor cards track */}
            <div
              className="flex transition-transform duration-500 ease-out gap-6"
              style={{
                transform: `translateX(-${currentIndex * (100 / Math.min(activeDoctors.length, 3))}%)`,
              }}
            >
              {activeDoctors.map((doctor) => (
                <div
                  key={doctor.id}
                  className="w-full sm:w-[calc(50%-12px)] lg:w-[calc(33.333%-16px)] shrink-0"
                >
                  <DoctorCard doctor={doctor} onSelectDoctor={onSelectDoctor} />
                </div>
              ))}
            </div>

            {/* Pagination Indicators */}
            <div className="flex justify-center items-center gap-2 mt-8">
              {activeDoctors.map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => setCurrentIndex(idx)}
                  className={`h-2 rounded-full transition-all cursor-pointer ${
                    currentIndex === idx
                      ? 'w-7 bg-sky-600'
                      : 'w-2 bg-slate-300 hover:bg-slate-400'
                  }`}
                  aria-label={`Go to slide ${idx + 1}`}
                />
              ))}
            </div>
          </div>
        ) : (
          /* View Mode: Grid */
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {activeDoctors.map((doctor) => (
              <DoctorCard
                key={doctor.id}
                doctor={doctor}
                onSelectDoctor={onSelectDoctor}
              />
            ))}
          </div>
        )}

      </div>
    </section>
  );
};

// Reusable Doctor Card Component
const DoctorCard: React.FC<{
  doctor: Doctor;
  onSelectDoctor: (doctor: Doctor) => void;
}> = ({ doctor, onSelectDoctor }) => {
  return (
    <div className="bg-white rounded-2xl border border-sky-100 shadow-sm hover:shadow-lg transition-all duration-300 flex flex-col justify-between overflow-hidden group">
      <div>
        {/* Photo with clean overlay */}
        <div className="relative aspect-square w-full overflow-hidden bg-slate-100">
          <img
            src={doctor.photo}
            alt={doctor.name}
            referrerPolicy="no-referrer"
            className="w-full h-full object-cover object-top group-hover:scale-103 transition-transform duration-500"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 via-transparent to-transparent opacity-80" />
          
          {/* Experience tag */}
          <div className="absolute bottom-3 left-3 bg-white/95 backdrop-blur-xs px-2.5 py-1 rounded-lg text-xs font-bold text-slate-800 shadow-2xs flex items-center gap-1.5">
            <Award className="w-3.5 h-3.5 text-sky-600" />
            <span>{doctor.experience}</span>
          </div>

          {/* Fee tag if specified */}
          {doctor.fee && (
            <div className="absolute top-3 right-3 bg-sky-600 text-white px-2.5 py-1 rounded-lg text-xs font-bold shadow-2xs">
              {doctor.fee}
            </div>
          )}
        </div>

        {/* Doctor Information */}
        <div className="p-5 sm:p-6">
          <span className="text-xs font-bold uppercase tracking-wider text-teal-700 block mb-1">
            {doctor.specialization}
          </span>
          <h3 className="text-xl font-extrabold text-slate-900 tracking-tight">
            {doctor.name}
          </h3>
          <p className="text-xs text-slate-500 font-medium mb-4">
            {doctor.qualification}
          </p>

          <p className="text-xs text-slate-600 line-clamp-2 mb-5 leading-relaxed">
            {doctor.description}
          </p>

          {/* Available Schedule info */}
          <div className="bg-sky-50/60 rounded-xl p-3.5 border border-sky-100/80 mb-2 space-y-2">
            <div className="flex items-start gap-2 text-xs text-slate-700">
              <Calendar className="w-3.5 h-3.5 text-sky-600 shrink-0 mt-0.5" />
              <div>
                <span className="font-semibold block text-slate-900">Days:</span>
                <span>{doctor.availableDays.join(', ')}</span>
              </div>
            </div>

            <div className="flex items-center gap-2 text-xs text-slate-700">
              <Clock className="w-3.5 h-3.5 text-sky-600 shrink-0" />
              <div>
                <span className="font-semibold text-slate-900">Timing: </span>
                <span>{doctor.startTime} – {doctor.endTime}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Appointment CTA Button */}
      <div className="p-5 sm:p-6 pt-0">
        <button
          onClick={() => onSelectDoctor(doctor)}
          className="w-full py-2.5 px-4 rounded-xl bg-sky-600 hover:bg-sky-700 active:scale-98 text-white font-bold text-xs shadow-xs hover:shadow transition-all flex items-center justify-center gap-2 cursor-pointer"
        >
          <span>Book Appointment</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
};
