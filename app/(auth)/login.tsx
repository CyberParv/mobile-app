import React, { useState, useRef, useEffect } from 'react';
import { View, Text, KeyboardAvoidingView, Platform, TextInput } from 'react-native';
import { useRouter } from 'expo-router';
import { useAuth } from '@/providers/AuthProvider';
import { Button, Input, Spinner } from '@/components/ui';

export default function LoginScreen() {
  const router = useRouter();
  const { login, isLoading } = useAuth();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const emailRef = useRef<TextInput>(null);

  useEffect(() => {
    emailRef.current?.focus();
  }, []);

  const handleLogin = async () => {
    setError('');
    try {
      await login(email.trim(), password);
      router.replace('/(tabs)');
    } catch (err: any) {
      const message = err?.response?.data?.error?.message || 'Login failed';
      setError(message);
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      className="flex-1 justify-center px-6 bg-background dark:bg-black"
    >
      <View className="mb-10">
        <Text className="text-3xl font-bold text-center text-gray-900 dark:text-white">Welcome Back</Text>
        <Text className="text-sm text-center text-gray-500 mt-2">Login to continue shopping</Text>
      </View>

      <Input
        ref={emailRef}
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
        className="mb-4"
      />

      {error ? <Text className="text-red-500 text-sm mb-4 text-center">{error}</Text> : null}

      <Button onPress={handleLogin} disabled={isLoading} className="mb-4">
        {isLoading ? <Spinner /> : <Text className="text-white font-semibold">Login</Text>}
      </Button>

      <Text className="text-center text-sm text-gray-500">
        Don't have an account?{' '}
        <Text
          className="text-primary font-semibold"
          onPress={() => router.push('/(auth)/signup')}
        >
          Sign up
        </Text>
      </Text>
    </KeyboardAvoidingView>
  );
}