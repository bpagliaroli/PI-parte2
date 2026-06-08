import app from 'firebase/app';
import 'firebase/auth';
import 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyBjpog9INn9nyRFJtATb3hIMY6iv3G7dHQ",
  authDomain: "proyectointegrador-79c26.firebaseapp.com",
  projectId: "proyectointegrador-79c26",
  storageBucket: "proyectointegrador-79c26.firebasestorage.app",
  messagingSenderId: "750776134842",
  appId: "1:750776134842:web:5194134d835f2135c4e683"
};

app.initializeApp(firebaseConfig); //ejecucion de la configuracion
export const auth = app.auth(); //exportacion del modulo de autenticacion para usarlo en otros archivos
export const db = app.firestore(); //exportacion del modulo de base de datos para usarlo en otros archivos
