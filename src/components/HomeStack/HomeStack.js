import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Home from '../../screens/Home/Home';
import Comentarios from '../../screens/Comentarios/Comentarios';

const Stack = createNativeStackNavigator();

function HomeStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen name="Home" component={Home} options={{ headerShown: false }} />
      <Stack.Screen name="Comentarios" component={Comentarios} options={{ headerShown: false }} />
    </Stack.Navigator>
  );
}

export default HomeStack;
