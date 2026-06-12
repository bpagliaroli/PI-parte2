import React, { useEffect, useState } from 'react';
import { ActivityIndicator, FlatList, Pressable, StyleSheet, Text, TextInput, View } from 'react-native';
import { auth, db } from '../../firebase/config';

function Comentarios(props) {
  // Guardo en una variable el id del posteo que vino por navigation.
  // Este id sirve para saber a que posteo pertenece cada comentario.
  const postId = props.route.params.postId;

  // Este estado guarda lo que el usuario escribe en el input del comentario.
  const [comentario, setComentario] = useState('');

  // Este estado guarda todos los comentarios que Firebase trae para este posteo.
  const [comentarios, setComentarios] = useState([]);

  // Este estado indica si Firebase todavia esta trayendo los comentarios.
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Entro a la coleccion comments para buscar los comentarios guardados.
    // Uso where para traer solo los comentarios que tienen el mismo postId.
    db.collection('comments').where('postId', '==', postId).onSnapshot(docs => {
      // Creo un array vacio para guardar los documentos que vienen de Firebase.
      let comentarios = [];

      // Recorro cada documento de Firebase.
      docs.forEach(doc => {
        // Por cada documento, guardo su id y su data dentro del array.
        comentarios.push({
          id: doc.id,
          data: doc.data(),
        });
      });

      // Actualizo el estado para que la pantalla muestre los comentarios.
      setComentarios(comentarios);

      // Cuando Firebase responde, dejo de mostrar el loader.
      setLoading(false);
    });
  }, []);

  function comentarPosteo() {
    // Agrego un documento nuevo en la coleccion comments.
    db.collection('comments').add({
      postId: postId, // Guardo el id del posteo para relacionar el comentario con ese posteo.
      comentario: comentario, // Guardo el texto que escribio el usuario.
      email: auth.currentUser.email, // Guardo el email del usuario logueado.
      createdAt: Date.now(), // Guardo la fecha de creacion como en los posteos.
    })
      .then(() => {
        // Cuando Firebase termina de guardar el comentario, limpio el input.
        setComentario('');
      })
      .catch(error => {
        // Si Firebase devuelve un error, lo mostramos en consola para poder verlo.
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
    backgroundColor: '#f7ead2',
  },
  title: {
    fontFamily: 'serif',
    fontSize: 30,
    fontWeight: '700',
    color: '#3f5f3b',
    marginBottom: 10,
  },
  post: {
    padding: 12,
    marginVertical: 10,
    borderWidth: 1,
    borderColor: '#d8c3a5',
    borderRadius: 6,
    backgroundColor: '#fffaf0',
  },
  comment: {
    padding: 10,
    marginVertical: 6,
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
  commentText: {
    color: '#3b3028',
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
    paddingVertical: 6,
    alignItems: 'center',
    borderRadius: 4,
    marginTop: 10,
  },
  buttonText: {
    color: '#fff',
  },
});

export default Comentarios;
