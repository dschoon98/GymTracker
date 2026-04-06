import ActiveWorkoutBar from '@/components/ActiveWorkoutBar';
import ActiveWorkoutSheet from '@/components/ActiveWorkoutSheet';
import { ThemeProvider as AppThemeProvider, useAppTheme } from "@/constants/theme";
import { GoogleSignin } from "@react-native-google-signin/google-signin";
import Constants from 'expo-constants';
import { Stack } from 'expo-router';
import { useEffect } from 'react';
import { View } from 'react-native';
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { SafeAreaView } from 'react-native-safe-area-context';

export default function RootLayout() {
  return (
    <AppThemeProvider>
      <RootLayoutContent />
    </AppThemeProvider>
  );
  
}

  
export function RootLayoutContent() {
  const { colors } = useAppTheme();
useEffect(() => {
    console.debug("clientId", Constants.expoConfig?.extra?.webClientId);
    GoogleSignin.configure({
      webClientId: Constants.expoConfig?.extra?.webClientId,
    });
  }, []);
  
  useEffect(() => {
    if (__DEV__) return; // Skip update check in development
    (async () => {
      const Updates = await import('expo-updates');
      try {
        const update = await Updates.checkForUpdateAsync();
        if (update.isAvailable) {
          console.log('Update available, fetching...');
          await Updates.fetchUpdateAsync();
          console.log('Update fetched, reloading...');
          await Updates.reloadAsync();
        } else {
          console.log('No update available');
        }
      } catch (error) {
        console.error('Error checking for updates:', error);
      }
    })();
  }, []);
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaView style={{ flex: 1, backgroundColor: colors.background }} edges={["top", "left", "right"]}>
        <View style={{ flex: 1, backgroundColor: colors.background }}>
          <Stack screenOptions={{ headerShown: false, contentStyle: { backgroundColor: colors.background } }}>
            <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
            <Stack.Screen
              name="(modals)/exercise-detail"
              options={{ presentation: 'modal', headerShown: false, animation: 'slide_from_bottom' }}
            />
            <Stack.Screen
              name="(modals)/routine-editor"
              options={{ presentation: 'modal', headerShown: false, animation: 'slide_from_bottom' }}
            />
            <Stack.Screen
              name="(modals)/workout-complete"
              options={{ presentation: 'modal', headerShown: false, animation: 'slide_from_bottom', gestureEnabled: false }}
            />
          </Stack>
          <ActiveWorkoutBar />        
          </View>
        <ActiveWorkoutSheet />
      </SafeAreaView>
    </GestureHandlerRootView>
  );
}