import React, { useState } from 'react';
import { View, Text, KeyboardAvoidingView, Platform } from 'react-native';
import { useRouter } from 'expo-router';
import { useAuth } from '@/providers/AuthProvider';
import { Button, Input, Spinner } from '@/components/ui';
import { validateEmail, validatePasswordStrength } from '@/lib/utils';

export default function SignupScreen() {
  const router = useRouter();
  const { signup, isLoading } = useAuth();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const passwordStrength = validatePasswordStrength(password);

  const handleSignup = async () => {
    setError('');
    if (!name || name.length < 2) return setError('Name must be at least 2 characters');
    if (!validateEmail(email)) return setError('Invalid email address');
    if (password.length < 8) return setError('Password must be at least 8 characters');
    if (password !== confirmPassword) return setError('Passwords do not match');

    try {
      await signup(email.trim(), password, name.trim());
      router.replace('/(tabs)');
    } catch (err: any) {
      const message = err?.response?.data?.error?.message || 'Signup failed';
      setError(message);
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      className="flex-1 justify-center px-6 bg-background dark:bg-black"
    >
      <View className="mb-10">
        <Text className="text-3xl font-bold text-center text-gray-900 dark:text-white">Create Account</Text>
        <Text className="text-sm text-center text-gray-500 mt-2">Sign up to start shopping</Text>
      </View>

      <Input
        label="Full Name"
        value={name}
        onChangeText={setName}
        placeholder="John Doe"
        className="mb-4"
      />

      <Input
        label="Email"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
        autoCorrect={false}
        placeholder="you@example.com"
        className="mb-4"
      />

      <Input
        label="Password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry={!showPassword}
        placeholder="••••••••"
        rightIcon={showPassword ? 'eye-off' : 'eye'}
        onRightIconPress={() => setShowPassword(!showPassword)}
        className="mb-1"
      />
      <Text className="text-xs text-gray-500 mb-4">Strength: {passwordStrength}</Text>

      <Input
        label="Confirm Password"
        value={confirmPassword}
        onChangeText={setConfirmPassword}
        secureTextEntry={!showPassword}
        placeholder="••••••••"
        className="mb-4"
      />

      {error ? <Text className="text-red-500 text-sm mb-4 text-center">{error}</Text> : null}

      <Button onPress={handleSignup} disabled={isLoading} className="mb-4">
        {isLoading ? <Spinner /> : <Text className="text-white font-semibold">Sign Up</Text>}
      </Button>

      <Text className="text-center text-sm text-gray-500">
        Already have an account?{' '}
        <Text
          className="text-primary font-semibold"
          onPress={() => router.push('/(auth)/login')}
        >
          Log in
        </Text>
      </Text>
    </KeyboardAvoidingView>
  );
}