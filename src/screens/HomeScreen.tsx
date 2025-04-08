import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, ActivityIndicator } from 'react-native';
import { format } from 'date-fns';
import { WeatherData, CalendarEvent } from '../types';
import { fetchCalendarEvents } from '../services/calendarService';
import { getWeatherForecast } from '../services/weatherService';

export const HomeScreen = () => {
  const [loading, setLoading] = useState(true);
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const [weatherData, setWeatherData] = useState<Record<string, WeatherData>>({});

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const startDate = new Date();
      const endDate = new Date();
      endDate.setDate(endDate.getDate() + 7); // Get events for the next 7 days

      const calendarEvents = await fetchCalendarEvents(startDate, endDate);
      setEvents(calendarEvents);

      // Fetch weather for each unique location
      const weatherPromises = calendarEvents
        .filter(event => event.location)
        .map(async event => {
          // This is a placeholder - you'll need to implement location to coordinates conversion
          const location = { name: event.location!, lat: 0, lon: 0 };
          const weather = await getWeatherForecast(location);
          return { [event.location!]: weather };
        });

      const weatherResults = await Promise.all(weatherPromises);
      const weatherMap = weatherResults.reduce((acc, curr) => ({ ...acc, ...curr }), {});
      setWeatherData(weatherMap);
    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      {events.map(event => (
        <View key={event.id} style={styles.eventCard}>
          <Text style={styles.eventTitle}>{event.title}</Text>
          <Text style={styles.eventDate}>
            {format(new Date(event.startDate), 'MMM dd, yyyy')}
          </Text>
          {event.location && weatherData[event.location] && (
            <View style={styles.weatherInfo}>
              <Text style={styles.weatherText}>
                {weatherData[event.location].temperature}°C
              </Text>
              <Text style={styles.weatherText}>
                {weatherData[event.location].condition}
              </Text>
            </View>
          )}
        </View>
      ))}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  eventCard: {
    backgroundColor: 'white',
    margin: 10,
    padding: 15,
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  eventTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  eventDate: {
    fontSize: 14,
    color: '#666',
    marginBottom: 10,
  },
  weatherInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: '#f0f0f0',
    padding: 10,
    borderRadius: 5,
  },
  weatherText: {
    fontSize: 14,
    color: '#333',
  },
});
