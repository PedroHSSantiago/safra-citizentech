import React, { useState } from 'react';
import {
  ApiRequestLog,
  OfflineSyncQueueItem,
  ScreenId,
} from '../types/models';
import { SCREEN_CATALOG } from '../data/seedData';
import { SAFRA_BACKEND_CONTRACT } from '../services/api';
import {
  CheckCircle2,
  Cloud,
  Cpu,
  Database,
  GitBranch,
  Layers,
  Play,
  RefreshCw,
  Server,
  ShieldCheck,
  Smartphone,
  Terminal,
  Wifi,
  WifiOff,
} from 'lucide-react';

interface InspectorProps {
  currentScreen: ScreenId;
  offlineMode: boolean;
  apiLogs: ApiRequestLog[];
  syncQueue: OfflineSyncQueueItem[];
  onNavigate: (screen: ScreenId) => void;
  onToggleOffline: (offline: boolean) => void;
  onSyncPending: () => void;
}

export const CitizenTechInspector: React.FC<InspectorProps> = ({
  currentScreen,
  offlineMode,
  apiLogs,
  syncQueue,
  onNavigate,
  onToggleOffline,
  onSyncPending,
}) => {
  const [activeTab, setActiveTab] = useState<'SCREENS' | 'BACKEND' | 'FIAP_GS'>('SCREENS');
  const [selectedModuleFilter, setSelectedModuleFilter] = useState<number | 'ALL'>('ALL');

  const currentMeta =
    SCREEN_CATALOG.find((s) => s.id === currentScreen) || SCREEN_CATALOG[0];
  const pendingSyncCount = syncQueue.filter((i) => i.status === 'PENDING_OFFLINE').length;

  const filteredScreens =
    selectedModuleFilter === 'ALL'
      ? SCREEN_CATALOG
      : SCREEN_CATALOG.filter((s) => s.moduleId === selectedModuleFilter);

  return (
    <div className="flex-1 max-w-[640px] bg-[#192E18]/90 backdrop-blur-md border border-white/10 rounded-3xl p-5 text-white flex flex-col h-[852px] overflow-hidden shadow-2xl">
      {/* Top Header */}
      <div className="flex items-center justify-between pb-3.5 border-b border-white/10 shrink-0">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2 py-0.5 rounded-full bg-[#689F28]/25 text-[#A4D65E] text-[10px] font-extrabold tracking-wider">
              FIAP GLOBAL SOLUTION · CITIZENTECH
            </span>
            <span className="text-[11px] text-white/60">2TDS · 2026</span>
          </div>
          <h2 className="text-[18px] font-extrabold mt-1">
            SAFRA — Painel de Controle & Integração Backend
          </h2>
        </div>

        {/* Connectivity Pill */}
        <button
          type="button"
          onClick={() => onToggleOffline(!offlineMode)}
          className={`px-3 py-1.5 rounded-xl text-[11px] font-bold flex items-center gap-1.5 border transition ${
            offlineMode
              ? 'bg-[#EF9F27]/20 border-[#EF9F27] text-[#EF9F27]'
              : 'bg-[#3B6D11]/40 border-[#689F28] text-[#A4D65E]'
          }`}
        >
          {offlineMode ? (
            <>
              <WifiOff className="w-3.5 h-3.5" /> Modo Offline (Room DB)
            </>
          ) : (
            <>
              <Wifi className="w-3.5 h-3.5" /> Online (REST Ready)
            </>
          )}
        </button>
      </div>

      {/* Main Inspector Tabs */}
      <div className="grid grid-cols-3 gap-2 my-3 shrink-0">
        <button
          type="button"
          onClick={() => setActiveTab('SCREENS')}
          className={`py-2 px-3 rounded-xl text-[12px] font-bold flex items-center justify-center gap-1.5 transition ${
            activeTab === 'SCREENS'
              ? 'bg-[#689F28] text-white shadow'
              : 'bg-white/5 text-white/70 hover:bg-white/10'
          }`}
        >
          <Smartphone className="w-3.5 h-3.5" /> 35 Telas Figma
        </button>
        <button
          type="button"
          onClick={() => setActiveTab('BACKEND')}
          className={`py-2 px-3 rounded-xl text-[12px] font-bold flex items-center justify-center gap-1.5 transition ${
            activeTab === 'BACKEND'
              ? 'bg-[#689F28] text-white shadow'
              : 'bg-white/5 text-white/70 hover:bg-white/10'
          }`}
        >
          <Database className="w-3.5 h-3.5" /> API & Banco ({pendingSyncCount})
        </button>
        <button
          type="button"
          onClick={() => setActiveTab('FIAP_GS')}
          className={`py-2 px-3 rounded-xl text-[12px] font-bold flex items-center justify-center gap-1.5 transition ${
            activeTab === 'FIAP_GS'
              ? 'bg-[#689F28] text-white shadow'
              : 'bg-white/5 text-white/70 hover:bg-white/10'
          }`}
        >
          <Layers className="w-3.5 h-3.5" /> Requisitos GS PDF
        </button>
      </div>

      {/* ==================================================================== */}
      {/* TAB 1: NAVEGADOR DAS 35 TELAS DO FIGMA                               */}
      {/* ==================================================================== */}
      {activeTab === 'SCREENS' && (
        <div className="flex-1 flex flex-col min-h-0">
          {/* Active Screen Info Bar */}
          <div className="p-3 rounded-2xl bg-white/5 border border-white/10 mb-3 flex items-center justify-between shrink-0">
            <div>
              <p className="text-[10px] text-[#A4D65E] font-bold uppercase">
                {currentMeta.moduleName}
              </p>
              <p className="text-[13.5px] font-bold text-white">{currentMeta.title}</p>
            </div>
            <span className="px-2.5 py-1 rounded-lg bg-black/30 font-mono text-[11px] text-white/75">
              Node {currentMeta.figmaNodeId}
            </span>
          </div>

          {/* Module Filter Pills */}
          <div className="flex flex-wrap gap-1.5 mb-3 shrink-0">
            {[
              { id: 'ALL' as const, label: 'Todas (35)' },
              { id: 1, label: 'Mód 1 · Cadastro/Talhões (11)' },
              { id: 2, label: 'Mód 2 · Home/NDVI (5)' },
              { id: 3, label: 'Mód 3 · Pragas Embrapa (6)' },
              { id: 4, label: 'Mód 4 · Queimadas (4)' },
              { id: 5, label: 'Mód 5 · Score/Crédito (6)' },
              { id: 6, label: 'Mód 6 · Voz IA (3)' },
            ].map((m) => (
              <button
                key={String(m.id)}
                type="button"
                onClick={() => setSelectedModuleFilter(m.id)}
                className={`px-2.5 py-1 rounded-lg text-[10.5px] font-semibold transition ${
                  selectedModuleFilter === m.id
                    ? 'bg-white text-[#192E18] font-bold'
                    : 'bg-white/10 text-white/75 hover:bg-white/15'
                }`}
              >
                {m.label}
              </button>
            ))}
          </div>

          {/* Grid of 35 Screens */}
          <div className="flex-1 overflow-y-auto pr-1 grid grid-cols-2 gap-2">
            {filteredScreens.map((item) => {
              const active = item.id === currentScreen;
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => onNavigate(item.id)}
                  className={`p-2.5 rounded-xl border text-left transition flex flex-col justify-between ${
                    active
                      ? 'bg-[#689F28]/30 border-[#A4D65E] text-white'
                      : 'bg-white/5 border-white/10 text-white/80 hover:bg-white/10'
                  }`}
                >
                  <div className="flex items-center justify-between w-full mb-1">
                    <span className="text-[10px] font-mono text-[#A4D65E] font-bold">
                      {item.id.toUpperCase()}
                    </span>
                    <span className="text-[9px] text-white/50 font-mono">
                      #{item.figmaNodeId}
                    </span>
                  </div>
                  <p className="text-[11.5px] font-semibold leading-snug line-clamp-1">
                    {item.title.replace(/^\d+\s·\s/, '')}
                  </p>
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* ==================================================================== */}
      {/* TAB 2: INTEGRAÇÃO BACKEND SPRING BOOT & BANCO DE DADOS OFFLINE-FIRST */}
      {/* ==================================================================== */}
      {activeTab === 'BACKEND' && (
        <div className="flex-1 overflow-y-auto pr-1 space-y-3.5">
          {/* Base URL & Sync Action */}
          <div className="p-3.5 rounded-2xl bg-white/5 border border-white/10 space-y-2.5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Server className="w-4 h-4 text-[#A4D65E]" />
                <span className="text-[12px] font-bold">
                  Endpoint API Spring Boot (Configurável via .env)
                </span>
              </div>
              <span className="px-2 py-0.5 rounded bg-[#689F28]/25 text-[#A4D65E] text-[10px] font-mono">
                REST / JSON
              </span>
            </div>

            <div className="p-2 rounded-lg bg-black/40 font-mono text-[11px] text-white/85">
              VITE_API_BASE_URL={SAFRA_BACKEND_CONTRACT.baseUrl}
            </div>

            <div className="flex items-center justify-between pt-1">
              <span className="text-[11px] text-white/70">
                Fila Offline-First (Room DB / LocalStorage):{' '}
                <strong className="text-[#EF9F27]">{pendingSyncCount} pendentes</strong>
              </span>
              <button
                type="button"
                onClick={onSyncPending}
                className="px-3 py-1.5 rounded-xl bg-[#689F28] hover:bg-[#588821] text-white text-[11px] font-bold flex items-center gap-1.5 transition"
              >
                <RefreshCw className="w-3.5 h-3.5" /> Sincronizar c/ Backend
              </button>
            </div>
          </div>

          {/* Live API Request Log */}
          <div>
            <div className="flex items-center gap-1.5 mb-2">
              <Terminal className="w-4 h-4 text-[#A4D65E]" />
              <span className="text-[11px] font-bold uppercase tracking-wider text-white/80">
                Log de Chamadas da Camada de Serviço (src/services/api.ts)
              </span>
            </div>
            <div className="space-y-1.5 max-h-56 overflow-y-auto pr-1">
              {apiLogs.map((log) => (
                <div
                  key={log.id}
                  className="p-2.5 rounded-xl bg-black/35 border border-white/10 text-[11px]"
                >
                  <div className="flex items-center justify-between mb-1">
                    <div className="flex items-center gap-1.5">
                      <span
                        className={`px-1.5 py-0.5 rounded font-mono text-[9.5px] font-bold ${
                          log.method === 'GET'
                            ? 'bg-blue-500/25 text-blue-300'
                            : 'bg-[#689F28]/30 text-[#A4D65E]'
                        }`}
                      >
                        {log.method}
                      </span>
                      <span className="font-mono text-white/90">{log.endpoint}</span>
                    </div>
                    <span className="text-[10px] text-white/50">
                      {log.mode === 'OFFLINE_ROOM_CACHE' ? 'OFFLINE DB' : 'REST 200'} ·{' '}
                      {log.timestamp}
                    </span>
                  </div>
                  <p className="text-white/75">{log.summary}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Database Entities Ready for MySQL / Oracle */}
          <div className="p-3.5 rounded-2xl bg-white/5 border border-white/10 space-y-2">
            <p className="text-[11px] font-bold uppercase tracking-wider text-[#A4D65E]">
              Tabelas Mapeadas (MySQL / Oracle DDL em docs/BACKEND_API_AND_DATABASE.sql)
            </p>
            <div className="grid grid-cols-2 gap-1.5 text-[11px] font-mono text-white/80">
              <div className="p-2 rounded bg-black/25">1. TB_PRODUTOR_RURAL</div>
              <div className="p-2 rounded bg-black/25">2. TB_PROPRIEDADE_CAR</div>
              <div className="p-2 rounded bg-black/25">3. TB_TALHAO_GEOMETRIA</div>
              <div className="p-2 rounded bg-black/25">4. TB_TELEMETRIA_NDVI</div>
              <div className="p-2 rounded bg-black/25">5. TB_ALERTA_PRAGA_IA</div>
              <div className="p-2 rounded bg-black/25">6. TB_AGENDAMENTO_MANEJO</div>
              <div className="p-2 rounded bg-black/25">7. TB_REDE_COMUNITARIA</div>
              <div className="p-2 rounded bg-black/25">8. TB_PROPOSTA_CREDITO</div>
            </div>
          </div>
        </div>
      )}

      {/* ==================================================================== */}
      {/* TAB 3: REQUISITOS DO PDF GLOBAL SOLUTION FIAP (PÁGS. 6 A 10)         */}
      {/* ==================================================================== */}
      {activeTab === 'FIAP_GS' && (
        <div className="flex-1 overflow-y-auto pr-1 space-y-3 text-[12px]">
          {/* 3 Cenários de Teste Interativos */}
          <div className="p-3.5 rounded-2xl bg-white/5 border border-white/10 space-y-2.5">
            <div className="flex items-center justify-between">
              <span className="font-bold text-[#A4D65E] uppercase text-[11px]">
                Item 6 do PDF · Cenários de Teste de Software (Executáveis)
              </span>
              <span className="text-[10px] text-white/60">Vitest + E2E UI</span>
            </div>

            {[
              {
                id: 'CT-01',
                title: 'CT-01: Alerta Antecipado de Praga (IA Embrapa) e Agendamento',
                input:
                  'Talhão Norte (6,2 ha), Temp. 24°C por 8 dias, Umidade 70-85%, Estágio Chumbinho; seleção de Beauveria bassiana para 19/mai (vento 6 km/h).',
                expected:
                  'Gera plano de 4 passos, calcula custo estimado R$ 1.116,00 e incrementa +12 pontos no Score Agro+ (742 → 754).',
                targetScreen: 'tela-15' as ScreenId,
              },
              {
                id: 'CT-02',
                title: 'CT-02: Defesa Comunitária Contra Queimadas (INPE + 193)',
                input:
                  'Detecção de 3 focos pelo INPE a 8 km (vento 28 km/h NNE, umidade 24%) + seleção de 5 propriedades vizinhas.',
                expected:
                  'Dispara alerta em massa via SMS/WhatsApp para os 5 vizinhos e gera protocolo automático #28452 na Defesa Civil (193).',
                targetScreen: 'tela-20' as ScreenId,
              },
              {
                id: 'CT-03',
                title: 'CT-03: Simulação e Contratação de Microcrédito Rural (AgroAvali)',
                input:
                  'Score Agro+ 742, linha Pronaf Agrolend (8,5% a.a.), valor solicitado R$ 18.000 em 24 parcelas com 8 meses de carência.',
                expected:
                  'Calcula parcela de R$ 856,33/mês (total R$ 20.551,92, IOF R$ 0,00) e libera +25 pontos no Score Agro+ após aprovação.',
                targetScreen: 'tela-27' as ScreenId,
              },
            ].map((ct) => (
              <div
                key={ct.id}
                className="p-3 rounded-xl bg-black/30 border border-white/10 space-y-1.5"
              >
                <div className="flex items-center justify-between">
                  <span className="font-bold text-white text-[12px]">{ct.title}</span>
                  <button
                    type="button"
                    onClick={() => onNavigate(ct.targetScreen)}
                    className="px-2.5 py-1 rounded-lg bg-[#689F28] text-white text-[10px] font-bold flex items-center gap-1 shrink-0"
                  >
                    <Play className="w-3 h-3" /> Testar na UI
                  </button>
                </div>
                <p className="text-[11px] text-white/75">
                  <strong>Entrada:</strong> {ct.input}
                </p>
                <p className="text-[11px] text-[#A4D65E]">
                  <strong>Resultado Esperado:</strong> {ct.expected}
                </p>
              </div>
            ))}
          </div>

          {/* DevOps, Cloud & IA Summary */}
          <div className="grid grid-cols-2 gap-2.5">
            <div className="p-3 rounded-2xl bg-white/5 border border-white/10 space-y-1">
              <div className="flex items-center gap-1.5 text-[#A4D65E] font-bold text-[11px]">
                <GitBranch className="w-3.5 h-3.5" /> Item 4 · DevOps CI/CD
              </div>
              <p className="text-[11px] text-white/75 leading-relaxed">
                GitHub + GitFlow (<code className="text-white">main</code>,{' '}
                <code className="text-white">develop</code>,{' '}
                <code className="text-white">feature/*</code>). Pipeline GitHub Actions (
                <code className="text-white">.github/workflows/ci-cd.yml</code>) com build,
                lint, testes automatizados Vitest e deploy contínuo com aprovação manual para
                produção.
              </p>
            </div>

            <div className="p-3 rounded-2xl bg-white/5 border border-white/10 space-y-1">
              <div className="flex items-center gap-1.5 text-[#A4D65E] font-bold text-[11px]">
                <Cloud className="w-3.5 h-3.5" /> Item 5 · Arquitetura Cloud
              </div>
              <p className="text-[11px] text-white/75 leading-relaxed">
                Containers em Cloud (AWS ECS / Azure Container Apps) c/ Auto-Scaling; Banco
                Relacional Multi-AZ (RDS MySQL / Oracle Autonomous); S3/Blob Storage para
                recortes GeoTIFF de satélite e recibos CAR.
              </p>
            </div>
          </div>

          <div className="p-3 rounded-2xl bg-white/5 border border-white/10 space-y-1">
            <div className="flex items-center gap-1.5 text-[#A4D65E] font-bold text-[11px]">
              <Cpu className="w-3.5 h-3.5" /> Item 7 · Inteligência Artificial & ODS ONU
            </div>
            <p className="text-[11px] text-white/75 leading-relaxed">
              <strong>IA Preditiva + Assistente de Voz NLP:</strong> Cruza séries temporais de
              NDVI (Sentinel-2/Landsat), clima e fenologia da Embrapa para prever surtos de
              pragas com 7–14 dias de antecedência, traduzindo para voz coloquial com proteção
              LGPD. Alinhado aos <strong>ODS 2, 8, 9, 11 e 13</strong>.
            </p>
          </div>
        </div>
      )}
    </div>
  );
};
