// src/components/Summary.js

import React from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';

import formatCategoryName from './formatCategoryName';

const Summary = ({ selectedItems, handleEditItem }: any) => {
  return (
    <View style={{ marginVertical: 20 }}>
      {Object.keys(selectedItems).map((categoryKey) => {
        const items = selectedItems[categoryKey];
        const selectedItemsForCategory = Object.keys(items).filter(
          (key) => items[key].count > 0,
        );

        if (selectedItemsForCategory.length > 0) {
          return (
            <View key={categoryKey} style={{ marginBottom: 10 }}>
              <Text
                style={{
                  fontSize: 18,
                  fontWeight: 'bold',
                  marginBottom: 5,
                  color: '#333',
                }}
              >
                {formatCategoryName(categoryKey)}
              </Text>

              <View
                style={{
                  flexDirection: 'row',
                  flexWrap: 'wrap',
                  alignItems: 'center',
                }}
              >
                {selectedItemsForCategory.map((key) => (
                  <View
                    key={`${categoryKey}-${key}`}
                    style={{
                      flexDirection: 'row',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      marginVertical: 5,
                      marginRight: 10,
                    }}
                  >
                    <Text
                      style={{ fontSize: 16, color: '#333', marginRight: 10 }}
                    >{`${key} : ${items[key].count}`}</Text>

                    <TouchableOpacity
                      style={{
                        padding: 5,
                        borderRadius: 5,
                      }}
                      onPress={() => handleEditItem(categoryKey, key)}
                    >
                      <Icon name='edit' size={20} color='#6CA295' />
                    </TouchableOpacity>
                  </View>
                ))}
              </View>
            </View>
          );
        } else {
          return null;
        }
      })}
    </View>
  );
};

export default Summary;
