import { ClinicInfo } from '../types/clinic';

export interface ClinicStatusResult {
  isOpen: boolean;
  statusText: string;
  nextScheduleText: string;
  isHoliday: boolean;
}

export const getClinicLiveStatus = (clinic: ClinicInfo): ClinicStatusResult => {
  if (clinic.isClosedHoliday) {
    return {
      isOpen: false,
      statusText: 'Closed for Holiday',
      nextScheduleText: clinic.holidayNotice || 'Resuming regular clinic hours tomorrow',
      isHoliday: true,
    };
  }

  const now = new Date();
  const day = now.getDay(); // 0 is Sunday, 1 is Monday ... 6 is Saturday
  const currentHour = now.getHours();
  const currentMinute = now.getMinutes();
  const currentMinutesFromMidnight = currentHour * 60 + currentMinute;

  let openMinutes = 8 * 60; // 8:00 AM default
  let closeMinutes = 20 * 60; // 8:00 PM default

  if (day === 0) {
    // Sunday
    openMinutes = 9 * 60; // 9:00 AM
    closeMinutes = 14 * 60; // 2:00 PM
  }

  const isOpen = currentMinutesFromMidnight >= openMinutes && currentMinutesFromMidnight < closeMinutes;

  if (isOpen) {
    const closeHourFormatted = day === 0 ? '2:00 PM' : '8:00 PM';
    return {
      isOpen: true,
      statusText: 'Open Now',
      nextScheduleText: `Open until ${closeHourFormatted} today`,
      isHoliday: false,
    };
  } else {
    let nextOpen = 'Opens at 8:00 AM tomorrow';
    if (day === 6) {
      nextOpen = 'Opens at 9:00 AM Sunday';
    } else if (currentMinutesFromMidnight < openMinutes) {
      nextOpen = day === 0 ? 'Opens today at 9:00 AM' : 'Opens today at 8:00 AM';
    }

    return {
      isOpen: false,
      statusText: 'Closed Now',
      nextScheduleText: nextOpen,
      isHoliday: false,
    };
  }
};
