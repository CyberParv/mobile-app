import { useEffect, useState } from 'react';
import { View, Text, KeyboardAvoidingView, Platform, TextInput } from 'react-native';
import { useRouter } from 'expo-router';
import { Input, Button, Spinner } from '@/components/ui';
import { useAuth } from '@/providers/AuthProvider';

export default function LoginScreen() {
  const router = useRouter();
  const { login, isLoading } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    // Autofocus email input on mount
    emailInputRef?.current?.focus();
  }, []);

  const emailInputRef = useRef<TextInput>(null);

  const handleLogin = async () => {
    setError('');
    try {
      await login(email, password);
      router.replace('/(tabs)');
    } catch (err: any) {
      setError(err.message || 'Login failed');
    }
  };

  return (
    <KeyboardAvoidingView
      className="flex-1 bg-background px-6 justify-center"
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <View className="mb-8">
        <Text className="text-3xl font-bold text-center text-text">Welcome Back</Text>
        <Text className="text-sm text-center text-gray-500 mt-2">Login to continue shopping</Text>
      </View>

      <Input
        ref={emailInputRef}
        label="Email"
        keyboardType="email-address"
        autoCapitalize="none"
        autoCorrect={false}
        value={email}
        onChangeText={setEmail}
        placeholder="you@example.com"
        className="mb-4"
      />

      <Input
        label="Password"
        secureTextEntry={!showPassword}
        value={password}
        onChangeText={setPassword}
        placeholder="••••••••"
        className="mb-2"
        rightIcon={
          <Text
            onPress={() => setShowPassword(!showPassword)}
            className="text-sm text-primary font-medium"
          >
            {showPassword ? 'Hide' : 'Show'}
          </Text>
        }
      />

      {error ? <Text className="text-red-500 text-sm mt-2 mb-4">{error}</Text> : null}

      <Button onPress={handleLogin} disabled={isLoading} className="mt-4">
        {isLoading ? <Spinner /> : <Text className="text-white font-semibold">Login</Text>}
      </Button>

      <View className="flex-row justify-center mt-6">
        <Text className="text-sm text-gray-500">Don't have an account?</Text>
        <Text
          onPress={() => router.push('/(auth)/signup')}
          className="text-sm text-primary font-medium ml-1"
        >
          Sign up
        </Text>
      </View>
    </KeyboardAvoidingView>
  );
}