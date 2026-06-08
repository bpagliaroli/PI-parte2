import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

function Post(props) {
  return (
    <View style={styles.container}>
      <Text>{props.data.descripcionPost}</Text>
      <Text>{props.data.email}</Text>

      <Pressable
        style={styles.button}
        onPress={() => props.navigation.navigate('Comentarios', { postId: props.id })}
      >
        <Text style={styles.buttonText}>Comentar</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 10,
    marginVertical: 10,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 6,
  },
  button: {
    backgroundColor: '#1f7a8c',
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

export default Post;
