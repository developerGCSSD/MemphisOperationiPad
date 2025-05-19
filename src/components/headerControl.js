import React, {useEffect} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import {useSelector, useDispatch} from 'react-redux';
import {fetchDepartments} from '../redux/reducers/departmentsList'; // 👈 Make sure this path is correct

// In HeaderControls.js
export default function HeaderControls({
  selectedDepartment,
  dropdownOpen,
  onToggleDropdown,
  onSelectDepartment,
  showFilter = true, // 👈 new prop with default
}) {
  const dispatch = useDispatch();
  const {list: departmentList, loading} = useSelector(
    state => state.departments,
  );

  useEffect(() => {
    if (showFilter) {
      dispatch(fetchDepartments());
    }
  }, [dispatch, showFilter]);

  const departments = departmentList;
  const user = useSelector(state => state.auth.user);

  return (
    <View style={styles.topRow}>
      <View style={styles.leftContainer}>
        <View style={styles.languageBranchContainer}>
          {/* Department Dropdown */}
          {showFilter && (
            <TouchableOpacity
              style={styles.dropdown}
              onPress={onToggleDropdown}>
              <Text style={styles.dropdownText}>
                {selectedDepartment?.name || 'Select Department'}
              </Text>
              <Icon
                name={dropdownOpen ? 'chevron-up' : 'chevron-down'}
                size={20}
                color="#555"
              />
            </TouchableOpacity>
          )}

          {/* Branch Label */}
          <Text style={styles.branchLabel}>
            Branch: {user?.branch_name.split(' {')[0] || 'Unknown'}
          </Text>
        </View>

        {/* Dropdown List */}
        {showFilter && dropdownOpen && (
          <View style={styles.dropdownList}>
            <ScrollView
              style={styles.dropdownScroll}
              nestedScrollEnabled={true}>
              {departments.map(dept => (
                <TouchableOpacity
                  key={dept.id}
                  style={styles.dropdownItem}
                  onPress={() => onSelectDepartment(dept)}>
                  <Text style={styles.dropdownItemText}>{dept.name}</Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
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
    paddingHorizontal: 15,
    color: '#333',
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
  dropdownList: {
    position: 'absolute',
    top: 40,
    left: 0,
    zIndex: 10,
    backgroundColor: '#fff',
    borderColor: '#ddd',
    borderWidth: 1,
    borderRadius: 6,
    width: 180,
    elevation: 3,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 5,
    maxHeight: 200, // ⬅️ Limit height so scroll works
  },
  dropdownScroll: {
    maxHeight: 250, // ⬅️ Ensure ScrollView is constrained
  },
});
