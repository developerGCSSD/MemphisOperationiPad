import React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import LoginScreen from './src/screens/Login';
import Dashboard from './src/screens/Dashboard';
import PendingFiles from './src/screens/PendingFiles';
import AssignLeaderAndGuide from './src/screens/AssignLeaderAndGuide';
import FilesPerDay from './src/screens/FilesPerDay';
import {store} from './src/redux/store/store';
import {Provider} from 'react-redux';
const Stack = createNativeStackNavigator();

const App = () => {
  return (
    <Provider store={store}>
      <NavigationContainer>
        <Stack.Navigator initialRouteName="Login">
          <Stack.Screen
            name="Login"
            component={LoginScreen}
            options={{headerShown: false}}
          />
          <Stack.Screen
            name="Dashboard"
            component={Dashboard}
            options={{
              headerShown: true,
              headerBackVisible: false,
              title: 'Dashboard',
              headerStyle: {
                backgroundColor: '#27548A',
              },
              headerTitleStyle: {
                color: '#FFFFFF',
                fontSize: 24,
                fontWeight: 'bold',
              },
            }}
          />
          <Stack.Screen
            name="PendingFiles"
            component={PendingFiles}
            options={{
              headerShown: true,
              title: 'Files Assignment',
              headerTintColor: '#FFFFFF',
              headerStyle: {
                backgroundColor: '#27548A',
              },
              headerTitleStyle: {
                color: '#FFFFFF',
                fontSize: 22,
                fontWeight: 'bold',
              },
            }}
          />
          <Stack.Screen
            name="AssignFiles"
            component={AssignLeaderAndGuide}
            options={{
              headerShown: true,
              title: 'Assign Leader And Guide',
              headerTintColor: '#FFFFFF',
              headerStyle: {
                backgroundColor: '#27548A',
              },
              headerTitleStyle: {
                color: '#FFFFFF',
                fontSize: 22,
                fontWeight: 'bold',
              },
            }}
          />
          <Stack.Screen
            name="filesPerDay"
            component={FilesPerDay}
            options={{
              headerShown: true,
              title: '',
              headerTintColor: '#FFFFFF',
              headerStyle: {
                backgroundColor: '#27548A',
              },
              headerTitleStyle: {
                color: '#FFFFFF',
                fontSize: 22,
                fontWeight: 'bold',
              },
            }}
          />
        </Stack.Navigator>
      </NavigationContainer>
    </Provider>
  );
};

export default App;
