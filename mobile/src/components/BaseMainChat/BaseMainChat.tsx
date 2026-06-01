import { ChevronLeft, Send, Sparkles } from "lucide-react-native";
import { ActivityIndicator, Alert, FlatList, KeyboardAvoidingView, Platform, Text, TextInput, TouchableOpacity, View } from "react-native";
import { StyleSheet } from 'react-native';
import { useRef, useState, useEffect } from "react";

import { Colors } from "../../theme/colors";
import { chatApi } from "../../services/api";
import { authService } from "../../services/auth";
import { TypingIndicator } from "./TypingIndicator";

interface Message {
    id: string;
    text: string;
    isUser: boolean;
    // timestamp: Date;
}

const renderMessage = ({ item }: { item: Message }) => (
    <View style={[styles.messageRow, item.isUser ? styles.userRow : styles.aiRow]}>
        {!item.isUser && (
            <View style={styles.aiAvatar}>
                <Sparkles size={16} color="white" />
            </View>
        )}
        <View
            style={[
                styles.messageBubble,
                item.isUser ? styles.userBubble : styles.aiBubble,
            ]}
        >
            <Text style={[styles.messageText, item.isUser ? styles.userText : styles.aiText]}>
                {item.text}
            </Text>
        </View>
    </View>
);

interface BaseMainChatProps {
    sessionId: string;
    onSessionEnd: () => void;
}

export const BaseMainChat: React.FC<BaseMainChatProps> = ({ sessionId, onSessionEnd }) => {
    const [messages, setMessages] = useState<Message[]>([]);
    const [input, setInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [isInitialLoading, setIsInitialLoading] = useState(true);
    const [isSessionFinished, setIsSessionFinished] = useState(false);
    const flatListRef = useRef<FlatList>(null);

    useEffect(() => {
        const loadHistory = async () => {
            try {
                const token = await authService.getToken();
                if (!token) {
                    setIsInitialLoading(false);
                    return;
                }

                const history = await chatApi.getHistory(token, sessionId);
                const formattedHistory: Message[] = history.map((msg: any) => ({
                    id: msg.id || Math.random().toString(),
                    text: msg.text,
                    isUser: msg.role === 'client',
                }));

                if (formattedHistory.length === 0) {
                    setMessages([
                        {
                            id: 'welcome',
                            isUser: false,
                            text: 'Привет! Я твой личный помощник. Чем я могу тебе помочь? 😊'
                        },
                    ]);
                } else {
                    setMessages(formattedHistory);
                }
            } catch (error) {
                console.error('Failed to load history:', error);
                Alert.alert('Error', 'Could not load chat history.');
            } finally {
                setIsInitialLoading(false);
            }
        };

        loadHistory();
    }, [sessionId]);

    const sendMessage = async () => {
        if (!input.trim() || isLoading || isSessionFinished) return;
        console.log('sending message...');

        const userText = input.trim();
        const tempId = Date.now().toString();

        const token = await authService.getToken();
        if (!token) {
            Alert.alert('Error', 'User authentication error.');
            return;
        }

        const userMessage: Message = {
            id: tempId,
            text: userText,
            isUser: true,
            // timestamp: new Date(),
        };

        setMessages((prev) => [...prev, userMessage]);
        setInput('');
        setIsLoading(true);

        // Scroll to end when user sends a message
        setTimeout(() => flatListRef.current?.scrollToEnd({ animated: true }), 100);

        try {
            const data = await chatApi.sendMessage(userText, token, sessionId);

            const aiMessage: Message = {
                id: Date.now().toString(),
                text: data.data || (typeof data === 'string' ? data : ''),
                isUser: false,
            };

            setMessages((prev) => [...prev, aiMessage]);

            if (data.sessionFinished) {
                setIsSessionFinished(true);
            }
        } catch (error) {
            Alert.alert('Error', 'Failed to reach Serenity. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    const renderFooter = () => {
        if (!isLoading) return null;
        return (
            <View style={[styles.messageRow, styles.aiRow]}>
                <View style={styles.aiAvatar}>
                    <Sparkles size={16} color="white" />
                </View>
                <View style={[styles.messageBubble, styles.aiBubble]}>
                    <TypingIndicator />
                </View>
            </View>
        );
    };

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                {/* <TouchableOpacity style={styles.backButton}>
                    <ChevronLeft color={Colors.text} size={28} />
                </TouchableOpacity> */}
                <View style={styles.headerInfo}>
                    <Text style={styles.headerTitle}>Ванесса</Text>
                    <View style={styles.onlineStatus}>
                        <View style={styles.onlineDot} />
                        <Text style={styles.onlineText}>Online</Text>
                    </View>
                </View>
            </View>
            <View style={styles.messagesList}>
                {isInitialLoading ? (
                    <View style={styles.loadingContainer}>
                        <ActivityIndicator size="large" color={Colors.primary} />
                        <Text style={styles.loadingText}>Загрузка сообщений...</Text>
                    </View>
                ) : (
                    <FlatList
                        ref={flatListRef}
                        data={messages}
                        renderItem={renderMessage}
                        keyExtractor={(item) => item.id}
                        contentContainerStyle={styles.messageList}
                        showsVerticalScrollIndicator={false}
                        ListFooterComponent={renderFooter}
                        onContentSizeChange={() => flatListRef.current?.scrollToEnd({ animated: true })}
                        onLayout={() => flatListRef.current?.scrollToEnd({ animated: true })}
                    />
                )}
            </View>
            <View style={styles.inputArea}>
                {isSessionFinished ? (
                    <View style={styles.sessionFinishedContainer}>
                        <Text style={styles.sessionFinishedText}>Сессия окончена</Text>
                        <TouchableOpacity style={styles.returnButton} onPress={onSessionEnd}>
                            <Text style={styles.returnButtonText}>Вернуться</Text>
                        </TouchableOpacity>
                    </View>
                ) : (
                    <View style={styles.inputContainer}>
                        <TextInput
                            style={styles.input}
                            placeholder="Напиши что нибудь"
                            placeholderTextColor={Colors.textSecondary}
                            value={input}
                            onChangeText={setInput}
                            multiline />
                        <TouchableOpacity
                            style={[styles.sendButton, !input.trim() && styles.sendButtonDisabled]}
                            onPress={sendMessage}
                            disabled={!input.trim() || isLoading}
                        >
                            {isLoading ? (
                                <ActivityIndicator color="white" size="small" />
                            ) : (
                                <Send size={20} color="white" />
                            )}
                        </TouchableOpacity>
                    </View>
                )}
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 16,
        margin: 10,
        marginHorizontal: 30,
        // marginTop: 26,
        borderBottomWidth: 1,
        borderBottomColor: Colors.border,
        backgroundColor: 'white',
        borderRadius: 12,
    },
    messagesList: {
        flex: 1,
        marginTop: 20,
    },
    headerInfo: {
        marginLeft: 12,
    },
    headerTitle: {
        fontSize: 18,
        fontWeight: '700',
        color: Colors.text,
    },
    onlineStatus: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 2,
    },
    onlineDot: {
        width: 8,
        height: 8,
        borderRadius: 4,
        backgroundColor: Colors.success,
        marginRight: 6,
    },
    onlineText: {
        fontSize: 12,
        color: Colors.textSecondary,
    },
    messageList: {
        padding: 16,
        paddingBottom: 32,
    },
    messageRow: {
        flexDirection: 'row',
        marginBottom: 20,
        maxWidth: '85%',
    },
    userRow: {
        alignSelf: 'flex-end',
        flexDirection: 'row-reverse',
    },
    aiRow: {
        alignSelf: 'flex-start',
    },
    aiAvatar: {
        width: 32,
        height: 32,
        borderRadius: 16,
        backgroundColor: Colors.primary,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 8,
        marginTop: 4,
    },
    messageBubble: {
        padding: 14,
        borderRadius: 20,
        elevation: 2,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 5,
        flexShrink: 1,
    },
    userBubble: {
        backgroundColor: Colors.primary,
        borderTopRightRadius: 4,
    },
    aiBubble: {
        backgroundColor: 'white',
        borderTopLeftRadius: 4,
    },
    messageText: {
        fontSize: 15,
        lineHeight: 22,
    },
    userText: {
        color: 'white',
    },
    aiText: {
        color: Colors.text,
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    loadingText: {
        marginTop: 12,
        color: Colors.textSecondary,
        fontSize: 16,
    },
    inputArea: {
        width: '100%',
        marginBottom: 8,
        padding: 16,
        paddingBottom: Platform.OS === 'ios' ? 0 : 16,
        // backgroundColor: 'white',
        // borderTopWidth: 1,
        borderTopColor: Colors.border,
        borderRadius: 10,
    },
    inputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: 'white',
        borderRadius: 25,
        paddingHorizontal: 16,
        paddingVertical: 8,
        borderWidth: 1,
        borderColor: Colors.border,
    },
    input: {
        flex: 1,
        fontSize: 16,
        color: Colors.text,
        maxHeight: 100,
        paddingTop: 8,
        paddingBottom: 8,
    },
    sendButton: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: Colors.primary,
        justifyContent: 'center',
        alignItems: 'center',
        marginLeft: 8,
    },
    sendButtonDisabled: {
        backgroundColor: Colors.textSecondary,
        opacity: 0.5,
    },
    sessionFinishedContainer: {
        alignItems: 'center',
        paddingVertical: 10,
    },
    sessionFinishedText: {
        fontSize: 16,
        color: Colors.textSecondary,
        marginBottom: 12,
        fontWeight: '600',
    },
    returnButton: {
        backgroundColor: Colors.primary,
        paddingVertical: 12,
        paddingHorizontal: 24,
        borderRadius: 20,
    },
    returnButtonText: {
        color: 'white',
        fontWeight: '700',
        fontSize: 16,
    },
});


