import {View, StyleSheet, ScrollView} from 'react-native';
import React from 'react';
import ClickableCard from '../components/dashboardCard';

export default function Dashboard({navigation}) {
  const filePending = require('../assets/hourglass.png');
  const assignedFiles = require('../assets/folders.png');
  const leader = require('../assets/team-leader.png');
  const guide = require('../assets/tour-guide.png');
  const fileJounry = require('../assets/sending.png');
  const itemization = require('../assets/classification.png');
  return (
    <ScrollView style={styles.scroll} contentContainerStyle={styles.container}>
      <View style={styles.column}>
        <ClickableCard imageSource={fileJounry} label={'File Journy'} />
        <ClickableCard
          imageSource={filePending}
          label={'Files Assignment'}
          onPress={() => navigation.navigate('PendingFiles')}
        />
        <ClickableCard
          imageSource={itemization}
          label={'Itemization Assignment'}
        />
        <ClickableCard imageSource={assignedFiles} label={'Assigned Files'} />
        <ClickableCard
          imageSource={leader}
          label={'Leader Requests Pending Approval'}
        />
        <ClickableCard
          imageSource={guide}
          label={'Guide Requests Pending Approval'}
        />
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scroll: {
    backgroundColor: '#F5F7FA',
  },
  container: {
    padding: 20,
    paddingBottom: 40,
  },
  column: {
    flexDirection: 'column',
    gap: 25,
    alignItems: 'center',
  },
});
