import React, { useEffect, useState } from 'react';
import { ActivityIndicator, FlatList, Pressable, StyleSheet, Text, TextInput, View } from 'react-native';
import firebase from 'firebase/app';
import 'firebase/firestore';
import Post from '../../components/Post/Post';
import { auth, db } from '../../firebase/config';

function Comentarios(props) {
  const postId = props.route.params.postId;

  const [post, setPost] = useState(null);
  const [comentario, setComentario] = useState('');
  const [comentarios, setComentarios] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    db.collection('posts').doc(postId).onSnapshot(doc => {
      const data = doc.data();
      const comentarios = data.comments ? data.comments : [];
      setPost({
        id: doc.id,
        data: data,
      });
      setComentarios(comentarios);
      setLoading(false);
    });
  }, []);

  function comentarPosteo() {
    db.collection('posts').doc(postId).update({
      comments: firebase.firestore.FieldValue.arrayUnion({
        comentario: comentario,
        email: auth.currentUser.email,
        createdAt: Date.now(),
      }),
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


      {
        loading
          ? <ActivityIndicator size="large" color="#6f8f5f" />
          : <View>
            <Post id={post.id} data={post.data} navigation={props.navigation} />

            <FlatList
              data={comentarios}
              keyExtractor={(item, index) => index.toString()}
              renderItem={({ item }) =>
                <View style={styles.comment}>
                  <Text style={styles.email}>{item.email}</Text>
                  <Text style={styles.commentText}>{item.comentario}</Text>
                </View>
              }
            />
          </View>
      }

      <TextInput
        style={styles.input}
        placeholder="Comenta acá el post"
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
    backgroundColor: '#fffaf0',
  },
  comment: {
    padding: 10,
    marginVertical: 6,
    borderWidth: 1,
    borderColor: '#d8c3a5',
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
    marginVertical: 10,
    backgroundColor: '#fffaf0',
    color: '#3b3028',
  },
  button: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    alignItems: 'center',
    borderRadius: 4,
    marginTop: 10,
  },
  buttonText: {
    color: 'black',
  },

});

export default Comentarios;
