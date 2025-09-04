import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";
import React, { useMemo, useRef, useState } from "react";
import {
  FlatList,
  NativeScrollEvent,
  NativeSyntheticEvent,
  Text,
  TouchableOpacity,
  View,
  ViewToken,
  ViewabilityConfig
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useOnboarding } from "../../components/onboarding";

/* ---------- Constantes UI ---------- */
const ROW_H = 60;              // hauteur de chaque ligne
const VISIBLE_ROWS = 5;        // nombre d'items visibles (centres + 2 au-dessus/2 au-dessous)
const PILL_W = 240;
const PILL_H = ROW_H * (VISIBLE_ROWS + 2); // marge extra pour arrondis

export default function AgeSelectionScreen() {
  const ages = useMemo(() => Array.from({ length: 83 }, (_, i) => i + 18), []);
  const [selectedAge, setSelectedAge] = useState(36);
  const { nextStep } = useOnboarding();

  const listRef = useRef<FlatList<number>>(null);

  // Centre la liste sur l'âge sélectionné au montage
  React.useEffect(() => {
    const idx = ages.indexOf(selectedAge);
    if (idx >= 0) {
      setTimeout(() => {
        listRef.current?.scrollToOffset({
          offset: idx * ROW_H,
          animated: false,
        });
      }, 0);
    }
  }, []);

  const onMomentumEnd = (e: NativeSyntheticEvent<NativeScrollEvent>) => {
    const y = e.nativeEvent.contentOffset.y;
    const idx = Math.round(y / ROW_H);
    const clamped = Math.max(0, Math.min(idx, ages.length - 1));
    if (ages[clamped] !== selectedAge) setSelectedAge(ages[clamped]);
  };

  const viewabilityConfig: ViewabilityConfig = { itemVisiblePercentThreshold: 10 };

  const onViewableItemsChanged = ({ viewableItems }: { viewableItems: ViewToken[] }) => {
    if (viewableItems.length > 0) {
      const centerItem = viewableItems.find(item => item.isViewable && item.index !== null);
      if (centerItem && centerItem.index !== null) {
        const age = ages[centerItem.index];
        if (age !== selectedAge) setSelectedAge(age);
      }
    }
  };

  const handleNext = () => {
    nextStep({ age: selectedAge });
    router.push('/onboarding/height-selection');
  };

  const handleBack = () => router.back();

  return (
    <View style={{ flex: 1, backgroundColor: '#0A0A0A' }}>
      {/* Fond thème Revo */}
      <LinearGradient
        colors={["#2a2a00", "#000000", "#000000", "#2a2a00"]}
        locations={[0, 0.22, 0.78, 1]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0 }}
      />

      {/* Header */}
      <SafeAreaView>
        <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between", paddingHorizontal: 20, paddingTop: 8 }}>
          <TouchableOpacity onPress={handleBack} style={{ height: 40, width: 40, borderRadius: 20, backgroundColor: "#2A2A2A", alignItems: "center", justifyContent: "center" }}>
            <Ionicons name="arrow-back" size={18} color="#fff" />
          </TouchableOpacity>

          {/* Dots au centre */}
          <View style={{ flexDirection: "row", gap: 8 }}>
            <View style={{ width: 8, height: 8, borderRadius: 4, backgroundColor: "#2A2A2A" }} />
            <View style={{ width: 8, height: 8, borderRadius: 4, backgroundColor: "#2A2A2A" }} />
            <View style={{ width: 8, height: 8, borderRadius: 4, backgroundColor: "#2A2A2A" }} />
            <View style={{ width: 12, height: 12, borderRadius: 6, backgroundColor: "white" }} />
            <View style={{ width: 8, height: 8, borderRadius: 4, backgroundColor: "#2A2A2A" }} />
            <View style={{ width: 8, height: 8, borderRadius: 4, backgroundColor: "#2A2A2A" }} />
            <View style={{ width: 8, height: 8, borderRadius: 4, backgroundColor: "#2A2A2A" }} />
            <View style={{ width: 8, height: 8, borderRadius: 4, backgroundColor: "#2A2A2A" }} />
            <View style={{ width: 8, height: 8, borderRadius: 4, backgroundColor: "#2A2A2A" }} />
          </View>

          {/* Espace vide à droite pour équilibrer */}
          <View style={{ width: 40 }} />
        </View>
      </SafeAreaView>

      {/* Contenu */}
      <View style={{ flex: 1, justifyContent: 'center', paddingHorizontal: 24 }}>
        {/* Titre */}
        <View style={{ alignItems: 'center', marginBottom: 36 }}>
          <Text style={{ fontSize: 22, fontWeight: '800', color: '#FF8C00', marginBottom: 8, letterSpacing: -0.5 }}>
            Quel est votre âge ?
          </Text>
          <Text style={{ color: 'rgba(255,255,255,0.8)', fontSize: 14.5, lineHeight: 24, textAlign: 'center' }}>
            Votre âge nous aide à calculer vos objectifs{"\n"}et recommandations personnalisées.
          </Text>
        </View>

        {/* Sélecteur d'âge */}
        <View style={{ alignItems: 'center', marginBottom: 40 }}>
          <View style={{
            width: PILL_W,
            height: PILL_H,
            borderRadius: PILL_W / 2,
            backgroundColor: 'rgba(0,0,0,0.65)',
            borderWidth: 1,
            borderColor: 'rgba(255,255,255,0.15)',
            overflow: 'hidden',
            shadowColor: 'black',
            shadowOpacity: 0.6,
            shadowRadius: 24,
            shadowOffset: { width: 0, height: 14 },
            elevation: 16,
          }}>
            {/* Ligne de sélection au centre */}
            <View style={{
              position: 'absolute',
              top: PILL_H / 2 - 1,
              left: 0,
              right: 0,
              height: 2,
              backgroundColor: '#FFD700',
              zIndex: 1,
            }} />

            <FlatList
              ref={listRef}
              data={ages}
              keyExtractor={(item) => item.toString()}
              showsVerticalScrollIndicator={false}
              snapToInterval={ROW_H}
              decelerationRate="fast"
              onScrollEndDrag={onMomentumEnd}
              onViewableItemsChanged={onViewableItemsChanged}
              viewabilityConfig={viewabilityConfig}
              contentContainerStyle={{
                paddingTop: PILL_H / 2 - ROW_H / 2,
                paddingBottom: PILL_H / 2 - ROW_H / 2,
              }}
              renderItem={({ item: age }) => (
                <View style={{
                  height: ROW_H,
                  alignItems: 'center',
                  justifyContent: 'center',
                }}>
                  <Text style={{
                    fontSize: 24,
                    fontWeight: 'bold',
                    color: age === selectedAge ? '#FFD700' : 'rgba(255,255,255,0.6)',
                    textAlign: 'center',
                  }}>
                    {age}
                  </Text>
                </View>
              )}
            />
          </View>
        </View>

        {/* Affichage de l'âge sélectionné */}
        <View style={{ alignItems: 'center', marginBottom: 20 }}>
          <Text style={{ color: 'rgba(255,255,255,0.6)', fontSize: 14, marginBottom: 4 }}>
            Âge sélectionné
          </Text>
          <Text style={{ color: '#FFD700', fontSize: 32, fontWeight: 'bold' }}>
            {selectedAge} ans
          </Text>
        </View>
      </View>

      {/* Bouton */}
      <SafeAreaView>
        <View style={{ paddingHorizontal: 8, paddingBottom: 16 }}>
          <TouchableOpacity
            onPress={handleNext}
            style={{
              height: 56,
              borderRadius: 28,
              backgroundColor: "#FFD700",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Text style={{ 
              color: "#000", 
              fontSize: 18, 
              fontWeight: "800" 
            }}>
              Suivant
            </Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    </View>
  );
}