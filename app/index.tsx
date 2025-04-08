import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { format } from 'date-fns';
import { WeatherData, HourlyForecastItem, MinutelyForecastItem, DailyForecastItem, Location as LocationType, WeatherCondition, WeatherApiResponse } from '../src/types';
import CurrentWeather from '../src/components/CurrentWeather';
import * as Location from 'expo-location';

// --- Random Data Generation ---

const possibleConditions: WeatherCondition[] = [
  'Clear', 'Clouds', 'Rain', 'Snow', 'Thunderstorm', 'Drizzle', 'Mist', 'Fog'
]; // Reduced set for mock data, align with WeatherCondition type

const getRandomInt = (min: number, max: number) => {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1)) + min;
};

const generateMockWeatherData = (): WeatherApiResponse => {
  const currentTemp = getRandomInt(-5, 35); // Temp range -5C to 35C
  const currentCondition = possibleConditions[getRandomInt(0, possibleConditions.length - 1)]; // Avoid 'Unknown' usually
  // Simple feels like logic: slightly different from actual temp
  const feelsLikeTemp = currentTemp + getRandomInt(-2, 2);

  // Basic logic for high/low based on current temp
  const highTemp = Math.max(currentTemp, feelsLikeTemp) + getRandomInt(1, 5); // Ensure high is >= current/feelsLike
  const lowTemp = Math.min(currentTemp, feelsLikeTemp) - getRandomInt(1, 5); // Ensure low is <= current/feelsLike

  const currentWeather: WeatherData = {
    temperature: currentTemp,
    feelsLike: feelsLikeTemp, // Add feels like
    condition: currentCondition,
    highTemp: highTemp,
    lowTemp: lowTemp,
  };

  // Generate simple hourly forecast
  const hourlyForecast: HourlyForecastItem[] = [];
  let hourlyTemp = currentTemp;
  let hourlyCondition = currentCondition;

  for (let i = 0; i < 24; i++) {
    const now = new Date();
    const forecastTime = new Date(now.getTime() + i * 60 * 60 * 1000);
    const timeLabel = i === 0 ? 'Now' : format(forecastTime, 'h a').toLowerCase();

    // Slightly adjust temp and condition for subsequent hours
    if (i > 0) {
      // More realistic temperature changes
      const hourOfDay = forecastTime.getHours();
      if (hourOfDay >= 6 && hourOfDay <= 14) { // Morning to afternoon
        hourlyTemp += getRandomInt(0, 2); // Temperature tends to rise
      } else if (hourOfDay >= 15 && hourOfDay <= 20) { // Afternoon to evening
        hourlyTemp += getRandomInt(-1, 1); // Temperature stabilizes
      } else { // Evening to morning
        hourlyTemp += getRandomInt(-2, 0); // Temperature tends to fall
      }

      // Chance to change condition slightly
      if (Math.random() < 0.2) {
        hourlyCondition = possibleConditions[getRandomInt(0, possibleConditions.length - 1)];
      }
    }

    const precipChance = (hourlyCondition === 'Rain' || hourlyCondition === 'Snow' || hourlyCondition === 'Thunderstorm') ? getRandomInt(10, 80) : getRandomInt(0, 10);

    hourlyForecast.push({
      time: timeLabel,
      temperature: hourlyTemp,
      condition: hourlyCondition,
      precipitationChance: precipChance,
    });
  }

  // Generate simple minutely forecast (simulating potential rain)
  const minutelyForecast: MinutelyForecastItem[] = [];
  const nowTimestamp = Math.floor(Date.now() / 1000); // Current time in seconds
  let rainStartsIn = Math.random() < 0.25 ? getRandomInt(5, 30) : -1; // 30% chance rain starts in 5-30 mins
  let rainIntensity = rainStartsIn > -1 ? getRandomInt(1, 5) / 10 : 0; // 0.1 to 0.5 mm/h if raining
  const rainDuration = getRandomInt(10, 25); // How long it rains

  for (let i = 0; i < 61; i++) { // 61 entries for the next hour (0 to 60 mins)
    const timestamp = nowTimestamp + i * 60; // Increment timestamp by 1 minute
    let precipitation = 0;

    if (rainStartsIn !== -1 && i >= rainStartsIn && i < rainStartsIn + rainDuration) {
      precipitation = rainIntensity;
    }

    minutelyForecast.push({
      dt: timestamp,
      precipitation: precipitation,
    });
  }

  // Generate daily forecast for next 7 days
  const dailyForecast: DailyForecastItem[] = [];
  let dailyTemp = currentTemp;
  let dailyCondition = currentCondition;

  for (let i = 0; i < 7; i++) {
    const date = new Date();
    date.setDate(date.getDate() + i);

    // Temperature variation between days
    dailyTemp += getRandomInt(-2, 2); // Base temperature drift

    // Random high/low temps around the base
    const highTemp = dailyTemp + getRandomInt(3, 7);
    const lowTemp = dailyTemp - getRandomInt(3, 7);

    // 30% chance to change weather condition
    if (Math.random() < 0.3) {
      dailyCondition = possibleConditions[getRandomInt(0, possibleConditions.length - 1)];
    }

    const precipChance = (dailyCondition === 'Rain' || dailyCondition === 'Snow' || dailyCondition === 'Thunderstorm') 
      ? getRandomInt(30, 90) 
      : getRandomInt(0, 20);

    dailyForecast.push({
      date: date.toISOString(),
      highTemp,
      lowTemp,
      condition: dailyCondition,
      precipitationChance: precipChance,
    });
  }

  return { currentWeather, hourlyForecast, minutelyForecast, dailyForecast };
};

// --- Component ---

// Keep initial state for placeholders
const initialWeatherData: WeatherData = {
  temperature: 0,
  feelsLike: 0, // Add feels like
  condition: 'Unknown',
  highTemp: 0,
  lowTemp: 0,
};
const initialHourlyForecast: HourlyForecastItem[] = Array(24).fill(null).map((_, i) => ({
  time: i === 0 ? 'Now' : `${i}h`,
  temperature: 0,
  condition: 'Unknown',
  precipitationChance: 0,
}));
const initialMinutelyForecast: MinutelyForecastItem[] = []; // Initial state for minutely forecast
const initialDailyForecast: DailyForecastItem[] = []; // Initial state for daily forecast

export default function Home() {
  const [locationName, setLocationName] = useState<string | null>(null);
  const [permissionStatus, setPermissionStatus] = useState<Location.PermissionStatus | null>(null);
  const [currentWeather, setCurrentWeather] = useState<WeatherData>(initialWeatherData);
  const [hourlyForecast, setHourlyForecast] = useState<HourlyForecastItem[]>(initialHourlyForecast);
  const [minutelyForecast, setMinutelyForecast] = useState<MinutelyForecastItem[]>(initialMinutelyForecast);
  const [dailyForecast, setDailyForecast] = useState<DailyForecastItem[]>(initialDailyForecast); // Add state for minutely forecast
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadData = async () => { 
      setIsLoading(true);
      setError(null);
      setLocationName(null);
      setCurrentWeather(initialWeatherData);
      setHourlyForecast(initialHourlyForecast);
      setMinutelyForecast(initialMinutelyForecast); // Reset minutely forecast

      // Request permission
      let { status } = await Location.requestForegroundPermissionsAsync();
      setPermissionStatus(status);

      if (status !== 'granted') {
        setError('Permission to access location was denied');
        setLocationName('Permission Denied');
        // Generate random data even if permission denied
        const { 
          currentWeather: mockWeather, 
          hourlyForecast: mockHourly, 
          minutelyForecast: mockMinutely,
          dailyForecast: mockDaily
        } = generateMockWeatherData();
        setCurrentWeather(mockWeather);
        setHourlyForecast(mockHourly);
        setMinutelyForecast(mockMinutely);
        setDailyForecast(mockDaily);
        setIsLoading(false);
        return;
      }

      // Get location coordinates and name, then generate data
      try {
        let location = await Location.getCurrentPositionAsync({ accuracy: Location.Accuracy.Balanced });
        let addressArray = await Location.reverseGeocodeAsync({
          latitude: location.coords.latitude,
          longitude: location.coords.longitude,
        });

        if (addressArray && addressArray.length > 0) {
          const address = addressArray[0];
          const name = `${address.city || 'Unknown City'}`;
          setLocationName(name);
        } else {
          setLocationName('Location Unknown');
        }

        // Generate random weather data
        const { 
          currentWeather: mockWeather, 
          hourlyForecast: mockHourly, 
          minutelyForecast: mockMinutely,
          dailyForecast: mockDaily
        } = generateMockWeatherData();
        setCurrentWeather(mockWeather);
        setHourlyForecast(mockHourly);
        setMinutelyForecast(mockMinutely);
        setDailyForecast(mockDaily);

      } catch (fetchError: any) {
        console.error("Error during location fetch: ", fetchError);
        setError(fetchError.message || 'Failed to get location.');
        setLocationName('Error');
        // Generate random data even if location fails
        const { 
          currentWeather: mockWeather, 
          hourlyForecast: mockHourly, 
          minutelyForecast: mockMinutely,
          dailyForecast: mockDaily
        } = generateMockWeatherData();
        setCurrentWeather(mockWeather);
        setHourlyForecast(mockHourly);
        setMinutelyForecast(mockMinutely);
        setDailyForecast(mockDaily);
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, []); // Run on mount

  // Determine the permission status string for the component prop
  const permissionStatusString = permissionStatus === null ? 'undetermined' : permissionStatus;

  return (
    <View style={styles.container}>
      {isLoading ? (
        <Text style={styles.loadingText}>Loading Weather...</Text>
      ) : error ? (
        <Text style={styles.errorText}>{error}</Text>
      ) : (
        <CurrentWeather
          locationName={locationName}
          temperature={currentWeather.temperature}
          feelsLike={currentWeather.feelsLike}
          condition={currentWeather.condition}
          highTemp={currentWeather.highTemp}
          lowTemp={currentWeather.lowTemp}
          hourlyForecast={hourlyForecast}
          minutelyForecast={minutelyForecast} // Pass minutely forecast
          permissionStatus={permissionStatusString}
          dailyForecast={dailyForecast}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  loadingText: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    textAlign: 'center',
    fontSize: 18,
    marginTop: 50, // Add some margin
  },
  errorText: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    textAlign: 'center',
    fontSize: 18,
    color: 'red',
    marginTop: 50, // Add some margin
  },
});
