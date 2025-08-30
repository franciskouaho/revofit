import { Ionicons } from '@expo/vector-icons';
import { BlurView } from 'expo-blur';
import React from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';

interface StatusBarProps {
  strikes?: number;
  currentDay?: string;        // ex: "Wed"
  workoutMessage?: string;    // ex: "Time to workout"
  upcomingDays?: { day: number; label: string }[];
}

export default function StatusBar({
  strikes = 21,
  currentDay = 'Wed',
  workoutMessage = 'Time to workout',
  upcomingDays = [
    { day: 18, label: 'Thu' },
    { day: 19, label: 'Fri' },
    { day: 20, label: 'Sat' },
  ],
}: StatusBarProps) {
  return (
    <View style={styles.wrap}>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.row}>
        {/* --- Strikes (glass + border) --- */}
        <BlurView intensity={28} tint="dark" style={styles.glassPill}>
          <View style={styles.flameCircle}>
            <Ionicons name="flame" size={16} color="#FFD700" />
          </View>
          <View style={{ marginLeft: 10 }}>
            <Text style={styles.strikeNum}>{strikes}</Text>
            <Text style={styles.strikesTitle}>Strikes</Text>
          </View>
        </BlurView>

        {/* separator (glass line) */}
        <View style={styles.sep} />

        {/* --- Main pill (day + message) — glass + border --- */}
        <BlurView intensity={30} tint="dark" style={[styles.glassPill, styles.mainPill]}>
          <View style={styles.dayBadge}>
            <Text style={styles.dayBadgeTxt}>{currentDay}</Text>
          </View>
          <Text style={styles.pillMsg} numberOfLines={1}>
            {workoutMessage}
          </Text>

          {/* petit highlight pour l’effet verre */}
          <View style={styles.pillHighlight} pointerEvents="none" />
        </BlurView>

        {/* --- Upcoming days : petits chips glass + border --- */}
        {upcomingDays.map((d, i) => (
          <BlurView key={`${d.day}-${i}`} intensity={22} tint="dark" style={styles.dayChip}>
            <Text style={styles.upDayNum}>{d.day}</Text>
            <Text style={styles.upDayLbl}>{d.label}</Text>
          </BlurView>
        ))}
      </ScrollView>
    </View>
  );
}

const BORDER = 'rgba(255,255,255,0.12)';

const styles = StyleSheet.create({
  wrap: {
    paddingHorizontal: 16,
    paddingTop: 6,
    paddingBottom: 8,
  },
  row: {
    alignItems: 'center',
    gap: 10,
  },

  /* pill générique en verre */
  glassPill: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 22,
    borderWidth: 1,
    borderColor: BORDER,
    backgroundColor: 'rgba(255,255,255,0.06)',
    overflow: 'hidden',
  },

  /* strikes */
  flameCircle: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255,215,0,0.12)',
    borderWidth: 1,
    borderColor: BORDER,
  },
  strikeNum: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '800',
    lineHeight: 18,
  },
  strikesTitle: {
    color: 'rgba(255,255,255,0.75)',
    fontSize: 12,
    fontWeight: '600',
    marginTop: 2,
  },

  /* séparateur glacé */
  sep: {
    width: 1,
    height: 36,
    backgroundColor: BORDER,
    opacity: 0.9,
    borderRadius: 0.5,
  },

  /* pill principale */
  mainPill: {
    minWidth: 220,
    gap: 10,
    position: 'relative',
  },
  pillHighlight: {
    position: 'absolute',
    top: 0,
    left: 12,
    right: 12,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(255,255,255,0.06)', // léger halo
  },
  dayBadge: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#9BE15D',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.15)',
  },
  dayBadgeTxt: {
    color: '#0B0B0B',
    fontSize: 13,
    fontWeight: '900',
  },
  pillMsg: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
    opacity: 0.95,
    maxWidth: 170,
  },

  /* upcoming day chips (glass + border) */
  dayChip: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: BORDER,
    backgroundColor: 'rgba(255,255,255,0.05)',
    alignItems: 'center',
    minWidth: 56,
  },
  upDayNum: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '800',
    lineHeight: 18,
  },
  upDayLbl: {
    color: 'rgba(255,255,255,0.7)',
    fontSize: 11,
    fontWeight: '500',
    marginTop: 2,
  },
});
