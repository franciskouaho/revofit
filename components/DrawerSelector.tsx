// components/DrawerSelector.tsx
import { Ionicons } from "@expo/vector-icons";
import { BlurView } from "expo-blur";
import { LinearGradient } from "expo-linear-gradient";
import React, { useEffect, useRef } from "react";
import {
    Animated,
    Modal,
    Platform,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";

const BORDER = "rgba(255,255,255,0.12)";
const SURFACE = "rgba(0,0,0,0.55)";
const LIME = "#D8FF49";
const LIME_DARK = "#C3F02F";

interface DrawerSelectorProps {
  visible: boolean;
  onClose: () => void;
  title: string;
  options: string[];
  selected: string[] | string;
  onSelect: (value: string[] | string) => void;
  multi?: boolean;
}

export default function DrawerSelector({
  visible,
  onClose,
  title,
  options,
  selected,
  onSelect,
  multi = false,
}: DrawerSelectorProps) {
  const slide = useRef(new Animated.Value(300)).current;
  const fade = useRef(new Animated.Value(0)).current;

  console.log(`🎯 DrawerSelector "${title}" - RENDER - visible:`, visible);
  console.log(`🎯 DrawerSelector "${title}" - RENDER - options count:`, options.length);

  useEffect(() => {
    console.log(`🎯 DrawerSelector "${title}" - useEffect triggered, visible:`, visible);
    if (visible) {
      console.log(`🎯 DrawerSelector "${title}" - Opening animation started`);
      Animated.parallel([
        Animated.spring(slide, {
          toValue: 0,
          useNativeDriver: true,
          tension: 160,
          friction: 16,
        }),
        Animated.timing(fade, { toValue: 1, duration: 180, useNativeDriver: true }),
      ]).start();
    } else {
      console.log(`🎯 DrawerSelector "${title}" - Closing animation started`);
      Animated.parallel([
        Animated.timing(slide, { toValue: 300, duration: 180, useNativeDriver: true }),
        Animated.timing(fade, { toValue: 0, duration: 160, useNativeDriver: true }),
      ]).start();
    }
  }, [visible]);

  const isSelected = (opt: string) =>
    multi ? (selected as string[])?.includes(opt) : selected === opt;

  const handleSelect = (opt: string) => {
    if (multi) {
      const s = new Set(selected as string[]);
      s.has(opt) ? s.delete(opt) : s.add(opt);
      onSelect(Array.from(s));
    } else {
      onSelect(opt);
      // Add a small delay before closing for better UX
      setTimeout(() => {
        onClose();
      }, 150);
    }
  };

  const handleClose = () => {
    onClose();
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="none"
      onRequestClose={handleClose}
      statusBarTranslucent
      presentationStyle="overFullScreen"
    >
      {/* Backdrop */}
      <Animated.View style={[styles.backdrop, { opacity: fade }]}>
        <LinearGradient
          colors={["#000000e6", "#000000cc"]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={StyleSheet.absoluteFill}
        />
        <TouchableOpacity style={StyleSheet.absoluteFill} activeOpacity={1} onPress={handleClose} />
      </Animated.View>

      {/* Drawer */}
      <Animated.View
        style={[
          styles.drawerWrap,
          {
            transform: [{ translateY: slide }],
            zIndex: 9999, // Ensure it's on top
          },
        ]}
      >
        <View style={styles.drawer}>
          <BlurView intensity={Platform.OS === "ios" ? 28 : 20} tint="dark" style={StyleSheet.absoluteFill} />
          <View style={[StyleSheet.absoluteFill, styles.border]} />

          {/* Glow top */}
          <LinearGradient
            colors={["#2a2a0033", "transparent"]}
            start={{ x: 0.5, y: 0 }}
            end={{ x: 0.5, y: 1 }}
            style={{ height: 10 }}
          />

          {/* Handle */}
          <View style={styles.handle} />

          {/* Header */}
          <View style={styles.header}>
            <TouchableOpacity onPress={handleClose} style={styles.iconBtn}>
              <Ionicons name="close" size={20} color="#fff" />
            </TouchableOpacity>
            <Text style={styles.title}>{title}</Text>
            <View style={styles.iconBtn} />
          </View>

          {/* Options List */}
          <ScrollView
            style={styles.content}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{ paddingBottom: 20 }}
            bounces={false}
          >
            {options.map((option, index) => (
              <OptionRow
                key={option}
                option={option}
                isSelected={isSelected(option)}
                onPress={() => handleSelect(option)}
                delay={index * 30}
              />
            ))}
          </ScrollView>

          {/* Validate Button for multi-select */}
          {multi && (
            <TouchableOpacity onPress={handleClose} activeOpacity={0.9} style={styles.validateButton}>
              <LinearGradient
                colors={[LIME, LIME_DARK]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={StyleSheet.absoluteFill}
              />
              <Text style={styles.validateButtonText}>Valider</Text>
            </TouchableOpacity>
          )}
        </View>
      </Animated.View>
    </Modal>
  );
}

/* -------------------- Option Row Component -------------------- */
function OptionRow({ 
  option, 
  isSelected, 
  onPress, 
  delay = 0 
}: { 
  option: string; 
  isSelected: boolean; 
  onPress: () => void; 
  delay?: number;
}) {
  const scaleAnim = useRef(new Animated.Value(0.95)).current;
  const opacityAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.spring(scaleAnim, {
        toValue: 1,
        useNativeDriver: true,
        tension: 200,
        friction: 20,
        delay,
      }),
      Animated.timing(opacityAnim, {
        toValue: 1,
        duration: 200,
        useNativeDriver: true,
        delay,
      }),
    ]).start();
  }, []);

  const handlePress = () => {
    // Add press animation
    Animated.sequence([
      Animated.timing(scaleAnim, {
        toValue: 0.95,
        duration: 100,
        useNativeDriver: true,
      }),
      Animated.spring(scaleAnim, {
        toValue: 1,
        useNativeDriver: true,
        tension: 200,
        friction: 20,
      }),
    ]).start();
    
    onPress();
  };

  return (
    <Animated.View
      style={[
        styles.optionRow,
        {
          opacity: opacityAnim,
          transform: [{ scale: scaleAnim }],
        },
        isSelected && {
          borderColor: LIME,
          backgroundColor: "rgba(216,255,73,0.08)",
        },
      ]}
    >
      <TouchableOpacity
        onPress={handlePress}
        activeOpacity={0.7}
        style={styles.optionTouchable}
      >
        <Text
          style={[
            styles.optionText,
            isSelected && { color: LIME, fontWeight: "800" },
          ]}
        >
          {option}
        </Text>
        {isSelected ? (
          <View style={styles.selectedIcon}>
            <Ionicons name="checkmark-circle" size={18} color={LIME} />
          </View>
        ) : (
          <View style={styles.unselectedIcon}>
            <Ionicons name="ellipse-outline" size={18} color="rgba(255,255,255,0.5)" />
          </View>
        )}
      </TouchableOpacity>
    </Animated.View>
  );
}

/* -------------------- styles -------------------- */
const styles = StyleSheet.create({
  backdrop: { ...StyleSheet.absoluteFillObject },

  drawerWrap: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 9999,
  },
  drawer: {
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    overflow: "hidden",
    paddingHorizontal: 18,
    paddingBottom: 18,
    paddingTop: 8,
    backgroundColor: SURFACE,
    maxHeight: "100%",
  },
  border: {
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    borderWidth: 1,
    borderColor: BORDER,
  },
  handle: {
    alignSelf: "center",
    width: 44,
    height: 4,
    borderRadius: 2,
    backgroundColor: "rgba(255,255,255,0.35)",
    marginTop: 10,
    marginBottom: 12,
  },

  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: BORDER,
  },
  iconBtn: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(255,255,255,0.08)",
    borderWidth: 1,
    borderColor: BORDER,
  },
  title: { 
    color: "#fff", 
    fontSize: 18, 
    fontWeight: "900",
    flex: 1,
    textAlign: "center",
  },

  content: {
    paddingTop: 12,
    paddingHorizontal: 20,
    flex: 1,
    maxHeight: 500,
  },

  optionRow: {
    paddingVertical: 14,
    paddingHorizontal: 14,
    borderRadius: 12,
    backgroundColor: "rgba(255,255,255,0.06)",
    borderWidth: 1,
    borderColor: "transparent",
    marginVertical: 4,
  },
  optionTouchable: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    flex: 1,
  },
  optionText: { 
    color: "#fff", 
    fontSize: 15, 
    fontWeight: "700",
    flex: 1,
  },
  selectedIcon: {
    marginLeft: 10,
  },
  unselectedIcon: {
    marginLeft: 10,
  },

  validateButton: {
    marginHorizontal: 20,
    marginBottom: 20,
    height: 50,
    borderRadius: 25,
    overflow: "hidden",
    alignItems: "center",
    justifyContent: "center",
  },
  validateButtonText: { 
    color: "#071100", 
    fontWeight: "900", 
    fontSize: 16 
  },
});
