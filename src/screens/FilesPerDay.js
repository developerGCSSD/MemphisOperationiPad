import React, {useState} from 'react';
import {View, Text, FlatList, StyleSheet, TouchableOpacity} from 'react-native';
import FileCell from '../components/fileCell';
import {useNavigation} from '@react-navigation/native';
import HeaderControls from '../components/headerControl';

export default function FilesPerDay({route}) {
  const {day, files} = route.params;
  const navigation = useNavigation();

  // --- Dropdown-related state ---
  const [selectedLanguage, setSelectedLanguage] = useState('English');
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const handleSelect = lang => {
    setSelectedLanguage(lang);
    setDropdownOpen(false);
  };

  // --- File selection state ---
  const [selectedFiles, setSelectedFiles] = useState([]);

  const toggleFileSelection = fileId => {
    const key = `${day.date}-${fileId}`;
    setSelectedFiles(prev =>
      prev.includes(key) ? prev.filter(id => id !== key) : [...prev, key],
    );
  };

  const isSelected = fileId => selectedFiles.includes(`${day.date}-${fileId}`);

  const handleNext = () => {
    navigation.navigate('AssignFiles', {selectedFiles});
  };

  return (
    <View style={styles.container}>
      {/* Header Dropdowns and Labels */}
      <HeaderControls
        selectedLanguage={selectedLanguage}
        dropdownOpen={dropdownOpen}
        onToggleDropdown={() => setDropdownOpen(prev => !prev)}
        onSelectLanguage={handleSelect}
      />

      {/* Heading */}
      <Text style={styles.heading}>
        {day.day} - {day.date}
      </Text>

      {/* File List */}
      <FlatList
        data={files}
        keyExtractor={item => item.id.toString()}
        numColumns={4}
        columnWrapperStyle={styles.row}
        renderItem={({item}) => (
          <FileCell
            day={day}
            fileItem={item}
            isSelected={isSelected(item.id)}
            onToggleSelect={() => toggleFileSelection(item.id)}
            style={styles.gridCell} // 👈 Add this
          />
        )}
        contentContainerStyle={styles.list}
      />

      {/* Next Button */}
      <View style={styles.nextButtonWrapper}>
        <TouchableOpacity
          style={[
            styles.nextButton,
            selectedFiles.length === 0 && styles.nextButtonDisabled,
          ]}
          onPress={handleNext}
          disabled={selectedFiles.length === 0}>
          <Text style={styles.nextButtonText}>Next</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: 'white',
  },
  heading: {
    fontSize: 22,
    fontWeight: 'bold',
    marginVertical: 35,
    color: '#27548A',
  },
  list: {
    paddingBottom: 20,
  },
  nextButton: {
    marginVertical: 16,
    backgroundColor: '#27548A',
    borderRadius: 8,
    paddingVertical: 12,
    alignItems: 'center',
    width: '40%',
  },
  nextButtonWrapper: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    margin: 20,
  },
  nextButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 18,
  },
  nextButtonDisabled: {
    backgroundColor: '#ccc',
  },
  gridCell: {
    width: '23%',
    marginBottom: 12,
  },
  row: {
    gap: 15,
    marginBottom: 10,
  },
});
