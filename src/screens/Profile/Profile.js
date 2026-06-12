import React, { useEffect, useState } from 'react';
import { ActivityIndicator, FlatList, Pressable, StyleSheet, Text, View } from 'react-native';
import Post from '../../components/Post/Post';
import { auth, db } from '../../firebase/config';

function Profile(props) {
  // Tengo que mostrar datos del usuario logueado, sus posteos y permitir cerrar sesion.
  const email = auth.currentUser.email;

  const [userName, setUserName] = useState('');
  const [posts, setPosts] = useState([]);
  const [loadingUser, setLoadingUser] = useState(true);
  const [loadingPosts, setLoadingPosts] = useState(true);

  useEffect(() => {
    // Busco en users el documento que tenga el email del usuario logueado.
    db.collection('users').where('email', '==', email).onSnapshot(docs => {
      docs.forEach(doc => {
        setUserName(doc.data().userName);
      });

      setLoadingUser(false);
    });

    // Busco en posts los documentos creados por este email.
    db.collection('posts').where('email', '==', email).onSnapshot(docs => {
      let posts = [];

      docs.forEach(doc => {
        posts.push({
          id: doc.id,
          data: doc.data(),
        });
      });

      setPosts(posts);
      setLoadingPosts(false);
    });
  }, []);

  function logout() {
    // signOut cierra la sesion en Firebase. Si sale bien, vuelve a Login.
    auth.signOut()
      .then(() => {
        props.navigation.navigate('Login');
      })
      .catch(error => {
        console.log(error);
      });
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Mi Perfil</Text>

      {
        loadingUser
          ? <ActivityIndicator size="large" color="#6f8f5f" />
          : <View style={styles.profileBox}>
            <Text style={styles.userName}>{userName}</Text>
            <Text style={styles.email}>{email}</Text>
          </View>
      }

      <Text style={styles.subtitle}>Mis posteos</Text>

      {
        loadingPosts
          ? <ActivityIndicator size="large" color="#6f8f5f" />
          : <FlatList
          //Se que aparece el boton de comentar, pero no pasa nada!!!
            data={posts}
            keyExtractor={item => item.id}
            renderItem={({ item }) =>
              <Post id={item.id} data={item.data} navigation={props.navigation} />
            }
          />
      }

      <Pressable style={styles.button} onPress={() => logout()}>
        <Text style={styles.buttonText}>Cerrar sesion</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 32,
    backgroundColor: '#f7ead2',
  },
  title: {
    marginBottom: 16,
    fontSize: 36,
    fontWeight: '700',
    fontFamily: 'serif',
    color: '#3f5f3b',
  },
  profileBox: {
    padding: 12,
    borderWidth: 1,
    borderColor: '#d8c3a5',
    backgroundColor: '#fffaf0',
  },
  userName: {
    fontFamily: 'serif',
    fontSize: 20,
    color: '#3b3028',
  },
  email: {
    color: '#6f4f37',
    marginTop: 4,
  },
  subtitle: {
    marginTop: 24,
    marginBottom: 10,
    fontSize: 20,
    fontWeight: '700',
    color: '#3f5f3b',
  },
  button: {
    width: '100%',
    paddingVertical: 14,
    paddingHorizontal: 16,
    backgroundColor: '#d77e7e',
    alignItems: 'center',
    marginTop: 20,
  },
  buttonText: {
    fontSize: 16,
    textAlign: 'center',
    color: '#fff',
  },
});

export default Profile;
