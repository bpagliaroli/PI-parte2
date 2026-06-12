import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import firebase from 'firebase/app';
import 'firebase/firestore';
import { auth, db } from '../../firebase/config';

function Post(props) {
  // El objetivo es mostrar un posteo y permitir que el usuario le de like o lo comente
  // props es el objeto que arma React con los datos enviados desde Home, o sea id, data y navigation
  const likes = props.data.likes ? props.data.likes : [];

  // El email del usuario logueado identifica quien dio like
  const userEmail = auth.currentUser.email;

  // includes controla si ese usuario ya esta dentro del array de likes
  const liked = likes.includes(userEmail);

  function likePost() {
    if (liked) {
      // update modifica el documentoooo. arrayRemove saca el email del array
      db.collection('posts').doc(props.id).update({
        likes: firebase.firestore.FieldValue.arrayRemove(userEmail),
      });
    } else {
                  //arrayUnion agrega el email al array y evita que se repita
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
          // navigate cambia de pantalla y envia params a Comentarios.
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
    backgroundColor: '#fffaf0',
  },
  email: {
    fontSize: 12,
    marginBottom: 6,
  },
  description: {
    fontFamily: 'serif',
    fontSize: 17,
  },
  like: {
    marginTop: 10,
  },
  likeText: {
    color: 'red',
    fontWeight: '700',
  },
  button: {
    backgroundColor: 'green',
    paddingHorizontal: 10,
    paddingVertical: 6,
    alignItems: 'center',
    borderRadius: 4,
    marginTop: 10,
  },

});

export default Post;
