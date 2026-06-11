import React from 'react';
import { Pressable, StyleSheet, Text, TextInput, View } from 'react-native';
import { useState } from 'react';
import { auth, db } from '../../firebase/config';

function Register(props) {
  const [email, setEmail] = useState('');
  const [userName, setUserName] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  function onSubmit() {
    setError('');
    auth.createUserWithEmailAndPassword(email, password)
      .then(response => {
        db.collection('users').add({
          email: email,
          userName: userName,
          createdAt: Date.now(),
        })
          .then(() => {
            props.navigation.navigate('Login');
          });
      })
      .catch(error => {
        setError(error.code);
      });
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Paisajes</Text>
      <Text style={styles.subtitle}>Registro</Text>

      <View style={styles.inputContainer}>
        <TextInput
          style={styles.field}
          placeholder="Email"
          value={email}
          onChangeText={text => setEmail(text)}
        />

        <TextInput
          style={styles.field}
          placeholder="Username"
          value={userName}
          onChangeText={text => setUserName(text)}
        />

        <TextInput
          style={styles.field}
          placeholder="Password"
          value={password}
          onChangeText={text => setPassword(text)}
          keyboardType="number-pad"
          secureTextEntry={true}
        />

        {error ? <Text style={styles.error}>{error}</Text> : null}

        <Pressable style={styles.button} onPress={() => onSubmit()}>
          <Text style={styles.buttonText}>Registrarme</Text>
        </Pressable>
      </View>

      <Pressable style={styles.button} onPress={() => props.navigation.navigate('Login')}>
        <Text style={styles.buttonText}>Ir al Login</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 16,
    backgroundColor: '#f7ead2',
    padding: 20,
  },
  title: {
    fontFamily: 'serif',
    fontSize: 38,
    fontWeight: '700',
    color: '#3f5f3b',
  },
  subtitle: {
    fontFamily: 'serif',
    fontSize: 22,
    color: '#6f4f37',
  },
  inputContainer: {
    width: '80%',
    gap: 10,
  },
  field: {
    borderWidth: 1,
    borderColor: '#d8c3a5',
    padding: 8,
    borderRadius: 4,
    backgroundColor: '#fffaf0',
    color: '#3b3028',
  },
  button: {
    paddingVertical: 10,
    paddingHorizontal: 16,
    backgroundColor: '#6f8f5f',
    borderRadius: 6,
  },
  buttonText: {
    color: '#fff',
    fontWeight: '600',
  },
  error: {
    color: '#9c3b2f',
  },
});

export default Register;
