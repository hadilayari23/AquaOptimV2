import React, { useEffect } from 'react';
import { View, Text, Image } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import AsyncStorage from '@react-native-async-storage/async-storage';
import COLORS from '../Constants/Colors';


const Welcome = ({ onContinue }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onContinue();
    }, 5000);
    return () => clearTimeout(timer); // Cleanup the timer on component unmount
  }, [onContinue]);

  return (
    <LinearGradient style={{ flex: 1 }} colors={[COLORS.secondary, COLORS.primary]}>
      <View>
        <Image
          source={require("../assets/1.png")}
          style={{
            height: 100,
            width: 100,
            position: 'absolute',
            top: 10,
            transform: [{ translateX: 20 }, { translateY: 50 }, { rotate: "-15deg" }]
          }}
        />
        <Image
          source={require("../assets/2.png")}
          style={{
            height: 100,
            width: 100,
            position: 'absolute',
            top: -30,
            left: 100,
            transform: [{ translateX: 50 }, { translateY: 50 }, { rotate: "-5deg" }]
          }}
        />
        <Image
          source={require("../assets/3.png")}
          style={{
            height: 100,
            width: 100,
            position: 'absolute',
            top: 130,
            left: -50,
            transform: [{ translateX: 50 }, { translateY: 50 }, { rotate: "15deg" }]
          }}
        />
        <Image 
          source={require("../assets/4.png")}
          style={{
            height: 200,
            width: 200,
            position: 'absolute',
            top: 110,
            left: 100,
            transform: [{ translateX: 50 }, { translateY: 50 }, { rotate: "-15deg" }]
          }}
        />
      </View>
      {/* Content */}
      <View style={{ paddingHorizontal: 22, position: "absolute", top: 450, width: "100%" }}>
        <Text style={{ fontSize: 50, fontWeight: '800', color: COLORS.white }}>Let's Get</Text>
        <Text style={{ fontSize: 46, fontWeight: '800', color: COLORS.white }}>Started</Text>
        <View style={{ marginVertical: 22 }}>
          <Text style={{ fontSize: 16, color: COLORS.white, marginVertical: 4 }}>Welcome to the Future of Sustainable Aquaculture</Text>
          <Text style={{ fontSize: 16, color: COLORS.white }}>Smart Solutions for Healthier Oceans and Abundant Harvests.</Text>
        </View>
        {/* Navigation Button (commented out for automatic navigation after 2 seconds) */}
        {/* <Button
          title="Join Now"
          onPress={() => navigation.navigate("Login")}
          style={{ marginTop: 22, width: "100%" }}
        /> */}
        {/* <View style={{ flexDirection: "row", marginTop: 12, justifyContent: "center" }}>
        </View> */}
      </View>
    </LinearGradient>
  );
}

export default Welcome;
