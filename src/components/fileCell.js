// FileCell.js
import React from 'react';
import {TouchableOpacity, View, Text, StyleSheet} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

export default function FileCell({
  day,
  fileItem,
  isSelected,
  onToggleSelect,
  style,
}) {
  return (
    <TouchableOpacity
      style={[styles.cell, isSelected && styles.selectedCell, style]}
      onPress={() => onToggleSelect(day, fileItem.id)}>
      <View style={styles.cellRow}>
        <Icon name="folder" size={16} color="#f4c430" />
        <Text style={styles.cellText}>{fileItem.fileName}</Text>
      </View>

      <View style={styles.cellRow}>
        <Icon name="clock-time-four-outline" size={16} color="#00aaff" />
        <Text style={styles.cellText} numberOfLines={1}>
          {fileItem.duration}
        </Text>
      </View>

      <View style={styles.cellRow}>
        <Icon name="account-group" size={16} color="#ff6600" />
        <Text style={styles.cellText}>{fileItem.people}</Text>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  cell: {
    backgroundColor: '#fff',
    borderRadius: 6,
    padding: 5,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: '#eee',
  },
  selectedCell: {
    backgroundColor: '#e6f7ff',
    borderColor: '#00aaff',
  },
  cellRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
    marginBottom: 2,
  },
  cellText: {
    marginLeft: 3,
    fontSize: 12,
    color: '#555',
    flex: 1,
  },
});
