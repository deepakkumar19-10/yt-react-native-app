import React, { useEffect, useState } from 'react';
import {
  Image,
  Keyboard,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import Feather from 'react-native-vector-icons/Feather';
import { useDispatch } from 'react-redux';
import { addItem, updateItem } from '../store/slices/inventorySlice';
import { getProductImage, PRODUCT_IMAGES } from '../utils/imageUtils';
import { CATEGORIES } from '../utils/stockUtils';
import { Colors, Radius, Shadows, Spacing, Typography } from '../theme/theme';

const CreateScreen = ({
  data = [],
  setdata,
  editingItem = null,
  onDone,
  onCancel,
}) => {
  const dispatch = useDispatch();
  const isEdit = Boolean(editingItem);
  const [name, setName] = useState('');
  const [stock, setStock] = useState('');
  const [unit, setUnit] = useState('kg');
  const [category, setCategory] = useState(CATEGORIES[0]);
  const [description, setDescription] = useState('');
  const [formError, setFormError] = useState('');
  const [selectedImage, setSelectedImage] = useState('');

  // Populate form if editing
  useEffect(() => {
    if (editingItem) {
      setName(editingItem.name || '');
      setStock(String(editingItem.stock || ''));
      setUnit(editingItem.unit || 'kg');
      setCategory(editingItem.category || CATEGORIES[0]);
      setDescription(editingItem.description || '');
      setSelectedImage(editingItem.image || getProductImage(editingItem.name));
    } else {
      setName('');
      setStock('');
      setUnit('kg');
      setCategory(CATEGORIES[0]);
      setDescription('');
      setSelectedImage('');
    }
    setFormError('');
  }, [editingItem]);

  const handleSubmit = () => {
    setFormError('');
    if (!name.trim()) {
      setFormError('Please enter an item name');
      return;
    }
    if (!stock.trim() || isNaN(Number(stock)) || Number(stock) < 0) {
      setFormError('Please enter a valid stock quantity in kg');
      return;
    }

    const finalImage = selectedImage || getProductImage(name.trim());

    if (isEdit && editingItem) {
      // Update item in Redux
      const updatedItem = {
        id: editingItem.id,
        name: name.trim(),
        stock: Number(stock.trim()),
        unit,
        category,
        description: description.trim() || editingItem.description,
        image: finalImage,
      };
      dispatch(updateItem(updatedItem));
      if (setdata)
        setdata(data.map(i => (i.id === editingItem.id ? updatedItem : i)));
    } else {
      // Add new item in Redux
      const newItem = {
        id: Date.now(),
        name: name.trim(),
        stock: Number(stock.trim()),
        unit,
        category,
        description: description.trim() || 'Grocery inventory item.',
        image: finalImage,
      };
      dispatch(addItem(newItem));
      if (setdata) setdata([newItem, ...data]);
    }

    Keyboard.dismiss();
    if (onDone) {
      onDone();
    } else {
      setName('');
      setStock('');
      setCategory(CATEGORIES[0]);
      setDescription('');
      setSelectedImage('');
    }
  };

  const previewPhotoUrl = selectedImage || getProductImage(name || 'Item');

  const handleCycleImage = () => {
    const keys = ['wheat', 'bread', 'rice', 'basmati rice', 'pulse', 'corn'];
    const randomKey = keys[Math.floor(Math.random() * keys.length)];
    setSelectedImage(PRODUCT_IMAGES[randomKey] || PRODUCT_IMAGES.default);
  };

  return (
    <View style={styles.container}>
      {/* Top Drag Handle Indicator */}
      <View style={styles.handleContainer}>
        <View style={styles.dragHandle} />
      </View>

      {/* Header Bar */}
      <View style={styles.headerBar}>
        {onCancel ? (
          <TouchableOpacity
            onPress={onCancel}
            activeOpacity={0.7}
            style={styles.headerBtn}
          >
            <Text style={styles.cancelText}>Cancel</Text>
          </TouchableOpacity>
        ) : (
          <View style={{ width: 50 }} />
        )}

        <Text style={styles.headerTitle}>
          {isEdit ? 'Edit Item' : 'Add New Item'}
        </Text>

        <TouchableOpacity
          onPress={handleSubmit}
          activeOpacity={0.7}
          style={styles.headerBtn}
        >
          <Text style={styles.saveLinkText}>Save</Text>
        </TouchableOpacity>
      </View>

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        {/* Error Feedback */}
        {Boolean(formError) && (
          <View style={styles.errorBox}>
            <Feather name="alert-triangle" size={14} color={Colors.error} />
            <Text style={styles.errorText}>{formError}</Text>
          </View>
        )}

        {/* 1. Category Selector */}
        <View style={styles.fieldGroup}>
          <View style={styles.fieldLabelRow}>
            <Text style={styles.fieldLabel}>ITEM CATEGORY</Text>
          </View>
          <View style={styles.categoryChipsWrap}>
            {CATEGORIES.map(cat => {
              const isSelected = category === cat;
              return (
                <TouchableOpacity
                  key={cat}
                  style={[
                    styles.categoryChip,
                    isSelected && styles.categoryChipActive,
                  ]}
                  onPress={() => setCategory(cat)}
                  activeOpacity={0.7}
                >
                  {isSelected && (
                    <Feather
                      name="check"
                      size={12}
                      color={Colors.textWhite}
                      style={{ marginRight: 4 }}
                    />
                  )}
                  <Text
                    style={[
                      styles.categoryChipText,
                      isSelected && styles.categoryChipTextActive,
                    ]}
                  >
                    {cat}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>
        </View>

        {/* 2. Item Name Input */}
        <View style={styles.fieldGroup}>
          <Text style={styles.fieldLabel}>ITEM NAME *</Text>
          <View style={styles.inputContainer}>
            <Feather
              name="package"
              size={16}
              color={Colors.primary}
              style={styles.inputIcon}
            />
            <TextInput
              placeholder="e.g. Basmati Rice, Wheat Flour..."
              placeholderTextColor={Colors.textMuted}
              style={styles.textInput}
              value={name}
              onChangeText={text => {
                setName(text);
                if (formError) setFormError('');
              }}
            />
          </View>
        </View>

        {/* 3. Stock Quantity and Unit */}
        <View style={styles.rowTwo}>
          <View
            style={[styles.fieldGroup, { flex: 1, marginRight: Spacing.sm }]}
          >
            <Text style={styles.fieldLabel}>CURRENT STOCK *</Text>
            <View style={styles.inputContainer}>
              <Feather
                name="hash"
                size={16}
                color={Colors.textSecondary}
                style={styles.inputIcon}
              />
              <TextInput
                placeholder="e.g. 25"
                placeholderTextColor={Colors.textMuted}
                style={styles.textInput}
                value={stock}
                keyboardType="numeric"
                onChangeText={text => {
                  setStock(text);
                  if (formError) setFormError('');
                }}
              />
            </View>
          </View>

          <View style={[styles.fieldGroup, { width: 100 }]}>
            <Text style={styles.fieldLabel}>UNIT</Text>
            <View style={styles.unitDropdown}>
              <Text style={styles.unitText}>{unit}</Text>
            </View>
          </View>
        </View>

        {/* 4. Product Description */}
        <View style={styles.fieldGroup}>
          <Text style={styles.fieldLabel}>PRODUCT DESCRIPTION</Text>
          <View style={[styles.inputContainer, styles.textAreaContainer]}>
            <TextInput
              placeholder="Enter notes, storage conditions, or packaging details..."
              placeholderTextColor={Colors.textMuted}
              style={[styles.textInput, styles.textAreaInput]}
              value={description}
              onChangeText={setDescription}
              multiline
              numberOfLines={3}
            />
          </View>
        </View>

        {/* 5. Product Photo Preview */}
        <View style={styles.fieldGroup}>
          <Text style={styles.fieldLabel}>PRODUCT PHOTO</Text>
          <View style={styles.photoPreviewCard}>
            <View style={styles.photoThumbWrapper}>
              <Image
                source={{ uri: previewPhotoUrl }}
                style={styles.photoThumb}
                resizeMode="cover"
              />
            </View>

            <View style={styles.photoInfoCol}>
              <Text style={styles.photoFileName} numberOfLines={1}>
                {name ? `${name.trim()} Photo` : 'Standard Photo'}
              </Text>
              <Text style={styles.photoMetaText}>
                Auto-matched to item name
              </Text>
            </View>

            <TouchableOpacity
              style={styles.changePhotoBtn}
              activeOpacity={0.7}
              onPress={handleCycleImage}
            >
              <Text style={styles.changePhotoBtnText}>Change</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* 6. Primary Save Button */}
        <TouchableOpacity
          style={styles.primarySaveBtn}
          onPress={handleSubmit}
          activeOpacity={0.85}
          accessibilityRole="button"
          accessibilityLabel="Save Item to Inventory"
        >
          <Feather
            name={isEdit ? 'check' : 'plus'}
            size={16}
            color={Colors.textWhite}
            style={{ marginRight: Spacing.xs }}
          />
          <Text style={styles.primarySaveBtnText}>
            {isEdit ? 'Save Changes' : '+ Save Item to Inventory'}
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
};

export default CreateScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.surface,
    borderTopLeftRadius: Radius.lg,
    borderTopRightRadius: Radius.lg,
  },
  handleContainer: {
    alignItems: 'center',
    paddingVertical: 10,
  },
  dragHandle: {
    width: 38,
    height: 4,
    borderRadius: 2,
    backgroundColor: Colors.border,
  },
  headerBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: Spacing.lg,
    paddingBottom: Spacing.sm + 4,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  headerBtn: {
    paddingVertical: 4,
    minWidth: 50,
  },
  cancelText: {
    fontSize: 14,
    color: Colors.textSecondary,
    fontWeight: '500',
  },
  headerTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: Colors.textPrimary,
  },
  saveLinkText: {
    fontSize: 14,
    fontWeight: '700',
    color: Colors.primary,
    textAlign: 'right',
  },
  scrollContent: {
    paddingHorizontal: Spacing.lg,
    paddingTop: Spacing.md,
    paddingBottom: Spacing.xxxl + 20,
  },
  errorBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.errorLight,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    borderRadius: Radius.xs,
    marginBottom: Spacing.md,
    gap: Spacing.xs + 2,
    borderWidth: 1,
    borderColor: Colors.errorBorder,
  },
  errorText: {
    fontSize: 12,
    color: Colors.errorText,
    fontWeight: '500',
    flex: 1,
  },
  fieldGroup: {
    marginBottom: Spacing.md,
  },
  fieldLabelRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.xs,
  },
  fieldLabel: {
    fontSize: 11,
    fontWeight: '700',
    color: Colors.textSecondary,
    letterSpacing: 0.6,
    marginBottom: Spacing.xs,
  },
  categoryChipsWrap: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.xs + 2,
  },
  categoryChip: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 7,
    paddingHorizontal: Spacing.md,
    backgroundColor: Colors.backgroundSubtle,
    borderRadius: Radius.full,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  categoryChipActive: {
    backgroundColor: Colors.primary,
    borderColor: Colors.primary,
  },
  categoryChipText: {
    fontSize: 12,
    color: Colors.textSecondary,
    fontWeight: '500',
  },
  categoryChipTextActive: {
    color: Colors.textWhite,
    fontWeight: '600',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.surface,
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
  rowTwo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  unitDropdown: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.primaryLight,
    borderWidth: 1,
    borderColor: Colors.primaryBorder,
    borderRadius: Radius.xs,
    minHeight: 46,
    paddingHorizontal: Spacing.md,
  },
  unitText: {
    fontSize: 14,
    fontWeight: '700',
    color: Colors.primary,
  },
  textAreaContainer: {
    minHeight: 74,
    alignItems: 'flex-start',
    paddingVertical: Spacing.sm,
  },
  textAreaInput: {
    textAlignVertical: 'top',
    minHeight: 60,
  },
  photoPreviewCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.surface,
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: Radius.sm,
    padding: Spacing.sm + 2,
  },
  photoThumbWrapper: {
    width: 60,
    height: 60,
    borderRadius: Radius.xs,
    overflow: 'hidden',
    backgroundColor: Colors.backgroundSubtle,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  photoThumb: {
    width: '100%',
    height: '100%',
  },
  photoInfoCol: {
    flex: 1,
    marginLeft: Spacing.md,
  },
  photoFileName: {
    fontSize: 13,
    fontWeight: '600',
    color: Colors.textPrimary,
  },
  photoMetaText: {
    fontSize: 11,
    color: Colors.textSecondary,
    marginTop: 2,
  },
  changePhotoBtn: {
    backgroundColor: Colors.primaryLight,
    paddingHorizontal: Spacing.md,
    paddingVertical: 6,
    borderRadius: Radius.xs,
  },
  changePhotoBtnText: {
    fontSize: 12,
    fontWeight: '600',
    color: Colors.primary,
  },
  primarySaveBtn: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Colors.primary,
    borderRadius: Radius.xs,
    minHeight: 48,
    marginTop: Spacing.md,
    ...Shadows.primaryButton,
  },
  primarySaveBtnText: {
    fontSize: 14,
    fontWeight: '700',
    color: Colors.textWhite,
  },
});
