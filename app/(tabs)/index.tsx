import React from 'react';
import CurrentWeather from '../../src/components/CurrentWeather'; // Adjust path if needed
import { View, StyleSheet } from 'react-native';

// Import hooks for fetching data or managing state if needed here
// For now, assume CurrentWeather handles its own data fetching

export default function WeatherScreen() {
  // --- State Management ---
  // If CurrentWeather needs props like location data, fetch or manage them here.
  // For now, we assume CurrentWeather is self-contained or gets data internally/via context.
  const mockLocationName = "Cupertino"; // Replace with actual data source
  const mockWeatherData = { // Replace with actual data fetching logic
    temperature: 18,
    feelsLike: 17,
    condition: 'Clouds', // Example condition
    highTemp: 21,
    lowTemp: 15,
  };
  const mockPermission = 'granted';
  const mockForecasts = { // Replace with actual data
      hourly: Array(12).fill({ time: '1PM', temperature: 18, condition: 'Clouds', precipitationChance: 10}),
      minutely: Array(60).fill({ dt: Date.now(), precipitation: 0 }),
      daily: Array(5).fill({ date: new Date().toISOString(), highTemp: 20, lowTemp: 15, condition: 'Clouds', precipitationChance: 10}),
  };


  // --- Rendering ---
  return (
    <View style={styles.container}>
      {/* Pass necessary props to CurrentWeather */}
      <CurrentWeather
          locationName={mockLocationName}
          temperature={mockWeatherData.temperature}
          feelsLike={mockWeatherData.feelsLike}
          condition={mockWeatherData.condition as any} // Cast if needed, ensure type match
          highTemp={mockWeatherData.highTemp}
          lowTemp={mockWeatherData.lowTemp}
          locationPermissionStatus={mockPermission}
          hourlyForecast={mockForecasts.hourly}
          minutelyForecast={mockForecasts.minutely}
          dailyForecast={mockForecasts.daily}
       />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    // No background color here, CurrentWeather provides the gradient
  },
}); 