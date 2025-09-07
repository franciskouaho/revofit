import { Texts } from '@/constants/Texts';
import { Ionicons } from '@expo/vector-icons';
import { BlurView } from 'expo-blur';
import { LinearGradient } from 'expo-linear-gradient';
import { ScrollView, StyleSheet, Text, View } from 'react-native';

interface WorkoutStatusBarProps {
  strikes?: number;
  currentDay?: string;        // ex: "Wed"
  workoutMessage?: string;    // ex: "Time to workout"
  upcomingDays?: { day: number; label: string }[];
}

const BORDER = 'rgba(255,255,255,0.12)';
const SURFACE = 'rgba(255,255,255,0.06)';
const GOLD = '#FFD700';

export default function WorkoutStatusBar({
                                           strikes = 21,
                                           currentDay = 'Wed',
                                           workoutMessage = 'Time to workout',
                                           upcomingDays = [
                                             { day: 18, label: 'Thu' },
                                             { day: 19, label: 'Fri' },
                                             { day: 20, label: 'Sat' },
                                           ],
                                         }: WorkoutStatusBarProps) {
  return (
      <View style={styles.wrap}>
        <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.row}
        >
          {/* --- Strikes (glass) --- */}
          <View style={styles.pillShell}>
            <BlurView intensity={28} tint="dark" style={StyleSheet.absoluteFill} />
            {/* fond verre */}
            <View style={[StyleSheet.absoluteFill, styles.glassBg]} />
            {/* gradient doux diagonal */}
            <LinearGradient
                colors={['#FFFFFF12', 'transparent']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={StyleSheet.absoluteFill}
            />
            {/* inner stroke */}
            <View style={[StyleSheet.absoluteFill, styles.innerStroke]} />
            {/* flare haut */}
            <View style={styles.topFlare} pointerEvents="none" />

            <View style={styles.strikeContent}>
              <View style={styles.flameCircle}>
                <Ionicons name="flame" size={16} color={GOLD} />
              </View>
              <View style={{ marginLeft: 10 }}>
                <Text style={styles.strikeNum}>{strikes}</Text>
                <Text style={styles.strikesTitle}>{Texts.workoutStatus.strikes}</Text>
              </View>
            </View>
          </View>

          {/* separator (verre fin) */}
          <View style={styles.sep} />

          {/* --- Main pill (day + message) — glass --- */}
          <View style={[styles.pillShell, styles.mainPill]}>
            <BlurView intensity={30} tint="dark" style={StyleSheet.absoluteFill} />
            <View style={[StyleSheet.absoluteFill, styles.glassBg]} />
            <LinearGradient
                colors={['#FFFFFF10', 'transparent']}
                start={{ x: 0.1, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={StyleSheet.absoluteFill}
            />
            <View style={[StyleSheet.absoluteFill, styles.innerStroke]} />
            <View style={styles.topFlare} pointerEvents="none" />

            <View style={styles.mainContent}>
              <View style={styles.dayBadge}>
                <Text style={styles.dayBadgeTxt}>{currentDay}</Text>
              </View>
              <Text style={styles.pillMsg} numberOfLines={1}>
                {workoutMessage}
              </Text>
            </View>
          </View>

          {/* --- Upcoming days : chips glass --- */}
          {upcomingDays.map((d, i) => (
              <View key={`${d.day}-${i}`} style={styles.chipShell}>
                <BlurView intensity={22} tint="dark" style={StyleSheet.absoluteFill} />
                <View style={[StyleSheet.absoluteFill, styles.glassBgChip]} />
                <LinearGradient
                    colors={['#FFFFFF10', 'transparent']}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}
                    style={StyleSheet.absoluteFill}
                />
                <View style={[StyleSheet.absoluteFill, styles.innerStrokeChip]} />
                <View style={styles.topFlareChip} pointerEvents="none" />

                <Text style={styles.upDayNum}>{d.day}</Text>
                <Text style={styles.upDayLbl}>{d.label}</Text>
              </View>
          ))}
        </ScrollView>
      </View>
  );
}

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

  /* ---- GLASS SHELLS ---- */
  pillShell: {
    borderRadius: 22,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: BORDER,
  },
  chipShell: {
    minWidth: 56,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 14,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: BORDER,
    alignItems: 'center',
  },
  glassBg: {
    borderRadius: 22,
    backgroundColor: SURFACE,
  },
  glassBgChip: {
    borderRadius: 14,
    backgroundColor: 'rgba(255,255,255,0.05)',
  },
  innerStroke: {
    borderRadius: 22,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.06)',
  },
  innerStrokeChip: {
    borderRadius: 14,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.06)',
  },
  topFlare: {
    position: 'absolute',
    top: 0,
    left: 12,
    right: 12,
    height: 32,
    borderRadius: 16,
    backgroundColor: 'rgba(255,255,255,0.06)',
  },
  topFlareChip: {
    position: 'absolute',
    top: 0,
    left: 8,
    right: 8,
    height: 16,
    borderRadius: 10,
    backgroundColor: 'rgba(255,255,255,0.06)',
  },

  /* ---- STRIKES ---- */
  strikeContent: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 14,
    paddingVertical: 10,
  },
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

  /* ---- SEPARATOR ---- */
  sep: {
    width: 1,
    height: 36,
    backgroundColor: BORDER,
    opacity: 0.9,
    borderRadius: 0.5,
  },

  /* ---- MAIN PILL ---- */
  mainPill: {
    minWidth: 220,
  },
  mainContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    paddingHorizontal: 14,
    paddingVertical: 10,
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

  /* ---- UPCOMING CHIPS ---- */
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
