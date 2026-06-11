import React, { useEffect, useState } from 'react';
import { FlatList, StyleSheet, Text, View } from 'react-native';
import Post from '../../components/Post/Post';
import { db } from '../../firebase/config';

function Home(props) {
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    db.collection('posts').onSnapshot(docs => {
      let posts = [];

      docs.forEach(doc => {
        posts.push({
          id: doc.id,
          data: doc.data(),
        });
      });

      setPosts(posts);
    });
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Posteos</Text>

      <FlatList
        data={posts}
        keyExtractor={item => item.id}
        renderItem={({ item }) => <Post id={item.id} data={item.data} navigation={props.navigation} />}
      />
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
});

export default Home;
