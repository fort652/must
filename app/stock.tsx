import AsyncStorage from "@react-native-async-storage/async-storage";
import React, { useEffect, useState } from "react";
import { Alert, Button, ScrollView, Text, TextInput, View } from "react-native";
import formatCategoryName from "../components/formatCategoryName";
import formatStockName from "../components/formatStockName";

type StockItem = {
  available: number;
  price: number;
};

type CategoryItems = {
  [itemName: string]: StockItem;
};

type StockItems = {
  [categoryKey: string]: CategoryItems;
};

const stocks: StockItems = {
  cottonblend: {
    S: { available: 0, price: 0 },
    M: { available: 0, price: 0 },
    L: { available: 0, price: 0 },
    MIX: { available: 0, price: 0 },
  },
  hundredpercentcotton: {
    S: { available: 0, price: 0 },
    M: { available: 0, price: 0 },
    L: { available: 0, price: 0 },
    MIX: { available: 0, price: 0 },
  },
  storagebox: {
    L: { available: 0, price: 0 },
  },
  diykit: {
    S: { available: 0, price: 0 },
  },
  candles: {
    Single: { available: 0, price: 0 },
    Double: { available: 0, price: 0 },
  },
  honey: {
    "125ml": { available: 0, price: 0 },
  },
  honeysticks: {
    Sticks: { available: 0, price: 0 },
  },
  solution: {
    "35g": { available: 0, price: 0 },
  },
  keychain: {
    S: { available: 0, price: 0 },
  },
  xmasbox: {
    S: { available: 0, price: 0 },
  },
};

export default function Stock() {
  const [stockItems, setStockItems] = useState<StockItems>(stocks);
  const [edit, setEdit] = useState(false);
  const [title, setTitle] = useState("");

  const saveStockItems = async () => {
    try {
      await AsyncStorage.setItem("stockItems", JSON.stringify(stockItems));
      alert("Stock saved successfully!");
    } catch (error) {
      alert("Failed to save stock. Try again.");
    }
  };

  const initialize = async () => {
    try {
      await AsyncStorage.setItem("stockItems", JSON.stringify(stockItems));
      alert("Successfully Initialized");
    } catch (error) {
      alert("Failed to initialize stock. Try again.");
    }
  };

  useEffect(() => {
    if (edit) {
      setTitle("Done");
    } else {
      setTitle("Edit");
    }
  }, [edit]);

  useEffect(() => {
    const loadStockItems = async () => {
      const savedStock = await AsyncStorage.getItem("stockItems");
      if (savedStock) {
        setStockItems(JSON.parse(savedStock));
      }
    };
    loadStockItems();
  }, []);

  const handleUpdate = (
    category: string,
    item: string,
    field: keyof StockItem,
    value: string
  ) => {
    setStockItems((prev) => ({
      ...prev,
      [category]: {
        ...prev[category],
        [item]: {
          ...prev[category][item],
          [field]: Number(value),
        },
      },
    }));
  };

  const clearStorage = async () => {
    try {
      await AsyncStorage.removeItem("stockItems");
      setStockItems(stocks);
      alert("Stock cleared successfully!");
    } catch (error) {
      alert("Failed to clear stock. Try again.");
    }
  };

  return (
    <ScrollView
      style={{
        flex: 1,
        paddingVertical: 20,
        backgroundColor: "#f9f9f9",
      }}
    >
      <View
        style={{
          marginBottom: 20,
          alignItems: "center",
        }}
      >
        <Button
          title='Clear Data "Only for testing"'
          color="#AC415B"
          onPress={() => {
            Alert.alert(
              "Clear Storage",
              "Are you sure you want to clear all data?",
              [
                { text: "Cancel", style: "cancel" },
                { text: "Yes", onPress: clearStorage },
              ]
            );
          }}
        />
      </View>
      <View
        style={{
          marginBottom: 20,
          alignItems: "center",
          flexDirection: "row",
          alignSelf: "flex-end",
          paddingHorizontal: 20,
          gap: 10,
        }}
      >
        <Button
          title={edit ? "Done" : "Edit"}
          color="#6CA295"
          onPress={() => {
            if (!edit) {
              Alert.alert(
                "Enable Edit Mode",
                "Are you sure you want to enable edit mode? Changes will not be saved until you save them.",
                [
                  { text: "Cancel", style: "cancel" },
                  { text: "Yes", onPress: () => setEdit(true) },
                ]
              );
            } else {
              setEdit(false);
              saveStockItems();
            }
          }}
        />
        {/*  */}
        <Button
          title="Initialize"
          color="#6CA295"
          onPress={() => {
            initialize();
          }}
        />
      </View>

      {Object.entries(stockItems).map(([category, items]) => (
        <View
          key={category}
          style={{
            marginBottom: 20,
          }}
        >
          <View
            style={{
              marginBottom: 10,
              padding: 10,
              width: "100%",
              backgroundColor: "#6CA295",
            }}
          >
            <Text
              style={{
                fontSize: 18,
                fontWeight: "bold",
              }}
            >
              {formatCategoryName(category)}
            </Text>
          </View>
          {Object.entries(items).map(([itemName, details]) => (
            <View
              key={itemName}
              style={{
                marginBottom: 10,
                marginHorizontal: 10,
                padding: 10,
                backgroundColor: "#fff",
                borderRadius: 5,
                shadowColor: "#000",
                shadowOpacity: 10.1,
                shadowRadius: 5,
                elevation: 2,
              }}
            >
              <Text
                style={{
                  fontSize: 17,
                  fontWeight: "800",
                  marginBottom: 5,
                }}
              >
                {formatStockName(itemName)}
              </Text>
              <Text
                style={{
                  fontSize: 16,
                  fontWeight: "400",
                  marginBottom: 5,
                }}
              >
                Available
              </Text>
              <TextInput
                editable={edit}
                style={{
                  borderWidth: 1,
                  borderColor: "#ddd",
                  borderRadius: 5,
                  padding: 8,
                  marginBottom: 5,
                }}
                keyboardType="numeric"
                value={String(details.available)}
                onChangeText={(text) =>
                  handleUpdate(category, itemName, "available", text)
                }
                placeholder="available"
              />
              <Text
                style={{
                  fontSize: 16,
                  fontWeight: "400",
                  marginBottom: 5,
                }}
              >
                Price
              </Text>
              <TextInput
                editable={edit}
                style={{
                  borderWidth: 1,
                  borderColor: "#ddd",
                  borderRadius: 5,
                  padding: 8,
                  marginBottom: 5,
                }}
                keyboardType="numeric"
                value={String(details.price)}
                onChangeText={(text) =>
                  handleUpdate(category, itemName, "price", text)
                }
                placeholder="Price"
              />
            </View>
          ))}
        </View>
      ))}
    </ScrollView>
  );
}
