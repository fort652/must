import AsyncStorage from "@react-native-async-storage/async-storage";
import React, { useEffect, useState } from "react";
import {
  Button,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";

type StockItem = {
  count: number;
  price: number;
  gift: number;
};

type CategoryItems = {
  [itemName: string]: StockItem;
};

type StockItems = {
  [categoryKey: string]: CategoryItems;
};

const initialStockItems: StockItems = {
  cottonblend: {
    S: { count: 0, price: 55, gift: 0 },
    M: { count: 0, price: 65, gift: 0 },
    L: { count: 0, price: 75, gift: 0 },
    MIX: { count: 0, price: 170, gift: 0 },
  },
  hundredpercentcotton: {
    S: { count: 0, price: 65, gift: 0 },
    M: { count: 0, price: 75, gift: 0 },
    L: { count: 0, price: 85, gift: 0 },
    MIX: { count: 0, price: 190, gift: 0 },
  },
  // Add other categories as required...
};

export default function Stock() {
  const [stockItems, setStockItems] = useState<StockItems>(initialStockItems);

  useEffect(() => {
    // Load stock items from AsyncStorage
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

  const saveStockItems = async () => {
    try {
      await AsyncStorage.setItem("stockItems", JSON.stringify(stockItems));
      alert("Stock saved successfully!");
    } catch (error) {
      alert("Failed to save stock. Try again.");
    }
  };

  return (
    <ScrollView style={styles.container}>
      {Object.entries(stockItems).map(([category, items]) => (
        <View key={category} style={styles.categoryContainer}>
          <Text style={styles.categoryTitle}>{category}</Text>
          {Object.entries(items).map(([itemName, details]) => (
            <View key={itemName} style={styles.itemContainer}>
              <Text style={styles.itemTitle}>{itemName}</Text>
              <TextInput
                style={styles.input}
                keyboardType="numeric"
                value={String(details.count)}
                onChangeText={(text) =>
                  handleUpdate(category, itemName, "count", text)
                }
                placeholder="Count"
              />
              <TextInput
                style={styles.input}
                keyboardType="numeric"
                value={String(details.price)}
                onChangeText={(text) =>
                  handleUpdate(category, itemName, "price", text)
                }
                placeholder="Price"
              />
              <TextInput
                style={styles.input}
                keyboardType="numeric"
                value={String(details.gift)}
                onChangeText={(text) =>
                  handleUpdate(category, itemName, "gift", text)
                }
                placeholder="Gift"
              />
            </View>
          ))}
        </View>
      ))}
      <Button title="Save Stock" onPress={saveStockItems} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
    backgroundColor: "#f9f9f9",
  },
  categoryContainer: {
    marginBottom: 20,
  },
  categoryTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
  },
  itemContainer: {
    marginBottom: 10,
    padding: 10,
    backgroundColor: "#fff",
    borderRadius: 5,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 2,
  },
  itemTitle: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 5,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 5,
    padding: 8,
    marginBottom: 5,
  },
});
