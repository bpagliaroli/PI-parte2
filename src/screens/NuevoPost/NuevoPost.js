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
      <Text>Nuevo post</Text>

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
    paddingHorizontal: 10,
    marginTop: 20,
  },
  input: {
    height: 20,
    paddingVertical: 15,
    paddingHorizontal: 10,
    borderWidth: 1,
    borderColor: '#ccc',
    borderStyle: 'solid',
    borderRadius: 6,
    marginVertical: 10,
  },
  button: {
    backgroundColor: '#28a745',
    paddingHorizontal: 10,
    paddingVertical: 6,
    alignItems: 'center',
    borderRadius: 4,
    borderWidth: 1,
    borderStyle: 'solid',
    borderColor: '#28a745',
  },
  buttonText: {
    color: '#fff',
  },
});

export default NuevoPost;
