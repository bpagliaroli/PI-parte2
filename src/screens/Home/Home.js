import React, { useEffect, useState } from 'react';
import { ActivityIndicator, FlatList, StyleSheet, Text, View } from 'react-native';
import Post from '../../components/Post/Post';
import { db } from '../../firebase/config';

function Home(props) {
  // Objetivo: guardar y mostrar todos los posteos de la coleccion posts
  const [posts, setPosts] = useState([]);

  // loading me sirve para mostrar un ActivityIndicator mientras Firebase carga los datitos
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // useEffect se ejecuta cuando carga la pantalla. onSnapshot escucha la coleccion en tiempo real
    db.collection('posts').onSnapshot(docs => {
      let posts = [];

      docs.forEach(doc => {
        // Cada documento de Firebase se transforma en un objeto para poder usarlo en FlatList
        posts.push({
          id: doc.id,
          data: doc.data(),
        });
      });

      setPosts(posts);
      setLoading(false);
    });
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Posteos</Text>

      {
        loading
          ? <ActivityIndicator size="large" color="#6f8f5f" />
          : <FlatList
          //Los posteos deberian renderizarse de forma descendente!!!! 
          data={posts}
            keyExtractor={item => item.id}
            // renderItem crea un componente Post por cada item y le pasa props.
            renderItem={({ item }) => <Post id={item.id} data={item.data} navigation={props.navigation} />}
          />
      }
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
    marginBottom: 10,
  },
});

export default Home;
