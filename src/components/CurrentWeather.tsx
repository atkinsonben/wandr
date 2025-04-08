import React from 'react';
import { View, Text, StyleSheet, ActivityIndicator, Image, ScrollView } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useFonts, SpaceGrotesk_400Regular, SpaceGrotesk_700Bold, SpaceGrotesk_300Light } from '@expo-google-fonts/space-grotesk';
import { getWeatherIcon, gradientColors, getTextColorForCondition } from '../utils/ui';
import { HourlyForecastItem, MinutelyForecastItem, WeatherCondition, DailyForecastItem } from '../types';
import HourlyForecast from './HourlyForecast';
import MinutelyForecast from './MinutelyForecast';
import DailyForecast from './DailyForecast';

// Define default gradient colors for fallback
const defaultGradient = gradientColors.Unknown;

interface CurrentWeatherProps {
  locationName: string | null;
  temperature: number | null;
  feelsLike: number | null;
  condition: WeatherCondition | null;
  highTemp: number | null;
  lowTemp: number | null;
  locationPermissionStatus: 'granted' | 'denied' | 'undetermined';
  hourlyForecast: HourlyForecastItem[];
  minutelyForecast: MinutelyForecastItem[];
  dailyForecast: DailyForecastItem[];
}

const CurrentWeather: React.FC<CurrentWeatherProps> = ({
  locationName,
  temperature,
  feelsLike,
  condition,
  highTemp,
  lowTemp,
  locationPermissionStatus,
  hourlyForecast,
  minutelyForecast,
  dailyForecast,
}) => {
  const [fontsLoaded] = useFonts({
    SpaceGrotesk_400Regular,
    SpaceGrotesk_700Bold,
    SpaceGrotesk_300Light
  });

  if (!fontsLoaded) {
    return (
      <View style={[styles.container, styles.centerContent]}>
        <ActivityIndicator size="large" color="#ffffff" />
      </View>
    );
  }

  if (locationPermissionStatus === 'denied') {
    return (
      <View style={[styles.container, styles.centerContent]}>
        <Text style={styles.permissionText}>Location permission required to fetch weather.</Text>
      </View>
    );
  }

  if (locationPermissionStatus === 'undetermined') {
    // You might want a specific UI while permission is being asked
    return (
      <View style={[styles.container, styles.centerContent]}>
        <Text style={styles.permissionText}>Checking location permission...</Text>
      </View>
    );
  }

  // Determine gradient colors, icon, and text color
  const validCondition = condition && gradientColors[condition] ? condition : 'Clear';
  const colors = condition ? (gradientColors[condition] || defaultGradient) : defaultGradient;
  const icon = getWeatherIcon(validCondition);
  // Calculate text color based on the *actual* condition, defaulting to 'Clear' if null
  const textColor = getTextColorForCondition(condition ?? 'Clear');
  // Create a faded version of the text color
  const fadedTextColor = `${textColor}${textColor === '#FFFFFF' ? 'CC' : '99'}`; // Add alpha: CC for white (80%), 99 for dark (60%)

  // Define dynamic styles that depend on textColor
  const dynamicStyles = StyleSheet.create({
    narrativeText: {
      color: fadedTextColor, // Use faded color for narrative text
    },
    locationText: {
      color: textColor,
    },
    temperatureText: {
      color: textColor,
    },
    feelsLikeText: {
      color: fadedTextColor, // Use faded color for feels like
    },
    conditionText: {
      color: textColor,
    },
    highLowText: { // Example if high/low were displayed here
      color: textColor,
    },
    permissionText: { // Keep permission text visible
      color: '#FFFFFF', // Use white regardless of background for this message
    },
  });

  return (
    <LinearGradient colors={colors} style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContentContainer}>
        <Text style={[styles.narrativeLocation, dynamicStyles.narrativeText]}>Right now, in</Text>
        <Text style={[styles.location, dynamicStyles.locationText]}>{locationName || 'Loading...'}</Text>
        <Text style={[styles.narrativeCondition, dynamicStyles.narrativeText]}>it's...</Text>

        <View style={styles.currentWeatherMain}>
          <View style={styles.tempAndFeelsContainer}>
            <Text style={[styles.temperature, dynamicStyles.temperatureText]}>{temperature !== null ? `${temperature}°` : '--'}</Text>
            {feelsLike !== null && feelsLike !== temperature && <Text style={[styles.feelsLikeText, dynamicStyles.feelsLikeText]}>but feels like {feelsLike !== null ? `${feelsLike}°` : '--'}</Text>}
            {feelsLike !== null && feelsLike == temperature && <Text style={[styles.feelsLikeText, dynamicStyles.feelsLikeText]}>and feels like {feelsLike !== null ? `${feelsLike}°` : '--'} </Text>}
          </View>

          <View style={styles.conditionContainer}>
            <Text style={styles.icon}>{icon}</Text>
            <Text style={[styles.condition, dynamicStyles.conditionText]}>{condition || 'Loading...'}</Text>
          </View>
        </View>

        {/* Integrate Minutely Forecast (only if precipitation exists) */}
        {Array.isArray(minutelyForecast) && minutelyForecast.some(item => item.precipitation > 0) && (
          <MinutelyForecast forecast={minutelyForecast} textColor={textColor} />
        )}

        {/* Integrate Hourly Forecast */}
        {Array.isArray(hourlyForecast) && hourlyForecast.length > 0 && (
          <HourlyForecast forecast={hourlyForecast} textColor={textColor} />
        )}

        {/* Integrate Daily Forecast */}
        {Array.isArray(dailyForecast) && dailyForecast.length > 0 && (
          <DailyForecast forecast={dailyForecast} textColor={textColor} />
        )}

      </ScrollView>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1, // Make container fill available space
  },
  scrollContentContainer: { // Style for ScrollView content
    padding: 20, // Re-apply padding here
    alignItems: 'center', // Center items horizontally in the scroll view
  },
  centerContent: {
    flex: 1, // Ensure loading/permission view fills screen
    alignItems: 'center',
  },
  narrativeLocation: { // Style for "Right now in"
    fontFamily: 'SpaceGrotesk_400Regular', // Use Space Grotesk Regular
    fontSize: 18,
    marginTop: 50, // Add some space from the top
    letterSpacing: -0.5, // Tighten spacing
  },
  location: {
    fontFamily: 'SpaceGrotesk_700Bold', // Use Space Grotesk Bold
    fontSize: 32, // Adjust size if needed for new font
    marginBottom: 5,
    textAlign: 'center',
    letterSpacing: -1, // Tighten spacing more for title
  },
  narrativeCondition: { // Style for "it's"
    fontFamily: 'SpaceGrotesk_400Regular', // Use Space Grotesk Regular
    fontSize: 18,
    marginBottom: 5,
    letterSpacing: -0.5, // Tighten spacing
  },
  currentWeatherMain: { // Container for temp + condition/icon
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center', // Center items horizontally in the main weather display
    marginBottom: 5,
  },
  tempAndFeelsContainer: { // New container for temp and feels like
    alignItems: 'center', // Center temp and feels like text horizontally
    marginRight: 20, // Add space between this container and the condition container
  },
  temperature: {
    fontFamily: 'SpaceGrotesk_700Bold', // Use Space Grotesk Bold for temp
    fontSize: 124,
    letterSpacing: -2, // Tighten spacing significantly for large temp
    lineHeight: 124 * 1.1, // Adjust line height slightly
  },
  feelsLikeText: { // Adjusted style
    fontFamily: 'SpaceGrotesk_400Regular',
    fontSize: 12, // Increased size slightly
    marginTop: -20, // Pull it up closer to the main temp
  },
  conditionContainer: { // Container for icon + condition text
    alignItems: 'center',
  },
  icon: {
    fontSize: 72, // Slightly smaller icon next to temp
    marginBottom: 5,
  },
  condition: {
    fontFamily: 'SpaceGrotesk_400Regular', // Use Space Grotesk Regular
    fontSize: 18, // Smaller condition text
    textTransform: 'capitalize',
    letterSpacing: -0.5, // Tighten spacing
  },
  highLowContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 5,
    marginBottom: 10, // Add space before hourly forecast
  },
  highLowText: {
    fontFamily: 'SpaceGrotesk_400Regular', // Use Space Grotesk Regular
    fontSize: 16,
    marginHorizontal: 10,
    letterSpacing: -0.5, // Tighten spacing
  },
  permissionText: {
    fontFamily: 'SpaceGrotesk_400Regular', // Use Space Grotesk Regular
    fontSize: 16,
    textAlign: 'center',
    padding: 20,
    letterSpacing: -0.5, // Tighten spacing
  },
});

export default CurrentWeather;
