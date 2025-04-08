import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, ActivityIndicator } from 'react-native';
import { DailyWeatherCardData, EventWeatherForecast, CalendarEvent, WeatherCondition } from '../types'; // Import necessary types
import DailyWeatherCard from './DailyWeatherCard';
import { format, addDays, startOfDay, isEqual } from 'date-fns';
import { useFonts, SpaceGrotesk_400Regular, SpaceGrotesk_700Bold } from '@expo-google-fonts/space-grotesk';

// --- Mock Data Generation (Keep as is for now) ---
const possibleConditions: WeatherCondition[] = [ 'Clear', 'Clouds', 'Rain', 'Snow', 'Mist'];
const getRandomInt = (min: number, max: number) => Math.floor(Math.random() * (max - min + 1)) + min;

const simulateFetchCalendarEvents = (startDate: Date, numDays: number): CalendarEvent[] => {
    const events: CalendarEvent[] = [];
    const locations = ["Flight LGW->BCN", "Generator Hostel Barcelona", "Sagrada Familia Tour", null, "Train BCN->PAR", "Hotel St-Michel Paris", "Home"]; // More travel-like locations
     for (let i = 0; i < numDays; i++) {
        if (Math.random() < 0.5) { // 50% chance of an event
             const eventDate = addDays(startDate, i);
             const location = locations[getRandomInt(0, locations.length -1)];
             events.push({
                 id: `event-${i}-a`,
                 title: location ? `Event ${i+1}A - ${location}` : `Event ${i+1}A - NoLoc`,
                 startDate: eventDate.toISOString(),
                 endDate: eventDate.toISOString(),
                 location: location ?? '',
             });
        }
    }
    return events;
};

const simulateFetchWeatherForLocation = (location: string | null): EventWeatherForecast => {
    const condition = possibleConditions[getRandomInt(0, possibleConditions.length - 1)];
    // Simulate different temps based on whether it's a specific destination or fallback
    const baseTemp = location ? getRandomInt(5, 25) : getRandomInt(10, 20); // Destination temps vary more?
    return {
        condition: condition,
        temperature: baseTemp + getRandomInt(-3, 3),
    };
};
// --- End Mock Data Generation ---


interface WeeklyEventForecastProps {
  currentLocationName: string | null;
  titleTextColor: string;
}

const WeeklyEventForecast: React.FC<WeeklyEventForecastProps> = ({ currentLocationName, titleTextColor }) => {
  const [fontsLoaded] = useFonts({ SpaceGrotesk_400Regular, SpaceGrotesk_700Bold });
  const [weeklyData, setWeeklyData] = useState<DailyWeatherCardData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const dynamicStyles = StyleSheet.create({
    titleText: {
      color: `${titleTextColor}${titleTextColor === '#FFFFFF' ? 'CC' : '99'}`,
    },
    messageText: {
       color: titleTextColor,
    }
  });

  useEffect(() => {
    const loadWeeklyData = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const today = startOfDay(new Date());
        const nextSevenDays: Date[] = Array.from({ length: 7 }).map((_, i) => addDays(today, i));

        // Simulate fetching calendar events for the week
        const calendarEvents = simulateFetchCalendarEvents(today, 7);

        const processedData: DailyWeatherCardData[] = [];

        for (const date of nextSevenDays) {
          const dayId = date.toISOString();
          let locationForForecast: string | null = null;
          let displayLocation: string | null = null; // Separate for display text
          let isEventLoc = false;

          // Find the *first* event for this specific day that HAS a location
          const eventOnThisDay = calendarEvents.find(event =>
            isEqual(startOfDay(new Date(event.startDate)), date) && event.location
          );

          if (eventOnThisDay) {
             // Found an event with a location for today
             locationForForecast = eventOnThisDay.location; // Use this location for API call
             displayLocation = eventOnThisDay.location; // Display this location name
             isEventLoc = true;
          } else {
             // No event with location today, use the user's current location as fallback
             locationForForecast = currentLocationName; // Use current location for API call (or null if unavailable)
             displayLocation = currentLocationName ? `📍 ${currentLocationName}` : null; // Display current location with indicator
             isEventLoc = false;
          }

          // Simulate fetching weather for the determined location (event location or current location)
          // Pass the *actual* location string (or null) to the fetcher
          const forecast = simulateFetchWeatherForLocation(locationForForecast);

          // Format day name
          let dayName = format(date, 'eee'); // e.g., "Mon"
          if (isEqual(date, today)) { dayName = 'Today'; }
          else if (isEqual(date, addDays(today, 1))) { dayName = 'Tomorrow'; }

          processedData.push({
            id: dayId,
            date: date,
            dayName: dayName,
            location: displayLocation, // Use the display-formatted location
            forecast: forecast,
            isEventLocation: isEventLoc, // Track if it was from an event
          });
        }
        setWeeklyData(processedData);

      } catch (e: any) {
        setError("Failed to load weekly forecast data.");
        console.error(e);
      } finally {
        setIsLoading(false);
      }
    };

    // Reload if the user's current location changes (passed via prop)
    loadWeeklyData();
  }, [currentLocationName]);

  // --- Render Logic (Loading, Error, Fonts) ---
  if (!fontsLoaded) {
      return <View style={styles.centeredMessageContainer}><ActivityIndicator size="small" color={titleTextColor} /></View>;
   }
  if (isLoading) {
    return <View style={styles.centeredMessageContainer}><ActivityIndicator size="small" color={titleTextColor} /></View>;
  }
  if (error) {
    return <View style={styles.centeredMessageContainer}><Text style={[styles.messageText, dynamicStyles.messageText]}>{error}</Text></View>;
  }
  // --- End Render Logic ---


  return (
    <View style={styles.container}>
       {/* Updated Title */}
       <Text style={[styles.title, dynamicStyles.titleText]}>TRAVEL FORECAST</Text>
       <ScrollView showsVerticalScrollIndicator={false}>
        {weeklyData.map(item => (
          <DailyWeatherCard key={item.id} data={item} />
        ))}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  title: {
    fontFamily: 'SpaceGrotesk_700Bold',
    fontSize: 14,
    marginBottom: 15,
    fontWeight: 'bold',
    letterSpacing: -0.3,
    // Color applied dynamically
  },
  centeredMessageContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  messageText: {
    fontFamily: 'SpaceGrotesk_400Regular',
    fontSize: 14,
    textAlign: 'center',
  },
});

export default WeeklyEventForecast; 