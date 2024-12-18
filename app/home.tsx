import { Ionicons } from "@expo/vector-icons";
import { BlurView } from "expo-blur";
import { Link } from "expo-router";
import React, { useRef, useState } from "react";
import {
  Animated,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

const HomePage = () => {
  const [menuVisible, setMenuVisible] = useState(false);
  const slideAnim = useRef(new Animated.Value(-300)).current;

  const toggleMenu = () => {
    if (menuVisible) {
      Animated.timing(slideAnim, {
        toValue: -300,
        duration: 300,
        useNativeDriver: true,
      }).start(() => setMenuVisible(false));
    } else {
      setMenuVisible(true);
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }).start();
    }
  };

  return (
    <View
      style={{
        flex: 1,
        backgroundColor: "#FFFFFF",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <TouchableOpacity
        style={{
          position: "absolute",
          top: 60,
          left: 20,
          zIndex: 3,
          backgroundColor: "#4A7C74",
          padding: 10,
          borderRadius: 5,
        }}
        onPress={toggleMenu}
      >
        <Ionicons name="arrow-forward" size={30} color="#fff" />
      </TouchableOpacity>

      <Image
        source={require("../assets/images/logo.png")}
        style={{ width: 300, height: 150, marginBottom: 50 }}
        resizeMode="contain"
      />

      {menuVisible && (
        <BlurView
          intensity={50}
          style={{
            position: "absolute",
            top: 0,
            bottom: 0,
            left: 0,
            right: 0,
            zIndex: 2,
            backgroundColor: "rgba(0, 0, 0, 0.8)",
          }}
        >
          <TouchableOpacity
            style={{ position: "absolute", width: "100%", height: "100%" }}
            onPress={toggleMenu}
          />
        </BlurView>
      )}

      <Animated.View
        style={[styles.sideMenu, { transform: [{ translateX: slideAnim }] }]}
      >
        <TouchableOpacity
          style={{
            alignSelf: "flex-end",
            top: 30,
            right: 20,
            backgroundColor: "#4A7C74",
            padding: 10,
            borderRadius: 5,
            marginBottom: 40,
          }}
          onPress={toggleMenu}
        >
          <Ionicons name="arrow-back" size={30} color="#fff" />
        </TouchableOpacity>

        <View style={{ marginTop: 20 }}>
          <Link
            style={{
              backgroundColor: "#AC415B",
              padding: 15,
              marginBottom: 10,
              justifyContent: "center",
            }}
            href="./"
            onPress={toggleMenu}
          >
            <Text style={{ fontSize: 18, color: "#FFF" }}>Sales</Text>
          </Link>
          <Link
            style={{
              backgroundColor: "#4A7C74",
              padding: 15,
              marginBottom: 10,
              justifyContent: "center",
            }}
            href="./data"
            onPress={toggleMenu}
          >
            <Text style={{ fontSize: 18, color: "#FFF" }}>Data</Text>
          </Link>
          <Link
            style={{
              backgroundColor: "#4A7C74",
              padding: 15,
              marginBottom: 10,
              justifyContent: "center",
            }}
            href="./stock"
            onPress={toggleMenu}
          >
            <Text style={{ fontSize: 18, color: "#FFF" }}>Stock</Text>
          </Link>
        </View>
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  sideMenu: {
    position: "absolute",
    top: 0,
    left: 0,
    bottom: 0,
    width: 300,
    backgroundColor: "#fff",
    zIndex: 3,
  },
});

export default HomePage;
