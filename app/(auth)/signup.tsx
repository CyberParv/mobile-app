import React, { useState } from 'react';
import { View, Text, KeyboardAvoidingView, Platform } from 'react-native';
import { useAuth } from '@/hooks/useAuth';
import { Button, Input } from '@/components/ui';
import { useRouter } from 'next/router';

export default function SignupScreen() {
  const { signup, isLoading } = useAuth();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const router = useRouter();

  const handleSignup = async () => {
    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }
    try {
      await signup(email, password, name);
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
          placeholder="Name"
          value={name}
          onChangeText={setName}
        />
        <Input
          placeholder="Email"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
        />
        <Input
          placeholder="Password"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
        />
        <Input
          placeholder="Confirm Password"
          value={confirmPassword}
          onChangeText={setConfirmPassword}
          secureTextEntry
        />
        {error ? <Text style={{ color: 'red' }}>{error}</Text> : null}
        <Button onPress={handleSignup} disabled={isLoading}>
          {isLoading ? <Spinner /> : <Text>Sign Up</Text>}
        </Button>
        <Button onPress={() => router.push('/(auth)/login')}>
          <Text>Login</Text>
        </Button>
      </View>
    </KeyboardAvoidingView>
  );
}