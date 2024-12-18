import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React from 'react';
import {
  Text,
  TextStyle,
  TouchableOpacity,
  View,
  ViewStyle,
} from 'react-native';

interface CustomHeaderProps {
  title: string;
  backgroundColor?: string;
  titleColor?: string;
  goBack?: boolean;
}

export default function CustomHeader({
  title,
  backgroundColor,
  titleColor,
  goBack = true,
}: CustomHeaderProps) {
  const router = useRouter();

  const handleRoute = () => {
    router.replace('./home');
  };

  const containerStyle: ViewStyle = {
    height: 70,
    backgroundColor: backgroundColor || '#6CA295',
    justifyContent: 'center',
  };

  const backButtonStyle: ViewStyle = {
    position: 'absolute',
    left: 20,
  };

  const iconStyle: TextStyle = {
    color: titleColor || '#000',
  };

  const titleStyle: TextStyle = {
    alignSelf: 'center',
    fontSize: 24,
    color: titleColor || '#000',
  };

  return (
    <View style={containerStyle}>
      {goBack && (
        <View style={backButtonStyle}>
          <TouchableOpacity onPress={handleRoute}>
            <Ionicons name='arrow-back' size={30} style={iconStyle} />
          </TouchableOpacity>
        </View>
      )}
      <Text style={titleStyle}>{title}</Text>
    </View>
  );
}
