import { Feather } from '@expo/vector-icons';
import React, { ReactNode, useRef, useState } from 'react';
import { KeyboardAvoidingView, Platform, Pressable, ScrollView, Text, TextInput, View } from 'react-native';
import type { ChatMessage } from '../data/types';
import { chatApi } from '../services/api';
import { colors, font, radius, space } from '../theme';

/**
 * Khung chat. Chưa nối AI: tin nhắn người dùng được hiển thị,
 * phần trả lời sẽ do backend RAG cung cấp qua chatApi.send().
 */
export function ChatPanel({
  conversationId = 'new',
  placeholder = 'Hỏi về nội dung ôn thi…',
  header,
  emptyTitle = 'Hỏi gia sư về nội dung ôn thi',
  suggestions = [],
  initial = [],
}: {
  conversationId?: string;
  placeholder?: string;
  header?: ReactNode;
  emptyTitle?: string;
  suggestions?: string[];
  initial?: ChatMessage[];
}) {
  const [messages, setMessages] = useState<ChatMessage[]>(initial);
  const [text, setText] = useState('');
  const scrollRef = useRef<ScrollView>(null);

  const send = async (value?: string) => {
    const body = (value ?? text).trim();
    if (!body) return;
    setText('');
    setMessages((m) => [...m, { id: `u-${Date.now()}`, role: 'user', text: body }]);
    const reply = await chatApi.send(conversationId, body);
    if (reply) setMessages((m) => [...m, reply]);
    setTimeout(() => scrollRef.current?.scrollToEnd({ animated: true }), 50);
  };

  return (
    <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <ScrollView ref={scrollRef} style={{ flex: 1 }} contentContainerStyle={{ padding: space.lg, gap: space.md, flexGrow: 1 }}>
        {header}
        {messages.length === 0 ? (
          <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', gap: space.md, paddingVertical: space.xxl }}>
            <View style={{ width: 52, height: 52, borderRadius: 16, backgroundColor: colors.primarySoft, alignItems: 'center', justifyContent: 'center' }}>
              <Feather name="message-circle" size={24} color={colors.primary} />
            </View>
            <Text style={[font.h3, { textAlign: 'center' }]}>{emptyTitle}</Text>
            <Text style={[font.small, { textAlign: 'center', maxWidth: 320 }]}>
              Câu trả lời luôn kèm trích dẫn trang giáo trình. Gia sư không tư vấn ca bệnh cụ thể.
            </Text>
            <View style={{ gap: space.sm, width: '100%', maxWidth: 420 }}>
              {suggestions.map((s) => (
                <Pressable
                  key={s}
                  onPress={() => send(s)}
                  style={{ borderWidth: 1, borderColor: colors.border, backgroundColor: colors.surface, borderRadius: radius.md, padding: space.md }}
                >
                  <Text style={{ color: colors.text, fontSize: 14 }}>{s}</Text>
                </Pressable>
              ))}
            </View>
          </View>
        ) : (
          messages.map((m) =>
            m.role === 'user' ? (
              <View key={m.id} style={{ alignSelf: 'flex-end', maxWidth: '82%', backgroundColor: colors.primary, borderRadius: radius.lg, borderBottomRightRadius: 4, padding: space.md }}>
                <Text style={{ color: colors.white, fontSize: 15, lineHeight: 21 }}>{m.text}</Text>
              </View>
            ) : (
              <View key={m.id} style={{ alignSelf: 'flex-start', maxWidth: '90%', backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.border, borderRadius: radius.lg, padding: space.md }}>
                <Text style={font.body}>{m.text}</Text>
              </View>
            ),
          )
        )}
        {messages.length > 0 && messages[messages.length - 1].role === 'user' ? (
          <View style={{ alignSelf: 'flex-start', backgroundColor: colors.surfaceMuted, borderRadius: radius.lg, padding: space.md }}>
            <Text style={font.small}>Gia sư AI sẽ trả lời ở đây khi hệ thống được kết nối.</Text>
          </View>
        ) : null}
      </ScrollView>
      <View style={{ flexDirection: 'row', gap: space.sm, padding: space.md, borderTopWidth: 1, borderTopColor: colors.border, backgroundColor: colors.bg }}>
        <TextInput
          value={text}
          onChangeText={setText}
          placeholder={placeholder}
          placeholderTextColor={colors.faint}
          onSubmitEditing={() => send()}
          returnKeyType="send"
          accessibilityLabel="Nội dung câu hỏi"
          style={{ flex: 1, backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.border, borderRadius: radius.pill, paddingHorizontal: space.lg, minHeight: 46, fontSize: 15, color: colors.text }}
        />
        <Pressable
          onPress={() => send()}
          accessibilityRole="button"
          accessibilityLabel="Gửi"
          style={{ width: 46, height: 46, borderRadius: 23, backgroundColor: text.trim() ? colors.primary : colors.primaryMid, alignItems: 'center', justifyContent: 'center' }}
        >
          <Feather name="arrow-right" size={20} color={colors.white} />
        </Pressable>
      </View>
    </KeyboardAvoidingView>
  );
}
