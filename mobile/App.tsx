import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, SafeAreaView, Dimensions, TouchableOpacity, KeyboardAvoidingView, Platform } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { LinearGradient } from 'expo-linear-gradient';
import { Colors, Gradients } from './src/theme/colors';
import { MessageCircle, Heart, Sparkles, User } from 'lucide-react-native';
import { BaseMainChat } from './src/components/BaseMainChat';
import { authService } from './src/services/auth';

const { width } = Dimensions.get('window');

export default function App() {
  const [currentScreen, setCurrentScreen] = useState<'home' | 'chat'>('home');
  const [isInitializing, setIsInitializing] = useState(true);
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [isStartingSession, setIsStartingSession] = useState(false);

  useEffect(() => {
    authService.initializeUser()
      .then(async () => {
        const storedSessionId = await authService.getSessionId();
        if (storedSessionId) {
          setSessionId(storedSessionId);
        }
      })
      .catch(console.error)
      .finally(() => setIsInitializing(false));
  }, []);

  const handleResetUser = async () => {
    setIsInitializing(true);
    await authService.initializeUser(true).catch(console.error);
    setSessionId(null);
    setIsInitializing(false);
  };

  const handleStartSession = async () => {
    try {
      setIsStartingSession(true);
      const token = await authService.getToken();
      if (!token) return;
      
      const { chatApi } = await import('./src/services/api');
      const data = await chatApi.startSession(token);
      await authService.setSessionId(data.sessionId);
      setSessionId(data.sessionId);
    } catch (error) {
      console.error('Failed to start session', error);
    } finally {
      setIsStartingSession(false);
    }
  };

  const handleSessionEnd = async () => {
    await authService.clearSessionId();
    setSessionId(null);
  };

  if (isInitializing) {
    return null;
  }

  return (
    <View style={styles.container}>
      <StatusBar style="dark" />
      <LinearGradient
        colors={Gradients.primary as any}
        style={styles.background}
      />

      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <SafeAreaView style={styles.safeArea}>
          <View style={styles.header}>
            <Text style={styles.greeting}>Привет, я Ванесса</Text>
            <Text style={styles.subtitle}>Твой помощник в любой жизненной ситуации</Text>
            {__DEV__ && (
              <TouchableOpacity onPress={handleResetUser} style={styles.devButton}>
                <Text style={styles.devButtonText}>DEV: Сбросить пользователя</Text>
              </TouchableOpacity>
            )}
          </View>

          <View style={styles.mainContent}>
            {!sessionId ? (
              <View style={styles.startSessionContainer}>
                <TouchableOpacity 
                  style={styles.startSessionButton} 
                  onPress={handleStartSession}
                  disabled={isStartingSession}
                >
                  <Text style={styles.startSessionButtonText}>
                    {isStartingSession ? 'Загрузка...' : 'Начать сессию'}
                  </Text>
                </TouchableOpacity>
              </View>
            ) : (
              <BaseMainChat sessionId={sessionId} onSessionEnd={handleSessionEnd} />
            )}
          </View>
        </SafeAreaView>
      </KeyboardAvoidingView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    height: (Platform.OS === 'web' ? '100vh' : '100%') as any,
    width: '100%',
    maxWidth: Platform.OS === 'web' ? 600 : '100%',
    alignSelf: 'center',
    overflow: 'hidden',
    backgroundColor: Colors.background,
  },
  background: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    height: 300,
    borderBottomLeftRadius: 40,
    borderBottomRightRadius: 40,
  },
  safeArea: {
    flex: 1,
  },
  header: {
    padding: 24,
    marginTop: 40,
  },
  greeting: {
    fontSize: 28,
    fontWeight: '700',
    color: 'white',
    letterSpacing: -0.5,
  },
  subtitle: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.8)',
    marginTop: 4,
  },
  devButton: {
    marginTop: 10,
    backgroundColor: 'rgba(255,255,255,0.3)',
    padding: 8,
    borderRadius: 8,
    alignSelf: 'flex-start',
  },
  devButtonText: {
    color: 'white',
    fontSize: 12,
    fontWeight: '600',
  },
  mainContent: {
    flex: 1,
  },
  mainCard: {
    height: 180,
    borderRadius: 30,
    overflow: 'hidden',
    elevation: 8,
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.3,
    shadowRadius: 20,
    marginBottom: 24,
  },
  cardGradient: {
    flex: 1,
    padding: 24,
    justifyContent: 'space-between',
  },
  cardTextContainer: {
    marginTop: 'auto',
  },
  cardTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: 'white',
  },
  cardDescription: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.9)',
    marginTop: 4,
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  statBox: {
    width: (width - 64) / 2,
    height: 120,
    borderRadius: 24,
    padding: 20,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
  },
  statLabel: {
    fontSize: 12,
    color: Colors.textSecondary,
    marginTop: 8,
  },
  statValue: {
    fontSize: 18,
    fontWeight: '700',
    color: Colors.text,
    marginTop: 2,
  },
  navBar: {
    height: 90,
    flexDirection: 'row',
    backgroundColor: 'white',
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    paddingHorizontal: 20,
    paddingBottom: 20,
    alignItems: 'center',
    justifyContent: 'space-around',
    elevation: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -10 },
    shadowOpacity: 0.05,
    shadowRadius: 20,
  },
  navItem: {
    padding: 10,
  },
  startSessionContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  startSessionButton: {
    backgroundColor: Colors.primary,
    paddingVertical: 16,
    paddingHorizontal: 32,
    borderRadius: 30,
    elevation: 4,
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
  },
  startSessionButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: '700',
  },
});
