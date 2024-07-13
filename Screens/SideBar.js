import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { useNavigation } from '@react-navigation/native';
import * as SecureStore from 'expo-secure-store';
import {jwtDecode }from 'jwt-decode'; // corrected import
import { decode } from 'base-64';

global.atob = decode;

const SideBar = ({ setIsAuthenticated }) => {
  const navigation = useNavigation();
  const [userRoles, setUserRoles] = useState([]);

  useEffect(() => {
    const fetchUserRoles = async () => {
      try {
        const token = await SecureStore.getItemAsync('accessToken');
        if (token) {
          const decodedToken = jwtDecode(token);
          setUserRoles(decodedToken.roles);
        }
      } catch (error) {
        console.error('Error fetching user roles:', error);
      }
    };

    fetchUserRoles();
  }, []);

  const navigateToScreen = (screen) => {
    navigation.navigate(screen);
  };

  const handleLogout = async () => {
    try {
      await SecureStore.deleteItemAsync('accessToken');
      setIsAuthenticated(false);
    } catch (error) {
      console.error('Error during logout:', error);
    }
  };

  return (
    <View style={styles.container}>
      <Image source={require("../assets/logo.png")} style={styles.logo} />
      <TouchableOpacity style={styles.menuItem} onPress={() => navigateToScreen('Dashboard')}>
        <Icon name="home" size={24} color="rgb(2 132 199)" />
        <Text style={styles.menuItemText}>Dashboard</Text>
      </TouchableOpacity>
      {userRoles.includes('admin') && (
        <TouchableOpacity style={styles.menuItem} onPress={() => navigateToScreen('Devices')}>
          <Icon name="access-point" size={24} color="rgb(2 132 199)" />
          <Text style={styles.menuItemText}>Devices</Text>
        </TouchableOpacity>
      )}
      {!userRoles.includes('superadmin') && (
        <TouchableOpacity style={styles.menuItem} onPress={() => navigateToScreen('Report')}>
          <Icon name="file-sign" size={24} color="rgb(2 132 199)" />
          <Text style={styles.menuItemText}>Report</Text>
        </TouchableOpacity>
      )}
      <TouchableOpacity style={styles.menuItem} onPress={handleLogout}>
        <Icon name="logout" size={24} color="rgb(2 132 199)" />
        <Text style={styles.menuItemText}>Logout</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    paddingTop: 50,
    paddingHorizontal: 20,
  },
  logo: {
    width: 220, // Adjust width and height as needed
    height: 80,
    marginBottom: 10,
    marginTop: -30,
    tintColor: 'rgb(2 132 199)',
    

  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: 'rgb(2 132 199)',
  },
  menuItemText: {
    marginLeft: 20,
    fontSize: 18,
    color: "rgb(2 132 199)",
  },
});

export default SideBar;
