import { useEffect, useRef, useState } from 'react';
import { View, Text, KeyboardAvoidingView, Platform, TextInput } from 'react-native';
import { useRouter } from 'expo-router';
import { Input, Button, Spinner } from '@/components/ui';
import { useAuth } from '@/providers/AuthProvider';

function getPasswordStrength(password: string): 'Weak' | 'Medium' | 'Strong' {
  if (password.length >= 12 && /[A-Z]/.test(password) && /[0-9]/.test(password)) return 'Strong';
  if (password.length >= 8) return 'Medium';
  return 'Weak';
}

export default function SignupScreen() {
  const router = useRouter();
  const { signup, isLoading } = useAuth();
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const emailInputRef = useRef<TextInput>(null);

  useEffect(() => {
    emailInputRef?.current?.focus();
  }, []);

  const handleSignup = async () => {
    setError('');
    if (!firstName || firstName.length < 2) return setError('First name must be at least 2 characters');
    if (!email.includes('@')) return setError('Enter a valid email');
    if (password.length < 8) return setError('Password must be at least 8 characters');
    if (password !== confirmPassword) return setError('Passwords do not match');

    try {
      await signup(email, password, firstName, lastName);
      router.replace('/(tabs)');
    } catch (err: any) {
      setError(err.message || 'Signup failed');
    }
  };

  const strength = getPasswordStrength(password);

  return (
    <KeyboardAvoidingView
      className="flex-1 bg-background px-6 justify-center"
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <View className="mb-8">
        <Text className="text-3xl font-bold text-center text-text">Create Account</Text>
        <Text className="text-sm text-center text-gray-500 mt-2">Sign up to start shopping</Text>
      </View>

      <Input
        label="First Name"
        value={firstName}
        onChangeText={setFirstName}
        placeholder="John"
        className="mb-4"
      />

      <Input
        label="Last Name"
        value={lastName}
        onChangeText={setLastName}
        placeholder="Doe"
        className="mb-4"
      />

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
        className="mb-1"
        rightIcon={
          <Text
            onPress={() => setShowPassword(!showPassword)}
            className="text-sm text-primary font-medium"
          >
            {showPassword ? 'Hide' : 'Show'}
          </Text>
        }
      />
      <Text className="text-xs text-gray-500 mb-3">Strength: {strength}</Text>

      <Input
        label="Confirm Password"
        secureTextEntry={!showPassword}
        value={confirmPassword}
        onChangeText={setConfirmPassword}
        placeholder="••••••••"
        className="mb-2"
      />

      {error ? <Text className="text-red-500 text-sm mt-2 mb-4">{error}</Text> : null}

      <Button onPress={handleSignup} disabled={isLoading} className="mt-4">
        {isLoading ? <Spinner /> : <Text className="text-white font-semibold">Sign Up</Text>}
      </Button>

      <View className="flex-row justify-center mt-6">
        <Text className="text-sm text-gray-500">Already have an account?</Text>
        <Text
          onPress={() => router.push('/(auth)/login')}
          className="text-sm text-primary font-medium ml-1"
        >
          Login
        </Text>
      </View>
    </KeyboardAvoidingView>
  );
}