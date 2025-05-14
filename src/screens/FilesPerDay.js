import React, {useState, useEffect} from 'react';
import {View, Text, FlatList, StyleSheet, TouchableOpacity} from 'react-native';
import FileCell from '../components/fileCell';
import {useNavigation} from '@react-navigation/native';
import HeaderControls from '../components/headerControl';
import {fetchDepartments} from '../redux/reducers/departmentsList';
import {useDispatch, useSelector} from 'react-redux';
export default function FilesPerDay({route}) {
  const {day, files} = route.params;
  console.log('44444444444444', files);
  const navigation = useNavigation();

  const [selectedDept, setSelectedDept] = useState(null);
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const dispatch = useDispatch();
  const {list: departments, loading} = useSelector(state => state.departments);

  useEffect(() => {
    dispatch(fetchDepartments());
  }, [dispatch]);

  useEffect(() => {
    if (!loading && departments.length > 0 && !selectedDept) {
      const defaultDept = departments.find(
        dept => dept.name === 'English Eagles Team',
      );
      if (defaultDept) {
        setSelectedDept(defaultDept);
      }
    }
  }, [loading, departments, selectedDept]);

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
    navigation.navigate('AssignFiles', {
      selectedFiles,
      selectedLanguageId: selectedDept?.id,
    });
    console.log('okokokok', selectedFiles, selectedDept?.id);
  };

  return (
    <View style={styles.container}>
      {/* Header Dropdowns and Labels */}
      <HeaderControls
        selectedDepartment={selectedDept}
        dropdownOpen={dropdownOpen}
        onToggleDropdown={() => setDropdownOpen(!dropdownOpen)}
        onSelectDepartment={setSelectedDept}
        showFilter={false}
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
            style={styles.gridCell}
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
