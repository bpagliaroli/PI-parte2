import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import firebase from 'firebase/app';
import 'firebase/firestore';
import { auth, db } from '../../firebase/config';

function Post(props) {
  // Guardo los likes del posteo en una variable para poder usarlos en el componente.
  // Si el posteo no tiene el campo likes, uso un array vacio para que la app no se rompa.
  const likes = props.data.likes ? props.data.likes : [];

  // Guardo el email del usuario logueado porque ese email identifica quien dio like.
  const userEmail = auth.currentUser.email;

  // Con includes pregunto si el array de likes ya tiene el email del usuario logueado.
  const liked = likes.includes(userEmail);

  function likePost() {
    // Si liked es true, significa que el usuario ya habia dado like.
    if (liked) {
      // update modifica el documento del posteo sin crear uno nuevo.
      // arrayRemove saca el email del usuario del array de likes.
      db.collection('posts').doc(props.id).update({
        likes: firebase.firestore.FieldValue.arrayRemove(userEmail),
      });
    } else {
      // Si liked es false, significa que el usuario todavia no habia dado like.
      // arrayUnion agrega el email del usuario al array de likes.
      // arrayUnion tambien evita que el mismo email se agregue dos veces.
      db.collection('posts').doc(props.id).update({
        likes: firebase.firestore.FieldValue.arrayUnion(userEmail),
      });
    }
  }

  return (
      <View style={styles.container}>
      <Text style={styles.email}>{props.data.email}</Text>
      <Text style={styles.description}>{props.data.descripcionPost}</Text>

      <Pressable
        style={styles.like}
        onPress={() => likePost()}
      >
        <Text style={styles.likeText}>me gusta ♥ {likes.length}</Text>
      </Pressable>

      <Pressable
        style={styles.button}
        onPress={() => props.navigation.navigate('Comentarios', {
          postId: props.id,
          descripcionPost: props.data.descripcionPost,
          email: props.data.email,
          likes: likes.length,
        })}
      >
        <Text style={styles.buttonText}>Comentar</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 12,
    marginVertical: 10,
    borderWidth: 1,
    borderColor: '#d8c3a5',
    borderRadius: 6,
    backgroundColor: '#fffaf0',
  },
  email: {
    color: '#6f4f37',
    fontSize: 12,
    marginBottom: 6,
  },
  description: {
    fontFamily: 'serif',
    fontSize: 17,
    color: '#3b3028',
  },
  like: {
    marginTop: 10,
  },
  likeText: {
    color: 'red',
    fontWeight: '700',
  },
  button: {
    backgroundColor: '#6f8f5f',
    paddingHorizontal: 10,
    paddingVertical: 6,
    alignItems: 'center',
    borderRadius: 4,
    marginTop: 10,
  },
  buttonText: {
    color: '#fff',
  },
});

export default Post;
