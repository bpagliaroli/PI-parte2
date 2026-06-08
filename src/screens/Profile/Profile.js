import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { auth } from '../../firebase/config';

function Profile(props) {
  function logout() {
    auth.signOut()
      .then(() => {
        props.navigation.navigate('Login');
      });
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Mi Perfil</Text>

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
    backgroundColor: '#f2f2f2',
  },
  title: {
    marginBottom: 32,
    fontSize: 36,
    fontWeight: '700',
  },
  button: {
    width: '100%',
    paddingVertical: 14,
    paddingHorizontal: 16,
    backgroundColor: '#ffa000',
    borderRadius: 6,
    alignItems: 'center',
  },
  buttonText: {
    fontSize: 16,
    textAlign: 'center',
  },
});

export default Profile;
