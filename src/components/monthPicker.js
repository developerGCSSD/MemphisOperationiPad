import React, {useState} from 'react';
import {View, Text, TouchableOpacity, Modal, StyleSheet} from 'react-native';
import moment from 'moment';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

export default function MonthPicker() {
  const today = moment();
  const [modalVisible, setModalVisible] = useState(false);
  const [currentMonth, setCurrentMonth] = useState(moment());

  const startOfMonth = moment(currentMonth).startOf('month');
  const startOfCalendar = moment(startOfMonth).startOf('week'); // Start from Sunday
  const days = [];

  for (let i = 0; i < 42; i++) {
    // 6 weeks * 7 days
    days.push(moment(startOfCalendar).add(i, 'days'));
  }

  const handlePrevMonth = () => {
    setCurrentMonth(prev => moment(prev).subtract(1, 'month'));
  };

  const handleNextMonth = () => {
    setCurrentMonth(prev => moment(prev).add(1, 'month'));
  };

  const isToday = date => date.isSame(today, 'day');
  const isCurrentMonth = date => date.isSame(currentMonth, 'month');

  return (
    <View>
      {/* Clickable Box */}
      <TouchableOpacity
        style={styles.box}
        onPress={() => setModalVisible(true)}>
        <Text style={styles.boxText}>
          {currentMonth.startOf('week').format('D')} -{' '}
          {currentMonth.endOf('week').format('D MMM')}
        </Text>
        <Icon name="calendar-month-outline" size={20} color="#27548A" />
      </TouchableOpacity>

      {/* Modal */}
      <Modal visible={modalVisible} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            {/* Header */}
            <View style={styles.modalHeader}>
              <TouchableOpacity onPress={handlePrevMonth}>
                <Icon name="chevron-left" size={28} color="#007bff" />
              </TouchableOpacity>
              <Text style={styles.monthText}>
                {currentMonth.format('MMMM YYYY')}
              </Text>
              <TouchableOpacity onPress={handleNextMonth}>
                <Icon name="chevron-right" size={28} color="#007bff" />
              </TouchableOpacity>
            </View>

            {/* Calendar Grid */}
            <View style={styles.daysRow}>
              {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(
                (day, index) => (
                  <Text key={index} style={styles.dayLabel}>
                    {day}
                  </Text>
                ),
              )}
            </View>

            <View style={styles.calendarGrid}>
              {days.map((day, index) => (
                <TouchableOpacity
                  key={index}
                  style={[
                    styles.dayCell,
                    isToday(day) && styles.todayHighlight,
                    !isCurrentMonth(day) && styles.outsideMonth,
                  ]}
                  onPress={() => {
                    setModalVisible(false);
                    // Add action here when user selects a date
                  }}>
                  <Text style={styles.dayText}>{day.date()}</Text>
                </TouchableOpacity>
              ))}
            </View>

            {/* Close button */}
            <TouchableOpacity
              style={styles.closeButton}
              onPress={() => setModalVisible(false)}>
              <Text style={styles.closeButtonText}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  box: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 10,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#cce0ff',
    backgroundColor: '#fff',
    margin: 10,
    marginLeft: 15,
    paddingHorizontal: 25,
  },
  boxText: {
    fontSize: 16,
    color: '#27548A',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    width: '90%',
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  monthText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#27548A',
  },
  daysRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  dayLabel: {
    width: 32,
    textAlign: 'center',
    fontSize: 12,
    color: '#888',
  },
  calendarGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  dayCell: {
    width: '14.2%',
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: 2,
  },
  dayText: {
    fontSize: 14,
    color: '#333',
  },
  todayHighlight: {
    backgroundColor: '#cce0ff',
    borderRadius: 20,
  },
  outsideMonth: {
    opacity: 0.4,
  },
  closeButton: {
    marginTop: 10,
    paddingVertical: 8,
    borderRadius: 8,
    backgroundColor: '#007bff',
  },
  closeButtonText: {
    color: 'white',
    textAlign: 'center',
    fontSize: 16,
  },
});
