/**
 * Dalat Travel AI Chatbot Screen (Assigned to: Quang)
 * Chat assistant for smart Dalat tourism suggestions based on user natural language descriptions.
 */

import React, { useRef, useState } from 'react';
import {
  ActivityIndicator,
  FlatList,
  Image,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { colors } from '../../theme/colors';
import { borderRadius, shadows, spacing } from '../../theme/spacing';
import { useLanguage } from '../../context/LanguageContext';
import { useTourism } from '../../context/TourismContext';
import { ChatMessage } from '../../types';
import { chatbotService } from '../../services/chatbotService';

export const DalatChatbotScreen: React.FC = () => {
  const { t } = useLanguage();
  const { navigateToDetail } = useTourism();
  const flatListRef = useRef<FlatList>(null);

  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'INIT_BOT',
      sender: 'bot',
      text: t('chatbotWelcome'),
      timestamp: new Date().toISOString(),
    },
  ]);

  const quickPrompts = [
    t('quickPrompt1'),
    t('quickPrompt2'),
    t('quickPrompt3'),
    t('quickPrompt4'),
  ];

  const handleSend = async (textToSend?: string) => {
    const query = (textToSend || input).trim();
    if (!query || isTyping) return;

    const userMsg: ChatMessage = {
      id: `USER_${Date.now()}`,
      sender: 'user',
      text: query,
      timestamp: new Date().toISOString(),
    };

    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsTyping(true);

    setTimeout(() => {
      flatListRef.current?.scrollToEnd({ animated: true });
    }, 100);

    try {
      const botResponse = await chatbotService.processUserMessage(query);
      setMessages(prev => [...prev, botResponse]);
    } catch (e) {
      console.error('Chatbot error:', e);
    } finally {
      setIsTyping(false);
      setTimeout(() => {
        flatListRef.current?.scrollToEnd({ animated: true });
      }, 100);
    }
  };

  const renderMessageItem = ({ item }: { item: ChatMessage }) => {
    const isUser = item.sender === 'user';

    return (
      <View
        style={[
          styles.msgRow,
          isUser ? styles.msgRowUser : styles.msgRowBot,
        ]}
      >
        {!isUser && (
          <View style={styles.botAvatar}>
            <Text style={{ fontSize: 18 }}>🌲</Text>
          </View>
        )}

        <View style={{ maxWidth: '82%' }}>
          <View
            style={[
              styles.bubble,
              isUser ? styles.bubbleUser : styles.bubbleBot,
              shadows.subtle,
            ]}
          >
            <Text
              style={[
                styles.bubbleText,
                isUser ? styles.bubbleTextUser : styles.bubbleTextBot,
              ]}
            >
              {item.text}
            </Text>
          </View>

          {/* If the bot returned recommended services, render preview cards! */}
          {item.recommendedServices && item.recommendedServices.length > 0 && (
            <View style={styles.recommendationWrap}>
              <Text style={styles.recommendationTitle}>
                🎯 Gợi ý dành cho bạn:
              </Text>
              {item.recommendedServices.map(srv => {
                const imgUri =
                  srv.images && srv.images.length > 0
                    ? srv.images[0]
                    : 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=400&q=80';

                return (
                  <TouchableOpacity
                    key={srv.id}
                    style={[styles.recCard, shadows.subtle]}
                    onPress={() => navigateToDetail(srv.id)}
                    activeOpacity={0.85}
                  >
                    <Image source={{ uri: imgUri }} style={styles.recImg} />
                    <View style={styles.recInfo}>
                      <Text style={styles.recName} numberOfLines={1}>
                        {srv.name}
                      </Text>
                      <Text style={styles.recDist}>
                        📍 {srv.district} • ★ {srv.rating.toFixed(1)}
                      </Text>
                      <Text style={styles.recPrice} numberOfLines={1}>
                        {srv.priceDisplay}
                      </Text>
                      <Text style={styles.recDetailBtn}>Xem chi tiết ➔</Text>
                    </View>
                  </TouchableOpacity>
                );
              })}
            </View>
          )}
        </View>
      </View>
    );
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      {/* Chat Header */}
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <View style={styles.statusDot} />
          <View>
            <Text style={styles.headerTitle}>{t('chatbotTitle')}</Text>
            <Text style={styles.headerSubtitle}>
              {t('chatbotSubtitle')} • Phụ trách: Quang
            </Text>
          </View>
        </View>
      </View>

      {/* Quick Prompts Carousel */}
      <View style={styles.quickPromptsBar}>
        <FlatList
          horizontal
          showsHorizontalScrollIndicator={false}
          data={quickPrompts}
          keyExtractor={(item, index) => `${index}`}
          contentContainerStyle={{ paddingHorizontal: spacing.md, gap: 8 }}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={styles.quickPromptChip}
              onPress={() => handleSend(item)}
              activeOpacity={0.7}
            >
              <Text style={styles.quickPromptText}>💬 {item}</Text>
            </TouchableOpacity>
          )}
        />
      </View>

      {/* Messages Stream */}
      <FlatList
        ref={flatListRef}
        data={messages}
        keyExtractor={item => item.id}
        renderItem={renderMessageItem}
        contentContainerStyle={styles.messagesList}
        showsVerticalScrollIndicator={false}
      />

      {/* Typing Indicator */}
      {isTyping && (
        <View style={styles.typingRow}>
          <ActivityIndicator size="small" color={colors.primary} />
          <Text style={styles.typingText}>Trợ lý AI đang tìm kiếm điểm đến phù hợp...</Text>
        </View>
      )}

      {/* Input Box */}
      <View style={styles.inputArea}>
        <TextInput
          style={styles.textInput}
          placeholder={t('chatbotInputPlaceholder')}
          placeholderTextColor={colors.textLight}
          value={input}
          onChangeText={setInput}
          onSubmitEditing={() => handleSend()}
          returnKeyType="send"
        />
        <TouchableOpacity
          style={[styles.sendBtn, !input.trim() && styles.sendBtnDisabled]}
          onPress={() => handleSend()}
          disabled={!input.trim() || isTyping}
          activeOpacity={0.8}
        >
          <Text style={styles.sendIcon}>➤</Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    backgroundColor: colors.card,
    borderBottomWidth: 1,
    borderBottomColor: colors.borderLight,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  statusDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: colors.success,
  },
  headerTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: colors.text,
  },
  headerSubtitle: {
    fontSize: 10,
    color: colors.textMuted,
  },
  quickPromptsBar: {
    paddingVertical: 8,
    backgroundColor: colors.cardMuted,
    borderBottomWidth: 1,
    borderBottomColor: colors.borderLight,
  },
  quickPromptChip: {
    backgroundColor: colors.card,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: colors.border,
  },
  quickPromptText: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.primary,
  },
  messagesList: {
    padding: spacing.md,
    paddingBottom: spacing.lg,
  },
  msgRow: {
    flexDirection: 'row',
    marginBottom: spacing.md,
    alignItems: 'flex-start',
  },
  msgRowUser: {
    justifyContent: 'flex-end',
  },
  msgRowBot: {
    justifyContent: 'flex-start',
  },
  botAvatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: colors.primaryMuted,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 8,
    marginTop: 2,
  },
  bubble: {
    paddingHorizontal: spacing.md,
    paddingVertical: 10,
    borderRadius: borderRadius.lg,
  },
  bubbleUser: {
    backgroundColor: colors.primary,
    borderBottomRightRadius: 2,
  },
  bubbleBot: {
    backgroundColor: colors.card,
    borderBottomLeftRadius: 2,
    borderWidth: 1,
    borderColor: colors.borderLight,
  },
  bubbleText: {
    fontSize: 13,
    lineHeight: 18,
  },
  bubbleTextUser: {
    color: '#FFF',
  },
  bubbleTextBot: {
    color: colors.text,
  },
  recommendationWrap: {
    marginTop: 8,
    gap: 8,
  },
  recommendationTitle: {
    fontSize: 12,
    fontWeight: '700',
    color: colors.primary,
  },
  recCard: {
    flexDirection: 'row',
    backgroundColor: colors.card,
    borderRadius: borderRadius.md,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: colors.border,
    padding: 6,
  },
  recImg: {
    width: 70,
    height: 70,
    borderRadius: borderRadius.sm,
  },
  recInfo: {
    flex: 1,
    marginLeft: 8,
    justifyContent: 'space-between',
  },
  recName: {
    fontSize: 13,
    fontWeight: '700',
    color: colors.text,
  },
  recDist: {
    fontSize: 10,
    color: colors.textMuted,
  },
  recPrice: {
    fontSize: 11,
    fontWeight: '700',
    color: colors.secondary,
  },
  recDetailBtn: {
    fontSize: 11,
    fontWeight: '700',
    color: colors.primary,
    alignSelf: 'flex-end',
  },
  typingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.md,
    paddingBottom: 6,
    gap: 8,
  },
  typingText: {
    fontSize: 11,
    color: colors.textMuted,
    fontStyle: 'italic',
  },
  inputArea: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    backgroundColor: colors.card,
    borderTopWidth: 1,
    borderTopColor: colors.borderLight,
    gap: 8,
  },
  textInput: {
    flex: 1,
    height: 42,
    backgroundColor: colors.background,
    borderRadius: 21,
    paddingHorizontal: spacing.md,
    borderWidth: 1,
    borderColor: colors.border,
    fontSize: 13,
    color: colors.text,
  },
  sendBtn: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  sendBtnDisabled: {
    backgroundColor: colors.border,
  },
  sendIcon: {
    color: '#FFF',
    fontSize: 16,
    marginLeft: 2,
  },
});
