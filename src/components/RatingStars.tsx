/**
 * Rating Stars Component
 * Supports both display mode (viewing ratings) and interactive mode (selecting 1-5 stars for review).
 */

import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { colors } from '../theme/colors';

interface RatingStarsProps {
  rating: number; // 0 to 5
  size?: number;
  interactive?: boolean;
  onRatingChange?: (rating: number) => void;
  showScore?: boolean;
}

export const RatingStars: React.FC<RatingStarsProps> = ({
  rating,
  size = 16,
  interactive = false,
  onRatingChange,
  showScore = false,
}) => {
  const stars = [1, 2, 3, 4, 5];

  return (
    <View style={styles.container}>
      <View style={styles.starRow}>
        {stars.map(starNumber => {
          const filled = starNumber <= Math.round(rating);

          if (interactive) {
            return (
              <TouchableOpacity
                key={starNumber}
                onPress={() => onRatingChange && onRatingChange(starNumber)}
                activeOpacity={0.7}
                style={styles.starTouch}
              >
                <Text
                  style={[
                    styles.star,
                    { fontSize: size },
                    filled ? styles.starFilled : styles.starEmpty,
                  ]}
                >
                  ★
                </Text>
              </TouchableOpacity>
            );
          }

          return (
            <Text
              key={starNumber}
              style={[
                styles.star,
                { fontSize: size },
                filled ? styles.starFilled : styles.starEmpty,
              ]}
            >
              ★
            </Text>
          );
        })}
      </View>

      {showScore && (
        <Text style={[styles.scoreText, { fontSize: size * 0.9 }]}>
          {rating.toFixed(1)}
        </Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  starRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  starTouch: {
    paddingHorizontal: 3,
  },
  star: {
    marginRight: 1,
  },
  starFilled: {
    color: colors.star,
  },
  starEmpty: {
    color: '#D1D5DB',
  },
  scoreText: {
    fontWeight: '700',
    color: colors.text,
  },
});
