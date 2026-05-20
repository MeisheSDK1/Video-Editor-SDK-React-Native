import React, {Component} from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {
  SafeAreaProvider,
  useSafeAreaInsets,
} from 'react-native-safe-area-context';

import NvVideoResultComponent from './NvVideoResultComponent';
import NvDraftListComponent from './NvDraftListComponent';
import NvVideoPlayerPreView from './NvVideoPlayerPreView';
import HomeScreen from './HomeScreen';
import {I18n} from './language/I18n';

// enableScreens(false);
const Stack = createNativeStackNavigator();

function AppStack() {
  return (
    <SafeAreaProvider>
      <NavigationContainer>
        <Stack.Navigator
          screenOptions={{
            headerStyle: {
              backgroundColor: '#121212',
            },
            headerTintColor: '#fff',
            headerBackTitleVisible: false,
            headerShadowVisible: false,
            headerTitleStyle: {
              fontWeight: 'bold',
            },
          }}
          initialRouteName="Home">
          <Stack.Screen
            name="Home"
            component={HomeScreen}
            options={{
              headerShown: false,
            }}
          />
          <Stack.Screen
            name="DraftList"
            component={NvDraftListComponent}
            options={{
              headerShown: true,
              headerTitle: I18n.t('Draft'),
            }}
          />
          <Stack.Screen
            name="VideoResult"
            component={NvVideoResultComponent}
            options={{
              headerShown: true,
              headerTitle: I18n.t('Publish'),
            }}
          />
          <Stack.Screen
            name="VideoPlayPreView"
            component={NvVideoPlayerPreView}
            options={{
              headerShown: true,
              headerTitle: I18n.t('Preview'),
            }}
          />
        </Stack.Navigator>
      </NavigationContainer>
    </SafeAreaProvider>
  );
}

export default AppStack;
