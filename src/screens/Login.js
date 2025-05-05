/* eslint-disable react-native/no-inline-styles */
import React, {useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  ImageBackground,
  Dimensions,
  Image,
  KeyboardAvoidingView,
  ScrollView,
  Platform,
  TouchableWithoutFeedback,
  Keyboard,
} from 'react-native';
import InputField from '../components/inputFields';
import LoginButton from '../components/loginButton';
import {useNavigation} from '@react-navigation/native';
import {loginUser} from '../redux/reducers/auth';
import {useDispatch, useSelector} from 'react-redux';

const LoginScreen = () => {
  const navigation = useNavigation();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const image = {
    uri: 'https://ep-turnerconstruction-prod-asdcetgubtducba3.z01.azurefd.net/uploads/29448-001.jpg?v=0f226',
  };
  const logo = {
    uri: 'https://images.wuzzuf-data.net/files/company_logo/Memphis-Tours-Egypt-19649-1522166978-og.jpg',
  };
  const dispatch = useDispatch();
  const {loading, error, user} = useSelector(state => state.auth);

  const handleLogin = () => {
    if (!username.trim() || !password.trim()) {
      alert('Please enter both username and password');
      return;
    }

    dispatch(loginUser({username, password}))
      .unwrap()
      .then(() => {
        navigation.navigate('Dashboard');
      })
      .catch(err => {
        console.log('Login failed:', err);
        alert('Login failed. Please check your credentials.');
      });
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={{flex: 1}}>
        <ImageBackground source={image} style={styles.background}>
          <View style={styles.overlay} />

          <ScrollView
            contentContainerStyle={{flexGrow: 1, justifyContent: 'center'}}
            keyboardShouldPersistTaps="handled">
            <View style={styles.card}>
              <Image source={logo} style={styles.logo} resizeMode="contain" />
              <Text style={styles.title}>Welcome Back</Text>
              <Text style={styles.subtitle}>
                Sign in to access your dashboard
              </Text>

              <View style={styles.inputGroup}>
                <Text style={styles.label}>User Name</Text>
                <InputField
                  placeholder="User Name"
                  value={username}
                  onChangeText={setUsername}
                />
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.label}>Password</Text>
                <InputField
                  placeholder="Password"
                  secureTextEntry
                  value={password}
                  onChangeText={setPassword}
                />
              </View>
              <LoginButton onPress={handleLogin} loading={loading} />
            </View>
          </ScrollView>
        </ImageBackground>
      </KeyboardAvoidingView>
    </TouchableWithoutFeedback>
  );
};

const {width} = Dimensions.get('window');

const styles = StyleSheet.create({
  background: {
    flex: 1,
    justifyContent: 'center',
    padding: 20,
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    borderRadius: 20,
  },
  logo: {
    width: 300,
    height: 150,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 30,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.8,
    shadowRadius: 10,
    elevation: 5,
    width: width * 0.6,
    alignSelf: 'center',
  },
  title: {
    fontSize: 30,
    fontWeight: '700',
    marginBottom: 5,
    color: '#27548A',
  },
  subtitle: {
    fontSize: 16,
    color: '#6684CC',
    marginBottom: 25,
    fontStyle: 'italic',
  },
  inputGroup: {
    width: '100%',
    marginBottom: 15,
  },
  label: {
    alignSelf: 'flex-start',
    marginBottom: 5,
    fontWeight: '600',
    color: '#27548A',
  },
});

export default LoginScreen;
