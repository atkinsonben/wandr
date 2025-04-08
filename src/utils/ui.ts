import { WeatherCondition } from '../types';

// Mapping from WeatherCondition type to a display icon (emoji)
export const getWeatherIcon = (condition: WeatherCondition | null): string => {
  if (!condition) return '❓'; // Default for null
  switch (condition) {
    case 'Clear': return '☀️';
    case 'Clouds': return '☁️';
    case 'Rain': return '🌧️';
    case 'Snow': return '❄️';
    case 'Thunderstorm': return '⛈️';
    case 'Drizzle': return '🌦️'; // Use similar icon to rain
    case 'Mist':
    case 'Smoke':
    case 'Haze':
    case 'Dust':
    case 'Fog':
    case 'Sand':
    case 'Ash': return '🌫️'; // Group fog-like conditions
    case 'Squall': return '🌬️'; // Windy icon
    case 'Tornado': return '🌪️';
    default: return '❓'; // Default for Unknown
  }
};

// Define gradient mappings using the WeatherCondition type
export const gradientColors: Record<WeatherCondition, readonly [string, string, ...string[]]> = {
  Clear: ['#479EEC', '#87CEEB'], // Sunny
  Clouds: ['#B0C4DE', '#778899'], // Cloudy
  Rain: ['#6495ED', '#4682B4'], // Rainy
  Snow: ['#ADD8E6', '#FFFFFF'], // Snowy
  Thunderstorm: ['#2F4F4F', '#708090'], // Stormy
  Drizzle: ['#87CEFA', '#B0C4DE'], // Light rain
  Mist: ['#D3D3D3', '#E0E0E0'], // Foggy
  Smoke: ['#A9A9A9', '#C0C0C0'], // Foggy
  Haze: ['#B0BEC5', '#CFD8DC'], // Foggy
  Dust: ['#D2B48C', '#BC8F8F'], // Foggy
  Fog: ['#BDBDBD', '#D3D3D3'], // Foggy
  Sand: ['#F4A460', '#D2B48C'], // Foggy
  Ash: ['#808080', '#A9A9A9'], // Foggy
  Squall: ['#778899', '#B0C4DE'], // Windy/Cloudy
  Tornado: ['#37474F', '#546E7A'], // Dark/Stormy
  Unknown: ['#757F9A', '#D7DDE8'], // Default/Unknown
};

// Define text colors
const lightTextColor = '#FFFFFF'; // White
const darkTextColor = '#333333'; // Dark Grey

// Conditions that require dark text due to light backgrounds
const lightBackgroundConditions: WeatherCondition[] = [
  'Snow', 'Mist', 'Smoke', 'Haze', 'Fog'
];

// Function to get appropriate text color based on weather condition
export const getTextColorForCondition = (condition: WeatherCondition | null): string => {
  if (condition && lightBackgroundConditions.includes(condition)) {
    return darkTextColor;
  }
  return lightTextColor;
};
