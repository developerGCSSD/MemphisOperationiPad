import AsyncStorage from '@react-native-async-storage/async-storage';

const USER_KEY = 'userKey';

//* Save token to AsyncStorage
export const saveToken = async data => {
  try {
    const jsonValue = JSON.stringify(data);
    await AsyncStorage.setItem(USER_KEY, jsonValue);
    console.log('user saved in storage');
    const dd = retrieveUser();
    console.log('reeee', dd);
  } catch (error) {
    console.error('Error saving user in storage', error);
  }
};

//* Retrieve the token saved from the storage
export const retrieveUser = async () => {
  try {
    const user = await AsyncStorage.getItem(USER_KEY);
    console.log('tutututututut', user);
    return user != null ? JSON.parse(user) : null;
  } catch (error) {
    return null;
  }
};

//* Remove the token from the storage when LogOut
export const removeUser = async () => {
  try {
    await AsyncStorage.removeItem(USER_KEY);
    console.log('The token is removed from the storage');
  } catch (error) {
    console.error('The token is not removed', error);
  }
};
