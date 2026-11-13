import React, { useState } from 'react';
import {
  FarmEntity,
  PlotAlertPreferences,
  PlotEntity,
  ProducerEntity,
  ScreenId,
} from '../../types/models';
import { HomeIndicatorOnly, StatusBar, TopSubHeader } from '../MobileShell';
import {
  Check,
  ChevronLeft,
  ChevronRight,
  Compass,
  FileText,
  Lock,
  MapPin,
  Plus,
  RotateCcw,
  Satellite,
  ShieldCheck,
  Sparkles,
  Trash2,
} from 'lucide-react';

interface Module1Props {
  screen: ScreenId;
  offlineMode: boolean;
  producer: ProducerEntity;
  farm: FarmEntity;
  plots: PlotEntity[];
  selectedPlotId: string;
  onNavigate: (screen: ScreenId) => void;
  onSelectPlot: (plotId: string) => void;
  onUpdateProducer: (producer: ProducerEntity) => void;
  onUpdateFarm: (farm: FarmEntity) => void;
  onAddPlot: (plot: PlotEntity) => void;
  onUpdatePlotAlerts: (plotId: string, prefs: PlotAlertPreferences) => void;
}

export const Module1OnboardingAndPlots: React.FC<Module1Props> = ({
  screen,
  offlineMode,
  producer,
  farm,
  plots,
  selectedPlotId,
  onNavigate,
  onSelectPlot,
  onUpdateProducer,
  onUpdateFarm,
  onAddPlot,
  onUpdatePlotAlerts,
}) => {
  // Form states for tela-05
  const [fullName, setFullName] = useState(producer.fullName);
  const [phone, setPhone] = useState(producer.phoneWhatsapp);
  const [municipality, setMunicipality] = useState(`${producer.municipality} · ${producer.state}`);
  const [primaryCrop, setPrimaryCrop] = useState(producer.primaryCrop);
  const [extraCropAdded, setExtraCropAdded] = useState(false);

  // Mapping method state for tela-07
  const [mappingMethod, setMappingMethod] = useState<'DRAW_POLYGON' | 'IMPORT_CAR'>(farm.mappingMethod);
  const [carInput, setCarInput] = useState(farm.carCode);

  // Polygon drawing state for tela-34
  const [newPlotName, setNewPlotName] = useState('Talhão Leste');
  const [drawnPoints, setDrawnPoints] = useState<Array<{ x: number; y: number }>>([
    { x: 195, y: 42 },
    { x: 295, y: 48 },
    { x: 286, y: 138 },
    { x: 190, y: 126 },
  ]);

  const currentPlot = plots.find((p) => p.id === selectedPlotId) || plots[0];
  const [alertPrefs, setAlertPrefs] = useState<PlotAlertPreferences>(currentPlot.alertPreferences);

  // ==========================================================================
  // TELA 01 — SPLASH SCREEN
  // ==========================================================================
  if (screen === 'tela-01') {
    return (
      <div
        onClick={() => onNavigate('tela-02')}
        className="w-full h-full flex flex-col justify-between bg-gradient-to-b from-[#EAF2E2] via-[#F7F6F1] to-[#FBFBF9] cursor-pointer select-none"
        data-node-id="2:776"
      >
        <StatusBar offlineMode={offlineMode} />

        <div className="flex-1 flex flex-col items-center justify-center px-8 text-center">
          {/* Planet + Orbit + Leaf Logo */}
          <div className="relative w-40 h-36 flex items-center justify-center mb-5">
            <div className="w-28 h-28 rounded-full bg-[#3B6D11] flex items-center justify-center shadow-lg shadow-[#3B6D11]/20">
              <svg viewBox="0 0 64 64" className="w-14 h-14">
                <path
                  d="M18 40 C24 24, 38 20, 46 22 C36 28, 28 34, 18 40 Z"
                  fill="#F7F6F1"
                />
                <path
                  d="M24 46 C30 34, 42 30, 50 32 C42 38, 34 42, 24 46 Z"
                  fill="#DCECC9"
                />
              </svg>
            </div>
            {/* Orbit ellipse */}
            <svg viewBox="0 0 180 90" className="absolute inset-0 w-full h-full pointer-events-none">
              <ellipse
                cx="90"
                cy="48"
                rx="78"
                ry="22"
                fill="none"
                stroke="#4F8A1D"
                strokeWidth="2"
                transform="rotate(-14 90 48)"
              />
              {/* Satellite icon on orbit */}
              <g transform="translate(148, 22) rotate(-18)">
                <rect x="-8" y="-3" width="5" height="6" rx="1" fill="#534AB7" />
                <rect x="-2" y="-4" width="4" height="8" rx="1" fill="#3730A3" />
                <rect x="3" y="-3" width="5" height="6" rx="1" fill="#534AB7" />
              </g>
            </svg>
          </div>

          <h1 className="text-[44px] font-extrabold tracking-tight text-[#1A1A1A] leading-none">
            SAFRA
          </h1>
          <p className="text-[11px] font-medium tracking-[0.12em] text-[#5F5E5A] mt-2">
            SISTEMA AGROCLIMÁTICO INTELIGENTE
          </p>

          <p className="text-[16px] italic text-[#5F5E5A] mt-10">
            "O espaço plantando junto com você."
          </p>

          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onNavigate('tela-02');
            }}
            className="mt-8 px-5 py-2 rounded-full bg-[#3B6D11]/10 text-[#3B6D11] text-[12px] font-semibold hover:bg-[#3B6D11]/20 transition"
          >
            Toque para iniciar →
          </button>
        </div>

        <div className="px-6 pb-2 text-center">
          <p className="text-[10px] font-medium text-[#5F5E5A] tracking-wide">
            DADOS ORBITAIS · NASA LANDSAT · ESA SENTINEL-2 · INPE CBERS
          </p>
          <p className="text-[10px] text-[#B8B5AA] mt-1">v1.0 · 2026</p>
          <HomeIndicatorOnly />
        </div>
      </div>
    );
  }

  // ==========================================================================
  // TELA 02 — ONBOARDING 01 (SUA FAZENDA VISTA DO ESPAÇO)
  // ==========================================================================
  if (screen === 'tela-02') {
    return (
      <div className="w-full h-full flex flex-col justify-between bg-gradient-to-b from-[#EAF2E2] via-[#F7F6F1] to-white" data-node-id="2:3416">
        <StatusBar offlineMode={offlineMode} />
        <div className="px-6 pt-1 flex justify-end">
          <button
            type="button"
            onClick={() => onNavigate('tela-05')}
            className="text-[13px] font-medium text-[#5F5E5A] hover:text-[#1A1A1A]"
          >
            Pular
          </button>
        </div>

        <div className="px-6 flex-1 flex flex-col justify-center">
          {/* Satellite farm preview card */}
          <div className="w-full bg-white rounded-3xl p-4 shadow-sm border border-[#E5E3DC] mb-7 relative overflow-hidden">
            <div className="flex items-center justify-between mb-2">
              <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-[#534AB7] bg-[#EEEDFE] px-2 py-0.5 rounded-full">
                <Satellite className="w-3 h-3" /> SENTINEL-2A
              </span>
              <span className="inline-flex items-center gap-1 bg-[#E24B4A] text-white text-[10px] font-bold px-2.5 py-0.5 rounded-full">
                <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" /> AO VIVO
              </span>
            </div>

            <svg viewBox="0 0 260 155" className="w-full h-40 rounded-2xl bg-[#FBFBF9]">
              {/* Dashed satellite pass line */}
              <line x1="15" y1="15" x2="245" y2="140" stroke="#534AB7" strokeWidth="1.2" strokeDasharray="4 4" />
              {/* Plot polygons */}
              <polygon points="55,30 115,22 125,65 65,72" fill="#4A7C25" stroke="#fff" strokeWidth="1.5" />
              <polygon points="115,22 182,30 186,74 125,65" fill="#6E9E48" stroke="#fff" strokeWidth="1.5" />
              <polygon points="65,72 125,65 132,115 74,120" fill="#CCA84C" stroke="#fff" strokeWidth="1.5" />
              <polygon points="125,65 186,74 198,125 132,115" fill="#B57C4A" stroke="#fff" strokeWidth="1.5" />
              <polygon points="74,120 132,115 136,145 78,146" fill="#4A7C25" stroke="#fff" strokeWidth="1.5" />
            </svg>

            <div className="mt-3 flex items-center justify-between text-[10px] font-semibold text-[#5F5E5A]">
              <span>SAUDÁVEL</span>
              <div className="flex-1 mx-3 h-2 rounded-full overflow-hidden grid grid-cols-4">
                <div className="bg-[#4A7C25]" />
                <div className="bg-[#6E9E48]" />
                <div className="bg-[#CCA84C]" />
                <div className="bg-[#B57C4A]" />
              </div>
              <span>SECO</span>
            </div>
          </div>

          <h2 className="text-[28px] font-extrabold text-[#1A1A1A] leading-tight">
            Sua fazenda
            <br />
            <span className="text-[#3B6D11]">vista do espaço.</span>
          </h2>
          <p className="text-[13px] text-[#5F5E5A] mt-3 leading-relaxed">
            Dados de satélite (NASA, ESA e INPE) mostram a saúde de cada talhão em tempo real. Atualização a cada 5 dias, sem complicação.
          </p>
        </div>

        <div className="px-6 pb-2">
          <div className="flex items-center justify-center gap-1.5 mb-5">
            <span className="w-5 h-1.5 rounded-full bg-[#3B6D11]" />
            <span className="w-1.5 h-1.5 rounded-full bg-[#D3D1C7]" />
            <span className="w-1.5 h-1.5 rounded-full bg-[#D3D1C7]" />
          </div>
          <button
            type="button"
            onClick={() => onNavigate('tela-03')}
            className="w-full h-13 py-3.5 rounded-2xl bg-[#3B6D11] hover:bg-[#2F590D] text-white font-bold text-[15px] shadow-sm transition"
          >
            Próximo
          </button>
          <HomeIndicatorOnly />
        </div>
      </div>
    );
  }

  // ==========================================================================
  // TELA 03 — ONBOARDING 02 (PRAGAS? A GENTE AVISA ANTES)
  // ==========================================================================
  if (screen === 'tela-03') {
    return (
      <div className="w-full h-full flex flex-col justify-between bg-gradient-to-b from-[#FAECD8]/60 via-[#F7F6F1] to-white" data-node-id="2:1600">
        <StatusBar offlineMode={offlineMode} />
        <div className="px-6 pt-1 flex justify-end">
          <button
            type="button"
            onClick={() => onNavigate('tela-05')}
            className="text-[13px] font-medium text-[#5F5E5A] hover:text-[#1A1A1A]"
          >
            Pular
          </button>
        </div>

        <div className="px-6 flex-1 flex flex-col justify-center">
          <div className="w-full bg-white rounded-3xl p-5 shadow-sm border border-[#E8C99B] mb-7">
            <div className="flex items-center justify-between mb-3">
              <span className="text-[10px] font-bold tracking-wider text-[#854F0B] bg-[#FAECD8] px-2.5 py-1 rounded-full">
                SAFRA · AGORA
              </span>
              <span className="text-[11px] font-semibold text-[#3B6D11]">IA EMBRAPA</span>
            </div>
            <div className="p-3.5 rounded-2xl bg-[#FAECD8]/60 border border-[#E8C99B]/60 flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-[#EF9F27] text-white font-bold flex items-center justify-center text-lg shrink-0">
                !
              </div>
              <div>
                <p className="font-bold text-[15px] text-[#1A1A1A]">Risco de broca-do-café</p>
                <p className="text-[12px] text-[#854F0B] font-medium">Talhão Norte · em 9 dias</p>
              </div>
            </div>
            <div className="mt-4 grid grid-cols-3 gap-2 text-center">
              <div className="p-2 rounded-xl bg-[#F7F6F1]">
                <p className="text-[10px] text-[#5F5E5A]">Temp. 8d</p>
                <p className="font-bold text-[13px] text-[#1A1A1A]">24°C</p>
              </div>
              <div className="p-2 rounded-xl bg-[#F7F6F1]">
                <p className="text-[10px] text-[#5F5E5A]">Umidade</p>
                <p className="font-bold text-[13px] text-[#1A1A1A]">70-85%</p>
              </div>
              <div className="p-2 rounded-xl bg-[#F7F6F1]">
                <p className="text-[10px] text-[#5F5E5A]">Estágio</p>
                <p className="font-bold text-[13px] text-[#3B6D11]">Chumbinho</p>
              </div>
            </div>
          </div>

          <h2 className="text-[28px] font-extrabold text-[#1A1A1A] leading-tight">
            Pragas? A gente
            <br />
            <span className="text-[#EF9F27]">avisa antes.</span>
          </h2>
          <p className="text-[13px] text-[#5F5E5A] mt-3 leading-relaxed">
            Nossa IA, treinada com dados da Embrapa, identifica risco de praga com 7 a 14 dias de antecedência. Dá tempo de agir.
          </p>
        </div>

        <div className="px-6 pb-2">
          <div className="flex items-center justify-center gap-1.5 mb-5">
            <span className="w-1.5 h-1.5 rounded-full bg-[#D3D1C7]" />
            <span className="w-5 h-1.5 rounded-full bg-[#3B6D11]" />
            <span className="w-1.5 h-1.5 rounded-full bg-[#D3D1C7]" />
          </div>
          <button
            type="button"
            onClick={() => onNavigate('tela-04')}
            className="w-full py-3.5 rounded-2xl bg-[#3B6D11] hover:bg-[#2F590D] text-white font-bold text-[15px] shadow-sm transition"
          >
            Próximo
          </button>
          <HomeIndicatorOnly />
        </div>
      </div>
    );
  }

  // ==========================================================================
  // TELA 04 — ONBOARDING 03 (SEU TRABALHO VIRA CRÉDITO)
  // ==========================================================================
  if (screen === 'tela-04') {
    return (
      <div className="w-full h-full flex flex-col justify-between bg-gradient-to-b from-[#EEEDFE] via-[#F7F6F1] to-white" data-node-id="2:1663">
        <StatusBar offlineMode={offlineMode} />
        <div className="px-6 pt-1 flex justify-end">
          <button
            type="button"
            onClick={() => onNavigate('tela-05')}
            className="text-[13px] font-medium text-[#5F5E5A] hover:text-[#1A1A1A]"
          >
            Pular
          </button>
        </div>

        <div className="px-6 flex-1 flex flex-col justify-center">
          <div className="w-full bg-white rounded-3xl p-5 shadow-sm border border-[#C5C0F2] mb-7 flex flex-col items-center">
            <div className="relative w-44 h-28 flex flex-col items-center justify-end">
              <svg viewBox="0 0 160 95" className="w-full h-full">
                <path
                  d="M 18 82 A 62 62 0 0 1 142 82"
                  fill="none"
                  stroke="#E5E3DC"
                  strokeWidth="12"
                  strokeLinecap="round"
                />
                <path
                  d="M 18 82 A 62 62 0 0 1 124 38"
                  fill="none"
                  stroke="url(#scoreGrad)"
                  strokeWidth="12"
                  strokeLinecap="round"
                />
                <defs>
                  <linearGradient id="scoreGrad" x1="0" y1="0" x2="1" y2="0">
                    <stop offset="0%" stopColor="#534AB7" />
                    <stop offset="100%" stopColor="#3B6D11" />
                  </linearGradient>
                </defs>
              </svg>
              <div className="absolute bottom-1 text-center">
                <p className="text-[34px] font-extrabold text-[#1A1A1A] leading-none">742</p>
                <p className="text-[10px] text-[#5F5E5A] mt-0.5">/ 1000</p>
              </div>
            </div>

            <span className="mt-2 px-3 py-1 rounded-full bg-[#534AB7] text-white text-[11px] font-bold">
              Score Agro+
            </span>

            <div className="mt-4 flex items-center gap-2">
              {['AGROLEND', 'SICREDI', 'CRESOL'].map((bank) => (
                <span
                  key={bank}
                  className="px-2.5 py-1 rounded-lg bg-[#F7F6F1] border border-[#E5E3DC] text-[9px] font-bold text-[#5F5E5A]"
                >
                  {bank}
                </span>
              ))}
            </div>
          </div>

          <h2 className="text-[28px] font-extrabold text-[#1A1A1A] leading-tight">
            Seu trabalho
            <br />
            <span className="text-[#534AB7]">vira crédito.</span>
          </h2>
          <p className="text-[13px] text-[#5F5E5A] mt-3 leading-relaxed">
            Seu histórico de produção gera um score auditável. Use ele pra acessar microcrédito rural sem sair da fazenda.
          </p>
        </div>

        <div className="px-6 pb-2">
          <div className="flex items-center justify-center gap-1.5 mb-5">
            <span className="w-1.5 h-1.5 rounded-full bg-[#D3D1C7]" />
            <span className="w-1.5 h-1.5 rounded-full bg-[#D3D1C7]" />
            <span className="w-5 h-1.5 rounded-full bg-[#3B6D11]" />
          </div>
          <button
            type="button"
            onClick={() => onNavigate('tela-05')}
            className="w-full py-3.5 rounded-2xl bg-[#3B6D11] hover:bg-[#2F590D] text-white font-bold text-[15px] shadow-sm transition"
          >
            Bora começar
          </button>
          <HomeIndicatorOnly />
        </div>
      </div>
    );
  }

  // ==========================================================================
  // TELA 05 — CADASTRO DE DADOS (1 DE 3)
  // ==========================================================================
  if (screen === 'tela-05') {
    const handleSaveStep1 = () => {
      const [muni, st] = municipality.split('·').map((s) => s.trim());
      onUpdateProducer({
        ...producer,
        fullName,
        phoneWhatsapp: phone,
        municipality: muni || producer.municipality,
        state: st || producer.state,
        primaryCrop,
      });
      onNavigate('tela-06');
    };

    return (
      <div className="w-full h-full flex flex-col justify-between bg-[#F7F6F1]" data-node-id="2:1530">
        <div>
          <StatusBar offlineMode={offlineMode} />
          <div className="px-6 pt-3 pb-2 flex items-center justify-between">
            <button
              type="button"
              onClick={() => onNavigate('tela-04')}
              className="p-1 -ml-1 text-[#1A1A1A]"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <div className="flex items-center gap-1.5">
              <span className="w-9 h-1 rounded-full bg-[#3B6D11]" />
              <span className="w-9 h-1 rounded-full bg-[#D3D1C7]" />
              <span className="w-9 h-1 rounded-full bg-[#D3D1C7]" />
            </div>
            <span className="text-[11px] font-medium text-[#5F5E5A]">1 de 3</span>
          </div>
        </div>

        <div className="px-6 flex-1 overflow-y-auto py-2 space-y-3.5">
          <div>
            <h1 className="text-[24px] font-extrabold text-[#1A1A1A]">Vamos te conhecer</h1>
            <p className="text-[12px] text-[#5F5E5A] mt-0.5">
              Só os dados básicos. A gente respeita seu tempo.
            </p>
          </div>

          <div>
            <label className="block text-[10px] font-bold tracking-wider text-[#5F5E5A] mb-1">
              NOME COMPLETO
            </label>
            <div className="relative">
              <input
                type="text"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                className="w-full h-11 px-3.5 rounded-xl bg-white border-2 border-[#3B6D11] text-[13px] font-medium text-[#1A1A1A] focus:outline-none"
              />
              <span className="absolute right-3 top-3 w-5 h-5 rounded-full bg-[#EAF2E2] text-[#3B6D11] flex items-center justify-center">
                <Check className="w-3.5 h-3.5" />
              </span>
            </div>
          </div>

          <div>
            <label className="block text-[10px] font-bold tracking-wider text-[#5F5E5A] mb-1">
              TELEFONE / WHATSAPP
            </label>
            <input
              type="text"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="w-full h-11 px-3.5 rounded-xl bg-white border border-[#E5E3DC] text-[13px] font-medium text-[#1A1A1A] focus:border-[#3B6D11] focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-[10px] font-bold tracking-wider text-[#5F5E5A] mb-1">
              MUNICÍPIO
            </label>
            <select
              value={municipality}
              onChange={(e) => setMunicipality(e.target.value)}
              className="w-full h-11 px-3.5 rounded-xl bg-white border border-[#E5E3DC] text-[13px] font-medium text-[#1A1A1A] focus:border-[#3B6D11] focus:outline-none"
            >
              <option value="Linhares · ES">Linhares · ES</option>
              <option value="Colatina · ES">Colatina · ES</option>
              <option value="São Mateus · ES">São Mateus · ES</option>
              <option value="Patrocínio · MG">Patrocínio · MG</option>
            </select>
          </div>

          <div>
            <label className="block text-[10px] font-bold tracking-wider text-[#5F5E5A] mb-1">
              CULTURA PRINCIPAL
            </label>
            <select
              value={primaryCrop}
              onChange={(e) => setPrimaryCrop(e.target.value)}
              className="w-full h-11 px-3.5 rounded-xl bg-white border border-[#E5E3DC] text-[13px] font-medium text-[#1A1A1A] focus:border-[#3B6D11] focus:outline-none"
            >
              <option value="Café conilon">☕ Café conilon</option>
              <option value="Café arábica">☕ Café arábica</option>
              <option value="Cacau">🍫 Cacau</option>
              <option value="Milho">🌽 Milho</option>
            </select>
          </div>

          <button
            type="button"
            onClick={() => setExtraCropAdded(!extraCropAdded)}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#EAF2E2] text-[#3B6D11] text-[11px] font-semibold"
          >
            <Plus className="w-3.5 h-3.5" />
            {extraCropAdded ? 'Secundária: Pimenta-do-reino ✓' : 'Adicionar outra cultura'}
          </button>

          <div className="pt-2 flex items-start gap-2 text-[11px] text-[#5F5E5A]">
            <Lock className="w-4 h-4 text-[#3B6D11] shrink-0 mt-0.5" />
            <p>
              Seus dados são protegidos pela LGPD. Usamos só pra personalizar os alertas da sua fazenda.
            </p>
          </div>
        </div>

        <div className="px-6 pb-2 pt-2">
          <button
            type="button"
            onClick={handleSaveStep1}
            className="w-full py-3.5 rounded-2xl bg-[#3B6D11] hover:bg-[#2F590D] text-white font-bold text-[15px] transition"
          >
            Continuar
          </button>
          <HomeIndicatorOnly />
        </div>
      </div>
    );
  }

  // ==========================================================================
  // TELA 06 — PERMISSÃO DE LOCALIZAÇÃO (2 DE 3)
  // ==========================================================================
  if (screen === 'tela-06') {
    return (
      <div className="w-full h-full flex flex-col justify-between bg-[#F7F6F1]" data-node-id="29:15">
        <div>
          <StatusBar offlineMode={offlineMode} />
          <div className="px-6 pt-3 pb-2 flex items-center justify-between">
            <button
              type="button"
              onClick={() => onNavigate('tela-05')}
              className="p-1 -ml-1 text-[#1A1A1A]"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <div className="flex items-center gap-1.5">
              <span className="w-9 h-1 rounded-full bg-[#3B6D11]" />
              <span className="w-9 h-1 rounded-full bg-[#3B6D11]" />
              <span className="w-9 h-1 rounded-full bg-[#D3D1C7]" />
            </div>
            <span className="text-[11px] font-medium text-[#5F5E5A]">2 de 3</span>
          </div>
        </div>

        <div className="px-6 flex-1 flex flex-col justify-center">
          <div className="w-24 h-24 rounded-full bg-[#EAF2E2] flex items-center justify-center mx-auto mb-6 relative">
            <div className="w-16 h-16 rounded-full bg-[#3B6D11]/15 flex items-center justify-center">
              <MapPin className="w-8 h-8 text-[#3B6D11]" />
            </div>
            <span className="absolute -top-1 -right-1 w-6 h-6 rounded-full bg-[#3B6D11] text-white flex items-center justify-center">
              <Satellite className="w-3.5 h-3.5" />
            </span>
          </div>

          <h1 className="text-[24px] font-extrabold text-[#1A1A1A] text-center leading-tight">
            Pode usar sua localização?
          </h1>
          <p className="text-[13px] text-[#5F5E5A] text-center mt-2">
            A gente usa pra mostrar sua fazenda no mapa e cruzar com a passagem dos satélites.
          </p>

          <div className="mt-6 space-y-3 bg-white p-4 rounded-2xl border border-[#E5E3DC]">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-xl bg-[#EAF2E2] text-[#3B6D11] flex items-center justify-center shrink-0">
                <Compass className="w-4 h-4" />
              </div>
              <span className="text-[13px] font-medium text-[#1A1A1A]">
                Mostrar sua propriedade no mapa
              </span>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-xl bg-[#EAF2E2] text-[#3B6D11] flex items-center justify-center shrink-0">
                <Satellite className="w-4 h-4" />
              </div>
              <span className="text-[13px] font-medium text-[#1A1A1A]">
                Alertar quando o satélite passar por aqui
              </span>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-xl bg-[#EAF2E2] text-[#3B6D11] flex items-center justify-center shrink-0">
                <ShieldCheck className="w-4 h-4" />
              </div>
              <span className="text-[13px] font-medium text-[#1A1A1A]">
                Não rastreia você fora do app
              </span>
            </div>
          </div>
        </div>

        <div className="px-6 pb-2">
          <button
            type="button"
            onClick={() => {
              onUpdateProducer({ ...producer, gpsAuthorized: true });
              onNavigate('tela-07');
            }}
            className="w-full py-3.5 rounded-2xl bg-[#3B6D11] hover:bg-[#2F590D] text-white font-bold text-[15px] transition"
          >
            Permitir localização
          </button>
          <button
            type="button"
            onClick={() => onNavigate('tela-07')}
            className="w-full py-2.5 text-[13px] font-medium text-[#5F5E5A] hover:text-[#1A1A1A]"
          >
            Agora não, obrigado
          </button>
          <HomeIndicatorOnly />
        </div>
      </div>
    );
  }

  // ==========================================================================
  // TELA 07 — MÉTODO DE MAPEAMENTO DA FAZENDA (3 DE 3)
  // ==========================================================================
  if (screen === 'tela-07') {
    const handleConfirmFarm = () => {
      onUpdateFarm({
        ...farm,
        mappingMethod,
        carCode: carInput,
      });
      onNavigate('tela-08');
    };

    return (
      <div className="w-full h-full flex flex-col justify-between bg-[#F7F6F1]" data-node-id="29:75">
        <div>
          <StatusBar offlineMode={offlineMode} />
          <div className="px-6 pt-3 pb-2 flex items-center justify-between">
            <button
              type="button"
              onClick={() => onNavigate('tela-06')}
              className="p-1 -ml-1 text-[#1A1A1A]"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <div className="flex items-center gap-1.5">
              <span className="w-9 h-1 rounded-full bg-[#3B6D11]" />
              <span className="w-9 h-1 rounded-full bg-[#3B6D11]" />
              <span className="w-9 h-1 rounded-full bg-[#3B6D11]" />
            </div>
            <span className="text-[11px] font-medium text-[#5F5E5A]">3 de 3</span>
          </div>
        </div>

        <div className="px-6 flex-1 overflow-y-auto py-2 space-y-4">
          <div>
            <h1 className="text-[26px] font-extrabold text-[#1A1A1A] leading-tight">
              Cadastre sua fazenda
            </h1>
            <p className="text-[13px] text-[#5F5E5A] mt-1">
              Como você prefere desenhar os limites?
            </p>
          </div>

          {/* Card 1: Desenhar no mapa */}
          <div
            onClick={() => setMappingMethod('DRAW_POLYGON')}
            className={`relative p-4 rounded-2xl bg-white border-2 cursor-pointer transition ${
              mappingMethod === 'DRAW_POLYGON'
                ? 'border-[#3B6D11] shadow-sm'
                : 'border-[#E5E3DC]'
            }`}
          >
            <span className="absolute -top-2.5 right-4 px-2.5 py-0.5 rounded-full bg-[#3B6D11] text-white text-[9px] font-bold tracking-wider">
              RECOMENDADO
            </span>
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-2xl bg-[#EAF2E2] flex items-center justify-center shrink-0">
                <svg viewBox="0 0 48 48" className="w-10 h-10">
                  <polygon
                    points="10,14 36,10 40,34 14,38"
                    fill="#3B6D11"
                    fillOpacity="0.25"
                    stroke="#3B6D11"
                    strokeWidth="2.5"
                  />
                  <circle cx="10" cy="14" r="3.5" fill="#3B6D11" />
                  <circle cx="36" cy="10" r="3.5" fill="#3B6D11" />
                  <circle cx="40" cy="34" r="3.5" fill="#3B6D11" />
                  <circle cx="14" cy="38" r="3.5" fill="#3B6D11" />
                </svg>
              </div>
              <div className="flex-1">
                <h3 className="font-bold text-[16px] text-[#1A1A1A]">Desenhar no mapa</h3>
                <p className="text-[12px] text-[#5F5E5A] mt-1 leading-snug">
                  Toque nos cantos da sua propriedade pra criar o polígono.
                </p>
              </div>
            </div>
          </div>

          {/* Card 2: Já tenho o CAR */}
          <div
            onClick={() => setMappingMethod('IMPORT_CAR')}
            className={`p-4 rounded-2xl bg-white border-2 cursor-pointer transition ${
              mappingMethod === 'IMPORT_CAR'
                ? 'border-[#3B6D11] shadow-sm'
                : 'border-[#E5E3DC]'
            }`}
          >
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-2xl bg-[#F7F6F1] flex items-center justify-center shrink-0 text-[#3B6D11]">
                <FileText className="w-8 h-8" />
              </div>
              <div className="flex-1">
                <h3 className="font-bold text-[16px] text-[#1A1A1A]">Já tenho o CAR</h3>
                <p className="text-[12px] text-[#5F5E5A] mt-1 leading-snug">
                  Insira o código do Cadastro Ambiental Rural e a gente importa os limites.
                </p>
              </div>
            </div>

            {mappingMethod === 'IMPORT_CAR' && (
              <div className="mt-3 pt-3 border-t border-[#E5E3DC]" onClick={(e) => e.stopPropagation()}>
                <label className="block text-[10px] font-bold text-[#5F5E5A] mb-1">
                  CÓDIGO DO RECIBO CAR (SICAR)
                </label>
                <input
                  type="text"
                  value={carInput}
                  onChange={(e) => setCarInput(e.target.value)}
                  className="w-full h-9 px-3 rounded-lg bg-[#F7F6F1] border border-[#3B6D11] text-[11px] font-mono text-[#1A1A1A]"
                />
              </div>
            )}
          </div>
        </div>

        <div className="px-6 pb-2">
          <button
            type="button"
            onClick={handleConfirmFarm}
            className="w-full py-3.5 rounded-2xl bg-[#3B6D11] hover:bg-[#2F590D] text-white font-bold text-[15px] transition"
          >
            Continuar
          </button>
          <button
            type="button"
            onClick={() => onNavigate('tela-08')}
            className="w-full py-2 text-[13px] font-medium text-[#5F5E5A]"
          >
            Faço isso depois
          </button>
          <HomeIndicatorOnly />
        </div>
      </div>
    );
  }

  // ==========================================================================
  // TELA 08 — CONFIRMAÇÃO DE CADASTRO DA FAZENDA
  // ==========================================================================
  if (screen === 'tela-08') {
    return (
      <div className="w-full h-full flex flex-col justify-between bg-[#F7F6F1]" data-node-id="2:2858">
        <StatusBar offlineMode={offlineMode} />

        <div className="px-6 flex-1 flex flex-col justify-center">
          <div className="w-16 h-16 rounded-full bg-[#3B6D11] text-white flex items-center justify-center mx-auto mb-4 shadow-md shadow-[#3B6D11]/25">
            <Check className="w-9 h-9 stroke-[2.5]" />
          </div>

          <h1 className="text-[26px] font-extrabold text-[#1A1A1A] text-center">
            Pronto, {producer.fullName.split(' ')[0]}!
          </h1>
          <p className="text-[13px] text-[#5F5E5A] text-center mt-1.5">
            Sua fazenda já está no radar dos satélites. Vamos te mostrar como funciona.
          </p>

          <div className="mt-6 bg-white rounded-3xl p-5 border border-[#E5E3DC] shadow-sm">
            <span className="text-[10px] font-bold tracking-wider text-[#3B6D11] bg-[#EAF2E2] px-2.5 py-1 rounded-full">
              PROPRIEDADE CADASTRADA
            </span>
            <h2 className="text-[20px] font-extrabold text-[#1A1A1A] mt-2.5">{farm.name}</h2>
            <p className="text-[11px] font-mono text-[#5F5E5A] mt-0.5 truncate">
              CAR: {farm.carCode}
            </p>

            <div className="mt-4 pt-4 border-t border-[#E5E3DC] grid grid-cols-3 gap-2">
              <div>
                <p className="text-[10px] text-[#5F5E5A] font-semibold">ÁREA</p>
                <p className="text-[18px] font-extrabold text-[#1A1A1A]">
                  {farm.totalAreaHa.toString().replace('.', ',')}{' '}
                  <span className="text-[12px] font-normal text-[#5F5E5A]">ha</span>
                </p>
              </div>
              <div>
                <p className="text-[10px] text-[#5F5E5A] font-semibold">CULTURA</p>
                <p className="text-[13px] font-bold text-[#1A1A1A] mt-1">{producer.primaryCrop}</p>
              </div>
              <div>
                <p className="text-[10px] text-[#5F5E5A] font-semibold">LOCAL</p>
                <p className="text-[13px] font-bold text-[#1A1A1A] mt-1">
                  {producer.municipality} · {producer.state}
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="px-6 pb-2">
          <button
            type="button"
            onClick={() => onNavigate('tela-09')}
            className="w-full py-3.5 rounded-2xl bg-[#3B6D11] hover:bg-[#2F590D] text-white font-bold text-[15px] shadow-sm transition"
          >
            Entrar no SAFRA
          </button>
          <HomeIndicatorOnly />
        </div>
      </div>
    );
  }

  // ==========================================================================
  // TELA 33 — LISTA "MEUS TALHÕES"
  // ==========================================================================
  if (screen === 'tela-33') {
    return (
      <div className="w-full h-full flex flex-col justify-between bg-[#F7F6F1]" data-node-id="2:587">
        <div>
          <StatusBar offlineMode={offlineMode} />
          <TopSubHeader
            title="Meus talhões"
            onBack={() => onNavigate('tela-12')}
            rightBadge={`${plots.length} talhões`}
          />
        </div>

        <div className="px-4 py-3 flex-1 overflow-y-auto space-y-3">
          <p className="text-[12px] text-[#5F5E5A] px-1">
            {plots.length} talhões · {plots.reduce((acc, p) => acc + p.areaHa, 0).toFixed(1).replace('.', ',')} ha · {farm.name}
          </p>

          {/* Mini Overview Map */}
          <div className="w-full h-28 rounded-2xl bg-[#37472A] p-3 relative overflow-hidden">
            <svg viewBox="0 0 320 110" className="w-full h-full">
              <polygon points="30,15 110,10 120,65 40,75" fill="#CCA84C" stroke="#fff" strokeWidth="1.5" />
              <polygon points="110,10 205,16 210,65 120,65" fill="#4A7C25" stroke="#fff" strokeWidth="1.5" />
              <polygon points="120,65 210,65 225,102 135,102" fill="#5D8F36" stroke="#fff" strokeWidth="1.5" />
              <text x="62" y="45" fill="#fff" fontSize="10" fontWeight="bold">Norte</text>
              <text x="145" y="45" fill="#fff" fontSize="10" fontWeight="bold">Centro</text>
              <text x="165" y="88" fill="#fff" fontSize="10" fontWeight="bold">Sul</text>
            </svg>
          </div>

          {/* Plot Cards */}
          {plots.map((plot) => (
            <div
              key={plot.id}
              className="bg-white rounded-2xl p-4 border border-[#E5E3DC] shadow-sm space-y-3"
            >
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="font-bold text-[15px] text-[#1A1A1A]">{plot.name}</h3>
                  <p className="text-[11px] text-[#5F5E5A]">
                    {plot.crop} · {plot.areaHa.toString().replace('.', ',')} ha · plantio {plot.plantingYear}
                  </p>
                </div>
                <span
                  className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                    plot.status === 'ALERTA'
                      ? 'bg-[#FAECD8] text-[#854F0B]'
                      : 'bg-[#EAF2E2] text-[#3B6D11]'
                  }`}
                >
                  {plot.status === 'ALERTA' ? '1 ALERTA' : 'SAUDÁVEL'}
                </span>
              </div>

              <div className="grid grid-cols-2 gap-2 pt-2 border-t border-[#E5E3DC]">
                <div>
                  <p className="text-[9px] text-[#5F5E5A] font-semibold">NDVI</p>
                  <p className="text-[16px] font-extrabold text-[#3B6D11]">
                    {plot.currentNdvi.toFixed(2).replace('.', ',')}
                  </p>
                </div>
                <div>
                  <p className="text-[9px] text-[#5F5E5A] font-semibold">ÚLTIMA AÇÃO</p>
                  <p className="text-[13px] font-bold text-[#1A1A1A]">{plot.lastActionLabel}</p>
                </div>
              </div>

              <div className="flex items-center gap-2 pt-1">
                <button
                  type="button"
                  onClick={() => {
                    onSelectPlot(plot.id);
                    onNavigate('tela-10');
                  }}
                  className="flex-1 py-2 rounded-xl bg-[#EAF2E2] text-[#3B6D11] text-[11px] font-bold hover:bg-[#dce8d0] transition"
                >
                  Ver detalhes
                </button>
                <button
                  type="button"
                  onClick={() => {
                    onSelectPlot(plot.id);
                    setAlertPrefs(plot.alertPreferences);
                    onNavigate('tela-35');
                  }}
                  className="flex-1 py-2 rounded-xl bg-[#F7F6F1] text-[#1A1A1A] text-[11px] font-semibold border border-[#E5E3DC]"
                >
                  Configurar alertas
                </button>
                <button
                  type="button"
                  onClick={() => onNavigate('tela-34')}
                  className="py-2 px-2.5 rounded-xl bg-[#F7F6F1] text-[#5F5E5A] text-[11px] font-medium"
                >
                  Editar limites
                </button>
              </div>
            </div>
          ))}

          <button
            type="button"
            onClick={() => onNavigate('tela-34')}
            className="w-full py-3.5 rounded-2xl bg-[#3B6D11] text-white font-bold text-[14px] flex items-center justify-center gap-2 shadow-sm"
          >
            <Plus className="w-4 h-4" /> Adicionar talhão
          </button>
        </div>

        <HomeIndicatorOnly />
      </div>
    );
  }

  // ==========================================================================
  // TELA 34 — DESENHAR NOVO TALHÃO NO MAPA
  // ==========================================================================
  if (screen === 'tela-34') {
    const calculatedArea = Number((drawnPoints.length * 1.3).toFixed(1));

    const handleMapClick = (e: React.MouseEvent<SVGSVGElement>) => {
      const rect = e.currentTarget.getBoundingClientRect();
      const x = Math.round(((e.clientX - rect.left) / rect.width) * 340);
      const y = Math.round(((e.clientY - rect.top) / rect.height) * 210);
      setDrawnPoints([...drawnPoints, { x, y }]);
    };

    const handleSaveNewPlot = () => {
      const newPlot: PlotEntity = {
        id: `plot-${Date.now()}`,
        farmId: farm.id,
        name: newPlotName || 'Talhão Leste',
        shortName: (newPlotName || 'Leste').replace('Talhão ', ''),
        crop: producer.primaryCrop,
        areaHa: calculatedArea,
        plantingYear: 2024,
        plantingDateLabel: 'Jan/2024',
        ageYears: 2.0,
        currentNdvi: 0.79,
        ndviDelta30d: 0.03,
        status: 'SAUDAVEL',
        lastActionLabel: 'hoje',
        lastActionDetail: 'Mapeamento via satélite',
        polygonPoints: drawnPoints,
        ndviHistory: [
          { month: 'Dez', value6m: 0.75 },
          { month: 'Fev', value6m: 0.76 },
          { month: 'Abr', value6m: 0.78 },
          { month: 'Jun', value6m: 0.79 },
        ],
        alertPreferences: currentPlot.alertPreferences,
      };
      onAddPlot(newPlot);
      onNavigate('tela-33');
    };

    return (
      <div className="w-full h-full flex flex-col justify-between bg-[#F7F6F1]" data-node-id="2:2385">
        <div>
          <StatusBar offlineMode={offlineMode} />
          <TopSubHeader
            title="Desenhar talhão"
            onBack={() => onNavigate('tela-33')}
            rightBadge={`${drawnPoints.length} pontos`}
          />
        </div>

        <div className="px-4 py-3 flex-1 flex flex-col justify-between overflow-y-auto">
          <div>
            <p className="text-[12px] text-[#5F5E5A] mb-2">
              {drawnPoints.length} pontos · toque no mapa para marcar os cantos do talhão
            </p>

            {/* Interactive SVG Polygon Drawer */}
            <div className="relative rounded-2xl overflow-hidden border-2 border-[#3B6D11] bg-[#334425]">
              <svg
                viewBox="0 0 340 210"
                onClick={handleMapClick}
                className="w-full h-52 cursor-crosshair"
              >
                {/* Existing plots */}
                <polygon
                  points="22,30 98,24 108,95 30,104"
                  fill="#4A7C25"
                  fillOpacity="0.6"
                  stroke="#ffffff88"
                  strokeWidth="1.2"
                />
                <text x="48" y="65" fill="#fff" fontSize="10" fontWeight="bold">
                  Norte
                </text>

                <polygon
                  points="98,24 176,30 180,98 108,95"
                  fill="#6E9E48"
                  fillOpacity="0.6"
                  stroke="#ffffff88"
                  strokeWidth="1.2"
                />
                <text x="125" y="65" fill="#fff" fontSize="10" fontWeight="bold">
                  Centro
                </text>

                {/* Newly drawn polygon */}
                {drawnPoints.length >= 2 && (
                  <polygon
                    points={drawnPoints.map((p) => `${p.x},${p.y}`).join(' ')}
                    fill="#EF9F27"
                    fillOpacity="0.45"
                    stroke="#EF9F27"
                    strokeWidth="2.5"
                    strokeDasharray="4 2"
                  />
                )}
                {drawnPoints.map((pt, idx) => (
                  <circle
                    key={idx}
                    cx={pt.x}
                    cy={pt.y}
                    r="5"
                    fill="#FFFFFF"
                    stroke="#3B6D11"
                    strokeWidth="2.5"
                  />
                ))}
              </svg>

              <div className="absolute bottom-2.5 left-3 px-2.5 py-1 rounded-lg bg-black/65 text-white text-[11px] font-bold">
                Área calculada: {calculatedArea.toString().replace('.', ',')} ha
              </div>
            </div>

            <div className="mt-3 flex items-center gap-2">
              <button
                type="button"
                onClick={() => setDrawnPoints(drawnPoints.slice(0, -1))}
                disabled={drawnPoints.length === 0}
                className="flex-1 py-2 rounded-xl bg-white border border-[#E5E3DC] text-[12px] font-semibold text-[#1A1A1A] flex items-center justify-center gap-1.5 disabled:opacity-40"
              >
                <RotateCcw className="w-3.5 h-3.5" /> Desfazer
              </button>
              <button
                type="button"
                onClick={() => setDrawnPoints([])}
                className="flex-1 py-2 rounded-xl bg-white border border-[#E5E3DC] text-[12px] font-semibold text-[#E24B4A] flex items-center justify-center gap-1.5"
              >
                <Trash2 className="w-3.5 h-3.5" /> Limpar
              </button>
            </div>

            <div className="mt-4">
              <label className="block text-[10px] font-bold text-[#5F5E5A] mb-1">
                NOME DO TALHÃO
              </label>
              <input
                type="text"
                value={newPlotName}
                onChange={(e) => setNewPlotName(e.target.value)}
                className="w-full h-11 px-3.5 rounded-xl bg-white border border-[#E5E3DC] text-[13px] font-semibold text-[#1A1A1A]"
              />
            </div>
          </div>

          <button
            type="button"
            onClick={handleSaveNewPlot}
            disabled={drawnPoints.length < 3}
            className="w-full py-3.5 rounded-2xl bg-[#3B6D11] text-white font-bold text-[15px] mt-4 disabled:opacity-50"
          >
            Salvar talhão
          </button>
        </div>

        <HomeIndicatorOnly />
      </div>
    );
  }

  // ==========================================================================
  // TELA 35 — CONFIGURAR ALERTAS DO TALHÃO
  // ==========================================================================
  return (
    <div className="w-full h-full flex flex-col justify-between bg-[#F7F6F1]" data-node-id="2:2267">
      <div>
        <StatusBar offlineMode={offlineMode} />
        <TopSubHeader
          title="Alertas do talhão"
          onBack={() => onNavigate('tela-33')}
          rightBadge={currentPlot.shortName}
        />
      </div>

      <div className="px-4 py-3 flex-1 overflow-y-auto space-y-4">
        <div>
          <p className="text-[10px] font-bold tracking-wider text-[#5F5E5A] mb-2">
            TIPOS DE ALERTA
          </p>
          <div className="bg-white rounded-2xl border border-[#E5E3DC] divide-y divide-[#E5E3DC]">
            {[
              {
                key: 'pestAndDisease' as const,
                title: 'Pragas e doenças',
                sub: 'Broca, ferrugem, bicho-mineiro',
              },
              {
                key: 'ndviDropOver5Pct' as const,
                title: 'Queda de NDVI',
                sub: 'Avisar se cair mais de 5% em 7 dias',
              },
              {
                key: 'weatherAndRain' as const,
                title: 'Clima e chuva',
                sub: 'Geada, chuva forte, seca',
              },
              {
                key: 'nearbyFiresInpe' as const,
                title: 'Queimadas próximas',
                sub: 'Detecção INPE em até 15 km',
              },
            ].map((item) => (
              <div key={item.key} className="p-3.5 flex items-center justify-between">
                <div>
                  <p className="font-bold text-[13px] text-[#1A1A1A]">{item.title}</p>
                  <p className="text-[11px] text-[#5F5E5A]">{item.sub}</p>
                </div>
                <button
                  type="button"
                  onClick={() =>
                    setAlertPrefs({ ...alertPrefs, [item.key]: !alertPrefs[item.key] })
                  }
                  className={`w-11 h-6 rounded-full p-0.5 transition ${
                    alertPrefs[item.key] ? 'bg-[#3B6D11]' : 'bg-[#D3D1C7]'
                  }`}
                >
                  <div
                    className={`w-5 h-5 rounded-full bg-white shadow transition transform ${
                      alertPrefs[item.key] ? 'translate-x-5' : 'translate-x-0'
                    }`}
                  />
                </button>
              </div>
            ))}
          </div>
        </div>

        <div>
          <p className="text-[10px] font-bold tracking-wider text-[#5F5E5A] mb-2">
            FREQUÊNCIA DE VERIFICAÇÃO
          </p>
          <div className="grid grid-cols-3 gap-2">
            {[
              { id: '12h' as const, label: '12h', sub: 'Frequente' },
              { id: 'DAILY' as const, label: 'Diária', sub: 'Padrão' },
              { id: 'WEEKLY' as const, label: 'Semanal', sub: 'Resumo' },
            ].map((freq) => (
              <button
                key={freq.id}
                type="button"
                onClick={() => setAlertPrefs({ ...alertPrefs, checkFrequency: freq.id })}
                className={`p-2.5 rounded-xl border text-center transition ${
                  alertPrefs.checkFrequency === freq.id
                    ? 'bg-[#EAF2E2] border-[#3B6D11] text-[#3B6D11]'
                    : 'bg-white border-[#E5E3DC] text-[#1A1A1A]'
                }`}
              >
                <p className="font-bold text-[13px]">{freq.label}</p>
                <p className="text-[10px] text-[#5F5E5A]">{freq.sub}</p>
              </button>
            ))}
          </div>
        </div>

        <div>
          <p className="text-[10px] font-bold tracking-wider text-[#5F5E5A] mb-2">
            COMO QUER SER AVISADO
          </p>
          <div className="bg-white rounded-2xl border border-[#E5E3DC] divide-y divide-[#E5E3DC]">
            {[
              {
                key: 'notifyPush' as const,
                title: 'Notificação no celular',
                sub: 'Push instantâneo no app',
              },
              {
                key: 'notifyWhatsapp' as const,
                title: 'WhatsApp',
                sub: '(27) 99812-4530 · funciona offline',
              },
              {
                key: 'notifySmsCritical' as const,
                title: 'SMS',
                sub: 'Só para alertas críticos · 1 por dia no máx',
              },
            ].map((ch) => (
              <div key={ch.key} className="p-3 flex items-center justify-between">
                <div>
                  <p className="font-bold text-[13px] text-[#1A1A1A]">{ch.title}</p>
                  <p className="text-[11px] text-[#5F5E5A]">{ch.sub}</p>
                </div>
                <input
                  type="checkbox"
                  checked={alertPrefs[ch.key]}
                  onChange={() =>
                    setAlertPrefs({ ...alertPrefs, [ch.key]: !alertPrefs[ch.key] })
                  }
                  className="w-4 h-4 accent-[#3B6D11]"
                />
              </div>
            ))}
          </div>
        </div>

        <button
          type="button"
          onClick={() => {
            onUpdatePlotAlerts(currentPlot.id, alertPrefs);
            onNavigate('tela-33');
          }}
          className="w-full py-3.5 rounded-2xl bg-[#3B6D11] text-white font-bold text-[15px]"
        >
          Salvar preferências
        </button>
      </div>

      <HomeIndicatorOnly />
    </div>
  );
};
