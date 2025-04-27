import React, {useState} from 'react';
import {View, Text, StyleSheet, TouchableOpacity} from 'react-native';
import {useRoute, useNavigation} from '@react-navigation/native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import RadioButtonCard from '../components/RadioButtonCard';

export default function AssignLeaderAndGuide() {
  const route = useRoute();
  const navigation = useNavigation(); // Navigation hook to go back
  const {selectedFiles} = route.params;
  const [selectedLeader, setSelectedLeader] = useState(null);
  const [selectedGuide, setSelectedGuide] = useState(null);

  const leaderOptions = [
    'Ali Mohamed',
    'Mohamed Ahmed',
    'Yara Gamal',
    'Hassan Mohamed',
    'John Doe',
    'Nour Saleh',
    'Mai Ahmed',
    'Khaled Elnabawy',
    'Ramez Galal',
    'Tamer Ashor',
  ];

  const guideOptions = [
    'Tamer Hosny',
    'Angham',
    'Billie Eilish',
    'Hamaki',
    'Carol Smaha',
    'Carmen Seliman',
  ];

  const isAssignEnabled = selectedLeader !== null && selectedGuide !== null;

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Selected Files</Text>
      {/* File List (wrapped rows instead of horizontal scroll) */}
      <View style={styles.fileListWrapper}>
        {selectedFiles.map((item, index) => (
          <View key={`${item}-${index}`} style={styles.cardWrapper}>
            <View style={styles.card}>
              <Icon name="folder" size={16} color="#f4c430" />
              <Text style={styles.cardText}>{item}</Text>
            </View>
          </View>
        ))}
      </View>

      {/* Leader Selection */}
      <View>
        <Text style={styles.sectionTitle}>Select Leader</Text>
        <RadioButtonCard
          options={leaderOptions}
          selectedOption={selectedLeader}
          setSelectedOption={setSelectedLeader}
        />
      </View>

      {/* Guide Selection */}
      <View>
        <Text style={styles.sectionTitle}>Select Guide</Text>
        <RadioButtonCard
          options={guideOptions}
          selectedOption={selectedGuide}
          setSelectedOption={setSelectedGuide}
        />
      </View>

      {/* Button Container */}
      <View style={styles.buttonContainer}>
        {/* Cancel Button */}
        <TouchableOpacity
          style={[styles.nextButton, styles.cancelButton]}
          onPress={() => navigation.goBack()} // Navigate back to previous screen
        >
          <Text style={styles.nextButtonText}>Cancel</Text>
        </TouchableOpacity>

        {/* Assign Button */}
        <TouchableOpacity
          style={[
            styles.nextButton,
            {backgroundColor: isAssignEnabled ? '#27548A' : '#d3d3d3'},
          ]}
          disabled={!isAssignEnabled}>
          <Text style={styles.nextButtonText}>Assign</Text>
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
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 25,
  },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderColor: '#eee',
    borderWidth: 1,
    borderRadius: 6,
    paddingHorizontal: 10,
    paddingVertical: 6,
    marginRight: 10,
    elevation: 2,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 2,
  },
  cardText: {
    marginLeft: 6,
    fontSize: 14,
    color: '#333',
  },
  cardWrapper: {
    marginRight: 10,
    marginBottom: 10,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    margin: 15,
    marginTop: 30,
  },
  fileListWrapper: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 12,
  },
  nextButton: {
    paddingVertical: 12,
    borderRadius: 6,
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: '1%',
    width: '35%',
  },
  nextButtonText: {
    fontSize: 18,
    color: 'white',
    fontWeight: 'bold',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    position: 'absolute',
    bottom: '10%',
    right: 16,
  },
  cancelButton: {
    backgroundColor: '#C5172E', // Background color for Cancel button
  },
});
