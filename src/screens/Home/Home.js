import React, { useEffect, useState } from 'react';
import { FlatList, Text, View } from 'react-native';
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
    <View>
      <Text>Posteos</Text>

      <FlatList
        data={posts}
        keyExtractor={item => item.id}
        renderItem={({ item }) => <Post id={item.id} data={item.data} navigation={props.navigation} />}
      />
    </View>
  );
}

export default Home;
