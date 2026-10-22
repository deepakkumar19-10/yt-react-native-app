import React, { useMemo, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  Image,
  Modal,
  Platform,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import Feather from 'react-native-vector-icons/Feather';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import AllItems from './AllItems';
import CreateScreen from './CreateScreen';
import Search from '../Screens/Search';
import Profile from '../Screens/Profile';
import { useSelector, useDispatch } from 'react-redux';
import {
  restockItem,
  deleteItem,
  fetchInventoryFromApi,
} from '../store/slices/inventorySlice';
import { CATEGORY_FILTERS } from '../utils/stockUtils';
import {
  addToCart,
  removeFromCart,
  updateQuantity,
  clearCart,
} from '../store/slices/cartSlice';
import { Colors, Radius, Shadows, Spacing, Typography } from '../theme/theme';

const STORE_BANNER_URL =
  'https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=1200&q=80';

const HomeScreen = ({ onLogout }) => {
  const insets = useSafeAreaInsets();

  const topPadding = Math.max(
    insets.top,
    Platform.OS === 'android' ? StatusBar.currentHeight || 24 : 0,
  );
  const bottomPadding = Math.max(insets.bottom, 12);

  // Main Bottom Tabs: 'inventory' | 'search' | 'alerts' | 'profile'
  const [activeTab, setActiveTab] = useState('inventory');

  // Category filter
  const [activeCategory, setActiveCategory] = useState('All');

  // Add / Edit Modal state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [isCartOpen, setIsCartOpen] = useState(false);
  // Cart Slice State (Multi-Slice State Reading):
  const { cartItems, totalAmount } = useSelector(state => state.cart);
  const totalCartCount = useMemo(
    () => cartItems.reduce((acc, item) => acc + item.quantity, 0),
    [cartItems],
  );

  // Inventory dataset
  const dispatch = useDispatch();

  // Redux Store se items, loading spinner aur error nikal rahe hain:
  const { items: data, loading, error } = useSelector(state => state.inventory);

  const lowStockItems = useMemo(
    () => data.filter(item => Number(item.stock) < 20),
    [data],
  );

  const totalStockKg = useMemo(
    () => data.reduce((acc, curr) => acc + (Number(curr.stock) || 0), 0),
    [data],
  );

  // Filtered items based on active category
  const filteredData = useMemo(() => {
    if (activeCategory === 'Low Stock') {
      return lowStockItems;
    }
    if (activeCategory !== 'All') {
      return data.filter(
        item =>
          (item.category || '').toLowerCase() === activeCategory.toLowerCase(),
      );
    }
    return data;
  }, [data, activeCategory, lowStockItems]);

  // Restock (+25 kg)
  // Restock (+25 kg) via Redux Action
  const handleRestock = (id, amountKg = 25) => {
    dispatch(restockItem({ id, amount: amountKg }));
  };

  // Server se fresh grocery items sync karna:
  const handleSync = () => {
    dispatch(fetchInventoryFromApi());
  };

  // Delete item
  const handleDelete = id => {
    Alert.alert('Remove Item', 'Are you sure you want to remove this item?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Remove',
        style: 'destructive',
        onPress: () => {
          dispatch(deleteItem(id));
        },
      },
    ]);
  };

  // Open edit modal
  const handleEdit = item => {
    setEditingItem(item);
    setIsModalOpen(true);
  };

  // Open add modal
  const handleAdd = () => {
    setEditingItem(null);
    setIsModalOpen(true);
  };

  return (
    <View style={styles.screenContainer}>
      <StatusBar
        barStyle="dark-content"
        backgroundColor={Colors.surface}
        translucent={Platform.OS === 'android'}
      />

      {/* Top Header Bar */}
      <View style={[styles.headerWrapper, { paddingTop: topPadding }]}>
        <View style={styles.headerRow}>
          {/* Brand Mark + Title */}
          <View style={styles.brandRow}>
            <View style={styles.brandMark}>
              <Feather name="package" size={18} color={Colors.primary} />
            </View>
            <View>
              <Text style={styles.brandTitle}>
                Crowdapps <Text style={{ color: Colors.primary }}>Store</Text>
              </Text>
              <Text style={styles.brandSubtitle}>
                Inventory &amp; Stock Management
              </Text>
            </View>
          </View>

          {/* Right Header Actions */}
          <View style={styles.headerActions}>
            <TouchableOpacity
              onPress={handleSync}
              disabled={loading}
              style={styles.syncBtn}
              activeOpacity={0.7}
            >
              {loading ? (
                <ActivityIndicator size="small" color={Colors.primary} />
              ) : (
                <>
                  <Feather name="refresh-cw" size={12} color={Colors.primary} />
                  <Text style={styles.syncBtnText}>Sync</Text>
                </>
              )}
            </TouchableOpacity>
            {/* Cart Icon with Live Badge */}
            <TouchableOpacity
              onPress={() => setIsCartOpen(true)}
              style={styles.cartHeaderBtn}
              activeOpacity={0.7}
            >
              <Feather name="shopping-bag" size={13} color={Colors.primary} />
              <Text style={styles.cartBtnText}>Cart</Text>
              {totalCartCount > 0 && (
                <View style={styles.cartBadge}>
                  <Text style={styles.cartBadgeText}>{totalCartCount}</Text>
                </View>
              )}
            </TouchableOpacity>

            {onLogout && (
              <TouchableOpacity
                onPress={onLogout}
                style={styles.logoutBtn}
                activeOpacity={0.7}
                accessibilityRole="button"
                accessibilityLabel="Sign out"
              >
                <Feather name="log-out" size={13} color={Colors.error} />
                <Text style={styles.logoutBtnText}>Sign Out</Text>
              </TouchableOpacity>
            )}
          </View>
        </View>
      </View>

      {/* Screen Content Area */}
      <View style={styles.contentContainer}>
        {/* ==================================================== */}
        {/* TAB 1: STORE INVENTORY                               */}
        {/* ==================================================== */}
        {activeTab === 'inventory' && (
          <View style={{ flex: 1 }}>
            <AllItems
              data={filteredData}
              onEdit={handleEdit}
              onDelete={handleDelete}
              onRestock={handleRestock}
              onAddToCart={item => dispatch(addToCart(item))}
              ListHeaderComponent={
                <View>
                  {/* Clean Hero Banner */}
                  <View style={styles.heroBanner}>
                    <Image
                      source={{ uri: STORE_BANNER_URL }}
                      style={StyleSheet.absoluteFillObject}
                      resizeMode="cover"
                    />
                    <View style={styles.heroOverlay}>
                      <View style={styles.eyebrowRow}>
                        <Feather
                          name="box"
                          size={12}
                          color={Colors.primaryMuted}
                        />
                        <Text style={styles.eyebrowText}>STORE OVERVIEW</Text>
                      </View>

                      <Text style={styles.heroHeading}>
                        Stock{' '}
                        <Text style={{ color: Colors.primaryMuted }}>
                          Inventory
                        </Text>
                      </Text>

                      <Text style={styles.heroSubhead}>
                        {lowStockItems.length > 0
                          ? `Heads up: You have ${lowStockItems.length} items running low on stock (under 20 kg).`
                          : 'All store items are currently well-stocked.'}
                      </Text>

                      {/* Hero Floating Stats Badges */}
                      <View style={styles.heroBadgesRow}>
                        <View style={styles.heroBadge}>
                          <Feather
                            name="alert-triangle"
                            size={12}
                            color={Colors.warning}
                          />
                          <Text style={styles.heroBadgeText}>
                            {lowStockItems.length} low on stock
                          </Text>
                        </View>
                        <View style={styles.heroBadge}>
                          <Feather
                            name="check-circle"
                            size={12}
                            color={Colors.success}
                          />
                          <Text style={styles.heroBadgeText}>
                            {totalStockKg} kg in stock
                          </Text>
                        </View>
                      </View>
                    </View>
                  </View>

                  {/* Numbers Bar (3 Real Metrics) */}
                  <View style={styles.metricStrip}>
                    <View style={styles.metricCard}>
                      <View style={styles.metricIconWrap}>
                        <Feather
                          name="package"
                          size={18}
                          color={Colors.primary}
                        />
                      </View>
                      <Text style={styles.metricNumber}>{data.length}</Text>
                      <Text style={styles.metricLabel}>Total Items</Text>
                    </View>

                    <View style={styles.metricDivider} />

                    <View style={styles.metricCard}>
                      <View
                        style={[
                          styles.metricIconWrap,
                          styles.metricIconWarning,
                        ]}
                      >
                        <Feather
                          name="trending-down"
                          size={18}
                          color={Colors.warning}
                        />
                      </View>
                      <Text
                        style={[styles.metricNumber, { color: Colors.warning }]}
                      >
                        {lowStockItems.length}
                      </Text>
                      <Text style={styles.metricLabel}>
                        Low Stock (&lt; 20 kg)
                      </Text>
                    </View>

                    <View style={styles.metricDivider} />

                    <View style={styles.metricCard}>
                      <View
                        style={[
                          styles.metricIconWrap,
                          styles.metricIconSuccess,
                        ]}
                      >
                        <Feather
                          name="check-circle"
                          size={18}
                          color={Colors.success}
                        />
                      </View>
                      <Text
                        style={[styles.metricNumber, { color: Colors.success }]}
                      >
                        {totalStockKg} kg
                      </Text>
                      <Text style={styles.metricLabel}>Total Weight</Text>
                    </View>
                  </View>

                  {/* Catalog Section Header */}
                  <View style={styles.sectionHeadRow}>
                    <View>
                      <Text style={styles.sectionEyebrow}>STORE CATALOG</Text>
                      <Text style={styles.sectionTitle}>Inventory Items</Text>
                    </View>

                    <TouchableOpacity
                      style={styles.addItemBtn}
                      onPress={handleAdd}
                      activeOpacity={0.8}
                      accessibilityLabel="Add New Item"
                    >
                      <Feather name="plus" size={14} color={Colors.textWhite} />
                      <Text style={styles.addItemBtnText}>Add Item</Text>
                    </TouchableOpacity>
                  </View>

                  {/* Category Filter Chips */}
                  <ScrollView
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    contentContainerStyle={styles.categoryChipsScroll}
                  >
                    {CATEGORY_FILTERS.map(cat => {
                      const count =
                        cat === 'All'
                          ? data.length
                          : cat === 'Low Stock'
                          ? lowStockItems.length
                          : data.filter(item => item.category === cat).length;

                      const isActive = activeCategory === cat;

                      return (
                        <TouchableOpacity
                          key={cat}
                          style={[styles.chip, isActive && styles.chipActive]}
                          onPress={() => setActiveCategory(cat)}
                          activeOpacity={0.7}
                        >
                          {cat === 'Low Stock' && (
                            <Feather
                              name="alert-triangle"
                              size={12}
                              color={
                                isActive ? Colors.textWhite : Colors.warning
                              }
                              style={{ marginRight: 4 }}
                            />
                          )}
                          <Text
                            style={[
                              styles.chipText,
                              isActive && styles.chipTextActive,
                            ]}
                          >
                            {cat}
                          </Text>
                          <View
                            style={[
                              styles.chipCountBadge,
                              isActive && styles.chipCountBadgeActive,
                            ]}
                          >
                            <Text
                              style={[
                                styles.chipCountText,
                                isActive && styles.chipCountTextActive,
                              ]}
                            >
                              {count}
                            </Text>
                          </View>
                        </TouchableOpacity>
                      );
                    })}
                  </ScrollView>
                </View>
              }
            />
          </View>
        )}

        {/* ==================================================== */}
        {/* TAB 2: SEARCH PRODUCTS                               */}
        {/* ==================================================== */}
        {activeTab === 'search' && (
          <Search
            items={data}
            onEdit={handleEdit}
            onDelete={handleDelete}
            onRestock={handleRestock}
          />
        )}

        {/* ==================================================== */}
        {/* TAB 3: LOW STOCK ALERTS VIEW                         */}
        {/* ==================================================== */}
        {activeTab === 'alerts' && (
          <View style={{ flex: 1 }}>
            <View style={styles.alertsHeader}>
              <Text style={styles.eyebrowWarning}>NEEDS ATTENTION</Text>
              <Text style={styles.sectionTitle}>Items Running Low</Text>
              <Text style={styles.alertsSubhead}>
                These items have less than 20 kg in stock. You can quickly add
                more below.
              </Text>
            </View>

            <AllItems
              data={lowStockItems}
              onEdit={handleEdit}
              onDelete={handleDelete}
              onRestock={handleRestock}
              onAddToCart={item => dispatch(addToCart(item))}
            />
          </View>
        )}

        {/* ==================================================== */}
        {/* TAB 4: MANAGER PROFILE                               */}
        {/* ==================================================== */}
        {activeTab === 'profile' && (
          <Profile
            onLogout={onLogout}
            itemCount={data.length}
            lowStockCount={lowStockItems.length}
            totalStockKg={totalStockKg}
          />
        )}
      </View>

      {/* Add / Edit Item Modal */}
      <Modal
        visible={isModalOpen}
        animationType="slide"
        presentationStyle="pageSheet"
        onRequestClose={() => setIsModalOpen(false)}
      >
        <View
          style={[styles.modalWrapper, { paddingTop: topPadding + Spacing.sm }]}
        >
          <CreateScreen
            editingItem={editingItem}
            onDone={() => {
              setIsModalOpen(false);
              setEditingItem(null);
            }}
            onCancel={() => {
              setIsModalOpen(false);
              setEditingItem(null);
            }}
          />
        </View>
      </Modal>

      {/* ======================================================== */}
      {/* CART & CHECKOUT MODAL                                    */}
      {/* ======================================================== */}
      <Modal
        visible={isCartOpen}
        animationType="slide"
        presentationStyle="pageSheet"
        onRequestClose={() => setIsCartOpen(false)}
      >
        <View
          style={[styles.modalWrapper, { paddingTop: topPadding + Spacing.sm }]}
        >
          {/* Modal Header */}
          <View style={styles.cartHeaderRow}>
            <View>
              <Text style={styles.cartTitle}>Customer Cart</Text>
              <Text style={styles.cartSubtitle}>
                {totalCartCount} item(s) in basket
              </Text>
            </View>
            <TouchableOpacity
              onPress={() => setIsCartOpen(false)}
              style={styles.cartCloseBtn}
            >
              <Feather name="x" size={20} color={Colors.textPrimary} />
            </TouchableOpacity>
          </View>

          {/* Cart Content */}
          {cartItems.length === 0 ? (
            <View style={styles.cartEmptyState}>
              <Feather name="shopping-bag" size={48} color={Colors.textMuted} />
              <Text style={styles.cartEmptyTitle}>Your Cart is Empty</Text>
              <Text style={styles.cartEmptySubtitle}>
                Tap the bag icon on any inventory product to add it here.
              </Text>
            </View>
          ) : (
            <>
              <ScrollView
                style={{ flex: 1 }}
                showsVerticalScrollIndicator={false}
              >
                {cartItems.map(item => (
                  <View key={item.id} style={styles.cartCard}>
                    <Image
                      source={{ uri: item.image }}
                      style={styles.cartItemImage}
                      resizeMode="cover"
                    />
                    <View style={styles.cartItemInfo}>
                      <Text style={styles.cartItemName}>{item.name}</Text>
                      <Text style={styles.cartItemPrice}>
                        ₹{item.price} / {item.unit}
                      </Text>
                    </View>

                    {/* Quantity - / + Controls */}
                    <View style={styles.qtyControlRow}>
                      <TouchableOpacity
                        style={styles.qtyBtn}
                        onPress={() =>
                          dispatch(updateQuantity({ id: item.id, change: -1 }))
                        }
                      >
                        <Feather
                          name="minus"
                          size={12}
                          color={Colors.textPrimary}
                        />
                      </TouchableOpacity>

                      <Text style={styles.qtyText}>{item.quantity}</Text>

                      <TouchableOpacity
                        style={styles.qtyBtn}
                        onPress={() =>
                          dispatch(updateQuantity({ id: item.id, change: 1 }))
                        }
                      >
                        <Feather
                          name="plus"
                          size={12}
                          color={Colors.textPrimary}
                        />
                      </TouchableOpacity>
                    </View>

                    {/* Remove from Cart */}
                    <TouchableOpacity
                      onPress={() => dispatch(removeFromCart(item.id))}
                      style={styles.cartDeleteBtn}
                    >
                      <Feather name="trash-2" size={14} color={Colors.error} />
                    </TouchableOpacity>
                  </View>
                ))}
              </ScrollView>

              {/* Total Bill & Checkout Footer */}
              <View style={styles.cartFooter}>
                <View style={styles.totalRow}>
                  <Text style={styles.totalLabel}>Total Bill Amount</Text>
                  <Text style={styles.totalValue}>₹{totalAmount}</Text>
                </View>

                <TouchableOpacity
                  style={styles.checkoutBtn}
                  onPress={() => {
                    Alert.alert(
                      'Order Confirmed! 🎉',
                      `Total bill of ₹${totalAmount} processed successfully.`,
                      [
                        {
                          text: 'Done',
                          onPress: () => {
                            dispatch(clearCart());
                            setIsCartOpen(false);
                          },
                        },
                      ],
                    );
                  }}
                  activeOpacity={0.8}
                >
                  <Feather name="check" size={16} color={Colors.textWhite} />
                  <Text style={styles.checkoutBtnText}>
                    Checkout & Place Order
                  </Text>
                </TouchableOpacity>
              </View>
            </>
          )}
        </View>
      </Modal>

      {/* ====================================================== */}
      {/* BOTTOM TAB BAR                                         */}
      {/* ====================================================== */}
      <View style={[styles.bottomTabBar, { paddingBottom: bottomPadding }]}>
        <TouchableOpacity
          style={[
            styles.tabButton,
            activeTab === 'inventory' && styles.tabButtonActive,
          ]}
          onPress={() => setActiveTab('inventory')}
          activeOpacity={0.7}
          accessibilityRole="tab"
          accessibilityLabel="Inventory"
        >
          <Feather
            name="package"
            size={19}
            color={
              activeTab === 'inventory' ? Colors.primary : Colors.textSecondary
            }
          />
          <Text
            style={[
              styles.tabLabel,
              activeTab === 'inventory' && styles.tabLabelActive,
            ]}
          >
            Inventory
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.tabButton,
            activeTab === 'search' && styles.tabButtonActive,
          ]}
          onPress={() => setActiveTab('search')}
          activeOpacity={0.7}
          accessibilityRole="tab"
          accessibilityLabel="Search"
        >
          <Feather
            name="search"
            size={19}
            color={
              activeTab === 'search' ? Colors.primary : Colors.textSecondary
            }
          />
          <Text
            style={[
              styles.tabLabel,
              activeTab === 'search' && styles.tabLabelActive,
            ]}
          >
            Search
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.tabButton,
            activeTab === 'alerts' && styles.tabButtonActive,
          ]}
          onPress={() => setActiveTab('alerts')}
          activeOpacity={0.7}
          accessibilityRole="tab"
          accessibilityLabel="Alerts"
        >
          <View style={{ position: 'relative' }}>
            <Feather
              name="bell"
              size={19}
              color={
                activeTab === 'alerts' ? Colors.warning : Colors.textSecondary
              }
            />
            {lowStockItems.length > 0 && (
              <View style={styles.tabBadge}>
                <Text style={styles.tabBadgeText}>{lowStockItems.length}</Text>
              </View>
            )}
          </View>
          <Text
            style={[
              styles.tabLabel,
              activeTab === 'alerts' && {
                color: Colors.warning,
                fontWeight: '700',
              },
            ]}
          >
            Alerts
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.tabButton,
            activeTab === 'profile' && styles.tabButtonActive,
          ]}
          onPress={() => setActiveTab('profile')}
          activeOpacity={0.7}
          accessibilityRole="tab"
          accessibilityLabel="Account"
        >
          <Feather
            name="user"
            size={19}
            color={
              activeTab === 'profile' ? Colors.primary : Colors.textSecondary
            }
          />
          <Text
            style={[
              styles.tabLabel,
              activeTab === 'profile' && styles.tabLabelActive,
            ]}
          >
            Account
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default HomeScreen;

const styles = StyleSheet.create({
  screenContainer: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  headerWrapper: {
    backgroundColor: Colors.surface,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
    paddingHorizontal: Spacing.lg,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: Spacing.sm + 4,
  },
  brandRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
  },
  headerActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.xs,
  },
  syncBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.primaryLight,
    paddingHorizontal: Spacing.sm + 2,
    paddingVertical: 5,
    borderRadius: Radius.xs,
    gap: 4,
    borderWidth: 1,
    borderColor: Colors.primaryBorder,
  },
  syncBtnText: {
    fontSize: 12,
    fontWeight: '600',
    color: Colors.primary,
  },
  brandMark: {
    width: 38,
    height: 38,
    borderRadius: Radius.sm,
    backgroundColor: Colors.primaryLight,
    borderWidth: 1,
    borderColor: Colors.primaryBorder,
    justifyContent: 'center',
    alignItems: 'center',
  },
  brandTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: Colors.textPrimary,
    letterSpacing: -0.3,
  },
  brandSubtitle: {
    fontSize: 11,
    color: Colors.textSecondary,
  },
  logoutBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.errorLight,
    paddingHorizontal: Spacing.sm + 2,
    paddingVertical: 5,
    borderRadius: Radius.xs,
    gap: 4,
    borderWidth: 1,
    borderColor: Colors.errorBorder,
  },
  logoutBtnText: {
    fontSize: 12,
    fontWeight: '600',
    color: Colors.error,
  },
  contentContainer: {
    flex: 1,
    paddingHorizontal: Spacing.lg,
    paddingTop: Spacing.md,
  },
  heroBanner: {
    width: '100%',
    borderRadius: Radius.md,
    overflow: 'hidden',
    marginBottom: Spacing.md,
    position: 'relative',
    ...Shadows.subtle,
  },
  heroOverlay: {
    backgroundColor: 'rgba(20, 17, 28, 0.76)',
    padding: Spacing.lg,
  },
  eyebrowRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    marginBottom: 4,
  },
  eyebrowText: {
    fontSize: 10,
    fontWeight: '700',
    color: '#D8B4FE',
    letterSpacing: 0.8,
  },
  heroHeading: {
    fontSize: 20,
    fontWeight: '800',
    color: Colors.textWhite,
    letterSpacing: -0.3,
    marginBottom: 4,
  },
  heroSubhead: {
    fontSize: 13,
    color: '#E2E8F0',
    lineHeight: 18,
    marginBottom: Spacing.md,
  },
  heroBadgesRow: {
    flexDirection: 'row',
    gap: Spacing.sm,
  },
  heroBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    paddingHorizontal: Spacing.sm + 2,
    paddingVertical: 4,
    borderRadius: Radius.full,
    gap: 5,
  },
  heroBadgeText: {
    fontSize: 11,
    color: Colors.textWhite,
    fontWeight: '600',
  },
  metricStrip: {
    flexDirection: 'row',
    backgroundColor: Colors.surface,
    borderRadius: Radius.md,
    borderWidth: 1,
    borderColor: Colors.border,
    paddingVertical: Spacing.md,
    marginBottom: Spacing.md,
    ...Shadows.subtle,
  },
  metricCard: {
    flex: 1,
    alignItems: 'center',
  },
  metricIconWrap: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: Colors.primaryLight,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 4,
  },
  metricIconWarning: {
    backgroundColor: Colors.warningLight,
  },
  metricIconSuccess: {
    backgroundColor: Colors.successLight,
  },
  metricNumber: {
    fontSize: 17,
    fontWeight: '700',
    color: Colors.textPrimary,
  },
  metricLabel: {
    fontSize: 10,
    color: Colors.textSecondary,
    marginTop: 2,
    textAlign: 'center',
  },
  metricDivider: {
    width: 1,
    backgroundColor: Colors.borderLight,
    height: '75%',
    alignSelf: 'center',
  },
  sectionHeadRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    marginBottom: Spacing.sm + 2,
  },
  sectionEyebrow: {
    fontSize: 10,
    fontWeight: '700',
    color: Colors.textMuted,
    letterSpacing: 0.8,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: Colors.textPrimary,
  },
  addItemBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.primary,
    paddingHorizontal: Spacing.md,
    paddingVertical: 6,
    borderRadius: Radius.xs,
    gap: 4,
    ...Shadows.primaryButton,
  },
  addItemBtnText: {
    fontSize: 12,
    fontWeight: '600',
    color: Colors.textWhite,
  },
  categoryChipsScroll: {
    flexDirection: 'row',
    gap: Spacing.xs + 2,
    marginBottom: Spacing.md,
  },
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.surface,
    borderWidth: 1,
    borderColor: Colors.border,
    paddingVertical: 5,
    paddingHorizontal: Spacing.md,
    borderRadius: Radius.full,
  },
  chipActive: {
    backgroundColor: Colors.primary,
    borderColor: Colors.primary,
  },
  chipText: {
    fontSize: 12,
    fontWeight: '500',
    color: Colors.textSecondary,
  },
  chipTextActive: {
    color: Colors.textWhite,
    fontWeight: '600',
  },
  chipCountBadge: {
    marginLeft: 6,
    backgroundColor: Colors.backgroundSubtle,
    paddingHorizontal: 5,
    paddingVertical: 1,
    borderRadius: Radius.full,
  },
  chipCountBadgeActive: {
    backgroundColor: 'rgba(255, 255, 255, 0.25)',
  },
  chipCountText: {
    fontSize: 10,
    fontWeight: '700',
    color: Colors.textSecondary,
  },
  chipCountTextActive: {
    color: Colors.textWhite,
  },

  alertsHeader: {
    marginBottom: Spacing.md,
  },
  eyebrowWarning: {
    fontSize: 10,
    fontWeight: '700',
    color: Colors.warning,
    letterSpacing: 0.8,
    marginBottom: 2,
  },
  alertsSubhead: {
    fontSize: 12,
    color: Colors.textSecondary,
    lineHeight: 18,
    marginTop: 2,
  },

  modalWrapper: {
    flex: 1,
    backgroundColor: Colors.background,
    paddingHorizontal: Spacing.lg,
  },

  // Docked Bottom Tab Bar
  bottomTabBar: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    backgroundColor: Colors.surface,
    borderTopWidth: 1,
    borderTopColor: Colors.border,
    paddingTop: 8,
    minHeight: 60,
  },
  tabButton: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 4,
    paddingHorizontal: 12,
    borderRadius: Radius.sm,
  },
  tabButtonActive: {
    backgroundColor: Colors.primaryLight,
  },
  tabLabel: {
    fontSize: 11,
    fontWeight: '500',
    color: Colors.textSecondary,
    marginTop: 2,
  },
  tabLabelActive: {
    color: Colors.primary,
    fontWeight: '700',
  },
  tabBadge: {
    position: 'absolute',
    top: -3,
    right: -7,
    backgroundColor: Colors.error,
    borderRadius: 7,
    minWidth: 14,
    height: 14,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 3,
  },
  tabBadgeText: {
    color: Colors.textWhite,
    fontSize: 9,
    fontWeight: '700',
  },
  cartHeaderBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.primaryLight,
    paddingHorizontal: Spacing.sm + 2,
    paddingVertical: 5,
    borderRadius: Radius.xs,
    gap: 4,
    borderWidth: 1,
    borderColor: Colors.primaryBorder,
    position: 'relative',
  },
  cartBtnText: {
    fontSize: 12,
    fontWeight: '600',
    color: Colors.primary,
  },
  cartBadge: {
    position: 'absolute',
    top: -6,
    right: -6,
    backgroundColor: Colors.error,
    borderRadius: 10,
    minWidth: 16,
    height: 16,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 3,
  },
  cartBadgeText: {
    color: Colors.textWhite,
    fontSize: 9,
    fontWeight: '700',
  },
  cartHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.md,
  },
  cartTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: Colors.textPrimary,
  },
  cartSubtitle: {
    fontSize: 12,
    color: Colors.textSecondary,
  },
  cartCloseBtn: {
    padding: Spacing.xs,
  },
  cartEmptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    gap: Spacing.sm,
  },
  cartEmptyTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: Colors.textPrimary,
  },
  cartEmptySubtitle: {
    fontSize: 12,
    color: Colors.textSecondary,
    textAlign: 'center',
    paddingHorizontal: Spacing.xl,
  },
  cartCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.surface,
    padding: Spacing.sm,
    borderRadius: Radius.sm,
    marginBottom: Spacing.sm,
    borderWidth: 1,
    borderColor: Colors.border,
    gap: Spacing.sm,
  },
  cartItemImage: {
    width: 44,
    height: 44,
    borderRadius: Radius.xs,
  },
  cartItemInfo: {
    flex: 1,
  },
  cartItemName: {
    fontSize: 13,
    fontWeight: '600',
    color: Colors.textPrimary,
  },
  cartItemPrice: {
    fontSize: 11,
    color: Colors.textSecondary,
  },
  qtyControlRow: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: Radius.xs,
    overflow: 'hidden',
  },
  qtyBtn: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    backgroundColor: Colors.background,
  },
  qtyText: {
    paddingHorizontal: 8,
    fontSize: 12,
    fontWeight: '700',
    color: Colors.textPrimary,
  },
  cartDeleteBtn: {
    padding: Spacing.xs,
  },
  cartFooter: {
    paddingTop: Spacing.md,
    borderTopWidth: 1,
    borderColor: Colors.border,
    gap: Spacing.sm,
  },
  totalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  totalLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.textSecondary,
  },
  totalValue: {
    fontSize: 18,
    fontWeight: '800',
    color: Colors.primary,
  },
  checkoutBtn: {
    backgroundColor: Colors.primary,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 12,
    borderRadius: Radius.sm,
    gap: Spacing.xs,
  },
  checkoutBtnText: {
    color: Colors.textWhite,
    fontSize: 14,
    fontWeight: '700',
  },
});
