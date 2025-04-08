import React from 'react';
import { View, Text, StyleSheet, Dimensions } from 'react-native';
import { MinutelyForecastItem } from '../types';
import { format } from 'date-fns';
import { LineChart } from 'react-native-chart-kit';

interface MinutelyForecastProps {
  forecast: MinutelyForecastItem[];
  textColor: string;
}

// Constants
const screenWidth = Dimensions.get('window').width - 50; // Full width minus container padding and margins
const chartHeight = 75;

// Tooltip state
interface TooltipData {
  visible: boolean;
  x: number; // Position relative to the chart container
  y: number; // Position relative to the chart container
  time: string;
  precipitation: number;
}

const MinutelyForecast: React.FC<MinutelyForecastProps> = ({ forecast, textColor }) => {
  if (!forecast || forecast.length === 0) {
    return null; // Don't render if no data
  }

  // Filter data for the next 60 minutes
  const nextHourForecast = forecast.slice(0, 61);

  // Determine the maximum precipitation value for scaling the bars
  const maxPrecipitation = Math.max(...nextHourForecast.map(item => item.precipitation), 0.1);

  // Find when rain starts and ends
  const rainStartIndex = nextHourForecast.findIndex(item => item.precipitation > 0);
  const rainEndIndex = rainStartIndex >= 0 
    ? nextHourForecast.slice(rainStartIndex).findIndex(item => item.precipitation === 0) + rainStartIndex
    : -1;

  // Calculate rain duration and start time
  const hasPrecipitation = rainStartIndex >= 0;
  let precipitationSummary = "No precipitation expected in the next hour.";
  
  if (hasPrecipitation) {
    const rainDuration = rainEndIndex > rainStartIndex ? rainEndIndex - rainStartIndex : nextHourForecast.length - rainStartIndex;
    const startInMinutes = rainStartIndex;
    
    if (startInMinutes === 0) {
      precipitationSummary = `Rain now for ${rainDuration} minutes`;
    } else {
      precipitationSummary = `Rain starting in ${startInMinutes} minutes, lasting ${rainDuration} minutes`;
    }
  }

  // Create a faded version for summary text
  const fadedTextColor = `${textColor}${textColor === '#FFFFFF' ? 'CC' : '99'}`;

  // Define dynamic styles
  const dynamicStyles = StyleSheet.create({
      titleText: {
          color: textColor,
      },
      summaryText: {
          color: fadedTextColor, // Use faded color for summary
      },
      chartLabelColor: { // Style for chart labels
          color: fadedTextColor, // Use faded color for labels
      }
  });

  return (
    <View style={styles.container}>
      <Text style={[styles.title, dynamicStyles.titleText]}>Next Hour Forecast</Text>
      <Text style={[styles.summary, dynamicStyles.summaryText]}>{precipitationSummary}</Text>
      {hasPrecipitation && (
        <View style={styles.chartArea}>
          <LineChart
            data={{
              labels: ['now', '15m', '30m', '45m', '60m'],
              datasets: [{
                data: nextHourForecast.map(item => item.precipitation),
                strokeWidth: 2
              }]
            }}
            width={screenWidth}
            height={chartHeight}
            chartConfig={{
              backgroundGradientFromOpacity: 0,
              backgroundGradientToOpacity: 0,
              decimalPlaces: 1,
              color: (opacity = 1) => textColor === '#FFFFFF' ? `rgba(255, 255, 255, ${opacity})` : `rgba(51, 51, 51, ${opacity})`,
              labelColor: (opacity = 1) => textColor === '#FFFFFF' ? `rgba(255, 255, 255, ${opacity * 0.8})` : `rgba(51, 51, 51, ${opacity * 0.8})`,
              strokeWidth: 2,
              fillShadowGradientFrom: textColor === '#FFFFFF' ? 'rgba(255, 255, 255, 0.2)' : 'rgba(51, 51, 51, 0.2)',
              fillShadowGradientTo: 'rgba(0, 0, 0, 0)',
              propsForDots: {
                r: '0'
              },
              propsForLabels: {
                fontSize: 10,
                fontFamily: 'SpaceGrotesk_400Regular',
              },
              propsForVerticalLabels: {
                fontSize: 10,
                fontFamily: 'SpaceGrotesk_400Regular'
              },
              count: 3
            }}
            withDots={false}
            bezier
            style={styles.chart}
            withVerticalLabels={true}
            withHorizontalLabels={true}
            withHorizontalLines={true}
            segments={2}
            withVerticalLines={false}
            fromZero={true}
            yAxisInterval={1}
            formatYLabel={(yValue: string) => {
              const value = parseFloat(yValue);
              const normalizedValue = value / maxPrecipitation;
              if (normalizedValue <= 0.33) return 'Light';
              if (normalizedValue <= 0.66) return 'Moderate';
              return 'Heavy';
            }}
          />
        </View>
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
    marginBottom: 5,
    paddingHorizontal: 5,
    fontFamily: 'SpaceGrotesk_700Bold',
  },
  subtitle: {
    fontSize: 20,
    color: '#ffffff',
    marginBottom: 5,
    paddingHorizontal: 5,
    fontFamily: 'SpaceGrotesk_400Regular',
  },
  time: {
    fontSize: 20,
    color: '#ffffff',
    marginBottom: 20,
    paddingHorizontal: 20,
    fontFamily: 'SpaceGrotesk_400Regular',
    opacity: 0.8,
  },
  summary: {
    fontSize: 12,
    marginBottom: 10,
    paddingHorizontal: 5,
    fontFamily: 'SpaceGrotesk_400Regular',
  },
  chartArea: {
    alignItems: 'center',
    marginBottom: 8,
    width: '100%',
  },
  chart: {
    marginVertical: 8,
    borderRadius: 16,
  },
  intensityLegend: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 15,
    padding: 2,
    marginTop: 20,
    marginHorizontal: 20,
  },
  intensityItem: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 8,
  },
  intensityText: {
    color: '#ffffff',
    fontSize: 16,
    fontFamily: 'SpaceGrotesk_400Regular',
  },

});

export default MinutelyForecast;
