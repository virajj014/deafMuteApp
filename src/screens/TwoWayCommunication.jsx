import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import { View, Text, StyleSheet, Platform } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import Human from './Human';
import Abled from './Abled';

const Tab = createMaterialTopTabNavigator();

const TwoWayCommunication = () => {
  return (
      <Tab.Navigator
        screenOptions={{
          tabBarActiveTintColor: '#4a69bd',
          tabBarInactiveTintColor: '#95a5a6',
          tabBarIndicatorStyle: {
            backgroundColor: '#4a69bd',
            height: 3,
          },
          tabBarLabelStyle: {
            fontSize: 14,
            fontWeight: 'bold',
            textTransform: 'none',
          },
          tabBarStyle: {
            backgroundColor: '#ffffff',
            elevation: 5,
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.1,
            shadowRadius: 4,
          },
          tabBarItemStyle: {
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'center',
          },
        }}
      >
        <Tab.Screen 
          name="Human" 
          component={Human} 
          options={{
            tabBarLabel: 'Human',
            tabBarIcon: ({ color }) => (
              <Icon name="person" size={22} color={color} style={styles.icon} />
            ),
          }}
        />
        <Tab.Screen 
          name="Abled" 
          component={Abled} 
          options={{
            tabBarLabel: 'Abled',
            tabBarIcon: ({ color }) => (
              <Icon name="accessibility" size={22} color={color} style={styles.icon} />
            ),
          }}
        />
      </Tab.Navigator>
  );
};

const styles = StyleSheet.create({
  icon: {
    marginRight: 5,
  },
  tabBarLabelContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
});

export default TwoWayCommunication;