import { StatusBar } from 'expo-status-bar';
import { Platform, View } from 'react-native';
import { useFonts, Roboto_300Light, Roboto_400Regular, Roboto_500Medium, Roboto_700Bold } from '@expo-google-fonts/roboto';
import * as SplashScreen from 'expo-splash-screen';
import { useEffect } from 'react';
import "./global.css"
import Routes from './src/routes';

SplashScreen.preventAutoHideAsync();

export default function App() {
  const [fontsLoaded] = useFonts({
    Roboto_300Light,
    Roboto_400Regular,
    Roboto_500Medium,
    Roboto_700Bold,
  });

  useEffect(() => {
    if (fontsLoaded) {
      SplashScreen.hideAsync();
    }
  }, [fontsLoaded]);

  if (!fontsLoaded) {
    return null;
  }

  return (
    <View className={`flex-1 ${Platform.OS === 'ios' ? 'pt-14' : 'pt-10'} bg-primary`}>
      <StatusBar style="light" />
      <Routes />
    </View>
  );
}
