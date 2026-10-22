export const getAuth = () => ({
  currentUser: {
    email: 'deepak.kumar2_mca23@gla.ac.in',
    displayName: 'Deepak Kumar',
  },
});

export const onAuthStateChanged = jest.fn((auth, callback) => {
  callback({
    email: 'deepak.kumar2_mca23@gla.ac.in',
    displayName: 'Deepak Kumar',
  });
  return () => {};
});

export const signInWithEmailAndPassword = jest.fn();
export const createUserWithEmailAndPassword = jest.fn();
export const signOut = jest.fn();
export const sendPasswordResetEmail = jest.fn();
export const fetchSignInMethodsForEmail = jest.fn();

export default () => ({
  currentUser: {
    email: 'deepak.kumar2_mca23@gla.ac.in',
    displayName: 'Deepak Kumar',
  },
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  sendPasswordResetEmail,
  onAuthStateChanged,
});
