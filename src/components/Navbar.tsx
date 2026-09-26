import React, { useState } from 'react';
import { Menu, X, Shield, PhoneCall, Calendar } from 'lucide-react';
import { ClinicInfo } from '../types/clinic';

interface NavbarProps {
  clinic: ClinicInfo;
  activeSection: string;
  onNavigate: (sectionId: string) => void;
  onOpenAdmin: () => void;
  isAdminLoggedIn: boolean;
}

export const Navbar: React.FC<NavbarProps> = ({
  clinic,
  activeSection,
  onNavigate,
  onOpenAdmin,
  isAdminLoggedIn,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navLinks = [
    { id: 'home', label: 'Home' },
    { id: 'services', label: 'Services' },
    { id: 'doctors', label: 'Doctors' },
    { id: 'blood-test', label: 'Blood Test' },
    { id: 'appointment', label: 'Appointment' },
  ];

  const handleLinkClick = (id: string) => {
    setMobileMenuOpen(false);
    onNavigate(id);
  };

  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-sky-100 shadow-xs transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-18">
          {/* Zone 1: Single text element wordmark */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => handleLinkClick('home')}
              className="group text-left cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-sky-500 rounded-lg p-1"
            >
              <span className="text-2xl font-extrabold tracking-tight text-sky-700 flex items-center gap-1">
                <span className="text-sky-500 font-black">+</span>
                <span className="bg-gradient-to-r from-sky-700 via-sky-800 to-teal-700 bg-clip-text text-transparent">
                  {clinic.logoText || '+PERFECT+'}
                </span>
                <span className="text-teal-600 font-black">+</span>
              </span>
            </button>
          </div>

          {/* Zone 2: 4-6 clean text navigation links */}
          <nav className="hidden md:flex items-center gap-8 text-sm font-semibold">
            {navLinks.map((link) => {
              const isActive = activeSection === link.id;
              return (
                <button
                  key={link.id}
                  onClick={() => handleLinkClick(link.id)}
                  className={`relative py-1.5 transition-colors whitespace-nowrap cursor-pointer ${
                    isActive
                      ? 'text-sky-700 font-bold'
                      : 'text-slate-600 hover:text-sky-700'
                  }`}
                >
                  {link.label}
                  {isActive && (
                    <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-sky-600 rounded-full" />
                  )}
                </button>
              );
            })}
          </nav>

          {/* Zone 3: 1-2 primary actions */}
          <div className="hidden sm:flex items-center gap-3">
            <button
              onClick={onOpenAdmin}
              className={`flex items-center gap-1.5 px-3 py-2 text-xs font-semibold rounded-lg border transition-all cursor-pointer whitespace-nowrap ${
                isAdminLoggedIn
                  ? 'bg-amber-50 text-amber-800 border-amber-300 hover:bg-amber-100'
                  : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
              }`}
              title="Admin Control Panel"
            >
              <Shield className="w-3.5 h-3.5 text-sky-600" />
              <span>{isAdminLoggedIn ? 'Admin Panel' : 'Admin Login'}</span>
            </button>

            <button
              onClick={() => handleLinkClick('appointment')}
              className="flex items-center gap-2 px-4 py-2 text-xs font-bold text-white bg-sky-600 hover:bg-sky-700 active:scale-98 rounded-lg shadow-sm hover:shadow transition-all cursor-pointer whitespace-nowrap"
            >
              <Calendar className="w-3.5 h-3.5" />
              <span>Book Appointment</span>
            </button>
          </div>

          {/* Mobile hamburger button */}
          <div className="flex md:hidden items-center gap-2">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 text-slate-700 hover:text-sky-600 focus:outline-none focus:ring-2 focus:ring-sky-500 rounded-lg"
              aria-label="Toggle navigation menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-sky-100 bg-white px-4 pt-3 pb-6 shadow-xl animate-in slide-in-from-top duration-150">
          <div className="flex flex-col gap-2">
            {navLinks.map((link) => {
              const isActive = activeSection === link.id;
              return (
                <button
                  key={link.id}
                  onClick={() => handleLinkClick(link.id)}
                  className={`text-left px-3 py-2.5 rounded-lg text-sm font-semibold transition-colors cursor-pointer ${
                    isActive
                      ? 'bg-sky-50 text-sky-700 font-bold'
                      : 'text-slate-700 hover:bg-slate-50'
                  }`}
                >
                  {link.label}
                </button>
              );
            })}
            <div className="pt-3 border-t border-slate-100 flex flex-col gap-2">
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  handleLinkClick('appointment');
                }}
                className="w-full py-2.5 px-4 rounded-lg bg-sky-600 text-white font-bold text-sm text-center shadow-xs flex items-center justify-center gap-2"
              >
                <Calendar className="w-4 h-4" />
                <span>Book Appointment</span>
              </button>

              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  onOpenAdmin();
                }}
                className="w-full py-2 px-4 rounded-lg bg-slate-100 text-slate-700 font-semibold text-xs text-center flex items-center justify-center gap-1.5"
              >
                <Shield className="w-3.5 h-3.5 text-sky-600" />
                <span>{isAdminLoggedIn ? 'Open Admin Panel' : 'Clinic Admin Portal'}</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};
