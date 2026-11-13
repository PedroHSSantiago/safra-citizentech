import React, { useEffect, useState } from 'react';
import { ScreenId, VoicePromptEntity } from '../../types/models';
import { VOICE_PROMPTS } from '../../data/seedData';
import { BottomNavBar, HomeIndicatorOnly, StatusBar, TopSubHeader } from '../MobileShell';
import {
  AlertCircle,
  ArrowUp,
  ChevronRight,
  CloudRain,
  Mic,
  Pause,
  Play,
  Sprout,
  TrendingUp,
} from 'lucide-react';

interface Module6Props {
  screen: ScreenId;
  offlineMode: boolean;
  selectedVoicePrompt: VoicePromptEntity;
  onSelectVoicePrompt: (prompt: VoicePromptEntity) => void;
  onNavigate: (screen: ScreenId) => void;
}

export const Module6VoiceAssistant: React.FC<Module6Props> = ({
  screen,
  offlineMode,
  selectedVoicePrompt,
  onSelectVoicePrompt,
  onNavigate,
}) => {
  const [listenSeconds, setListenSeconds] = useState(4);
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const [customText, setCustomText] = useState('');

  useEffect(() => {
    if (screen !== 'tela-31') return;
    setListenSeconds(1);
    const interval = setInterval(() => {
      setListenSeconds((prev) => (prev < 9 ? prev + 1 : prev));
    }, 1000);
    return () => clearInterval(interval);
  }, [screen]);

  const handlePlayTts = () => {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      if (isPlayingAudio) {
        window.speechSynthesis.cancel();
        setIsPlayingAudio(false);
        return;
      }
      window.speechSynthesis.cancel();
      const utter = new SpeechSynthesisUtterance(
        `${selectedVoicePrompt.aiHeadline} ${selectedVoicePrompt.aiBody}. ${selectedVoicePrompt.recommendation}`
      );
      utter.lang = 'pt-BR';
      utter.rate = 1.02;
      utter.onend = () => setIsPlayingAudio(false);
      setIsPlayingAudio(true);
      window.speechSynthesis.speak(utter);
    } else {
      setIsPlayingAudio(!isPlayingAudio);
    }
  };

  // ==========================================================================
  // TELA 30 — "PERGUNTA PRA SAFRA" (INICIAL)
  // ==========================================================================
  if (screen === 'tela-30') {
    const icons = [
      <Sprout className="w-4 h-4 text-[#3B6D11]" key="0" />,
      <CloudRain className="w-4 h-4 text-[#1D63B8]" key="1" />,
      <AlertCircle className="w-4 h-4 text-[#EF9F27]" key="2" />,
      <TrendingUp className="w-4 h-4 text-[#534AB7]" key="3" />,
    ];

    return (
      <div
        className="w-full h-full flex flex-col justify-between bg-[#F7F6F1]"
        data-node-id="2:498"
      >
        <div className="bg-white border-b border-[#E5E3DC] shrink-0">
          <StatusBar offlineMode={offlineMode} />
          <div className="px-5 py-3">
            <h1 className="text-[20px] font-extrabold text-[#1A1A1A]">
              Pergunta pra SAFRA
            </h1>
            <p className="text-[12px] text-[#5F5E5A]">Fale ou toque para escrever</p>
          </div>
        </div>

        <div className="px-4 py-3 flex-1 overflow-y-auto flex flex-col justify-between">
          <div className="space-y-2.5">
            <p className="text-[10px] font-bold tracking-wider text-[#5F5E5A]">
              PERGUNTAS QUE VOCÊ PODE FAZER
            </p>

            {VOICE_PROMPTS.map((vp, idx) => (
              <div
                key={vp.id}
                onClick={() => {
                  onSelectVoicePrompt(vp);
                  onNavigate('tela-32');
                }}
                className="bg-white rounded-2xl p-3 border border-[#E5E3DC] flex items-center gap-3 cursor-pointer hover:border-[#3B6D11] transition shadow-sm"
              >
                <div className="w-9 h-9 rounded-xl bg-[#F7F6F1] flex items-center justify-center shrink-0">
                  {icons[idx]}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-bold text-[12.5px] text-[#1A1A1A] truncate">
                    {vp.utterance}
                  </p>
                  <p className="text-[10.5px] text-[#5F5E5A] truncate">{vp.subtitle}</p>
                </div>
              </div>
            ))}

            <div className="bg-[#EAF2E2] rounded-2xl p-3 border border-[#3B6D11]/20 flex items-center gap-2.5">
              <span className="w-6 h-6 rounded-full bg-white text-[#3B6D11] text-[12px] font-bold flex items-center justify-center shrink-0">
                !
              </span>
              <div>
                <p className="font-bold text-[11.5px] text-[#1A1A1A]">
                  Fala como se fosse pro filho
                </p>
                <p className="text-[10px] text-[#5F5E5A]">
                  A IA entende português coloquial e gírias regionais
                </p>
              </div>
            </div>
          </div>

          {/* Big Microphone Button */}
          <div className="py-3 flex flex-col items-center">
            <button
              type="button"
              onClick={() => onNavigate('tela-31')}
              className="w-20 h-20 rounded-full bg-[#3B6D11] hover:bg-[#2F590D] text-white flex items-center justify-center shadow-lg shadow-[#3B6D11]/30 ring-8 ring-[#EAF2E2] transition transform active:scale-95"
              aria-label="Toque pra falar"
            >
              <Mic className="w-8 h-8" />
            </button>
            <p className="text-[11px] font-semibold text-[#1A1A1A] mt-2">Toque pra falar</p>
            <p className="text-[10px] text-[#5F5E5A]">ou segure pra gravar mais longo</p>
          </div>
        </div>

        <BottomNavBar activeTab="VOZ" onNavigate={onNavigate} />
      </div>
    );
  }

  // ==========================================================================
  // TELA 31 — OUVINDO... (CAPTURA DE VOZ COLOQUIAL)
  // ==========================================================================
  if (screen === 'tela-31') {
    return (
      <div
        onClick={() => onNavigate('tela-32')}
        className="w-full h-full flex flex-col justify-between bg-gradient-to-b from-[#1A3318] via-[#21401E] to-[#142612] text-white cursor-pointer select-none"
        data-node-id="2:1323"
      >
        <StatusBar darkTheme offlineMode={offlineMode} />

        <div className="px-6 flex-1 flex flex-col items-center justify-center text-center">
          <p className="text-[22px] font-extrabold">Estou te ouvindo...</p>
          <p className="text-[13px] text-white/75 mt-1">Pode falar à vontade</p>

          {/* Animated Pulse Mic */}
          <div className="relative my-10 flex items-center justify-center">
            <div className="w-36 h-36 rounded-full bg-[#3B6D11]/30 animate-ping absolute" />
            <div className="w-28 h-28 rounded-full bg-[#3B6D11]/50 flex items-center justify-center">
              <div className="w-20 h-20 rounded-full bg-[#689F28] flex items-center justify-center shadow-xl">
                <Mic className="w-9 h-9 text-white" />
              </div>
            </div>
          </div>

          <p className="text-[18px] italic text-white/95 max-w-[260px] leading-snug">
            {selectedVoicePrompt.utterance}
          </p>

          <p className="mt-6 font-mono text-[14px] text-[#A4D65E]">
            0:0{listenSeconds}
          </p>
          <p className="text-[11.5px] text-white/65 mt-2">toque para parar e ver resposta</p>
        </div>

        <HomeIndicatorOnly dark />
      </div>
    );
  }

  // ==========================================================================
  // TELA 32 — RESPOSTA MULTIMODAL DA IA (CONVERSA)
  // ==========================================================================
  const handleSendCustomText = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customText.trim()) return;
    onSelectVoicePrompt({
      ...selectedVoicePrompt,
      utterance: `"${customText.trim()}"`,
    });
    setCustomText('');
  };

  return (
    <div
      className="w-full h-full flex flex-col justify-between bg-[#F7F6F1]"
      data-node-id="2:1187"
    >
      <div className="bg-white shrink-0">
        <StatusBar offlineMode={offlineMode} />
        <TopSubHeader
          title="Conversa"
          onBack={() => onNavigate('tela-30')}
          showMore
        />
      </div>

      <div className="px-4 py-3 flex-1 overflow-y-auto space-y-3">
        {/* User Bubble */}
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-full bg-[#EAF2E2] text-[#3B6D11] text-[11px] font-bold flex items-center justify-center shrink-0">
            JM
          </div>
          <div className="flex-1 bg-[#3B6D11] text-white rounded-2xl p-3 text-[13px]">
            {selectedVoicePrompt.utterance}
          </div>
        </div>

        <p className="text-[10px] text-[#5F5E5A] pl-11">SAFRA · há 1 seg</p>

        {/* AI Text Bubble */}
        <div className="flex items-start gap-2.5">
          <div className="w-8 h-8 rounded-full bg-[#3B6D11] text-white flex items-center justify-center shrink-0 mt-1">
            🌱
          </div>
          <div className="flex-1 bg-white rounded-2xl p-3.5 border border-[#E5E3DC] shadow-sm space-y-1.5">
            <p className="font-bold text-[14.5px] text-[#1A1A1A]">
              {selectedVoicePrompt.aiHeadline}
            </p>
            <p className="text-[12.5px] text-[#1A1A1A] leading-snug">
              {selectedVoicePrompt.aiBody}
            </p>
          </div>
        </div>

        {/* Visual Summary Card */}
        <div className="ml-10 bg-[#EAF2E2] rounded-2xl p-3.5 border border-[#3B6D11]/30 space-y-2.5">
          <p className="text-[10px] font-extrabold text-[#3B6D11] tracking-wider">
            RESUMO VISUAL
          </p>
          <div className="grid grid-cols-2 divide-x divide-[#3B6D11]/20">
            <div className="pr-2">
              <p className="text-[10px] text-[#5F5E5A]">NDVI atual</p>
              <div className="flex items-baseline gap-1.5 mt-0.5">
                <span className="text-[22px] font-extrabold text-[#3B6D11]">
                  {selectedVoicePrompt.ndviValue}
                </span>
                <span className="text-[11px] font-bold text-[#E24B4A]">
                  {selectedVoicePrompt.ndviChange}
                </span>
              </div>
            </div>
            <div className="pl-3">
              <p className="text-[10px] text-[#5F5E5A]">Risco praga</p>
              <p className="text-[15px] font-extrabold text-[#EF9F27] mt-0.5">
                {selectedVoicePrompt.pestRiskLevel}
              </p>
              <p className="text-[10.5px] text-[#5F5E5A]">
                {selectedVoicePrompt.pestRiskDetail}
              </p>
            </div>
          </div>

          <div className="bg-white rounded-xl p-2.5 flex items-center gap-2 text-[11.5px] font-medium text-[#1A1A1A]">
            <span className="w-4 h-4 rounded-full bg-[#3B6D11] text-white text-[10px] font-bold flex items-center justify-center shrink-0">
              !
            </span>
            <span>{selectedVoicePrompt.recommendation}</span>
          </div>
        </div>

        {/* Playable Audio Waveform */}
        <div className="ml-10 bg-white rounded-full p-2 px-3 border border-[#E5E3DC] flex items-center gap-3 shadow-sm">
          <button
            type="button"
            onClick={handlePlayTts}
            className="w-8 h-8 rounded-full bg-[#3B6D11] text-white flex items-center justify-center shrink-0"
            title="Ouvir resposta em voz alta (TTS)"
          >
            {isPlayingAudio ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4 ml-0.5" />}
          </button>
          <div className="flex-1 flex items-center gap-1 h-5">
            {[4, 8, 6, 12, 9, 14, 7, 11, 5, 8, 6, 4, 7, 5, 4, 6, 4, 5, 3].map((h, i) => (
              <span
                key={i}
                className={`flex-1 rounded-full ${
                  i < 8 || isPlayingAudio ? 'bg-[#3B6D11]' : 'bg-[#D3D1C7]'
                }`}
                style={{ height: `${h + 2}px` }}
              />
            ))}
          </div>
          <span className="text-[10px] text-[#5F5E5A] font-mono">
            {selectedVoicePrompt.audioDuration}
          </span>
        </div>

        {/* Suggestions */}
        <div className="pt-1 space-y-2">
          <p className="text-[10px] font-bold tracking-wider text-[#5F5E5A]">SUGESTÕES</p>
          <button
            type="button"
            onClick={() => onNavigate('tela-16')}
            className="w-full bg-white rounded-2xl p-3 border border-[#E5E3DC] flex items-center justify-between text-left hover:border-[#3B6D11] transition"
          >
            <div className="flex items-center gap-2.5">
              <span className="w-7 h-7 rounded-lg bg-[#FAECD8] text-[#EF9F27] flex items-center justify-center">
                <ArrowUp className="w-4 h-4" />
              </span>
              <span className="font-semibold text-[12.5px] text-[#1A1A1A]">
                Ver plano completo de ação
              </span>
            </div>
            <ChevronRight className="w-4 h-4 text-[#5F5E5A]" />
          </button>

          <button
            type="button"
            onClick={() => onNavigate('tela-10')}
            className="w-full bg-white rounded-2xl p-3 border border-[#E5E3DC] flex items-center justify-between text-left hover:border-[#3B6D11] transition"
          >
            <div className="flex items-center gap-2.5">
              <span className="w-7 h-7 rounded-lg bg-[#EAF2E2] text-[#3B6D11] flex items-center justify-center">
                <TrendingUp className="w-4 h-4" />
              </span>
              <span className="font-semibold text-[12.5px] text-[#1A1A1A]">
                Abrir histórico do Talhão Norte
              </span>
            </div>
            <ChevronRight className="w-4 h-4 text-[#5F5E5A]" />
          </button>
        </div>
      </div>

      {/* Bottom Chat / Voice Input */}
      <div className="px-4 pt-2 pb-1 bg-[#F7F6F1]">
        <form
          onSubmit={handleSendCustomText}
          className="bg-white rounded-full p-1.5 pl-4 border border-[#E5E3DC] flex items-center justify-between"
        >
          <input
            type="text"
            value={customText}
            onChange={(e) => setCustomText(e.target.value)}
            placeholder="Continuar conversando..."
            className="flex-1 text-[12.5px] text-[#1A1A1A] bg-transparent focus:outline-none"
          />
          <button
            type="button"
            onClick={() => onNavigate('tela-31')}
            className="w-8 h-8 rounded-full bg-[#3B6D11] text-white flex items-center justify-center"
          >
            <Mic className="w-4 h-4" />
          </button>
        </form>
        <HomeIndicatorOnly />
      </div>
    </div>
  );
};
