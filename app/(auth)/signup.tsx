import React, { useState } from 'react';
import { View, Text, KeyboardAvoidingView, Platform } from 'react-native';
import { useRouter } from 'expo-router';
import { useAuth } from '@/providers/AuthProvider';
import { Button, Input, Spinner, ErrorView } from '@/components/ui';

export default function SignupScreen() {
  const { signup, isLoading } = useAuth();
  const router = useRouter();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');

  const handleSignup = async () => {
    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }
    try {
      await signup(email, password, name);
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
          label="Full Name"
          value={name}
          onChangeText={setName}
        />
        <Input
          label="Email"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
        />
        <Input
          label="Password"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
        />
        <Input
          label="Confirm Password"
          value={confirmPassword}
          onChangeText={setConfirmPassword}
          secureTextEntry
        />
        {error && <ErrorView message={error} />}
        <Button onPress={handleSignup} disabled={isLoading}>
          {isLoading ? <Spinner /> : <Text>Create Account</Text>}
        </Button>
        <Button onPress={() => router.push('/(auth)/login')}>
          <Text>Already have an account? Log in</Text>
        </Button>
      </View>
    </KeyboardAvoidingView>
  );
}