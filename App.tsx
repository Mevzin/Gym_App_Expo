import { StatusBar } from 'expo-status-bar';
import { Platform, View } from 'react-native';
import "./global.css"
import Routes from './src/routes';

export default function App() {
  return (
    <View className={`flex-1 ${Platform.OS === 'ios' ? 'pt-14' : 'pt-10'} bg-primary`}>
      <StatusBar style="light" />
      <Routes />
    </View>
  );
}
