import React from 'react';
import { fireEvent, render } from '@testing-library/react-native';
import Button from '@/components/ui/Button';

describe('Button Component', () => {
  it('renders children correctly', () => {
    const { getByText } = render(<Button>Click Me</Button>);
    expect(getByText('Click Me')).toBeTruthy();
  });

  it('calls onPress when pressed', () => {
    const onPress = jest.fn();
    const { getByText } = render(<Button onPress={onPress}>Press</Button>);
    fireEvent.press(getByText('Press'));
    expect(onPress).toHaveBeenCalled();
  });

  it('shows spinner when loading=true', () => {
    const { getByTestId } = render(<Button loading>Loading</Button>);
    expect(getByTestId('spinner')).toBeTruthy();
  });

  it('is disabled when disabled=true', () => {
    const { getByRole } = render(<Button disabled>Disabled</Button>);
    expect(getByRole('button')).toBeDisabled();
  });

  it('applies variant styles correctly', () => {
    const { getByText } = render(<Button variant="primary">Primary</Button>);
    expect(getByText('Primary')).toHaveStyle({ backgroundColor: 'blue' });
  });

  it('is accessible with correct role', () => {
    const { getByRole } = render(<Button>Accessible</Button>);
    expect(getByRole('button')).toBeTruthy();
  });
});