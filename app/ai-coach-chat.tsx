// app/(tabs)/ai-coach-chat.tsx
import { Ionicons } from '@expo/vector-icons';
import { BlurView } from 'expo-blur';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import React, { useEffect, useRef, useState } from 'react';
import {
    Animated,
    Dimensions,
    Easing,
    KeyboardAvoidingView,
    Platform,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const { width } = Dimensions.get('window');
const BORDER = 'rgba(255,255,255,0.12)';

type Message = {
  id: string;
  text: string;
  isUser: boolean;
  timestamp: Date;
};

export default function AICoachChatPage() {
  const router = useRouter();
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      text: "Salut ! Je suis ton coach IA. Dis-moi ce dont tu as besoin aujourd’hui 💪",
      isUser: false,
      timestamp: new Date(),
    },
  ]);
  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const scrollRef = useRef<ScrollView>(null);

  // typing animation
  const dot1 = useRef(new Animated.Value(0)).current;
  const dot2 = useRef(new Animated.Value(0)).current;
  const dot3 = useRef(new Animated.Value(0)).current;
  const pulse = (v: Animated.Value, delay = 0) =>
    Animated.loop(
      Animated.sequence([
        Animated.timing(v, { toValue: 1, duration: 500, delay, easing: Easing.inOut(Easing.ease), useNativeDriver: true }),
        Animated.timing(v, { toValue: 0, duration: 500, easing: Easing.inOut(Easing.ease), useNativeDriver: true }),
      ])
    );
  useEffect(() => {
    const a = pulse(dot1, 0); const b = pulse(dot2, 150); const c = pulse(dot3, 300);
    a.start(); b.start(); c.start();
    return () => { a.stop(); b.stop(); c.stop(); };
  }, []);

  const quickQuestions = [
    'Plan d’entraînement personnalisé',
    'Comment améliorer ma force ?',
    'Conseils nutrition',
    'Récupération et repos',
    'Objectifs perte de poids',
  ];

  const formatTime = (d: Date) => d.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' });

  const autoReply = (user: string) => {
    const bank = [
      "Top ! Je te propose 3 séances full-body / semaine en alternant charges et tempo. Tu veux un exemple ?",
      "Côté nutrition, vise 1.6–2 g de protéines/kg, hydrate-toi et garde un déficit léger si objectif perte de poids.",
      "Optimise le sommeil (7–8h), fais 5–10 min de mobilité/jour et respire en diaphragmatique pour mieux récupérer.",
      "Augmente progressivement (5–10%) la charge ou le volume toutes les 2 semaines, puis unload sur 1 semaine.",
      "Partons de tes dispo : combien de jours tu peux t’entraîner ? Matériel dispo ?"
    ];
    return bank[Math.floor(Math.random() * bank.length)];
  };

  const sendText = async (txt: string) => {
    if (!txt.trim()) return;
    const userMessage: Message = { id: Date.now().toString(), text: txt.trim(), isUser: true, timestamp: new Date() };
    setMessages((m) => [...m, userMessage]);
    setInputText('');
    setIsTyping(true);

    setTimeout(() => {
      const ai: Message = {
        id: (Date.now() + 1).toString(),
        text: autoReply(txt),
        isUser: false,
        timestamp: new Date(),
      };
      setMessages((m) => [...m, ai]);
      setIsTyping(false);
    }, 900);
  };

  const handleSend = () => sendText(inputText);

  const handleQuick = (q: string) => {
    // envoie direct (au lieu de remplir l’input)
    sendText(q);
  };

  useEffect(() => {
    // autoscroll à chaque nouveau message
    requestAnimationFrame(() => {
      scrollRef.current?.scrollToEnd({ animated: true });
    });
  }, [messages, isTyping]);

  return (
    <View style={styles.container}>
      {/* Fond gradient thème */}
      <LinearGradient
        colors={['#2a2a00', '#0A0A0A', '#000000', '#0A0A0A', '#2a2a00']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={StyleSheet.absoluteFill}
      />

      <SafeAreaView style={styles.safeArea}>
        {/* Header glass */}
        <View style={styles.headerWrap}>
          <BlurView intensity={22} tint="dark" style={StyleSheet.absoluteFill} />
          <View style={styles.headerBorder} />
          <View style={styles.headerInner}>
            <TouchableOpacity style={styles.circleBtn} onPress={() => router.back()}>
              <Ionicons name="arrow-back" size={20} color="#fff" />
            </TouchableOpacity>

            <View style={styles.titleBloc}>
              <View style={styles.avatar}>
                <LinearGradient colors={['#FFD700', '#FFA000']} style={styles.avatarGrad}>
                  <Ionicons name="fitness" size={20} color="#0A0A0A" />
                </LinearGradient>
              </View>
              <View>
                <Text style={styles.title}>Coach IA</Text>
                <Text style={styles.subtitle}>En ligne</Text>
              </View>
            </View>

            <TouchableOpacity style={styles.circleBtn}>
              <Ionicons name="ellipsis-vertical" size={18} color="#fff" />
            </TouchableOpacity>
          </View>
        </View>

        <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
          <ScrollView
            ref={scrollRef}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{ paddingBottom: 24 }}
          >
            {/* Quick chips glass */}
            <View style={{ paddingHorizontal: 16, paddingTop: 14 }}>
              <View style={styles.chipsWrap}>
                <BlurView intensity={18} tint="dark" style={StyleSheet.absoluteFill} />
                <View style={styles.glassBorder} />
                <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ paddingHorizontal: 12, paddingVertical: 10 }}>
                  {quickQuestions.map((q, i) => (
                    <TouchableOpacity key={i} onPress={() => handleQuick(q)} style={styles.chip}>
                      <Ionicons name="flash" size={12} color="#FFD700" />
                      <Text style={styles.chipText} numberOfLines={1}>{q}</Text>
                    </TouchableOpacity>
                  ))}
                </ScrollView>
              </View>
            </View>

            {/* Messages */}
            <View style={{ paddingTop: 6 }}>
              {messages.map((m) => (
                <View key={m.id} style={[styles.row, m.isUser ? { justifyContent: 'flex-end' } : { justifyContent: 'flex-start' }]}>
                  {!m.isUser && (
                    <View style={styles.msgAvatar}>
                      <LinearGradient colors={['#FFD700', '#FFA000']} style={styles.avatarGrad}>
                        <Ionicons name="fitness" size={16} color="#0A0A0A" />
                      </LinearGradient>
                    </View>
                  )}

                  <View style={[styles.bubbleWrap, m.isUser ? styles.userBubbleWrap : styles.aiBubbleWrap]}>
                    <BlurView intensity={16} tint="dark" style={StyleSheet.absoluteFill} />
                    <View style={[styles.bubbleBorder, m.isUser ? { borderColor: 'rgba(255,215,0,0.35)' } : null]} />
                    <Text style={styles.msgText}>{m.text}</Text>
                    <Text style={[styles.time, m.isUser ? { color: 'rgba(255,215,0,0.8)' } : null]}>
                      {formatTime(m.timestamp)}
                    </Text>
                  </View>
                </View>
              ))}

              {/* Typing */}
              {isTyping && (
                <View style={[styles.row, { justifyContent: 'flex-start' }]}>
                  <View style={styles.msgAvatar}>
                    <LinearGradient colors={['#FFD700', '#FFA000']} style={styles.avatarGrad}>
                      <Ionicons name="fitness" size={16} color="#0A0A0A" />
                    </LinearGradient>
                  </View>
                  <View style={[styles.bubbleWrap, styles.aiBubbleWrap]}>
                    <BlurView intensity={16} tint="dark" style={StyleSheet.absoluteFill} />
                    <View style={styles.bubbleBorder} />
                    <View style={styles.typingDots}>
                      {[dot1, dot2, dot3].map((v, i) => (
                        <Animated.View
                          key={i}
                          style={[
                            styles.dot,
                            {
                              transform: [{ translateY: v.interpolate({ inputRange: [0, 1], outputRange: [0, -3] }) }],
                              opacity: v.interpolate({ inputRange: [0, 1], outputRange: [0.5, 1] }),
                            },
                          ]}
                        />
                      ))}
                    </View>
                  </View>
                </View>
              )}
            </View>
          </ScrollView>

          {/* Input glass + toolbar */}
          <View style={{ paddingHorizontal: 16, paddingBottom: 10 }}>
            <View style={styles.inputGlass}>
              <BlurView intensity={22} tint="dark" style={StyleSheet.absoluteFill} />
              <View style={styles.glassBorder} />

              <TouchableOpacity style={styles.toolBtn}>
                <Ionicons name="add" size={18} color="#FFD700" />
              </TouchableOpacity>

              <TextInput
                style={styles.input}
                placeholder="Écris ton message…"
                placeholderTextColor="rgba(255,255,255,0.55)"
                value={inputText}
                onChangeText={setInputText}
                multiline
                maxLength={500}
                selectionColor="#FFD700"
              />

              <TouchableOpacity style={styles.toolBtn}>
                <Ionicons name="mic" size={18} color="rgba(255,255,255,0.8)" />
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.sendBtn, !inputText.trim() && { opacity: 0.35 }]}
                disabled={!inputText.trim()}
                onPress={handleSend}
              >
                <Ionicons name="send" size={16} color="#0A0A0A" />
              </TouchableOpacity>
            </View>
          </View>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </View>
  );
}

/* ====================== styles ====================== */
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#000' },
  safeArea: { flex: 1 },

  /* header glass */
  headerWrap: {
    marginHorizontal: 16,
    marginTop: 6,
    borderRadius: 18,
    overflow: 'hidden',
  },
  headerBorder: {
    ...StyleSheet.absoluteFillObject,
  },
  headerInner: {
    height: 56,
    paddingHorizontal: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  circleBtn: {
    width: 40, height: 40, borderRadius: 100,
    alignItems: 'center', justifyContent: 'center',
    backgroundColor: 'rgba(255,255,255,0.08)',
    borderWidth: 1, borderColor: BORDER,
  },
  titleBloc: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  avatar: { width: 36, height: 36, borderRadius: 18, overflow: 'hidden' },
  avatarGrad: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  title: { color: '#fff', fontWeight: '900' },
  subtitle: { color: '#FFD700', fontSize: 12 },

  /* chips */
  chipsWrap: {
    borderRadius: 18,
    overflow: 'hidden',
  },
  glassBorder: {
    ...StyleSheet.absoluteFillObject,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: BORDER,
  },
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 16,
    backgroundColor: 'rgba(255,215,0,0.09)',
    borderWidth: 1,
    borderColor: 'rgba(255,215,0,0.35)',
    marginRight: 10,
    gap: 6,
  },
  chipText: { color: '#FFD700', fontSize: 12, maxWidth: width * 0.55 },

  /* messages */
  row: { flexDirection: 'row', paddingHorizontal: 16, marginVertical: 6 },
  msgAvatar: { width: 28, height: 28, borderRadius: 14, overflow: 'hidden', marginRight: 8 },
  bubbleWrap: {
    maxWidth: width * 0.78,
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 16,
    overflow: 'hidden',
  },
  bubbleBorder: {
    ...StyleSheet.absoluteFillObject,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: BORDER,
  },
  aiBubbleWrap: { backgroundColor: 'rgba(255,255,255,0.05)' },
  userBubbleWrap: { backgroundColor: 'rgba(255,215,0,0.16)' },

  msgText: { color: '#fff', fontSize: 14, lineHeight: 20 },
  time: { color: 'rgba(255,255,255,0.55)', fontSize: 10, alignSelf: 'flex-end', marginTop: 4 },

  typingDots: { flexDirection: 'row', gap: 6, paddingVertical: 2 },
  dot: { width: 8, height: 8, borderRadius: 4, backgroundColor: 'rgba(255,255,255,0.8)' },

  /* input glass */
  inputGlass: {
    minHeight: 52,
    borderRadius: 24,
    overflow: 'hidden',
    flexDirection: 'row',
    alignItems: 'flex-end',
  },
  input: {
    flex: 1,
    color: '#fff',
    fontSize: 16,
    paddingHorizontal: 8,
    paddingVertical: 10,
    maxHeight: 140,
  },
  toolBtn: {
    width: 36, height: 36, borderRadius: 12,
    alignItems: 'center', justifyContent: 'center',
    margin: 8,
    backgroundColor: 'rgba(255,255,255,0.06)',
    borderWidth: 1, borderColor: BORDER,
  },
  sendBtn: {
    margin: 8,
    width: 40, height: 40, borderRadius: 14,
    alignItems: 'center', justifyContent: 'center',
    backgroundColor: '#FFD700',
  },
});
