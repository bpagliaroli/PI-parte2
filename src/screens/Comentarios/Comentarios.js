import React, { useEffect, useState } from 'react';
import { ActivityIndicator, FlatList, Pressable, StyleSheet, Text, TextInput, View } from 'react-native';
import { auth, db } from '../../firebase/config';

function Comentarios(props) {
  // Objetivo: mostrar un posteo puntual, listar sus comentarios y agregar nuevos.
  // route.params contiene los datos enviados desde navigation.navigate en Post.js.
  const postId = props.route.params.postId;

  const [comentario, setComentario] = useState('');
  const [comentarios, setComentarios] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // where filtra la coleccion comments para traer solo los comentarios de este posteo.
    db.collection('comments').where('postId', '==', postId).onSnapshot(docs => {
      let comentarios = [];

      docs.forEach(doc => {
        comentarios.push({
          id: doc.id,
          data: doc.data(),
        });
      });

      setComentarios(comentarios);
      setLoading(false);
    });
  }, []);

  function comentarPosteo() {
    // add crea un documento nuevo en la coleccion comments.
    db.collection('comments').add({
      postId: postId,
      comentario: comentario,
      email: auth.currentUser.email,
      createdAt: Date.now(),
    })
      .then(() => {
        setComentario('');
      })
      .catch(error => {
        console.log(error);
      });
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Comentarios</Text>

      <View style={styles.post}>
        <Text style={styles.email}>{props.route.params.email}</Text>
        <Text style={styles.description}>{props.route.params.descripcionPost}</Text>
        <Text style={styles.likeText}>me gusta ♥ {props.route.params.likes}</Text>
      </View>

      {
        loading
          ? <ActivityIndicator size="large" color="#6f8f5f" />
          : <FlatList
            data={comentarios}
            keyExtractor={item => item.id}
            renderItem={({ item }) =>
              <View style={styles.comment}>
                <Text style={styles.email}>{item.data.email}</Text>
                <Text style={styles.commentText}>{item.data.comentario}</Text>
              </View>
            }
          />
      }

      <TextInput
        style={styles.input}
        placeholder="Comenta aqui tu post"
        value={comentario}
        onChangeText={text => setComentario(text)}
      />

      <Pressable style={styles.button} onPress={() => comentarPosteo()}>
        <Text style={styles.buttonText}>Publicar comentario</Text>
      </Pressable>

      <Pressable style={styles.button} onPress={() => props.navigation.navigate('Home')}>
        <Text style={styles.buttonText}>Volver</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,

  },
  title: {
    fontFamily: 'serif',
    fontSize: 30,
    fontWeight: '700',
    marginBottom: 10,
  },
  post: {
    padding: 12,
    marginVertical: 10,
    backgroundColor: '#fffaf0',
  },
  comment: {
    padding: 10,
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


  likeText: {
    color: 'red',
    fontWeight: '700',
    marginTop: 8,
  },
  input: {
    height: 20,
    paddingVertical: 15,
    paddingHorizontal: 10,
    borderColor: '#d8c3a5',
    borderStyle: 'solid',
    marginVertical: 10,
    backgroundColor: '#fffaf0',
    color: '#3b3028',
  },
  button: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    alignItems: 'center',
    marginTop: 10,
  },
  buttonText: {
    color: '#fff',
  },
});

export default Comentarios;
