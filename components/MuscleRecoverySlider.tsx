/**
 * Composant slider pour la récupération musculaire
 * RevoFit - Affichage des données de récupération des groupes musculaires
 */

import { LinearGradient } from 'expo-linear-gradient';
import {
  Dimensions,
  StyleSheet,
  Text,
  View
} from 'react-native';
import { PanGestureHandler, PanGestureHandlerGestureEvent } from 'react-native-gesture-handler';
import Animated, {
  runOnJS,
  useAnimatedGestureHandler,
  useAnimatedStyle,
  useSharedValue,
  withSpring
} from 'react-native-reanimated';
import Svg, { Circle, Path } from 'react-native-svg';
import { MuscleRecoveryData } from '../hooks/useMuscleRecovery';

const { width: screenWidth } = Dimensions.get('window');
const CARD_WIDTH = screenWidth - 40;

interface MuscleRecoverySliderProps {
  recoveryData: MuscleRecoveryData[];
  currentIndex: number;
  onIndexChange: (index: number) => void;
  loading?: boolean;
}

export default function MuscleRecoverySlider({
  recoveryData,
  currentIndex,
  onIndexChange,
  loading = false
}: MuscleRecoverySliderProps) {
  const translateX = useSharedValue(0);

  const gestureHandler = useAnimatedGestureHandler<PanGestureHandlerGestureEvent>({
    onActive: (event) => {
      translateX.value = event.translationX;
    },
    onEnd: (event) => {
      const threshold = CARD_WIDTH * 0.3;
      const velocity = event.velocityX;
      
      let newIndex = currentIndex;
      
      if (Math.abs(event.translationX) > threshold || Math.abs(velocity) > 500) {
        if (event.translationX > 0 && currentIndex > 0) {
          // Swipe vers la droite - page précédente
          newIndex = currentIndex - 1;
        } else if (event.translationX < 0 && currentIndex < recoveryData.length - 1) {
          // Swipe vers la gauche - page suivante
          newIndex = currentIndex + 1;
        }
      }
      
      translateX.value = withSpring(0);
      runOnJS(onIndexChange)(newIndex);
    }
  });

  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ translateX: translateX.value }]
    };
  });


  // Debug logs
  console.log('MuscleRecoverySlider - loading:', loading);
  console.log('MuscleRecoverySlider - recoveryData:', recoveryData);
  console.log('MuscleRecoverySlider - recoveryData.length:', recoveryData.length);
  console.log('MuscleRecoverySlider - currentIndex:', currentIndex);
  if (recoveryData.length > 0) {
    console.log('MuscleRecoverySlider - currentData:', recoveryData[currentIndex]);
    console.log('MuscleRecoverySlider - currentData.recoveryPercentage:', recoveryData[currentIndex].recoveryPercentage);
  }

  // Données par défaut
  const defaultData = {
    muscleGroup: { id: 'default', name: 'Abs', nameEn: 'Abs', category: 'primary' as const, imageUrl: '', description: '', exercises: [], createdAt: new Date(), updatedAt: new Date() },
    recoveryPercentage: 100,
    lastWorkoutDate: null,
    daysSinceLastWorkout: 999,
    status: 'ready' as const,
    color: '#4CAF50',
    subtitle: 'Prêt à s\'entraîner'
  };

  // Toujours afficher les vraies données, même si elles sont à 0%
  const displayData = recoveryData.length > 0 ? recoveryData[currentIndex] : {
    muscleGroup: { id: 'default', name: 'Abs', nameEn: 'Abs', category: 'primary' as const, imageUrl: '', description: '', exercises: [], createdAt: new Date(), updatedAt: new Date() },
    recoveryPercentage: 0,
    lastWorkoutDate: null,
    daysSinceLastWorkout: 0,
    status: 'fresh' as const,
    color: '#FF6B6B',
    subtitle: 'Juste entraîné'
  };

  return (
    <View style={styles.container}>
      {/* Main card - fixe */}
      <View style={styles.card}>
        <LinearGradient
          colors={["rgba(255,255,255,0.03)", "rgba(0,0,0,0.25)"]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={{ borderRadius: 22, padding: 18, borderWidth: 1, borderColor: "rgba(255,255,255,0.06)" }}
        >
          <Text style={{ color: "#fff", fontSize: 32, fontWeight: "900", marginBottom: 8 }}>Workout</Text>
          
          {/* Circular progress indicator - seul élément qui bouge */}
          <PanGestureHandler onGestureEvent={gestureHandler}>
            <Animated.View style={animatedStyle}>
              <CircularProgress
                percentage={displayData.recoveryPercentage}
                color={displayData.color}
                muscle={displayData.muscleGroup.name}
                subtitle={displayData.subtitle}
              />
            </Animated.View>
          </PanGestureHandler>
          
          {/* dots (carousel feel) - même style que l'original */}
          <View style={{ flexDirection: "row", alignSelf: "center", marginTop: 10, gap: 4 }}>
            {(recoveryData.length > 0 ? recoveryData : [defaultData]).map((_, index) => (
              <View
                key={index}
                style={{
                  width: index === currentIndex ? 6 : 4,
                  height: index === currentIndex ? 6 : 4,
                  borderRadius: index === currentIndex ? 3 : 2,
                  backgroundColor: index === currentIndex ? "#D1D5DB" : "rgba(255,255,255,0.3)",
                }}
              />
            ))}
          </View>
        </LinearGradient>
      </View>
    </View>
  );
}

/**
 * Composant pour l'indicateur de progression circulaire - même design que BigGauge
 */
function CircularProgress({
  percentage,
  color,
  muscle,
  subtitle
}: {
  percentage: number;
  color: string;
  muscle: string;
  subtitle: string;
}) {
  // Même géométrie que BigGauge
  const size = 280;
  const stroke = 24;
  const r = (size - stroke) / 2;
  const cx = size / 2;
  const cy = size / 2;
  const startAngle = Math.PI * 0.85;
  const endAngle = Math.PI * 2.15; // arc ≈ 260°
  const arcLen = endAngle - startAngle;
  const p = Math.max(0, Math.min(1, percentage / 100));
  const currentAngle = startAngle + arcLen * p;

  const polarToCartesian = (ang: number) => ({
    x: cx + r * Math.cos(ang),
    y: cy + r * Math.sin(ang),
  });

  const start = polarToCartesian(startAngle);
  const end = polarToCartesian(endAngle);
  const cur = polarToCartesian(currentAngle);

  const largeArc = arcLen > Math.PI ? 1 : 0;
  const currentLargeArc = arcLen * p > Math.PI ? 1 : 0;

  const basePath = `M ${start.x} ${start.y} A ${r} ${r} 0 ${largeArc} 1 ${end.x} ${end.y}`;
  const progPath = `M ${start.x} ${start.y} A ${r} ${r} 0 ${currentLargeArc} 1 ${cur.x} ${cur.y}`;

  return (
    <View style={{ alignItems: "center" }}>
      <View style={{ width: size, height: size }}>
        <Svg width={size} height={size}>
          {/* background arc */}
          <Path
            d={basePath}
            stroke="rgba(255,255,255,0.12)"
            strokeWidth={stroke}
            strokeLinecap="round"
            fill="none"
          />
          {/* progress arc (gradient-ish with opacity) */}
          <Path
            d={progPath}
            stroke={color}
            strokeOpacity={0.9}
            strokeWidth={stroke}
            strokeLinecap="round"
            fill="none"
          />
          {/* soft inner ring for depth */}
          <Circle cx={cx} cy={cy} r={r - stroke / 2 - 6} stroke="rgba(255,255,255,0.04)" strokeWidth={2} />
        </Svg>

      {/* center content */}
      <View style={[StyleSheet.absoluteFill, { alignItems: "center", justifyContent: "center", paddingHorizontal: 8 }]}>
        <Text 
          style={{ 
            color: "#fff", 
            fontSize: muscle.length > 20 ? 10 : 14, 
            fontWeight: "700", 
            marginBottom: 2,
            textAlign: "center",
            lineHeight: muscle.length > 20 ? 12 : 16
          }}
          numberOfLines={muscle.length > 20 ? 2 : 1}
        >
          {muscle}
        </Text>
        <Text style={{ color: "#fff", fontSize: 36, fontWeight: "900" }}>{Math.round(percentage)}%</Text>
        <Text style={{ color: color, fontSize: 12, fontWeight: "700", marginTop: 2 }}>{subtitle}</Text>
        <Text style={{ color: "rgba(255,255,255,0.7)", fontSize: 10, marginTop: 8 }}>Fresh Muscle Group</Text>
      </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'relative',
    height: 400, // Augmenté pour accommoder le BigGauge plus grand
  },
  card: {
    width: CARD_WIDTH,
    height: 400, // Augmenté pour accommoder le BigGauge plus grand
    alignSelf: 'center',
  },
});
