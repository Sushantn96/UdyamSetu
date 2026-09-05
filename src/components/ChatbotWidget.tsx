import React, { useState, useEffect, useRef } from 'react';
import { 
  MessageSquare, X, Send, Mic, MicOff, Volume2, VolumeX, 
  Bot, User, Sparkles, Building2, Phone, HelpCircle, ChevronDown, 
  ExternalLink, ArrowUpRight 
} from 'lucide-react';
import { UserProfile, FeasibilityReport, Language } from '../types';
import { AshokaChakraIcon } from './EmblemIcon';

interface ChatMessage {
  id: string;
  sender: 'bot' | 'user';
  text: string;
  timestamp: string;
}

interface ChatbotWidgetProps {
  isOpen: boolean;
  onToggle: () => void;
  userProfile: UserProfile;
  feasibilityReport: FeasibilityReport | null;
  language: Language;
}

export const ChatbotWidget: React.FC<ChatbotWidgetProps> = ({
  isOpen,
  onToggle,
  userProfile,
  feasibilityReport,
  language
}) => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'msg_welcome',
      sender: 'bot',
      text: language === 'hi'
        ? `नमस्ते ${userProfile.name}! मैं आपका 'उद्यम मित्र' (AI Sahayak) हूँ। आप मुझसे अपने व्यवसाय, मोराटोरियम अवधि, ऋण पात्रता (₹${userProfile.marginCapital.toLocaleString('en-IN')} पूंजी) अथवा आवश्यक दस्तावेजों के बारे में पूछ सकते हैं।`
        : `Namaste ${userProfile.name}! I am "Udyam Mitra", your MoSJE AI Advisory Assistant. Ask me about your business feasibility in ${userProfile.location.block}, moratorium benefits, loan eligibility, or scheme documents.`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }
  ]);
  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [speakingMsgId, setSpeakingMsgId] = useState<string | null>(null);
  const [showEscalationModal, setShowEscalationModal] = useState(false);
  const [noticeMessage, setNoticeMessage] = useState<string | null>(null);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const recognitionRef = useRef<any>(null);

  const showNotice = (text: string) => {
    setNoticeMessage(text);
    setTimeout(() => setNoticeMessage(null), 4000);
  };

  // Quick prompt chips
  const quickPrompts = [
    {
      en: "Explain the moratorium period in simple terms",
      hi: "मोराटोरियम (अवकाश अवधि) क्या है और मुझे क्या लाभ है?"
    },
    {
      en: "What if I have ₹80,000 margin capital instead?",
      hi: "यदि मेरा अंशदान ₹80,000 हो तो कितना ऋण मिलेगा?"
    },
    {
      en: "What documents do I need to submit to the bank?",
      hi: "बैंक में जमा करने हेतु कौन से दस्तावेज चाहिए?"
    },
    {
      en: `Can I do Poultry instead of ${userProfile.businessCategory}?`,
      hi: "क्या मैं इस स्थान पर पोल्ट्री (कुक्कुट) फार्म शुरू कर सकता हूँ?"
    }
  ];

  // Auto-scroll to bottom safely
  useEffect(() => {
    try {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    } catch {
      // Ignore scroll errors in sandboxed iframes
    }
  }, [messages, isTyping]);

  // Clean up any speech or recognition when unmounting
  useEffect(() => {
    return () => {
      if (recognitionRef.current) {
        try {
          recognitionRef.current.stop();
        } catch {
          // ignore
        }
      }
      if (typeof window !== 'undefined' && window.speechSynthesis) {
        try {
          window.speechSynthesis.cancel();
        } catch {
          // ignore
        }
      }
    };
  }, []);

  const toggleListening = () => {
    try {
      if (typeof window === 'undefined') return;
      const SpeechRec = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      if (!SpeechRec) {
        showNotice(language === 'hi' ? 'आपके ब्राउज़र में वॉइस इनपुट समर्थित नहीं है।' : 'Voice input is not supported in this browser.');
        return;
      }

      if (isListening && recognitionRef.current) {
        try {
          recognitionRef.current.stop();
        } catch {
          // ignore
        }
        setIsListening(false);
        return;
      }

      const recognition = new SpeechRec();
      recognition.continuous = false;
      recognition.interimResults = false;
      recognition.lang = language === 'hi' ? 'hi-IN' : 'en-IN';

      recognition.onresult = (event: any) => {
        const transcript = event.results?.[0]?.[0]?.transcript;
        if (transcript) {
          setInputText(transcript);
        }
        setIsListening(false);
      };

      recognition.onerror = (e: any) => {
        console.warn('Speech recognition status:', e);
        setIsListening(false);
      };

      recognition.onend = () => {
        setIsListening(false);
      };

      recognitionRef.current = recognition;
      setIsListening(true);
      recognition.start();
    } catch (err) {
      console.warn('Speech recognition unavailable:', err);
      setIsListening(false);
      showNotice(language === 'hi' ? 'माइक्रोफ़ोन अनुमति उपलब्ध नहीं है।' : 'Microphone access is unavailable.');
    }
  };

  // Text to Speech
  const toggleSpeech = (msg: ChatMessage) => {
    try {
      if (typeof window === 'undefined' || !window.speechSynthesis) {
        showNotice(language === 'hi' ? 'ध्वनि वाचन आपके ब्राउज़र में समर्थित नहीं है।' : 'Text to speech is not supported in this browser.');
        return;
      }

      if (speakingMsgId === msg.id) {
        window.speechSynthesis.cancel();
        setSpeakingMsgId(null);
      } else {
        window.speechSynthesis.cancel();
        const utterance = new SpeechSynthesisUtterance(msg.text);
        utterance.lang = language === 'hi' ? 'hi-IN' : 'en-IN';
        utterance.onend = () => setSpeakingMsgId(null);
        utterance.onerror = () => setSpeakingMsgId(null);
        setSpeakingMsgId(msg.id);
        window.speechSynthesis.speak(utterance);
      }
    } catch (err) {
      console.warn('Speech synthesis error:', err);
      setSpeakingMsgId(null);
    }
  };

  const handleSendMessage = async (textToSend?: string) => {
    const query = textToSend || inputText;
    if (!query.trim()) return;

    const userMsg: ChatMessage = {
      id: `usr_${Date.now()}`,
      sender: 'user',
      text: query,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages((prev) => [...prev, userMsg]);
    if (!textToSend) setInputText('');
    setIsTyping(true);

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: query,
          userProfile,
          feasibilityData: feasibilityReport,
          language
        })
      });

      const data = await res.json();
      const botText = data.reply || (language === 'hi'
        ? "माफ करें, मैं इस समय उत्तर देने में असमर्थ हूँ। कृपया पुनः प्रयास करें।"
        : "I apologize, but I could not process your query at this moment. Please try again.");

      const botMsg: ChatMessage = {
        id: `bot_${Date.now()}`,
        sender: 'bot',
        text: botText,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };

      setMessages((prev) => [...prev, botMsg]);
    } catch (err) {
      console.error("Chatbot fetch error:", err);
      setMessages((prev) => [
        ...prev,
        {
          id: `bot_err_${Date.now()}`,
          sender: 'bot',
          text: language === 'hi'
            ? "नेटवर्क त्रुटि। कृपया इंटरनेट कनेक्शन जांचें या DIC अधिकारी से संपर्क करें।"
            : "Network error. Please check connectivity or escalate to a District Industries Centre officer.",
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }
      ]);
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <>
      {/* Floating Trigger Button at bottom-right */}
      {!isOpen && (
        <div className="fixed bottom-5 right-5 z-50">
          <button
            onClick={onToggle}
            className="flex items-center gap-2.5 bg-slate-900 text-white p-3.5 sm:px-4 sm:py-3 rounded-full shadow-lg hover:shadow-xl hover:bg-slate-800 transition-all border border-slate-700 group"
            id="open-chatbot-btn"
            aria-label="Open Udyam Mitra AI Sahayak"
          >
            <div className="relative">
              <AshokaChakraIcon className="w-6 h-6 text-amber-400 animate-spin-slow" />
              <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-emerald-500 rounded-full ring-2 ring-slate-900"></span>
            </div>
            <div className="hidden sm:flex flex-col text-left">
              <span className="text-xs font-semibold leading-tight text-white flex items-center gap-1">
                <span>उद्यम मित्र (AI Sahayak)</span>
              </span>
              <span className="text-[10px] text-amber-400 font-medium">
                {language === 'hi' ? 'तुरंत व्यावसायिक सलाह' : 'Ask Local Advisory'}
              </span>
            </div>
          </button>
        </div>
      )}

      {/* Expanded Chatbot Drawer/Window */}
      {isOpen && (
        <div
          className="fixed bottom-0 right-0 sm:bottom-5 sm:right-5 w-full sm:w-96 md:w-[420px] h-[550px] sm:h-[600px] max-h-[90vh] bg-white sm:rounded-2xl shadow-xl border border-slate-200 flex flex-col z-50 overflow-hidden font-sans"
          id="chatbot-window"
        >
          {/* Chatbot Header */}
          <div className="bg-slate-900 text-white p-3.5 border-b border-slate-800 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="p-1.5 rounded-full bg-white/10 text-amber-400">
                <AshokaChakraIcon className="w-5 h-5 text-amber-400" />
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <h3 className="text-sm font-semibold text-white">उद्यम मित्र • AI Sahayak</h3>
                  <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
                </div>
                <p className="text-[10px] text-slate-400">
                  MoSJE Digital Advisor for {userProfile.location.block}, {userProfile.location.district}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-1">
              <button
                onClick={() => setShowEscalationModal(true)}
                className="text-[11px] bg-white/10 hover:bg-white/20 text-amber-400 font-medium px-2 py-1 rounded-md transition"
                title="Connect with DIC Officer"
              >
                DIC Help
              </button>
              <button
                onClick={onToggle}
                className="p-1 text-slate-400 hover:text-white rounded hover:bg-white/10"
                aria-label="Close Chat"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Quick Prompts Chips */}
          <div className="bg-slate-50/80 border-b border-slate-200 p-2 overflow-x-auto flex gap-1.5 text-[11px] whitespace-nowrap scrollbar-none">
            {quickPrompts.map((qp, idx) => (
              <button
                key={idx}
                onClick={() => handleSendMessage(language === 'hi' ? qp.hi : qp.en)}
                className="bg-white hover:bg-slate-100 text-slate-700 hover:text-slate-900 px-2.5 py-1 rounded-full border border-slate-200 transition shrink-0 shadow-2xs font-medium"
              >
                {language === 'hi' ? qp.hi : qp.en}
              </button>
            ))}
          </div>

          {/* Messages Container */}
          <div className="flex-1 p-4 overflow-y-auto space-y-3 bg-slate-50/60">
            {messages.map((msg) => {
              const isBot = msg.sender === 'bot';
              return (
                <div
                  key={msg.id}
                  className={`flex items-start gap-2 ${isBot ? 'justify-start' : 'justify-end'}`}
                >
                  {isBot && (
                    <div className="w-7 h-7 rounded-full bg-slate-100 border border-slate-200 text-slate-700 flex items-center justify-center shrink-0 text-xs shadow-2xs mt-0.5">
                      <Bot className="w-4 h-4" />
                    </div>
                  )}

                  <div
                    className={`max-w-[82%] p-3 rounded-xl text-xs leading-relaxed shadow-2xs ${
                      isBot
                        ? 'bg-white text-slate-800 border border-slate-200 rounded-tl-xs'
                        : 'bg-slate-900 text-white rounded-tr-xs'
                    }`}
                  >
                    <p className="whitespace-pre-line">{msg.text}</p>
                    <div
                      className={`flex items-center justify-between gap-2 mt-1.5 pt-1 border-t text-[10px] ${
                        isBot ? 'border-slate-100 text-slate-400' : 'border-slate-800 text-slate-300'
                      }`}
                    >
                      <span>{msg.timestamp}</span>
                      {isBot && (
                        <button
                          onClick={() => toggleSpeech(msg)}
                          className="hover:text-slate-900 flex items-center gap-0.5 font-medium"
                          title="Read message aloud"
                        >
                          {speakingMsgId === msg.id ? (
                            <VolumeX className="w-3 h-3 text-rose-600" />
                          ) : (
                            <Volume2 className="w-3 h-3" />
                          )}
                          <span>{speakingMsgId === msg.id ? 'Stop' : 'Listen'}</span>
                        </button>
                      )}
                    </div>
                  </div>

                  {!isBot && (
                    <div className="w-7 h-7 rounded-full bg-slate-800 text-amber-400 flex items-center justify-center shrink-0 text-xs shadow-2xs mt-0.5 font-bold">
                      <User className="w-4 h-4" />
                    </div>
                  )}
                </div>
              );
            })}

            {isTyping && (
              <div className="flex items-center gap-2 text-slate-500 text-xs pl-2">
                <div className="w-6 h-6 rounded-full bg-slate-900 text-amber-400 flex items-center justify-center text-[10px]">
                  <Sparkles className="w-3.5 h-3.5 animate-spin" />
                </div>
                <div className="bg-white px-3 py-2 rounded-xl border border-slate-200 text-slate-600 flex items-center gap-1 shadow-2xs">
                  <span>Udyam Mitra is formulating advisory</span>
                  <span className="animate-pulse">...</span>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* In-app notice banner (safely replaces iframe alert calls) */}
          {noticeMessage && (
            <div className="bg-amber-50 border-t border-amber-200 px-3 py-1.5 text-[11px] text-amber-900 flex items-center justify-between font-medium">
              <span>{noticeMessage}</span>
              <button onClick={() => setNoticeMessage(null)} className="text-amber-700 hover:text-amber-950 font-bold ml-2 text-xs">
                ✕
              </button>
            </div>
          )}

          {/* Chat Input Bar */}
          <div className="p-2.5 bg-white border-t border-slate-200">
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSendMessage();
              }}
              className="flex items-center gap-1.5"
            >
              {/* Voice Input Button */}
              <button
                type="button"
                onClick={toggleListening}
                className={`p-2 rounded-full border transition ${
                  isListening
                    ? 'bg-rose-500 text-white border-rose-600 animate-pulse'
                    : 'bg-slate-100 text-slate-700 border-slate-200 hover:bg-slate-200'
                }`}
                title={isListening ? 'Listening... Speak now' : 'Voice Input (Speech-to-Text)'}
                id="chatbot-mic-btn"
              >
                {isListening ? <Mic className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
              </button>

              <input
                type="text"
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                placeholder={
                  isListening
                    ? 'Listening... बोलिए...'
                    : language === 'hi'
                    ? 'अपना प्रश्न यहाँ लिखें...'
                    : 'Type your advisory question...'
                }
                className="flex-1 px-3 py-2 text-xs border border-slate-200 rounded-full focus:ring-1 focus:ring-slate-900 focus:outline-hidden text-slate-900"
                id="chatbot-input-field"
              />

              <button
                type="submit"
                disabled={!inputText.trim()}
                className="p-2 bg-slate-900 hover:bg-slate-800 disabled:opacity-40 text-white rounded-full transition shadow-xs"
                id="chatbot-send-btn"
              >
                <Send className="w-4 h-4" />
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Escalation to DIC Officer Modal */}
      {showEscalationModal && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl max-w-md w-full p-6 shadow-xl border border-slate-200 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-200 pb-3">
              <div className="flex items-center gap-2">
                <Building2 className="w-5 h-5 text-slate-700" />
                <h3 className="text-sm font-semibold text-slate-900">
                  District Industries Centre (DIC) Escalation
                </h3>
              </div>
              <button
                onClick={() => setShowEscalationModal(false)}
                className="text-slate-400 hover:text-slate-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3 text-xs text-slate-700">
              <p>
                For official file tracking, on-ground site inspections, and physical document submission, please contact your designated district nodal officer:
              </p>

              <div className="bg-slate-50/80 p-3.5 rounded-lg border border-slate-200 space-y-2 font-medium">
                <p><strong>Designated Office:</strong> District Industries Centre, {userProfile.location.district}</p>
                <p><strong>Jurisdiction:</strong> {userProfile.location.block} Block & Gram Panchayats</p>
                <p><strong>Nodal Officer:</strong> General Manager (DIC) / Lead District Manager (LDM)</p>
                <p><strong>MoSJE Toll-Free Helpline:</strong> 1800-11-2001 (Mon–Sat, 9:30 AM to 6:00 PM)</p>
                <p><strong>State Channelising Agency (SCA):</strong> UP Backward Classes Welfare Dept / SC Finance Corp</p>
              </div>

              <div className="p-2.5 bg-slate-100 rounded-md border border-slate-200 text-slate-800 text-[11px]">
                Tip: Carry your printed <strong>Detailed Project Appraisal Report (DPR)</strong> and 6 passport photos when visiting the branch.
              </div>
            </div>

            <div className="flex justify-end pt-2">
              <button
                onClick={() => setShowEscalationModal(false)}
                className="bg-slate-900 text-white text-xs font-medium px-4 py-2 rounded-md hover:bg-slate-800 transition shadow-2xs"
              >
                Close & Return to Chat
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
