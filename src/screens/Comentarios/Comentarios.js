import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

function Comentarios(props) {
  return (
    <View style={styles.container}>
      <Text>Comentarios del posteo</Text>
      <Text>{props.route.params.postId}</Text>

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
  button: {
    backgroundColor: '#1f7a8c',
    paddingHorizontal: 10,
    paddingVertical: 6,
    alignItems: 'center',
    borderRadius: 4,
    marginTop: 20,
  },
  buttonText: {
    color: '#fff',
  },
});

export default Comentarios;
