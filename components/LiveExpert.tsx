import React, { useEffect, useRef, useState } from 'react';
import { GoogleGenAI, LiveServerMessage, Modality } from '@google/genai';
import { LucideMic, LucideMicOff, LucideLoader2 } from 'lucide-react';

interface LiveExpertProps {
  onClose: () => void;
  language: 'EN' | 'HA';
}

// Helpers for audio processing
function createBlob(data: Float32Array): { data: string; mimeType: string } {
  const l = data.length;
  const int16 = new Int16Array(l);
  for (let i = 0; i < l; i++) {
    int16[i] = data[i] * 32768;
  }
  
  let binary = '';
  const bytes = new Uint8Array(int16.buffer);
  const len = bytes.byteLength;
  for (let i = 0; i < len; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  const base64 = btoa(binary);

  return {
    data: base64,
    mimeType: 'audio/pcm;rate=16000',
  };
}

function decode(base64: string) {
  const binaryString = atob(base64);
  const len = binaryString.length;
  const bytes = new Uint8Array(len);
  for (let i = 0; i < len; i++) {
    bytes[i] = binaryString.charCodeAt(i);
  }
  return bytes;
}

async function decodeAudioData(
  data: Uint8Array,
  ctx: AudioContext,
  sampleRate: number,
  numChannels: number,
): Promise<AudioBuffer> {
  const dataInt16 = new Int16Array(data.buffer);
  const frameCount = dataInt16.length / numChannels;
  const buffer = ctx.createBuffer(numChannels, frameCount, sampleRate);

  for (let channel = 0; channel < numChannels; channel++) {
    const channelData = buffer.getChannelData(channel);
    for (let i = 0; i < frameCount; i++) {
      channelData[i] = dataInt16[i * numChannels + channel] / 32768.0;
    }
  }
  return buffer;
}

const LiveExpert: React.FC<LiveExpertProps> = ({ onClose, language }) => {
  const [active, setActive] = useState(false);
  const [status, setStatus] = useState("Initializing...");
  
  // Refs for audio handling
  const nextStartTime = useRef(0);
  const audioContextRef = useRef<AudioContext | null>(null);
  const inputContextRef = useRef<AudioContext | null>(null);
  const sourcesRef = useRef<Set<AudioBufferSourceNode>>(new Set());
  const sessionPromiseRef = useRef<Promise<any> | null>(null);

  const startSession = async () => {
    try {
      setActive(true);
      setStatus("Connecting...");
      
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      
      const inputCtx = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 16000 });
      const outputCtx = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 24000 });
      
      inputContextRef.current = inputCtx;
      audioContextRef.current = outputCtx;

      const outputNode = outputCtx.createGain();
      outputNode.connect(outputCtx.destination); // Ensure output is connected
      
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });

      const sessionPromise = ai.live.connect({
        model: 'gemini-2.5-flash-native-audio-preview-12-2025',
        callbacks: {
          onopen: () => {
            setStatus(language === 'HA' ? "An Haɗa (Connected)" : "Connected");
            
            const source = inputCtx.createMediaStreamSource(stream);
            const scriptProcessor = inputCtx.createScriptProcessor(4096, 1, 1);
            
            scriptProcessor.onaudioprocess = (e) => {
              const inputData = e.inputBuffer.getChannelData(0);
              const pcmBlob = createBlob(inputData);
              sessionPromise.then(session => {
                 session.sendRealtimeInput({ media: pcmBlob });
              });
            };
            
            source.connect(scriptProcessor);
            scriptProcessor.connect(inputCtx.destination);
          },
          onmessage: async (message: LiveServerMessage) => {
             const base64Audio = message.serverContent?.modelTurn?.parts[0]?.inlineData?.data;
             if (base64Audio) {
                 if (outputCtx.state === 'suspended') await outputCtx.resume();
                 
                 nextStartTime.current = Math.max(nextStartTime.current, outputCtx.currentTime);
                 
                 const audioBuffer = await decodeAudioData(
                     decode(base64Audio),
                     outputCtx,
                     24000,
                     1
                 );
                 
                 const source = outputCtx.createBufferSource();
                 source.buffer = audioBuffer;
                 source.connect(outputNode);
                 source.addEventListener('ended', () => {
                     sourcesRef.current.delete(source);
                 });
                 
                 source.start(nextStartTime.current);
                 nextStartTime.current += audioBuffer.duration;
                 sourcesRef.current.add(source);
             }
          },
          onclose: () => {
              setStatus("Disconnected");
              setActive(false);
          },
          onerror: (e) => {
              console.error(e);
              setStatus("Error connection");
          }
        },
        config: {
            responseModalities: [Modality.AUDIO],
            speechConfig: {
                voiceConfig: { prebuiltVoiceConfig: { voiceName: 'Kore' } }
            },
            systemInstruction: language === 'HA' 
              ? "You are a helpful agricultural expert for Nigerian farmers. Speak in Hausa mixed with English where necessary (Hausa-nglish) to be understood by locals. Be encouraging."
              : "You are a helpful agricultural expert for Nigerian farmers. Speak clearly and professionally about poultry, fish farming, and crops."
        }
      });
      sessionPromiseRef.current = sessionPromise;

    } catch (e) {
      console.error(e);
      setStatus("Failed to start audio");
      setActive(false);
    }
  };

  const stopSession = () => {
      // Clean up audio contexts and sources
      sourcesRef.current.forEach(s => s.stop());
      sourcesRef.current.clear();
      inputContextRef.current?.close();
      audioContextRef.current?.close();
      
      // Close session if possible (wrapper doesn't expose close easily on promise, 
      // but in real app we'd handle the session object differently)
      // Assuming re-render handles cleanup via unmount mostly
      setActive(false);
      onClose();
  };

  useEffect(() => {
      startSession();
      return () => {
          stopSession();
      }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm">
      <div className="bg-gray-900 border border-green-500/30 rounded-2xl p-8 w-full max-w-md flex flex-col items-center shadow-2xl relative overflow-hidden">
        {/* Animated Glow Background */}
        <div className="absolute inset-0 bg-green-500/10 animate-pulse rounded-2xl pointer-events-none"></div>

        <h3 className="text-2xl font-serif text-green-400 mb-6 z-10">
            {language === 'HA' ? "Maganar Kai Tsaye" : "Live Expert"}
        </h3>
        
        <div className="relative mb-8">
            <div className={`w-32 h-32 rounded-full border-4 flex items-center justify-center transition-all duration-300 ${active ? 'border-green-500 shadow-[0_0_30px_rgba(34,197,94,0.5)]' : 'border-gray-600'}`}>
                {active ? <LucideMic className="w-12 h-12 text-green-400 animate-bounce" /> : <LucideLoader2 className="w-12 h-12 text-gray-400 animate-spin" />}
            </div>
        </div>
        
        <p className="text-gray-300 mb-8 text-center font-light z-10">{status}</p>
        
        <button 
            onClick={stopSession}
            className="px-8 py-3 bg-red-600/80 hover:bg-red-600 text-white rounded-full flex items-center gap-2 transition-all hover:scale-105 z-10 font-bold"
        >
            <LucideMicOff size={20} />
            {language === 'HA' ? "Gama Kira" : "End Call"}
        </button>
      </div>
    </div>
  );
};

export default LiveExpert;