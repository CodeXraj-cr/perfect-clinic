import fs from 'fs';
import path from 'path';
import {
  ClinicInfo,
  Doctor,
  AvailabilitySlot,
  ClinicService,
  BloodTest,
  Phlebotomist,
  AppointmentRecord,
} from '../src/types/clinic.js';

interface DatabaseSchema {
  clinic: ClinicInfo;
  doctors: Doctor[];
  availability: AvailabilitySlot[];
  services: ClinicService[];
  bloodTests: BloodTest[];
  phlebotomist: Phlebotomist;
  appointments: AppointmentRecord[];
}

const DATA_DIR = path.resolve(process.cwd(), 'data');
const DATA_FILE = path.join(DATA_DIR, 'clinic_data.json');

const INITIAL_DATA: DatabaseSchema = {
  clinic: {
    clinicName: "+PERFECT+",
    logoText: "+PERFECT+",
    tagline: "Your Health, Our Priority",
    about: "+PERFECT+ Medical Clinic is committed to providing comprehensive, compassionate, and patient-centered healthcare. Combining experienced specialist physicians, state-of-the-art pathology diagnostics, and effortless appointment scheduling.",
    address: "Plot 42, Health Avenue, Salt Lake Sector 5, Kolkata - 700091",
    phone: "+91 97336 49491",
    email: "care@perfectclinic.com",
    whatsapp: "+919733649491",
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
    developerInstagramUrl: "https://instagram.com/rajdutta_dev"
  },

  doctors: [
    {
      id: "doc-1",
      name: "Dr. Ananya Sen",
      photo: "/src/assets/images/doctor_female_general_1790442833402.jpg",
      qualification: "MBBS, MD (Medicine)",
      specialization: "General Physician & Internal Medicine",
      experience: "8+ Years",
      description: "Dedicated physician specializing in chronic lifestyle disease management, hypertension, diabetic care, and seasonal infections with holistic patient care.",
      availableDays: ["Monday", "Wednesday", "Friday"],
      startTime: "5:00 PM",
      endTime: "8:00 PM",
      availableDates: ["2026-09-28", "2026-09-30", "2026-10-02", "2026-10-05"],
      fee: "₹600",
      status: "active",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    },
    {
      id: "doc-2",
      name: "Dr. Rajesh Mukherjee",
      photo: "/src/assets/images/doctor_male_cardiologist_1790442845045.jpg",
      qualification: "MBBS, MD, DM (Cardiology)",
      specialization: "Consultant Senior Cardiologist",
      experience: "14+ Years",
      description: "Senior consultant cardiologist with extensive clinical experience in preventive cardiology, ECG evaluation, lipid management, and cardiovascular rehabilitation.",
      availableDays: ["Tuesday", "Thursday", "Saturday"],
      startTime: "6:00 PM",
      endTime: "9:00 PM",
      availableDates: ["2026-09-29", "2026-10-01", "2026-10-03", "2026-10-06"],
      fee: "₹900",
      status: "active",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    },
    {
      id: "doc-3",
      name: "Dr. Sunita Roy",
      photo: "/src/assets/images/doctor_female_general_1790442833402.jpg",
      qualification: "MBBS, DGO, MS (Obstetrics & Gynae)",
      specialization: "Obstetrician & Gynecologist",
      experience: "11+ Years",
      description: "Compassionate specialist in women's health, pre-pregnancy counseling, hormonal imbalances, PCOS management, and adolescent wellness.",
      availableDays: ["Monday", "Tuesday", "Thursday"],
      startTime: "10:00 AM",
      endTime: "1:00 PM",
      availableDates: ["2026-09-28", "2026-09-29", "2026-10-01", "2026-10-05"],
      fee: "₹700",
      status: "active",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    },
    {
      id: "doc-4",
      name: "Dr. Amitava Ghosh",
      photo: "/src/assets/images/doctor_male_cardiologist_1790442845045.jpg",
      qualification: "MBBS, MD (Pediatrics), DCH",
      specialization: "Consultant Pediatrician & Neonatologist",
      experience: "9+ Years",
      description: "Gentle child specialist catering to infant growth milestones, childhood immunizations, pediatric nutrition, and seasonal allergies.",
      availableDays: ["Wednesday", "Friday", "Sunday"],
      startTime: "10:00 AM",
      endTime: "1:00 PM",
      availableDates: ["2026-09-30", "2026-10-02", "2026-10-04", "2026-10-07"],
      fee: "₹650",
      status: "active",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }
  ],

  availability: [
    {
      id: "slot-1",
      doctorId: "doc-1",
      date: "2026-09-28",
      day: "Monday",
      startTime: "5:00 PM",
      endTime: "8:00 PM",
      status: "available",
      notes: "Evening Clinic Session"
    },
    {
      id: "slot-2",
      doctorId: "doc-1",
      date: "2026-09-30",
      day: "Wednesday",
      startTime: "5:00 PM",
      endTime: "8:00 PM",
      status: "available",
      notes: "Evening Clinic Session"
    },
    {
      id: "slot-3",
      doctorId: "doc-1",
      date: "2026-10-02",
      day: "Friday",
      startTime: "5:00 PM",
      endTime: "8:00 PM",
      status: "available",
      notes: "Evening Clinic Session"
    },
    {
      id: "slot-4",
      doctorId: "doc-2",
      date: "2026-09-29",
      day: "Tuesday",
      startTime: "6:00 PM",
      endTime: "9:00 PM",
      status: "available",
      notes: "Cardio Consultation"
    },
    {
      id: "slot-5",
      doctorId: "doc-2",
      date: "2026-10-01",
      day: "Thursday",
      startTime: "6:00 PM",
      endTime: "9:00 PM",
      status: "available",
      notes: "Cardio Consultation"
    },
    {
      id: "slot-6",
      doctorId: "doc-2",
      date: "2026-10-03",
      day: "Saturday",
      startTime: "6:00 PM",
      endTime: "9:00 PM",
      status: "available",
      notes: "Weekend Clinic Session"
    },
    {
      id: "slot-7",
      doctorId: "doc-3",
      date: "2026-09-28",
      day: "Monday",
      startTime: "10:00 AM",
      endTime: "1:00 PM",
      status: "available",
      notes: "Morning Clinic"
    },
    {
      id: "slot-8",
      doctorId: "doc-3",
      date: "2026-09-29",
      day: "Tuesday",
      startTime: "10:00 AM",
      endTime: "1:00 PM",
      status: "available",
      notes: "Morning Clinic"
    },
    {
      id: "slot-9",
      doctorId: "doc-4",
      date: "2026-09-30",
      day: "Wednesday",
      startTime: "10:00 AM",
      endTime: "1:00 PM",
      status: "available",
      notes: "Pediatric Clinic"
    },
    {
      id: "slot-10",
      doctorId: "doc-4",
      date: "2026-10-02",
      day: "Friday",
      startTime: "10:00 AM",
      endTime: "1:00 PM",
      status: "available",
      notes: "Pediatric Clinic"
    }
  ],

  services: [
    {
      id: "serv-1",
      title: "General Consultation",
      description: "Professional clinical evaluation for common health complaints, fever, respiratory conditions, blood pressure, and routine medical management.",
      icon: "Stethoscope",
      category: "Outpatient",
      status: "active"
    },
    {
      id: "serv-2",
      title: "Diagnostic Services",
      description: "Basic clinical and laboratory diagnostics, digital 12-lead ECG, blood pressure mapping, blood glucose profiling, and rapid pathology reports.",
      icon: "Activity",
      category: "Diagnostics",
      status: "active"
    },
    {
      id: "serv-3",
      title: "Blood Testing & Pathology",
      description: "Convenient hygienic blood sample collection and certified laboratory tests conducted under sterile standards by certified phlebotomists.",
      icon: "Droplets",
      category: "Laboratory",
      status: "active"
    },
    {
      id: "serv-4",
      title: "Preventive Healthcare",
      description: "Comprehensive annual wellness checkups, executive metabolic profiles, diabetes screenings, and cardiovascular risk assessments.",
      icon: "ShieldCheck",
      category: "Wellness",
      status: "active"
    },
    {
      id: "serv-5",
      title: "Specialist Consultation",
      description: "Direct appointments with eminent doctors in Cardiology, Gynecology, Pediatrics, and Internal Medicine under one roof.",
      icon: "UserCheck",
      category: "Specialists",
      status: "active"
    },
    {
      id: "serv-6",
      title: "Clinical Nursing & First Aid",
      description: "Sterile wound dressing, nebulization therapy, urgent intramuscular injections, cannula care, and vitals observation.",
      icon: "HeartPulse",
      category: "Clinical Care",
      status: "active"
    }
  ],

  bloodTests: [
    {
      id: "test-1",
      name: "Complete Blood Count (CBC) with ESR",
      code: "CBC-01",
      description: "Comprehensive screening for anemia, blood disorders, hemoglobin, white blood cells, platelets, and systemic infection indicators.",
      instructions: "No fasting required. Patients can eat and hydrate normally before the test. Hydration with plain water helps easy sample collection.",
      fastingRequired: false,
      sampleType: "Whole Blood (EDTA Vial)",
      reportTime: "Same Day (4 – 6 Hours)",
      price: "₹350",
      status: "active"
    },
    {
      id: "test-2",
      name: "Lipid Profile (Cholesterol & Triglycerides)",
      code: "LIP-02",
      description: "Measures Total Cholesterol, HDL (good), LDL (bad), VLDL, and Triglycerides to evaluate cardiovascular risk.",
      instructions: "Strict 10 to 12 hours overnight fasting mandatory. Only plain water is permitted. Avoid alcohol and high-fat dinner the prior night.",
      fastingRequired: true,
      fastingDuration: "10 – 12 Hours",
      sampleType: "Serum (Gel Clot Vial)",
      reportTime: "Same Day (Evening)",
      price: "₹650",
      status: "active"
    },
    {
      id: "test-3",
      name: "Liver Function Test (LFT)",
      code: "LFT-03",
      description: "Evaluates SGOT, SGPT, Bilirubin (Total & Direct), Alkaline Phosphatase, Total Protein, and Albumin for hepatic health.",
      instructions: "Overnight fasting (8 – 10 hours) is recommended. Avoid taking heavy hepatotoxic medications unless strictly directed by your doctor.",
      fastingRequired: true,
      fastingDuration: "8 – 10 Hours",
      sampleType: "Serum",
      reportTime: "Same Day (Evening)",
      price: "₹750",
      status: "active"
    },
    {
      id: "test-4",
      name: "Thyroid Profile (Total T3, Total T4, TSH)",
      code: "THY-04",
      description: "Diagnostic assessment of thyroid hormonal activity to detect hypothyroidism, hyperthyroidism, and metabolic sluggishness.",
      instructions: "Early morning sample preferred. If taking thyroid medication (e.g. Thyronorm/Eltroxin), take the tablet only AFTER blood sample collection.",
      fastingRequired: false,
      sampleType: "Serum",
      reportTime: "Next Day (10:00 AM)",
      price: "₹550",
      status: "active"
    },
    {
      id: "test-5",
      name: "Fasting Blood Sugar (FBS) & HbA1c (3-Month Average)",
      code: "GLU-05",
      description: "Gold standard diagnostic for diabetes detection, glycemic variability, and 90-day glycemic control.",
      instructions: "Strict 8 to 10 hours overnight fasting. No morning tea, coffee, or milk. Water is encouraged to prevent dehydration.",
      fastingRequired: true,
      fastingDuration: "8 – 10 Hours",
      sampleType: "Sodium Fluoride + EDTA Whole Blood",
      reportTime: "Same Day (4 Hours)",
      price: "₹500",
      status: "active"
    },
    {
      id: "test-6",
      name: "Kidney Function Test (KFT / RFT with Electrolytes)",
      code: "KFT-06",
      description: "Measures Blood Urea, Serum Creatinine, Uric Acid, Sodium, Potassium, and Chloride for renal clearance.",
      instructions: "Maintain ordinary hydration. Avoid excessive strenuous exercise or unprescribed painkiller tablets the day before testing.",
      fastingRequired: false,
      sampleType: "Serum",
      reportTime: "Same Day",
      price: "₹800",
      status: "active"
    },
    {
      id: "test-7",
      name: "Vitamin D3 (25-OH) & Vitamin B12 Duo",
      code: "VIT-07",
      description: "Critical screening for chronic fatigue, bone density, muscle weakness, and neurological health.",
      instructions: "Fasting not mandatory, but 4 hours post-meal gap is ideal. Avoid multivitamin supplements on the morning of testing.",
      fastingRequired: false,
      sampleType: "Serum",
      reportTime: "24 Hours",
      price: "₹1,400",
      status: "active"
    }
  ],

  phlebotomist: {
    name: "Ms. Priya Das",
    photo: "/src/assets/images/phlebotomist_portrait_1790442856267.jpg",
    qualification: "Certified Medical Lab Technician & Certified Phlebotomist (CMLT, B.Sc MLT)",
    experience: "7+ Years",
    description: "Experienced in gentle, safe, and professional blood sample collection with a patient-friendly approach. Expert in painless geriatric and pediatric vein access with strict aseptic protocols.",
    whatsapp: "+919733649491",
    availableHours: "Monday – Saturday: 8:00 AM – 3:00 PM | Sunday: 9:00 AM – 1:00 PM"
  },

  appointments: [
    {
      id: "apt-1",
      type: "doctor",
      patientName: "Sourav Ganguly",
      patientAge: "42",
      phone: "+91 97336 49491",
      doctorName: "Dr. Ananya Sen",
      date: "2026-09-28",
      time: "5:30 PM",
      notes: "Follow up for routine BP check",
      createdAt: new Date().toISOString()
    },
    {
      id: "apt-2",
      type: "blood_test",
      patientName: "Meenakshi Sen",
      patientAge: "35",
      phone: "+91 97336 49491",
      testName: "Lipid Profile & HbA1c",
      date: "2026-09-29",
      time: "8:30 AM",
      notes: "Fasting sample collection",
      createdAt: new Date().toISOString()
    }
  ]
};

export class ClinicStore {
  private static instance: ClinicStore;
  private data: DatabaseSchema;

  private constructor() {
    this.ensureDataDirectory();
    this.data = this.loadData();
  }

  public static getInstance(): ClinicStore {
    if (!ClinicStore.instance) {
      ClinicStore.instance = new ClinicStore();
    }
    return ClinicStore.instance;
  }

  private ensureDataDirectory() {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }
  }

  private loadData(): DatabaseSchema {
    try {
      if (fs.existsSync(DATA_FILE)) {
        const content = fs.readFileSync(DATA_FILE, 'utf-8');
        const parsed = JSON.parse(content);

        return {
          ...INITIAL_DATA,
          ...parsed,
          clinic: {
            ...INITIAL_DATA.clinic,
            ...(parsed.clinic || {})
          },
          phlebotomist: {
            ...INITIAL_DATA.phlebotomist,
            ...(parsed.phlebotomist || {})
          }
        };
      }
    } catch (err) {
      console.error('Failed reading data file, using defaults', err);
    }

    this.saveData(INITIAL_DATA);
    return INITIAL_DATA;
  }

  private saveData(data: DatabaseSchema): void {
    try {
      this.ensureDataDirectory();
      fs.writeFileSync(
        DATA_FILE,
        JSON.stringify(data, null, 2),
        'utf-8'
      );
    } catch (err) {
      console.error('Failed saving data file', err);
    }
  }

  public getClinic(): ClinicInfo {
    return this.data.clinic;
  }

  public updateClinic(updates: Partial<ClinicInfo>): ClinicInfo {
    this.data.clinic = {
      ...this.data.clinic,
      ...updates
    };

    this.saveData(this.data);
    return this.data.clinic;
  }

  public getDoctors(): Doctor[] {
    return this.data.doctors;
  }

  public getDoctorById(id: string): Doctor | undefined {
    return this.data.doctors.find(d => d.id === id);
  }

  public addDoctor(
    doctor: Omit<Doctor, 'id' | 'createdAt' | 'updatedAt'>
  ): Doctor {
    const newDoc: Doctor = {
      ...doctor,
      id: `doc-${Date.now()}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    this.data.doctors.push(newDoc);
    this.saveData(this.data);

    return newDoc;
  }

  public updateDoctor(
    id: string,
    updates: Partial<Doctor>
  ): Doctor | null {
    const idx = this.data.doctors.findIndex(d => d.id === id);

    if (idx === -1) {
      return null;
    }

    this.data.doctors[idx] = {
      ...this.data.doctors[idx],
      ...updates,
      updatedAt: new Date().toISOString()
    };

    this.saveData(this.data);

    return this.data.doctors[idx];
  }

  public deleteDoctor(id: string): boolean {
    const lenBefore = this.data.doctors.length;

    this.data.doctors = this.data.doctors.filter(
      d => d.id !== id
    );

    // Also remove associated availability
    this.data.availability = this.data.availability.filter(
      a => a.doctorId !== id
    );

    this.saveData(this.data);

    return this.data.doctors.length < lenBefore;
  }

  public getAvailability(
    doctorId?: string
  ): AvailabilitySlot[] {
    if (doctorId) {
      return this.data.availability.filter(
        a => a.doctorId === doctorId
      );
    }

    return this.data.availability;
  }

  public addAvailability(
    slot: Omit<AvailabilitySlot, 'id'>
  ): AvailabilitySlot {
    const newSlot: AvailabilitySlot = {
      ...slot,
      id: `slot-${Date.now()}`
    };

    this.data.availability.push(newSlot);
    this.saveData(this.data);

    return newSlot;
  }

  public updateAvailability(
    id: string,
    updates: Partial<AvailabilitySlot>
  ): AvailabilitySlot | null {
    const idx = this.data.availability.findIndex(
      a => a.id === id
    );

    if (idx === -1) {
      return null;
    }

    this.data.availability[idx] = {
      ...this.data.availability[idx],
      ...updates
    };

    this.saveData(this.data);

    return this.data.availability[idx];
  }

  public deleteAvailability(id: string): boolean {
    const lenBefore = this.data.availability.length;

    this.data.availability = this.data.availability.filter(
      a => a.id !== id
    );

    this.saveData(this.data);

    return this.data.availability.length < lenBefore;
  }

  public getServices(): ClinicService[] {
    return this.data.services;
  }

  public addService(
    service: Omit<ClinicService, 'id'>
  ): ClinicService {
    const newService: ClinicService = {
      ...service,
      id: `serv-${Date.now()}`
    };

    this.data.services.push(newService);
    this.saveData(this.data);

    return newService;
  }

  public updateService(
    id: string,
    updates: Partial<ClinicService>
  ): ClinicService | null {
    const idx = this.data.services.findIndex(
      s => s.id === id
    );

    if (idx === -1) {
      return null;
    }

    this.data.services[idx] = {
      ...this.data.services[idx],
      ...updates
    };

    this.saveData(this.data);

    return this.data.services[idx];
  }

  public deleteService(id: string): boolean {
    const lenBefore = this.data.services.length;

    this.data.services = this.data.services.filter(
      s => s.id !== id
    );

    this.saveData(this.data);

    return this.data.services.length < lenBefore;
  }

  public getBloodTests(): BloodTest[] {
    return this.data.bloodTests;
  }

  public addBloodTest(
    test: Omit<BloodTest, 'id'>
  ): BloodTest {
    const newTest: BloodTest = {
      ...test,
      id: `test-${Date.now()}`
    };

    this.data.bloodTests.push(newTest);
    this.saveData(this.data);

    return newTest;
  }

  public updateBloodTest(
    id: string,
    updates: Partial<BloodTest>
  ): BloodTest | null {
    const idx = this.data.bloodTests.findIndex(
      t => t.id === id
    );

    if (idx === -1) {
      return null;
    }

    this.data.bloodTests[idx] = {
      ...this.data.bloodTests[idx],
      ...updates
    };

    this.saveData(this.data);

    return this.data.bloodTests[idx];
  }

  public deleteBloodTest(id: string): boolean {
    const lenBefore = this.data.bloodTests.length;

    this.data.bloodTests = this.data.bloodTests.filter(
      t => t.id !== id
    );

    this.saveData(this.data);

    return this.data.bloodTests.length < lenBefore;
  }

  public getPhlebotomist(): Phlebotomist {
    return this.data.phlebotomist;
  }

  public updatePhlebotomist(
    updates: Partial<Phlebotomist>
  ): Phlebotomist {
    this.data.phlebotomist = {
      ...this.data.phlebotomist,
      ...updates
    };

    this.saveData(this.data);

    return this.data.phlebotomist;
  }

  public getAppointments(): AppointmentRecord[] {
    return this.data.appointments;
  }

  public logAppointment(
    record: Omit<AppointmentRecord, 'id' | 'createdAt'>
  ): AppointmentRecord {
    const newRecord: AppointmentRecord = {
      ...record,
      id: `apt-${Date.now()}`,
      createdAt: new Date().toISOString()
    };

    this.data.appointments.unshift(newRecord);

    // keep recent 100
    if (this.data.appointments.length > 100) {
      this.data.appointments =
        this.data.appointments.slice(0, 100);
    }

    this.saveData(this.data);

    return newRecord;
  }

  public getStats() {
    const activeDocs = this.data.doctors.filter(
      d => d.status === 'active'
    ).length;

    const activeServices = this.data.services.filter(
      s => s.status === 'active'
    ).length;

    const totalTests = this.data.bloodTests.filter(
      t => t.status === 'active'
    ).length;

    const totalSlots = this.data.availability.filter(
      a => a.status === 'available'
    ).length;

    const totalAppointments =
      this.data.appointments.length;

    return {
      totalDoctors: this.data.doctors.length,
      activeDoctors: activeDocs,
      totalServices: this.data.services.length,
      activeServices: activeServices,
      totalTests: totalTests,
      availableSlots: totalSlots,
      totalAppointments: totalAppointments
    };
  }
}
