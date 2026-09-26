/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useCallback } from 'react';
import {
  ClinicInfo,
  Doctor,
  AvailabilitySlot,
  ClinicService,
  BloodTest,
  Phlebotomist,
} from './types/clinic';
import { api, getStoredToken } from './services/api';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { ServicesSection } from './components/ServicesSection';
import { DoctorCarousel } from './components/DoctorCarousel';
import { DoctorAvailabilityModal } from './components/DoctorAvailabilityModal';
import { BloodTestSection } from './components/BloodTestSection';
import { AppointmentSection } from './components/AppointmentSection';
import { AdminDashboard } from './components/AdminDashboard';
import { Footer } from './components/Footer';
import { WhatsAppFloatingButton } from './components/WhatsAppFloatingButton';
import { LegalModal } from './components/LegalModal';

// Default initial state fallback so UI is immediately responsive
const DEFAULT_CLINIC: ClinicInfo = {
  clinicName: "+PERFECT+",
  logoText: "+PERFECT+",
  tagline: "Your Health, Our Priority",
  about: "+PERFECT+ Medical Clinic is committed to providing comprehensive, compassionate, and patient-centered healthcare. Combining experienced specialist physicians, state-of-the-art pathology diagnostics, and effortless appointment scheduling.",
  address: "Plot 42, Health Avenue, Salt Lake Sector 5, Kolkata - 700091",
  phone: "+91 98301 23456",
  email: "care@perfectclinic.com",
  whatsapp: "+919830123456",
  heroImage: "/src/assets/images/hero_clinic_reception_1790442820365.jpg",
  openingTime: "08:00 AM",
  closingTime: "08:00 PM",
  workingDays: "Monday – Saturday: 8:00 AM – 8:00 PM",
  sundayOpeningTime: "09:00 AM",
  sundayClosingTime: "02:00 PM",
  isClosedHoliday: false,
  holidayNotice: "Open on all national holidays for emergency consultations and scheduled blood collections.",
  instagramUrl: "https://instagram.com/rajdutta_official",
  facebookUrl: "https://facebook.com/perfectclinic",
  developerName: "Raj Dutta",
  developerInstagram: "@rajdutta_dev",
  developerInstagramUrl: "https://instagram.com/rajdutta_dev",
};

const DEFAULT_PHLEBOTOMIST: Phlebotomist = {
  name: "Ms. Priya Das",
  photo: "/src/assets/images/phlebotomist_portrait_1790442856267.jpg",
  qualification: "Certified Medical Lab Technician & Phlebotomist (CMLT, B.Sc MLT)",
  experience: "7+ Years",
  description: "Experienced in gentle, safe, and professional blood sample collection with a patient-friendly approach. Expert in painless geriatric and pediatric vein access.",
  whatsapp: "+919830123456",
  availableHours: "Monday – Saturday: 8:00 AM – 3:00 PM | Sunday: 9:00 AM – 1:00 PM",
};

export default function App() {
  const [clinic, setClinic] = useState<ClinicInfo>(DEFAULT_CLINIC);
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [availabilitySlots, setAvailabilitySlots] = useState<AvailabilitySlot[]>([]);
  const [services, setServices] = useState<ClinicService[]>([]);
  const [bloodTests, setBloodTests] = useState<BloodTest[]>([]);
  const [phlebotomist, setPhlebotomist] = useState<Phlebotomist>(DEFAULT_PHLEBOTOMIST);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // Active section for navigation highlighting
  const [activeSection, setActiveSection] = useState<string>('home');

  // Modals
  const [isDoctorModalOpen, setIsDoctorModalOpen] = useState<boolean>(false);
  const [selectedDoctorForModal, setSelectedDoctorForModal] = useState<Doctor | null>(null);
  const [isAdminDashboardOpen, setIsAdminDashboardOpen] = useState<boolean>(false);
  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState<boolean>(false);

  // Legal modal state
  const [legalModalType, setLegalModalType] = useState<'disclaimer' | 'privacy' | 'terms' | null>(null);

  // Appointment section preset
  const [appointmentTypePreset, setAppointmentTypePreset] = useState<'doctor' | 'blood_test'>('doctor');
  const [presetTestId, setPresetTestId] = useState<string | undefined>(undefined);

  // Load all dynamic data from backend API
  const loadData = useCallback(async () => {
    try {
      const [
        clinicData,
        doctorsData,
        slotsData,
        servicesData,
        testsData,
        phlebData,
      ] = await Promise.all([
        api.getClinic().catch(() => DEFAULT_CLINIC),
        api.getDoctors().catch(() => []),
        api.getAvailability().catch(() => []),
        api.getServices().catch(() => []),
        api.getBloodTests().catch(() => []),
        api.getPhlebotomist().catch(() => DEFAULT_PHLEBOTOMIST),
      ]);

      setClinic(clinicData);
      setDoctors(doctorsData);
      setAvailabilitySlots(slotsData);
      setServices(servicesData);
      setBloodTests(testsData);
      setPhlebotomist(phlebData);
    } catch (err) {
      console.error('Error loading clinic data:', err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadData();
    // Check admin session
    if (getStoredToken()) {
      setIsAdminLoggedIn(true);
    }
  }, [loadData]);

  // Handle smooth navigation
  const handleNavigate = (sectionId: string) => {
    setActiveSection(sectionId);
    if (sectionId === 'home') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  // Open doctor availability modal
  const handleOpenDoctorAvailability = (doctor?: Doctor) => {
    if (doctor) {
      setSelectedDoctorForModal(doctor);
    } else if (doctors.length > 0) {
      setSelectedDoctorForModal(doctors[0]);
    }
    setIsDoctorModalOpen(true);
  };

  // Trigger blood test booking
  const handleBookBloodTest = (test?: BloodTest) => {
    setAppointmentTypePreset('blood_test');
    if (test) {
      setPresetTestId(test.id);
    }
    handleNavigate('appointment');
  };

  // Trigger service booking
  const handleBookService = (service: ClinicService) => {
    if (service.category?.toLowerCase().includes('lab') || service.title.toLowerCase().includes('blood')) {
      handleBookBloodTest();
    } else {
      handleNavigate('appointment');
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-800 font-sans selection:bg-sky-100 selection:text-sky-900">
      
      {/* 3. Navigation Bar */}
      <Navbar
        clinic={clinic}
        activeSection={activeSection}
        onNavigate={handleNavigate}
        onOpenAdmin={() => setIsAdminDashboardOpen(true)}
        isAdminLoggedIn={isAdminLoggedIn}
      />

      <main className="flex-1">
        {/* 4. Home / Hero Landing Section + 5. Clinic Timing Card */}
        <div id="home">
          <Hero
            clinic={clinic}
            onFindDoctorClick={() => handleNavigate('doctors')}
            onBloodTestClick={() => handleNavigate('blood-test')}
            onBookAppointmentClick={() => handleNavigate('appointment')}
          />
        </div>

        {/* 6. Services Section */}
        <ServicesSection
          services={services}
          onBookService={handleBookService}
        />

        {/* 7. Doctors Section & Carousel */}
        <DoctorCarousel
          doctors={doctors}
          onSelectDoctor={(doc) => handleOpenDoctorAvailability(doc)}
        />

        {/* 10. Blood Test Section + 11. Blood Test Rules + 12. Phlebotomist Section */}
        <BloodTestSection
          bloodTests={bloodTests}
          phlebotomist={phlebotomist}
          clinic={clinic}
          onBookTest={handleBookBloodTest}
        />

        {/* 13. Dedicated Unified Appointment Section */}
        <AppointmentSection
          doctors={doctors}
          bloodTests={bloodTests}
          availabilitySlots={availabilitySlots}
          clinic={clinic}
          initialType={appointmentTypePreset}
          initialDoctorId={selectedDoctorForModal?.id}
          initialTestId={presetTestId}
        />
      </main>

      {/* 21. Footer + 22. Developer Credit */}
      <Footer
        clinic={clinic}
        onNavigate={handleNavigate}
        onOpenLegalModal={(type) => setLegalModalType(type)}
        onOpenAdmin={() => setIsAdminDashboardOpen(true)}
      />

      {/* 8. Doctor Availability System & 9. WhatsApp Appointment Modal */}
      <DoctorAvailabilityModal
        isOpen={isDoctorModalOpen}
        onClose={() => {
          setIsDoctorModalOpen(false);
          setSelectedDoctorForModal(null);
        }}
        doctors={doctors}
        availabilitySlots={availabilitySlots}
        clinic={clinic}
        preselectedDoctorId={selectedDoctorForModal?.id}
      />

      {/* 14 & 15. Admin Panel & Dashboard */}
      <AdminDashboard
        isOpen={isAdminDashboardOpen}
        onClose={() => setIsAdminDashboardOpen(false)}
        clinic={clinic}
        doctors={doctors}
        availabilitySlots={availabilitySlots}
        services={services}
        bloodTests={bloodTests}
        phlebotomist={phlebotomist}
        onRefreshAllData={loadData}
        isAdminLoggedIn={isAdminLoggedIn}
        onLoginSuccess={() => {
          setIsAdminLoggedIn(true);
          loadData();
        }}
        onLogout={() => {
          setIsAdminLoggedIn(false);
        }}
      />

      {/* Legal & Medical Disclaimer Modal */}
      <LegalModal
        isOpen={legalModalType !== null}
        onClose={() => setLegalModalType(null)}
        type={legalModalType}
        clinicName={clinic.clinicName || '+PERFECT+'}
      />

      {/* Quick WhatsApp Floating Contact Trigger */}
      <WhatsAppFloatingButton
        clinic={clinic}
        onQuickBookClick={() => handleNavigate('appointment')}
      />

    </div>
  );
}
