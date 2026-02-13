import React, { useState } from 'react';
import { View, Text } from 'react-native';
import { useRouter } from 'expo-router';
import { Button, Input, Spinner } from '@/components/ui';
import { useAuth } from '@/hooks/useAuth';

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
      setError(err.message);
    }
  };

  return (
    <View className="p-4">
      <Text className="text-2xl font-bold mb-4">Sign Up</Text>
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
      {error ? <Text className="text-red-500 mt-2">{error}</Text> : null}
      <Button onPress={handleSignup} disabled={isLoading}>
        {isLoading ? <Spinner /> : <Text className="text-white">Sign Up</Text>}
      </Button>
      <Button onPress={() => router.push('/(auth)/login')}>
        <Text className="text-blue-500">Login</Text>
      </Button>
    </View>
  );
}