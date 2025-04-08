import React from 'react';
import { Tabs } from 'expo-router/tabs';
import { Ionicons } from '@expo/vector-icons';
// import { View, StyleSheet } from 'react-native'; // Temporarily unused

// Define colors (adjust as needed)
const activeTintColor = '#FFFFFF'; // White for active icon/label
const inactiveTintColor = '#AAAAAA'; // Grey for inactive icon/label
const tabBackgroundColor = '#222222'; // Use a solid, visible color for testing

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: activeTintColor,
        tabBarInactiveTintColor: inactiveTintColor,
        tabBarStyle: {
          backgroundColor: tabBackgroundColor, // Simple background color
          // Remove absolute positioning and other complex styles for now
          // position: 'absolute',
          borderTopWidth: 1, // Add a border to see it clearly
          borderTopColor: '#444',
          // height: 70,
          // paddingBottom: 10,
          // paddingTop: 5,
        },
        tabBarLabelStyle: {
          fontSize: 10,
          // marginTop: -5,
        },
        // Remove custom background component for now
        // tabBarBackground: () => (
        //   <View style={styles.tabBarBackground} />
        // ),
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Weather',
          tabBarIcon: ({ color, size, focused }) => (
            <Ionicons
              name={focused ? 'thunderstorm' : 'thunderstorm-outline'}
              size={size} // Use default size for now
              color={color}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="events"
        options={{
          title: 'Events',
          tabBarIcon: ({ color, size, focused }) => (
            <Ionicons
              name={focused ? 'calendar' : 'calendar-outline'}
              size={size} // Use default size for now
              color={color}
            />
          ),
        }}
      />
    </Tabs>
  );
}

/* // Temporarily removed styles
const styles = StyleSheet.create({
  // ...
});
*/ 