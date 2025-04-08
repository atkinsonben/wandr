import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { EventForecast } from '../types';
import { getWeatherIcon } from '../utils/ui'; // Reuse the icon utility
import { format } from 'date-fns';
import { useFonts, SpaceGrotesk_400Regular, SpaceGrotesk_700Bold } from '@expo-google-fonts/space-grotesk';

interface EventForecastItemProps {
  item: EventForecast;
  textColor: string; // Pass textColor for consistency
}

const EventForecastItem: React.FC<EventForecastItemProps> = ({ item, textColor }) => {
  const [fontsLoaded] = useFonts({
    SpaceGrotesk_400Regular,
    SpaceGrotesk_700Bold,
  });

  if (!fontsLoaded) {
    return null; // Don't render item until fonts are loaded
  }

  // Format the date nicely
  const formattedDate = format(new Date(item.startDate), 'eee, MMM d'); // e.g., "Mon, Jul 29"

  // Define dynamic styles based on textColor
  const dynamicStyles = StyleSheet.create({
    text: {
      color: textColor,
    },
    secondaryText: {
      // Slightly faded version
      color: `${textColor}${textColor === '#FFFFFF' ? 'AA' : '88'}`,
    },
  });

  return (
    <View style={styles.container}>
      {/* Left side: Date and Event Title */}
      <View style={styles.eventInfoContainer}>
        <Text style={[styles.dateText, dynamicStyles.secondaryText]}>{formattedDate}</Text>
        <Text style={[styles.titleText, dynamicStyles.text]} numberOfLines={1} ellipsizeMode="tail">{item.title}</Text>
        {item.location ? (
             <Text style={[styles.locationText, dynamicStyles.secondaryText]} numberOfLines={1} ellipsizeMode="tail">{item.location}</Text>
        ) : null}
      </View>

      {/* Right side: Weather Icon and Temperature */}
      <View style={styles.forecastContainer}>
        {item.forecast ? (
          <>
            <Text style={styles.iconText}>{getWeatherIcon(item.forecast.condition)}</Text>
            <Text style={[styles.tempText, dynamicStyles.text]}>
              {item.forecast.temperature !== null ? `${Math.round(item.forecast.temperature)}°` : '--'}
            </Text>
          </>
        ) : (
          // Placeholder or loading indicator if forecast isn't ready
          <Text style={[styles.tempText, dynamicStyles.secondaryText]}>...</Text>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 5, // Add some horizontal padding within the item
    // Add bottom border or adjust gap in FlatList
    // borderBottomWidth: StyleSheet.hairlineWidth,
    // borderBottomColor: 'rgba(255, 255, 255, 0.3)', // Adjust color based on theme potentially
  },
  eventInfoContainer: {
    flex: 1, // Take up available space
    marginRight: 15, // Space before forecast
  },
  dateText: {
    fontFamily: 'SpaceGrotesk_400Regular',
    fontSize: 12,
    marginBottom: 2,
    opacity: 0.8,
  },
  titleText: {
    fontFamily: 'SpaceGrotesk_700Bold',
    fontSize: 16,
    marginBottom: 2,
  },
   locationText: {
    fontFamily: 'SpaceGrotesk_400Regular',
    fontSize: 12,
    opacity: 0.8,
  },
  forecastContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    minWidth: 60, // Ensure minimum width for alignment
    justifyContent: 'flex-end', // Align items to the right
  },
  iconText: {
    fontSize: 24,
    marginRight: 8,
  },
  tempText: {
    fontFamily: 'SpaceGrotesk_700Bold',
    fontSize: 16,
  },
});

export default EventForecastItem; 