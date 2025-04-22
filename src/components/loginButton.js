import React from 'react';
import {TouchableOpacity, Text, StyleSheet} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';

const LoginButton = ({onPress}) => (
  <TouchableOpacity onPress={onPress} style={styles.buttonWrapper}>
    <LinearGradient colors={['#27548A', '#6684CC']} style={styles.button}>
      <Text style={styles.buttonText}>Sign In</Text>
    </LinearGradient>
  </TouchableOpacity>
);

const styles = StyleSheet.create({
  buttonWrapper: {
    width: '100%',
    marginTop: 20,
  },
  button: {
    borderRadius: 10,
    alignItems: 'center',
    marginVertical: '5%',
  },
  buttonText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 20,
    paddingVertical: '3%',
  },
});

export default LoginButton;
