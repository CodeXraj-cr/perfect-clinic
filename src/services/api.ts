import {
  ClinicInfo,
  Doctor,
  AvailabilitySlot,
  ClinicService,
  BloodTest,
  Phlebotomist,
  AppointmentRecord,
} from '../types/clinic';

const TOKEN_KEY = 'perfect_clinic_admin_token';

export const getStoredToken = (): string | null => {
  return localStorage.getItem(TOKEN_KEY);
};

export const setStoredToken = (token: string): void => {
  localStorage.setItem(TOKEN_KEY, token);
};

export const clearStoredToken = (): void => {
  localStorage.removeItem(TOKEN_KEY);
};

const getHeaders = () => {
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
  };
  const token = getStoredToken();
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }
  return headers;
};

export const api = {
  // Clinic
  getClinic: async (): Promise<ClinicInfo> => {
    const res = await fetch('/api/clinic');
    if (!res.ok) throw new Error('Failed to load clinic information');
    return res.json();
  },

  updateClinic: async (data: Partial<ClinicInfo>): Promise<ClinicInfo> => {
    const res = await fetch('/api/clinic', {
      method: 'PUT',
      headers: getHeaders(),
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error('Failed to update clinic information');
    return res.json();
  },

  // Doctors
  getDoctors: async (): Promise<Doctor[]> => {
    const res = await fetch('/api/doctors');
    if (!res.ok) throw new Error('Failed to fetch doctors');
    return res.json();
  },

  getDoctor: async (id: string): Promise<Doctor> => {
    const res = await fetch(`/api/doctors/${id}`);
    if (!res.ok) throw new Error('Doctor not found');
    return res.json();
  },

  addDoctor: async (doc: Omit<Doctor, 'id' | 'createdAt' | 'updatedAt'>): Promise<Doctor> => {
    const res = await fetch('/api/doctors', {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(doc),
    });
    if (!res.ok) throw new Error('Failed to add doctor');
    return res.json();
  },

  updateDoctor: async (id: string, updates: Partial<Doctor>): Promise<Doctor> => {
    const res = await fetch(`/api/doctors/${id}`, {
      method: 'PUT',
      headers: getHeaders(),
      body: JSON.stringify(updates),
    });
    if (!res.ok) throw new Error('Failed to update doctor');
    return res.json();
  },

  deleteDoctor: async (id: string): Promise<void> => {
    const res = await fetch(`/api/doctors/${id}`, {
      method: 'DELETE',
      headers: getHeaders(),
    });
    if (!res.ok) throw new Error('Failed to delete doctor');
  },

  // Availability
  getAvailability: async (doctorId?: string): Promise<AvailabilitySlot[]> => {
    const url = doctorId ? `/api/availability/${doctorId}` : '/api/availability';
    const res = await fetch(url);
    if (!res.ok) throw new Error('Failed to fetch availability');
    return res.json();
  },

  addAvailability: async (slot: Omit<AvailabilitySlot, 'id'>): Promise<AvailabilitySlot> => {
    const res = await fetch('/api/availability', {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(slot),
    });
    if (!res.ok) throw new Error('Failed to add availability slot');
    return res.json();
  },

  updateAvailability: async (id: string, updates: Partial<AvailabilitySlot>): Promise<AvailabilitySlot> => {
    const res = await fetch(`/api/availability/${id}`, {
      method: 'PUT',
      headers: getHeaders(),
      body: JSON.stringify(updates),
    });
    if (!res.ok) throw new Error('Failed to update availability slot');
    return res.json();
  },

  deleteAvailability: async (id: string): Promise<void> => {
    const res = await fetch(`/api/availability/${id}`, {
      method: 'DELETE',
      headers: getHeaders(),
    });
    if (!res.ok) throw new Error('Failed to delete availability slot');
  },

  // Services
  getServices: async (): Promise<ClinicService[]> => {
    const res = await fetch('/api/services');
    if (!res.ok) throw new Error('Failed to fetch services');
    return res.json();
  },

  addService: async (service: Omit<ClinicService, 'id'>): Promise<ClinicService> => {
    const res = await fetch('/api/services', {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(service),
    });
    if (!res.ok) throw new Error('Failed to add service');
    return res.json();
  },

  updateService: async (id: string, updates: Partial<ClinicService>): Promise<ClinicService> => {
    const res = await fetch(`/api/services/${id}`, {
      method: 'PUT',
      headers: getHeaders(),
      body: JSON.stringify(updates),
    });
    if (!res.ok) throw new Error('Failed to update service');
    return res.json();
  },

  deleteService: async (id: string): Promise<void> => {
    const res = await fetch(`/api/services/${id}`, {
      method: 'DELETE',
      headers: getHeaders(),
    });
    if (!res.ok) throw new Error('Failed to delete service');
  },

  // Blood Tests
  getBloodTests: async (): Promise<BloodTest[]> => {
    const res = await fetch('/api/blood-tests');
    if (!res.ok) throw new Error('Failed to fetch blood tests');
    return res.json();
  },

  addBloodTest: async (test: Omit<BloodTest, 'id'>): Promise<BloodTest> => {
    const res = await fetch('/api/blood-tests', {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(test),
    });
    if (!res.ok) throw new Error('Failed to add blood test');
    return res.json();
  },

  updateBloodTest: async (id: string, updates: Partial<BloodTest>): Promise<BloodTest> => {
    const res = await fetch(`/api/blood-tests/${id}`, {
      method: 'PUT',
      headers: getHeaders(),
      body: JSON.stringify(updates),
    });
    if (!res.ok) throw new Error('Failed to update blood test');
    return res.json();
  },

  deleteBloodTest: async (id: string): Promise<void> => {
    const res = await fetch(`/api/blood-tests/${id}`, {
      method: 'DELETE',
      headers: getHeaders(),
    });
    if (!res.ok) throw new Error('Failed to delete blood test');
  },

  // Phlebotomist
  getPhlebotomist: async (): Promise<Phlebotomist> => {
    const res = await fetch('/api/phlebotomist');
    if (!res.ok) throw new Error('Failed to fetch phlebotomist');
    return res.json();
  },

  updatePhlebotomist: async (data: Partial<Phlebotomist>): Promise<Phlebotomist> => {
    const res = await fetch('/api/phlebotomist', {
      method: 'PUT',
      headers: getHeaders(),
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error('Failed to update phlebotomist');
    return res.json();
  },

  // Appointments & Inquiries
  getAppointments: async (): Promise<AppointmentRecord[]> => {
    const res = await fetch('/api/appointments', {
      headers: getHeaders(),
    });
    if (!res.ok) throw new Error('Failed to fetch appointments');
    return res.json();
  },

  logAppointment: async (record: Omit<AppointmentRecord, 'id' | 'createdAt'>): Promise<void> => {
    try {
      await fetch('/api/appointments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(record),
      });
    } catch (e) {
      console.warn('Silent appointment logging error:', e);
    }
  },

  // Stats
  getStats: async () => {
    const res = await fetch('/api/stats');
    if (!res.ok) throw new Error('Failed to fetch statistics');
    return res.json();
  },

  // Admin Auth
  login: async (email: string, password: string) => {
    const res = await fetch('/api/admin/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });
    const data = await res.json();
    if (!res.ok) {
      throw new Error(data.error || 'Login failed');
    }
    setStoredToken(data.token);
    return data;
  },

  checkAdminMe: async () => {
    const token = getStoredToken();
    if (!token) return null;
    const res = await fetch('/api/admin/me', {
      headers: getHeaders(),
    });
    if (!res.ok) {
      clearStoredToken();
      return null;
    }
    return res.json();
  }
};
