import { StackNavigationProp } from '@react-navigation/stack';
import { RouteProp } from '@react-navigation/native';

export interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  weight?: number;
  height?: number;
  age?: number;
  fileId?: string;
  createdAt: string;
  updatedAt: string;
}
export type RootStackParamList = {
  Splash: undefined;
  Login: undefined;
  Register: undefined;
  AppTabs: undefined;
  WorkoutConfiguration: undefined;
  EditWorkout: {
    user?: User;
  };
  PersonalDashboard: undefined;
  EditUserWorkout: {
    user: User;
  };
  UserWorkoutDetails: {
    user: User;
  };
  MonthlyPayment: undefined;
  PlanCreation: undefined;
  PlansManagement: undefined;
};

export type EditUserWorkoutNavigationProp = StackNavigationProp<RootStackParamList, 'EditUserWorkout'>;
export type EditUserWorkoutRouteProp = RouteProp<RootStackParamList, 'EditUserWorkout'>;

export interface EditUserWorkoutProps {
  navigation: EditUserWorkoutNavigationProp;
  route: EditUserWorkoutRouteProp;
}

export type MonthlyPaymentNavigationProp = StackNavigationProp<RootStackParamList, 'MonthlyPayment'>;
export type MonthlyPaymentRouteProp = RouteProp<RootStackParamList, 'MonthlyPayment'>;

export interface MonthlyPaymentProps {
  navigation: MonthlyPaymentNavigationProp;
  route: MonthlyPaymentRouteProp;
}