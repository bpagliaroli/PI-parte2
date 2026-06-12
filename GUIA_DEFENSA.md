# Guia completa para defender el codigo

Esta guia esta escrita para poder explicar la app mirando el codigo. Usa vocabulario de la cursada: componente, props, estado, renderizado, evento, coleccion, documento, `add`, `update`, `onSnapshot`, `where`, `FlatList`, `ActivityIndicator`, `TextInput`, `Pressable` y navegacion.

## 1. Que hace la app

La app permite:

- registrar usuarios
- iniciar sesion
- recordar si el usuario ya estaba logueado
- crear posteos
- ver posteos
- dar y sacar likes
- comentar posteos
- ver perfil del usuario
- ver posteos propios
- cerrar sesion

Hay dos sistemas importantes:

- Firebase Auth: maneja usuarios, login, registro y logout.
- Firestore: guarda datos de usuarios y posteos.

Las colecciones usadas son:

- `users`: guarda informacion extra del usuario, como `email` y `userName`.
- `posts`: guarda posteos. Cada posteo tiene `likes` y `comments` como arrays dentro del documento.

## 2. Como esta organizada la navegacion

### `App.js`

Objetivo: definir la navegacion principal tipo stack.

```js
const Stack = createNativeStackNavigator();
```

Esto crea una navegacion stack. En una navegacion stack se registran pantallas y se puede navegar de una a otra.

Pantallas:

```js
Login
Register
HomeMenu
```

Que pasa en la app:

- Al abrir la app, aparece `Login`.
- Desde `Login`, el usuario puede ir a `Register`.
- Si el usuario inicia sesion, se navega a `HomeMenu`.

Frase para defender:

> `App.js` contiene el stack principal. Login y Register son pantallas de autenticacion, y HomeMenu es la entrada a la aplicacion cuando el usuario ya esta logueado.

### `HomeMenu.js`

Objetivo: definir la navegacion tipo tab inferior.

```js
const Tab = createBottomTabNavigator();
```

Pantallas del tab:

- `Home`
- `Nuevo post`
- `Profile`

Que pasa en la app:

Una vez logueado, el usuario usa el menu inferior para moverse entre las funciones principales.

Detalle importante:

El tab `Home` no abre directamente `Home.js`. Abre `HomeStack`.

```js
component={HomeStack}
```

Esto permite que dentro del tab Home exista otra navegacion stack.

### `HomeStack.js`

Objetivo: crear una navegacion stack anidada dentro del tab Home.

Pantallas:

- `Home`
- `Comentarios`

Que pasa en la app:

Desde `Home` se puede entrar a `Comentarios` sin salir del sistema de tabs.

Frase para defender:

> La pantalla Comentarios esta dentro de un stack anidado en el tab Home. Por eso Home puede navegar a Comentarios.

## 3. Que son `props`, `navigation` y `route.params`

### `props`

`props` es un objeto que React arma con informacion que recibe un componente.

Ejemplo:

```js
<Post id={item.id} data={item.data} navigation={props.navigation} />
```

En ese caso, dentro de `Post.js`, React arma:

```js
props.id
props.data
props.navigation
```

No nacen solos: se los mandamos cuando usamos el componente.

### `props.navigation`

Las pantallas que estan en una navegacion reciben `props.navigation`.

Sirve para navegar:

```js
props.navigation.navigate('Register')
```

Tambien puede mandar datos:

```js
props.navigation.navigate('Comentarios', {
  postId: props.id,
})
```

### `props.route.params`

Cuando una pantalla recibe datos enviados con `navigate`, los lee desde:

```js
props.route.params
```

Ejemplo en `Comentarios.js`:

```js
const postId = props.route.params.postId;
```

Eso significa:

> Leo el id del post que me mando la pantalla anterior.

## 4. Firebase config

### `src/firebase/config.js`

Objetivo: conectar la app con Firebase.

```js
app.initializeApp(firebaseConfig);
```

Inicializa Firebase.

```js
export const auth = app.auth();
export const db = app.firestore();
```

Exporta:

- `auth`: autenticacion.
- `db`: Firestore.

Cuando un archivo necesita login, registro o usuario actual, importa `auth`.

Cuando un archivo necesita leer o escribir datos, importa `db`.

## 5. Login

### `Login.js`

Objetivo: iniciar sesion.

Estados:

```js
const [email, setEmail] = useState('');
const [password, setPassword] = useState('');
const [error, setError] = useState('');
const [loading, setLoading] = useState(false);
```

Que guarda cada estado:

- `email`: lo que el usuario escribe en el input de email.
- `password`: lo que escribe en el input de contrasena.
- `error`: mensaje a mostrar si algo falla.
- `loading`: indica si Firebase esta respondiendo.

### Inputs

```js
value={email}
onChangeText={text => setEmail(text)}
```

Esto quiere decir:

- `value` muestra el valor del estado.
- `onChangeText` actualiza el estado cada vez que el usuario escribe.

### Remember me

```js
auth.onAuthStateChanged(user => {
  if (user) {
    props.navigation.navigate('HomeMenu');
  }
});
```

Que hace:

- Firebase revisa si ya hay usuario logueado.
- Si existe `user`, se navega directo a `HomeMenu`.

### Boton de login

```js
onPress={() => onSubmit()}
```

Cuando el usuario toca el boton, se ejecuta `onSubmit`.

### Validaciones

Primero se validan cosas simples:

- campos vacios
- email sin `@`

Si eso esta bien, se llama a Firebase:

```js
auth.signInWithEmailAndPassword(email, password)
```

Que hace:

> Firebase Auth verifica si ese email y esa contrasena pertenecen a un usuario registrado.

Si sale bien:

```js
props.navigation.navigate('HomeMenu')
```

Si sale mal:

```js
setError(error.code)
```

Ese `error.code` viene del `catch` de Firebase.

## 6. Registro

### `Register.js`

Objetivo: crear una cuenta y guardar datos del usuario.

Estados:

- `email`
- `userName`
- `password`
- `error`
- `loading`

### Crear usuario en Auth

```js
auth.createUserWithEmailAndPassword(email, password)
```

Que hace:

> Firebase Auth crea la cuenta del usuario con email y contrasena.

### Guardar usuario en Firestore

```js
db.collection('users').add({
  email: email,
  userName: userName,
  createdAt: Date.now(),
})
```

Que significa cada parte:

- `db`: Firestore.
- `collection('users')`: entro a la coleccion users.
- `add(...)`: creo un documento nuevo.
- el objeto entre llaves son los campos que se guardan.

Por que se guarda en `users`:

Firebase Auth guarda la cuenta, pero nosotros necesitamos datos extra como `userName`.

## 7. Crear posteos

### `NuevoPost.js`

Objetivo: crear un documento nuevo en la coleccion `posts`.

Estado:

```js
const [descripcionPost, setDescripcionPost] = useState('');
```

Ese estado guarda el texto del post.

Cuando se toca el boton:

```js
db.collection('posts').add({
  descripcionPost: descripcionPost,
  email: auth.currentUser.email,
  createdAt: Date.now(),
  likes: [],
  comments: [],
})
```

Que hace:

- entra a la coleccion `posts`
- crea un documento nuevo
- guarda texto, email, fecha, likes y comments

Campos:

- `descripcionPost`: texto escrito por el usuario.
- `email`: email del usuario logueado.
- `createdAt`: fecha de creacion.
- `likes`: array vacio al principio.
- `comments`: array vacio al principio.

Despues:

```js
setDescripcionPost('');
```

Limpia el input.

## 8. Home y lectura de posteos

### `Home.js`

Objetivo: traer todos los posteos y mostrarlos.

Estados:

- `posts`: array de posteos.
- `loading`: loader mientras Firebase responde.

### Leer Firestore

```js
db.collection('posts').onSnapshot(docs => {
```

Que hace:

- entra a la coleccion `posts`
- escucha cambios en tiempo real
- cada vez que cambia algo, Firebase vuelve a mandar los documentos

### Armar array

```js
let posts = [];

docs.forEach(doc => {
  posts.push({
    id: doc.id,
    data: doc.data(),
  });
});
```

Que es `docs`:

Es el conjunto de documentos que devuelve Firebase.

Que es `doc`:

Cada documento individual.

Que es `doc.id`:

El id del documento en Firebase.

Que es `doc.data()`:

Los campos guardados dentro del documento.

Por que armamos un array:

Porque `FlatList` necesita recibir un array en `data`.

### FlatList

```js
<FlatList
  data={posts}
  keyExtractor={item => item.id}
  renderItem={({ item }) => <Post id={item.id} data={item.data} navigation={props.navigation} />}
/>
```

Que es `item`:

Cada elemento del array `posts`.

Si el array tiene tres posteos, `renderItem` se ejecuta tres veces.

Que se manda a `Post`:

- `id`: id del documento
- `data`: campos del post
- `navigation`: navegacion de Home

## 9. Componente Post

### `Post.js`

Objetivo: mostrar un posteo y permitir likes y comentarios.

Recibe:

```js
function Post(props)
```

Estas props vienen de:

```js
<Post id={item.id} data={item.data} navigation={props.navigation} />
```

Entonces:

- `props.id`: id del documento.
- `props.data`: datos del post.
- `props.navigation`: navegacion.

### Mostrar datos

```js
props.data.email
props.data.descripcionPost
```

Se muestran datos que vienen de Firestore.

### Likes

```js
const likes = props.data.likes ? props.data.likes : [];
```

Si el post tiene array de likes, se usa. Si no, se usa array vacio.

```js
const userEmail = auth.currentUser.email;
```

Obtiene el email del usuario logueado.

```js
const liked = likes.includes(userEmail);
```

Pregunta si ese email ya esta en el array.

### Agregar o sacar like

```js
db.collection('posts').doc(props.id).update(...)
```

Que significa:

- `collection('posts')`: entro a posts.
- `doc(props.id)`: elijo el documento puntual del post.
- `update`: modifico ese documento.

Si ya habia like:

```js
arrayRemove(userEmail)
```

Saca el email del array.

Si no habia like:

```js
arrayUnion(userEmail)
```

Agrega el email al array y evita duplicados.

### Ir a comentarios

```js
props.navigation.navigate('Comentarios', {
  postId: props.id,
  descripcionPost: props.data.descripcionPost,
  email: props.data.email,
  likes: likes.length,
})
```

Que hace:

- navega a la pantalla `Comentarios`
- envia datos por parametros
- el dato mas importante es `postId`

## 10. Comentarios

### `Comentarios.js`

Objetivo: mostrar el post elegido, listar sus comentarios y agregar nuevos.

### De donde sale `postId`

```js
const postId = props.route.params.postId;
```

Ese `postId` fue enviado desde `Post.js` con `navigate`.

### Estados

```js
const [post, setPost] = useState(null);
const [comentario, setComentario] = useState('');
const [comentarios, setComentarios] = useState([]);
const [loading, setLoading] = useState(true);
```

Que guarda cada uno:

- `post`: el posteo completo que se trae de Firebase.
- `comentario`: lo que escribe el usuario en el input.
- `comentarios`: array de comentarios del post.
- `loading`: loader mientras Firebase responde.

### Leer el documento del post

```js
db.collection('posts').doc(postId).onSnapshot(doc => {
```

Que significa:

- `collection('posts')`: entro a la coleccion posts.
- `doc(postId)`: elijo el documento del post que estoy comentando.
- `onSnapshot`: escucho ese documento en tiempo real.

Que devuelve:

Un documento puntual, no una lista.

### Sacar data del documento

```js
const data = doc.data();
```

`data` contiene los campos del post:

- `descripcionPost`
- `email`
- `createdAt`
- `likes`
- `comments`

### Guardar post y comentarios

```js
setPost({
  id: doc.id,
  data: data,
});
```

Esto arma un objeto parecido al que usa Home, para poder reutilizar `Post`.

```js
const comentarios = data.comments ? data.comments : [];
setComentarios(comentarios);
```

Esto toma el array `comments` del post. Si no existe, usa array vacio.

### Renderizar el post

```js
<Post id={post.id} data={post.data} navigation={props.navigation} />
```

Esto reutiliza el mismo componente `Post` que Home y Profile.

### Mostrar comentarios

```js
<FlatList
  data={comentarios}
  keyExtractor={(item, index) => index.toString()}
  renderItem={({ item }) => ...}
/>
```

Que es `item`:

Cada comentario dentro del array `comentarios`.

Como cada comentario esta dentro de un array y no es un documento separado, no tiene `doc.id`. Por eso usamos el `index`.

### Agregar comentario

```js
db.collection('posts').doc(postId).update({
  comments: firebase.firestore.FieldValue.arrayUnion({
    comentario: comentario,
    email: auth.currentUser.email,
    createdAt: Date.now(),
  }),
})
```

Que hace:

- entra a posts
- elige el documento del post
- modifica el array `comments`
- agrega un objeto nuevo con texto, email y fecha

Frase para defender:

> Los comentarios viven dentro del documento del post, igual que los likes. Por eso para agregar un comentario hago update del documento del post y uso arrayUnion sobre el campo comments.

## 11. Perfil

### `Profile.js`

Objetivo: mostrar datos del usuario, sus posteos y permitir logout.

Usuario actual:

```js
const email = auth.currentUser.email;
```

Sirve para identificar al usuario logueado.

### Buscar datos del usuario

```js
db.collection('users').where('email', '==', email).onSnapshot(docs => {
```

Que hace:

- entra a `users`
- filtra documentos donde el campo `email` sea igual al email del usuario logueado
- escucha el resultado

### Buscar posteos del usuario

```js
db.collection('posts').where('email', '==', email).onSnapshot(docs => {
```

Que hace:

Trae solamente los posteos creados por ese usuario.

### Mostrar posteos propios

Usa `FlatList` y renderiza `Post`:

```js
<Post id={item.id} data={item.data} navigation={props.navigation} />
```

Esto permite reutilizar estilo y likes.

Detalle:

El boton comentar dentro de Profile puede no navegar a Comentarios porque Profile pertenece al tab principal, no al HomeStack donde esta registrada Comentarios.

### Logout

```js
auth.signOut()
```

Cierra sesion en Firebase.

Si sale bien:

```js
props.navigation.navigate('Login')
```

## 12. Que pasa cuando el usuario hace cosas

### Cuando se registra

1. Escribe en los inputs.
2. Los estados se actualizan con `setEmail`, `setUserName`, `setPassword`.
3. Toca `Registrarme`.
4. Se ejecuta `onSubmit`.
5. Se validan campos.
6. Firebase Auth crea el usuario.
7. Firestore crea un documento en `users`.
8. La app navega a `Login`.

### Cuando inicia sesion

1. Escribe email y contrasena.
2. Toca `Iniciar sesion`.
3. Firebase Auth valida credenciales.
4. Si son correctas, navega a `HomeMenu`.
5. Si falla, se muestra error.

### Cuando crea un post

1. Escribe texto.
2. Toca `Crear post`.
3. Firestore crea documento en `posts`.
4. Ese documento tiene likes y comments vacios.
5. Home lo recibe porque escucha `posts` con `onSnapshot`.

### Cuando da like

1. Toca `me gusta`.
2. `Post` revisa si su email esta en `likes`.
3. Si esta, lo saca con `arrayRemove`.
4. Si no esta, lo agrega con `arrayUnion`.
5. Firestore actualiza el documento.
6. Las pantallas que escuchan ese post se actualizan.

### Cuando comenta

1. Toca `Comentar` desde Home.
2. La app navega a `Comentarios` y manda `postId`.
3. `Comentarios` usa `postId` para leer el documento del post.
4. Muestra el post con el componente `Post`.
5. El usuario escribe comentario.
6. Toca `Publicar comentario`.
7. Firestore actualiza el array `comments` del post.
8. La lista de comentarios se actualiza por `onSnapshot`.

### Cuando entra al perfil

1. Se toma `auth.currentUser.email`.
2. Se busca el documento del usuario en `users`.
3. Se buscan sus posteos en `posts`.
4. Se muestran datos y posteos.

## 13. Frase final para defender toda la app

> La app esta hecha con componentes funcionales. Uso estados con useState para guardar datos que cambian, useEffect para ejecutar lecturas de Firebase cuando cargan pantallas, FlatList para renderizar arrays, y Firebase Auth para autenticacion. En Firestore tengo users y posts. Los posts guardan likes y comments como arrays dentro del mismo documento. Para crear documentos uso add, para leer en tiempo real uso onSnapshot, para filtrar uso where, y para modificar un documento uso update.
