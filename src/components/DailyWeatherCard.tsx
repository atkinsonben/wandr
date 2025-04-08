import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { DailyWeatherCardData, WeatherCondition } from '../types';
import { getWeatherIcon, gradientColors, getTextColorForCondition } from '../utils/ui';
import { LinearGradient } from 'expo-linear-gradient';
import { useFonts, SpaceGrotesk_400Regular, SpaceGrotesk_700Bold } from '@expo-google-fonts/space-grotesk';
import { Ionicons } from '@expo/vector-icons';

interface DailyWeatherCardProps {
  data: DailyWeatherCardData;
}

// Define a default gradient for fallback cases
const defaultCardGradient = ['#A9A9A9', '#808080']; // Greyish default

const DailyWeatherCard: React.FC<DailyWeatherCardProps> = ({ data }) => {
  const [fontsLoaded] = useFonts({
    SpaceGrotesk_400Regular,
    SpaceGrotesk_700Bold,
  });

  if (!fontsLoaded) {
    return null;
  }

  // 1. Determine the condition for this card
  const cardCondition = data.forecast?.condition ?? 'Unknown';

  // 2. Determine the gradient based on the card's condition
  const cardGradientColors = gradientColors[cardCondition as WeatherCondition] ?? defaultCardGradient;

  // 3. Determine the TEXT COLOR based on the card's condition
  const cardTextColor = getTextColorForCondition(cardCondition as WeatherCondition);

  // Determine icon based on location source
  const locationIconName: keyof typeof Ionicons.glyphMap = data.isEventLocation ? "calendar-outline" : "location-outline";
  // Style based on location source
  const locationStyle = data.isEventLocation ? styles.eventLocationText : styles.currentLocationText;
  const locationIconColor = data.isEventLocation ? cardTextColor : `${cardTextColor}${cardTextColor === '#FFFFFF' ? 'AA' : '88'}`;

  // Dynamic styles
  const dynamicStyles = StyleSheet.create({
    text: {
      color: cardTextColor,
    },
    secondaryText: {
      color: `${cardTextColor}${cardTextColor === '#FFFFFF' ? 'AA' : '88'}`, // Faded
    },
    locationIcon: { color: locationIconColor }, // Apply specific color to icon
  });

  return (
    <LinearGradient
      colors={cardGradientColors}
      style={styles.cardContainer}
    >
      {/* Left Side: Day and Location */}
      <View style={styles.infoContainer}>
        <Text style={[styles.dayText, dynamicStyles.text]}>{data.dayName}</Text>
        {/* Display location row only if data.location is not null/empty */}
        {data.location ? (
             <View style={styles.locationRow}>
                 <Ionicons name={locationIconName} size={12} style={[styles.locationIconBase, dynamicStyles.locationIcon]} />
                 <Text style={[styles.locationTextBase, locationStyle, dynamicStyles.secondaryText]} numberOfLines={1} ellipsizeMode="tail">
                     {/* Location text already contains indicator if needed */}
                     {data.location}
                </Text>
            </View>
        ) : (
            // Optional: Render something if location is truly null (e.g., "No location info")
             <View style={styles.locationRow}>
                 <Ionicons name="help-circle-outline" size={12} style={[styles.locationIconBase, dynamicStyles.secondaryText]} />
                 <Text style={[styles.locationTextBase, styles.noLocationText, dynamicStyles.secondaryText]}>
                     No location found
                </Text>
            </View>
        )}
      </View>

      {/* Right Side: Forecast */}
      <View style={styles.forecastContainer}>
        {data.forecast ? (
          <>
            <Text style={styles.iconText}>{getWeatherIcon(data.forecast.condition)}</Text>
            <Text style={[styles.tempText, dynamicStyles.text]}>
              {data.forecast.temperature !== null ? `${Math.round(data.forecast.temperature)}°` : '--'}
            </Text>
          </>
        ) : (
          <Text style={[styles.tempText, dynamicStyles.secondaryText]}>...</Text> // Loading/Error state
        )}
      </View>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  cardContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderRadius: 10,
    paddingVertical: 15,
    paddingHorizontal: 15,
    marginBottom: 10,
    overflow: 'hidden',
  },
  infoContainer: {
    flex: 1,
    marginRight: 10,
    backgroundColor: 'transparent',
  },
  dayText: {
    fontFamily: 'SpaceGrotesk_700Bold',
    fontSize: 16,
    marginBottom: 4,
  },
  locationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'transparent',
  },
  locationIconBase: {
      marginRight: 4,
  },
  locationTextBase: {
      fontFamily: 'SpaceGrotesk_400Regular',
      fontSize: 12,
  },
  // Specific styles for location types
  eventLocationText: {
      fontWeight: 'bold',
  },
  currentLocationText: {
      fontStyle: 'italic',
  },
   noLocationText: {
      fontStyle: 'italic',
  },
  forecastContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    minWidth: 70,
    justifyContent: 'flex-end',
    backgroundColor: 'transparent',
  },
  iconText: {
    fontSize: 26,
    marginRight: 8,
  },
  tempText: {
    fontFamily: 'SpaceGrotesk_700Bold',
    fontSize: 18,
  },
});

export default DailyWeatherCard; 