import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import FontAwesome5 from '@expo/vector-icons/FontAwesome5';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import HomeStack from '../HomeStack/HomeStack';
import Profile from '../../screens/Profile/Profile';
import NuevoPost from '../../screens/NuevoPost/NuevoPost';

const Tab = createBottomTabNavigator();

function HomeMenu() {
  return (
    <Tab.Navigator screenOptions={{
      tabBarShowLabel: false,
      tabBarStyle: {
        backgroundColor: '#f7ead2',
        borderTopColor: '#d8c3a5',
      },
    }}>
      <Tab.Screen
        name="Home"
        component={HomeStack}
        options={
          {
            headerShown: false,
            tabBarIcon: () => <FontAwesome5 name="home" size={24}  />,
          }
        }
      />

      <Tab.Screen
        name="Nuevo post"
        component={NuevoPost}
        options={
          {
            headerShown: false,
            tabBarIcon: () => <MaterialIcons name="local-post-office" size={24} />,
          }
        }
      />

      <Tab.Screen
        name="Profile"
        component={Profile}
        options={
          {
            headerShown: false,
            tabBarIcon: () => <MaterialCommunityIcons name="face-man-profile" size={24} />,
          }
        }
      />
    </Tab.Navigator>
  );
}

export default HomeMenu;
