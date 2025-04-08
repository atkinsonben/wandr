export interface Location {
  lat: number;
  lon: number;
}

// Updated WeatherData to reflect API structure and component needs
export interface WeatherData {
  temperature: number;
  feelsLike: number; // Added feels like temperature
  condition: string; // e.g., "Clouds", "Rain", "Clear"
  highTemp: number;
  lowTemp: number;
  // Removed icon, humidity, windSpeed, date, specific location name as it comes from geocoding
}

// Represents a single item in the hourly forecast list
export interface HourlyForecastItem {
  time: string; // e.g., "Now", "11 AM"
  temperature: number;
  condition: string; // e.g., "Clouds", "Rain"
  precipitationChance: number; // Percentage (0-100)
}

// Represents a single item in the minutely forecast list
export interface MinutelyForecastItem {
  dt: number; // Timestamp (Unix, UTC)
  precipitation: number; // Precipitation volume (mm/h)
}

// Represents a single item in the daily forecast list
export interface DailyForecastItem {
  date: string;
  highTemp: number;
  lowTemp: number;
  condition: string;
  precipitationChance: number;
}

// Interface for the combined data returned by the service
export interface WeatherApiResponse {
  currentWeather: WeatherData;
  hourlyForecast: HourlyForecastItem[];
  minutelyForecast: MinutelyForecastItem[];
  dailyForecast: DailyForecastItem[];
}

// Keep CalendarEvent if used elsewhere, otherwise remove if only for old mock data
export interface CalendarEvent {
  id: string;
  title: string;
  startDate: string;
  endDate: string;
  location: string;
}

// WeatherCondition type used in CurrentWeather gradients/icons
export type WeatherCondition = 
  | 'Clear' // Changed from Sunny
  | 'Clouds' // Changed from Cloudy
  | 'Rain' // Keep Rain
  | 'Snow' // Keep Snow
  | 'Thunderstorm' // Keep Thunderstorm
  | 'Drizzle' // Keep Drizzle
  | 'Mist' // Keep Mist
  | 'Smoke' // Keep Smoke
  | 'Haze' // Keep Haze
  | 'Dust' // Keep Dust
  | 'Fog' // Keep Fog
  | 'Sand' // Keep Sand
  | 'Ash' // Keep Ash
  | 'Squall' // Keep Squall
  | 'Tornado' // Keep Tornado
  | 'Unknown'; // Keep Unknown for default/error

// Forecast specific to a calendar event's date and location
export interface EventWeatherForecast {
  condition: WeatherCondition | null; // Use the existing WeatherCondition type
  temperature: number | null; // Temperature for the event time/day (could be high temp for the day)
  // Add high/low if needed based on design, but keep it simple for now
}

// Combined type for the list items, extending the existing CalendarEvent
export interface EventForecast extends CalendarEvent {
  forecast: EventWeatherForecast | null; // Forecast might be null if not available or error
}

// Type for the list state prop
export type ListState = 'loading' | 'empty' | 'error' | 'populated';

// Data structure for the daily weather card in the weekly view
export interface DailyWeatherCardData {
  id: string; // Use date string or a generated ID
  date: Date;
  dayName: string; // "Today", "Mon", "Tue", etc.
  location: string | null; // Location used for the forecast (event or inferred)
  forecast: EventWeatherForecast | null; // The weather forecast for that day/location
  isEventLocation: boolean; // True if the location came from a specific calendar event
}
