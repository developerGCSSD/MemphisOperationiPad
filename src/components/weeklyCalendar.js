import React, {useState, useEffect} from 'react';
import {View, Text, StyleSheet, TouchableOpacity} from 'react-native';
import moment from 'moment';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
export default function WeeklyCalendar({
  onSelectDate,
  startOfWeekFromPending,
  selectedDateFromPending,
}) {
  const today = moment();
  const [currentWeekDate, setCurrentWeekDate] = useState(today);
  const [selectedDate, setSelectedDate] = useState(null);

  useEffect(() => {
    if (startOfWeekFromPending) {
      setCurrentWeekDate(startOfWeekFromPending);
    }
  }, [startOfWeekFromPending]);

  const startOfWeek = moment(currentWeekDate).startOf('week');
  const daysOfWeek = Array.from({length: 7}).map((_, index) =>
    moment(startOfWeek).add(index, 'days'),
  );

  // const handlePrevWeek = () => {
  //   setCurrentWeekDate(prev => moment(prev).subtract(7, 'days'));
  // };

  // const handleNextWeek = () => {
  //   setCurrentWeekDate(prev => moment(prev).add(7, 'days'));
  // };

  const isToday = date => date.isSame(today, 'day');
  const isSelected = date =>
    selectedDateFromPending && date.isSame(selectedDateFromPending, 'day');

  const handleDateSelect = date => {
    setSelectedDate(date);
    onSelectDate(date); // Pass the selected date to the parent component
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.monthYearText}>
          {currentWeekDate.format('MMMM YYYY')}
        </Text>
        {/* <View style={styles.arrowsContainer}>
          <TouchableOpacity onPress={handlePrevWeek} style={styles.arrowButton}>
            <Icon name="chevron-left" size={26} color="#007bff" />
          </TouchableOpacity>
          <TouchableOpacity onPress={handleNextWeek} style={styles.arrowButton}>
            <Icon name="chevron-right" size={26} color="#007bff" />
          </TouchableOpacity>
        </View> */}
      </View>

      <View style={styles.weekRow}>
        {daysOfWeek.map((day, index) => {
          const selectedMarked = isSelected(day);
          const todayMarked = isToday(day) && !selectedMarked;

          return (
            <TouchableOpacity
              key={index}
              style={[
                styles.dayContainer,
                todayMarked && styles.todayHighlight,
                selectedMarked && styles.selectedDayHighlight,
              ]}
              onPress={() => handleDateSelect(day)}>
              <Text
                style={[
                  styles.dayText,
                  todayMarked && styles.todayText,
                  selectedMarked && styles.selectedDayText,
                ]}>
                {day.format('ddd')}
              </Text>
              <Text
                style={[
                  styles.dateText,
                  todayMarked && styles.todayText,
                  selectedMarked && styles.selectedDayText,
                ]}>
                {day.format('D')}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 10,
    marginTop: 10,
    backgroundColor: '#fff',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
    marginBottom: 8,
    marginLeft: 10,
  },
  monthYearText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#27548A',
  },
  arrowsContainer: {
    flexDirection: 'row',
  },
  arrowButton: {
    marginHorizontal: 10,
    padding: 5,
    backgroundColor: '#e6f0ff',
    borderRadius: 20,
  },
  weekRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 5,
    marginBottom: 5,
  },
  dayContainer: {
    alignItems: 'center',
    flex: 1,
    marginHorizontal: 5,
    padding: 3,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#eee',
    backgroundColor: '#f9f9f9',
  },
  todayHighlight: {
    backgroundColor: '#e6f7ff',
    borderColor: '#007bff',
  },
  todayText: {
    color: '#007bff',
    fontWeight: 'bold',
    fontSize: 13,
  },
  selectedDayHighlight: {
    backgroundColor: '#e6f7ff', // Strong deep blue
    borderColor: '#007bff',
    borderWidth: 2, // Slightly thicker
  },
  selectedDayText: {
    color: '#27548A',
    fontWeight: 'bold',
    fontSize: 14, // Slightly bigger
  },
  dayText: {
    fontSize: 13,
    fontWeight: 'bold',
    color: '#27548A', // Default text color
  },
  dateText: {
    fontSize: 12,
    color: '#555',
  },
});
