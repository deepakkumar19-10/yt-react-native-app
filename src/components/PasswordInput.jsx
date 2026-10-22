import React, { useState } from 'react';
import {
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import Feather from 'react-native-vector-icons/Feather';
import { Colors, Radius, Spacing } from '../theme/theme';

const PasswordInput = ({
  value,
  onChangeText,
  placeholder = 'Enter your password',
  error,
  label,
  placeholderTextColor = Colors.textMuted,
  editable = true,
  autoCapitalize = 'none',
  containerStyle,
  ...rest
}) => {
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [isFocused, setIsFocused] = useState(false);

  return (
    <View style={[styles.wrapper, containerStyle]}>
      {label ? <Text style={styles.label}>{label}</Text> : null}
      <View
        style={[
          styles.inputContainer,
          isFocused ? styles.focusedBorder : null,
          Boolean(error) ? styles.errorBorder : null,
          !editable ? styles.disabledContainer : null,
        ]}
      >
        <Feather
          name="lock"
          size={16}
          color={Boolean(error) ? Colors.error : isFocused ? Colors.primary : Colors.textMuted}
          style={styles.leftIcon}
        />
        <TextInput
          style={styles.textInput}
          value={value}
          onChangeText={onChangeText}
          placeholder={placeholder}
          placeholderTextColor={placeholderTextColor}
          secureTextEntry={!isPasswordVisible}
          editable={editable}
          autoCapitalize={autoCapitalize}
          autoCorrect={false}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          {...rest}
        />
        <TouchableOpacity
          style={styles.eyeButton}
          onPress={() => setIsPasswordVisible(prev => !prev)}
          accessibilityRole="button"
          accessibilityLabel={isPasswordVisible ? 'Hide password' : 'Show password'}
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          activeOpacity={0.65}
        >
          <Feather
            name={isPasswordVisible ? 'eye-off' : 'eye'}
            size={18}
            color={isPasswordVisible ? Colors.primary : Colors.textMuted}
          />
        </TouchableOpacity>
      </View>
      {Boolean(error) ? <Text style={styles.errorText}>{error}</Text> : null}
    </View>
  );
};

export default PasswordInput;

const styles = StyleSheet.create({
  wrapper: {
    width: '100%',
  },
  label: {
    fontSize: 12,
    fontWeight: '600',
    color: Colors.textSecondary,
    marginBottom: Spacing.xs,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.background,
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: Radius.xs,
    paddingHorizontal: Spacing.md,
    minHeight: 46,
  },
  focusedBorder: {
    borderColor: Colors.borderFocus,
    backgroundColor: Colors.surface,
  },
  errorBorder: {
    borderColor: Colors.error,
    backgroundColor: Colors.errorLight + '20',
  },
  disabledContainer: {
    backgroundColor: Colors.backgroundSubtle,
    opacity: 0.7,
  },
  leftIcon: {
    marginRight: Spacing.sm,
  },
  textInput: {
    flex: 1,
    fontSize: 14,
    color: Colors.textPrimary,
    paddingVertical: Spacing.sm,
  },
  eyeButton: {
    padding: Spacing.xs,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorText: {
    fontSize: 12,
    fontWeight: '500',
    color: Colors.error,
    marginTop: Spacing.xs,
    marginLeft: 2,
  },
});
