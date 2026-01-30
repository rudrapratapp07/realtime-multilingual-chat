import React, { useState, useEffect, useRef } from 'react';
import { Layout, List, Avatar, Input, Button, Typography, Space, Badge, Spin, Select, message, Tooltip } from 'antd';
import {
  SendOutlined,
  UserOutlined,
  LogoutOutlined,
  GlobalOutlined,
  CheckCircleOutlined
} from '@ant-design/icons';
import { useAuth } from '../context/AuthContext';
import { usersAPI, messagesAPI } from '../services/api';
import socketService from '../services/socket';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';

dayjs.extend(relativeTime);

const { Header, Sider, Content } = Layout;
const { Text, Title } = Typography;
const { TextArea } = Input;
const { Option } = Select;

const LANGUAGES = [
  { code: 'en', name: 'English', flag: '🇬🇧' },
  { code: 'es', name: 'Spanish', flag: '🇪🇸' },
  { code: 'fr', name: 'French', flag: '🇫🇷' },
  { code: 'de', name: 'German', flag: '🇩🇪' },
  { code: 'zh', name: 'Chinese', flag: '🇨🇳' },
  { code: 'ja', name: 'Japanese', flag: '🇯🇵' },
  { code: 'ar', name: 'Arabic', flag: '🇸🇦' },
  { code: 'hi', name: 'Hindi', flag: '🇮🇳' },
  { code: 'pt', name: 'Portuguese', flag: '🇵🇹' },
  { code: 'ru', name: 'Russian', flag: '🇷🇺' },
  { code: 'ko', name: 'Korean', flag: '🇰🇷' },
  { code: 'it', name: 'Italian', flag: '🇮🇹' }
];

const Chat = () => {
  const { user, logout, updateLanguage } = useAuth();
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [messages, setMessages] = useState([]);
  const [messageInput, setMessageInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [sending, setSending] = useState(false);
  const [typingUsers, setTypingUsers] = useState(new Set());
  const [onlineUsers, setOnlineUsers] = useState(new Set());

  const messagesEndRef = useRef(null);
  const typingTimeoutRef = useRef(null);

  // Fetch users on mount
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const { data } = await usersAPI.getUsers();
        setUsers(data.users);

        // Set online users
        const online = new Set(
          data.users.filter(u => u.status === 'online').map(u => u._id)
        );
        setOnlineUsers(online);
      } catch (error) {
        console.error('Error fetching users:', error);
        message.error('Failed to load users');
      }
    };

    fetchUsers();
  }, []);

  // Setup socket listeners
  useEffect(() => {
    // Message received
    const handleMessageReceived = (msg) => {
      if (
        selectedUser &&
        (msg.sender._id === selectedUser._id || msg.receiver._id === selectedUser._id)
      ) {
        setMessages(prev => [...prev, msg]);

        // Mark as read if not own message
        if (!msg.isOwnMessage) {
          socketService.markMessageRead(msg._id, msg.sender._id);
        }
      }
    };

    // Typing indicators
    const handleTypingStart = ({ userId, user: typingUser }) => {
      if (selectedUser && userId === selectedUser._id) {
        setTypingUsers(prev => new Set(prev).add(userId));
      }
    };

    const handleTypingStop = ({ userId }) => {
      setTypingUsers(prev => {
        const newSet = new Set(prev);
        newSet.delete(userId);
        return newSet;
      });
    };

    // User status changes
    const handleUserOnline = ({ userId }) => {
      setOnlineUsers(prev => new Set(prev).add(userId));
    };

    const handleUserOffline = ({ userId }) => {
      setOnlineUsers(prev => {
        const newSet = new Set(prev);
        newSet.delete(userId);
        return newSet;
      });
    };

    socketService.on('message:received', handleMessageReceived);
    socketService.on('typing:start', handleTypingStart);
    socketService.on('typing:stop', handleTypingStop);
    socketService.on('user:online', handleUserOnline);
    socketService.on('user:offline', handleUserOffline);

    return () => {
      socketService.off('message:received', handleMessageReceived);
      socketService.off('typing:start', handleTypingStart);
      socketService.off('typing:stop', handleTypingStop);
      socketService.off('user:online', handleUserOnline);
      socketService.off('user:offline', handleUserOffline);
    };
  }, [selectedUser]);

  // Load messages when user is selected
  useEffect(() => {
    const loadMessages = async () => {
      if (!selectedUser) return;

      setLoading(true);
      try {
        const { data } = await messagesAPI.getMessages(selectedUser._id);
        setMessages(data.messages);
      } catch (error) {
        console.error('Error loading messages:', error);
        message.error('Failed to load messages');
      }
      setLoading(false);
    };

    if (selectedUser) {
      loadMessages();
      socketService.joinRoom(selectedUser._id);
    }
  }, [selectedUser]);

  // Scroll to bottom on new messages
  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async () => {
    if (!messageInput.trim() || !selectedUser || sending) return;

    const text = messageInput.trim();
    setMessageInput('');
    setSending(true);

    try {
      socketService.sendMessage(selectedUser._id, text);
      socketService.stopTyping(selectedUser._id);
    } catch (error) {
      console.error('Error sending message:', error);
      message.error('Failed to send message');
    }

    setSending(false);
  };

  const handleInputChange = (e) => {
    setMessageInput(e.target.value);

    if (selectedUser) {
      socketService.startTyping(selectedUser._id);

      // Clear existing timeout
      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current);
      }

      // Set new timeout to stop typing
      typingTimeoutRef.current = setTimeout(() => {
        socketService.stopTyping(selectedUser._id);
      }, 1000);
    }
  };

  const handleLanguageChange = async (langCode) => {
    const result = await updateLanguage(langCode);
    if (result.success) {
      message.success('Language updated successfully');
    } else {
      message.error('Failed to update language');
    }
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const renderMessage = (msg) => {
    const isOwnMessage = msg.sender._id === (user._id || user.id);
    const displayText = isOwnMessage ? msg.originalText : msg.translatedText;
    const language = isOwnMessage ? msg.originalLanguage : msg.targetLanguage;

    return (
      <div
        key={msg._id}
        style={{
          display: 'flex',
          justifyContent: isOwnMessage ? 'flex-end' : 'flex-start',
          marginBottom: 16
        }}
      >
        <div
          style={{
            maxWidth: '70%',
            padding: '10px 14px',
            borderRadius: 12,
            background: isOwnMessage ? '#1890ff' : '#f0f0f0',
            color: isOwnMessage ? 'white' : 'black'
          }}
        >
          <div style={{ marginBottom: 4 }}>
            {displayText}
          </div>
          <div style={{
            fontSize: 11,
            opacity: 0.7,
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            gap: 8
          }}>
            <span>
              {LANGUAGES.find(l => l.code === language)?.flag} {' '}
              {dayjs(msg.createdAt).format('HH:mm')}
            </span>
            {isOwnMessage && msg.read && (
              <CheckCircleOutlined style={{ fontSize: 12 }} />
            )}
          </div>

          {!isOwnMessage && msg.originalText !== msg.translatedText && (
            <Tooltip title={`Original (${msg.originalLanguage}): ${msg.originalText}`}>
              <div style={{
                fontSize: 10,
                marginTop: 4,
                fontStyle: 'italic',
                opacity: 0.6,
                cursor: 'help'
              }}>
                Translated from {msg.originalLanguage}
              </div>
            </Tooltip>
          )}
        </div>
      </div>
    );
  };

  return (
    <Layout style={{ height: '100vh' }}>
      <Header style={{
        background: 'white',
        padding: '0 24px',
        borderBottom: '1px solid #f0f0f0',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center'
      }}>
        <Title level={3} style={{ margin: 0 }}>
          🌍 Multilingual Chat
        </Title>

        <Space size="large">
          <Select
            value={user?.preferredLanguage}
            onChange={handleLanguageChange}
            style={{ width: 150 }}
            suffixIcon={<GlobalOutlined />}
          >
            {LANGUAGES.map(lang => (
              <Option key={lang.code} value={lang.code}>
                {lang.flag} {lang.name}
              </Option>
            ))}
          </Select>

          <Space>
            <Avatar icon={<UserOutlined />} />
            <Text strong>{user?.username}</Text>
          </Space>

          <Button
            icon={<LogoutOutlined />}
            onClick={logout}
            type="text"
          >
            Logout
          </Button>
        </Space>
      </Header>

      <Layout>
        <Sider
          width={300}
          style={{ background: 'white', borderRight: '1px solid #f0f0f0' }}
        >
          <div style={{ padding: 16 }}>
            <Title level={5}>Contacts</Title>
          </div>

          <List
            dataSource={users}
            renderItem={(item) => (
              <List.Item
                onClick={() => setSelectedUser(item)}
                style={{
                  cursor: 'pointer',
                  background: selectedUser?._id === item._id ? '#e6f7ff' : 'white',
                  padding: '12px 16px'
                }}
              >
                <List.Item.Meta
                  avatar={
                    <Badge
                      dot
                      status={onlineUsers.has(item._id) ? 'success' : 'default'}
                    >
                      <Avatar icon={<UserOutlined />} />
                    </Badge>
                  }
                  title={item.username}
                  description={
                    <Text type="secondary" style={{ fontSize: 12 }}>
                      {LANGUAGES.find(l => l.code === item.preferredLanguage)?.flag}{' '}
                      {LANGUAGES.find(l => l.code === item.preferredLanguage)?.name}
                    </Text>
                  }
                />
              </List.Item>
            )}
          />
        </Sider>

        <Content style={{ display: 'flex', flexDirection: 'column' }}>
          {selectedUser ? (
            <>
              <div style={{
                padding: 16,
                borderBottom: '1px solid #f0f0f0',
                background: 'white'
              }}>
                <Space>
                  <Avatar icon={<UserOutlined />} />
                  <div>
                    <Text strong>{selectedUser.username}</Text>
                    <br />
                    <Text type="secondary" style={{ fontSize: 12 }}>
                      {LANGUAGES.find(l => l.code === selectedUser.preferredLanguage)?.flag}{' '}
                      {LANGUAGES.find(l => l.code === selectedUser.preferredLanguage)?.name}
                      {onlineUsers.has(selectedUser._id) && ' • Online'}
                    </Text>
                  </div>
                </Space>
              </div>

              <div style={{
                flex: 1,
                overflowY: 'auto',
                padding: 24,
                background: '#fafafa'
              }}>
                {loading ? (
                  <div style={{ textAlign: 'center', paddingTop: 50 }}>
                    <Spin size="large" />
                  </div>
                ) : (
                  <>
                    {messages.map(renderMessage)}
                    {typingUsers.has(selectedUser._id) && (
                      <div style={{ marginTop: 8 }}>
                        <Text type="secondary" style={{ fontSize: 12 }}>
                          {selectedUser.username} is typing...
                        </Text>
                      </div>
                    )}
                    <div ref={messagesEndRef} />
                  </>
                )}
              </div>

              <div style={{
                padding: 16,
                borderTop: '1px solid #f0f0f0',
                background: 'white'
              }}>
                <Space.Compact style={{ width: '100%' }}>
                  <TextArea
                    value={messageInput}
                    onChange={handleInputChange}
                    onPressEnter={(e) => {
                      if (!e.shiftKey) {
                        e.preventDefault();
                        handleSendMessage();
                      }
                    }}
                    placeholder="Type a message..."
                    autoSize={{ minRows: 1, maxRows: 4 }}
                    style={{ flex: 1 }}
                  />
                  <Button
                    type="primary"
                    icon={<SendOutlined />}
                    onClick={handleSendMessage}
                    loading={sending}
                    disabled={!messageInput.trim()}
                  >
                    Send
                  </Button>
                </Space.Compact>
              </div>
            </>
          ) : (
            <div style={{
              flex: 1,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              background: '#fafafa'
            }}>
              <div style={{ textAlign: 'center' }}>
                <Title level={3} type="secondary">
                  Select a contact to start chatting
                </Title>
                <Text type="secondary">
                  Messages will be automatically translated to each user's preferred language
                </Text>
              </div>
            </div>
          )}
        </Content>
      </Layout>
    </Layout>
  );
};

export default Chat;
