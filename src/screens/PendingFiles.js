import {useNavigation} from '@react-navigation/native';
import React, {useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  FlatList,
  Dimensions,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import moment from 'moment';

const LANGUAGES = [
  'English',
  'Spanish',
  'French',
  'German',
  'Hindi',
  'Chinese',
];

const DAYS = [
  {day: 'Sunday', date: '6/4/2025'},
  {day: 'Monday', date: '7/4/2025'},
  {day: 'Tuesday', date: '8/4/2025'},
  {day: 'Wednesday', date: '9/4/2025'},
  {day: 'Thursday', date: '10/4/2025'},
  {day: 'Friday', date: '11/4/2025'},
  {day: 'Saturday', date: '12/4/2025'},
];

const CELL_DATA = Array.from({length: 10}, (_, i) => ({
  id: i,
  fileName: `#10222/${i + 1}`,
  duration: '1/4 – 20/4',
  people: `${10 + i}`,
}));

const windowWidth = Dimensions.get('window').width;

export default function PendingFiles() {
  const [selectedLanguage, setSelectedLanguage] = useState('English');
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [currentDayIndex, setCurrentDayIndex] = useState(0);
  const [startOfWeek, setStartOfWeek] = useState(moment().startOf('week'));
  const today = moment().format('D/M/YYYY');
  const navigation = useNavigation();

  const handleSelect = lang => {
    setSelectedLanguage(lang);
    setDropdownOpen(false);
  };

  const handleSeeAll = (day, index) => {
    console.log(
      `See all pressed for ${day.day} (${day.date}), column index: ${index}`,
    );
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
    for (let i = 0; i < 7; i++) {
      const day = moment(startOfWeek).add(i, 'days');
      days.push({
        day: day.format('dddd'), // Sunday, Monday, etc.
        date: day.format('D/M/YYYY'), // 6/4/2025
      });
    }
    return days;
  };

  const goToPrevious = () => {
    setStartOfWeek(prev => moment(prev).subtract(4, 'days'));
  };

  const goToNext = () => {
    setStartOfWeek(prev => moment(prev).add(4, 'days'));
  };

  return (
    <View style={{flex: 1, padding: 10, backgroundColor: 'white'}}>
      {/* Dropdown & Labels Row */}
      <View style={styles.topRow}>
        <View style={styles.leftContainer}>
          <TouchableOpacity
            style={styles.dropdown}
            onPress={() => setDropdownOpen(!dropdownOpen)}>
            <Text style={styles.dropdownText}>{selectedLanguage}</Text>
            <Icon
              name={dropdownOpen ? 'chevron-up' : 'chevron-down'}
              size={20}
              color="#555"
            />
          </TouchableOpacity>

          {dropdownOpen && (
            <View style={styles.dropdownList}>
              {LANGUAGES.map(lang => (
                <TouchableOpacity
                  key={lang}
                  style={styles.dropdownItem}
                  onPress={() => handleSelect(lang)}>
                  <Text style={styles.dropdownItemText}>{lang}</Text>
                </TouchableOpacity>
              ))}
            </View>
          )}
        </View>

        {/* Icon Labels */}
        <View style={styles.labelsContainer}>
          <View style={styles.label}>
            <Icon name="folder" size={18} color="#f4c430" />
            <Text style={styles.labelText}>File Name</Text>
          </View>
          <View style={styles.label}>
            <Icon name="clock-time-four-outline" size={18} color="#00aaff" />
            <Text style={styles.labelText}>Duration</Text>
          </View>
          <View style={styles.label}>
            <Icon name="account-group" size={18} color="#ff6600" />
            <Text style={styles.labelText}>Number Of People</Text>
          </View>
        </View>
      </View>

      {/* Days Navigation */}
      <View style={styles.dayNavContainer}>
        <TouchableOpacity style={styles.arrowButton} onPress={goToPrevious}>
          <Icon name="chevron-left" size={30} color="#333" />
        </TouchableOpacity>

        <FlatList
          horizontal
          data={getWeekDays().slice(0, 5)}
          keyExtractor={item => item.date}
          renderItem={({item}) => {
            const isToday = item.date === today;

            return (
              <View style={[styles.column, isToday && styles.todayColumn]}>
                <View style={styles.header}>
                  <Text style={[styles.day, isToday && styles.highlightedDay]}>
                    {item.day}
                  </Text>
                  <Text style={styles.date}>{item.date}</Text>
                </View>

                {CELL_DATA.map((fileItem, rowIndex) => {
                  const selected = isSelected(item, fileItem.id);
                  return (
                    <TouchableOpacity
                      key={rowIndex}
                      style={[styles.cell, selected && styles.selectedCell]}
                      onPress={() => toggleFileSelection(item, fileItem.id)}>
                      <View style={styles.cellRow}>
                        <Icon name="folder" size={16} color="#f4c430" />
                        <Text style={styles.cellText}>{fileItem.fileName}</Text>
                      </View>
                      <View style={styles.cellRow}>
                        <Icon
                          name="clock-time-four-outline"
                          size={16}
                          color="#00aaff"
                        />
                        <Text style={styles.cellText}>{fileItem.duration}</Text>
                      </View>
                      <View style={styles.cellRow}>
                        <Icon name="account-group" size={16} color="#ff6600" />
                        <Text style={styles.cellText}>{fileItem.people}</Text>
                      </View>
                    </TouchableOpacity>
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
          <Icon name="chevron-right" size={30} color="#333" />
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
    width: windowWidth / 6,
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
    margin: 20,
  },
  nextButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 18,
  },
  nextButtonDisabled: {
    backgroundColor: '#ccc', // light gray to indicate disabled
  },
  dayNavContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
  },
  arrowButton: {
    padding: 10,
    backgroundColor: '#f0f0f0',
    borderRadius: 50,
  },
  highlightedDay: {
    color: '#007bff',
    fontWeight: 'bold',
    fontSize: 16,
  },
});
