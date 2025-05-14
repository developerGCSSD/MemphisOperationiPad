/* eslint-disable no-unused-vars */
/* eslint-disable react-native/no-inline-styles */
import {useNavigation} from '@react-navigation/native';
import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  Dimensions,
  ActivityIndicator,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import moment from 'moment';
import WeeklyCalendar from '../components/weeklyCalendar';
import FileCell from '../components/fileCell';
import HeaderControls from '../components/headerControl';
import {useDispatch, useSelector} from 'react-redux';
import {fetchDepartments} from '../redux/reducers/departmentsList';
import {fetchUnassignedFiles} from '../redux/reducers/unassignedFiles';

const windowWidth = Dimensions.get('window').width;

export default function PendingFiles() {
  const [selectedDept, setSelectedDept] = useState(null);
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const [selectedFiles, setSelectedFiles] = useState([]);
  const [currentDayIndex, setCurrentDayIndex] = useState(0);
  const [startOfWeek, setStartOfWeek] = useState(moment());
  const [selectedDate, setSelectedDate] = useState(null); // New state to store selected date

  const today = moment().format('D/M/YYYY');
  const navigation = useNavigation();

  const dispatch = useDispatch();

  const {list: departments, loading} = useSelector(state => state.departments);
  const {
    list: unassignedFiles,
    loading: filesLoading,
    error,
  } = useSelector(state => state.unassignedFiles);

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

  useEffect(() => {
    if (selectedDept?.id) {
      dispatch(fetchUnassignedFiles(selectedDept.id));
    }
  }, [selectedDept, dispatch]);

  useEffect(() => {
    if (unassignedFiles && unassignedFiles.length > 0) {
      // Step 1: Get the earliest arrival date
      const earliestArrival = unassignedFiles
        .map(file => moment(file.arrival_date))
        .sort((a, b) => a - b)[0]; // get earliest

      // Step 2: Set selectedDate and startOfWeek to this date
      setSelectedDate(earliestArrival);
      setStartOfWeek(moment(earliestArrival).startOf('week'));
    }
  }, [unassignedFiles]);

  const handleSeeAll = (day, index) => {
    const filteredFiles = unassignedFiles.filter(
      file => moment(file.arrival_date).format('D/M/YYYY') === day.date,
    );

    navigation.navigate('filesPerDay', {
      day,
      files: filteredFiles, // ✅ only files for that day
      selectedFiles,
      toggleFileSelection,
    });
  };

  const toggleFileSelection = (day, fileId) => {
    const key = `${day.date}-${fileId}`;
    setSelectedFiles(prev =>
      prev.includes(key) ? prev.filter(id => id !== key) : [...prev, key],
    );
  };

  const isSelected = (day, fileId) => {
    const key = `${day.date}-${fileId}`;
    return selectedFiles.includes(key);
  };

  const handleNext = () => {
    navigation.navigate('AssignFiles', {
      selectedFiles,
      selectedLanguageId: selectedDept?.id,
    });
    console.log('okokokok', selectedFiles, setSelectedDept?.id);
  };

  const getWeekDays = () => {
    const days = [];
    const startDay = startOfWeek; // Get the starting day of the week
    const orderedDays = selectedDate
      ? [
          selectedDate,
          ...Array.from({length: 6}, (_, i) =>
            moment(selectedDate).add(i + 1, 'days'),
          ),
        ]
      : Array.from({length: 7}, (_, i) => moment(startDay).add(i, 'days'));

    orderedDays.forEach(day => {
      days.push({
        day: day.format('dddd'),
        date: day.format('D/M/YYYY'),
      });
    });
    return days;
  };

  const goToPrevious = () => {
    const currentFirstDate = selectedDate || startOfWeek;
    const newDate = moment(currentFirstDate, 'D/M/YYYY').subtract(4, 'days');
    setStartOfWeek(newDate);
    setSelectedDate(newDate);
  };

  const goToNext = () => {
    const currentFirstDate = selectedDate || startOfWeek;
    const newDate = moment(currentFirstDate, 'D/M/YYYY').add(4, 'days');
    setStartOfWeek(newDate);
    setSelectedDate(newDate);
  };

  const handleDateSelect = date => {
    setSelectedDate(date); // Store the selected date
    setStartOfWeek(moment(date).startOf('week')); // Set the startOfWeek to the selected date's week
  };
  // console.log('99999', unassignedFiles);
  return (
    <View style={{flex: 1, padding: 10, backgroundColor: 'white'}}>
      {/* Dropdown & Labels Row */}
      <HeaderControls
        selectedDepartment={selectedDept}
        dropdownOpen={dropdownOpen}
        onToggleDropdown={() => setDropdownOpen(!dropdownOpen)}
        onSelectDepartment={dept => {
          setSelectedDept(dept);
          setDropdownOpen(false); // close the dropdown after selection
        }}
      />

      {/* Calendar View */}
      <WeeklyCalendar onSelectDate={handleDateSelect} />

      {/* {error && <Text style={{color: 'red'}}>Error: {error}</Text>} */}
      {/* Days Navigation */}
      {filesLoading ? (
        <ActivityIndicator size="large" color="#007bff" />
      ) : !Array.isArray(unassignedFiles) ||
        unassignedFiles.length === 0 ||
        error ? (
        <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
          <Text style={{fontSize: 16, color: '#888'}}>
            No unassigned files found for this department.
          </Text>
        </View>
      ) : (
        <View style={styles.dayNavContainer}>
          <TouchableOpacity style={styles.arrowButton} onPress={goToPrevious}>
            <Icon name="chevron-left" size={30} color="#007bff" />
          </TouchableOpacity>

          <FlatList
            horizontal
            data={getWeekDays().slice(0, 4)}
            keyExtractor={item => item.date}
            renderItem={({item, index}) => {
              const isToday = item.date === today;
              const isLastColumn = index === 3;

              return (
                <View
                  style={[
                    styles.column,
                    isToday && styles.todayColumn,
                    isLastColumn && {borderRightWidth: 0},
                  ]}>
                  <View style={styles.header}>
                    <Text
                      style={[styles.day, isToday && styles.highlightedDay]}>
                      {item.day}
                    </Text>
                    <Text style={styles.date}>{item.date}</Text>
                  </View>

                  {unassignedFiles
                    .filter(
                      file =>
                        moment(file.arrival_date).format('D/M/YYYY') ===
                        item.date,
                    )
                    .map((fileItem, rowIndex) => {
                      const selected = isSelected(item, fileItem.id);
                      const transformedFileItem = {
                        id: fileItem.id,
                        fileName: `${fileItem.id}`,
                        duration: `${fileItem.arrival_date} – ${fileItem.departure_date}`,
                        people: fileItem.client_name,
                      };

                      return (
                        <FileCell
                          key={rowIndex}
                          day={item}
                          fileItem={transformedFileItem}
                          isSelected={selected}
                          onToggleSelect={toggleFileSelection}
                        />
                      );
                    })}

                  {unassignedFiles.some(
                    file =>
                      moment(file.arrival_date).format('D/M/YYYY') ===
                      item.date,
                  ) && (
                    <TouchableOpacity
                      style={styles.seeAllButton}
                      onPress={() => handleSeeAll(item, currentDayIndex)}>
                      <Text style={styles.seeAllText}>See All</Text>
                    </TouchableOpacity>
                  )}
                </View>
              );
            }}
            showsHorizontalScrollIndicator={false}
          />

          <TouchableOpacity style={styles.arrowButton} onPress={goToNext}>
            <Icon name="chevron-right" size={30} color="#007bff" />
          </TouchableOpacity>
        </View>
      )}

      {/* Bottom Next Button */}
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
  topRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  leftContainer: {
    position: 'relative',
  },
  dropdown: {
    flexDirection: 'row',
    alignItems: 'center',
    borderColor: '#ddd',
    borderWidth: 1,
    borderRadius: 6,
    paddingHorizontal: 10,
    paddingVertical: 6,
    backgroundColor: '#fff',
  },
  dropdownText: {
    fontWeight: '600',
    marginleft: 5,
    paddingHorizontal: 15,
    color: '#333',
  },
  dropdownList: {
    position: 'absolute',
    top: 40,
    left: 0,
    zIndex: 10,
    backgroundColor: '#fff',
    borderColor: '#ddd',
    borderWidth: 1,
    borderRadius: 6,
    width: 120,
    elevation: 3,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 5,
  },
  dropdownItem: {
    paddingVertical: 8,
    paddingHorizontal: 10,
  },
  dropdownItemText: {
    fontSize: 14,
    color: '#333',
  },
  labelsContainer: {
    flexDirection: 'row',
    gap: 20,
    alignItems: 'center',
  },
  label: {
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: 10,
  },
  labelText: {
    marginLeft: 4,
    fontSize: 14,
    color: '#555',
  },
  tableWrapper: {
    marginTop: 20,
  },
  column: {
    width: windowWidth / 4.7,
    padding: 8,
    borderRightWidth: 1,
    borderColor: '#eee',
  },
  header: {
    alignItems: 'center',
    marginBottom: 8,
  },
  day: {
    fontWeight: 'bold',
    color: '#333',
  },
  date: {
    fontSize: 12,
    color: '#888',
  },
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
  seeAllButton: {
    marginTop: 4,
    backgroundColor: '#e6f0ff',
    borderRadius: 6,
    paddingVertical: 6,
    alignItems: 'center',
  },
  seeAllText: {
    color: '#007bff',
    fontWeight: 'bold',
  },
  nextButton: {
    backgroundColor: '#27548A',
    borderRadius: 8,
    paddingVertical: 12,
    paddingHorizontal: 20,
    alignItems: 'center',
    width: 300, // Optional: Adjust the width of the button
  },
  nextButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 18,
  },
  nextButtonWrapper: {
    position: 'absolute', // Keep the button fixed
    bottom: 40, // Distance from the bottom of the screen
    right: 20, // Distance from the right of the screen
    paddingHorizontal: 10,
    paddingVertical: 10,
    backgroundColor: 'transparent',
    justifyContent: 'flex-end',
  },
  nextButtonDisabled: {
    backgroundColor: '#ccc',
  },
  dayNavContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
  },
  arrowButton: {
    padding: 10,
    backgroundColor: '#e6f0ff',
    borderRadius: 50,
  },
  highlightedDay: {
    color: '#007bff',
    fontWeight: 'bold',
  },
  languageBranchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 20,
  },
  branchLabel: {
    fontSize: 16,
    color: '#007bff',
    fontWeight: '600',
  },
});
