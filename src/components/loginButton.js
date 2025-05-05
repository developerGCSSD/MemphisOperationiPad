import React from 'react';
import {TouchableOpacity, Text, StyleSheet, View} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';

const LoginButton = ({onPress, loading}) => (
  <TouchableOpacity
    onPress={onPress}
    style={[styles.buttonWrapper, loading && styles.buttonDisabled]}
    disabled={loading}>
    <LinearGradient colors={['#27548A', '#6684CC']} style={styles.button}>
      <View style={styles.content}>
        {loading ? (
          <Text style={styles.loadingText}>Loading...</Text>
        ) : (
          <Text style={styles.buttonText}>Sign In</Text>
        )}
      </View>
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
    justifyContent: 'center',
    height: 55,
  },
  buttonDisabled: {
    opacity: 0.7,
  },
  content: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
  },
  buttonText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 20,
  },
  loadingText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 20,
  },
});

export default LoginButton;
