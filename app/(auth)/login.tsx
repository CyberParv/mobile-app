import React, { useState } from 'react';
import { View, Text, KeyboardAvoidingView, Platform } from 'react-native';
import { useRouter } from 'expo-router';
import { useAuth } from '@/providers/AuthProvider';
import { Button, Input, Spinner, ErrorView } from '@/components/ui';

export default function LoginScreen() {
  const { login, isLoading } = useAuth();
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleLogin = async () => {
    try {
      await login(email, password);
      router.replace('/(tabs)');
    } catch (err) {
      setError(err.response.data?.error?.message || 'An error occurred');
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={{ flex: 1 }}
    >
      <View className="flex-1 justify-center p-4">
        <Input
          label="Email"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
          autoFocus
        />
        <Input
          label="Password"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
        />
        {error && <ErrorView message={error} />}
        <Button onPress={handleLogin} disabled={isLoading}>
          {isLoading ? <Spinner /> : <Text>Log In</Text>}
        </Button>
        <Button onPress={() => router.push('/(auth)/signup')}>
          <Text>Create account</Text>
        </Button>
      </View>
    </KeyboardAvoidingView>
  );
}