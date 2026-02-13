import React from 'react';
import { fireEvent, render } from '@testing-library/react-native';
import Button from '@/components/ui/Button';

describe('Button', () => {
  it('renders children correctly', () => {
    const { getByText } = render(<Button>Click Me</Button>);
    expect(getByText('Click Me')).toBeTruthy();
  });

  it('calls onPress when pressed', () => {
    const onPress = jest.fn();
    const { getByText } = render(<Button onPress={onPress}>Click Me</Button>);
    fireEvent.press(getByText('Click Me'));
    expect(onPress).toHaveBeenCalled();
  });

  it('shows spinner when loading=true', () => {
    const { getByTestId } = render(<Button loading>Click Me</Button>);
    expect(getByTestId('spinner')).toBeTruthy();
  });

  it('is disabled when disabled=true', () => {
    const onPress = jest.fn();
    const { getByText } = render(<Button disabled onPress={onPress}>Click Me</Button>);
    fireEvent.press(getByText('Click Me'));
    expect(onPress).not.toHaveBeenCalled();
  });

  it('applies variant styles correctly', () => {
    const { getByText } = render(<Button variant="primary">Primary</Button>);
    expect(getByText('Primary')).toHaveStyle({ backgroundColor: 'blue' });
  });

  it('is accessible (has correct role)', () => {
    const { getByRole } = render(<Button>Click Me</Button>);
    expect(getByRole('button')).toBeTruthy();
  });
});