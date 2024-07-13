import React, { useState, useEffect } from 'react';
import { View, ActivityIndicator } from 'react-native';
import RootStack from './navigator/RootStack';
import * as SecureStore from 'expo-secure-store';
import { NavigationContainer } from '@react-navigation/native';
import Welcome from './Screens/Welcome';

export default function App() {
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const checkAuthStatus = async () => {
      const token = await SecureStore.getItemAsync('accessToken');
      setIsAuthenticated(!!token);
      setIsLoading(false);
    };

    checkAuthStatus();
  }, []);

  if (isLoading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <NavigationContainer>
     
      <RootStack isAuthenticated={isAuthenticated} setIsAuthenticated={setIsAuthenticated} />
    </NavigationContainer>
  );
}
