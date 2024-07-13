import React, { useState } from 'react';
import { Text, View, Image, StatusBar, TextInput, TouchableOpacity, Alert } from 'react-native';
import axios from 'axios';
import * as SecureStore from 'expo-secure-store';

const Login = ({ navigation, setIsAuthenticated }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const config = {
    headers: {
      'Content-Type': 'application/json',
    },
  };

  const login = async () => {
    try {
      const response = await axios.post('http://192.168.1.17:3000/auth/signin', {
        email,
        pass: password,
      }, config);

      if (response.data.data.accessToken) {
        await SecureStore.setItemAsync('accessToken', response.data.data.accessToken);
        setIsAuthenticated(true);
      }
    } catch (error) {
      showAlert(error.response?.data?.error?.message || 'An unexpected error occurred');
    }
  };

  const showAlert = (message) => {
    Alert.alert(
      'Login Error',
      message,
      [{ text: 'OK', onPress: () => console.log('OK Pressed') }],
      { cancelable: false }
    );
  };

  return (
    <View style={{ flex: 1, backgroundColor: 'white' }}>
      <StatusBar barStyle="light-content" />
      <Image
        source={require('../assets/background1.png')}
        style={{ position: 'absolute', height: '100%', width: '100%' }}
      />

      <View style={{ flex: 1, justifyContent: 'space-around', paddingTop: 160, paddingBottom: 40 }}>
        <View style={{ position: 'absolute', top: '50%', left: '50%', transform: [{ translateX: -50 }, { translateY: -50 }] }}>
          <Text style={{ textAlign: 'center', fontSize: 32, color: 'white', fontWeight: 'bold' }}>Login</Text>
        </View>

        <View style={{ marginHorizontal: 20, marginTop: 120 }}>
          <View style={{ backgroundColor: 'rgba(0,0,0,0.1)', padding: 16, borderRadius: 20, marginBottom: 10 }}>
            <TextInput
              placeholder='Email'
              placeholderTextColor='black'
              value={email}
              onChangeText={setEmail}
              style={{ color: 'black' }}
            />
          </View>
          <View style={{ backgroundColor: 'rgba(0,0,0,0.1)', padding: 16, borderRadius: 20, marginBottom: 10 }}>
            <TextInput
              secureTextEntry
              placeholder='Password'
              placeholderTextColor='black'
              value={password}
              onChangeText={setPassword}
              style={{ color: 'black' }}
            />
          </View>
          <TouchableOpacity
            onPress={login}
            style={{ backgroundColor: 'rgb(2 132 199)', padding: 16, borderRadius: 20, marginBottom: 10 }}
          >
            <Text style={{ textAlign: 'center', color: 'white', fontSize: 20, fontWeight: 'bold' }}>Login</Text>
          </TouchableOpacity>
          <View style={{ flexDirection: 'row', justifyContent: 'center' }}>
            <Text>Welcome Back! Dive into Your Smart Aquaculture Dashboard</Text>
          </View>
        </View>
      </View>
    </View>
  );
};

export default Login;
