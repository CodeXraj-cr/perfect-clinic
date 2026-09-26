export interface Doctor {
  id: string;
  name: string;
  photo: string;
  qualification: string;
  specialization: string;
  experience: string;
  description: string;
  availableDays: string[];
  startTime: string;
  endTime: string;
  availableDates?: string[];
  fee?: string;
  status: 'active' | 'inactive';
  createdAt: string;
  updatedAt: string;
}

export interface AvailabilitySlot {
  id: string;
  doctorId: string;
  date: string; // YYYY-MM-DD
  day: string; // e.g. "Monday"
  startTime: string; // "17:00"
  endTime: string; // "20:00"
  status: 'available' | 'booked' | 'blocked';
  notes?: string;
}

export interface ClinicService {
  id: string;
  title: string;
  description: string;
  icon: string;
  image?: string;
  category: string;
  status: 'active' | 'inactive';
}

export interface BloodTest {
  id: string;
  name: string;
  code: string;
  description: string;
  instructions: string;
  fastingRequired: boolean;
  fastingDuration?: string;
  sampleType: string;
  reportTime: string;
  price?: string;
  status: 'active' | 'inactive';
}

export interface Phlebotomist {
  name: string;
  photo: string;
  qualification: string;
  experience: string;
  description: string;
  whatsapp: string;
  availableHours: string;
}

export interface ClinicInfo {
  clinicName: string;
  logoText: string;
  tagline: string;
  about: string;
  address: string;
  phone: string;
  email: string;
  whatsapp: string;
  heroImage: string;
  openingTime: string;
  closingTime: string;
  workingDays: string;
  sundayOpeningTime: string;
  sundayClosingTime: string;
  isClosedHoliday: boolean;
  holidayNotice: string;
  instagramUrl: string;
  facebookUrl: string;
  developerName: string;
  developerInstagram: string;
  developerInstagramUrl: string;
}

export interface AppointmentRecord {
  id: string;
  type: 'doctor' | 'blood_test';
  patientName: string;
  patientAge?: string;
  phone: string;
  doctorName?: string;
  testName?: string;
  date: string;
  time: string;
  notes?: string;
  createdAt: string;
}

export interface AdminUser {
  email: string;
  name: string;
  role: string;
}
