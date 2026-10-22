import React, { useState } from 'react';
import {
  FlatList,
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
import { getProductImage } from '../utils/imageUtils';
import {
  getItemCategory,
  getStockStatus,
  isLowStock,
  isOutOfStock,
} from '../utils/stockUtils';
import { Colors, Radius, Shadows, Spacing, Typography } from '../theme/theme';

const AllItems = ({
  data = [],
  onEdit,
  onDelete,
  onRestock,
  onAddToCart,
  onImagePress,
  OnItemPress,
  ListHeaderComponent,
}) => {
  const insets = useSafeAreaInsets();
  const topPadding = Math.max(
    insets.top,
    Platform.OS === 'android' ? StatusBar.currentHeight || 24 : 0,
  );

  // Modal states for image preview and product details
  const [viewImageItem, setViewImageItem] = useState(null);
  const [productDetail, setProductDetail] = useState(null);

  // Render each product card
  const renderItem = ({ item }) => {
    if (!item) return null;

    const lowStock = isLowStock(item.stock);
    const outOfStock = isOutOfStock(item.stock);
    const imageUrl = item.image || getProductImage(item.name);
    const category = item.category || getItemCategory(item.name);
    const description = item.description || 'Grocery inventory item.';
    const stockStatus = getStockStatus(item.stock, item.unit || 'kg');

    return (
      <View
        style={[
          styles.card,
          lowStock ? styles.cardLowStock : styles.cardNormal,
        ]}
      >
        <View style={styles.cardHeaderRow}>
          {/* Left Column: Product Thumbnail with SKU */}
          <TouchableOpacity
            style={styles.imageWrapper}
            activeOpacity={0.8}
            onPress={() => {
              if (onImagePress) {
                onImagePress(imageUrl);
              }
              setViewImageItem(item);
            }}
            accessibilityRole="imagebutton"
            accessibilityLabel={`View full photo of ${item.name}`}
          >
            <Image
              source={{ uri: imageUrl }}
              style={styles.productImage}
              resizeMode="cover"
            />

            {/* Overlaid SKU Badge */}
            <View style={styles.skuBadge}>
              <Text style={styles.skuBadgeText}>SKU #{item.id}</Text>
            </View>
          </TouchableOpacity>

          {/* Right Column: Product Information */}
          <TouchableOpacity
            style={styles.infoWrapper}
            activeOpacity={0.7}
            onPress={() => {
              if (OnItemPress) {
                OnItemPress(item);
              }
              setProductDetail(item);
            }}
          >
            {/* Category tag */}
            <View style={styles.tagLine}>
              <Text style={styles.categoryTag}>{category}</Text>
            </View>

            {/* Product Title */}
            <Text style={styles.productTitle}>{item.name}</Text>

            {/* Description (Full text, zero clipping) */}
            <Text style={styles.productDesc}>{description}</Text>

            {/* Simple Text Status Pill */}
            <View style={styles.stockLevelRow}>
              <View
                style={[
                  styles.stockPill,
                  outOfStock
                    ? styles.stockPillOut
                    : lowStock
                    ? styles.stockPillLow
                    : styles.stockPillHealthy,
                ]}
              >
                <Feather
                  name={
                    outOfStock
                      ? 'slash'
                      : lowStock
                      ? 'alert-triangle'
                      : 'check-circle'
                  }
                  size={11}
                  color={
                    outOfStock
                      ? Colors.errorText
                      : lowStock
                      ? Colors.warningText
                      : Colors.successText
                  }
                />
                <Text
                  style={[
                    styles.stockPillText,
                    outOfStock
                      ? styles.stockTextOut
                      : lowStock
                      ? styles.stockTextLow
                      : styles.stockTextHealthy,
                  ]}
                >
                  {stockStatus.label}
                </Text>
              </View>
            </View>
          </TouchableOpacity>
        </View>

        {/* Card Footer Action Bar */}
        <View style={styles.cardFooter}>
          {/* Quick Restock (+25 kg) Button */}
          {onRestock ? (
            <TouchableOpacity
              style={[styles.restockBtn, lowStock && styles.restockBtnUrgent]}
              onPress={() => onRestock(item.id, 25)}
              activeOpacity={0.75}
              accessibilityLabel={`Add 25 kg to ${item.name}`}
            >
              <Feather
                name={lowStock ? 'zap' : 'plus'}
                size={13}
                color={lowStock ? Colors.textWhite : Colors.primary}
              />
              <Text
                style={[
                  styles.restockBtnText,
                  lowStock && styles.restockBtnTextUrgent,
                ]}
              >
                {lowStock ? 'Restock 25 kg' : 'Add 25 kg'}
              </Text>
            </TouchableOpacity>
          ) : (
            <View />
          )}

          {/* Edit / Delete Buttons */}
          <View style={styles.actionBtnGroup}>
            {onAddToCart && (
              <TouchableOpacity
                style={[styles.iconActionBtn, styles.cartActionBtn]}
                onPress={() => onAddToCart(item)}
                activeOpacity={0.7}
                accessibilityLabel={`Add ${item.name} to Cart`}
              >
                <Feather name="shopping-bag" size={14} color={Colors.primary} />
              </TouchableOpacity>
            )}
            {onEdit && (
              <TouchableOpacity
                style={styles.iconActionBtn}
                onPress={() => onEdit(item)}
                activeOpacity={0.7}
                accessibilityLabel={`Edit ${item.name}`}
              >
                <Feather name="edit-2" size={14} color={Colors.textSecondary} />
              </TouchableOpacity>
            )}

            {onDelete && (
              <TouchableOpacity
                style={[styles.iconActionBtn, styles.deleteActionBtn]}
                onPress={() => onDelete(item.id)}
                activeOpacity={0.7}
                accessibilityLabel={`Remove ${item.name}`}
              >
                <Feather name="trash-2" size={14} color={Colors.error} />
              </TouchableOpacity>
            )}
          </View>
        </View>
      </View>
    );
  };

  const renderEmptyState = () => (
    <View style={styles.emptyContainer}>
      <View style={styles.emptyIconCircle}>
        <Feather name="package" size={32} color={Colors.textMuted} />
      </View>
      <Text style={styles.emptyTitle}>No items found</Text>
      <Text style={styles.emptySubtitle}>
        We could not find any items matching your filter. Try picking another
        category or adding a new item.
      </Text>
    </View>
  );

  return (
    <>
      <FlatList
        data={data}
        keyExtractor={(item, index) =>
          item?.id ? item.id.toString() : index.toString()
        }
        renderItem={renderItem}
        ListHeaderComponent={ListHeaderComponent}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={renderEmptyState}
      />

      {/* ======================================================== */}
      {/* 1. Fullscreen Image Lightbox Modal (Only Image, No Text)  */}
      {/* ======================================================== */}
      <Modal
        visible={!!viewImageItem}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setViewImageItem(null)}
      >
        <TouchableOpacity
          style={styles.imageModalOverlay}
          activeOpacity={1}
          onPress={() => setViewImageItem(null)}
        >
          {/* Top Close Button */}
          <View style={[styles.lightboxTopBar, { paddingTop: topPadding }]}>
            <TouchableOpacity
              style={styles.imageModalCloseBtn}
              onPress={() => setViewImageItem(null)}
              activeOpacity={0.7}
              accessibilityLabel="Close photo preview"
            >
              <Feather name="x" size={22} color="#FFFFFF" />
            </TouchableOpacity>
          </View>

          {/* Centered High-Resolution Photo Viewer (Pure Image Only) */}
          <View style={styles.lightboxImageContainer}>
            {viewImageItem && (
              <Image
                source={{
                  uri:
                    viewImageItem.image || getProductImage(viewImageItem.name),
                }}
                style={styles.imageModalFullscreen}
                resizeMode="contain"
              />
            )}
          </View>
        </TouchableOpacity>
      </Modal>

      {/* ======================================================== */}
      {/* 2. Slide-In Product Details Modal                        */}
      {/* ======================================================== */}
      <Modal
        visible={!!productDetail}
        animationType="slide"
        presentationStyle="fullScreen"
        onRequestClose={() => setProductDetail(null)}
      >
        <View style={styles.detailContainer}>
          {/* Header with Back button — Padded for Camera Notch / Status Bar */}
          <View
            style={[
              styles.detailHeader,
              { paddingTop: topPadding + Spacing.sm },
            ]}
          >
            <TouchableOpacity
              style={styles.backBtn}
              onPress={() => setProductDetail(null)}
              activeOpacity={0.7}
              accessibilityLabel="Back to catalog"
            >
              <Feather name="arrow-left" size={22} color={Colors.textPrimary} />
            </TouchableOpacity>
            <Text style={styles.detailHeaderTitle}>Product Details</Text>
            <View style={{ width: 40 }} />
          </View>

          <ScrollView
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.detailScrollContent}
          >
            {/* Hero Photography Showcase */}
            <View style={styles.detailHeroImageWrapper}>
              <Image
                source={{
                  uri:
                    productDetail?.image ||
                    getProductImage(productDetail?.name),
                }}
                style={styles.detailHeroImage}
                resizeMode="cover"
              />
              <View style={styles.detailHeroSkuBadge}>
                <Text style={styles.detailHeroSkuText}>
                  SKU #{productDetail?.id}
                </Text>
              </View>
            </View>

            <View style={styles.detailBody}>
              {/* Category & Status Pill */}
              <View style={styles.detailCategoryRow}>
                <Text style={styles.detailCategoryText}>
                  {productDetail?.category ||
                    getItemCategory(productDetail?.name)}
                </Text>
                {productDetail && (
                  <View
                    style={[
                      styles.detailStockPill,
                      isOutOfStock(productDetail.stock)
                        ? styles.stockPillOut
                        : isLowStock(productDetail.stock)
                        ? styles.stockPillLow
                        : styles.stockPillHealthy,
                    ]}
                  >
                    <Feather
                      name={
                        isOutOfStock(productDetail.stock)
                          ? 'slash'
                          : isLowStock(productDetail.stock)
                          ? 'alert-triangle'
                          : 'check-circle'
                      }
                      size={11}
                      color={
                        isOutOfStock(productDetail.stock)
                          ? Colors.errorText
                          : isLowStock(productDetail.stock)
                          ? Colors.warningText
                          : Colors.successText
                      }
                    />
                    <Text
                      style={[
                        styles.stockPillText,
                        isOutOfStock(productDetail.stock)
                          ? styles.stockTextOut
                          : isLowStock(productDetail.stock)
                          ? styles.stockTextLow
                          : styles.stockTextHealthy,
                      ]}
                    >
                      {
                        getStockStatus(
                          productDetail.stock,
                          productDetail.unit || 'kg',
                        ).label
                      }
                    </Text>
                  </View>
                )}
              </View>

              <Text style={styles.detailTitle}>{productDetail?.name}</Text>

              {/* Clean Product Attributes Row */}
              <View style={styles.statsCardGrid}>
                <View style={styles.statInfoCard}>
                  <Feather name="box" size={16} color={Colors.primary} />
                  <Text style={styles.statInfoLabel}>Available Stock</Text>
                  <Text style={styles.statInfoValue}>
                    {productDetail?.stock} {productDetail?.unit || 'kg'}
                  </Text>
                </View>

                <View style={styles.statInfoCard}>
                  <Feather name="tag" size={16} color={Colors.primary} />
                  <Text style={styles.statInfoLabel}>Category</Text>
                  <Text style={styles.statInfoValue}>
                    {productDetail?.category || 'Grocery'}
                  </Text>
                </View>
              </View>

              {/* Product Description */}
              <Text style={styles.detailSectionHeading}>Product Overview</Text>
              <Text style={styles.detailFullDesc}>
                {productDetail?.description ||
                  'No description provided for this product.'}
              </Text>

              {/* Action Buttons */}
              <View style={styles.detailActionRow}>
                {onEdit && (
                  <TouchableOpacity
                    style={styles.detailEditBtn}
                    onPress={() => {
                      const itemToEdit = productDetail;
                      setProductDetail(null);
                      onEdit(itemToEdit);
                    }}
                    activeOpacity={0.7}
                  >
                    <Feather name="edit-2" size={14} color={Colors.primary} />
                    <Text style={styles.detailEditBtnText}>Edit Item</Text>
                  </TouchableOpacity>
                )}

                {onRestock && (
                  <TouchableOpacity
                    style={styles.detailRestockBtn}
                    activeOpacity={0.85}
                    onPress={() => {
                      onRestock(productDetail.id, 25);
                      setProductDetail(prev =>
                        prev
                          ? { ...prev, stock: Number(prev.stock) + 25 }
                          : null,
                      );
                    }}
                  >
                    <Feather
                      name="plus-circle"
                      size={15}
                      color={Colors.textWhite}
                    />
                    <Text style={styles.detailRestockBtnText}>
                      + Quick Restock 25 kg
                    </Text>
                  </TouchableOpacity>
                )}
              </View>
            </View>
          </ScrollView>
        </View>
      </Modal>
    </>
  );
};

export default AllItems;

const styles = StyleSheet.create({
  listContent: {
    paddingBottom: Spacing.xxxl + 20,
    gap: Spacing.md,
  },
  card: {
    backgroundColor: Colors.surface,
    borderRadius: Radius.md,
    borderWidth: 1,
    borderColor: Colors.border,
    padding: Spacing.md,
    ...Shadows.subtle,
  },
  cardNormal: {
    borderColor: Colors.border,
  },
  cardLowStock: {
    borderLeftWidth: 4,
    borderLeftColor: Colors.warning,
    borderColor: Colors.border,
  },
  cardHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  imageWrapper: {
    width: 80,
    height: 80,
    borderRadius: Radius.sm,
    backgroundColor: Colors.backgroundSubtle,
    overflow: 'hidden',
    position: 'relative',
    borderWidth: 1,
    borderColor: Colors.border,
  },
  productImage: {
    width: '100%',
    height: '100%',
  },
  skuBadge: {
    position: 'absolute',
    top: 4,
    left: 4,
    backgroundColor: 'rgba(20, 17, 28, 0.78)',
    paddingHorizontal: 5,
    paddingVertical: 2,
    borderRadius: Radius.xs,
  },
  skuBadgeText: {
    color: Colors.textWhite,
    fontSize: 9,
    fontWeight: '700',
    letterSpacing: 0.3,
  },
  cartActionBtn: {
    backgroundColor: Colors.primaryLight,
    borderColor: Colors.primaryBorder,
  },
  infoWrapper: {
    flex: 1,
    marginLeft: Spacing.md,
  },
  tagLine: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 3,
  },
  categoryTag: {
    fontSize: 10,
    fontWeight: '700',
    color: Colors.primary,
    textTransform: 'uppercase',
    letterSpacing: 0.6,
  },
  productTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: Colors.textPrimary,
    letterSpacing: -0.2,
    marginBottom: 2,
  },
  productDesc: {
    fontSize: 12,
    color: Colors.textSecondary,
    lineHeight: 18,
    marginBottom: Spacing.xs,
  },
  stockLevelRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 2,
  },
  stockPill: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: Spacing.sm,
    paddingVertical: 2.5,
    borderRadius: Radius.full,
    borderWidth: 1,
    gap: 5,
  },
  stockPillHealthy: {
    backgroundColor: Colors.successLight,
    borderColor: Colors.successBorder,
  },
  stockPillLow: {
    backgroundColor: Colors.warningLight,
    borderColor: Colors.warningBorder,
  },
  stockPillOut: {
    backgroundColor: Colors.errorLight,
    borderColor: Colors.errorBorder,
  },
  stockPillText: {
    fontSize: 11,
    fontWeight: '600',
  },
  stockTextHealthy: {
    color: Colors.successText,
  },
  stockTextLow: {
    color: Colors.warningText,
  },
  stockTextOut: {
    color: Colors.errorText,
  },
  cardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: Spacing.sm + 4,
    paddingTop: Spacing.sm + 2,
    borderTopWidth: 1,
    borderTopColor: Colors.borderLight,
  },
  restockBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.primaryLight,
    borderWidth: 1,
    borderColor: Colors.primaryBorder,
    paddingHorizontal: Spacing.sm + 4,
    paddingVertical: 6,
    borderRadius: Radius.xs,
    gap: 4,
  },
  restockBtnUrgent: {
    backgroundColor: Colors.primary,
    borderColor: Colors.primary,
  },
  restockBtnText: {
    fontSize: 12,
    fontWeight: '600',
    color: Colors.primary,
  },
  restockBtnTextUrgent: {
    color: Colors.textWhite,
  },
  actionBtnGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.xs + 2,
  },
  iconActionBtn: {
    width: 32,
    height: 32,
    borderRadius: Radius.xs,
    backgroundColor: Colors.backgroundSubtle,
    borderWidth: 1,
    borderColor: Colors.border,
    justifyContent: 'center',
    alignItems: 'center',
  },
  deleteActionBtn: {
    backgroundColor: Colors.errorLight,
    borderColor: Colors.errorBorder,
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: Spacing.xxxl,
    paddingHorizontal: Spacing.lg,
  },
  emptyIconCircle: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: Colors.backgroundSubtle,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: Spacing.md,
  },
  emptyTitle: {
    ...Typography.title,
    marginBottom: Spacing.xs,
  },
  emptySubtitle: {
    ...Typography.subhead,
    textAlign: 'center',
    lineHeight: 20,
  },

  // 1. Lightbox Modal Styles (Image Only)
  imageModalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(10, 8, 15, 0.95)',
    paddingVertical: 40,
    paddingHorizontal: Spacing.lg,
  },
  lightboxTopBar: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
    marginTop: 10,
    zIndex: 10,
  },
  imageModalCloseBtn: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(255, 255, 255, 0.18)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  lightboxImageContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  imageModalFullscreen: {
    width: '100%',
    height: '100%',
  },

  // 2. Product Detail Page Styles
  detailContainer: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  detailScrollContent: {
    paddingBottom: 40,
  },
  detailHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Spacing.md,
    paddingBottom: Spacing.md,
    backgroundColor: Colors.surface,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  backBtn: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  detailHeaderTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: Colors.textPrimary,
  },
  detailHeroImageWrapper: {
    position: 'relative',
    width: '100%',
    height: 240,
    backgroundColor: Colors.backgroundSubtle,
    borderBottomLeftRadius: Radius.md,
    borderBottomRightRadius: Radius.md,
    overflow: 'hidden',
  },
  detailHeroImage: {
    width: '100%',
    height: '100%',
  },
  detailHeroSkuBadge: {
    position: 'absolute',
    bottom: 12,
    left: 16,
    backgroundColor: 'rgba(20, 17, 28, 0.75)',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: Radius.xs,
  },
  detailHeroSkuText: {
    color: Colors.textWhite,
    fontSize: 11,
    fontWeight: '700',
  },
  detailBody: {
    padding: Spacing.lg,
  },
  detailCategoryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.xs,
  },
  detailCategoryText: {
    fontSize: 11,
    fontWeight: '700',
    color: Colors.primary,
    textTransform: 'uppercase',
    letterSpacing: 0.6,
  },
  detailStockPill: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: Spacing.sm,
    paddingVertical: 2.5,
    borderRadius: Radius.full,
    borderWidth: 1,
    gap: 4,
  },
  detailTitle: {
    fontSize: 22,
    fontWeight: '800',
    color: Colors.textPrimary,
    marginBottom: Spacing.md,
  },
  statsCardGrid: {
    flexDirection: 'row',
    gap: Spacing.sm,
    marginBottom: Spacing.lg,
  },
  statInfoCard: {
    flex: 1,
    backgroundColor: Colors.surface,
    padding: Spacing.md,
    borderRadius: Radius.sm,
    borderWidth: 1,
    borderColor: Colors.border,
    ...Shadows.subtle,
  },
  statInfoLabel: {
    fontSize: 11,
    color: Colors.textSecondary,
    marginTop: 4,
  },
  statInfoValue: {
    fontSize: 14,
    fontWeight: '700',
    color: Colors.textPrimary,
    marginTop: 2,
  },
  detailSectionHeading: {
    fontSize: 14,
    fontWeight: '700',
    color: Colors.textPrimary,
    marginBottom: Spacing.xs,
  },
  detailFullDesc: {
    fontSize: 13,
    color: Colors.textSecondary,
    lineHeight: 20,
    marginBottom: Spacing.xl,
  },
  detailActionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
  },
  detailEditBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.surface,
    borderWidth: 1,
    borderColor: Colors.primary,
    paddingVertical: Spacing.md,
    paddingHorizontal: Spacing.lg,
    borderRadius: Radius.xs,
    gap: 6,
  },
  detailEditBtnText: {
    color: Colors.primary,
    fontSize: 13,
    fontWeight: '700',
  },
  detailRestockBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.primary,
    paddingVertical: Spacing.md,
    borderRadius: Radius.xs,
    gap: 6,
    ...Shadows.primaryButton,
  },
  detailRestockBtnText: {
    color: Colors.textWhite,
    fontSize: 13,
    fontWeight: '700',
  },
});
