import React from 'react';
import { Modal, Text, TouchableOpacity, View } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';

import formatCategoryName from '../formatCategoryName';

const EditModal = ({
  visible,
  onClose,
  selectedCategory,
  selectedItemKey,
  selectedItems,
  handleIncrement,
  handleDecrement,
}: any) => {
  return (
    <Modal visible={visible} animationType='slide' transparent={true}>
      <View
        style={{
          flex: 1,
          justifyContent: 'center',
          alignItems: 'center',
          backgroundColor: 'rgba(0, 0, 0, 0.5)',
        }}
      >
        <View
          style={{
            width: '90%',
            backgroundColor: '#fff',
            padding: 20,
            borderRadius: 10,
          }}
        >
          <TouchableOpacity
            onPress={() => {
              onClose();
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
          <View style={{ marginTop: 20 }}>
            <Text
              style={{
                fontSize: 22,
                fontWeight: 'bold',
                marginBottom: 25,
                alignSelf: 'center',
              }}
            >
              {formatCategoryName(selectedCategory)} {selectedItemKey}
            </Text>
          </View>
          {selectedCategory && selectedItemKey && (
            <>
              {/* Edit Item Count */}
              <View
                style={{
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                }}
              >
                <TouchableOpacity
                  style={{
                    backgroundColor: '#AC415B',
                    width: 45,
                    height: 45,
                    borderRadius: 5,
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                  onPress={() =>
                    handleDecrement(selectedCategory, selectedItemKey)
                  }
                >
                  <Text style={{ color: 'white', fontSize: 18 }}>-</Text>
                </TouchableOpacity>
                <Text style={{ fontSize: 22, alignItems: 'center' }}>
                  {selectedItems[selectedCategory]?.[selectedItemKey]?.count ??
                    0}
                </Text>
                <TouchableOpacity
                  style={{
                    backgroundColor: '#4CAF50',
                    width: 45,
                    height: 45,
                    borderRadius: 5,
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                  onPress={() =>
                    handleIncrement(selectedCategory, selectedItemKey)
                  }
                >
                  <Text style={{ color: 'white', fontSize: 18 }}>+</Text>
                </TouchableOpacity>
              </View>
            </>
          )}

          <TouchableOpacity
            style={{
              backgroundColor: '#4CAF50',
              padding: 10,
              borderRadius: 5,
              alignItems: 'center',
              marginTop: 20,
            }}
            onPress={onClose}
          >
            <Text style={{ color: 'white', fontSize: 18 }}>Done</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

export default EditModal;
