// app/(tabs)/workout.tsx
import HealthDrawer from "@/components/HealthDrawer";
import MuscleRecoverySlider from "@/components/MuscleRecoverySlider";
import TemplateDrawer from "@/components/TemplateDrawer";
import WorkoutTemplateCard from "@/components/WorkoutTemplateCard";
import { Ionicons } from "@expo/vector-icons";
import { BlurView } from "expo-blur";
import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";
import React, { useState } from "react";
import {
    Alert,
    FlatList,
    ImageBackground,
    Modal,
    RefreshControl,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Svg, { Circle, Path } from "react-native-svg";
import { useMuscleRecovery } from "../../hooks/useMuscleRecovery";
import { useWorkouts } from "../../hooks/useWorkouts";
import { ExerciseTemplate } from "../../types/exercise";

const BORDER = "rgba(255,255,255,0.12)";

/** --------- Menu Modal Component ---------- */
function WorkoutMenuModal({ visible, onClose, onGenerateWorkout }: { visible: boolean; onClose: () => void; onGenerateWorkout: () => void }) {
  const menuOptions = [
    { title: "Commencer un Entraînement Vide", icon: "person", onPress: () => console.log("Start Empty Workout") },
    { title: "Générer un Entraînement", icon: "star", onPress: onGenerateWorkout },
    { title: "Enregistrer un Entraînement Passé", icon: "time", onPress: () => console.log("Log Past Workout") },
    { title: "Ajouter un Template", icon: "clipboard", onPress: () => console.log("Add Template") },
    { title: "Ajouter un Exercice Personnalisé", icon: "fitness", onPress: () => console.log("Add Custom Exercise") },
  ];

  return (
    <Modal
      visible={visible}
      transparent={true}
      animationType="fade"
      onRequestClose={onClose}
    >
      <TouchableOpacity 
        style={{ flex: 1, backgroundColor: "rgba(0,0,0,0.8)" }} 
        activeOpacity={1} 
        onPress={onClose}
      >
        <View style={{ flex: 1, justifyContent: "flex-start", alignItems: "flex-end", paddingTop: 120, paddingRight: 20 }}>
          <View style={{ 
            borderRadius: 18, 
            minWidth: 280,
            overflow: "hidden",
            shadowColor: "#000",
            shadowOffset: { width: 0, height: 12 },
            shadowOpacity: 0.6,
            shadowRadius: 20,
            elevation: 16,
          }}>
            <BlurView intensity={30} tint="dark" style={StyleSheet.absoluteFill} />
            <View
              style={[
                StyleSheet.absoluteFill,
                { backgroundColor: "rgba(0,0,0,0.4)", borderColor: "rgba(255,255,255,0.15)", borderWidth: 1, borderRadius: 18 },
              ]}
            />
            <View style={{ padding: 8 }}>
              {menuOptions.map((option, index) => (
                <View key={option.title}>
                  <TouchableOpacity
                    style={{
                      flexDirection: "row",
                      alignItems: "center",
                      justifyContent: "space-between",
                      paddingVertical: 16,
                      paddingHorizontal: 20,
                      borderRadius: 12,
                    }}
                    onPress={() => {
                      option.onPress();
                      onClose();
                    }}
                    activeOpacity={0.7}
                  >
                    <Text style={{ color: "#fff", fontSize: 16, fontWeight: "600" }}>
                      {option.title}
                    </Text>
                    <Ionicons name={option.icon as any} size={20} color="#fff" />
                  </TouchableOpacity>
                  {index < menuOptions.length - 1 && (
                    <View style={{ 
                      height: 1, 
                      backgroundColor: "rgba(255,255,255,0.08)", 
                      marginHorizontal: 20 
                    }} />
                  )}
                </View>
              ))}
            </View>
          </View>
        </View>
      </TouchableOpacity>
    </Modal>
  );
}

/** --------- Big ring gauge (progress) ---------- */
function BigGauge({
  title,
  percent,
  color = "#4CAF50",
  subtitle = "Recovered",
  muscle = "Abs",
}: {
  title?: string;
  percent: number; // 0..100
  color?: string;
  subtitle?: string;
  muscle?: string;
}) {
  // geometry
  const size = 280;
  const stroke = 24;
  const r = (size - stroke) / 2;
  const cx = size / 2;
  const cy = size / 2;
  const startAngle = Math.PI * 0.85;
  const endAngle = Math.PI * 2.15; // arc ≈ 260°
  const arcLen = endAngle - startAngle;
  const p = Math.max(0, Math.min(1, percent / 100));
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
        <View style={[StyleSheet.absoluteFill, { alignItems: "center", justifyContent: "center" }]}>
          <Text style={{ color: "#fff", fontSize: 20, fontWeight: "700", marginBottom: 4 }}>{muscle}</Text>
          <Text style={{ color: "#fff", fontSize: 48, fontWeight: "900" }}>{Math.round(percent)}%</Text>
          <Text style={{ color: "#4CAF50", fontSize: 16, fontWeight: "700", marginTop: 4 }}>{subtitle}</Text>
          <Text style={{ color: "rgba(255,255,255,0.7)", marginTop: 14 }}>Fresh Muscle Group</Text>
        </View>
      </View>
    </View>
  );
}

/** --------- Tiny helper: glass container --------- */
const Glass = ({ children, style, blur = 18 }: any) => (
  <View style={[{ borderRadius: 18, overflow: "hidden" }, style]}>
    <BlurView intensity={blur} tint="dark" style={StyleSheet.absoluteFill} />
    <View
      style={[
        StyleSheet.absoluteFill,
        { backgroundColor: "rgba(255,255,255,0.06)", borderColor: BORDER, borderWidth: 1, borderRadius: 18 },
      ]}
    />
    <View style={{ padding: 16 }}>{children}</View>
  </View>
);

/** ------------------- Screen -------------------- */
export default function WorkoutScreen() {
  const [menuVisible, setMenuVisible] = useState(false);
  const [templateDrawerVisible, setTemplateDrawerVisible] = useState(false);
  const [healthDrawerVisible, setHealthDrawerVisible] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  
  // Hook Firebase pour les workouts
  const { templates, loading, error, refetch, deleteTemplate } = useWorkouts();
  
  // Hook pour la récupération musculaire
  const { 
    recoveryData, 
    currentIndex, 
    loading: recoveryLoading, 
    error: recoveryError, 
    setCurrentIndex, 
    refreshData: refreshRecoveryData 
  } = useMuscleRecovery();
  
  // Debug: Afficher les templates dans la console
  React.useEffect(() => {
    console.log("🔍 Templates chargés:", templates.length);
    console.log("🔍 Templates:", templates);
    console.log("🔍 Loading:", loading);
    console.log("🔍 Error:", error);
  }, [templates, loading, error]);

  const handleRefresh = async () => {
    setRefreshing(true);
    await Promise.all([refetch(), refreshRecoveryData()]);
    setRefreshing(false);
  };


  const handleTemplate = (type: string) => {
    console.log("Creating template:", type);
    // Ici vous pouvez ajouter la logique pour créer le template
  };

  const handleTemplateCreated = (newTemplate: any) => {
    // Le template sera automatiquement ajouté via le hook Firebase
    console.log("Template créé:", newTemplate);
    // Rafraîchir la liste
    refetch();
  };

  const handleTemplatePress = (template: ExerciseTemplate) => {
    router.push({
      pathname: "/workout/details",
      params: { 
        templateId: template.id,
        templateName: template.name,
        template: JSON.stringify(template)
      }
    });
  };

  const handleExercisePress = (exercise: string, template: ExerciseTemplate) => {
    // Trouver l'exercice dans le template par son nom
    const exerciseData = template.exercises.find(ex => ex.name === exercise);
    
    if (exerciseData) {
      router.push({
        pathname: "/workout/details",
        params: {
          exercise: JSON.stringify(exerciseData),
          exerciseName: exerciseData.name,
          templateId: template.id,
          templateName: template.name
        }
      });
    } else {
      console.log("Exercise not found:", exercise);
    }
  };

  const handleDeleteTemplate = async (templateId: string) => {
    try {
      // Confirmation avant suppression
      Alert.alert(
        "Supprimer le template",
        "Êtes-vous sûr de vouloir supprimer ce template ? Cette action est irréversible.",
        [
          {
            text: "Annuler",
            style: "cancel"
          },
          {
            text: "Supprimer",
            style: "destructive",
            onPress: async () => {
              try {
                const success = await deleteTemplate(templateId);
                if (success) {
                  Alert.alert("Succès", "Template supprimé avec succès !");
                } else {
                  Alert.alert("Erreur", "Impossible de supprimer le template.");
                }
              } catch (error) {
                console.error("Erreur lors de la suppression:", error);
                Alert.alert("Erreur", "Une erreur est survenue lors de la suppression.");
              }
            }
          }
        ]
      );
    } catch (error) {
      console.error("Erreur lors de la suppression:", error);
      Alert.alert("Erreur", "Impossible de supprimer le template.");
    }
  };

  return (
    <View style={{ flex: 1, backgroundColor: "#000" }}>
      {/* Fond thème Revo */}
      <LinearGradient
        colors={["#2a2a00", "#000000", "#000000", "#2a2a00"]}
        locations={[0, 0.18, 0.82, 1]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={StyleSheet.absoluteFill}
      />

      <SafeAreaView style={{ flex: 1 }}>
        {/* Header glass + titre + bouton + */}
        <View style={{ paddingHorizontal: 20, paddingBottom: 8 }}>
          <View style={{ height: 52, borderRadius: 18, overflow: "hidden" }}>
            <BlurView intensity={22} tint="dark" style={StyleSheet.absoluteFill} />
            <View
              style={[
                StyleSheet.absoluteFill,
              ]}
            />
            <View style={{ flex: 1, flexDirection: "row", alignItems: "center", paddingHorizontal: 14, justifyContent: "space-between" }}>
              <Text style={{ color: "#fff", fontSize: 20, fontWeight: "900" }}>Workout</Text>
              <TouchableOpacity
                style={{
                  width: 36,
                  height: 36,
                  borderRadius: 100,
                  alignItems: "center",
                  justifyContent: "center",
                  backgroundColor: "rgba(255,255,255,0.08)",
                  borderWidth: 1,
                  borderColor: BORDER,
                }}
                onPress={() => setMenuVisible(true)}
              >
                <Ionicons name="add" size={22} color="#fff" />
              </TouchableOpacity>
            </View>
          </View>
        </View>

        <ScrollView 
          showsVerticalScrollIndicator={false} 
          contentContainerStyle={{ paddingBottom: 36 }}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={handleRefresh}
              tintColor="#fff"
              colors={["#FFD700"]}
            />
          }
        >
          {/* Muscle recovery slider section */}
          <View style={{ paddingHorizontal: 20, paddingTop: 16 }}>
            <MuscleRecoverySlider
              recoveryData={recoveryData}
              currentIndex={currentIndex}
              onIndexChange={setCurrentIndex}
              loading={recoveryLoading}
            />
            
            {/* boutons */}
            <View style={{ flexDirection: "row", gap: 12, marginTop: 18 }}>
                <TouchableOpacity 
                  style={{ flex: 1, borderRadius: 18, overflow: "hidden" }}
                  onPress={() => {
                    router.push("/generate-workout");
                  }}
                  activeOpacity={0.9}
                >
                  <LinearGradient
                    colors={["#7C4DFF", "#6A3DF5"]}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}
                    style={{ padding: 16, alignItems: "center", justifyContent: "center" }}
                  >
                    <Text style={{ color: "#fff", fontWeight: "800" }}>✦ Generate</Text>
                  </LinearGradient>
                </TouchableOpacity>
                
                <TouchableOpacity 
                  style={{ flex: 1, borderRadius: 18, overflow: "hidden" }}
                  onPress={() => setHealthDrawerVisible(true)}
                  activeOpacity={0.9}
                >
                  <LinearGradient
                    colors={["#4CAF50", "#45A049"]}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}
                    style={{ padding: 16, alignItems: "center", justifyContent: "center", flexDirection: "row", gap: 8 }}
                  >
                    <Ionicons name="heart" size={18} color="#fff" />
                    <Text style={{ color: "#fff", fontWeight: "800" }}>Health</Text>
                  </LinearGradient>
                </TouchableOpacity>
              </View>
          </View>

          {/* semaine + cartes infos */}
          <View style={{ paddingHorizontal: 20, marginTop: 18 }}>
            <Glass>
              {/* semaine */}
              <View style={{ marginBottom: 12 }}>
                <Text style={{ color: "#fff", fontSize: 18, fontWeight: "800", marginBottom: 8 }}>Ma Semaine</Text>
                <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ paddingRight: 8 }}>
                  {(() => {
                    const today = new Date();
                    const currentDay = today.getDay(); // 0 = dimanche, 1 = lundi, etc.
                    const days = ['DIM', 'LUN', 'MAR', 'MER', 'JEU', 'VEN', 'SAM'];
                    
                    // Générer les 7 jours en commençant par le jour actuel
                    const weekDays = [];
                    for (let i = 0; i < 7; i++) {
                      const date = new Date(today);
                      date.setDate(today.getDate() + i); // Commencer par aujourd'hui
                      const dayNumber = date.getDate();
                      const dayName = days[(currentDay + i) % 7]; // Calculer le nom du jour
                      const isActive = i === 0; // Le premier jour (aujourd'hui) est actif
                      
                      weekDays.push({
                        d: dayNumber.toString(),
                        l: dayName,
                        active: isActive
                      });
                    }
                    return weekDays;
                  })().map((it, i) => (
                    <View
                      key={i}
                      style={{
                        width: 64,
                        alignItems: "center",
                        justifyContent: "center",
                        marginRight: 8,
                        paddingVertical: 10,
                        borderRadius: 14,
                        borderWidth: 1,
                        borderColor: it.active ? "rgba(46,204,113,0.8)" : "rgba(255,255,255,0.06)",
                        backgroundColor: it.active ? "rgba(46,204,113,0.12)" : "transparent",
                      }}
                    >
                      <Text style={{ color: "#fff", fontWeight: "900" }}>{it.d}</Text>
                      <Text style={{ color: "rgba(255,255,255,0.7)", marginTop: 4 }}>{it.l}</Text>
                    </View>
                  ))}
                </ScrollView>
              </View>

              {/* streak + minutes */}
              <View style={{ flexDirection: "row", gap: 12 }}>
                <Glass style={{ flex: 1, padding: 0 }}>
                  <View style={{ padding: 16, flexDirection: "row", alignItems: "center", gap: 10 }}>
                    <Ionicons name="flash" size={18} color="#FFD700" />
                    <View>
                      <Text style={{ color: "#fff", fontWeight: "900" }}>0 Semaines</Text>
                      <Text style={{ color: "rgba(255,255,255,0.7)", marginTop: 2 }}>série actuelle</Text>
                    </View>
                  </View>
                </Glass>
                <Glass style={{ flex: 1, padding: 0 }}>
                  <View style={{ padding: 16, flexDirection: "row", alignItems: "center", gap: 10 }}>
                    <Ionicons name="time" size={18} color="#FFD700" />
                    <View>
                      <Text style={{ color: "#fff", fontWeight: "900" }}>0 / 100</Text>
                      <Text style={{ color: "rgba(255,255,255,0.7)", marginTop: 2 }}>minutes</Text>
                    </View>
                  </View>
                </Glass>
              </View>
            </Glass>
          </View>

          {/* learning phase banner */}
          <View style={{ paddingHorizontal: 20, marginTop: 18 }}>
            <View style={{ borderRadius: 20, overflow: "hidden", borderWidth: 1, borderColor: BORDER }}>
              <ImageBackground
                source={{ uri: "https://images.unsplash.com/photo-1517963628607-235ccdd5476b?q=80&w=1600&auto=format&fit=crop" }}
                style={{ height: 140, justifyContent: "center" }}
                resizeMode="cover"
              >
                <LinearGradient
                  colors={["rgba(0,0,0,0.55)", "rgba(0,0,0,0.25)", "rgba(0,0,0,0)"]}
                  start={{ x: 0, y: 1 }}
                  end={{ x: 1, y: 0 }}
                  style={StyleSheet.absoluteFill}
                />
                <View style={{ padding: 16 }}>
                  <Text style={{ color: "#fff", fontSize: 20, fontWeight: "900", marginBottom: 4 }}>
                    Phase d&apos;Apprentissage
                  </Text>
                  <Text style={{ color: "rgba(255,255,255,0.9)" }}>
                    Il faut jusqu&apos;à 5 entraînements pour que l&apos;IA apprenne vos mouvements.
                  </Text>
                </View>              
              </ImageBackground>
            </View>
          </View>

          {/* templates */}
          <View style={{ paddingHorizontal: 20, marginTop: 22 }}>
            <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
              <Text style={{ color: "#fff", fontSize: 20, fontWeight: "900" }}>Mes Templates</Text>
              <TouchableOpacity
                onPress={() => setTemplateDrawerVisible(true)}
                activeOpacity={0.9}
                style={{ flexDirection: "row", alignItems: "center", gap: 6 }}
              >
                <Ionicons name="add" size={16} color="#FFD700" />
                <Text style={{ color: "#FFD700", fontWeight: "700", fontSize: 14 }}>Nouveau</Text>
              </TouchableOpacity>
            </View>

            {error ? (
              <Glass>
                <View style={{ alignItems: "center", paddingVertical: 20 }}>
                  <Ionicons name="alert-circle" size={48} color="#FF6B6B" />
                  <Text style={{ color: "#FF6B6B", fontSize: 16, fontWeight: "800", marginTop: 12 }}>
                    Erreur de chargement
                  </Text>
                  <Text style={{ color: "rgba(255,255,255,0.7)", marginTop: 6, textAlign: "center" }}>
                    {error}
                  </Text>
                  <TouchableOpacity
                    onPress={refetch}
                    style={{ marginTop: 16, paddingHorizontal: 20, paddingVertical: 10, backgroundColor: "#FFD700", borderRadius: 20 }}
                  >
                    <Text style={{ color: "#000", fontWeight: "700" }}>Réessayer</Text>
                  </TouchableOpacity>
                </View>
              </Glass>
            ) : loading ? (
              <Glass>
                <View style={{ alignItems: "center", paddingVertical: 20 }}>
                  <Text style={{ color: "rgba(255,255,255,0.7)" }}>Chargement des entraînements...</Text>
                </View>
              </Glass>
            ) : templates.length === 0 ? (
              <Glass>
                <View style={{ alignItems: "center", paddingVertical: 8 }}>
                  <Ionicons name="fitness" size={48} color="rgba(255,255,255,0.3)" />
                  <Text style={{ color: "#fff", fontSize: 16, fontWeight: "800", marginTop: 12 }}>
                    Aucun Entraînement Disponible
                  </Text>
                  <Text style={{ color: "rgba(255,255,255,0.7)", marginTop: 6, textAlign: "center" }}>
                    Les entraînements seront bientôt disponibles dans cette section.
                  </Text>

                  <View style={{ height: 12 }} />

                  <TouchableOpacity
                    onPress={() => setTemplateDrawerVisible(true)}
                    activeOpacity={0.9}
                  >
                    <View style={{ borderRadius: 24, overflow: "hidden" }}>
                      <LinearGradient
                        colors={["#FFD700", "#E6C200"]}
                        start={{ x: 0, y: 0 }}
                        end={{ x: 1, y: 1 }}
                        style={{ paddingHorizontal: 22, paddingVertical: 12, flexDirection: "row", alignItems: "center", gap: 8 }}
                      >
                        <Ionicons name="add" size={18} color="#000" />
                        <Text style={{ color: "#000", fontWeight: "900" }}>Créer un template</Text>
                      </LinearGradient>
                    </View>
                  </TouchableOpacity>
                </View>
              </Glass>
            ) : (
              <FlatList
                data={templates}
                renderItem={({ item }) => (
                  <WorkoutTemplateCard
                    template={item}
                    onPress={handleTemplatePress}
                    onDelete={handleDeleteTemplate}
                    onExercisePress={handleExercisePress}
                  />
                )}
                keyExtractor={(item) => item.id}
                showsVerticalScrollIndicator={false}
                scrollEnabled={false}
              />
            )}
          </View>
        </ScrollView>
      </SafeAreaView>

      <WorkoutMenuModal 
        visible={menuVisible} 
        onClose={() => setMenuVisible(false)} 
        onGenerateWorkout={() => {
          setMenuVisible(false);
          router.push("/generate-workout");
        }}
      />
      


      {/* Template Drawer */}
      <TemplateDrawer
        visible={templateDrawerVisible}
        onClose={() => setTemplateDrawerVisible(false)}
        onGenerate={handleTemplate}
        onTemplateCreated={handleTemplateCreated}
      />

      {/* Health Drawer */}
      <HealthDrawer
        visible={healthDrawerVisible}
        onClose={() => setHealthDrawerVisible(false)}
      />
    </View>
  );
}
