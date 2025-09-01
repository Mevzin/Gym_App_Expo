import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import Dashboard from '../screens/dashboard';
import { FontAwesome, MaterialCommunityIcons, MaterialIcons, Octicons } from '@expo/vector-icons';
import { Platform } from 'react-native';
import { NavigationContainer, DarkTheme } from '@react-navigation/native';
import Sessions from '../screens/sessions';
import Progress from '../screens/progress';
import Profile from '../screens/profile';
import Login from '../screens/login';
import Register from '../screens/register';
import { WorkoutConfiguration } from '../screens/workoutConfiguration';
import { EditWorkout } from '../screens/editWorkout';
import SplashScreen from '../screens/splash';
import PersonalDashboard from '../screens/personalDashboard';
import EditUserWorkout from '../screens/editUserWorkout';
import UserWorkoutDetails from '../screens/userWorkoutDetails';
import { RootStackParamList } from '../types/navigation';

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator<RootStackParamList>();

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
                    backgroundColor: '#202938',
                    borderTopWidth: 2,
                    borderTopColor: '#9ba1ad',
                },
                animation: 'shift',
                tabBarHideOnKeyboard: true,
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
        <NavigationContainer theme={DarkTheme}>
            <Stack.Navigator
                initialRouteName="Splash"
                screenOptions={{
                    headerShown: false,
                    cardStyle: { backgroundColor: '#1a1a1a' },
                }}
            >
                <Stack.Screen name="Splash" component={SplashScreen} />
                <Stack.Screen name="Login" component={Login} />
                <Stack.Screen name="Register" component={Register} />
                <Stack.Screen name="AppTabs" component={AppTabs} />
                <Stack.Screen name="WorkoutConfiguration" component={WorkoutConfiguration} />
                <Stack.Screen name="EditWorkout" component={EditWorkout} />
                <Stack.Screen name="PersonalDashboard" component={PersonalDashboard} />
                <Stack.Screen name="EditUserWorkout" component={EditUserWorkout} />
                <Stack.Screen name="UserWorkoutDetails" component={UserWorkoutDetails} />
            </Stack.Navigator>
        </NavigationContainer>
    );
}

export default Routes