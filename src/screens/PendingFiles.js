/* eslint-disable react-native/no-inline-styles */
import {useNavigation} from '@react-navigation/native';
import React, {useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  Dimensions,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import moment from 'moment';
import WeeklyCalendar from '../components/weeklyCalendar';
import FileCell from '../components/fileCell';
import HeaderControls from '../components/headerControl';

const LANGUAGES = [
  'English',
  'Spanish',
  'French',
  'German',
  'Hindi',
  'Chinese',
];

const CELL_DATA = Array.from({length: 10}, (_, i) => ({
  id: i,
  fileName: `#10222/${i + 1}`,
  duration: '1/4/2025 – 20/4/2025',
  people: `${10 + i}`,
}));

const windowWidth = Dimensions.get('window').width;

export default function PendingFiles() {
  const [selectedLanguage, setSelectedLanguage] = useState('English');
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [currentDayIndex, setCurrentDayIndex] = useState(0);
  const [startOfWeek, setStartOfWeek] = useState(moment());
  const [selectedDate, setSelectedDate] = useState(null); // New state to store selected date

  const today = moment().format('D/M/YYYY');
  const navigation = useNavigation();

  const handleSelect = lang => {
    setSelectedLanguage(lang);
    setDropdownOpen(false);
  };

  const handleSeeAll = (day, index) => {
    navigation.navigate('filesPerDay', {
      day,
      files: CELL_DATA,
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
    navigation.navigate('AssignFiles', {selectedFiles});
    console.log(selectedFiles);
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

  return (
    <View style={{flex: 1, padding: 10, backgroundColor: 'white'}}>
      {/* Dropdown & Labels Row */}
      <HeaderControls
        selectedLanguage={selectedLanguage}
        dropdownOpen={dropdownOpen}
        onToggleDropdown={() => setDropdownOpen(prev => !prev)}
        onSelectLanguage={handleSelect}
      />

      {/* Calendar View */}
      <WeeklyCalendar onSelectDate={handleDateSelect} />

      {/* Days Navigation */}
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
            const isLastColumn = index === 3; // because you have 4 items: index 0,1,2,3

            return (
              <View
                style={[
                  styles.column,
                  isToday && styles.todayColumn,
                  isLastColumn && {borderRightWidth: 0}, // remove right border for last column
                ]}>
                <View style={styles.header}>
                  <Text style={[styles.day, isToday && styles.highlightedDay]}>
                    {item.day}
                  </Text>
                  <Text style={styles.date}>{item.date}</Text>
                </View>

                {CELL_DATA.slice(0, 10).map((fileItem, rowIndex) => {
                  const selected = isSelected(item, fileItem.id);
                  return (
                    <FileCell
                      key={rowIndex}
                      day={item}
                      fileItem={fileItem}
                      isSelected={selected}
                      onToggleSelect={toggleFileSelection}
                    />
                  );
                })}

                <TouchableOpacity
                  style={styles.seeAllButton}
                  onPress={() => handleSeeAll(item, currentDayIndex)}>
                  <Text style={styles.seeAllText}>See All</Text>
                </TouchableOpacity>
              </View>
            );
          }}
          showsHorizontalScrollIndicator={false}
        />

        <TouchableOpacity style={styles.arrowButton} onPress={goToNext}>
          <Icon name="chevron-right" size={30} color="#007bff" />
        </TouchableOpacity>
      </View>

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
    margin: 10,
  },
  nextButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 18,
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
