import React, { useEffect, useState } from 'react';
import { ActivityIndicator, FlatList, Pressable, StyleSheet, Text, View } from 'react-native';
import { auth, db } from '../../firebase/config';

function Profile(props) {
  // Guardo el email del usuario logueado porque lo voy a usar para buscar sus datos.
  const email = auth.currentUser.email;

  // Este estado guarda el nombre de usuario que viene de la coleccion users.
  const [userName, setUserName] = useState('');

  // Este estado guarda los posteos creados por el usuario logueado.
  const [posts, setPosts] = useState([]);

  // Este estado indica si Firebase todavia esta trayendo los datos del usuario.
  const [loadingUser, setLoadingUser] = useState(true);

  // Este estado indica si Firebase todavia esta trayendo los posteos del usuario.
  const [loadingPosts, setLoadingPosts] = useState(true);

  useEffect(() => {
    // Busco en la coleccion users el documento que tenga el mismo email que el usuario logueado.
    db.collection('users').where('email', '==', email).onSnapshot(docs => {
      // Recorro los documentos encontrados. En este caso deberia ser un solo usuario.
      docs.forEach(doc => {
        // Guardo en el estado el userName que viene de Firebase.
        setUserName(doc.data().userName);
      });

      // Cuando Firebase responde, dejo de mostrar el loader de usuario.
      setLoadingUser(false);
    });

    // Busco en la coleccion posts todos los posteos creados por el usuario logueado.
    db.collection('posts').where('email', '==', email).onSnapshot(docs => {
      // Creo un array vacio para guardar los posteos que vienen de Firebase.
      let posts = [];

      // Recorro cada documento de la coleccion posts.
      docs.forEach(doc => {
        // Guardo el id y la data de cada posteo dentro del array.
        posts.push({
          id: doc.id,
          data: doc.data(),
        });
      });

      // Actualizo el estado para que se muestren los posteos en pantalla.
      setPosts(posts);

      // Cuando Firebase responde, dejo de mostrar el loader de posteos.
      setLoadingPosts(false);
    });
  }, []);

  function logout() {
    // signOut cierra la sesion del usuario actual en Firebase.
    auth.signOut()
      .then(() => {
        // Si el cierre de sesion fue correcto, vuelvo a la pantalla de Login.
        props.navigation.navigate('Login');
      })
      .catch(error => {
        // Si Firebase devuelve un error, lo mostramos en consola para poder verlo.
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
            data={posts}
            keyExtractor={item => item.id}
            renderItem={({ item }) =>
              <View style={styles.post}>
                <Text style={styles.description}>{item.data.descripcionPost}</Text>
                <Text style={styles.likeText}>me gusta ♥ {item.data.likes ? item.data.likes.length : 0}</Text>
              </View>
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
    borderRadius: 6,
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
  post: {
    padding: 12,
    marginVertical: 10,
    borderWidth: 1,
    borderColor: '#d8c3a5',
    borderRadius: 6,
    backgroundColor: '#fffaf0',
  },
  description: {
    fontFamily: 'serif',
    fontSize: 17,
    color: '#3b3028',
  },
  likeText: {
    color: 'red',
    fontWeight: '700',
    marginTop: 8,
  },
  button: {
    width: '100%',
    paddingVertical: 14,
    paddingHorizontal: 16,
    backgroundColor: '#d77e7e',
    borderRadius: 6,
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
