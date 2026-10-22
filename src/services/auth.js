import {
  getAuth,
  createUserWithEmailAndPassword,
  sendEmailVerification,
  signInWithEmailAndPassword,
  fetchSignInMethodsForEmail,
  sendPasswordResetEmail,
  updatePassword,
  signOut,
  onAuthStateChanged,
} from '@react-native-firebase/auth';

export const registerUser = async (email, password) => {
  try {
    const auth = getAuth();
    const userCredential = await createUserWithEmailAndPassword(
      auth,
      email,
      password,
    );
    await sendEmailVerification(userCredential.user);
    return userCredential.user;
  } catch (error) {
    console.error('Firebase Auth Error Code:', error.code);
    console.error('Firebase Auth Error Message:', error.message);

    let errorMessage;
    switch (error.code) {
      case 'auth/operation-not-allowed':
        errorMessage =
          'Email/Password provider is not enabled in Firebase Console. Please go to Firebase Console > Authentication > Sign-in method and enable Email/Password.';
        break;
      case 'auth/email-already-in-use':
        errorMessage =
          'This email is already in use. Please use a different email address.';
        break;
      case 'auth/invalid-email':
        errorMessage = 'Invalid email address.';
        break;
      case 'auth/weak-password':
        errorMessage =
          'Password is too weak, please use at least 6 characters.';
        break;
      case 'auth/network-request-failed':
        errorMessage = 'Network error. Please check your internet connection.';
        break;
      case 'auth/too-many-requests':
        errorMessage = 'Too many requests. Please try again later.';
        break;

      default:
        errorMessage = error.message || 'An unknown error occurred';
        break;
    }

    throw new Error(errorMessage);
  }
};

export const loginUser = async (email, password) => {
  try {
    const auth = getAuth();
    const userCredential = await signInWithEmailAndPassword(
      auth,
      email.trim(),
      password,
    );
    const user = userCredential.user;
    // Reload user to get fresh emailVerified status from Firebase
    await user.reload();
    return { user, emailVerified: user.emailVerified };
  } catch (error) {
    console.error('Firebase Login Error Code:', error.code);
    console.error('Firebase Login Error Message:', error.message);

    let errorMessage;
    switch (error.code) {
      case 'auth/invalid-credential':
      case 'auth/wrong-password':
      case 'auth/user-not-found':
        errorMessage = 'Invalid email or password.';
        break;
      case 'auth/invalid-email':
        errorMessage = 'Invalid email address.';
        break;
      case 'auth/user-disabled':
        errorMessage = 'This user account has been disabled.';
        break;
      case 'auth/network-request-failed':
        errorMessage = 'Network error. Please check your internet connection.';
        break;
      case 'auth/too-many-requests':
        errorMessage =
          'Too many failed attempts. Please wait a moment and try again.';
        break;
      default:
        errorMessage = error.message || 'An unknown error occurred';
        break;
    }
    throw new Error(errorMessage);
  }
};

export const resendVerificationEmail = async () => {
  try {
    const auth = getAuth();
    if (auth.currentUser) {
      await sendEmailVerification(auth.currentUser);
    } else {
      throw new Error('No user is currently signed in to resend email.');
    }
  } catch (error) {
    console.error('Resend Email Error:', error.code, error.message);
    throw new Error(error.message || 'Failed to resend verification email.');
  }
};

export const normalizeIdentifier = identifier => {
  const trimmed = (identifier || '').trim();
  if (trimmed.includes('@')) {
    return trimmed.toLowerCase();
  }
  return `${trimmed.toLowerCase()}@app.com`;
};

export const checkUserExists = async identifier => {
  const trimmed = (identifier || '').trim();
  if (!trimmed) {
    return { exists: false, email: '' };
  }

  const email = normalizeIdentifier(trimmed);

  // Validate email format
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return { exists: false, email };
  }

  try {
    const auth = getAuth();
    // In Firebase Auth with email enumeration protection,
    // sendPasswordResetEmail accurately validates and sends the reset request
    await sendPasswordResetEmail(auth, email);
    return {
      exists: true,
      email,
    };
  } catch (error) {
    console.error('Check User Exists Error:', error.code, error.message);
    if (
      error.code === 'auth/user-not-found' ||
      error.code === 'auth/invalid-email'
    ) {
      return { exists: false, email };
    }
    if (error.code === 'auth/network-request-failed') {
      throw new Error('Network error. Please check your internet connection.');
    }
    return { exists: false, email };
  }
};

export const resetUserPassword = async (identifier, newPassword) => {
  try {
    const auth = getAuth();
    const email = normalizeIdentifier(identifier);

    // If a user session is active for this account, update password directly
    if (auth.currentUser && auth.currentUser.email === email) {
      await updatePassword(auth.currentUser, newPassword);
    }
    return { success: true, email };
  } catch (error) {
    console.error('Reset Password Error:', error.code, error.message);
    let errorMessage;
    switch (error.code) {
      case 'auth/weak-password':
        errorMessage =
          'Password is too weak, please use at least 6 characters.';
        break;
      case 'auth/network-request-failed':
        errorMessage = 'Network error. Please check your internet connection.';
        break;
      default:
        errorMessage = error.message || 'Failed to reset password.';
        break;
    }
    throw new Error(errorMessage);
  }
};

export const logoutUser = async () => {
  try {
    const auth = getAuth();
    await signOut(auth);
  } catch (error) {
    console.error('Logout error:', error);
    throw error;
  }
};

export const subscribeToAuthChanges = callback => {
  const auth = getAuth();
  return onAuthStateChanged(auth, callback);
};

