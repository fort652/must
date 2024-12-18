import React, { useState } from 'react';
import { Modal, Text, TextInput, TouchableOpacity, View } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';

const TradeModal = ({ visible, onClose, setTradeDetails }: any) => {
  const [tradeAmount, setTradeAmount] = useState('');
  const [tradeName, setTradeName] = useState('');

  // Determine if the button should be disabled
  const isButtonDisabled = !tradeAmount || !tradeName;

  const handleTrade = () => {
    setTradeDetails({ amount: Number(tradeAmount), name: tradeName });
    onClose();
    setTradeAmount('');
    setTradeName('');
  };

  return (
    <Modal visible={visible} animationType='slide' transparent={true}>
      <View
        style={{
          flex: 1,
          backgroundColor: 'rgba(0, 0, 0, 0.5)',
          justifyContent: 'center',
        }}
      >
        <View
          style={{
            flex: 1,
            width: '100%',
            height: '100%',
            backgroundColor: '#fff',
            padding: 20,
            alignItems: 'center',
            position: 'relative',
          }}
        >
          {/* Close Button */}
          <TouchableOpacity
            onPress={() => {
              onClose();
              setTradeAmount('');
              setTradeName('');
            }}
            style={{
              position: 'absolute',
              top: 10,
              right: 10,
              backgroundColor: '#f5f5f5',
              borderRadius: 15,
              padding: 5,
              zIndex: 10,
            }}
          >
            <Icon name='close' size={24} color='#333' />
          </TouchableOpacity>

          {/* Modal Content */}
          <Text
            style={{
              fontSize: 22,
              fontWeight: 'bold',
              marginBottom: 20,
              marginTop: 20,
            }}
          >
            Trade Details
          </Text>

          <TextInput
            style={{
              height: 40,
              borderColor: '#ccc',
              borderWidth: 1,
              marginBottom: 15,
              width: '100%',
              paddingHorizontal: 10,
              borderRadius: 5,
              textAlign: 'center',
            }}
            placeholder='Amount'
            keyboardType='numeric'
            value={tradeAmount}
            onChangeText={setTradeAmount}
          />

          <TextInput
            style={{
              height: 40,
              borderColor: '#ccc',
              borderWidth: 1,
              marginBottom: 15,
              width: '100%',
              paddingHorizontal: 10,
              borderRadius: 5,
              textAlign: 'center',
            }}
            placeholder='What are you getting?'
            value={tradeName}
            onChangeText={setTradeName}
          />

          <View
            style={{
              flexDirection: 'row',
              width: '100%',
              justifyContent: 'space-evenly',
              marginTop: 15,
            }}
          >
            <TouchableOpacity
              style={{
                backgroundColor: isButtonDisabled ? '#d3d3d3' : '#4CAF50',
                padding: 15,
                borderRadius: 5,
                alignItems: 'center',
                flex: 1,
                marginRight: 10,
              }}
              onPress={handleTrade}
              disabled={isButtonDisabled}
            >
              <Text style={{ color: 'white', fontSize: 18 }}>Add Trade</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

export default TradeModal;
