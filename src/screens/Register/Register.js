import React from 'react';
import { ActivityIndicator, Pressable, StyleSheet, Text, TextInput, View } from 'react-native';
import { useState } from 'react';
import { auth, db } from '../../firebase/config';

function Register(props) {
  const [email, setEmail] = useState('');
  const [userName, setUserName] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  function onSubmit() {
    setError('');

    if (email === '' || userName === '' || password === '') {
      setError('Completar todos los campos');
    } else if (!email.includes('@')) {
      setError('Asegurarse de incluir "@"');
    } else if (password.length < 6) {
      setError('La contraseña debe tener una longitud minima de 6 caracteres');
    } else {
      setLoading(true);
      auth.createUserWithEmailAndPassword(email, password)
        .then(response => {
          db.collection('users').add({
            email: email,
            userName: userName,
            createdAt: Date.now(),
          })
            .then(() => {
              setLoading(false);
              props.navigation.navigate('Login');
            });
        })
        .catch(error => {
          setLoading(false);
          setError(error.code);
        });
    }
  }

  return (
    <View style={styles.container}>
      <Text style={styles.subtitle}>Registro</Text>

      <View style={styles.inputContainer}>
        <TextInput
          style={styles.campo}
          placeholder="Email"
          value={email}
          onChangeText={text => setEmail(text)}
        />

        <TextInput
          style={styles.campo}
          placeholder="Nombre de usuario"
          value={userName}
          onChangeText={text => setUserName(text)}
        />

        <TextInput
          style={styles.campo}
          placeholder="Contraseña"
          value={password}
          onChangeText={text => setPassword(text)}
          keyboardType="number-pad"
          secureTextEntry={true}
        />

        {error ? <Text style={styles.error}>{error}</Text> : null}

        {
          loading
            ? <ActivityIndicator size="large" color="#6f8f5f" />
            : <Pressable style={styles.button} onPress={() => onSubmit()}>
              <Text style={styles.buttonText}>Registrarme</Text>
            </Pressable>
        }
      </View>

      <Pressable style={styles.button} onPress={() => props.navigation.navigate('Login')}>
        <Text style={styles.buttonText}>Ya tengo cuenta</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f7ead2',
    padding: 20,
  },
  subtitle: {
    fontFamily: 'serif',
    fontSize: 22,
    color: 'brown',
  },
  inputContainer: {
    width: '80%',
  },
  campo: {
    borderWidth: 1,
    borderColor: '#d8c3a5',
    padding: 8,
    backgroundColor: '#fffaf0',
    color: '#3b3028',
    marginTop: 10
  },
  button: {
    marginTop: 10,
    paddingVertical: 10,
    paddingHorizontal: 16,
  },
  buttonText: {
    color: '#fff',
    fontWeight: '600',
  }
});

export default Register;
