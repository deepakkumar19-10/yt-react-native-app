import React, { useRef, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  Animated,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import Feather from 'react-native-vector-icons/Feather';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import PasswordInput from '../components/PasswordInput';
import {
  checkUserExists,
  loginUser,
  registerUser,
  resendVerificationEmail,
  resetUserPassword,
} from '../services/auth';
import { Colors, Radius, Shadows, Spacing, Typography } from '../theme/theme';

const Login = ({ onLoginSuccess }) => {
  const insets = useSafeAreaInsets();
  const topPadding = Math.max(
    insets.top,
    Platform.OS === 'android' ? (StatusBar.currentHeight || 24) : 0,
  );
  const bottomPadding = Math.max(insets.bottom, 16);

  // Modes: 'login' | 'register' | 'forgot_username' | 'forgot_password' | 'forgot_success'
  const [authMode, setAuthMode] = useState('login');

  // Input states
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  // Forgot password state
  const [resetUsername, setResetUsername] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmNewPassword, setConfirmNewPassword] = useState('');

  // UI status
  const [loading, setLoading] = useState(false);
  const [inlineError, setInlineError] = useState('');

  // Smooth micro-animation
  const fadeAnim = useRef(new Animated.Value(1)).current;
  const slideAnim = useRef(new Animated.Value(0)).current;

  const switchMode = nextMode => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 120,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 6,
        duration: 120,
        useNativeDriver: true,
      }),
    ]).start(() => {
      setInlineError('');
      setAuthMode(nextMode);
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 180,
          useNativeDriver: true,
        }),
        Animated.timing(slideAnim, {
          toValue: 0,
          duration: 180,
          useNativeDriver: true,
        }),
      ]).start();
    });
  };

  // 1. Handle Login
  const handleLogin = async () => {
    setInlineError('');
    if (!email.trim() || !password) {
      setInlineError('Please enter your email and password.');
      return;
    }

    setLoading(true);
    try {
      const { user, emailVerified } = await loginUser(email, password);
      if (emailVerified) {
        setEmail('');
        setPassword('');
        if (onLoginSuccess) {
          onLoginSuccess(user);
        }
      } else {
        Alert.alert(
          'Email Verification Required',
          'Your email is not verified yet. Please check your inbox and spam folder.\n\nWould you like to resend the verification email?',
          [
            { text: 'Cancel', style: 'cancel' },
            {
              text: 'Resend Link',
              onPress: async () => {
                try {
                  await resendVerificationEmail();
                  Alert.alert(
                    'Verification Sent',
                    'A new verification link has been sent to your email. Please check your inbox.',
                  );
                } catch (resendError) {
                  Alert.alert('Error', resendError.message);
                }
              },
            },
          ],
        );
      }
    } catch (error) {
      setInlineError(error.message || 'Incorrect email or password.');
    } finally {
      setLoading(false);
    }
  };

  // 2. Handle Registration
  const handleRegister = async () => {
    setInlineError('');
    if (!email.trim() || !password) {
      setInlineError('Please fill in all details.');
      return;
    }
    if (password.length < 6) {
      setInlineError('Password should be at least 6 characters.');
      return;
    }
    if (!confirmPassword) {
      setInlineError('Please confirm your password.');
      return;
    }
    if (password !== confirmPassword) {
      setInlineError('Passwords do not match.');
      return;
    }

    setLoading(true);
    try {
      await registerUser(email.trim(), password);
      Alert.alert(
        'Account Registered',
        'Verification link sent! Please verify your email before signing in.',
        [
          {
            text: 'Sign In',
            onPress: () => {
              setPassword('');
              setConfirmPassword('');
              switchMode('login');
            },
          },
        ],
      );
    } catch (error) {
      setInlineError(error.message || 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // 3. Handle Forgot Password - Step 1: Verify Username
  const handleCheckUsername = async () => {
    setInlineError('');
    if (!resetUsername.trim()) {
      setInlineError('Please enter your email.');
      return;
    }

    setLoading(true);
    try {
      const { exists } = await checkUserExists(resetUsername.trim());
      if (exists) {
        switchMode('forgot_password');
      } else {
        setInlineError("We couldn't find an account with this email.");
      }
    } catch (err) {
      setInlineError(err.message || 'Failed to verify email. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // 4. Handle Reset Password - Step 2: Set New Password
  const handleResetPassword = async () => {
    setInlineError('');
    if (!newPassword || newPassword.length < 6) {
      setInlineError('New password must be at least 6 characters.');
      return;
    }
    if (!confirmNewPassword) {
      setInlineError('Please confirm your new password.');
      return;
    }
    if (newPassword !== confirmNewPassword) {
      setInlineError('Passwords do not match.');
      return;
    }

    setLoading(true);
    try {
      await resetUserPassword(resetUsername.trim(), newPassword);
      setNewPassword('');
      setConfirmNewPassword('');
      switchMode('forgot_success');
    } catch (err) {
      setInlineError(err.message || 'Failed to reset password.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      style={styles.keyboardContainer}
    >
      <ScrollView
        contentContainerStyle={[
          styles.scrollContent,
          {
            paddingTop: topPadding + Spacing.md,
            paddingBottom: bottomPadding + Spacing.lg,
          },
        ]}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.cardContainer}>
          {/* Brand Top Header */}
          <View style={styles.brandHeader}>
            <View style={styles.brandMarkSquare}>
              <Feather name="package" size={24} color={Colors.primary} />
            </View>
            <Text style={styles.brandTitle}>
              Crowdapps <Text style={{ color: Colors.primary }}>Store</Text>
            </Text>
            <Text style={styles.brandSub}>Crowdapps Store &amp; Stock Management</Text>
          </View>

          {/* Value Proposition Strip */}
          <View style={styles.valuePropsStrip}>
            <View style={styles.valuePropItem}>
              <Feather name="check-circle" size={12} color={Colors.success} />
              <Text style={styles.valuePropText}>Simple to use</Text>
            </View>
            <View style={styles.valuePropItem}>
              <Feather name="check-circle" size={12} color={Colors.success} />
              <Text style={styles.valuePropText}>Always in sync</Text>
            </View>
            <View style={styles.valuePropItem}>
              <Feather name="check-circle" size={12} color={Colors.success} />
              <Text style={styles.valuePropText}>Safe & secure</Text>
            </View>
          </View>

          <Animated.View
            style={{
              opacity: fadeAnim,
              transform: [{ translateY: slideAnim }],
              width: '100%',
            }}
          >
            {/* Inline Error Notice */}
            {Boolean(inlineError) && (
              <View style={styles.inlineErrorBox}>
                <Feather name="alert-triangle" size={14} color={Colors.error} />
                <Text style={styles.inlineErrorText}>{inlineError}</Text>
              </View>
            )}

            {/* ========================================================= */}
            {/* STATE 1: LOGIN                                            */}
            {/* ========================================================= */}
            {authMode === 'login' && (
              <View>
                <View style={styles.stateHeader}>
                  <Text style={styles.eyebrow}>SIGN IN</Text>
                  <Text style={styles.welcomeHeading}>Welcome back</Text>
                  <Text style={styles.welcomeSubhead}>
                    Enter your email and password to open your store.
                  </Text>
                </View>

                {/* Email Field */}
                <View style={styles.fieldGroup}>
                  <Text style={styles.fieldLabel}>Email</Text>
                  <View style={styles.inputContainer}>
                    <Feather
                      name="mail"
                      size={16}
                      color={Colors.textMuted}
                      style={styles.inputIcon}
                    />
                    <TextInput
                      placeholder="you@example.com"
                      placeholderTextColor={Colors.textMuted}
                      style={styles.textInput}
                      value={email}
                      onChangeText={text => {
                        setEmail(text);
                        if (inlineError) setInlineError('');
                      }}
                      keyboardType="email-address"
                      autoCapitalize="none"
                      autoCorrect={false}
                    />
                  </View>
                </View>

                {/* Password Field */}
                <View style={styles.fieldGroup}>
                  <Text style={styles.fieldLabel}>Password</Text>
                  <PasswordInput
                    placeholder="Enter your password"
                    value={password}
                    onChangeText={text => {
                      setPassword(text);
                      if (inlineError) setInlineError('');
                    }}
                  />
                </View>

                {/* Forgot Password Action */}
                <View style={styles.forgotPasswordRow}>
                  <TouchableOpacity
                    onPress={() => {
                      setResetUsername(email);
                      switchMode('forgot_username');
                    }}
                    activeOpacity={0.7}
                    hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
                  >
                    <Text style={styles.forgotPasswordText}>
                      Forgot password?
                    </Text>
                  </TouchableOpacity>
                </View>

                {/* Primary CTA */}
                <TouchableOpacity
                  style={[styles.primaryButton, loading && styles.buttonDisabled]}
                  onPress={handleLogin}
                  disabled={loading}
                  activeOpacity={0.85}
                  accessibilityRole="button"
                  accessibilityLabel="Sign In to Store"
                >
                  {loading ? (
                    <ActivityIndicator color={Colors.textWhite} />
                  ) : (
                    <View style={styles.buttonContent}>
                      <Text style={styles.primaryButtonText}>Sign In to Store</Text>
                      <Feather
                        name="arrow-right"
                        size={16}
                        color={Colors.textWhite}
                        style={{ marginLeft: Spacing.xs }}
                      />
                    </View>
                  )}
                </TouchableOpacity>

                {/* Secondary Action */}
                <TouchableOpacity
                  style={styles.switchButton}
                  onPress={() => switchMode('register')}
                  activeOpacity={0.7}
                >
                  <Text style={styles.switchText}>
                    Don't have an account?{' '}
                    <Text style={styles.switchTextHighlight}>Sign up</Text>
                  </Text>
                </TouchableOpacity>
              </View>
            )}

            {/* ========================================================= */}
            {/* STATE 2: REGISTER                                         */}
            {/* ========================================================= */}
            {authMode === 'register' && (
              <View>
                <View style={styles.stateHeader}>
                  <Text style={styles.eyebrow}>SIGN UP</Text>
                  <Text style={styles.welcomeHeading}>Create account</Text>
                  <Text style={styles.welcomeSubhead}>
                    Create your store account in less than a minute.
                  </Text>
                </View>

                <View style={styles.fieldGroup}>
                  <Text style={styles.fieldLabel}>Email</Text>
                  <View style={styles.inputContainer}>
                    <Feather
                      name="mail"
                      size={16}
                      color={Colors.textMuted}
                      style={styles.inputIcon}
                    />
                    <TextInput
                      placeholder="you@example.com"
                      placeholderTextColor={Colors.textMuted}
                      style={styles.textInput}
                      value={email}
                      onChangeText={text => {
                        setEmail(text);
                        if (inlineError) setInlineError('');
                      }}
                      keyboardType="email-address"
                      autoCapitalize="none"
                      autoCorrect={false}
                    />
                  </View>
                </View>

                <View style={styles.fieldGroup}>
                  <Text style={styles.fieldLabel}>Password (at least 6 characters)</Text>
                  <PasswordInput
                    placeholder="Enter your password"
                    value={password}
                    onChangeText={text => {
                      setPassword(text);
                      if (inlineError) setInlineError('');
                    }}
                  />
                </View>

                <View style={styles.fieldGroup}>
                  <Text style={styles.fieldLabel}>Confirm Password</Text>
                  <PasswordInput
                    placeholder="Confirm your password"
                    value={confirmPassword}
                    onChangeText={text => {
                      setConfirmPassword(text);
                      if (inlineError) setInlineError('');
                    }}
                  />
                </View>

                <TouchableOpacity
                  style={[styles.primaryButton, loading && styles.buttonDisabled]}
                  onPress={handleRegister}
                  disabled={loading}
                  activeOpacity={0.85}
                >
                  {loading ? (
                    <ActivityIndicator color={Colors.textWhite} />
                  ) : (
                    <Text style={styles.primaryButtonText}>Create Account</Text>
                  )}
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.switchButton}
                  onPress={() => switchMode('login')}
                  activeOpacity={0.7}
                >
                  <Text style={styles.switchText}>
                    Already have an account?{' '}
                    <Text style={styles.switchTextHighlight}>Sign in</Text>
                  </Text>
                </TouchableOpacity>
              </View>
            )}

            {/* ========================================================= */}
            {/* STATE 3: FORGOT PASSWORD - STEP 1                         */}
            {/* ========================================================= */}
            {authMode === 'forgot_username' && (
              <View>
                <View style={styles.stateHeader}>
                  <Text style={styles.eyebrow}>HELP</Text>
                  <Text style={styles.welcomeHeading}>Reset Password</Text>
                  <Text style={styles.welcomeSubhead}>
                    Enter your email and we'll help you reset your password.
                  </Text>
                </View>

                <View style={styles.fieldGroup}>
                  <Text style={styles.fieldLabel}>Email</Text>
                  <View style={styles.inputContainer}>
                    <Feather
                      name="mail"
                      size={16}
                      color={Colors.textMuted}
                      style={styles.inputIcon}
                    />
                    <TextInput
                      placeholder="you@example.com"
                      placeholderTextColor={Colors.textMuted}
                      style={styles.textInput}
                      value={resetUsername}
                      onChangeText={text => {
                        setResetUsername(text);
                        if (inlineError) setInlineError('');
                      }}
                      keyboardType="email-address"
                      autoCapitalize="none"
                      autoCorrect={false}
                    />
                  </View>
                </View>

                <TouchableOpacity
                  style={[styles.primaryButton, loading && styles.buttonDisabled]}
                  onPress={handleCheckUsername}
                  disabled={loading}
                  activeOpacity={0.85}
                >
                  {loading ? (
                    <ActivityIndicator color={Colors.textWhite} />
                  ) : (
                    <Text style={styles.primaryButtonText}>Continue</Text>
                  )}
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.switchButton}
                  onPress={() => switchMode('login')}
                  activeOpacity={0.7}
                >
                  <Text style={styles.switchTextHighlight}>Back to Sign In</Text>
                </TouchableOpacity>
              </View>
            )}

            {/* ========================================================= */}
            {/* STATE 4: RESET PASSWORD - STEP 2                         */}
            {/* ========================================================= */}
            {authMode === 'forgot_password' && (
              <View>
                <View style={styles.stateHeader}>
                  <Text style={styles.eyebrow}>NEW PASSWORD</Text>
                  <Text style={styles.welcomeHeading}>Set New Password</Text>
                  <Text style={styles.welcomeSubhead}>
                    Choose a new password for {resetUsername || 'your account'}.
                  </Text>
                </View>

                <View style={styles.fieldGroup}>
                  <Text style={styles.fieldLabel}>New Password (min 6 characters)</Text>
                  <PasswordInput
                    placeholder="Enter your new password"
                    value={newPassword}
                    onChangeText={text => {
                      setNewPassword(text);
                      if (inlineError) setInlineError('');
                    }}
                  />
                </View>

                <View style={styles.fieldGroup}>
                  <Text style={styles.fieldLabel}>Confirm New Password</Text>
                  <PasswordInput
                    placeholder="Confirm your new password"
                    value={confirmNewPassword}
                    onChangeText={text => {
                      setConfirmNewPassword(text);
                      if (inlineError) setInlineError('');
                    }}
                  />
                </View>

                <TouchableOpacity
                  style={[styles.primaryButton, loading && styles.buttonDisabled]}
                  onPress={handleResetPassword}
                  disabled={loading}
                  activeOpacity={0.85}
                >
                  {loading ? (
                    <ActivityIndicator color={Colors.textWhite} />
                  ) : (
                    <Text style={styles.primaryButtonText}>Reset Password</Text>
                  )}
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.switchButton}
                  onPress={() => switchMode('login')}
                  activeOpacity={0.7}
                >
                  <Text style={styles.switchTextHighlight}>Back to Sign In</Text>
                </TouchableOpacity>
              </View>
            )}

            {/* ========================================================= */}
            {/* STATE 5: RESET SUCCESS                                    */}
            {/* ========================================================= */}
            {authMode === 'forgot_success' && (
              <View style={styles.successContainer}>
                <View style={styles.successIconBadge}>
                  <Feather name="check-circle" size={32} color={Colors.success} />
                </View>
                <Text style={styles.welcomeHeading}>Password reset successfully.</Text>
                <Text style={[styles.welcomeSubhead, { textAlign: 'center', marginBottom: Spacing.md }]}>
                  Please sign in with your new password.
                </Text>

                <View style={styles.resetNoticeBox}>
                  <Feather name="mail" size={14} color={Colors.primary} style={{ marginTop: 2 }} />
                  <Text style={styles.resetNoticeText}>
                    A confirmation link was also sent to{' '}
                    <Text style={{ fontWeight: '600', color: Colors.textPrimary }}>
                      {resetUsername}
                    </Text>
                    . Please check your inbox or spam folder.
                  </Text>
                </View>

                <TouchableOpacity
                  style={[styles.primaryButton, { width: '100%' }]}
                  onPress={() => {
                    setEmail(resetUsername);
                    switchMode('login');
                  }}
                  activeOpacity={0.85}
                >
                  <Text style={styles.primaryButtonText}>Back to Sign In</Text>
                </TouchableOpacity>
              </View>
            )}
          </Animated.View>
        </View>

        {/* System Footer */}
        <View style={styles.systemFooterRow}>
          <Feather name="shield" size={12} color={Colors.textSecondary} />
          <Text style={styles.systemFooterText}>
            Crowdapps Store · Inventory Management
          </Text>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

export default Login;

const styles = StyleSheet.create({
  keyboardContainer: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: Spacing.lg,
  },
  cardContainer: {
    backgroundColor: Colors.surface,
    borderRadius: Radius.md,
    padding: Spacing.xl,
    width: '100%',
    maxWidth: 420,
    borderWidth: 1,
    borderColor: Colors.border,
    ...Shadows.card,
  },
  brandHeader: {
    alignItems: 'center',
    marginBottom: Spacing.md,
  },
  brandMarkSquare: {
    width: 52,
    height: 52,
    borderRadius: Radius.sm,
    backgroundColor: Colors.primaryLight,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: Spacing.xs,
  },
  brandTitle: {
    fontSize: 22,
    fontWeight: '800',
    color: Colors.textPrimary,
    letterSpacing: -0.3,
  },
  brandSub: {
    fontSize: 13,
    color: Colors.textSecondary,
    marginTop: 2,
  },
  valuePropsStrip: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: Spacing.sm,
    backgroundColor: Colors.backgroundSubtle,
    paddingVertical: 6,
    paddingHorizontal: Spacing.sm,
    borderRadius: Radius.xs,
    marginBottom: Spacing.lg,
  },
  valuePropItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  valuePropText: {
    fontSize: 11,
    fontWeight: '600',
    color: Colors.textSecondary,
  },
  stateHeader: {
    marginBottom: Spacing.md,
  },
  eyebrow: {
    fontSize: 10,
    fontWeight: '700',
    color: Colors.primary,
    letterSpacing: 0.8,
    marginBottom: 2,
    textTransform: 'uppercase',
  },
  welcomeHeading: {
    fontSize: 20,
    fontWeight: '700',
    color: Colors.textPrimary,
    letterSpacing: -0.3,
    marginBottom: 2,
  },
  welcomeSubhead: {
    fontSize: 13,
    color: Colors.textSecondary,
    lineHeight: 18,
  },
  fieldGroup: {
    marginBottom: Spacing.md,
  },
  fieldLabel: {
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
  inputIcon: {
    marginRight: Spacing.sm,
  },
  textInput: {
    flex: 1,
    fontSize: 14,
    color: Colors.textPrimary,
    paddingVertical: Spacing.sm,
  },
  forgotPasswordRow: {
    alignItems: 'flex-end',
    marginTop: -2,
    marginBottom: Spacing.lg,
  },
  forgotPasswordText: {
    color: Colors.primary,
    fontSize: 12,
    fontWeight: '600',
  },
  primaryButton: {
    backgroundColor: Colors.primary,
    borderRadius: Radius.xs,
    minHeight: 46,
    justifyContent: 'center',
    alignItems: 'center',
    ...Shadows.primaryButton,
  },
  buttonDisabled: {
    opacity: 0.65,
  },
  buttonContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  primaryButtonText: {
    ...Typography.button,
  },
  switchButton: {
    marginTop: Spacing.lg,
    alignItems: 'center',
    paddingVertical: Spacing.xs,
  },
  switchText: {
    fontSize: 13,
    color: Colors.textSecondary,
  },
  switchTextHighlight: {
    color: Colors.primary,
    fontWeight: '600',
  },
  inlineErrorBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.errorLight,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    borderRadius: Radius.xs,
    marginBottom: Spacing.md,
    gap: Spacing.xs,
    borderWidth: 1,
    borderColor: Colors.errorBorder,
  },
  inlineErrorText: {
    flex: 1,
    color: Colors.errorText,
    fontSize: 12,
    fontWeight: '500',
  },
  successContainer: {
    alignItems: 'center',
    paddingVertical: Spacing.sm,
  },
  successIconBadge: {
    width: 54,
    height: 54,
    borderRadius: 27,
    backgroundColor: Colors.successLight,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: Spacing.md,
  },
  resetNoticeBox: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: Colors.primaryLight,
    borderRadius: Radius.xs,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    marginBottom: Spacing.lg,
    width: '100%',
    gap: Spacing.xs + 2,
    borderWidth: 1,
    borderColor: Colors.primaryBorder,
  },
  resetNoticeText: {
    flex: 1,
    color: Colors.primaryDark,
    fontSize: 12,
    lineHeight: 18,
  },
  systemFooterRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginTop: Spacing.xl,
    paddingBottom: Spacing.sm,
  },
  systemFooterText: {
    fontSize: 11,
    color: Colors.textSecondary,
    fontWeight: '500',
  },
});
