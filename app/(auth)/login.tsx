import React, { useState } from 'react';
import { View, Text, KeyboardAvoidingView, Platform } from 'react-native';
import { useRouter } from 'expo-router';
import { Button, Input, Spinner } from '@/components/ui';
import { useAuth } from '@/hooks/useAuth';

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
      setError(err.message);
    }
  };

  return (
    <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
      <View className="p-4">
        <Text className="text-2xl font-bold mb-4">Login</Text>
        <Input
          placeholder="Email"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
          autoFocus
        />
        <Input
          placeholder="Password"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
        />
        {error ? <Text className="text-red-500 mt-2">{error}</Text> : null}
        <Button onPress={handleLogin} disabled={isLoading}>
          {isLoading ? <Spinner /> : <Text className="text-white">Login</Text>}
        </Button>
        <Button onPress={() => router.push('/(auth)/signup')}>
          <Text className="text-blue-500">Sign Up</Text>
        </Button>
      </View>
    </KeyboardAvoidingView>
  );
}