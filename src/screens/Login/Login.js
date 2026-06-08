import React from 'react';
import { Pressable, StyleSheet, Text, TextInput, View } from 'react-native';
import { useState } from 'react';
import { auth } from '../../firebase/config';

function Login(props) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  function onSubmit() {
    !email.includes('@')
      ? setError('Email mal formateado')
      : password.length < 6
        ? setError('La password debe tener una longitud mínima de 6 caracteres')
        : auth.signInWithEmailAndPassword(email, password)
          .then(response => {
            console.log(response.user);
            props.navigation.navigate('HomeMenu');
          })
          .catch(error => {
            setError('Credenciales incorrectas');
          });
  }

  return (
    <View style={styles.container}>
      <Text>Login</Text>

      <View style={styles.inputContainer}>
        <TextInput
          style={styles.field}
          placeholder="Email"
          value={email}
          onChangeText={text => setEmail(text)}
        />

        <TextInput
          style={styles.field}
          placeholder="Password"
          value={password}
          onChangeText={text => setPassword(text)}
          keyboardType="number-pad"
          secureTextEntry={true}
        />

        {error ? <Text>{error}</Text> : null}

        <Pressable style={styles.button} onPress={() => onSubmit()}>
          <Text style={styles.buttonText}>Login</Text>
        </Pressable>
      </View>

      <Pressable style={styles.button} onPress={() => props.navigation.navigate('Register')}>
        <Text style={styles.buttonText}>Ir al registro</Text>
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
  },
  inputContainer: {
    width: '80%',
    gap: 10,
  },
  field: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 8,
    borderRadius: 4,
  },
  button: {
    paddingVertical: 10,
    paddingHorizontal: 16,
    backgroundColor: '#1f7a8c',
    borderRadius: 6,
  },
  buttonText: {
    color: '#fff',
    fontWeight: '600',
  },
});

export default Login;
