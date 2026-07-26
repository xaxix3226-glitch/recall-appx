import React from 'react';
import { StatusBar } from 'expo-status-bar';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

import HomeScreen from './src/screens/HomeScreen';
import BrowseScreen from './src/screens/BrowseScreen';
import TopicsScreen from './src/screens/TopicsScreen';
import DecksScreen from './src/screens/DecksScreen';
import CreateScreen from './src/screens/CreateScreen';
import ProgressScreen from './src/screens/ProgressScreen';
import MoreScreen from './src/screens/MoreScreen';

import { initDatabase } from './src/database/db';

const Tab = createBottomTabNavigator();
const BrowseStack = createNativeStackNavigator();

const screenStyles = {
  headerStyle: { backgroundColor: '#121212' },
  headerTintColor: '#fff',
};

function BrowseStackNavigator() {
  return (
    <BrowseStack.Navigator screenOptions={screenStyles}>
      <BrowseStack.Screen
        name="BrowseHome"
        component={BrowseScreen}
        options={{ title: 'Browse' }}
      />
      <BrowseStack.Screen
        name="Topics"
        component={TopicsScreen}
        options={({ route }) => ({ title: route.params?.subjectName || 'Topics' })}
      />
      <BrowseStack.Screen
        name="Decks"
        component={DecksScreen}
        options={({ route }) => ({ title: route.params?.topicName || 'Decks' })}
      />
    </BrowseStack.Navigator>
  );
}

export default function App() {
  React.useEffect(() => {
    initDatabase();
  }, []);

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider>
        <NavigationContainer>
          <StatusBar style="light" />
          <Tab.Navigator
            screenOptions={{
              headerStyle: { backgroundColor: '#121212' },
              headerTintColor: '#fff',
              tabBarStyle: { backgroundColor: '#1a1a1a' },
              tabBarActiveTintColor: '#4A90D9',
              tabBarInactiveTintColor: '#888',
            }}
          >
            <Tab.Screen name="Home" component={HomeScreen} />
            <Tab.Screen
              name="Browse"
              component={BrowseStackNavigator}
              options={{ headerShown: false }}
            />
            <Tab.Screen name="Create" component={CreateScreen} />
            <Tab.Screen name="Progress" component={ProgressScreen} />
            <Tab.Screen name="More" component={MoreScreen} />
          </Tab.Navigator>
        </NavigationContainer>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
              }
