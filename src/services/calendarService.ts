import RNCalendarEvents from 'react-native-calendar-events';
import { CalendarEvent } from '../types';

export const requestCalendarPermissions = async (): Promise<boolean> => {
  try {
    const auth = await RNCalendarEvents.requestPermissions();
    return auth === 'authorized';
  } catch (error) {
    console.error('Error requesting calendar permissions:', error);
    return false;
  }
};

export const fetchCalendarEvents = async (startDate: Date, endDate: Date): Promise<CalendarEvent[]> => {
  try {
    const events = await RNCalendarEvents.fetchAllEvents(
      startDate.toISOString(),
      endDate.toISOString()
    );

    return events
      .filter(event => event.endDate && event.startDate) // Filter out events with undefined dates
      .map(event => ({
        id: event.id,
        title: event.title,
        startDate: event.startDate,
        endDate: event.endDate!,
        location: event.location,
      }));
  } catch (error) {
    console.error('Error fetching calendar events:', error);
    throw error;
  }
};
