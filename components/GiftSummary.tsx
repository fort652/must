// src/components/GiftSummary.js

import React from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';

import formatCategoryName from './formatCategoryName';

const GiftSummary = ({ selectedItems, onAddGift, onRemoveGift }: any) => {
  const selectedGifts = Object.keys(selectedItems).flatMap((categoryKey) => {
    const items = selectedItems[categoryKey];
    return Object.keys(items)
      .filter((key) => items[key].gift > 0)
      .map((key) => ({
        categoryKey,
        category: formatCategoryName(categoryKey),
        itemName: key,
        giftCount: items[key].gift,
      }));
  });

  return (
    <View style={{ paddingBottom: 10 }}>
      <Text
        style={{
          fontSize: 22,
          fontWeight: 'semibold',
          alignSelf: 'center',
          marginTop: 10,
        }}
      >
        Gifts
      </Text>
      <View style={{ marginHorizontal: 10, marginTop: 5 }}>
        {selectedGifts.length > 0 ? (
          selectedGifts.map((gift, index) => (
            <View
              key={`${gift.category}-${gift.itemName}`}
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: 5,
              }}
            >
              <Text style={{ fontSize: 18, color: '#333' }}>
                {gift.category} {gift.itemName} : {gift.giftCount}
              </Text>
              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <TouchableOpacity
                  onPress={() => onAddGift(gift.categoryKey, gift.itemName)}
                >
                  <Icon name='add-circle' size={30} color='#4CAF50' />
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => onRemoveGift(gift.categoryKey, gift.itemName)}
                >
                  <Icon
                    name='remove-circle'
                    size={30}
                    color='#C77C8E'
                    style={{ marginLeft: 10 }}
                  />
                </TouchableOpacity>
              </View>
            </View>
          ))
        ) : (
          <Text
            style={{
              fontSize: 16,
              fontWeight: 'semibold',
              alignSelf: 'center',
            }}
          >
            No gifts.
          </Text>
        )}
      </View>
    </View>
  );
};

export default GiftSummary;
