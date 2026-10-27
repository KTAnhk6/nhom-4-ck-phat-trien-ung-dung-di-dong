/**
 * Category Chip Component
 * Horizontal selectable tag representing service categories.
 */

import React from 'react';
import { StyleSheet, Text, TouchableOpacity } from 'react-native';
import { colors } from '../theme/colors';
import { spacing } from '../theme/spacing';

interface CategoryChipProps {
  label: string;
  icon?: string;
  isSelected?: boolean;
  onPress: () => void;
  count?: number;
}

export const CategoryChip: React.FC<CategoryChipProps> = ({
  label,
  icon,
  isSelected = false,
  onPress,
  count,
}) => {
  return (
    <TouchableOpacity
      style={[styles.chip, isSelected && styles.selectedChip]}
      onPress={onPress}
      activeOpacity={0.7}
    >
      {icon ? <Text style={styles.icon}>{icon}</Text> : null}
      <Text style={[styles.label, isSelected && styles.selectedLabel]}>
        {label}
      </Text>
      {count !== undefined && count > 0 && (
        <Text style={[styles.count, isSelected && styles.selectedCount]}>
          ({count})
        </Text>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.card,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: 20,
    marginRight: spacing.sm,
    borderWidth: 1,
    borderColor: colors.border,
  },
  selectedChip: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  icon: {
    fontSize: 14,
    marginRight: 6,
  },
  label: {
    fontSize: 13,
    fontWeight: '600',
    color: colors.text,
  },
  selectedLabel: {
    color: '#FFFFFF',
    fontWeight: '700',
  },
  count: {
    fontSize: 11,
    color: colors.textLight,
    marginLeft: 4,
  },
  selectedCount: {
    color: 'rgba(255, 255, 255, 0.85)',
  },
});
