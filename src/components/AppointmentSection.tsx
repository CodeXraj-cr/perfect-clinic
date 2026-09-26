import React, { useState } from 'react';
import {
  Calendar,
  Clock,
  User,
  Phone,
  Droplets,
  Stethoscope,
  Send,
  CheckCircle2,
  AlertCircle,
  Sparkles,
} from 'lucide-react';
import { Doctor, BloodTest, ClinicInfo, AvailabilitySlot } from '../types/clinic';
import {
  generateDoctorWhatsAppUrl,
  generateBloodTestWhatsAppUrl,
} from '../utils/whatsapp';
import { api } from '../services/api';

interface AppointmentSectionProps {
  doctors: Doctor[];
  bloodTests: BloodTest[];
  availabilitySlots: AvailabilitySlot[];
  clinic: ClinicInfo;
  initialType?: 'doctor' | 'blood_test';
  initialDoctorId?: string;
  initialTestId?: string;
}

export const AppointmentSection: React.FC<AppointmentSectionProps> = ({
  doctors,
  bloodTests,
  availabilitySlots,
  clinic,
  initialType = 'doctor',
  initialDoctorId,
  initialTestId,
}) => {
  const activeDoctors = doctors.filter((d) => d.status === 'active');
  const activeBloodTests = bloodTests.filter((t) => t.status === 'active');

  const [appointmentType, setAppointmentType] = useState<'doctor' | 'blood_test'>(
    initialType
  );

  // Form states
  const [selectedDoctorId, setSelectedDoctorId] = useState<string>(
    initialDoctorId || activeDoctors[0]?.id || ''
  );
  const [selectedTestId, setSelectedTestId] = useState<string>(
    initialTestId || activeBloodTests[0]?.id || ''
  );
  const [customTestName, setCustomTestName] = useState<string>('');

  const [selectedDate, setSelectedDate] = useState<string>('2026-09-28');
  const [selectedTime, setSelectedTime] = useState<string>('5:30 PM');
  const [patientName, setPatientName] = useState<string>('');
  const [patientAge, setPatientAge] = useState<string>('');
  const [phoneNumber, setPhoneNumber] = useState<string>('');
  const [notes, setNotes] = useState<string>('');
  const [errorMsg, setErrorMsg] = useState<string>('');
  const [isSuccess, setIsSuccess] = useState<boolean>(false);

  const currentDoctor =
    activeDoctors.find((d) => d.id === selectedDoctorId) || activeDoctors[0];
  const currentTest =
    activeBloodTests.find((t) => t.id === selectedTestId) || activeBloodTests[0];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!patientName.trim()) {
      setErrorMsg('Please enter the patient’s full name.');
      return;
    }
    if (!phoneNumber.trim() || phoneNumber.trim().length < 8) {
      setErrorMsg('Please enter a valid phone number for WhatsApp verification.');
      return;
    }

    setErrorMsg('');

    let waUrl = '';

    if (appointmentType === 'doctor') {
      const docName = currentDoctor ? currentDoctor.name : 'Specialist Doctor';
      await api.logAppointment({
        type: 'doctor',
        patientName: patientName.trim(),
        patientAge: patientAge.trim() || undefined,
        phone: phoneNumber.trim(),
        doctorName: docName,
        date: selectedDate,
        time: selectedTime,
        notes: notes.trim() || undefined,
      });

      waUrl = generateDoctorWhatsAppUrl({
        clinicName: clinic.clinicName || '+PERFECT+',
        whatsappNumber: clinic.whatsapp,
        doctorName: docName,
        date: selectedDate,
        time: selectedTime,
        patientName: patientName.trim(),
        patientAge: patientAge.trim(),
        phoneNumber: phoneNumber.trim(),
        notes: notes.trim(),
      });
    } else {
      const testTitle =
        customTestName.trim() ||
        (currentTest ? currentTest.name : 'Routine Health Panel');

      await api.logAppointment({
        type: 'blood_test',
        patientName: patientName.trim(),
        patientAge: patientAge.trim() || undefined,
        phone: phoneNumber.trim(),
        testName: testTitle,
        date: selectedDate,
        time: selectedTime,
        notes: notes.trim() || undefined,
      });

      waUrl = generateBloodTestWhatsAppUrl({
        clinicName: clinic.clinicName || '+PERFECT+',
        whatsappNumber: clinic.whatsapp,
        testName: testTitle,
        preferredDate: selectedDate,
        preferredTime: selectedTime,
        patientName: patientName.trim(),
        patientAge: patientAge.trim(),
        phoneNumber: phoneNumber.trim(),
        notes: notes.trim(),
      });
    }

    setIsSuccess(true);
    setTimeout(() => {
      window.open(waUrl, '_blank');
    }, 400);
  };

  const handleReset = () => {
    setIsSuccess(false);
    setPatientName('');
    setPatientAge('');
    setPhoneNumber('');
    setNotes('');
  };

  return (
    <section id="appointment" className="py-20 bg-gradient-to-b from-slate-50 to-white">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center mb-10">
          <span className="text-xs font-bold uppercase tracking-wider text-sky-600 block mb-2">
            Instant Scheduling
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            Book Clinic Appointment
          </h2>
          <p className="mt-2 text-base text-slate-600 max-w-xl mx-auto">
            Zero sign-up required. Choose your consultation or laboratory test, fill in your patient details, and confirm directly on WhatsApp.
          </p>
        </div>

        {/* Card Container */}
        <div className="bg-white rounded-3xl p-6 sm:p-10 border border-sky-100 shadow-xl relative overflow-hidden">
          
          {/* Top Segmented Selector: Doctor vs Blood Test */}
          <div className="flex p-1.5 rounded-2xl bg-slate-100 border border-slate-200 mb-8 max-w-md mx-auto">
            <button
              type="button"
              onClick={() => setAppointmentType('doctor')}
              className={`flex-1 py-3 px-4 rounded-xl text-xs sm:text-sm font-bold flex items-center justify-center gap-2 transition-all cursor-pointer ${
                appointmentType === 'doctor'
                  ? 'bg-sky-600 text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Stethoscope className="w-4 h-4" />
              <span>Doctor Consultation</span>
            </button>

            <button
              type="button"
              onClick={() => setAppointmentType('blood_test')}
              className={`flex-1 py-3 px-4 rounded-xl text-xs sm:text-sm font-bold flex items-center justify-center gap-2 transition-all cursor-pointer ${
                appointmentType === 'blood_test'
                  ? 'bg-teal-600 text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Droplets className="w-4 h-4 text-rose-300" />
              <span>Blood Test Booking</span>
            </button>
          </div>

          {isSuccess ? (
            /* Success confirmation */
            <div className="py-8 text-center">
              <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle2 className="w-10 h-10" />
              </div>
              <h3 className="text-2xl font-extrabold text-slate-900 mb-2">
                Booking WhatsApp Message Ready!
              </h3>
              <p className="text-sm text-slate-600 max-w-md mx-auto mb-6">
                Your pre-filled WhatsApp message for <strong>{patientName}</strong> has been generated. The clinic coordinator will confirm your exact slot immediately on WhatsApp.
              </p>
              <div className="flex flex-wrap gap-3 justify-center">
                <button
                  onClick={handleSubmit}
                  className="px-6 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-sm flex items-center gap-2 cursor-pointer"
                >
                  <Send className="w-4 h-4" />
                  <span>Re-send via WhatsApp</span>
                </button>
                <button
                  onClick={handleReset}
                  className="px-6 py-3 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs cursor-pointer"
                >
                  Make Another Booking
                </button>
              </div>
            </div>
          ) : (
            /* Booking Form */
            <form onSubmit={handleSubmit} className="space-y-6">
              
              {/* If Doctor Consultation */}
              {appointmentType === 'doctor' && (
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">
                    Select Specialist Doctor
                  </label>
                  <select
                    value={selectedDoctorId}
                    onChange={(e) => setSelectedDoctorId(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl border border-slate-300 bg-white text-slate-900 text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-sky-500"
                  >
                    {activeDoctors.map((doc) => (
                      <option key={doc.id} value={doc.id}>
                        {doc.name} — {doc.specialization} ({doc.availableDays.join(', ')})
                      </option>
                    ))}
                  </select>

                  {currentDoctor && (
                    <div className="mt-3 p-3.5 rounded-xl bg-sky-50 border border-sky-100 flex items-center justify-between text-xs text-slate-700">
                      <div>
                        <span className="font-bold text-sky-900">{currentDoctor.name}</span>
                        <p className="text-slate-500 text-[11px]">{currentDoctor.qualification}</p>
                      </div>
                      <span className="font-semibold text-sky-800">
                        Hours: {currentDoctor.startTime} – {currentDoctor.endTime}
                      </span>
                    </div>
                  )}
                </div>
              )}

              {/* If Blood Test */}
              {appointmentType === 'blood_test' && (
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">
                    Select Blood Test Package
                  </label>
                  <select
                    value={selectedTestId}
                    onChange={(e) => setSelectedTestId(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl border border-slate-300 bg-white text-slate-900 text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-teal-500 mb-2"
                  >
                    {activeBloodTests.map((t) => (
                      <option key={t.id} value={t.id}>
                        {t.name} ({t.code}) {t.price ? `— ${t.price}` : ''}
                      </option>
                    ))}
                    <option value="custom">Other / Custom Doctor Prescription</option>
                  </select>

                  {selectedTestId === 'custom' && (
                    <div className="mt-2">
                      <input
                        type="text"
                        placeholder="Type test name(s) as mentioned on doctor prescription..."
                        value={customTestName}
                        onChange={(e) => setCustomTestName(e.target.value)}
                        className="w-full px-3 py-2 text-sm rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-teal-500 bg-white"
                      />
                    </div>
                  )}

                  {currentTest && selectedTestId !== 'custom' && (
                    <div className="mt-2 p-3.5 rounded-xl bg-teal-50 border border-teal-100 text-xs text-slate-700">
                      <div className="flex items-center justify-between font-bold text-teal-900 mb-1">
                        <span>{currentTest.name}</span>
                        <span className="text-rose-600 font-extrabold">{currentTest.price}</span>
                      </div>
                      <p className="text-slate-600 text-[11px] mb-1">
                        <strong>Fasting:</strong> {currentTest.fastingRequired ? `Yes (${currentTest.fastingDuration || '10–12 hours'})` : 'No fasting required'} · <strong>Sample:</strong> {currentTest.sampleType}
                      </p>
                      <p className="text-[11px] text-teal-800 italic">
                        Prep Note: {currentTest.instructions}
                      </p>
                    </div>
                  )}
                </div>
              )}

              {/* Date & Time Selection */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">
                    Preferred Date *
                  </label>
                  <input
                    type="date"
                    required
                    value={selectedDate}
                    onChange={(e) => setSelectedDate(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-sky-500 bg-white"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">
                    Preferred Time Slot *
                  </label>
                  <select
                    value={selectedTime}
                    onChange={(e) => setSelectedTime(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-sky-500 bg-white"
                  >
                    <option value="8:00 AM">8:00 AM – 8:30 AM (Fasting Sample)</option>
                    <option value="9:00 AM">9:00 AM – 9:30 AM</option>
                    <option value="10:00 AM">10:00 AM – 10:30 AM</option>
                    <option value="11:30 AM">11:30 AM – 12:00 PM</option>
                    <option value="5:00 PM">5:00 PM – 5:30 PM (Evening Clinic)</option>
                    <option value="5:30 PM">5:30 PM – 6:00 PM</option>
                    <option value="6:00 PM">6:00 PM – 6:30 PM</option>
                    <option value="6:30 PM">6:30 PM – 7:00 PM</option>
                    <option value="7:00 PM">7:00 PM – 7:30 PM</option>
                    <option value="7:30 PM">7:30 PM – 8:00 PM</option>
                  </select>
                </div>
              </div>

              {/* Patient Details */}
              <div className="pt-2 border-t border-slate-100">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-4">
                  <div className="sm:col-span-2">
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Patient Full Name *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Rahul Sharma"
                      value={patientName}
                      onChange={(e) => setPatientName(e.target.value)}
                      className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-sky-500 bg-white"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Age
                    </label>
                    <input
                      type="number"
                      placeholder="e.g. 45"
                      value={patientAge}
                      onChange={(e) => setPatientAge(e.target.value)}
                      className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-sky-500 bg-white"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      WhatsApp Contact Number *
                    </label>
                    <input
                      type="tel"
                      required
                      placeholder="e.g. +91 98301 23456"
                      value={phoneNumber}
                      onChange={(e) => setPhoneNumber(e.target.value)}
                      className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-sky-500 bg-white"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Symptoms / Special Request
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. Home blood collection needed, severe cough"
                      value={notes}
                      onChange={(e) => setNotes(e.target.value)}
                      className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-sky-500 bg-white"
                    />
                  </div>
                </div>
              </div>

              {errorMsg && (
                <div className="p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-xs text-rose-700 font-semibold flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{errorMsg}</span>
                </div>
              )}

              {/* Submit Button */}
              <div className="pt-2">
                <button
                  type="submit"
                  className="w-full py-4 px-6 rounded-2xl bg-emerald-600 hover:bg-emerald-700 active:scale-98 text-white font-extrabold text-sm shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer"
                >
                  <Send className="w-4 h-4" />
                  <span>Book Appointment via WhatsApp</span>
                </button>
                <p className="text-center text-xs text-slate-400 mt-2.5">
                  Generates an immediate WhatsApp chat with +PERFECT+ Clinic reception desk.
                </p>
              </div>

            </form>
          )}

        </div>

      </div>
    </section>
  );
};
