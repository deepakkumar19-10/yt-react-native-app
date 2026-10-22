import React from 'react';
import {
  Alert,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import Feather from 'react-native-vector-icons/Feather';
import { getAuth } from '@react-native-firebase/auth';
import { Colors, Radius, Shadows, Spacing, Typography } from '../theme/theme';

const Profile = ({
  onLogout,
  route,
  itemCount = 6,
  lowStockCount = 3,
  totalStockKg = 149,
}) => {
  const auth = getAuth();
  const currentUser = auth.currentUser;
  const userEmail =
    currentUser?.email ||
    route?.params?.name ||
    'manager@crowdapps.store';
  const displayName =
    currentUser?.displayName ||
    userEmail.split('@')[0].replace(/[._]/g, ' ');

  const handleLogoutPress = () => {
    Alert.alert('Sign Out', 'Are you sure you want to sign out from your store account?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Sign Out',
        style: 'destructive',
        onPress: () => {
          if (onLogout) onLogout();
        },
      },
    ]);
  };

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.scrollContent}
      showsVerticalScrollIndicator={false}
    >
      {/* Compact, Professional Profile Header Card */}
      <View style={styles.profileHeaderCard}>
        <View style={styles.avatarCircle}>
          <Text style={styles.avatarText}>
            {displayName.charAt(0).toUpperCase()}
          </Text>
        </View>

        <View style={styles.profileIdentity}>
          <Text style={styles.managerName}>{displayName}</Text>
          <Text style={styles.managerEmail}>{userEmail}</Text>
        </View>
      </View>

      {/* 3 Real Inventory Stats */}
      <View style={styles.statsRow}>
        <View style={styles.statBox}>
          <Text style={styles.statNumber}>{itemCount}</Text>
          <Text style={styles.statLabel}>Total Items</Text>
        </View>

        <View style={styles.statDivider} />

        <View style={styles.statBox}>
          <Text
            style={[
              styles.statNumber,
              lowStockCount > 0 && { color: Colors.warning },
            ]}
          >
            {lowStockCount}
          </Text>
          <Text style={styles.statLabel}>Low Stock Items</Text>
        </View>

        <View style={styles.statDivider} />

        <View style={styles.statBox}>
          <Text style={[styles.statNumber, { color: Colors.success }]}>
            {totalStockKg} kg
          </Text>
          <Text style={styles.statLabel}>Total Stock Weight</Text>
        </View>
      </View>

      {/* Account Section with Sign Out Button */}
      <View style={styles.sectionContainer}>
        <Text style={styles.sectionHeading}>Account</Text>

        <TouchableOpacity
          style={styles.signOutCard}
          onPress={handleLogoutPress}
          activeOpacity={0.7}
          accessibilityRole="button"
          accessibilityLabel="Sign out from store"
        >
          <View style={styles.signOutLeft}>
            <View style={styles.signOutIconCircle}>
              <Feather name="log-out" size={16} color={Colors.error} />
            </View>
            <View>
              <Text style={styles.signOutText}>Sign Out</Text>
              <Text style={styles.signOutSub}>Sign out of your store account</Text>
            </View>
          </View>
          <Feather name="chevron-right" size={18} color={Colors.textMuted} />
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

export default Profile;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: Spacing.xxxl + 20,
  },
  profileHeaderCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.surface,
    borderRadius: Radius.md,
    borderWidth: 1,
    borderColor: Colors.border,
    padding: Spacing.md,
    marginBottom: Spacing.md,
    ...Shadows.subtle,
  },
  avatarCircle: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: Colors.primaryLight,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: Colors.primaryBorder,
  },
  avatarText: {
    fontSize: 20,
    fontWeight: '700',
    color: Colors.primary,
  },
  profileIdentity: {
    flex: 1,
    marginLeft: Spacing.md,
  },
  managerName: {
    fontSize: 16,
    fontWeight: '700',
    color: Colors.textPrimary,
    textTransform: 'capitalize',
    letterSpacing: -0.2,
  },
  managerEmail: {
    fontSize: 13,
    color: Colors.textSecondary,
    marginTop: 2,
  },
  statsRow: {
    flexDirection: 'row',
    backgroundColor: Colors.surface,
    borderRadius: Radius.md,
    borderWidth: 1,
    borderColor: Colors.border,
    paddingVertical: Spacing.md,
    marginBottom: Spacing.md,
    ...Shadows.subtle,
  },
  statBox: {
    flex: 1,
    alignItems: 'center',
  },
  statNumber: {
    fontSize: 18,
    fontWeight: '700',
    color: Colors.textPrimary,
  },
  statLabel: {
    fontSize: 10,
    color: Colors.textSecondary,
    marginTop: 2,
    textAlign: 'center',
  },
  statDivider: {
    width: 1,
    backgroundColor: Colors.borderLight,
    height: '70%',
    alignSelf: 'center',
  },
  sectionContainer: {
    marginBottom: Spacing.lg,
  },
  sectionHeading: {
    fontSize: 12,
    fontWeight: '700',
    color: Colors.textSecondary,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: Spacing.xs + 2,
    marginLeft: 2,
  },
  signOutCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: Colors.surface,
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: Radius.md,
    paddingVertical: Spacing.md,
    paddingHorizontal: Spacing.md,
    ...Shadows.subtle,
  },
  signOutLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  signOutIconCircle: {
    width: 36,
    height: 36,
    borderRadius: Radius.xs,
    backgroundColor: Colors.errorLight,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: Spacing.md,
  },
  signOutText: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.error,
  },
  signOutSub: {
    fontSize: 11,
    color: Colors.textMuted,
    marginTop: 1,
  },
});
