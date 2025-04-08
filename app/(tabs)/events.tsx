import React from 'react';
import WeeklyEventForecast from '../../src/components/WeeklyEventForecast';
import { View, StyleSheet, SafeAreaView } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
// Assuming you might have context later:
// import { useWeatherData } from '../../src/context/WeatherContext'; // Example path
// import { getTextColorForCondition } from '../../src/utils/ui'; // Example path

// --- New Neutral Background Gradient ---
// Example: A deep blue/grey gradient
const eventsTabBackground = ['#2c3e50', '#34495e'];
// Example: A dark charcoal gradient
// const eventsTabBackground = ['#434343', '#000000'];

// --- Fallback / Simulation values ---
const simulatedCurrentLocation = "Paris"; // Simulate getting current location
// We still need a text color for the *title* of the WeeklyEventForecast component
const defaultTitleTextColor = '#FFFFFF'; // Use white for the title text against the dark background

export default function EventsScreen() {
  // --- Ideal State Management (using Context/State) ---
  // const { locationName, weatherData } = useWeatherData(); // Get real data
  // const titleTextColor = getTextColorForCondition(weatherData?.currentWeather.condition); // Or maybe always white/dark?
  // const currentLocationName = locationName;

  // --- Temporary Simulation ---
  const titleTextColor = defaultTitleTextColor; // For the "TRAVEL FORECAST" title
  const currentLocationName = simulatedCurrentLocation;

  return (
    // Use the new neutral background gradient
    <LinearGradient colors={eventsTabBackground} style={styles.background}>
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.container}>
          <WeeklyEventForecast
            currentLocationName={currentLocationName}
            // Pass the text color specifically for the title/messages within WeeklyEventForecast
            titleTextColor={titleTextColor}
            // The 'textColor' prop for the cards themselves is removed
          />
        </View>
      </SafeAreaView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  background: { flex: 1 },
  safeArea: { flex: 1 },
  container: {
    flex: 1,
    paddingHorizontal: 15,
    paddingTop: 20,
    paddingBottom: 70, // Avoid tab bar overlap
  },
}); 