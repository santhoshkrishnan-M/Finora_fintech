'use client';

import { useState, useEffect, useRef } from 'react';
import { useTranslations } from 'next-intl';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { useAuthStore } from '@/store/authStore';
import { useLanguageStore } from '@/store/languageStore';
import { fridayApi } from '@/lib/api';

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

export default function FRIDAYChat() {
  const t = useTranslations();
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [starterQuestions, setStarterQuestions] = useState<string[]>([]);
  const [loadingStarters, setLoadingStarters] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  const { token } = useAuthStore();
  const { locale: language } = useLanguageStore();

  useEffect(() => {
    if (isOpen && starterQuestions.length === 0 && token) {
      loadStarterQuestions();
    }
  }, [isOpen]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const loadStarterQuestions = async () => {
    setLoadingStarters(true);
    try {
      const response = await fridayApi.getStarterQuestions(token!, language);
      setStarterQuestions(response.questions || []);
    } catch (error) {
      console.error('Failed to load starter questions:', error);
    } finally {
      setLoadingStarters(false);
    }
  };

  const handleSendMessage = async (messageText?: string) => {
    const textToSend = messageText || inputMessage.trim();
    if (!textToSend || !token) return;

    const userMessage: Message = { role: 'user', content: textToSend };
    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');
    setIsLoading(true);

    try {
      const response = await fridayApi.chat(
        token,
        textToSend,
        messages,
        language
      );

      const assistantMessage: Message = {
        role: 'assistant',
        content: response.response
      };
      setMessages(prev => [...prev, assistantMessage]);
    } catch (error) {
      console.error('Failed to get FRIDAY response:', error);
      const errorMessage: Message = {
        role: 'assistant',
        content: t('friday.errorMessage')
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleStarterClick = (question: string) => {
    handleSendMessage(question);
  };

  return (
    <>
      {/* Floating Button */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="fixed bottom-6 right-6 bg-primary text-white px-6 py-3 rounded-full shadow-lg hover:shadow-xl transition-all font-semibold z-50"
        >
          {t('friday.buttonLabel')}
        </button>
      )}

      {/* Chat Panel */}
      {isOpen && (
        <div className="fixed bottom-6 right-6 w-96 h-[600px] z-50 shadow-2xl">
          <Card className="h-full flex flex-col">
            <CardHeader className="bg-primary text-white rounded-t-lg">
              <div className="flex justify-between items-center">
                <CardTitle>{t('friday.title')}</CardTitle>
                <button
                  onClick={() => setIsOpen(false)}
                  className="text-white hover:text-gray-200"
                >
                  {t('friday.close')}
                </button>
              </div>
              <p className="text-xs text-gray-100 mt-1">
                {t('friday.subtitle')}
              </p>
            </CardHeader>

            <CardContent className="flex-1 flex flex-col p-4 overflow-hidden">
              {/* Messages Area */}
              <div className="flex-1 overflow-y-auto mb-4 space-y-3">
                {messages.length === 0 && !loadingStarters && (
                  <div className="text-center text-gray-500 text-sm mt-4">
                    <p className="mb-4">{t('friday.greeting')}</p>
                    <p className="mb-2">{t('friday.askPrompt')}</p>
                  </div>
                )}

                {/* Starter Questions */}
                {messages.length === 0 && starterQuestions.length > 0 && (
                  <div className="space-y-2">
                    {starterQuestions.map((question, idx) => (
                      <button
                        key={idx}
                        onClick={() => handleStarterClick(question)}
                        className="w-full text-left p-3 text-sm bg-gray-50 hover:bg-gray-100 rounded-lg border border-gray-200 transition-colors"
                      >
                        {question}
                      </button>
                    ))}
                  </div>
                )}

                {loadingStarters && (
                  <div className="text-center text-gray-400 text-sm">
                    {t('friday.loadingSuggestions')}
                  </div>
                )}

                {/* Messages */}
                {messages.map((msg, idx) => (
                  <div
                    key={idx}
                    className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                  >
                    <div
                      className={`max-w-[80%] p-3 rounded-lg text-sm ${
                        msg.role === 'user'
                          ? 'bg-primary text-white'
                          : 'bg-gray-100 text-gray-800'
                      }`}
                    >
                      {msg.content}
                    </div>
                  </div>
                ))}

                {isLoading && (
                  <div className="flex justify-start">
                    <div className="bg-gray-100 text-gray-800 p-3 rounded-lg text-sm">
                      {t('friday.thinking')}
                    </div>
                  </div>
                )}

                <div ref={messagesEndRef} />
              </div>

              {/* Input Area */}
              <div className="flex gap-2">
                <Input
                  value={inputMessage}
                  onChange={(e) => setInputMessage(e.target.value)}
                  onKeyPress={(e) => {
                    if (e.key === 'Enter' && !isLoading) {
                      handleSendMessage();
                    }
                  }}
                  placeholder={t('friday.placeholder')}
                  disabled={isLoading}
                  className="flex-1"
                />
                <Button
                  onClick={() => handleSendMessage()}
                  disabled={isLoading || !inputMessage.trim()}
                >
                  {t('friday.send')}
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </>
  );
}
