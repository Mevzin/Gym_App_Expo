import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import Dashboard from '../screens/dashboard';
import { FontAwesome, MaterialCommunityIcons, MaterialIcons, Octicons, Ionicons } from '@expo/vector-icons';
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
import SubscriptionScreen from '../screens/subscription';
import PlanCreation from '../screens/planCreation';
import PlansManagement from '../screens/plansManagement';
import { RootStackParamList } from '../types/navigation';
import { useAuth } from '../contexts/AuthContext';

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator<RootStackParamList>();

function AppTabs() {
    const { user } = useAuth();
    
    return (
        <Tab.Navigator
            screenOptions={({ route }) => ({
                tabBarIcon: ({ focused, color, size }) => {
                    let iconName: keyof typeof Ionicons.glyphMap;

                    if (route.name === 'Dashboard') {
                        iconName = focused ? 'home' : 'home-outline';
                    } else if (route.name === 'Treinos') {
                        iconName = focused ? 'fitness' : 'fitness-outline';
                    } else if (route.name === 'Progresso') {
                        iconName = focused ? 'stats-chart' : 'stats-chart-outline';
                    } else if (route.name === 'Profile') {
                        iconName = focused ? 'person' : 'person-outline';
                    } else if (route.name === 'Planos') {
                        iconName = focused ? 'card' : 'card-outline';
                    } else {
                        iconName = 'ellipse-outline';
                    }

                    return <Ionicons name={iconName} size={size} color={color} />;
                },
                tabBarActiveTintColor: '#007AFF',
                tabBarInactiveTintColor: 'gray',
                headerShown: false,
            })}>
            <Tab.Screen name="Dashboard" component={Dashboard} />
            <Tab.Screen name="Treinos" component={Sessions} />
            <Tab.Screen name="Progresso" component={Progress} />
            <Tab.Screen name="Profile" component={Profile} />
            {user?.role === 'admin' && (
                <Tab.Screen name="Planos" component={PlansManagement} />
            )}
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
                <Stack.Screen name="Subscription" component={SubscriptionScreen} />
                <Stack.Screen name="PlanCreation" component={PlanCreation} />
                <Stack.Screen name="PlansManagement" component={PlansManagement} />
            </Stack.Navigator>
        </NavigationContainer>
    );
}

export default Routes