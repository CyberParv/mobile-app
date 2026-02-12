import React, { useState } from 'react';
import { View, Text, KeyboardAvoidingView, Platform } from 'react-native';
import { useAuth } from '@/hooks/useAuth';
import { Button, Input } from '@/components/ui';
import { useRouter } from 'next/router';

export default function LoginScreen() {
  const { login, isLoading } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const router = useRouter();

  const handleLogin = async () => {
    try {
      await login(email, password);
      router.replace('/(tabs)');
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={{ flex: 1, justifyContent: 'center', padding: 16 }}
    >
      <View>
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
        {error ? <Text style={{ color: 'red' }}>{error}</Text> : null}
        <Button onPress={handleLogin} disabled={isLoading}>
          {isLoading ? <Spinner /> : <Text>Login</Text>}
        </Button>
        <Button onPress={() => router.push('/(auth)/signup')}>
          <Text>Sign Up</Text>
        </Button>
      </View>
    </KeyboardAvoidingView>
  );
}