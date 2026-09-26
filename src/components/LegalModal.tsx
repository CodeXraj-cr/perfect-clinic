import React from 'react';
import { X, ShieldAlert, FileText, CheckCircle2 } from 'lucide-react';

interface LegalModalProps {
  isOpen: boolean;
  onClose: () => void;
  type: 'disclaimer' | 'privacy' | 'terms' | null;
  clinicName: string;
}

export const LegalModal: React.FC<LegalModalProps> = ({
  isOpen,
  onClose,
  type,
  clinicName,
}) => {
  if (!isOpen || !type) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs overflow-y-auto">
      <div className="relative w-full max-w-xl bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden my-8 animate-in fade-in zoom-in-95 duration-150">
        
        {/* Header */}
        <div className="bg-slate-900 text-white px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <FileText className="w-5 h-5 text-sky-400" />
            <h3 className="text-base font-extrabold tracking-tight">
              {type === 'disclaimer' && 'Medical Disclaimer'}
              {type === 'privacy' && 'Patient Privacy Policy'}
              {type === 'terms' && 'Terms & Conditions of Service'}
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-full hover:bg-slate-800 text-slate-400 hover:text-white"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 text-xs text-slate-600 space-y-4 max-h-[70vh] overflow-y-auto leading-relaxed">
          {type === 'disclaimer' && (
            <>
              <div className="p-3.5 rounded-xl bg-amber-50 border border-amber-200 text-amber-900 font-semibold">
                This website provides general medical informational content and appointment coordination for {clinicName}. It does not constitute medical emergency dispatch or substitute formal in-person clinical diagnosis.
              </div>
              <p>
                1. <strong>Demo & Educational Material:</strong> Fasting rules, blood test parameters, and clinical information published on this website are general educational guidelines. Always adhere strictly to the specific medical instructions provided by your attending doctor or pathologist.
              </p>
              <p>
                2. <strong>Medical Emergencies:</strong> If you or someone under your care is experiencing an acute, life-threatening medical emergency (such as severe chest pain, sudden numbness, unconsciousness, or acute breathing difficulty), please contact the nearest hospital emergency department or emergency ambulance services immediately.
              </p>
              <p>
                3. <strong>Prescriptions & Diagnostics:</strong> Diagnostic blood test reports are confidential medical documents released directly to the patient or authorized healthcare representative.
              </p>
            </>
          )}

          {type === 'privacy' && (
            <>
              <p>
                At {clinicName}, patient confidentiality is a paramount cornerstone of clinical ethics.
              </p>
              <p>
                1. <strong>Information Collected:</strong> When initiating an appointment via WhatsApp or requesting pathology services, we record your name, age, phone number, and selected consultation service exclusively to facilitate clinic scheduling.
              </p>
              <p>
                2. <strong>No Unsolicited Marketing:</strong> We never sell, lease, or distribute your patient records, test results, or personal details to third-party commercial marketing entities.
              </p>
              <p>
                3. <strong>Data Retention & Rights:</strong> Patient health records and diagnostic laboratory reports are maintained in accordance with standard clinical regulatory compliance.
              </p>
            </>
          )}

          {type === 'terms' && (
            <>
              <p>
                1. <strong>Appointments & WhatsApp Scheduling:</strong> Appointments scheduled via the +PERFECT+ WhatsApp booking assistant are subject to clinic operating hours and specialist doctor availability.
              </p>
              <p>
                2. <strong>Clinic Hours:</strong> While we endeavor to adhere strictly to published clinic timings, unforeseen clinical emergencies may occasionally cause doctor consultation delays.
              </p>
              <p>
                3. <strong>Blood Sample Collection:</strong> Fasting instructions must be followed diligently by patients to guarantee diagnostic accuracy.
              </p>
            </>
          )}
        </div>

        <div className="p-4 bg-slate-50 border-t border-slate-100 flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-slate-900 text-white font-bold text-xs hover:bg-slate-800 cursor-pointer"
          >
            I Understand
          </button>
        </div>

      </div>
    </div>
  );
};
