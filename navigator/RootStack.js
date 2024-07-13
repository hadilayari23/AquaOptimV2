import React, { useState, useEffect } from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { createDrawerNavigator } from '@react-navigation/drawer';
import Login from '../Screens/Login';
import Devices from '../Screens/Devices';
import Dashboard from '../Screens/Dashboard';
import Welcome from '../Screens/Welcome';
import SideBar from '../Screens/SideBar';
import {jwtDecode} from 'jwt-decode';
import { decode } from 'base-64';
import * as SecureStore from 'expo-secure-store';
import Report from '../Screens/Report'
global.atob = decode;

const Stack = createStackNavigator();
const Drawer = createDrawerNavigator();

const StackNavigator = ({ setIsAuthenticated, userRoles }) => (
  <Stack.Navigator>
    <Stack.Screen name="Dashboard" component={Dashboard} options={{ headerShown: false }} />
    <Stack.Screen name="Report" component={Report} options={{ headerShown: false }} />
    {userRoles.includes('admin') && (
      <Stack.Screen name="Devices" component={Devices} options={{ headerShown: false }} />
    )}
  </Stack.Navigator>
);

const RootNavigator = ({ isAuthenticated, setIsAuthenticated }) => {
  const [hasSeenWelcome, setHasSeenWelcome] = useState(false);
  const [userRoles, setUserRoles] = useState([]);

  useEffect(() => {
    const checkToken = async () => {
      if (isAuthenticated) {
        const token = await SecureStore.getItemAsync('accessToken'); // Retrieve the token from storage
        if (token) {
          const decodedToken = jwtDecode(token);
          const expirationTime = decodedToken.exp * 1000 - 60000; // 60 seconds before actual expiration
          setUserRoles(decodedToken.roles);

          const checkTokenExpiration = setInterval(() => {
            if (Date.now() >= expirationTime) {
              clearInterval(checkTokenExpiration);
              handleLogout();
            }
          }, 1000); // Check every second

          return () => clearInterval(checkTokenExpiration);
        }
      }
    };

    checkToken();
  }, [isAuthenticated]);

  const handleLogout = () => {
    SecureStore.deleteItemAsync('accessToken'); // Clear the token from storage
    setIsAuthenticated(false); // Update authentication state
  };

  if (!hasSeenWelcome) {
    return <Welcome onContinue={() => setHasSeenWelcome(true)} />;
  }

  if (!isAuthenticated) {
    return (
      <Stack.Navigator>
        <Stack.Screen name="Login" options={{ headerShown: false }}>
          {(props) => <Login {...props} setIsAuthenticated={setIsAuthenticated} />}
        </Stack.Screen>
      </Stack.Navigator>
    );
  }

  return (
    <Drawer.Navigator drawerContent={(props) => <SideBar {...props} setIsAuthenticated={setIsAuthenticated} />}>
      <Drawer.Screen name=" ">
        {(props) => <StackNavigator {...props} setIsAuthenticated={setIsAuthenticated} userRoles={userRoles} />}
      </Drawer.Screen>
    </Drawer.Navigator>
  );
};

export default RootNavigator;
