import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Dashboard from '../screens/dashboard';
import { FontAwesome, MaterialCommunityIcons, MaterialIcons, Octicons } from '@expo/vector-icons';
import { Platform } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import Sessions from '../screens/sessions';
import Progress from '../screens/progress';
import Profile from '../screens/profile';

const Tab = createBottomTabNavigator();

function Routes() {
    return (
        <NavigationContainer>
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
                {/* <Tab.Screen
                    name='Agenda'
                    component={Dashboard}
                    options={{
                        tabBarIcon: (({ size, color }) => (
                            <MaterialIcons
                                name="calendar-today"
                                size={size}
                                color={color}
                            />
                        ))
                    }}
                /> */}
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
        </NavigationContainer>
    );
}

export default Routes