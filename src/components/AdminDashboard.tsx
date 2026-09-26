import React, { useState, useEffect } from 'react';
import {
  X,
  Shield,
  LogOut,
  Users,
  Activity,
  Droplets,
  Calendar,
  Clock,
  Settings,
  Plus,
  Trash2,
  Edit2,
  CheckCircle2,
  AlertCircle,
  Save,
  MessageSquare,
  Lock,
  Mail,
  Phone,
  Share2,
  Sparkles,
} from 'lucide-react';
import {
  Doctor,
  AvailabilitySlot,
  ClinicService,
  BloodTest,
  Phlebotomist,
  ClinicInfo,
  AppointmentRecord,
} from '../types/clinic';
import { api, clearStoredToken } from '../services/api';

interface AdminDashboardProps {
  isOpen: boolean;
  onClose: () => void;
  clinic: ClinicInfo;
  doctors: Doctor[];
  availabilitySlots: AvailabilitySlot[];
  services: ClinicService[];
  bloodTests: BloodTest[];
  phlebotomist: Phlebotomist;
  onRefreshAllData: () => void;
  isAdminLoggedIn: boolean;
  onLoginSuccess: () => void;
  onLogout: () => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({
  isOpen,
  onClose,
  clinic,
  doctors,
  availabilitySlots,
  services,
  bloodTests,
  phlebotomist,
  onRefreshAllData,
  isAdminLoggedIn,
  onLoginSuccess,
  onLogout,
}) => {
  const [activeTab, setActiveTab] = useState<
    | 'stats'
    | 'doctors'
    | 'availability'
    | 'services'
    | 'bloodTests'
    | 'phlebotomist'
    | 'clinicInfo'
    | 'inquiries'
  >('stats');

  // Login form state
  const [loginEmail, setLoginEmail] = useState('admin@perfectclinic.com');
  const [loginPassword, setLoginPassword] = useState('admin123');
  const [loginError, setLoginError] = useState('');
  const [isLoggingIn, setIsLoggingIn] = useState(false);

  // Status message
  const [statusMessage, setStatusMessage] = useState<{
    text: string;
    type: 'success' | 'error';
  } | null>(null);

  // Inquiries state
  const [inquiries, setInquiries] = useState<AppointmentRecord[]>([]);

  // Editing forms state
  const [editingClinic, setEditingClinic] = useState<ClinicInfo>({ ...clinic });
  const [editingPhleb, setEditingPhleb] = useState<Phlebotomist>({ ...phlebotomist });

  // Doctor editing / adding
  const [selectedDoctor, setSelectedDoctor] = useState<Partial<Doctor> | null>(null);
  const [isDoctorModalOpen, setIsDoctorModalOpen] = useState(false);

  // Availability adding
  const [newSlot, setNewSlot] = useState<Partial<AvailabilitySlot>>({
    doctorId: doctors[0]?.id || '',
    date: '2026-10-05',
    day: 'Monday',
    startTime: '5:00 PM',
    endTime: '8:00 PM',
    status: 'available',
    notes: 'Clinic Session',
  });

  // Service editing / adding
  const [selectedService, setSelectedService] = useState<Partial<ClinicService> | null>(null);
  const [isServiceModalOpen, setIsServiceModalOpen] = useState(false);

  // Blood Test editing / adding
  const [selectedTest, setSelectedTest] = useState<Partial<BloodTest> | null>(null);
  const [isTestModalOpen, setIsTestModalOpen] = useState(false);

  useEffect(() => {
    setEditingClinic({ ...clinic });
  }, [clinic]);

  useEffect(() => {
    setEditingPhleb({ ...phlebotomist });
  }, [phlebotomist]);

  useEffect(() => {
    if (isAdminLoggedIn && activeTab === 'inquiries') {
      loadInquiries();
    }
  }, [isAdminLoggedIn, activeTab]);

  const loadInquiries = async () => {
    try {
      const records = await api.getAppointments();
      setInquiries(records);
    } catch {
      // ignore
    }
  };

  const showStatus = (text: string, type: 'success' | 'error' = 'success') => {
    setStatusMessage({ text, type });
    setTimeout(() => {
      setStatusMessage(null);
    }, 4000);
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoggingIn(true);
    setLoginError('');
    try {
      await api.login(loginEmail, loginPassword);
      onLoginSuccess();
      showStatus('Logged in successfully as Super Admin');
    } catch (err: any) {
      setLoginError(err.message || 'Invalid credentials');
    } finally {
      setIsLoggingIn(false);
    }
  };

  const handleLogout = () => {
    clearStoredToken();
    onLogout();
    showStatus('Logged out of Admin Portal');
  };

  // Save Clinic Info
  const handleSaveClinic = async () => {
    try {
      await api.updateClinic(editingClinic);
      onRefreshAllData();
      showStatus('Clinic information & timings updated successfully!');
    } catch {
      showStatus('Failed to update clinic information', 'error');
    }
  };

  // Save Phlebotomist Info
  const handleSavePhleb = async () => {
    try {
      await api.updatePhlebotomist(editingPhleb);
      onRefreshAllData();
      showStatus('Phlebotomist details updated successfully!');
    } catch {
      showStatus('Failed to update phlebotomist details', 'error');
    }
  };

  // Doctor CRUD
  const handleSaveDoctor = async () => {
    if (!selectedDoctor?.name) {
      showStatus('Doctor name is required', 'error');
      return;
    }
    try {
      if (selectedDoctor.id) {
        await api.updateDoctor(selectedDoctor.id, selectedDoctor);
        showStatus(`Doctor ${selectedDoctor.name} updated!`);
      } else {
        await api.addDoctor({
          name: selectedDoctor.name || 'New Doctor',
          photo: selectedDoctor.photo || '/src/assets/images/doctor_female_general_1790442833402.jpg',
          qualification: selectedDoctor.qualification || 'MBBS',
          specialization: selectedDoctor.specialization || 'General Physician',
          experience: selectedDoctor.experience || '5+ Years',
          description: selectedDoctor.description || 'Experienced medical practitioner.',
          availableDays: selectedDoctor.availableDays || ['Monday', 'Wednesday', 'Friday'],
          startTime: selectedDoctor.startTime || '5:00 PM',
          endTime: selectedDoctor.endTime || '8:00 PM',
          fee: selectedDoctor.fee || '₹600',
          status: selectedDoctor.status || 'active',
        });
        showStatus('New doctor added to clinic roster!');
      }
      setIsDoctorModalOpen(false);
      setSelectedDoctor(null);
      onRefreshAllData();
    } catch {
      showStatus('Failed saving doctor details', 'error');
    }
  };

  const handleDeleteDoctor = async (id: string, name: string) => {
    if (!window.confirm(`Are you sure you want to remove ${name} from active roster?`)) return;
    try {
      await api.deleteDoctor(id);
      onRefreshAllData();
      showStatus(`Doctor ${name} removed`);
    } catch {
      showStatus('Failed to remove doctor', 'error');
    }
  };

  // Availability Slot CRUD
  const handleAddSlot = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSlot.doctorId || !newSlot.date) {
      showStatus('Please select a doctor and date', 'error');
      return;
    }
    try {
      await api.addAvailability({
        doctorId: newSlot.doctorId,
        date: newSlot.date,
        day: newSlot.day || 'Monday',
        startTime: newSlot.startTime || '5:00 PM',
        endTime: newSlot.endTime || '8:00 PM',
        status: newSlot.status || 'available',
        notes: newSlot.notes || 'Clinic Session',
      });
      onRefreshAllData();
      showStatus('Availability slot added!');
    } catch {
      showStatus('Failed to add slot', 'error');
    }
  };

  const handleDeleteSlot = async (id: string) => {
    try {
      await api.deleteAvailability(id);
      onRefreshAllData();
      showStatus('Availability slot deleted');
    } catch {
      showStatus('Failed to delete slot', 'error');
    }
  };

  // Service CRUD
  const handleSaveService = async () => {
    if (!selectedService?.title) {
      showStatus('Service title is required', 'error');
      return;
    }
    try {
      if (selectedService.id) {
        await api.updateService(selectedService.id, selectedService);
        showStatus(`Service ${selectedService.title} updated!`);
      } else {
        await api.addService({
          title: selectedService.title || 'New Service',
          description: selectedService.description || '',
          icon: selectedService.icon || 'Stethoscope',
          category: selectedService.category || 'Clinical Care',
          status: selectedService.status || 'active',
        });
        showStatus('New service added!');
      }
      setIsServiceModalOpen(false);
      setSelectedService(null);
      onRefreshAllData();
    } catch {
      showStatus('Failed saving service', 'error');
    }
  };

  const handleDeleteService = async (id: string, title: string) => {
    if (!window.confirm(`Delete service "${title}"?`)) return;
    try {
      await api.deleteService(id);
      onRefreshAllData();
      showStatus(`Service "${title}" deleted`);
    } catch {
      showStatus('Failed to delete service', 'error');
    }
  };

  // Blood Test CRUD
  const handleSaveTest = async () => {
    if (!selectedTest?.name) {
      showStatus('Test name is required', 'error');
      return;
    }
    try {
      if (selectedTest.id) {
        await api.updateBloodTest(selectedTest.id, selectedTest);
        showStatus(`Test ${selectedTest.name} updated!`);
      } else {
        await api.addBloodTest({
          name: selectedTest.name || 'New Test',
          code: selectedTest.code || 'TEST-01',
          description: selectedTest.description || '',
          instructions: selectedTest.instructions || 'Standard sample collection.',
          fastingRequired: !!selectedTest.fastingRequired,
          fastingDuration: selectedTest.fastingDuration || '10–12 Hours',
          sampleType: selectedTest.sampleType || 'Serum',
          reportTime: selectedTest.reportTime || 'Same Day',
          price: selectedTest.price || '₹500',
          status: selectedTest.status || 'active',
        });
        showStatus('New blood test added to catalog!');
      }
      setIsTestModalOpen(false);
      setSelectedTest(null);
      onRefreshAllData();
    } catch {
      showStatus('Failed saving test', 'error');
    }
  };

  const handleDeleteTest = async (id: string, name: string) => {
    if (!window.confirm(`Delete blood test "${name}"?`)) return;
    try {
      await api.deleteBloodTest(id);
      onRefreshAllData();
      showStatus(`Test "${name}" deleted`);
    } catch {
      showStatus('Failed to delete test', 'error');
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-950/70 backdrop-blur-xs overflow-y-auto">
      <div className="relative w-full max-w-6xl bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden my-6 flex flex-col max-h-[92vh]">
        
        {/* Top Header */}
        <div className="bg-slate-900 text-white px-6 py-4 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-sky-500/20 border border-sky-400/30 flex items-center justify-center text-sky-400">
              <Shield className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-base font-extrabold tracking-tight flex items-center gap-2">
                <span>+PERFECT+ Clinic Administration</span>
                <span className="text-[10px] font-mono uppercase bg-sky-900 text-sky-300 px-2 py-0.5 rounded border border-sky-700">
                  {isAdminLoggedIn ? 'Super Admin' : 'Authentication Required'}
                </span>
              </h2>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {isAdminLoggedIn && (
              <button
                onClick={handleLogout}
                className="text-xs text-rose-300 hover:text-white flex items-center gap-1.5 py-1.5 px-3 rounded-lg bg-rose-950/60 border border-rose-800/60 cursor-pointer"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span>Logout</span>
              </button>
            )}
            <button
              onClick={onClose}
              className="p-1.5 rounded-full hover:bg-slate-800 text-slate-400 hover:text-white transition-colors cursor-pointer"
              aria-label="Close admin dashboard"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Global Toast Status */}
        {statusMessage && (
          <div
            className={`px-6 py-2.5 text-xs font-semibold flex items-center gap-2 ${
              statusMessage.type === 'error'
                ? 'bg-rose-500 text-white'
                : 'bg-emerald-600 text-white'
            }`}
          >
            {statusMessage.type === 'error' ? (
              <AlertCircle className="w-4 h-4" />
            ) : (
              <CheckCircle2 className="w-4 h-4" />
            )}
            <span>{statusMessage.text}</span>
          </div>
        )}

        {!isAdminLoggedIn ? (
          /* ================= LOGIN FORM ================= */
          <div className="p-8 sm:p-12 max-w-md mx-auto w-full my-auto">
            <div className="text-center mb-8">
              <div className="w-14 h-14 bg-sky-100 text-sky-600 rounded-2xl flex items-center justify-center mx-auto mb-3">
                <Lock className="w-7 h-7" />
              </div>
              <h3 className="text-2xl font-extrabold text-slate-900 tracking-tight">
                Clinic Owner Sign In
              </h3>
              <p className="text-xs text-slate-500 mt-1">
                Access doctor rosters, blood tests, WhatsApp settings & clinic hours
              </p>
            </div>

            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Admin Email
                </label>
                <input
                  type="email"
                  required
                  value={loginEmail}
                  onChange={(e) => setLoginEmail(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-sky-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Password
                </label>
                <input
                  type="password"
                  required
                  value={loginPassword}
                  onChange={(e) => setLoginPassword(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-sky-500"
                />
              </div>

              {loginError && (
                <div className="p-3 rounded-lg bg-rose-50 border border-rose-200 text-xs text-rose-700 font-medium">
                  {loginError}
                </div>
              )}

              <button
                type="submit"
                disabled={isLoggingIn}
                className="w-full py-3 px-4 rounded-xl bg-sky-600 hover:bg-sky-700 active:scale-98 text-white font-bold text-sm shadow-sm transition-all cursor-pointer"
              >
                {isLoggingIn ? 'Verifying...' : 'Sign In to Dashboard'}
              </button>

              {/* Demo Credentials Hint */}
              <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 text-[11px] text-slate-600 space-y-1">
                <p className="font-semibold text-slate-800">Pre-configured Demo Credentials:</p>
                <p>Email: <code className="font-mono text-sky-700 font-bold">admin@perfectclinic.com</code></p>
                <p>Password: <code className="font-mono text-sky-700 font-bold">admin123</code></p>
              </div>
            </form>
          </div>
        ) : (
          /* ================= MAIN DASHBOARD ================= */
          <div className="flex-1 flex flex-col md:flex-row overflow-hidden">
            
            {/* Sidebar Navigation */}
            <div className="w-full md:w-60 bg-slate-50 border-r border-slate-200 p-4 shrink-0 flex md:flex-col gap-1 overflow-x-auto md:overflow-y-auto">
              <button
                onClick={() => setActiveTab('stats')}
                className={`w-full text-left px-3 py-2.5 rounded-xl text-xs font-bold flex items-center gap-2.5 transition-colors cursor-pointer whitespace-nowrap ${
                  activeTab === 'stats'
                    ? 'bg-sky-600 text-white shadow-2xs'
                    : 'text-slate-600 hover:bg-slate-100'
                }`}
              >
                <Activity className="w-4 h-4" />
                <span>Overview & Stats</span>
              </button>

              <button
                onClick={() => setActiveTab('doctors')}
                className={`w-full text-left px-3 py-2.5 rounded-xl text-xs font-bold flex items-center gap-2.5 transition-colors cursor-pointer whitespace-nowrap ${
                  activeTab === 'doctors'
                    ? 'bg-sky-600 text-white shadow-2xs'
                    : 'text-slate-600 hover:bg-slate-100'
                }`}
              >
                <Users className="w-4 h-4" />
                <span>Doctor Roster ({doctors.length})</span>
              </button>

              <button
                onClick={() => setActiveTab('availability')}
                className={`w-full text-left px-3 py-2.5 rounded-xl text-xs font-bold flex items-center gap-2.5 transition-colors cursor-pointer whitespace-nowrap ${
                  activeTab === 'availability'
                    ? 'bg-sky-600 text-white shadow-2xs'
                    : 'text-slate-600 hover:bg-slate-100'
                }`}
              >
                <Calendar className="w-4 h-4" />
                <span>Date Availability ({availabilitySlots.length})</span>
              </button>

              <button
                onClick={() => setActiveTab('services')}
                className={`w-full text-left px-3 py-2.5 rounded-xl text-xs font-bold flex items-center gap-2.5 transition-colors cursor-pointer whitespace-nowrap ${
                  activeTab === 'services'
                    ? 'bg-sky-600 text-white shadow-2xs'
                    : 'text-slate-600 hover:bg-slate-100'
                }`}
              >
                <Activity className="w-4 h-4" />
                <span>Services ({services.length})</span>
              </button>

              <button
                onClick={() => setActiveTab('bloodTests')}
                className={`w-full text-left px-3 py-2.5 rounded-xl text-xs font-bold flex items-center gap-2.5 transition-colors cursor-pointer whitespace-nowrap ${
                  activeTab === 'bloodTests'
                    ? 'bg-sky-600 text-white shadow-2xs'
                    : 'text-slate-600 hover:bg-slate-100'
                }`}
              >
                <Droplets className="w-4 h-4" />
                <span>Blood Tests ({bloodTests.length})</span>
              </button>

              <button
                onClick={() => setActiveTab('phlebotomist')}
                className={`w-full text-left px-3 py-2.5 rounded-xl text-xs font-bold flex items-center gap-2.5 transition-colors cursor-pointer whitespace-nowrap ${
                  activeTab === 'phlebotomist'
                    ? 'bg-sky-600 text-white shadow-2xs'
                    : 'text-slate-600 hover:bg-slate-100'
                }`}
              >
                <Users className="w-4 h-4" />
                <span>Phlebotomist Profile</span>
              </button>

              <button
                onClick={() => setActiveTab('clinicInfo')}
                className={`w-full text-left px-3 py-2.5 rounded-xl text-xs font-bold flex items-center gap-2.5 transition-colors cursor-pointer whitespace-nowrap ${
                  activeTab === 'clinicInfo'
                    ? 'bg-sky-600 text-white shadow-2xs'
                    : 'text-slate-600 hover:bg-slate-100'
                }`}
              >
                <Clock className="w-4 h-4" />
                <span>Timings & Clinic Info</span>
              </button>

              <button
                onClick={() => setActiveTab('inquiries')}
                className={`w-full text-left px-3 py-2.5 rounded-xl text-xs font-bold flex items-center gap-2.5 transition-colors cursor-pointer whitespace-nowrap ${
                  activeTab === 'inquiries'
                    ? 'bg-sky-600 text-white shadow-2xs'
                    : 'text-slate-600 hover:bg-slate-100'
                }`}
              >
                <MessageSquare className="w-4 h-4" />
                <span>Patient Inquiries</span>
              </button>
            </div>

            {/* Tab Body */}
            <div className="flex-1 p-6 overflow-y-auto">
              
              {/* TAB 1: OVERVIEW & STATS */}
              {activeTab === 'stats' && (
                <div className="space-y-6">
                  <div>
                    <h3 className="text-xl font-extrabold text-slate-900 tracking-tight">
                      Clinic Performance & Directory Overview
                    </h3>
                    <p className="text-xs text-slate-500">
                      Live statistics of active practitioners, diagnostic panels, and schedule slots
                    </p>
                  </div>

                  <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                    <div className="p-5 rounded-2xl bg-sky-50 border border-sky-100">
                      <span className="text-xs font-bold uppercase text-sky-700 block">Total Doctors</span>
                      <span className="text-3xl font-extrabold text-slate-900">{doctors.length}</span>
                      <span className="text-[11px] text-slate-500 block mt-1">
                        {doctors.filter(d => d.status === 'active').length} Active on Website
                      </span>
                    </div>

                    <div className="p-5 rounded-2xl bg-teal-50 border border-teal-100">
                      <span className="text-xs font-bold uppercase text-teal-700 block">Blood Tests</span>
                      <span className="text-3xl font-extrabold text-slate-900">{bloodTests.length}</span>
                      <span className="text-[11px] text-slate-500 block mt-1">Pathology catalog</span>
                    </div>

                    <div className="p-5 rounded-2xl bg-emerald-50 border border-emerald-100">
                      <span className="text-xs font-bold uppercase text-emerald-700 block">Clinic Services</span>
                      <span className="text-3xl font-extrabold text-slate-900">{services.length}</span>
                      <span className="text-[11px] text-slate-500 block mt-1">Active categories</span>
                    </div>

                    <div className="p-5 rounded-2xl bg-amber-50 border border-amber-100">
                      <span className="text-xs font-bold uppercase text-amber-700 block">Available Slots</span>
                      <span className="text-3xl font-extrabold text-slate-900">{availabilitySlots.length}</span>
                      <span className="text-[11px] text-slate-500 block mt-1">Scheduled sessions</span>
                    </div>
                  </div>

                  {/* Clinic Timing status card */}
                  <div className="p-5 rounded-2xl bg-white border border-slate-200">
                    <h4 className="text-sm font-bold text-slate-900 mb-2">Public Timing Summary</h4>
                    <p className="text-xs text-slate-600">
                      Mon – Sat: <strong>{clinic.openingTime} – {clinic.closingTime}</strong> | Sunday: <strong>{clinic.sundayOpeningTime} – {clinic.sundayClosingTime}</strong>
                    </p>
                    <p className="text-xs text-slate-500 mt-1">
                      WhatsApp Booking Number: <strong>{clinic.whatsapp}</strong>
                    </p>
                  </div>
                </div>
              )}

              {/* TAB 2: DOCTOR MANAGEMENT */}
              {activeTab === 'doctors' && (
                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-xl font-extrabold text-slate-900 tracking-tight">
                        Doctor Directory Management
                      </h3>
                      <p className="text-xs text-slate-500">
                        Add, edit, deactivate, or update doctor qualifications and clinic timings
                      </p>
                    </div>

                    <button
                      onClick={() => {
                        setSelectedDoctor({
                          name: '',
                          photo: '/src/assets/images/doctor_female_general_1790442833402.jpg',
                          qualification: '',
                          specialization: '',
                          experience: '5+ Years',
                          description: '',
                          availableDays: ['Monday', 'Wednesday', 'Friday'],
                          startTime: '5:00 PM',
                          endTime: '8:00 PM',
                          fee: '₹600',
                          status: 'active',
                        });
                        setIsDoctorModalOpen(true);
                      }}
                      className="py-2 px-3.5 rounded-xl bg-sky-600 hover:bg-sky-700 text-white font-bold text-xs flex items-center gap-1.5 shadow-2xs cursor-pointer"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>Add New Doctor</span>
                    </button>
                  </div>

                  {/* Doctors List */}
                  <div className="space-y-3">
                    {doctors.map((doc) => (
                      <div
                        key={doc.id}
                        className="p-4 rounded-2xl bg-white border border-slate-200 hover:border-slate-300 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                      >
                        <div className="flex items-center gap-3.5">
                          <img
                            src={doc.photo}
                            alt={doc.name}
                            referrerPolicy="no-referrer"
                            className="w-14 h-14 rounded-xl object-cover object-top border border-slate-200 shrink-0"
                          />
                          <div>
                            <div className="flex items-center gap-2">
                              <h4 className="text-sm font-extrabold text-slate-900">
                                {doc.name}
                              </h4>
                              <span
                                className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                                  doc.status === 'active'
                                    ? 'bg-emerald-100 text-emerald-800'
                                    : 'bg-slate-200 text-slate-600'
                                }`}
                              >
                                {doc.status === 'active' ? 'Active' : 'Inactive'}
                              </span>
                            </div>
                            <p className="text-xs text-teal-700 font-semibold">
                              {doc.specialization} · {doc.qualification}
                            </p>
                            <p className="text-[11px] text-slate-500">
                              {doc.availableDays.join(', ')} ({doc.startTime} – {doc.endTime}) · Fee: {doc.fee}
                            </p>
                          </div>
                        </div>

                        <div className="flex items-center gap-2 self-end sm:self-auto">
                          <button
                            onClick={() => {
                              setSelectedDoctor({ ...doc });
                              setIsDoctorModalOpen(true);
                            }}
                            className="p-2 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold flex items-center gap-1 cursor-pointer"
                          >
                            <Edit2 className="w-3.5 h-3.5" />
                            <span>Edit</span>
                          </button>
                          <button
                            onClick={() => handleDeleteDoctor(doc.id, doc.name)}
                            className="p-2 rounded-lg bg-rose-50 hover:bg-rose-100 text-rose-700 text-xs font-semibold flex items-center gap-1 cursor-pointer"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                            <span>Delete</span>
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* TAB 3: AVAILABILITY SLOTS */}
              {activeTab === 'availability' && (
                <div className="space-y-6">
                  <div>
                    <h3 className="text-xl font-extrabold text-slate-900 tracking-tight">
                      Doctor Availability Calendar
                    </h3>
                    <p className="text-xs text-slate-500">
                      Configure specific consultation dates, times, and session availability
                    </p>
                  </div>

                  {/* Add Slot Form */}
                  <form onSubmit={handleAddSlot} className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
                    <span className="text-xs font-bold text-slate-800 uppercase tracking-wider block">
                      + Add New Consultation Date Slot
                    </span>
                    <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
                      <div>
                        <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                          Doctor
                        </label>
                        <select
                          value={newSlot.doctorId}
                          onChange={(e) => setNewSlot({ ...newSlot, doctorId: e.target.value })}
                          className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 bg-white"
                        >
                          {doctors.map((d) => (
                            <option key={d.id} value={d.id}>{d.name}</option>
                          ))}
                        </select>
                      </div>

                      <div>
                        <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                          Date (YYYY-MM-DD)
                        </label>
                        <input
                          type="date"
                          required
                          value={newSlot.date}
                          onChange={(e) => {
                            const val = e.target.value;
                            let dayName = 'Monday';
                            try {
                              const d = new Date(val);
                              dayName = d.toLocaleDateString('en-US', { weekday: 'long' });
                            } catch {
                              // ignore
                            }
                            setNewSlot({ ...newSlot, date: val, day: dayName });
                          }}
                          className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 bg-white"
                        />
                      </div>

                      <div>
                        <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                          Timing Window
                        </label>
                        <input
                          type="text"
                          placeholder="5:00 PM – 8:00 PM"
                          value={`${newSlot.startTime} – ${newSlot.endTime}`}
                          onChange={(e) => {
                            const parts = e.target.value.split('–');
                            if (parts.length === 2) {
                              setNewSlot({ ...newSlot, startTime: parts[0].trim(), endTime: parts[1].trim() });
                            }
                          }}
                          className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 bg-white"
                        />
                      </div>

                      <div className="flex items-end">
                        <button
                          type="submit"
                          className="w-full py-2 px-4 rounded-lg bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs shadow-2xs cursor-pointer"
                        >
                          Save Date Slot
                        </button>
                      </div>
                    </div>
                  </form>

                  {/* Availability Table */}
                  <div className="overflow-x-auto border border-slate-200 rounded-2xl bg-white">
                    <table className="w-full text-left text-xs text-slate-700">
                      <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-bold uppercase tracking-wider text-[10px]">
                        <tr>
                          <th className="p-3.5">Doctor</th>
                          <th className="p-3.5">Date</th>
                          <th className="p-3.5">Day</th>
                          <th className="p-3.5">Timing</th>
                          <th className="p-3.5">Status</th>
                          <th className="p-3.5 text-right">Action</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100">
                        {availabilitySlots.map((slot) => {
                          const doc = doctors.find((d) => d.id === slot.doctorId);
                          return (
                            <tr key={slot.id} className="hover:bg-slate-50/50">
                              <td className="p-3.5 font-bold text-slate-900">
                                {doc?.name || 'Assigned Physician'}
                              </td>
                              <td className="p-3.5 font-mono">{slot.date}</td>
                              <td className="p-3.5 font-medium">{slot.day}</td>
                              <td className="p-3.5">{slot.startTime} – {slot.endTime}</td>
                              <td className="p-3.5">
                                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800">
                                  {slot.status}
                                </span>
                              </td>
                              <td className="p-3.5 text-right">
                                <button
                                  onClick={() => handleDeleteSlot(slot.id)}
                                  className="text-rose-600 hover:text-rose-800 font-semibold p-1 cursor-pointer"
                                >
                                  Delete
                                </button>
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {/* TAB 4: CLINIC SERVICES */}
              {activeTab === 'services' && (
                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-xl font-extrabold text-slate-900 tracking-tight">
                        Services Management
                      </h3>
                      <p className="text-xs text-slate-500">
                        Edit clinic offerings, consultation categories, and service cards
                      </p>
                    </div>

                    <button
                      onClick={() => {
                        setSelectedService({
                          title: '',
                          description: '',
                          icon: 'Stethoscope',
                          category: 'Clinical Care',
                          status: 'active',
                        });
                        setIsServiceModalOpen(true);
                      }}
                      className="py-2 px-3.5 rounded-xl bg-sky-600 hover:bg-sky-700 text-white font-bold text-xs flex items-center gap-1.5 cursor-pointer"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>Add Service</span>
                    </button>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {services.map((serv) => (
                      <div
                        key={serv.id}
                        className="p-4 rounded-2xl bg-white border border-slate-200 flex flex-col justify-between"
                      >
                        <div>
                          <div className="flex items-center justify-between mb-2">
                            <span className="text-[11px] font-bold uppercase text-sky-700 bg-sky-50 px-2 py-0.5 rounded">
                              {serv.category}
                            </span>
                            <span className="text-[10px] font-mono text-slate-400">
                              Icon: {serv.icon}
                            </span>
                          </div>
                          <h4 className="text-base font-bold text-slate-900">{serv.title}</h4>
                          <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                            {serv.description}
                          </p>
                        </div>

                        <div className="pt-3 mt-3 border-t border-slate-100 flex items-center justify-end gap-2">
                          <button
                            onClick={() => {
                              setSelectedService({ ...serv });
                              setIsServiceModalOpen(true);
                            }}
                            className="p-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold flex items-center gap-1 cursor-pointer"
                          >
                            <Edit2 className="w-3 h-3" />
                            <span>Edit</span>
                          </button>
                          <button
                            onClick={() => handleDeleteService(serv.id, serv.title)}
                            className="p-1.5 rounded-lg bg-rose-50 hover:bg-rose-100 text-rose-700 text-xs font-semibold flex items-center gap-1 cursor-pointer"
                          >
                            <Trash2 className="w-3 h-3" />
                            <span>Delete</span>
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* TAB 5: BLOOD TESTS MANAGEMENT */}
              {activeTab === 'bloodTests' && (
                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-xl font-extrabold text-slate-900 tracking-tight">
                        Pathology & Blood Tests Catalog
                      </h3>
                      <p className="text-xs text-slate-500">
                        Manage test preparation rules, fasting guidelines, prices, and reporting turnaround
                      </p>
                    </div>

                    <button
                      onClick={() => {
                        setSelectedTest({
                          name: '',
                          code: `TEST-0${bloodTests.length + 1}`,
                          description: '',
                          instructions: 'Drink water normally. Fasting not strictly required.',
                          fastingRequired: false,
                          fastingDuration: '',
                          sampleType: 'Serum',
                          reportTime: 'Same Day',
                          price: '₹500',
                          status: 'active',
                        });
                        setIsTestModalOpen(true);
                      }}
                      className="py-2 px-3.5 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs flex items-center gap-1.5 cursor-pointer"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>Add Blood Test</span>
                    </button>
                  </div>

                  <div className="space-y-3">
                    {bloodTests.map((t) => (
                      <div
                        key={t.id}
                        className="p-4 rounded-2xl bg-white border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                      >
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="text-[10px] font-mono font-bold uppercase text-slate-500 bg-slate-100 px-2 py-0.5 rounded">
                              {t.code}
                            </span>
                            <h4 className="text-sm font-extrabold text-slate-900">
                              {t.name}
                            </h4>
                            {t.fastingRequired && (
                              <span className="text-[10px] font-bold text-amber-800 bg-amber-100 px-2 py-0.5 rounded-full">
                                Fasting Required
                              </span>
                            )}
                          </div>
                          <p className="text-xs text-slate-600 mt-1">{t.description}</p>
                          <p className="text-[11px] text-teal-700 font-semibold mt-0.5">
                            Sample: {t.sampleType} · Report: {t.reportTime} · Price: {t.price}
                          </p>
                        </div>

                        <div className="flex items-center gap-2 self-end sm:self-auto">
                          <button
                            onClick={() => {
                              setSelectedTest({ ...t });
                              setIsTestModalOpen(true);
                            }}
                            className="p-2 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold flex items-center gap-1 cursor-pointer"
                          >
                            <Edit2 className="w-3.5 h-3.5" />
                            <span>Edit</span>
                          </button>
                          <button
                            onClick={() => handleDeleteTest(t.id, t.name)}
                            className="p-2 rounded-lg bg-rose-50 hover:bg-rose-100 text-rose-700 text-xs font-semibold flex items-center gap-1 cursor-pointer"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                            <span>Delete</span>
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* TAB 6: PHLEBOTOMIST PROFILE */}
              {activeTab === 'phlebotomist' && (
                <div className="space-y-6 max-w-2xl">
                  <div>
                    <h3 className="text-xl font-extrabold text-slate-900 tracking-tight">
                      Phlebotomist Profile & WhatsApp Setup
                    </h3>
                    <p className="text-xs text-slate-500">
                      Update the staff bio, qualifications, and direct appointment contact
                    </p>
                  </div>

                  <div className="space-y-4 bg-white p-6 rounded-2xl border border-slate-200">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">
                        Phlebotomist Name
                      </label>
                      <input
                        type="text"
                        value={editingPhleb.name}
                        onChange={(e) => setEditingPhleb({ ...editingPhleb, name: e.target.value })}
                        className="w-full px-3 py-2 text-sm rounded-lg border border-slate-300"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">
                        Qualification & Certifications
                      </label>
                      <input
                        type="text"
                        value={editingPhleb.qualification}
                        onChange={(e) => setEditingPhleb({ ...editingPhleb, qualification: e.target.value })}
                        className="w-full px-3 py-2 text-sm rounded-lg border border-slate-300"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">
                        Years of Experience
                      </label>
                      <input
                        type="text"
                        value={editingPhleb.experience}
                        onChange={(e) => setEditingPhleb({ ...editingPhleb, experience: e.target.value })}
                        className="w-full px-3 py-2 text-sm rounded-lg border border-slate-300"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">
                        Patient-Facing Bio / Description
                      </label>
                      <textarea
                        rows={3}
                        value={editingPhleb.description}
                        onChange={(e) => setEditingPhleb({ ...editingPhleb, description: e.target.value })}
                        className="w-full px-3 py-2 text-sm rounded-lg border border-slate-300"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">
                        Sample Collection Hours
                      </label>
                      <input
                        type="text"
                        value={editingPhleb.availableHours}
                        onChange={(e) => setEditingPhleb({ ...editingPhleb, availableHours: e.target.value })}
                        className="w-full px-3 py-2 text-sm rounded-lg border border-slate-300"
                      />
                    </div>

                    <button
                      onClick={handleSavePhleb}
                      className="py-2.5 px-5 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs flex items-center gap-1.5 shadow-2xs cursor-pointer"
                    >
                      <Save className="w-3.5 h-3.5" />
                      <span>Save Phlebotomist Profile</span>
                    </button>
                  </div>
                </div>
              )}

              {/* TAB 7: TIMINGS & CLINIC INFO */}
              {activeTab === 'clinicInfo' && (
                <div className="space-y-6 max-w-3xl">
                  <div>
                    <h3 className="text-xl font-extrabold text-slate-900 tracking-tight">
                      Clinic Details, Hours & Social Links
                    </h3>
                    <p className="text-xs text-slate-500">
                      Changes here directly reflect in the header, timing card, footer, and WhatsApp URLs
                    </p>
                  </div>

                  <div className="bg-white p-6 rounded-2xl border border-slate-200 space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1">
                          Clinic Name
                        </label>
                        <input
                          type="text"
                          value={editingClinic.clinicName}
                          onChange={(e) => setEditingClinic({ ...editingClinic, clinicName: e.target.value })}
                          className="w-full px-3 py-2 text-sm rounded-lg border border-slate-300"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1">
                          WhatsApp Booking Number (With Country Code)
                        </label>
                        <input
                          type="text"
                          value={editingClinic.whatsapp}
                          onChange={(e) => setEditingClinic({ ...editingClinic, whatsapp: e.target.value })}
                          className="w-full px-3 py-2 text-sm rounded-lg border border-slate-300"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1">
                          Phone Number (Public Reception)
                        </label>
                        <input
                          type="text"
                          value={editingClinic.phone}
                          onChange={(e) => setEditingClinic({ ...editingClinic, phone: e.target.value })}
                          className="w-full px-3 py-2 text-sm rounded-lg border border-slate-300"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1">
                          Email Address
                        </label>
                        <input
                          type="email"
                          value={editingClinic.email}
                          onChange={(e) => setEditingClinic({ ...editingClinic, email: e.target.value })}
                          className="w-full px-3 py-2 text-sm rounded-lg border border-slate-300"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">
                        Physical Clinic Address
                      </label>
                      <input
                        type="text"
                        value={editingClinic.address}
                        onChange={(e) => setEditingClinic({ ...editingClinic, address: e.target.value })}
                        className="w-full px-3 py-2 text-sm rounded-lg border border-slate-300"
                      />
                    </div>

                    {/* Timings */}
                    <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-3">
                      <span className="text-xs font-bold text-slate-800 uppercase tracking-wider block">
                        Clinic Working Hours
                      </span>
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                        <div>
                          <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                            Mon–Sat Open
                          </label>
                          <input
                            type="text"
                            value={editingClinic.openingTime}
                            onChange={(e) => setEditingClinic({ ...editingClinic, openingTime: e.target.value })}
                            className="w-full px-2.5 py-1.5 text-xs rounded-lg border border-slate-300 bg-white"
                          />
                        </div>

                        <div>
                          <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                            Mon–Sat Close
                          </label>
                          <input
                            type="text"
                            value={editingClinic.closingTime}
                            onChange={(e) => setEditingClinic({ ...editingClinic, closingTime: e.target.value })}
                            className="w-full px-2.5 py-1.5 text-xs rounded-lg border border-slate-300 bg-white"
                          />
                        </div>

                        <div>
                          <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                            Sunday Open
                          </label>
                          <input
                            type="text"
                            value={editingClinic.sundayOpeningTime}
                            onChange={(e) => setEditingClinic({ ...editingClinic, sundayOpeningTime: e.target.value })}
                            className="w-full px-2.5 py-1.5 text-xs rounded-lg border border-slate-300 bg-white"
                          />
                        </div>

                        <div>
                          <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                            Sunday Close
                          </label>
                          <input
                            type="text"
                            value={editingClinic.sundayClosingTime}
                            onChange={(e) => setEditingClinic({ ...editingClinic, sundayClosingTime: e.target.value })}
                            className="w-full px-2.5 py-1.5 text-xs rounded-lg border border-slate-300 bg-white"
                          />
                        </div>
                      </div>

                      <div className="pt-2">
                        <label className="flex items-center gap-2 cursor-pointer">
                          <input
                            type="checkbox"
                            checked={editingClinic.isClosedHoliday}
                            onChange={(e) => setEditingClinic({ ...editingClinic, isClosedHoliday: e.target.checked })}
                            className="w-4 h-4 rounded text-sky-600"
                          />
                          <span className="text-xs font-semibold text-slate-800">
                            Mark Clinic Closed for Holiday / Emergency
                          </span>
                        </label>
                      </div>

                      <div>
                        <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                          Holiday Notice / Banner Text
                        </label>
                        <input
                          type="text"
                          value={editingClinic.holidayNotice}
                          onChange={(e) => setEditingClinic({ ...editingClinic, holidayNotice: e.target.value })}
                          className="w-full px-3 py-1.5 text-xs rounded-lg border border-slate-300 bg-white"
                        />
                      </div>
                    </div>

                    {/* Social Media & Developer Credit (Section 20 & 22) */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                      <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1">
                          Instagram URL
                        </label>
                        <input
                          type="text"
                          value={editingClinic.instagramUrl}
                          onChange={(e) => setEditingClinic({ ...editingClinic, instagramUrl: e.target.value })}
                          className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1">
                          Facebook URL
                        </label>
                        <input
                          type="text"
                          value={editingClinic.facebookUrl}
                          onChange={(e) => setEditingClinic({ ...editingClinic, facebookUrl: e.target.value })}
                          className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300"
                        />
                      </div>
                    </div>

                    {/* Developer Credit fields (Prompt Section 22) */}
                    <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-3">
                      <span className="text-xs font-bold text-slate-800 uppercase tracking-wider block">
                        Developer Credit Configuration (Section 22)
                      </span>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div>
                          <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                            Developer Name
                          </label>
                          <input
                            type="text"
                            value={editingClinic.developerName}
                            onChange={(e) => setEditingClinic({ ...editingClinic, developerName: e.target.value })}
                            className="w-full px-3 py-1.5 text-xs rounded-lg border border-slate-300 bg-white"
                          />
                        </div>

                        <div>
                          <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                            Developer Instagram Handle
                          </label>
                          <input
                            type="text"
                            value={editingClinic.developerInstagram}
                            onChange={(e) => setEditingClinic({ ...editingClinic, developerInstagram: e.target.value })}
                            className="w-full px-3 py-1.5 text-xs rounded-lg border border-slate-300 bg-white"
                          />
                        </div>
                      </div>
                    </div>

                    <button
                      onClick={handleSaveClinic}
                      className="py-3 px-6 rounded-xl bg-sky-600 hover:bg-sky-700 text-white font-bold text-xs flex items-center gap-2 shadow-sm cursor-pointer"
                    >
                      <Save className="w-4 h-4" />
                      <span>Save All Clinic Settings</span>
                    </button>
                  </div>
                </div>
              )}

              {/* TAB 8: PATIENT INQUIRIES */}
              {activeTab === 'inquiries' && (
                <div className="space-y-6">
                  <div>
                    <h3 className="text-xl font-extrabold text-slate-900 tracking-tight">
                      Recent Patient Bookings & WhatsApp Inquiries
                    </h3>
                    <p className="text-xs text-slate-500">
                      Logged appointment click records for clinic receptionist auditing
                    </p>
                  </div>

                  <div className="overflow-x-auto border border-slate-200 rounded-2xl bg-white">
                    <table className="w-full text-left text-xs text-slate-700">
                      <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-bold uppercase tracking-wider text-[10px]">
                        <tr>
                          <th className="p-3.5">Type</th>
                          <th className="p-3.5">Patient Name</th>
                          <th className="p-3.5">Phone Number</th>
                          <th className="p-3.5">Doctor / Test</th>
                          <th className="p-3.5">Date & Time</th>
                          <th className="p-3.5">Time Logged</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100">
                        {inquiries.map((inq) => (
                          <tr key={inq.id} className="hover:bg-slate-50/50">
                            <td className="p-3.5">
                              <span
                                className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                                  inq.type === 'doctor'
                                    ? 'bg-sky-100 text-sky-800'
                                    : 'bg-teal-100 text-teal-800'
                                }`}
                              >
                                {inq.type === 'doctor' ? 'Doctor' : 'Blood Test'}
                              </span>
                            </td>
                            <td className="p-3.5 font-bold text-slate-900">
                              {inq.patientName} {inq.patientAge ? `(${inq.patientAge}y)` : ''}
                            </td>
                            <td className="p-3.5 font-mono text-slate-600">
                              <a href={`tel:${inq.phone}`} className="hover:text-sky-600">
                                {inq.phone}
                              </a>
                            </td>
                            <td className="p-3.5 font-semibold text-slate-800">
                              {inq.doctorName || inq.testName}
                            </td>
                            <td className="p-3.5">
                              {inq.date} @ {inq.time}
                            </td>
                            <td className="p-3.5 text-slate-400 text-[11px]">
                              {new Date(inq.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>

                  {inquiries.length === 0 && (
                    <div className="p-8 text-center bg-slate-50 rounded-xl text-xs text-slate-500">
                      No patient inquiries logged yet.
                    </div>
                  )}
                </div>
              )}

            </div>

          </div>
        )}

      </div>

      {/* Doctor Edit Modal */}
      {isDoctorModalOpen && selectedDoctor && (
        <div className="fixed inset-0 z-60 flex items-center justify-center p-4 bg-slate-950/70">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto">
            <h3 className="text-lg font-bold text-slate-900">
              {selectedDoctor.id ? 'Edit Doctor Details' : 'Add New Doctor'}
            </h3>

            <div className="space-y-3 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Doctor Name *</label>
                <input
                  type="text"
                  value={selectedDoctor.name || ''}
                  onChange={(e) => setSelectedDoctor({ ...selectedDoctor, name: e.target.value })}
                  className="w-full px-3 py-2 border rounded-lg"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Specialization *</label>
                <input
                  type="text"
                  placeholder="e.g. General Physician & Internal Medicine"
                  value={selectedDoctor.specialization || ''}
                  onChange={(e) => setSelectedDoctor({ ...selectedDoctor, specialization: e.target.value })}
                  className="w-full px-3 py-2 border rounded-lg"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Qualification *</label>
                <input
                  type="text"
                  placeholder="e.g. MBBS, MD (Medicine)"
                  value={selectedDoctor.qualification || ''}
                  onChange={(e) => setSelectedDoctor({ ...selectedDoctor, qualification: e.target.value })}
                  className="w-full px-3 py-2 border rounded-lg"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Experience</label>
                  <input
                    type="text"
                    value={selectedDoctor.experience || ''}
                    onChange={(e) => setSelectedDoctor({ ...selectedDoctor, experience: e.target.value })}
                    className="w-full px-3 py-2 border rounded-lg"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Consultation Fee</label>
                  <input
                    type="text"
                    value={selectedDoctor.fee || ''}
                    onChange={(e) => setSelectedDoctor({ ...selectedDoctor, fee: e.target.value })}
                    className="w-full px-3 py-2 border rounded-lg"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Start Time</label>
                  <input
                    type="text"
                    value={selectedDoctor.startTime || ''}
                    onChange={(e) => setSelectedDoctor({ ...selectedDoctor, startTime: e.target.value })}
                    className="w-full px-3 py-2 border rounded-lg"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">End Time</label>
                  <input
                    type="text"
                    value={selectedDoctor.endTime || ''}
                    onChange={(e) => setSelectedDoctor({ ...selectedDoctor, endTime: e.target.value })}
                    className="w-full px-3 py-2 border rounded-lg"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Available Days (comma separated)</label>
                <input
                  type="text"
                  value={selectedDoctor.availableDays?.join(', ') || ''}
                  onChange={(e) =>
                    setSelectedDoctor({
                      ...selectedDoctor,
                      availableDays: e.target.value.split(',').map((s) => s.trim()),
                    })
                  }
                  className="w-full px-3 py-2 border rounded-lg"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Short Description</label>
                <textarea
                  rows={2}
                  value={selectedDoctor.description || ''}
                  onChange={(e) => setSelectedDoctor({ ...selectedDoctor, description: e.target.value })}
                  className="w-full px-3 py-2 border rounded-lg"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Doctor Status</label>
                <select
                  value={selectedDoctor.status || 'active'}
                  onChange={(e) => setSelectedDoctor({ ...selectedDoctor, status: e.target.value as any })}
                  className="w-full px-3 py-2 border rounded-lg bg-white"
                >
                  <option value="active">Active (Visible on Website)</option>
                  <option value="inactive">Inactive (Deactivated)</option>
                </select>
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button
                onClick={() => setIsDoctorModalOpen(false)}
                className="px-4 py-2 rounded-lg bg-slate-100 text-slate-700 font-bold text-xs cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveDoctor}
                className="px-4 py-2 rounded-lg bg-sky-600 text-white font-bold text-xs cursor-pointer"
              >
                Save Doctor
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Service Edit Modal */}
      {isServiceModalOpen && selectedService && (
        <div className="fixed inset-0 z-60 flex items-center justify-center p-4 bg-slate-950/70">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl space-y-4">
            <h3 className="text-lg font-bold text-slate-900">
              {selectedService.id ? 'Edit Service' : 'Add New Service'}
            </h3>

            <div className="space-y-3 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Service Title *</label>
                <input
                  type="text"
                  value={selectedService.title || ''}
                  onChange={(e) => setSelectedService({ ...selectedService, title: e.target.value })}
                  className="w-full px-3 py-2 border rounded-lg"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Category</label>
                <input
                  type="text"
                  value={selectedService.category || ''}
                  onChange={(e) => setSelectedService({ ...selectedService, category: e.target.value })}
                  className="w-full px-3 py-2 border rounded-lg"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Icon</label>
                <select
                  value={selectedService.icon || 'Stethoscope'}
                  onChange={(e) => setSelectedService({ ...selectedService, icon: e.target.value })}
                  className="w-full px-3 py-2 border rounded-lg bg-white"
                >
                  <option value="Stethoscope">Stethoscope (Doctor / Outpatient)</option>
                  <option value="Activity">Activity (Diagnostics / ECG)</option>
                  <option value="Droplets">Droplets (Blood / Pathology)</option>
                  <option value="ShieldCheck">ShieldCheck (Preventive)</option>
                  <option value="UserCheck">UserCheck (Specialist)</option>
                  <option value="HeartPulse">HeartPulse (Nursing / Vitals)</option>
                </select>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Description</label>
                <textarea
                  rows={3}
                  value={selectedService.description || ''}
                  onChange={(e) => setSelectedService({ ...selectedService, description: e.target.value })}
                  className="w-full px-3 py-2 border rounded-lg"
                />
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button
                onClick={() => setIsServiceModalOpen(false)}
                className="px-4 py-2 rounded-lg bg-slate-100 text-slate-700 font-bold text-xs cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveService}
                className="px-4 py-2 rounded-lg bg-sky-600 text-white font-bold text-xs cursor-pointer"
              >
                Save Service
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Blood Test Edit Modal */}
      {isTestModalOpen && selectedTest && (
        <div className="fixed inset-0 z-60 flex items-center justify-center p-4 bg-slate-950/70">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto">
            <h3 className="text-lg font-bold text-slate-900">
              {selectedTest.id ? 'Edit Blood Test' : 'Add New Blood Test'}
            </h3>

            <div className="space-y-3 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Test Name *</label>
                <input
                  type="text"
                  value={selectedTest.name || ''}
                  onChange={(e) => setSelectedTest({ ...selectedTest, name: e.target.value })}
                  className="w-full px-3 py-2 border rounded-lg"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Test Code</label>
                  <input
                    type="text"
                    value={selectedTest.code || ''}
                    onChange={(e) => setSelectedTest({ ...selectedTest, code: e.target.value })}
                    className="w-full px-3 py-2 border rounded-lg"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Test Price</label>
                  <input
                    type="text"
                    value={selectedTest.price || ''}
                    onChange={(e) => setSelectedTest({ ...selectedTest, price: e.target.value })}
                    className="w-full px-3 py-2 border rounded-lg"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Description</label>
                <textarea
                  rows={2}
                  value={selectedTest.description || ''}
                  onChange={(e) => setSelectedTest({ ...selectedTest, description: e.target.value })}
                  className="w-full px-3 py-2 border rounded-lg"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Sample Type</label>
                  <input
                    type="text"
                    value={selectedTest.sampleType || ''}
                    onChange={(e) => setSelectedTest({ ...selectedTest, sampleType: e.target.value })}
                    className="w-full px-3 py-2 border rounded-lg"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Report Turnaround</label>
                  <input
                    type="text"
                    value={selectedTest.reportTime || ''}
                    onChange={(e) => setSelectedTest({ ...selectedTest, reportTime: e.target.value })}
                    className="w-full px-3 py-2 border rounded-lg"
                  />
                </div>
              </div>

              <div>
                <label className="flex items-center gap-2 cursor-pointer mb-2">
                  <input
                    type="checkbox"
                    checked={!!selectedTest.fastingRequired}
                    onChange={(e) => setSelectedTest({ ...selectedTest, fastingRequired: e.target.checked })}
                    className="w-4 h-4 rounded text-teal-600"
                  />
                  <span className="font-semibold text-slate-800">Fasting Mandatory for this test</span>
                </label>

                {selectedTest.fastingRequired && (
                  <input
                    type="text"
                    placeholder="e.g. 10–12 Hours strict fasting"
                    value={selectedTest.fastingDuration || ''}
                    onChange={(e) => setSelectedTest({ ...selectedTest, fastingDuration: e.target.value })}
                    className="w-full px-3 py-2 border rounded-lg"
                  />
                )}
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Patient Preparation Instructions</label>
                <textarea
                  rows={2}
                  value={selectedTest.instructions || ''}
                  onChange={(e) => setSelectedTest({ ...selectedTest, instructions: e.target.value })}
                  className="w-full px-3 py-2 border rounded-lg"
                />
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button
                onClick={() => setIsTestModalOpen(false)}
                className="px-4 py-2 rounded-lg bg-slate-100 text-slate-700 font-bold text-xs cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveTest}
                className="px-4 py-2 rounded-lg bg-teal-600 text-white font-bold text-xs cursor-pointer"
              >
                Save Test
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
