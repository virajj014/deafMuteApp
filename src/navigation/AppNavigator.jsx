import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { createStackNavigator } from "@react-navigation/stack";
import { NavigationContainer } from "@react-navigation/native";
import TwoWayCommunication from "../screens/TwoWayCommunication";
import Ionicons from 'react-native-vector-icons/Ionicons';
import { SafeAreaView } from "react-native-safe-area-context";
import { StyleSheet } from "react-native";
import AllCoursePage from "../screens/AllCoursePage";
import CourseLessons from "../screens/CourseLessons"; // Create this new file
import VideoPlayer from "../screens/VideoPlayer";

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

// Create a stack navigator for Courses tab
function CoursesStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="AllCourses" component={AllCoursePage} />
      <Stack.Screen name="CourseLessons" component={CourseLessons} />
      <Stack.Screen name="VideoPlayer" component={VideoPlayer} />
    </Stack.Navigator>
  );
}

const AppNavigator = () => {
  return (
    <SafeAreaView style={styles.container}>
      <NavigationContainer>
        <Tab.Navigator
          screenOptions={({ route }) => ({
            tabBarIcon: ({ color, size }) => {
              let iconName;
              if (route.name === "TwoWay Communication") {
                iconName = "chatbubbles-outline";
              } else if (route.name === "Courses") {
                iconName = "book-outline";
              }
              return <Ionicons name={iconName} size={size} color={color} />;
            },
            tabBarActiveTintColor: "#007AFF",
            tabBarInactiveTintColor: "gray",
            headerShown: false,
          })}
        >
          <Tab.Screen name="TwoWay Communication" component={TwoWayCommunication} />
          <Tab.Screen name="Courses" component={CoursesStack} />
        </Tab.Navigator>
      </NavigationContainer>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  tabLabel: {
    fontSize: 12,
    marginTop: 4,
    fontWeight: '500',
  },
});

export default AppNavigator;