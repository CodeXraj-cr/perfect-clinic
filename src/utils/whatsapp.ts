export interface DoctorBookingParams {
  clinicName: string;
  whatsappNumber: string;
  doctorName: string;
  date: string;
  time: string;
  patientName: string;
  patientAge?: string;
  phoneNumber: string;
  notes?: string;
}

export interface BloodTestBookingParams {
  clinicName: string;
  whatsappNumber: string;
  testName: string;
  preferredDate: string;
  preferredTime: string;
  patientName: string;
  patientAge?: string;
  phoneNumber: string;
  notes?: string;
}

export const cleanPhoneForWhatsApp = (phone: string): string => {
  // Strip non-digits except initial '+'
  let cleaned = phone.replace(/[^0-9]/g, '');
  // Default to India country code 91 if 10 digits provided
  if (cleaned.length === 10) {
    cleaned = '91' + cleaned;
  }
  return cleaned;
};

export const generateDoctorWhatsAppUrl = (params: DoctorBookingParams): string => {
  const number = cleanPhoneForWhatsApp(params.whatsappNumber || '919830123456');
  
  const text = `Hello ${params.clinicName || '+PERFECT+'} Clinic,

I would like to book an appointment.

Doctor: ${params.doctorName}
Date: ${params.date}
Time: ${params.time}

Patient Name: ${params.patientName}
Age: ${params.patientAge || 'N/A'}
Phone Number: ${params.phoneNumber}${params.notes ? `\nNotes: ${params.notes}` : ''}

Thank you.`;

  return `https://wa.me/${number}?text=${encodeURIComponent(text)}`;
};

export const generateBloodTestWhatsAppUrl = (params: BloodTestBookingParams): string => {
  const number = cleanPhoneForWhatsApp(params.whatsappNumber || '919830123456');
  
  const text = `Hello ${params.clinicName || '+PERFECT+'} Clinic,

I would like to book a blood test appointment.

Patient Name: ${params.patientName}
Preferred Date: ${params.preferredDate}
Preferred Time: ${params.preferredTime}
Test Name: ${params.testName}${params.patientAge ? `\nAge: ${params.patientAge}` : ''}
Phone Number: ${params.phoneNumber}${params.notes ? `\nNotes: ${params.notes}` : ''}

Thank you.`;

  return `https://wa.me/${number}?text=${encodeURIComponent(text)}`;
};
