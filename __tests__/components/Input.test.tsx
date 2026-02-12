import React from 'react';
import { fireEvent, render } from '@testing-library/react-native';
import Input from '@/components/ui/Input';

describe('Input Component', () => {
  it('renders with label', () => {
    const { getByText } = render(<Input label="Email" />);
    expect(getByText('Email')).toBeTruthy();
  });

  it('shows error message when error prop set', () => {
    const { getByText } = render(<Input error="Error" />);
    expect(getByText('Error')).toBeTruthy();
  });

  it('calls onChangeText', () => {
    const onChangeText = jest.fn();
    const { getByPlaceholderText } = render(<Input onChangeText={onChangeText} placeholder="Enter text" />);
    fireEvent.changeText(getByPlaceholderText('Enter text'), 'Hello');
    expect(onChangeText).toHaveBeenCalledWith('Hello');
  });

  it('toggles password visibility', () => {
    const { getByTestId, getByPlaceholderText } = render(<Input secureTextEntry toggleVisibility />);
    const input = getByPlaceholderText('Password');
    fireEvent.press(getByTestId('toggle-visibility'));
    expect(input.props.secureTextEntry).toBe(false);
    fireEvent.press(getByTestId('toggle-visibility'));
    expect(input.props.secureTextEntry).toBe(true);
  });

  it('shows character count when maxLength set', () => {
    const { getByText } = render(<Input maxLength={10} />);
    expect(getByText('0/10')).toBeTruthy();
  });
});