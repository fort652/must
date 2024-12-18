import React, { useEffect, useState } from "react";
import { Modal, ScrollView, Text, TouchableOpacity, View } from "react-native";
import Icon from "react-native-vector-icons/MaterialIcons";
import ProductSection from "../ProductSection";

const GiftModal = ({
  visible,
  onClose,
  selectedItems,
  handleGiftIncrement,
  handleGiftDecrement,
}: any) => {
  const [tempSelectedItems, setTempSelectedItems] = useState(selectedItems);

  useEffect(() => {
    if (visible) {
      setTempSelectedItems(selectedItems);
    }
  }, [visible, selectedItems]);

  const tempHandleGiftIncrement = (categoryKey: any, key: any) => {
    setTempSelectedItems((prevState: any) => ({
      ...prevState,
      [categoryKey]: {
        ...prevState[categoryKey],
        [key]: {
          ...prevState[categoryKey][key],
          gift: prevState[categoryKey][key].gift + 1,
        },
      },
    }));
  };

  const tempHandleGiftDecrement = (categoryKey: any, key: any) => {
    setTempSelectedItems((prevState: any) => ({
      ...prevState,
      [categoryKey]: {
        ...prevState[categoryKey],
        [key]: {
          ...prevState[categoryKey][key],
          gift: Math.max(0, prevState[categoryKey][key].gift - 1),
        },
      },
    }));
  };

  const applyGifts = () => {
    Object.keys(tempSelectedItems).forEach((categoryKey) => {
      Object.keys(tempSelectedItems[categoryKey]).forEach((key) => {
        const item = tempSelectedItems[categoryKey][key];
        if (item.gift !== selectedItems[categoryKey][key].gift) {
          if (item.gift > selectedItems[categoryKey][key].gift) {
            const increment = item.gift - selectedItems[categoryKey][key].gift;
            Array.from({ length: increment }).forEach(() =>
              handleGiftIncrement(categoryKey, key)
            );
          } else {
            const decrement = selectedItems[categoryKey][key].gift - item.gift;
            Array.from({ length: decrement }).forEach(() =>
              handleGiftDecrement(categoryKey, key)
            );
          }
        }
      });
    });
    onClose();
  };

  return (
    <Modal visible={visible} animationType="slide" transparent={true}>
      <View
        style={{
          flex: 1,
          backgroundColor: "rgba(0, 0, 0, 0.5)",
          justifyContent: "center",
        }}
      >
        <View
          style={{
            flex: 1,
            width: "100%",
            backgroundColor: "#f5f5f5",
            overflow: "hidden",
          }}
        >
          <View style={{ height: 55 }}>
            <TouchableOpacity
              onPress={() => {
                onClose();
              }}
              style={{
                position: "absolute",
                top: 10,
                right: 10,
                backgroundColor: "#f5f5f5",
                borderRadius: 15,
                padding: 5,
                zIndex: 10,
              }}
            >
              <Icon name="close" size={24} color="#333" />
            </TouchableOpacity>
          </View>
          <ScrollView contentContainerStyle={{}}>
            {Object.keys(tempSelectedItems).map((categoryKey) => (
              <ProductSection
                key={categoryKey}
                categoryName={categoryKey.replace(/_/g, " ")}
                items={tempSelectedItems[categoryKey]}
                handleIncrement={(categoryKey: any, key: any) =>
                  tempHandleGiftIncrement(categoryKey, key)
                }
                handleDecrement={(categoryKey: any, key: any) =>
                  tempHandleGiftDecrement(categoryKey, key)
                }
                handleGiftDecrement={(categoryKey: any, key: any) =>
                  tempHandleGiftDecrement(categoryKey, key)
                } // Pass handleGiftDecrement correctly
                categoryKey={categoryKey}
              />
            ))}
          </ScrollView>
          <View
            style={{
              padding: 20,
            }}
          >
            <TouchableOpacity
              style={{
                backgroundColor: "#4CAF50",
                padding: 15,
                marginHorizontal: 20,
                borderRadius: 5,
                alignItems: "center",
                alignSelf: "center",
                width: "100%",
              }}
              onPress={applyGifts}
            >
              <Text
                style={{ color: "white", fontSize: 22, fontWeight: "bold" }}
              >
                Gift
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

export default GiftModal;
