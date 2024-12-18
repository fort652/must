import { LinearGradient } from "expo-linear-gradient";
import React, { useEffect, useRef } from "react";
import { Animated, Text, TouchableOpacity, View } from "react-native";

import formatCategoryName from "./formatCategoryName";

const ProductSection = ({
  categoryName,
  items,
  handleIncrement,
  handleDecrement,
  handleGiftDecrement,
  categoryKey,
}: any) => {
  // Create a ref to store the Animated.Values for shake animations
  const shakeAnimations = useRef<{ [key: string]: Animated.Value }>({});

  // Initialize the Animated.Values for each item
  useEffect(() => {
    Object.keys(items).forEach((key) => {
      if (!shakeAnimations.current[key]) {
        shakeAnimations.current[key] = new Animated.Value(0);
      }
    });
  }, [items]);

  const shakeItem = (key: string) => {
    const animation = shakeAnimations.current[key];
    Animated.sequence([
      Animated.timing(animation, {
        toValue: 10,
        duration: 50,
        useNativeDriver: true,
      }),
      Animated.timing(animation, {
        toValue: -10,
        duration: 50,
        useNativeDriver: true,
      }),
      Animated.timing(animation, {
        toValue: 10,
        duration: 50,
        useNativeDriver: true,
      }),
      Animated.timing(animation, {
        toValue: -10,
        duration: 50,
        useNativeDriver: true,
      }),
      Animated.timing(animation, {
        toValue: 0,
        duration: 50,
        useNativeDriver: true,
      }),
    ]).start();
  };

  return (
    <View style={{ marginBottom: 20, backgroundColor: "#f5f5f5" }}>
      <View
        style={{
          backgroundColor: "#6CA295",
          padding: 10,
          marginBottom: 10,
          borderWidth: 2,
        }}
      >
        <Text
          style={{
            fontSize: 20,
            fontWeight: "bold",
            textAlign: "center",
            color: "#fff",
          }}
        >
          {formatCategoryName(categoryName)}
        </Text>
      </View>

      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-evenly",
          marginVertical: 10,
          flexWrap: "wrap", // Adjust if items overflow
        }}
      >
        {Object.keys(items).map((key) => {
          const item = items[key];
          const availableStock = item.available; // Ensure 'available' is part of item
          const totalSelected = item.count + item.gift;

          const shakeAnim = shakeAnimations.current[key];

          return (
            <Animated.View
              key={key}
              style={{
                marginHorizontal: 5,
                transform: [
                  {
                    translateX: shakeAnim || 0,
                  },
                ],
              }}
            >
              <TouchableOpacity
                style={{}}
                onPress={() => {
                  if (totalSelected >= availableStock) {
                    // No stock left, trigger shake animation
                    shakeItem(key);
                  } else {
                    // Proceed with increment
                    handleIncrement(categoryKey, key);
                  }
                }}
              >
                {item.count > 0 || item.gift > 0 ? (
                  <LinearGradient
                    colors={["#C77C8E", "#00C193"]}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}
                    style={{
                      backgroundColor: "#ddd",
                      paddingVertical: 10,
                      paddingHorizontal: 17,
                      alignItems: "center",
                      borderWidth: 1,
                      borderColor: "#ccc",
                      borderBottomLeftRadius: 0,
                      borderTopLeftRadius: 10,
                      borderBottomRightRadius: 10,
                    }}
                  >
                    <Text style={{ color: "white", fontSize: 16 }}>{key}</Text>
                    {item.price > 0 && (
                      <Text style={{ color: "white", fontSize: 16 }}>
                        R{item.price}
                      </Text>
                    )}
                    {item.count > 0 && (
                      <TouchableOpacity
                        style={{
                          zIndex: 10,
                          borderWidth: 1,
                          borderColor: "#000",
                          position: "absolute",
                          top: -10,
                          right: -10,
                          backgroundColor: "#AC415B",
                          borderRadius: 15,
                          width: 30,
                          height: 30,
                          justifyContent: "center",
                          alignItems: "center",
                        }}
                        onPress={() => handleDecrement(categoryKey, key)}
                      >
                        <Text
                          style={{
                            color: "#fff",
                            fontSize: 16,
                            fontWeight: "bold",
                          }}
                        >
                          {item.count}
                        </Text>
                      </TouchableOpacity>
                    )}
                    {item.gift > 0 && (
                      <TouchableOpacity
                        style={{
                          zIndex: 10,
                          borderWidth: 1,
                          borderColor: "#000",
                          position: "absolute",
                          top: -10,
                          left: -10,
                          backgroundColor: "#4CAF50",
                          borderRadius: 15,
                          width: 30,
                          height: 30,
                          justifyContent: "center",
                          alignItems: "center",
                        }}
                        onPress={() => handleGiftDecrement(categoryKey, key)}
                      >
                        <Text
                          style={{
                            color: "#fff",
                            fontSize: 16,
                            fontWeight: "bold",
                          }}
                        >
                          {item.gift}
                        </Text>
                      </TouchableOpacity>
                    )}
                  </LinearGradient>
                ) : (
                  <View
                    style={{
                      backgroundColor: "#ddd",
                      paddingVertical: 10,
                      paddingHorizontal: 17,
                      alignItems: "center",
                      borderWidth: 1,
                      borderColor: "#ccc",
                    }}
                  >
                    <Text style={{ fontSize: 16 }}>{key}</Text>
                    {item.price > 0 && (
                      <Text style={{ fontSize: 16 }}>R{item.price}</Text>
                    )}
                  </View>
                )}
              </TouchableOpacity>
            </Animated.View>
          );
        })}
      </View>
    </View>
  );
};

export default ProductSection;
