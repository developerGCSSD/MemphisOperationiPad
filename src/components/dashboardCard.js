import React from 'react';
import {
  TouchableOpacity,
  Text,
  StyleSheet,
  View,
  Image,
  Dimensions,
} from 'react-native';

const screenWidth = Dimensions.get('window').width;
const cardWidth = screenWidth - 300; // leave some margin on both sides

const ClickableCard = ({imageSource, label, onPress}) => {
  return (
    <TouchableOpacity
      style={styles.card}
      onPress={onPress}
      activeOpacity={0.85}>
      <View style={styles.imageWrapper}>
        <Image source={imageSource} style={styles.image} resizeMode="contain" />
      </View>
      <Text style={styles.label}>{label}</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    width: cardWidth,
    height: 200,
    backgroundColor: '#fff',
    borderRadius: 20,
    elevation: 5,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 8,
    shadowOffset: {width: 0, height: 3},
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  imageWrapper: {
    marginBottom: 12,
  },
  image: {
    width: 80,
    height: 80,
  },
  label: {
    fontSize: 16,
    fontWeight: '700',
    textAlign: 'center',
    color: '#1e1e1e',
  },
});

export default ClickableCard;
