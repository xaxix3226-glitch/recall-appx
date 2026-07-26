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
import CardsScreen from './src/screens/CardsScreen';
import ProgressScreen from './src/screens/ProgressScreen';

import CreateScreen from './src/screens/CreateScreen';
import NewSubjectScreen from './src/screens/NewSubjectScreen';
import NewTopicScreen from './src/screens/NewTopicScreen';
import NewDeckScreen from './src/screens/NewDeckScreen';
import ManualCardScreen from './src/screens/ManualCardScreen';
import ImportTextScreen from './src/screens/ImportTextScreen';
import ImportPdfScreen from './src/screens/ImportPdfScreen';

import MoreScreen from './src/screens/MoreScreen';
import SettingsScreen from './src/screens/SettingsScreen';
import BackupScreen from './src/screens/BackupScreen';
import AccessibilityScreen from './src/screens/AccessibilityScreen';
import AboutScreen from './src/screens/AboutScreen';

import StudyBuilderScreen from './src/screens/StudyBuilderScreen';
import StudyScreen from './src/screens/StudyScreen';
import SessionCompleteScreen from './src/screens/SessionCompleteScreen';
import PlannerScreen from './src/screens/PlannerScreen';

import { initDatabase } from './src/database/db';

const Tab = createBottomTabNavigator();
const RootStack = createNativeStackNavigator();
const BrowseStack = createNativeStackNavigator();
const CreateStack = createNativeStackNavigator();
const MoreStack = createNativeStackNavigator();

const headerStyle = {
  headerStyle: { backgroundColor: '#121212' },
  headerTintColor: '#fff',
};

function BrowseStackNavigator() {
  return (
    <BrowseStack.Navigator screenOptions={headerStyle}>
      <BrowseStack.Screen name="BrowseHome" component={BrowseScreen} options={{ title: 'Browse' }} />
      <BrowseStack.Screen name="Topics" component={TopicsScreen} options={({ route }) => ({ title: route.params?.subjectName || 'Topics' })} />
      <BrowseStack.Screen name="Decks" component={DecksScreen} options={({ route }) => ({ title: route.params?.topicName || 'Decks' })} />
      <BrowseStack.Screen name="Cards" component={CardsScreen} options={({ route }) => ({ title: route.params?.deckName || 'Cards' })} />
    </BrowseStack.Navigator>
  );
}

function CreateStackNavigator() {
  return (
    <CreateStack.Navigator screenOptions={headerStyle}>
      <CreateStack.Screen name="CreateHome" component={CreateScreen} options={{ title: 'Create' }} />
      <CreateStack.Screen name="NewSubject" component={NewSubjectScreen} options={{ title: 'New Subject' }} />
      <CreateStack.Screen name="NewTopic" component={NewTopicScreen} options={{ title: 'New Topic' }} />
      <CreateStack.Screen name="NewDeck" component={NewDeckScreen} options={{ title: 'New Deck' }} />
      <CreateStack.Screen name="ManualCard" component={ManualCardScreen} options={{ title: 'New Flashcard' }} />
      <CreateStack.Screen name="ImportText" component={ImportTextScreen} options={{ title: 'Import Text' }} />
      <CreateStack.Screen name="ImportPdf" component={ImportPdfScreen} options={{ title: 'Import PDF' }} />
    </CreateStack.Navigator>
  );
}

function MoreStackNavigator() {
  return (
    <MoreStack.Navigator screenOptions={headerStyle}>
      <MoreStack.Screen name="MoreHome" component={MoreScreen} options={{ title: 'More' }} />
      <MoreStack.Screen name="Settings" component={SettingsScreen} options={{ title: 'Settings' }} />
      <MoreStack.Screen name="Backup" component={BackupScreen} options={{ title: 'Backup' }} />
      <MoreStack.Screen name="Accessibility" component={AccessibilityScreen} options={{ title: 'Accessibility' }} />
      <MoreStack.Screen name="About" component={AboutScreen} options={{ title: 'About' }} />
    </MoreStack.Navigator>
  );
}

function MainTabs() {
  return (
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
      <Tab.Screen name="Browse" component={BrowseStackNavigator} options={{ headerShown: false }} />
      <Tab.Screen name="Create" component={CreateStackNavigator} options={{ headerShown: false }} />
      <Tab.Screen name="Progress" component={ProgressScreen} />
      <Tab.Screen name="More" component={MoreStackNavigator} options={{ headerShown: false }} />
    </Tab.Navigator>
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
          <RootStack.Navigator screenOptions={headerStyle}>
            <RootStack.Screen name="MainTabs" component={MainTabs} options={{ headerShown: false }} />
            <RootStack.Screen name="StudyBuilder" component={StudyBuilderScreen} options={{ title: 'Study Builder' }} />
            <RootStack.Screen name="Study" component={StudyScreen} options={{ headerShown: false, presentation: 'fullScreenModal' }} />
            <RootStack.Screen name="SessionComplete" component={SessionCompleteScreen} options={{ headerShown: false }} />
            <RootStack.Screen name="Planner" component={PlannerScreen} options={{ title: 'Planner' }} />
          </RootStack.Navigator>
        </NavigationContainer>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}
