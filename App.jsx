import './global.css';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, StatusBar, StyleSheet, View } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import { store, persistor } from './src/store';
import HomeScreen from './src/Project/HomeScreen';
import Login from './src/Project/Login';
import { logoutUser, subscribeToAuthChanges } from './src/services/auth';
import { Colors } from './src/theme/theme';

const App = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Automatically restore session across app restarts
    const unsubscribe = subscribeToAuthChanges(currentUser => {
      setUser(currentUser);
      setLoading(false);
    });
    return unsubscribe;
  }, []);

  const handleLogout = async () => {
    try {
      await logoutUser();
      setUser(null);
    } catch (err) {
      console.error('Logout error:', err);
    }
  };

  if (loading) {
    return (
      <SafeAreaProvider>
        <View style={styles.loadingContainer}>
          <StatusBar
            barStyle="dark-content"
            backgroundColor={Colors.background}
            translucent={false}
          />
          <ActivityIndicator size="large" color={Colors.primary} />
        </View>
      </SafeAreaProvider>
    );
  }

   return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <SafeAreaProvider>
          <View style={styles.container}>
            <StatusBar
              barStyle="dark-content"
              backgroundColor={Colors.surface}
              translucent={false}
            />
            {user ? (
              <HomeScreen onLogout={handleLogout} />
            ) : (
              <Login onLoginSuccess={loggedInUser => setUser(loggedInUser)} />
            )}
          </View>
        </SafeAreaProvider>
      </PersistGate>
    </Provider>
  );
};

export default App;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Colors.background,
  },
});
