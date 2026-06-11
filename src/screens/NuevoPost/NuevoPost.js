import React, { useState } from 'react';
import { Pressable, StyleSheet, Text, TextInput, View } from 'react-native';
import { auth, db } from '../../firebase/config';

function NuevoPost() {
  const [descripcionPost, setDescripcionPost] = useState('');

  function onSubmit() {
    db.collection('posts').add({
      descripcionPost: descripcionPost,
      email: auth.currentUser.email,
      createdAt: Date.now(),
      likes: [], // El posteo empieza con un array vacio porque todavia ningun usuario dio like.
    })
      .then(() => {
        setDescripcionPost('');
      })
      .catch(error => {
        console.log(error);
      });
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Crear nuevo paisaje</Text>

      <TextInput
        style={styles.input}
        placeholder="Escribi tu post"
        value={descripcionPost}
        onChangeText={text => setDescripcionPost(text)}
      />

      <Pressable style={styles.button} onPress={() => onSubmit()}>
        <Text style={styles.buttonText}>Crear post</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 10,
    paddingTop: 30,
    backgroundColor: '#f7ead2',
  },
  title: {
    fontFamily: 'serif',
    fontSize: 30,
    fontWeight: '700',
    color: '#3f5f3b',
    marginBottom: 10,
  },
  input: {
    height: 120,
    paddingVertical: 10,
    paddingHorizontal: 10,
    borderWidth: 1,
    borderColor: '#d8c3a5',
    borderStyle: 'solid',
    borderRadius: 6,
    marginVertical: 10,
    backgroundColor: '#fffaf0',
    color: '#3b3028',
  },
  button: {
    backgroundColor: '#6f8f5f',
    paddingHorizontal: 10,
    paddingVertical: 10,
    alignItems: 'center',
    borderRadius: 4,
    borderWidth: 1,
    borderStyle: 'solid',
    borderColor: '#6f8f5f',
  },
  buttonText: {
    color: '#fff',
  },
});

export default NuevoPost;
