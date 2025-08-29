import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import Dashboard from '../screens/dashboard';
import { FontAwesome, MaterialCommunityIcons, MaterialIcons, Octicons } from '@expo/vector-icons';
import { Platform } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import Sessions from '../screens/sessions';
import Progress from '../screens/progress';
import Profile from '../screens/profile';
import Login from '../screens/login';
import Register from '../screens/register';
import { WorkoutConfiguration } from '../screens/workoutConfiguration';

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

function AppTabs() {
    return (
        <Tab.Navigator
            screenOptions={{
                tabBarActiveTintColor: "#b71814",
                tabBarInactiveTintColor: "#9ba1ad",
                tabBarLabelPosition: 'below-icon',
                headerShown: false,
                tabBarStyle: {
                    paddingVertical: Platform.OS === 'ios' ? 20 : 0,
                    height: 70,
                    backgroundColor: '#202938'
                },
            }}>
            <Tab.Screen
                name='Dashboard'
                component={Dashboard}
                options={{
                    tabBarIcon: (({ size, color }) => (
                        <MaterialIcons
                            name="home"
                            size={size}
                            color={color}
                        />
                    ))
                }}
            />
            <Tab.Screen
                name='Treinos'
                component={Sessions}
                options={{
                    tabBarIcon: (({ size, color }) => (
                        <MaterialCommunityIcons
                            name="weight-lifter"
                            size={size}
                            color={color}
                        />
                    ))
                }}
            />
            <Tab.Screen
                name='Progresso'
                component={Progress}
                options={{
                    tabBarIcon: (({ size, color }) => (
                        <Octicons
                            name="graph"
                            size={size}
                            color={color}
                        />
                    ))
                }}
            />

            <Tab.Screen
                name='Profile'
                component={Profile}
                options={{
                    tabBarIcon: (({ size, color }) => (
                        <FontAwesome
                            name="user"
                            size={size}
                            color={color}
                        />
                    ))
                }}
            />
        </Tab.Navigator>
    );
}

function Routes() {
    return (
        <NavigationContainer>
            <Stack.Navigator initialRouteName="Login" screenOptions={{ headerShown: false }}>
                <Stack.Screen name="Login" component={Login} />
                <Stack.Screen name="Register" component={Register} />
                <Stack.Screen name="AppTabs" component={AppTabs} />
                <Stack.Screen name="WorkoutConfiguration" component={WorkoutConfiguration} />
            </Stack.Navigator>
        </NavigationContainer>
    );
}

export default Routes