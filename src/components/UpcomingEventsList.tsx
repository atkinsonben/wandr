import React from 'react';
import { View, Text, StyleSheet, FlatList, ActivityIndicator } from 'react-native';
import { EventForecast, ListState } from '../types';
import EventForecastItem from './EventForecastItem'; // Import the item component
import { useFonts, SpaceGrotesk_400Regular, SpaceGrotesk_700Bold } from '@expo-google-fonts/space-grotesk';

interface UpcomingEventsListProps {
  events: EventForecast[];
  listState: ListState;
  error?: string | null;
  textColor: string; // Pass textColor for consistency
  title?: string; // Optional title for the section
}

// --- Mock Data ---
// Keep this outside the component or pass it via props in a real scenario
const MOCK_EVENTS: EventForecast[] = [
  {
    id: '1',
    title: 'Team Meeting @ HQ',
    startDate: new Date(new Date().setDate(new Date().getDate() + 1)).toISOString(), // Tomorrow
    endDate: new Date(new Date().setDate(new Date().getDate() + 1)).toISOString(),
    location: '123 Main St, San Francisco',
    forecast: { condition: 'Clear', temperature: 22 },
  },
  {
    id: '2',
    title: 'Client Lunch Downtown',
    startDate: new Date(new Date().setDate(new Date().getDate() + 2)).toISOString(), // Day after tomorrow
    endDate: new Date(new Date().setDate(new Date().getDate() + 2)).toISOString(),
    location: 'Financial District',
    forecast: { condition: 'Clouds', temperature: 19 },
  },
  {
    id: '3',
    title: 'Weekend Trip - Napa',
    startDate: new Date(new Date().setDate(new Date().getDate() + 4)).toISOString(), // In 4 days
    endDate: new Date(new Date().setDate(new Date().getDate() + 6)).toISOString(),
    location: 'Napa Valley, CA',
    forecast: { condition: 'Rain', temperature: 17 },
  },
   {
    id: '4',
    title: 'No Location Event',
    startDate: new Date(new Date().setDate(new Date().getDate() + 5)).toISOString(),
    endDate: new Date(new Date().setDate(new Date().getDate() + 5)).toISOString(),
    location: '', // Empty location
    forecast: { condition: 'Snow', temperature: -2 }, // Forecast might still exist if calendar has coordinates
  },
   {
    id: '5',
    title: 'Future Event - No Forecast Yet',
    startDate: new Date(new Date().setDate(new Date().getDate() + 10)).toISOString(),
    endDate: new Date(new Date().setDate(new Date().getDate() + 10)).toISOString(),
    location: 'London, UK',
    forecast: null, // No forecast available yet
  },
];
// --- End Mock Data ---

const UpcomingEventsList: React.FC<UpcomingEventsListProps> = ({
  events = MOCK_EVENTS, // Use mock data as default for now
  listState = 'populated', // Default to populated for testing with mock data
  error,
  textColor,
  title = "WHAT'S COMING UP?", // Default title
}) => {
  const [fontsLoaded] = useFonts({
    SpaceGrotesk_400Regular,
    SpaceGrotesk_700Bold,
  });

  // Define dynamic styles based on textColor
  const dynamicStyles = StyleSheet.create({
    titleText: {
      // Slightly faded title
      color: `${textColor}${textColor === '#FFFFFF' ? 'CC' : '99'}`,
    },
    messageText: {
       color: textColor,
    }
  });

  const renderContent = () => {
    if (!fontsLoaded || listState === 'loading') {
      return (
        <View style={styles.centeredMessageContainer}>
          <ActivityIndicator size="small" color={textColor} />
        </View>
      );
    }

    if (listState === 'error') {
      return (
        <View style={styles.centeredMessageContainer}>
          <Text style={[styles.messageText, dynamicStyles.messageText]}>
            {error || 'Could not load events.'}
          </Text>
        </View>
      );
    }

    if (listState === 'empty' || events.length === 0) {
      return (
        <View style={styles.centeredMessageContainer}>
          <Text style={[styles.messageText, dynamicStyles.messageText]}>
            No upcoming events with locations found.
          </Text>
        </View>
      );
    }

    // State is 'populated'
    return (
      <FlatList
        data={events}
        renderItem={({ item }) => <EventForecastItem item={item} textColor={textColor} />}
        keyExtractor={(item) => item.id}
        // Optional: Add separators or adjust styles
        // ItemSeparatorComponent={() => <View style={styles.separator} />}
      />
    );
  };

  return (
    <View style={styles.container}>
      {title && <Text style={[styles.title, dynamicStyles.titleText]}>{title}</Text>}
      {renderContent()}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginTop: 20, // Or adjust as needed
    width: '100%',
    backgroundColor: 'rgba(255, 255, 255, 0.15)', // Slightly different background?
    borderRadius: 15,
    paddingVertical: 15,
    paddingHorizontal: 15, // Padding for the overall container
    minHeight: 100, // Ensure container has some height even when empty/loading
  },
  title: {
    fontFamily: 'SpaceGrotesk_700Bold',
    fontSize: 14,
    marginBottom: 10,
    fontWeight: 'bold',
    letterSpacing: -0.3,
    paddingLeft: 5, // Align with item padding
  },
  centeredMessageContainer: {
    flex: 1, // Take up available space in the container
    justifyContent: 'center',
    alignItems: 'center',
    minHeight: 60, // Ensure message area is not too small
  },
  messageText: {
    fontFamily: 'SpaceGrotesk_400Regular',
    fontSize: 14,
    textAlign: 'center',
  },
  // Optional separator style
  /*
  separator: {
    height: StyleSheet.hairlineWidth,
    backgroundColor: 'rgba(255, 255, 255, 0.3)', // Adjust color
    marginHorizontal: 5, // Match item horizontal padding
  },
  */
});

export default UpcomingEventsList;
