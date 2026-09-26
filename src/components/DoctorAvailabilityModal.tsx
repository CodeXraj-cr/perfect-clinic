import React, { useState, useEffect } from 'react';
import {
  X,
  Calendar,
  Clock,
  User,
  Phone,
  CheckCircle2,
  Send,
  Sparkles,
  Info,
  Award,
} from 'lucide-react';
import { Doctor, AvailabilitySlot, ClinicInfo } from '../types/clinic';
import { generateDoctorWhatsAppUrl } from '../utils/whatsapp';
import { api } from '../services/api';

interface DoctorAvailabilityModalProps {
  isOpen: boolean;
  onClose: () => void;
  doctors: Doctor[];
  availabilitySlots: AvailabilitySlot[];
  clinic: ClinicInfo;
  preselectedDoctorId?: string | null;
}

export const DoctorAvailabilityModal: React.FC<DoctorAvailabilityModalProps> = ({
  isOpen,
  onClose,
  doctors,
  availabilitySlots,
  clinic,
  preselectedDoctorId,
}) => {
  const activeDoctors = doctors.filter((d) => d.status === 'active');
  const [selectedDoctorId, setSelectedDoctorId] = useState<string>(
    preselectedDoctorId || activeDoctors[0]?.id || ''
  );

  const [selectedDate, setSelectedDate] = useState<string>('');
  const [selectedTime, setSelectedTime] = useState<string>('');
  const [patientName, setPatientName] = useState<string>('');
  const [patientAge, setPatientAge] = useState<string>('');
  const [phoneNumber, setPhoneNumber] = useState<string>('');
  const [notes, setNotes] = useState<string>('');
  const [errorMsg, setErrorMsg] = useState<string>('');
  const [isSuccess, setIsSuccess] = useState<boolean>(false);

  // Sync selected doctor when modal opens with preselectedDoctorId
  useEffect(() => {
    if (preselectedDoctorId) {
      setSelectedDoctorId(preselectedDoctorId);
    } else if (activeDoctors.length > 0 && !selectedDoctorId) {
      setSelectedDoctorId(activeDoctors[0].id);
    }
  }, [preselectedDoctorId, activeDoctors]);

  const currentDoctor =
    activeDoctors.find((d) => d.id === selectedDoctorId) || activeDoctors[0];

  // Filter available slots for selected doctor
  const doctorSlots = availabilitySlots.filter(
    (slot) => slot.doctorId === currentDoctor?.id && slot.status === 'available'
  );

  // Group slots by unique date
  const uniqueDates = Array.from(
    new Set(doctorSlots.map((s) => s.date))
  ).sort();

  // If no explicit slot dates exist, generate upcoming realistic dates based on doctor's available days
  const fallbackDates = React.useMemo(() => {
    if (uniqueDates.length > 0) return uniqueDates;
    // generate upcoming 5 days matching doctor's availableDays
    const daysMap: Record<string, number> = {
      Sunday: 0,
      Monday: 1,
      Tuesday: 2,
      Wednesday: 3,
      Thursday: 4,
      Friday: 5,
      Saturday: 6,
    };
    const targetDays = (currentDoctor?.availableDays || ['Monday', 'Wednesday']).map(
      (d) => daysMap[d]
    );

    const res: string[] = [];
    const base = new Date();
    for (let i = 0; i < 21; i++) {
      const d = new Date(base);
      d.setDate(base.getDate() + i);
      if (targetDays.includes(d.getDay())) {
        res.push(d.toISOString().split('T')[0]);
        if (res.length >= 4) break;
      }
    }
    return res;
  }, [uniqueDates, currentDoctor]);

  // Set default selected date
  useEffect(() => {
    const dates = uniqueDates.length > 0 ? uniqueDates : fallbackDates;
    if (dates.length > 0 && !selectedDate) {
      setSelectedDate(dates[0]);
    }
  }, [uniqueDates, fallbackDates, selectedDate]);

  // Time options for the selected doctor
  const timeSlots = React.useMemo(() => {
    if (!currentDoctor) return [];
    // If specific slots exist for date
    const dateSlot = doctorSlots.find((s) => s.date === selectedDate);
    if (dateSlot) {
      return [
        dateSlot.startTime,
        // create intermediate 30 min intervals
        '5:30 PM',
        '6:00 PM',
        '6:30 PM',
        '7:00 PM',
        '7:30 PM',
      ];
    }
    return [
      currentDoctor.startTime,
      '5:30 PM',
      '6:00 PM',
      '6:30 PM',
      '7:00 PM',
      '7:30 PM',
    ];
  }, [currentDoctor, doctorSlots, selectedDate]);

  useEffect(() => {
    if (timeSlots.length > 0 && !selectedTime) {
      setSelectedTime(timeSlots[0]);
    }
  }, [timeSlots, selectedTime]);

  if (!isOpen) return null;

  const handleBooking = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!patientName.trim()) {
      setErrorMsg('Please enter the patient’s full name.');
      return;
    }
    if (!phoneNumber.trim() || phoneNumber.trim().length < 8) {
      setErrorMsg('Please enter a valid contact phone number.');
      return;
    }

    setErrorMsg('');

    // Format date string nicely for WhatsApp
    let formattedDate = selectedDate;
    try {
      const d = new Date(selectedDate);
      formattedDate = d.toLocaleDateString('en-US', {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
      });
    } catch {
      // ignore
    }

    // Log appointment inquiry in backend for audit/clinic records
    await api.logAppointment({
      type: 'doctor',
      patientName: patientName.trim(),
      patientAge: patientAge.trim() || undefined,
      phone: phoneNumber.trim(),
      doctorName: currentDoctor.name,
      date: formattedDate,
      time: selectedTime,
      notes: notes.trim() || undefined,
    });

    // Generate WhatsApp link
    const waUrl = generateDoctorWhatsAppUrl({
      clinicName: clinic.clinicName || '+PERFECT+',
      whatsappNumber: clinic.whatsapp,
      doctorName: currentDoctor.name,
      date: formattedDate,
      time: selectedTime,
      patientName: patientName.trim(),
      patientAge: patientAge.trim(),
      phoneNumber: phoneNumber.trim(),
      notes: notes.trim(),
    });

    setIsSuccess(true);

    // Open WhatsApp
    setTimeout(() => {
      window.open(waUrl, '_blank');
    }, 400);
  };

  const resetForm = () => {
    setIsSuccess(false);
    setPatientName('');
    setPatientAge('');
    setPhoneNumber('');
    setNotes('');
    setErrorMsg('');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs overflow-y-auto">
      <div className="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl border border-sky-100 overflow-hidden my-8 animate-in fade-in zoom-in-95 duration-150">
        
        {/* Header bar */}
        <div className="bg-gradient-to-r from-sky-600 via-sky-700 to-teal-600 px-6 py-5 text-white flex items-center justify-between">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-sky-200">
              Doctor Availability & Scheduling
            </span>
            <h3 className="text-xl font-extrabold tracking-tight">
              Book Doctor Consultation
            </h3>
          </div>
          <button
            onClick={() => {
              resetForm();
              onClose();
            }}
            className="p-1.5 rounded-full hover:bg-white/20 text-white/90 hover:text-white transition-colors cursor-pointer"
            aria-label="Close modal"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {isSuccess ? (
          /* Confirmation State */
          <div className="p-8 text-center">
            <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle2 className="w-10 h-10" />
            </div>
            <h4 className="text-2xl font-extrabold text-slate-900 mb-2">
              WhatsApp Chat Prepared!
            </h4>
            <p className="text-sm text-slate-600 max-w-md mx-auto mb-6">
              Your appointment request with <strong>{currentDoctor.name}</strong> for <strong>{selectedDate} at {selectedTime}</strong> has been prepared. Your WhatsApp application should open automatically.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <button
                onClick={() => {
                  const waUrl = generateDoctorWhatsAppUrl({
                    clinicName: clinic.clinicName || '+PERFECT+',
                    whatsappNumber: clinic.whatsapp,
                    doctorName: currentDoctor.name,
                    date: selectedDate,
                    time: selectedTime,
                    patientName: patientName.trim(),
                    patientAge: patientAge.trim(),
                    phoneNumber: phoneNumber.trim(),
                    notes: notes.trim(),
                  });
                  window.open(waUrl, '_blank');
                }}
                className="px-6 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm shadow-sm transition-all cursor-pointer flex items-center justify-center gap-2"
              >
                <Send className="w-4 h-4" />
                <span>Re-open WhatsApp Chat</span>
              </button>
              <button
                onClick={() => {
                  resetForm();
                  onClose();
                }}
                className="px-6 py-3 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-sm transition-all cursor-pointer"
              >
                Close Window
              </button>
            </div>
          </div>
        ) : (
          /* Booking Form */
          <form onSubmit={handleBooking} className="p-6 sm:p-7 space-y-6">
            
            {/* Step 1: Select Doctor */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">
                1. Select Doctor
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {activeDoctors.map((doc) => {
                  const isSelected = doc.id === currentDoctor?.id;
                  return (
                    <button
                      type="button"
                      key={doc.id}
                      onClick={() => {
                        setSelectedDoctorId(doc.id);
                        setSelectedDate('');
                      }}
                      className={`flex items-center gap-3 p-3 rounded-xl border text-left transition-all cursor-pointer ${
                        isSelected
                          ? 'bg-sky-50/90 border-sky-500 ring-2 ring-sky-500/20 shadow-xs'
                          : 'bg-white border-slate-200 hover:border-slate-300'
                      }`}
                    >
                      <img
                        src={doc.photo}
                        alt={doc.name}
                        referrerPolicy="no-referrer"
                        className="w-12 h-12 rounded-lg object-cover object-top border border-slate-200 shrink-0"
                      />
                      <div className="min-w-0">
                        <h4 className="text-xs font-bold text-slate-900 truncate">
                          {doc.name}
                        </h4>
                        <p className="text-[11px] text-teal-700 font-medium truncate">
                          {doc.specialization}
                        </p>
                        <p className="text-[10px] text-slate-400">
                          {doc.availableDays.join(', ')}
                        </p>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Doctor Snapshot Bar */}
            {currentDoctor && (
              <div className="bg-sky-50/70 p-3.5 rounded-xl border border-sky-100 flex items-center justify-between gap-4 text-xs">
                <div>
                  <span className="font-bold text-slate-800">
                    {currentDoctor.name} ({currentDoctor.qualification})
                  </span>
                  <p className="text-slate-500 text-[11px]">
                    Available Timings: {currentDoctor.startTime} – {currentDoctor.endTime}
                  </p>
                </div>
                {currentDoctor.fee && (
                  <div className="text-right shrink-0">
                    <span className="text-[10px] uppercase font-bold text-slate-400 block">Consultation Fee</span>
                    <span className="font-extrabold text-sky-700">{currentDoctor.fee}</span>
                  </div>
                )}
              </div>
            )}

            {/* Step 2: Available Dates */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="text-xs font-bold uppercase tracking-wider text-slate-500">
                  2. Select Available Date
                </label>
                <span className="text-[11px] text-sky-600 font-medium">
                  {currentDoctor.availableDays.join(', ')} Sessions
                </span>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {(uniqueDates.length > 0 ? uniqueDates : fallbackDates).map(
                  (dateStr) => {
                    const isSelected = selectedDate === dateStr;
                    let displayDay = 'Clinic Day';
                    let displayDate = dateStr;
                    try {
                      const d = new Date(dateStr);
                      displayDay = d.toLocaleDateString('en-US', {
                        weekday: 'short',
                      });
                      displayDate = d.toLocaleDateString('en-US', {
                        month: 'short',
                        day: 'numeric',
                      });
                    } catch {
                      // ignore
                    }

                    return (
                      <button
                        type="button"
                        key={dateStr}
                        onClick={() => setSelectedDate(dateStr)}
                        className={`p-3 rounded-xl border text-center transition-all cursor-pointer ${
                          isSelected
                            ? 'bg-sky-600 text-white border-sky-600 shadow-sm'
                            : 'bg-white border-slate-200 hover:border-sky-300 text-slate-700'
                        }`}
                      >
                        <span className={`block text-[11px] font-medium uppercase ${isSelected ? 'text-sky-100' : 'text-slate-400'}`}>
                          {displayDay}
                        </span>
                        <span className="block text-sm font-extrabold">
                          {displayDate}
                        </span>
                      </button>
                    );
                  }
                )}
              </div>
            </div>

            {/* Step 3: Available Time */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">
                3. Select Consultation Time
              </label>
              <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
                {timeSlots.map((time) => {
                  const isSelected = selectedTime === time;
                  return (
                    <button
                      type="button"
                      key={time}
                      onClick={() => setSelectedTime(time)}
                      className={`py-2 px-2 rounded-lg text-xs font-bold border transition-all cursor-pointer ${
                        isSelected
                          ? 'bg-teal-600 text-white border-teal-600 shadow-xs'
                          : 'bg-white border-slate-200 hover:border-teal-300 text-slate-700'
                      }`}
                    >
                      {time}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Step 4: Patient Details */}
            <div className="pt-2 border-t border-slate-100">
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-3">
                4. Patient Information (For Appointment Slip)
              </label>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-3">
                <div className="sm:col-span-2">
                  <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                    Patient Full Name *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. John Doe"
                    value={patientName}
                    onChange={(e) => setPatientName(e.target.value)}
                    className="w-full px-3 py-2 text-sm rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-sky-500 bg-white"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                    Age
                  </label>
                  <input
                    type="number"
                    placeholder="e.g. 38"
                    value={patientAge}
                    onChange={(e) => setPatientAge(e.target.value)}
                    className="w-full px-3 py-2 text-sm rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-sky-500 bg-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                    Phone / Mobile Number *
                  </label>
                  <input
                    type="tel"
                    required
                    placeholder="e.g. +91 98301 23456"
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value)}
                    className="w-full px-3 py-2 text-sm rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-sky-500 bg-white"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                    Consultation Reason (Optional)
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Routine follow-up, fever"
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    className="w-full px-3 py-2 text-sm rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-sky-500 bg-white"
                  />
                </div>
              </div>
            </div>

            {errorMsg && (
              <div className="p-3 rounded-lg bg-rose-50 border border-rose-200 text-xs text-rose-700 font-medium">
                {errorMsg}
              </div>
            )}

            {/* Submit Action: WhatsApp Booking */}
            <div className="pt-2">
              <button
                type="submit"
                className="w-full py-3.5 px-6 rounded-xl bg-emerald-600 hover:bg-emerald-700 active:scale-98 text-white font-extrabold text-sm shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <Send className="w-4 h-4" />
                <span>Book Appointment via WhatsApp</span>
              </button>
              <p className="text-center text-[11px] text-slate-400 mt-2">
                Clicking opens WhatsApp with a pre-filled appointment confirmation. No online payment required.
              </p>
            </div>

          </form>
        )}

      </div>
    </div>
  );
};
