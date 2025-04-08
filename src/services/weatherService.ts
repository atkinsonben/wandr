import axios from 'axios';
import Constants from 'expo-constants';
import { format } from 'date-fns';
import { Location, WeatherApiResponse, HourlyForecastItem, WeatherData, MinutelyForecastItem } from '../types';

// Retrieve the API key from environment variables
const API_KEY = Constants.expoConfig?.extra?.OPENWEATHER_API_KEY;
const BASE_URL = 'https://api.openweathermap.org/data/3.0/onecall';

// Type guard to check if the API key exists
if (!API_KEY) {
  throw new Error('OpenWeatherMap API key is missing. Please set it in your .env file and app.json extra field.');
}

// Function to fetch and process weather data
export const getWeatherForecast = async (location: Location): Promise<WeatherApiResponse> => {
  try {
    const response = await axios.get(BASE_URL, {
      params: {
        lat: location.lat,
        lon: location.lon,
        appid: API_KEY,
        units: 'metric', // Use metric units (Celsius)
        exclude: 'alerts', // Only exclude alerts, we need minutely data
      },
    });

    const data = response.data;

    // --- Process Current Weather --- 
    const currentWeather: WeatherData = {
      temperature: Math.round(data.current.temp), // Round temperature
      condition: data.current.weather[0]?.main || 'Unknown', // e.g., Clouds, Rain
      feelsLike: Math.round(data.current.feels_like), // Add feels like temperature
      // Get high/low from the daily forecast for today (index 0)
      highTemp: data.daily[0] ? Math.round(data.daily[0].temp.max) : 0,
      lowTemp: data.daily[0] ? Math.round(data.daily[0].temp.min) : 0,
    };

    // --- Process Hourly Forecast (next 24 hours + Now) --- 
    const hourlyForecast: HourlyForecastItem[] = data.hourly
      .slice(0, 24) // Take the next 24 hours
      .map((hour: any) => {
        const dt = new Date(hour.dt * 1000); // Convert UNIX timestamp to Date
        return {
          // Format time: Check if it's the current hour approx, else format as 'h a'
          time: Math.abs(dt.getTime() - new Date().getTime()) < 3600000 / 2 ? 'Now' : format(dt, 'h a').toLowerCase(), 
          temperature: Math.round(hour.temp), // Round temperature
          condition: hour.weather[0]?.main || 'Unknown',
          precipitationChance: Math.round((hour.pop || 0) * 100), // Convert probability (0-1) to percentage (0-100)
        };
      });

    // Ensure "Now" is at the beginning if the first hour isn't exactly "Now"
    if (hourlyForecast.length > 0 && hourlyForecast[0].time !== 'Now'){
      // Add a "Now" entry based on current conditions if needed
      const nowEntry: HourlyForecastItem = { 
          time: 'Now',
          temperature: currentWeather.temperature,
          condition: currentWeather.condition,
          precipitationChance: Math.round((data.hourly[0]?.pop || 0) * 100)
      };
      hourlyForecast.unshift(nowEntry);
      hourlyForecast.pop(); // Remove the last element to keep the array size consistent (e.g., Now + 7 hours)
    }

    // --- Process Minutely Forecast ---
    const minutelyForecast: MinutelyForecastItem[] = data.minutely?.map((minute: any) => ({
      dt: minute.dt,
      precipitation: minute.precipitation,
    })) || [];

    return {
      currentWeather,
      hourlyForecast,
      minutelyForecast,
    };

  } catch (error: any) {
    console.error('Error fetching weather data from OpenWeatherMap:', error.response?.data || error.message);
    // Rethrow or return a default error structure
    throw new Error('Failed to fetch weather data.');
  }
};
