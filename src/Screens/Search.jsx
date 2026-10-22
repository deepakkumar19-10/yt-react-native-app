import React, { useMemo, useState } from 'react';
import {
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import Feather from 'react-native-vector-icons/Feather';
import AllItems from '../Project/AllItems';
import { CATEGORY_FILTERS } from '../utils/stockUtils';
import { Colors, Radius, Shadows, Spacing } from '../theme/theme';

const Search = ({ items = [], onBack, onEdit, onDelete, onRestock }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState('All');
  const [isFocused, setIsFocused] = useState(false);

  const filteredItems = useMemo(() => {
    return items.filter(item => {
      const q = searchQuery.toLowerCase().trim();
      const matchesQuery =
        !q ||
        (item.name || '').toLowerCase().includes(q) ||
        (item.description || '').toLowerCase().includes(q) ||
        (item.category || '').toLowerCase().includes(q) ||
        String(item.id).includes(q);

      if (!matchesQuery) return false;

      if (activeFilter === 'Low Stock') {
        return Number(item.stock) < 20;
      }
      if (activeFilter !== 'All') {
        return (
          (item.category || '').toLowerCase() === activeFilter.toLowerCase()
        );
      }
      return true;
    });
  }, [items, searchQuery, activeFilter]);

  return (
    <View style={styles.container}>
      {/* Search Header Banner */}
      <View style={styles.pageHead}>
        <View style={styles.topRow}>
          {onBack && (
            <TouchableOpacity
              onPress={onBack}
              style={styles.backBtn}
              activeOpacity={0.7}
            >
              <Feather name="arrow-left" size={20} color={Colors.textPrimary} />
            </TouchableOpacity>
          )}
          <View>
            <Text style={styles.eyebrow}>INVENTORY SEARCH</Text>
            <Text style={styles.pageTitle}>Search Store Items</Text>
          </View>
        </View>
        <Text style={styles.pageSubtitle}>
          Search items across name, category, or SKU.
        </Text>
      </View>

      {/* Search Input Container */}
      <View style={[styles.inputBox, isFocused && styles.inputBoxFocused]}>
        <Feather
          name="search"
          size={18}
          color={isFocused ? Colors.primary : Colors.textMuted}
          style={styles.searchIcon}
        />
        <TextInput
          placeholder="Search by name, category, or SKU (e.g. Basmati)..."
          placeholderTextColor={Colors.textMuted}
          style={styles.textInput}
          value={searchQuery}
          onChangeText={setSearchQuery}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          autoCapitalize="none"
          autoCorrect={false}
        />
        {Boolean(searchQuery) && (
          <TouchableOpacity
            onPress={() => setSearchQuery('')}
            style={styles.clearBtn}
            hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
          >
            <Feather name="x" size={16} color={Colors.textSecondary} />
          </TouchableOpacity>
        )}
      </View>

      {/* Horizontal Category Carousel Chips */}
      <View style={{ marginBottom: Spacing.sm + 4 }}>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.tagScroll}
        >
          {CATEGORY_FILTERS.map(tag => {
            const count =
              tag === 'All'
                ? items.length
                : tag === 'Low Stock'
                ? items.filter(i => Number(i.stock) < 20).length
                : items.filter(
                    i => (i.category || '').toLowerCase() === tag.toLowerCase(),
                  ).length;

            const isActive = activeFilter === tag;

            return (
              <TouchableOpacity
                key={tag}
                style={[styles.filterChip, isActive && styles.filterChipActive]}
                onPress={() => setActiveFilter(tag)}
                activeOpacity={0.7}
              >
                {tag === 'Low Stock' && (
                  <Feather
                    name="alert-triangle"
                    size={11}
                    color={isActive ? Colors.textWhite : Colors.warning}
                    style={{ marginRight: 4 }}
                  />
                )}
                <Text
                  style={[
                    styles.filterChipText,
                    isActive && styles.filterChipTextActive,
                  ]}
                >
                  {tag}
                </Text>
                <View
                  style={[
                    styles.chipCountPill,
                    isActive && styles.chipCountPillActive,
                  ]}
                >
                  <Text
                    style={[
                      styles.chipCountPillText,
                      isActive && styles.chipCountPillTextActive,
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

      {/* Results Header Row & Active Filter Tag */}
      <View style={styles.resultsInfoRow}>
        <View style={styles.resultsTitleRow}>
          <Text style={styles.resultsTitle}>
            {searchQuery
              ? `Results for "${searchQuery}"`
              : `${activeFilter} Items`}
          </Text>
          <View style={styles.resultsBadge}>
            <Text style={styles.resultsBadgeText}>
              {filteredItems.length} items
            </Text>
          </View>
        </View>

        {activeFilter !== 'All' && (
          <TouchableOpacity
            style={styles.resetFilterBtn}
            onPress={() => setActiveFilter('All')}
            activeOpacity={0.7}
          >
            <Text style={styles.resetFilterText}>Reset ✕</Text>
          </TouchableOpacity>
        )}
      </View>

      {/* Products Results List */}
      <View style={{ flex: 1 }}>
        <AllItems
          data={filteredItems}
          onEdit={onEdit}
          onDelete={onDelete}
          onRestock={onRestock}
        />
      </View>
    </View>
  );
};

export default Search;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  pageHead: {
    marginBottom: Spacing.md,
  },
  topRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  backBtn: {
    marginRight: Spacing.sm,
    padding: Spacing.xs,
  },
  eyebrow: {
    fontSize: 10,
    fontWeight: '700',
    color: Colors.primary,
    letterSpacing: 0.8,
    textTransform: 'uppercase',
  },
  pageTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: Colors.textPrimary,
    letterSpacing: -0.2,
  },
  pageSubtitle: {
    fontSize: 13,
    color: Colors.textSecondary,
    marginTop: 2,
    lineHeight: 18,
  },
  inputBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.surface,
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: Radius.sm,
    paddingHorizontal: Spacing.md,
    minHeight: 48,
    marginBottom: Spacing.md,
    ...Shadows.subtle,
  },
  inputBoxFocused: {
    borderColor: Colors.primary,
    shadowColor: Colors.primary,
    shadowOpacity: 0.12,
    shadowRadius: 6,
  },
  searchIcon: {
    marginRight: Spacing.sm,
  },
  textInput: {
    flex: 1,
    fontSize: 14,
    color: Colors.textPrimary,
    paddingVertical: Spacing.sm,
  },
  clearBtn: {
    padding: Spacing.xs,
    marginRight: Spacing.xs,
  },
  tagScroll: {
    flexDirection: 'row',
    gap: Spacing.xs + 2,
  },
  filterChip: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 5,
    paddingHorizontal: Spacing.md,
    borderRadius: Radius.full,
    backgroundColor: Colors.surface,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  filterChipActive: {
    backgroundColor: Colors.primary,
    borderColor: Colors.primary,
  },
  filterChipText: {
    fontSize: 12,
    fontWeight: '500',
    color: Colors.textSecondary,
  },
  filterChipTextActive: {
    color: Colors.textWhite,
    fontWeight: '600',
  },
  chipCountPill: {
    marginLeft: 6,
    backgroundColor: Colors.backgroundSubtle,
    paddingHorizontal: 5,
    paddingVertical: 1,
    borderRadius: Radius.full,
  },
  chipCountPillActive: {
    backgroundColor: 'rgba(255, 255, 255, 0.25)',
  },
  chipCountPillText: {
    fontSize: 10,
    fontWeight: '700',
    color: Colors.textSecondary,
  },
  chipCountPillTextActive: {
    color: Colors.textWhite,
  },
  resultsInfoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.sm + 2,
    paddingHorizontal: 2,
  },
  resultsTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
  },
  resultsTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: Colors.textPrimary,
  },
  resultsBadge: {
    backgroundColor: Colors.primaryLight,
    paddingHorizontal: Spacing.sm,
    paddingVertical: 3,
    borderRadius: Radius.full,
  },
  resultsBadgeText: {
    fontSize: 11,
    fontWeight: '600',
    color: Colors.primary,
  },
  resetFilterBtn: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: Radius.xs,
    backgroundColor: Colors.backgroundSubtle,
  },
  resetFilterText: {
    fontSize: 11,
    color: Colors.textSecondary,
    fontWeight: '600',
  },
});
