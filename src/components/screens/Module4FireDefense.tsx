import React, { useState } from 'react';
import {
  FireRiskEntity,
  NeighborContactEntity,
  ScreenId,
} from '../../types/models';
import { HomeIndicatorOnly, StatusBar, TopSubHeader } from '../MobileShell';
import {
  AlertOctagon,
  Check,
  Droplets,
  Flame,
  PhoneCall,
  Plus,
  Send,
  ShieldAlert,
  Thermometer,
  Wind,
} from 'lucide-react';

interface Module4Props {
  screen: ScreenId;
  offlineMode: boolean;
  fireRisk: FireRiskEntity;
  neighbors: NeighborContactEntity[];
  onNavigate: (screen: ScreenId) => void;
  onToggleNeighbor: (id: string) => void;
  onUpdateFireRisk: (updated: FireRiskEntity) => void;
  onBroadcastFireAlert: () => void;
}

export const Module4FireDefense: React.FC<Module4Props> = ({
  screen,
  offlineMode,
  fireRisk,
  neighbors,
  onNavigate,
  onToggleNeighbor,
  onUpdateFireRisk,
  onBroadcastFireAlert,
}) => {
  const [actionNotifyNeighbors, setActionNotifyNeighbors] = useState(true);
  const [actionDefesaCivil, setActionDefesaCivil] = useState(fireRisk.notifyCivilDefense);
  const [actionFirebreaks, setActionFirebreaks] = useState(fireRisk.prepareFirebreaks);

  const selectedCount = neighbors.filter((n) => n.selected).length;

  // ==========================================================================
  // TELA 20 — ALERTA CRÍTICO DE QUEIMADA (INPE)
  // ==========================================================================
  if (screen === 'tela-20') {
    return (
      <div
        className="w-full h-full flex flex-col justify-between bg-gradient-to-b from-[#2A0E0C] via-[#1E0A08] to-[#160706] text-white"
        data-node-id="2:3086"
      >
        <StatusBar darkTheme offlineMode={offlineMode} />

        <div className="px-5 py-2 flex-1 flex flex-col justify-center space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#E24B4A] text-white text-[10px] font-extrabold tracking-wider w-fit">
            <Flame className="w-3.5 h-3.5 animate-pulse" /> ALERTA CRÍTICO
          </div>

          <div>
            <h1 className="text-[28px] font-extrabold leading-tight">
              Risco alto de
              <br />
              queimada agora
            </h1>
            <p className="text-[12.5px] text-white/75 mt-1">
              Próximas 6 horas · Linhares e região
            </p>
          </div>

          {/* 3 Weather Telemetry Boxes */}
          <div className="grid grid-cols-3 gap-2">
            <div className="p-3 rounded-2xl bg-white/10 border border-white/15">
              <p className="text-[9.5px] font-bold text-white/70">VENTO</p>
              <p className="text-[22px] font-extrabold text-white mt-0.5">
                {fireRisk.windSpeedKmh}{' '}
                <span className="text-[11px] font-normal">km/h</span>
              </p>
              <p className="text-[10px] text-[#EF9F27]">Norte</p>
            </div>
            <div className="p-3 rounded-2xl bg-white/10 border border-white/15">
              <p className="text-[9.5px] font-bold text-white/70">UMIDADE</p>
              <p className="text-[22px] font-extrabold text-[#E24B4A] mt-0.5">
                {fireRisk.humidityPct} <span className="text-[11px] font-normal">%</span>
              </p>
              <p className="text-[10px] text-white/75">Muito baixa</p>
            </div>
            <div className="p-3 rounded-2xl bg-white/10 border border-white/15">
              <p className="text-[9.5px] font-bold text-white/70">TEMP</p>
              <p className="text-[22px] font-extrabold text-[#EF9F27] mt-0.5">
                {fireRisk.temperatureC} <span className="text-[11px] font-normal">°C</span>
              </p>
              <p className="text-[10px] text-white/75">Calor extremo</p>
            </div>
          </div>

          {/* INPE Satellite Detection Card */}
          <div className="p-4 rounded-2xl bg-[#E24B4A]/20 border border-[#E24B4A]/50 space-y-1">
            <p className="font-extrabold text-[15px] text-white">
              {fireRisk.hotspotsCount} focos detectados pelo INPE
            </p>
            <p className="text-[12px] text-white/85">
              A {fireRisk.nearestDistanceKm} km da sua fazenda · há {fireRisk.detectedMinutesAgo} min
            </p>
            <p className="text-[11.5px] font-semibold text-[#EF9F27]">
              Vento sopra na sua direção
            </p>
          </div>

          <div className="space-y-2.5 pt-1">
            <button
              type="button"
              onClick={() => onNavigate('tela-21')}
              className="w-full py-3.5 rounded-2xl bg-[#E24B4A] hover:bg-[#d13c3b] text-white font-bold text-[15px] shadow-lg transition"
            >
              Ver detalhes e mapa
            </button>
            <button
              type="button"
              onClick={() => onNavigate('tela-22')}
              className="w-full py-3 rounded-2xl bg-white/15 hover:bg-white/25 text-white font-bold text-[14px] transition"
            >
              Avisar vizinhos
            </button>
          </div>

          <p className="text-[11px] text-center text-white/65">
            Sua fazenda ainda está segura · monitorando
          </p>
        </div>

        <HomeIndicatorOnly dark />
      </div>
    );
  }

  // ==========================================================================
  // TELA 21 — DETALHE DO RISCO DE QUEIMADA E MAPA DE FOCO
  // ==========================================================================
  if (screen === 'tela-21') {
    return (
      <div
        className="w-full h-full flex flex-col justify-between bg-[#F7F6F1]"
        data-node-id="2:1093"
      >
        <div className="bg-white shrink-0">
          <StatusBar offlineMode={offlineMode} />
          <TopSubHeader
            title="Risco de queimada"
            onBack={() => onNavigate('tela-20')}
          />
        </div>

        <div className="flex-1 overflow-y-auto">
          {/* Fire Map Vector */}
          <div className="relative w-full h-48 bg-[#3A4A28] overflow-hidden">
            <svg viewBox="0 0 360 190" className="w-full h-full">
              <path
                d="M0 45 Q 160 25, 360 50 M0 95 Q 180 75, 360 100 M0 145 Q 180 125, 360 150"
                fill="none"
                stroke="#ffffff1a"
                strokeWidth="1"
              />

              {/* Secondary hotspots */}
              <circle cx="58" cy="40" r="10" fill="#E24B4A" fillOpacity="0.35" />
              <circle cx="58" cy="40" r="5" fill="#E24B4A" />
              <circle cx="132" cy="34" r="10" fill="#EF9F27" fillOpacity="0.35" />
              <circle cx="132" cy="34" r="5" fill="#EF9F27" />

              {/* Primary hotspot 8 km away */}
              <g transform="translate(96, 74)">
                <circle cx="0" cy="0" r="16" fill="#E24B4A" fillOpacity="0.35" />
                <circle cx="0" cy="0" r="7" fill="#E24B4A" stroke="#fff" strokeWidth="1.5" />
              </g>
              <g transform="translate(66, 48)">
                <rect x="0" y="0" width="68" height="18" rx="9" fill="#FFFFFF" />
                <text x="34" y="12" textAnchor="middle" fill="#E24B4A" fontSize="9.5" fontWeight="bold">
                  Foco · 8 km
                </text>
              </g>

              {/* Dashed wind propagation line to Fazenda São Bento */}
              <line
                x1="96"
                y1="74"
                x2="180"
                y2="138"
                stroke="#FFFFFF"
                strokeWidth="1.8"
                strokeDasharray="4 4"
              />

              {/* Fazenda São Bento polygon */}
              <polygon
                points="148,118 220,114 216,162 152,164"
                fill="#5A8B38"
                stroke="#FFFFFF"
                strokeWidth="1.5"
              />
              <circle cx="184" cy="138" r="10" fill="#FFFFFF" />
              <text x="184" y="141.5" textAnchor="middle" fill="#3B6D11" fontSize="8.5" fontWeight="bold">
                JM
              </text>
              <text x="184" y="176" textAnchor="middle" fill="#FFFFFF" fontSize="9.5" fontWeight="bold">
                Fazenda São Bento
              </text>
            </svg>

            <button
              type="button"
              className="absolute top-3 right-3 w-8 h-8 rounded-lg bg-white shadow flex items-center justify-center text-[#1A1A1A]"
            >
              <Plus className="w-4 h-4" />
            </button>

            <div className="absolute bottom-2.5 left-3 px-2.5 py-1 rounded-full bg-black/65 text-white text-[10px] font-medium flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-[#E24B4A]" />
              focos ativos · vento ↓
            </div>
          </div>

          <div className="px-4 py-3 space-y-3">
            {/* Distance & Arrival Card */}
            <div className="bg-white rounded-2xl p-3.5 border border-[#E5E3DC] grid grid-cols-2 divide-x divide-[#E5E3DC] shadow-sm">
              <div className="pr-3">
                <p className="text-[9.5px] font-bold text-[#5F5E5A]">FOCO MAIS PRÓXIMO</p>
                <p className="text-[22px] font-extrabold text-[#E24B4A] mt-0.5">
                  {fireRisk.nearestDistanceKm} km
                </p>
                <p className="text-[11px] text-[#5F5E5A]">{fireRisk.windDirection}</p>
              </div>
              <div className="pl-4">
                <p className="text-[9.5px] font-bold text-[#5F5E5A]">CHEGA EM</p>
                <p className="text-[22px] font-extrabold text-[#EF9F27] mt-0.5">
                  ~ {fireRisk.estimatedArrivalHours}h
                </p>
                <p className="text-[11px] text-[#5F5E5A]">Se vento mantiver</p>
              </div>
            </div>

            {/* Action Checklist */}
            <div>
              <h3 className="font-bold text-[13.5px] text-[#1A1A1A] mb-2">O que fazer agora</h3>
              <div className="space-y-2">
                <div
                  onClick={() => setActionNotifyNeighbors(!actionNotifyNeighbors)}
                  className="bg-white rounded-xl p-3 border border-[#E5E3DC] flex items-center gap-3 cursor-pointer"
                >
                  <input
                    type="checkbox"
                    checked={actionNotifyNeighbors}
                    onChange={() => {}}
                    className="w-4 h-4 accent-[#3B6D11]"
                  />
                  <div>
                    <p className="font-bold text-[12.5px] text-[#1A1A1A]">
                      Avisar 5 vizinhos cadastrados
                    </p>
                    <p className="text-[10.5px] text-[#5F5E5A]">SMS + WhatsApp em massa</p>
                  </div>
                </div>

                <div
                  onClick={() => setActionDefesaCivil(!actionDefesaCivil)}
                  className="bg-white rounded-xl p-3 border border-[#E5E3DC] flex items-center gap-3 cursor-pointer"
                >
                  <input
                    type="checkbox"
                    checked={actionDefesaCivil}
                    onChange={() => {}}
                    className="w-4 h-4 accent-[#3B6D11]"
                  />
                  <div>
                    <p className="font-bold text-[12.5px] text-[#1A1A1A]">
                      Acionar Defesa Civil (193)
                    </p>
                    <p className="text-[10.5px] text-[#5F5E5A]">Ligação direta · gratuita</p>
                  </div>
                </div>

                <div
                  onClick={() => setActionFirebreaks(!actionFirebreaks)}
                  className="bg-white rounded-xl p-3 border border-[#E5E3DC] flex items-center gap-3 cursor-pointer"
                >
                  <input
                    type="checkbox"
                    checked={actionFirebreaks}
                    onChange={() => {}}
                    className="w-4 h-4 accent-[#3B6D11]"
                  />
                  <div>
                    <p className="font-bold text-[12.5px] text-[#1A1A1A]">
                      Preparar aceiros próximos
                    </p>
                    <p className="text-[10.5px] text-[#5F5E5A]">
                      Faixas limpas ao redor do plantio
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <button
              type="button"
              onClick={() => onNavigate('tela-22')}
              className="w-full py-3.5 rounded-2xl bg-[#E24B4A] hover:bg-[#cf3c3b] text-white font-bold text-[15px] shadow-sm transition"
            >
              Avisar vizinhos agora
            </button>
          </div>
        </div>

        <HomeIndicatorOnly />
      </div>
    );
  }

  // ==========================================================================
  // TELA 22 — LISTA DE VIZINHOS PARA DISPARO EM MASSA
  // ==========================================================================
  if (screen === 'tela-22') {
    const handleSendBroadcast = () => {
      onBroadcastFireAlert();
      onNavigate('tela-23');
    };

    return (
      <div
        className="w-full h-full flex flex-col justify-between bg-[#F7F6F1]"
        data-node-id="2:892"
      >
        <div>
          <StatusBar offlineMode={offlineMode} />
          <TopSubHeader
            title="Avisar vizinhos"
            onBack={() => onNavigate('tela-21')}
            rightBadge="~4h"
            rightBadgeColor="amber"
          />
        </div>

        <div className="px-4 py-3 flex-1 overflow-y-auto space-y-3">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-bold text-[13.5px] text-[#E24B4A]">
                Risco de queimada em ~4h
              </p>
              <p className="text-[11px] text-[#5F5E5A]">Quanto antes avisar, melhor</p>
            </div>
          </div>

          {/* Message Box */}
          <div>
            <p className="text-[10px] font-bold tracking-wider text-[#5F5E5A] mb-1">
              MENSAGEM
            </p>
            <textarea
              rows={3}
              value={fireRisk.customMessage}
              onChange={(e) =>
                onUpdateFireRisk({ ...fireRisk, customMessage: e.target.value })
              }
              className="w-full p-3 rounded-2xl bg-white border border-[#E5E3DC] text-[11.5px] text-[#1A1A1A] leading-snug focus:border-[#3B6D11] focus:outline-none"
            />
          </div>

          {/* Recipients */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-[10px] font-bold tracking-wider text-[#5F5E5A]">
                DESTINATÁRIOS
              </span>
              <span className="text-[11px] font-bold text-[#3B6D11]">
                {selectedCount} selecionados
              </span>
            </div>

            <div className="bg-white rounded-2xl border border-[#E5E3DC] divide-y divide-[#E5E3DC]">
              {neighbors.map((n) => (
                <div
                  key={n.id}
                  onClick={() => onToggleNeighbor(n.id)}
                  className="p-2.5 flex items-center gap-3 cursor-pointer hover:bg-[#F7F6F1] transition"
                >
                  <div className="w-8 h-8 rounded-full bg-[#EAF2E2] text-[#3B6D11] text-[11px] font-bold flex items-center justify-center shrink-0">
                    {n.initials}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-bold text-[12.5px] text-[#1A1A1A] truncate">{n.name}</p>
                    <p className="text-[10.5px] text-[#5F5E5A] truncate">
                      {n.farmName} · {n.distanceKm.toString().replace('.', ',')} km
                    </p>
                  </div>
                  <input
                    type="checkbox"
                    checked={n.selected}
                    onChange={() => {}}
                    className="w-4 h-4 accent-[#3B6D11]"
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Civil Defense Automatic Toggle */}
          <div
            onClick={() =>
              onUpdateFireRisk({
                ...fireRisk,
                notifyCivilDefense: !fireRisk.notifyCivilDefense,
              })
            }
            className="bg-[#FCE8E8] rounded-2xl p-3 border border-[#E24B4A]/30 flex items-center justify-between cursor-pointer"
          >
            <div>
              <p className="font-bold text-[12.5px] text-[#1A1A1A]">Notificar Defesa Civil</p>
              <p className="text-[10.5px] text-[#5F5E5A]">
                Coordenadas + foto enviadas automaticamente
              </p>
            </div>
            <input
              type="checkbox"
              checked={fireRisk.notifyCivilDefense}
              onChange={() => {}}
              className="w-4 h-4 accent-[#E24B4A]"
            />
          </div>

          <button
            type="button"
            onClick={handleSendBroadcast}
            disabled={selectedCount === 0}
            className="w-full py-3.5 rounded-2xl bg-[#E24B4A] hover:bg-[#cf3c3b] text-white font-bold text-[15px] shadow-sm transition disabled:opacity-50"
          >
            Enviar para {selectedCount} vizinhos
          </button>
        </div>

        <HomeIndicatorOnly />
      </div>
    );
  }

  // ==========================================================================
  // TELA 23 — CONFIRMAÇÃO DE ENVIO E PROTOCOLO DEFESA CIVIL (#28452)
  // ==========================================================================
  return (
    <div
      className="w-full h-full flex flex-col justify-between bg-[#F7F6F1]"
      data-node-id="2:1947"
    >
      <StatusBar offlineMode={offlineMode} />

      <div className="px-4 py-3 flex-1 overflow-y-auto space-y-3.5">
        <div className="text-center pt-2">
          <div className="w-14 h-14 rounded-full bg-[#3B6D11] text-white flex items-center justify-center mx-auto mb-2.5 shadow-md">
            <Check className="w-8 h-8 stroke-[2.5]" />
          </div>
          <h1 className="text-[22px] font-extrabold text-[#1A1A1A]">
            {selectedCount} vizinhos notificados
          </h1>
          <p className="text-[12.5px] text-[#5F5E5A]">
            Defesa Civil também foi acionada · há 8 segundos
          </p>
        </div>

        <div>
          <p className="text-[10px] font-bold tracking-wider text-[#5F5E5A] mb-1.5">
            STATUS DOS ENVIOS
          </p>
          <div className="bg-white rounded-2xl border border-[#E5E3DC] divide-y divide-[#E5E3DC]">
            {neighbors.map((n) => (
              <div key={n.id} className="p-3 flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-full bg-[#EAF2E2] text-[#3B6D11] text-[11px] font-bold flex items-center justify-center">
                    {n.initials}
                  </div>
                  <div>
                    <p className="font-bold text-[12.5px] text-[#1A1A1A]">{n.name}</p>
                    <p className="text-[10.5px] text-[#5F5E5A]">
                      {n.deliveryChannel} ·{' '}
                      <span
                        className={
                          n.deliveryStatus === 'LIDO'
                            ? 'text-[#3B6D11] font-semibold'
                            : n.deliveryStatus === 'ENVIANDO'
                            ? 'text-[#EF9F27] font-semibold'
                            : 'text-[#5F5E5A]'
                        }
                      >
                        {n.deliveryStatus === 'LIDO'
                          ? 'lido ✓✓'
                          : n.deliveryStatus === 'ENVIANDO'
                          ? 'enviando...'
                          : 'entregue ✓'}
                      </span>
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-[#EAF2E2] rounded-2xl p-3.5 border border-[#3B6D11]/25 text-center">
          <p className="font-extrabold text-[13.5px] text-[#3B6D11]">
            Protocolo Defesa Civil: {fireRisk.civilDefenseProtocol}
          </p>
          <p className="text-[11.5px] text-[#5F5E5A] mt-0.5">
            Equipe a caminho da região afetada
          </p>
        </div>
      </div>

      <div className="px-4 pb-2">
        <button
          type="button"
          onClick={() => onNavigate('tela-21')}
          className="w-full py-3.5 rounded-2xl bg-[#3B6D11] hover:bg-[#2F590D] text-white font-bold text-[15px] transition"
        >
          Acompanhar foco no mapa
        </button>
        <HomeIndicatorOnly />
      </div>
    </div>
  );
};
