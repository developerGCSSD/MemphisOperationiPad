import React from 'react';
import {View, Text, TouchableOpacity, StyleSheet, FlatList} from 'react-native';

export default function RadioButtonCard({
  options,
  selectedOption,
  setSelectedOption,
}) {
  if (!options || options.length === 0) {
    return <Text>No options available</Text>; // Display a message if options are empty
  }

  return (
    <FlatList
      data={options}
      numColumns={2} // Display in two columns
      keyExtractor={(item, index) => index.toString()}
      renderItem={({item}) => (
        <TouchableOpacity
          style={[
            styles.radioContainer,
            selectedOption === item && styles.selectedContainer,
          ]}
          onPress={() => setSelectedOption(item)}>
          <View
            style={[
              styles.radioButton,
              selectedOption === item && styles.radioSelected,
            ]}
          />
          <Text
            style={[
              styles.radioText,
              selectedOption === item && styles.selectedText,
            ]}>
            {item}
          </Text>
        </TouchableOpacity>
      )}
    />
  );
}

const styles = StyleSheet.create({
  radioContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: '#ccc',
    backgroundColor: '#F2F4F7',
    margin: 6,
    flex: 1, // Ensures equal width in the grid
  },
  selectedContainer: {
    backgroundColor: '#E3F2FD',
    borderColor: '#5CB9E9',
  },
  radioButton: {
    width: 16,
    height: 16,
    borderRadius: 8,
    borderWidth: 2,
    borderColor: '#aaa',
    marginRight: 8,
  },
  radioSelected: {
    borderColor: '#5CB9E9',
    backgroundColor: '#5CB9E9',
  },
  radioText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: 'black',
  },
  selectedText: {
    color: '#5CB9E9',
  },
});
