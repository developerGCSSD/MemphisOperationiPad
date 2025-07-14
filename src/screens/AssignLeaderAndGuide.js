/* eslint-disable no-unused-vars */
/* eslint-disable react-native/no-inline-styles */
import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  ScrollView,
  Alert,
} from 'react-native';
import {useRoute, useNavigation} from '@react-navigation/native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import RadioButtonCard from '../components/RadioButtonCard';
import {useDispatch, useSelector} from 'react-redux';
import {fetchAssignments} from '../redux/reducers/assignmentLists';
import {
  sendBulkAssignment,
  clearBulkAssignmentState,
} from '../redux/reducers/bulkAssignment';

export default function AssignLeaderAndGuide() {
  const route = useRoute();
  const navigation = useNavigation();
  const {selectedFiles, selectedDeptId} = route.params;
  const [selectedLeader, setSelectedLeader] = useState(null);
  const [selectedGuide, setSelectedGuide] = useState(null);

  const dispatch = useDispatch();

  const {leaders, guides, loading, error} = useSelector(
    state => state.assignments,
  );

  // console.log('Selected Leader ID:', selectedLeader);
  // console.log(
  //   'Leaders List:',
  //   leaders.map(l => l.id),
  // );

  const {
    loading: assignLoading,
    success,
    error: assignError,
  } = useSelector(state => state.bulkAssignment);

  useEffect(() => {
    dispatch(
      fetchAssignments({
        assignmentType: 'Leader',
        departmentId: selectedDeptId,
      }),
    );
    dispatch(
      fetchAssignments({
        assignmentType: 'Guide',
        departmentId: selectedDeptId,
      }),
    );
  }, [dispatch, selectedDeptId]);

  useEffect(() => {
    if (success) {
      // Find leader and guide names from their IDs
      const leaderName = selectedLeader?.name || 'N/A';
      const guideName = selectedGuide?.name || 'N/A';

      // Join file IDs for display
      const fileIdsText = selectedFiles.join(', ');

      Alert.alert(
        'Assignment Successful',
        `Files: ${fileIdsText}\nLeader: ${leaderName}\nGuide: ${guideName}`,
        [
          {
            text: 'OK',
            onPress: () => {
              dispatch(clearBulkAssignmentState());
              navigation.goBack();
            },
          },
        ],
      );
    }
  }, [
    success,
    dispatch,
    navigation,
    selectedLeader,
    selectedGuide,
    selectedFiles,
    leaders,
    guides,
  ]);

  console.log('Leaders:', leaders);
  console.log('Guides:', guides);
  const handleAssign = () => {
    dispatch(
      sendBulkAssignment({
        file_ids: selectedFiles,
        leader_id: selectedLeader?.id || '',
        guide_id: selectedGuide?.id || '',
        driver_id: '',
        type: 1,
      }),
    );
  };

  const isAssignEnabled = selectedLeader !== null || selectedGuide !== null;

  if (loading) {
    return <ActivityIndicator size="large" color="#0000ff" />;
  }

  if (error) {
    return <Text>{`Error: ${error}`}</Text>;
  }

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <Text style={styles.title}>Selected Files</Text>

        {/* File List */}
        <View style={styles.fileListWrapper}>
          {selectedFiles
            .filter(item => item) // Remove null/undefined
            .map((item, index) => (
              <View key={`${item}-${index}`} style={styles.cardWrapper}>
                <View style={styles.card}>
                  <Icon name="folder" size={16} color="#f4c430" />
                  <Text style={styles.cardText}>{item}</Text>
                </View>
              </View>
            ))}
        </View>

        {/* Leader Selection */}
        <Text style={styles.sectionTitle}>Select Leader</Text>
        <RadioButtonCard
          options={leaders}
          selectedOption={selectedLeader}
          setSelectedOption={setSelectedLeader}
        />

        {/* Guide Selection */}
        <Text style={styles.sectionTitle}>Select Guide</Text>
        <RadioButtonCard
          options={guides}
          selectedOption={selectedGuide}
          setSelectedOption={setSelectedGuide}
        />

        {/* Buttons at the end */}
        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={[styles.nextButton, styles.cancelButton]}
            onPress={() => navigation.goBack()}>
            <Text style={styles.nextButtonText}>Cancel</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.nextButton,
              {backgroundColor: isAssignEnabled ? '#27548A' : '#d3d3d3'},
            ]}
            disabled={!isAssignEnabled || assignLoading}
            onPress={handleAssign}>
            {assignLoading ? (
              <ActivityIndicator color="white" />
            ) : (
              <Text style={styles.nextButtonText}>Assign</Text>
            )}
          </TouchableOpacity>
        </View>
      </ScrollView>
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
    marginTop: 30,
    marginBottom: 40,
    gap: 10,
  },
  cancelButton: {
    backgroundColor: '#C5172E',
  },
  scrollContent: {
    paddingBottom: 40,
  },
});
