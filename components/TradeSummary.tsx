// src/components/TradeSummary.js

import React from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';

const TradeSummary = ({ trades, onRemoveTrade, onAddTrade }: any) => {
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
        Trades
      </Text>
      <View style={{ marginHorizontal: 10, marginTop: 5 }}>
        {trades.length > 0 ? (
          trades.map((trade: any, index: any) => (
            <View
              key={index}
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: 5,
              }}
            >
              <Text style={{ fontSize: 18, color: '#333' }}>
                {trade.name || 'Trade'}: R {trade.amount.toFixed(2)}
                {trade.count > 1 && (
                  <Text style={{ fontSize: 18, color: '#333' }}>
                    {' '}
                    x {trade.count}
                  </Text>
                )}
              </Text>
              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <TouchableOpacity onPress={() => onAddTrade(index)}>
                  <Icon name='add-circle' size={30} color='#4CAF50' />
                </TouchableOpacity>
                <TouchableOpacity onPress={() => onRemoveTrade(index)}>
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
              color: '#666',
            }}
          >
            No trades.
          </Text>
        )}
      </View>
    </View>
  );
};

export default TradeSummary;
