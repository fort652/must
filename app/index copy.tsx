import AsyncStorage from "@react-native-async-storage/async-storage";
import React, { useCallback, useEffect, useState } from "react";
import {
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import Icon from "react-native-vector-icons/MaterialIcons";

import GiftSummary from "../components/GiftSummary";
import ProductSection from "../components/ProductSection";
import Summary from "../components/Summary";
import TradeSummary from "../components/TradeSummary";

import DiscountCalculator from "../components/Modals/DiscountCalculator";
import EditModal from "../components/Modals/EditModal";
import GiftModal from "../components/Modals/GiftModal";
import TradeModal from "../components/Modals/TradeModal";

type Item = {
  count: number;
  price: number;
  gift: number;
};

type CategoryItems = {
  [itemKey: string]: Item;
};

type SelectedItems = {
  [categoryKey: string]: CategoryItems;
};

type Trade = {
  amount: number;
  name: string;
  count: number;
};

export default function Sales(): JSX.Element {
  const initialSelectedItems: SelectedItems = {
    cottonblend: {
      S: { count: 0, price: 10, gift: 0 },
      M: { count: 0, price: 10, gift: 0 },
      L: { count: 0, price: 10, gift: 0 },
      MIX: { count: 0, price: 10, gift: 0 },
    },
    hundredpercentcotton: {
      S: { count: 0, price: 10, gift: 0 },
      M: { count: 0, price: 10, gift: 0 },
      L: { count: 0, price: 10, gift: 0 },
      MIX: { count: 0, price: 10, gift: 0 },
    },
    storagebox: {
      L: { count: 0, price: 10, gift: 0 },
    },
    diykit: {
      S: { count: 0, price: 10, gift: 0 },
    },
    candles: {
      single: { count: 0, price: 10, gift: 0 },
      double: { count: 0, price: 10, gift: 0 },
    },
    honey: {
      "125ml": { count: 0, price: 10, gift: 0 },
    },
    honeysticks: {
      Sticks: { count: 0, price: 10, gift: 0 },
    },
    solution: {
      "35g": { count: 0, price: 10, gift: 0 },
    },
    keychain: {
      S: { count: 0, price: 10, gift: 0 },
    },
    xmasbox: {
      S: { count: 0, price: 10, gift: 0 },
    },
  };

  const [selectedItems, setSelectedItems] =
    useState<SelectedItems>(initialSelectedItems);
  const [subtotal, setSubtotal] = useState<number>(0);
  const [discount, setDiscount] = useState<number | "">("");
  const [total, setTotal] = useState<number>(0);
  const [giftModalVisible, setGiftModalVisible] = useState<boolean>(false);
  const [editModalVisible, setEditModalVisible] = useState<boolean>(false);
  const [selectedCategory, setSelectedCategory] = useState<string>("");
  const [selectedItemKey, setSelectedItemKey] = useState<string>("");
  const [calculatorVisible, setCalculatorVisible] = useState<boolean>(false);
  const [tradeModalVisible, setTradeModalVisible] = useState<boolean>(false);
  const [trades, setTrades] = useState<Trade[]>([]);

  const resetAll = async () => {
    try {
      // Filter selectedItems to only include items with count > 0 or gift > 0
      const filteredItems = Object.fromEntries(
        Object.entries(selectedItems)
          .map(([categoryKey, items]) => [
            categoryKey,
            Object.fromEntries(
              Object.entries(items).filter(
                ([, itemData]) => itemData.count > 0 || itemData.gift > 0
              )
            ),
          ])
          .filter(([, items]) => Object.keys(items).length > 0) // Keep only categories with items > 0
      );

      // Add a timestamp, items, discount, and trades to the new submission
      const newSubmission = {
        timestamp: new Date().toISOString(),
        items: filteredItems,
        discount: discount || 0, // Default to 0 if discount is empty
        trades: trades || [], // Ensure trades is an array
      };

      // Retrieve existing data from AsyncStorage
      const existingData = await AsyncStorage.getItem("submittedData");
      let submissions = existingData ? JSON.parse(existingData) : [];

      // Ensure submissions is an array
      if (!Array.isArray(submissions)) {
        submissions = [];
      }

      // Add the new submission at the beginning of the array
      submissions.unshift(newSubmission);

      // Save the updated submissions back to AsyncStorage
      await AsyncStorage.setItem("submittedData", JSON.stringify(submissions));
      console.log("Data saved successfully:", submissions);

      // Reset state after saving
      setSelectedItems(initialSelectedItems);
      setDiscount("");
      setTotal(0);
      setTrades([]);
      setSubtotal(0);
    } catch (error) {
      console.error("Error saving data:", error);
    }
  };

  const setTradeDetails = ({
    amount,
    name,
  }: {
    amount: number;
    name: string;
  }) => {
    setTrades((prevTrades) => {
      const existingIndex = prevTrades.findIndex(
        (trade) => trade.name === name && trade.amount === amount
      );

      if (existingIndex !== -1) {
        const updatedTrades = [...prevTrades];
        updatedTrades[existingIndex].count += 1;
        return updatedTrades;
      }

      return [...prevTrades, { amount, name, count: 1 }];
    });
  };

  const addTrade = (index: number) => {
    setTrades((prevTrades) => {
      const updatedTrades = [...prevTrades];
      updatedTrades[index].count += 1;
      return updatedTrades;
    });
    calculateTotal();
  };

  const removeTrade = (index: number) => {
    setTrades((prevTrades) => {
      const updatedTrades = [...prevTrades];
      if (updatedTrades[index].count > 1) {
        updatedTrades[index].count -= 1;
      } else {
        updatedTrades.splice(index, 1);
      }
      return updatedTrades;
    });
    calculateTotal();
  };

  const onAddGift = (categoryKey: string, itemName: string) => {
    setSelectedItems((prevItems) => ({
      ...prevItems,
      [categoryKey]: {
        ...prevItems[categoryKey],
        [itemName]: {
          ...prevItems[categoryKey][itemName],
          gift: prevItems[categoryKey][itemName].gift + 1,
        },
      },
    }));
  };

  const onRemoveGift = (categoryKey: string, itemName: string) => {
    setSelectedItems((prevItems) => ({
      ...prevItems,
      [categoryKey]: {
        ...prevItems[categoryKey],
        [itemName]: {
          ...prevItems[categoryKey][itemName],
          gift: Math.max(0, prevItems[categoryKey][itemName].gift - 1),
        },
      },
    }));
  };

  const calculateTotal = () => {
    let newSubtotal = 0;
    for (const category in selectedItems) {
      for (const key in selectedItems[category]) {
        newSubtotal +=
          selectedItems[category][key].count *
          selectedItems[category][key].price;
      }
    }

    const totalTrade = trades.reduce(
      (sum, trade) => sum + trade.amount * trade.count,
      0
    );

    setSubtotal(newSubtotal);
    setTotal(newSubtotal - (discount || 0) - totalTrade);
  };

  useEffect(() => {
    calculateTotal();
  }, [discount, trades, selectedItems]);

  const handleGiftDecrement = useCallback((category: string, key: string) => {
    setSelectedItems((prevState) => ({
      ...prevState,
      [category]: {
        ...prevState[category],
        [key]: {
          ...prevState[category][key],
          gift: Math.max(0, prevState[category][key].gift - 1),
        },
      },
    }));
  }, []);

  const handleIncrement = (category: string, key: string) => {
    setSelectedItems((prevState) => ({
      ...prevState,
      [category]: {
        ...prevState[category],
        [key]: {
          ...prevState[category][key],
          count: prevState[category][key].count + 1,
        },
      },
    }));
  };

  const handleDecrement = (category: string, key: string) => {
    setSelectedItems((prevState) => ({
      ...prevState,
      [category]: {
        ...prevState[category],
        [key]: {
          ...prevState[category][key],
          count: Math.max(0, prevState[category][key].count - 1),
        },
      },
    }));
  };

  const handleGiftIncrement = (category: string, key: string) => {
    setSelectedItems((prevState) => ({
      ...prevState,
      [category]: {
        ...prevState[category],
        [key]: {
          ...prevState[category][key],
          gift: prevState[category][key].gift + 1,
        },
      },
    }));
  };

  const handleEditItem = (categoryKey: string, key: string) => {
    setSelectedCategory(categoryKey);
    setSelectedItemKey(key);
    setEditModalVisible(true);
  };

  const openGiftModal = () => {
    setGiftModalVisible(true);
  };

  const closeGiftModal = () => {
    setGiftModalVisible(false);
  };

  return (
    <ScrollView style={{ backgroundColor: "#f5f5f5" }}>
      {Object.keys(selectedItems).map((categoryKey) => (
        <ProductSection
          key={categoryKey}
          categoryName={categoryKey.replace(/_/g, " ")}
          items={selectedItems[categoryKey]}
          handleIncrement={handleIncrement}
          handleDecrement={handleDecrement}
          handleGiftIncrement={handleGiftIncrement}
          handleGiftDecrement={handleGiftDecrement}
          categoryKey={categoryKey}
        />
      ))}

      <View
        style={{
          padding: 10,
          borderTopWidth: 2,
          borderBottomWidth: 2,
        }}
      >
        <View>
          {subtotal > 0 ? (
            <>
              <View
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <Icon name="shopping-cart" size={30} color="#6CA295" />
                <Text style={{ fontSize: 28, marginLeft: 10 }}>Cart</Text>
              </View>
              <Summary
                selectedItems={selectedItems}
                handleEditItem={handleEditItem}
              />
            </>
          ) : (
            <View
              style={{
                alignItems: "center",
                gap: 10,
                marginBottom: 20,
              }}
            >
              <View
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <Icon name="remove-shopping-cart" size={30} color="#6CA295" />
                <Text style={{ fontSize: 28, marginLeft: 10 }}>Cart</Text>
              </View>
              <Text style={{ fontSize: 16 }}>No items in cart yet 😔</Text>
            </View>
          )}
        </View>
        {subtotal > 0 && (
          <>
            <Text style={{ fontSize: 22, marginBottom: 10, fontWeight: "600" }}>
              Subtotal: R{subtotal}
            </Text>
            <>
              <View
                style={{
                  marginBottom: 20,
                  marginTop: 20,
                }}
              >
                <View
                  style={{
                    borderWidth: 1,
                    backgroundColor: "#B8D1CB",
                    paddingBottom: 10,
                  }}
                >
                  <View
                    style={{
                      flexDirection: "row",
                      alignItems: "center",
                      justifyContent: "space-between",
                    }}
                  >
                    <View
                      style={{
                        flexDirection: "row",
                        alignItems: "center",
                        justifyContent: "space-between",
                        marginHorizontal: 20,
                        paddingBottom: 10,
                        paddingRight: discount ? 60 : 0,
                        paddingLeft: 30,
                      }}
                    >
                      <TextInput
                        placeholder="Discount"
                        keyboardType="numeric"
                        style={{
                          flex: 1,
                          height: 40,
                          borderColor: "#4CAF50",
                          borderWidth: 1,
                          marginTop: 10,
                          borderRadius: 5,
                          textAlign: "center",
                        }}
                        value={discount.toString()}
                        onChangeText={(value) =>
                          setDiscount(value === "" ? "" : Number(value))
                        }
                      />
                    </View>
                    <Text
                      style={{
                        position: "absolute",
                        left: 20,
                        fontSize: 18,
                      }}
                    >
                      R
                    </Text>
                    {discount !== "" && (
                      <View
                        style={{
                          height: 40,
                          width: 40,
                          alignItems: "center",
                          justifyContent: "center",
                          backgroundColor: "#C77C8E",
                          position: "absolute",
                          borderRadius: 8,
                          right: 20,
                          top: 9.5,
                        }}
                      >
                        <TouchableOpacity onPress={() => setDiscount("")}>
                          <Icon name="close" size={24} color="#fff" />
                        </TouchableOpacity>
                      </View>
                    )}
                  </View>
                  <View
                    style={{
                      flexDirection: "row",
                      alignItems: "center",
                      marginHorizontal: 20,
                    }}
                  >
                    <TouchableOpacity
                      style={{
                        backgroundColor: "#4CAF50",
                        padding: 15,
                        borderRadius: 5,
                        alignItems: "center",
                        flex: 1,
                      }}
                      onPress={() => setCalculatorVisible(true)}
                    >
                      <Text style={{ color: "white", fontSize: 18 }}>
                        Calculate Discount %
                      </Text>
                    </TouchableOpacity>
                  </View>
                </View>
              </View>
            </>
            {/* Trade Summary */}
            <View
              style={{
                borderWidth: 1,
                backgroundColor: "#B8D1CB",
                marginBottom: 20,
                paddingBottom: 10,
              }}
            >
              <TradeSummary
                trades={trades}
                onRemoveTrade={removeTrade}
                onAddTrade={addTrade}
              />

              <View
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  marginHorizontal: 20,
                }}
              >
                <TouchableOpacity
                  style={{
                    backgroundColor: "#4CAF50",
                    padding: 15,
                    borderRadius: 5,
                    alignItems: "center",
                    flex: 1,
                  }}
                  onPress={() => setTradeModalVisible(true)}
                >
                  <Text style={{ color: "white", fontSize: 18 }}>
                    Make a trade
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </>
        )}

        {/* Gifts Section */}
        <View
          style={{
            borderWidth: 1,
            backgroundColor: "#B8D1CB",
            paddingBottom: 10,
          }}
        >
          <GiftSummary
            selectedItems={selectedItems}
            onAddGift={onAddGift}
            onRemoveGift={onRemoveGift}
          />

          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              marginHorizontal: 20,
            }}
          >
            <TouchableOpacity
              style={{
                backgroundColor: "#4CAF50",
                padding: 15,
                borderRadius: 5,
                alignItems: "center",
                flex: 1,
              }}
              onPress={openGiftModal}
            >
              <Text style={{ color: "white", fontSize: 18 }}>Add a gift</Text>
            </TouchableOpacity>
          </View>
        </View>

        {subtotal > 0 && (
          <Text
            style={{
              fontSize: 28,
              fontWeight: "bold",
              marginTop: 20,
              marginBottom: 10,
            }}
          >
            Total: R{total}
          </Text>
        )}

        <TouchableOpacity
          style={{
            backgroundColor: "#6CA295",
            padding: 15,
            alignItems: "center",
            justifyContent: "center",
            marginTop: 20,
            marginBottom: 10,
          }}
          onPress={resetAll}
        >
          <Text style={{ color: "white", fontSize: 18, fontWeight: "bold" }}>
            Submit
          </Text>
        </TouchableOpacity>
      </View>

      <DiscountCalculator
        visible={calculatorVisible}
        onClose={() => setCalculatorVisible(false)}
        subtotal={subtotal}
        setDiscount={setDiscount}
      />

      <GiftModal
        visible={giftModalVisible}
        onClose={closeGiftModal}
        selectedItems={selectedItems}
        handleGiftIncrement={handleGiftIncrement}
        handleGiftDecrement={handleGiftDecrement}
      />

      <EditModal
        visible={editModalVisible}
        onClose={() => setEditModalVisible(false)}
        selectedCategory={selectedCategory}
        selectedItemKey={selectedItemKey}
        selectedItems={selectedItems}
        handleIncrement={handleIncrement}
        handleDecrement={handleDecrement}
        handleGiftIncrement={handleGiftIncrement}
        handleGiftDecrement={handleGiftDecrement}
      />

      <TradeModal
        visible={tradeModalVisible}
        onClose={() => setTradeModalVisible(false)}
        trades={trades}
        onRemoveTrade={removeTrade}
        onAddTrade={addTrade}
        setTradeDetails={setTradeDetails}
      />
    </ScrollView>
  );
}
