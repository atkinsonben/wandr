import React from 'react';
import { View, Text, StyleSheet, FlatList } from 'react-native';
import { HourlyForecastItem, WeatherCondition } from '../types'; // Assuming types are updated
import { useFonts, SpaceGrotesk_400Regular, SpaceGrotesk_700Bold } from '@expo-google-fonts/space-grotesk';
import { getWeatherIcon } from '../utils/ui';

interface HourlyForecastProps {
  forecast: HourlyForecastItem[];
  textColor: string; // Add textColor prop
}

const HourlyForecast: React.FC<HourlyForecastProps> = ({ forecast, textColor }) => {
  const [fontsLoaded] = useFonts({
    SpaceGrotesk_400Regular,
    SpaceGrotesk_700Bold,
  });

  if (!fontsLoaded) {
    return null; // Or a loading indicator
  }

  // Create faded text color for title
  const fadedTextColor = `${textColor}${textColor === '#FFFFFF' ? 'CC' : '99'}`; // 80% or 60% opacity

  // Define dynamic styles
  const dynamicStyles = StyleSheet.create({
      titleText: {
        color: fadedTextColor, // Use faded color for title
      },
      itemText: {
        color: textColor, // Main color for time, temp
      },
      precipText: {
        // Keep blue or adjust based on textColor? Let's keep blue for now for visibility.
        color: '#4A90E2',
        // Or make it dynamic:
        // color: textColor === '#FFFFFF' ? '#87CEFA' : '#1E90FF', // Lighter/darker blue
      }
  });

  const renderItem = ({ item }: { item: HourlyForecastItem }) => (
    <View style={styles.itemContainer}>
      {/* Apply dynamic styles */}
      <Text style={[styles.timeText, dynamicStyles.itemText]}>{item.time}</Text>
      <Text style={styles.iconText}>{getWeatherIcon(item.condition)}</Text>
      <Text style={[styles.tempText, dynamicStyles.itemText]}>{item.temperature}°</Text>
      {item.precipitationChance > 0 && ( // Show if > 0%
        <Text style={[styles.precipText, dynamicStyles.precipText]}>{item.precipitationChance}%</Text>
      )}
    </View>
  );

  return (
    <View style={styles.container}>
      {/* Apply dynamic styles */}
      <Text style={[styles.title, dynamicStyles.titleText]}>HOURLY FORECAST</Text>
      <FlatList
        data={forecast}
        renderItem={renderItem}
        keyExtractor={(item, index) => `${item.time}-${index}`}
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.listContentContainer}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)', // Translucent white background
    borderRadius: 15,
    paddingVertical: 15,
    paddingHorizontal: 10,
    maxHeight: 165,
    marginTop: 20, // Add margin from the current weather
  },
  title: {
    fontFamily: 'SpaceGrotesk_700Bold',
    fontSize: 14,
    marginBottom: 10,
    marginLeft: 5,
    fontWeight: 'bold',
    letterSpacing: -0.3, // Tighten title spacing slightly
  },
  listContentContainer: {
    paddingRight: 10, // Ensure last item isn't cut off
  },
  itemContainer: {
    alignItems: 'center',
    marginRight: 15, // Spacing between items
    minWidth: 50, // Ensure items have some width
    paddingBottom: 5, // Add padding if needed
  },
  timeText: {
    fontFamily: 'SpaceGrotesk_400Regular',
    fontSize: 14,
    marginBottom: 8,
    letterSpacing: -0.5, // Tighten spacing
  },
  iconText: {
    fontSize: 24, // Emoji icon size
    marginBottom: 8,
  },
  tempText: {
    fontFamily: 'SpaceGrotesk_700Bold',
    fontSize: 16,
    fontWeight: 'bold',
    letterSpacing: -0.5, // Tighten spacing
  },
  precipText: {
    fontFamily: 'SpaceGrotesk_400Regular',
    fontSize: 12,
    marginTop: 4,
    letterSpacing: -0.3, // Tighten spacing slightly
  },
});

export default HourlyForecast;
