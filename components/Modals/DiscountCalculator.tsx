import React, { useEffect, useState } from 'react';
import {
  Keyboard,
  Modal,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';

const DiscountCalculator = ({
  visible,
  onClose,
  subtotal,
  setDiscount,
}: any) => {
  const [discountPercentage, setDiscountPercentage] = useState<any>('');
  const [discountAmount, setDiscountAmount] = useState(0);
  const [roundedDiscount, setRoundedDiscount] = useState(0);

  // Recalculate the discount whenever discountPercentage changes
  useEffect(() => {
    const discount = (subtotal * discountPercentage) / 100;
    const rounded = Math.round(discount);
    setDiscountAmount(discount);
    setRoundedDiscount(rounded);
  }, [discountPercentage, subtotal]);

  const applyDiscount = () => {
    // Hide the keyboard
    Keyboard.dismiss();

    // Apply the discount
    setDiscount(roundedDiscount);

    // Clear the fields
    setDiscountPercentage('');
    setDiscountAmount(0);
    setRoundedDiscount(0);

    // Close the modal
    onClose();
  };

  return (
    <Modal visible={visible} animationType='slide' transparent={true}>
      <View
        style={{
          flex: 1,
          backgroundColor: 'rgba(0, 0, 0, 0.5)',
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        <View
          style={{
            flex: 1,
            width: '100%',
            backgroundColor: '#fff',
            padding: 20,
            alignItems: 'center',
          }}
        >
          {/* Close Button */}
          <TouchableOpacity
            onPress={onClose}
            style={{
              position: 'absolute',
              top: 10,
              right: 10,
              backgroundColor: '#f5f5f5',
              borderRadius: 15,
              padding: 5,
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
            Subtotal: R{subtotal}
          </Text>

          <TextInput
            style={{
              height: 40,
              borderColor: '#ccc',
              borderWidth: 1,
              marginBottom: 20,
              width: '100%',
              textAlign: 'center',
              borderRadius: 5,
            }}
            placeholder='Discount amount in %'
            keyboardType='numeric'
            value={discountPercentage.toString()}
            onChangeText={(value) => setDiscountPercentage(Number(value))}
          />

          <Text style={{ fontSize: 18 }}>Default amounts.</Text>
          {/* Default Percentage Buttons */}
          <View style={{ flexDirection: 'row', marginTop: 10, gap: 20 }}>
            <TouchableOpacity
              style={{
                backgroundColor: '#4CAF50',
                width: 70,
                height: 50,
                justifyContent: 'center',
                alignItems: 'center',
                borderRadius: 5,
              }}
              onPress={() => setDiscountPercentage(5)}
            >
              <Text style={{ color: 'white', fontSize: 18 }}>5%</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={{
                backgroundColor: '#4CAF50',
                width: 70,
                height: 50,
                justifyContent: 'center',
                alignItems: 'center',
                borderRadius: 5,
              }}
              onPress={() => setDiscountPercentage(10)}
            >
              <Text style={{ color: 'white', fontSize: 18 }}>10%</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={{
                backgroundColor: '#4CAF50',
                width: 70,
                height: 50,
                justifyContent: 'center',
                alignItems: 'center',
                borderRadius: 5,
              }}
              onPress={() => setDiscountPercentage(15)}
            >
              <Text style={{ color: 'white', fontSize: 18 }}>15%</Text>
            </TouchableOpacity>
          </View>

          <View
            style={{
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              alignItems: 'center',
              marginTop: 25,
            }}
          >
            <Text style={{ fontSize: 18, marginBottom: 5 }}>
              Discount amount:
            </Text>
            <Text style={{ fontSize: 18 }}>R {discountAmount.toFixed(2)}</Text>
          </View>
          <View
            style={{
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              alignItems: 'center',
              marginTop: 10,
            }}
          >
            <Text style={{ fontSize: 18, marginBottom: 5 }}>
              Discount amount Rounded:
            </Text>
            <Text style={{ fontSize: 18 }}>R {roundedDiscount}</Text>
          </View>

          <TouchableOpacity
            style={{
              backgroundColor: '#4CAF50',
              padding: 15,
              marginTop: 30,
              borderRadius: 5,
              alignItems: 'center',
              width: '100%',
            }}
            onPress={applyDiscount}
          >
            <Text style={{ color: 'white', fontSize: 18 }}>Add Discount</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

export default DiscountCalculator;
