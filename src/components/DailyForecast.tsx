import React from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { format } from 'date-fns';
import { DailyForecastItem, WeatherCondition } from '../types';
import { getWeatherIcon } from '../utils/ui';

interface DailyForecastProps {
  forecast: DailyForecastItem[];
  textColor: string;
  onPress?: () => void;
}

export const DailyForecast: React.FC<DailyForecastProps> = ({ forecast, textColor, onPress }) => {
  const fadedTextColor = `${textColor}${textColor === '#FFFFFF' ? '99' : 'AA'}`;

  const dynamicStyles = StyleSheet.create({
    titleText: {
      color: textColor,
    },
    dayText: {
      color: textColor,
    },
    highTempText: {
      color: textColor,
    },
    lowTempText: {
      color: fadedTextColor,
    },
    itemText: {
      color: textColor,
    },
    buttonText: {
      color: textColor,
    },
  });

  return (
    <View style={styles.container}>
      <Text style={[styles.title, dynamicStyles.titleText]}>Next 5 Days</Text>
      <View style={styles.forecastList}>
        {(forecast || []).slice(0, 5).map((day, index) => (
          <View key={day.date.toString()} style={styles.dayRow}>
            <Text style={[styles.dayText, dynamicStyles.dayText]} numberOfLines={1} ellipsizeMode="tail">
              {index === 0 ? 'Today' : format(new Date(day.date), 'EEEE')}
            </Text>

            <View style={styles.iconContainer}>
              <Text style={styles.iconText}>
                {getWeatherIcon(day.condition)}
              </Text>
            </View>

            <Text style={[styles.highTemp, dynamicStyles.highTempText]}>{Math.round(day.highTemp)}°</Text>

            <Text style={[styles.lowTemp, dynamicStyles.lowTempText]}>{Math.round(day.lowTemp)}°</Text>
          </View>
        ))}
      </View>
      {onPress && (
        <Pressable style={styles.button} onPress={onPress}>
          <Text style={[styles.buttonText, dynamicStyles.buttonText]}>See 10-Day Forecast</Text>
        </Pressable>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginTop: 20,
    width: '100%',
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 15,
    paddingVertical: 15,
    paddingHorizontal: 15,
  },
  title: {
    fontSize: 14,
    fontWeight: 'bold',
    marginBottom: 15,
    fontFamily: 'SpaceGrotesk_700Bold',
  },
  forecastList: {
    gap: 15,
  },
  dayRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  dayText: {
    fontSize: 16,
    fontFamily: 'SpaceGrotesk_400Regular',
    width: 120,
    paddingRight: 5,
  },
  iconContainer: {
    width: 50,
    alignItems: 'center',
  },
  iconText: {
    fontSize: 24,
  },
  highTemp: {
    fontSize: 16,
    fontFamily: 'SpaceGrotesk_400Regular',
    width: 60,
    textAlign: 'right',
    paddingRight: 5,
  },
  lowTemp: {
    fontSize: 16,
    fontFamily: 'SpaceGrotesk_400Regular',
    width: 60,
    textAlign: 'right',
  },
  button: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 15,
    padding: 12,
    alignItems: 'center',
    marginTop: 20,
  },
  buttonText: {
    fontSize: 14,
    fontFamily: 'SpaceGrotesk_400Regular',
  },
});

export default DailyForecast;