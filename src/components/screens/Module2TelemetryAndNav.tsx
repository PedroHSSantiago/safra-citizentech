import React, { useState } from 'react';
import {
  AgroScoreBreakdownEntity,
  AlertEntity,
  FarmEntity,
  PlotEntity,
  ProducerEntity,
  ScreenId,
} from '../../types/models';
import { BottomNavBar, HomeIndicatorOnly, StatusBar, TopSubHeader } from '../MobileShell';
import {
  Bell,
  ChevronRight,
  Flame,
  History,
  MapPin,
  Minus,
  Plus,
  Settings,
  Share2,
  ShieldAlert,
  TrendingUp,
  Users,
} from 'lucide-react';

interface Module2Props {
  screen: ScreenId;
  offlineMode: boolean;
  producer: ProducerEntity;
  farm: FarmEntity;
  plots: PlotEntity[];
  selectedPlotId: string;
  alerts: AlertEntity[];
  agroScore: AgroScoreBreakdownEntity;
  onNavigate: (screen: ScreenId) => void;
  onSelectPlot: (plotId: string) => void;
  onToggleOffline: (offline: boolean) => void;
}

export const Module2TelemetryAndNav: React.FC<Module2Props> = ({
  screen,
  offlineMode,
  producer,
  farm,
  plots,
  selectedPlotId,
  alerts,
  agroScore,
  onNavigate,
  onSelectPlot,
  onToggleOffline,
}) => {
  const [chartRange, setChartRange] = useState<'3m' | '6m'>('6m');
  const [alertFilter, setAlertFilter] = useState<
    'TODOS' | 'CRITICOS' | 'PRAGAS' | 'CLIMA' | 'AGRO_PLUS'
  >('TODOS');
  const [notifCritical, setNotifCritical] = useState(true);
  const [notifPests, setNotifPests] = useState(true);
  const [notifAgro, setNotifAgro] = useState(true);

  const selectedPlot = plots.find((p) => p.id === selectedPlotId) || plots[0];
  const unreadCount = alerts.filter((a) => !a.read).length;

  // ==========================================================================
  // TELA 09 — HOME / MAPA NDVI AO VIVO
  // ==========================================================================
  if (screen === 'tela-09') {
    return (
      <div
        className="w-full h-full flex flex-col justify-between bg-[#F7F6F1]"
        data-node-id="2:1713"
      >
        {/* Top Status + Greeting Header */}
        <div className="bg-white border-b border-[#E5E3DC] shrink-0">
          <StatusBar offlineMode={offlineMode} />
          <div className="px-5 py-3 flex items-center justify-between">
            <div
              onClick={() => onNavigate('tela-12')}
              className="flex items-center gap-3 cursor-pointer"
            >
              <div className="w-10 h-10 rounded-full bg-[#EAF2E2] text-[#3B6D11] font-bold text-[14px] flex items-center justify-center">
                {producer.initials}
              </div>
              <div>
                <p className="text-[12px] text-[#5F5E5A] leading-tight">Bom dia,</p>
                <p className="text-[17px] font-bold text-[#1A1A1A] leading-tight">
                  {producer.fullName.split(' ').slice(0, 2).join(' ')}
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={() => onNavigate('tela-11')}
              className="relative w-10 h-10 rounded-full hover:bg-[#F7F6F1] flex items-center justify-center text-[#1A1A1A]"
              aria-label="Notificações"
            >
              <Bell className="w-5 h-5 stroke-[2]" />
              <span className="absolute top-1.5 right-1.5 w-4 h-4 rounded-full bg-[#E24B4A] text-white text-[9px] font-bold flex items-center justify-center">
                2
              </span>
            </button>
          </div>
        </div>

        {/* Scrollable Content */}
        <div className="px-4 py-3 flex-1 overflow-y-auto space-y-3">
          {/* Status Strip: NDVI / Satélite / Alertas */}
          <div className="bg-white rounded-2xl p-3.5 border border-[#E5E3DC] grid grid-cols-3 divide-x divide-[#E5E3DC] shadow-sm">
            <div className="pr-2">
              <p className="text-[10px] text-[#5F5E5A] font-medium">NDVI MÉDIO</p>
              <p className="text-[20px] font-extrabold text-[#3B6D11] leading-tight mt-0.5">
                {farm.averageNdvi.toFixed(2)}
              </p>
              <p className="text-[11px] text-[#5F5E5A]">Saudável</p>
            </div>
            <div className="px-3">
              <p className="text-[10px] text-[#5F5E5A] font-medium">PRÓX. SATÉLITE</p>
              <p className="text-[20px] font-extrabold text-[#1A1A1A] leading-tight mt-0.5">
                {farm.nextSatellitePassHours}h
              </p>
              <p className="text-[11px] text-[#5F5E5A]">{farm.satelliteName}</p>
            </div>
            <div
              onClick={() => onNavigate('tela-11')}
              className="pl-3 cursor-pointer hover:opacity-80"
            >
              <p className="text-[10px] text-[#5F5E5A] font-medium">ALERTAS</p>
              <p className="text-[20px] font-extrabold text-[#EF9F27] leading-tight mt-0.5">2</p>
              <p className="text-[11px] text-[#5F5E5A]">1 crítico</p>
            </div>
          </div>

          {/* Interactive NDVI Map Card */}
          <div className="bg-white rounded-2xl p-3.5 border border-[#E5E3DC] shadow-sm">
            <div className="flex items-center justify-between mb-2.5">
              <div>
                <h2 className="font-bold text-[14px] text-[#1A1A1A]">{farm.name}</h2>
                <p className="text-[11px] text-[#5F5E5A]">
                  {farm.totalAreaHa.toString().replace('.', ',')} ha · {farm.lastUpdatedLabel}
                </p>
              </div>
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#FCE8E8] text-[#E24B4A] text-[10px] font-bold">
                <span className="w-1.5 h-1.5 rounded-full bg-[#E24B4A] animate-ping" />
                AO VIVO
              </span>
            </div>

            {/* Satellite Map Canvas */}
            <div
              onClick={() => {
                onSelectPlot('plot-norte');
                onNavigate('tela-10');
              }}
              className="relative w-full h-44 rounded-xl bg-[#3A4A28] overflow-hidden cursor-pointer group"
            >
              <svg viewBox="0 0 320 185" className="w-full h-full">
                {/* Subtle contour lines */}
                <path
                  d="M0 45 Q 110 35, 320 55 M0 95 Q 150 85, 320 105 M0 145 Q 140 135, 320 155"
                  fill="none"
                  stroke="#ffffff18"
                  strokeWidth="1"
                />
                {/* Top-left healthy plot (Norte upper) */}
                <polygon
                  points="32,22 112,14 134,68 55,80"
                  fill="#487A24"
                  stroke="#FFFFFF"
                  strokeWidth="1.3"
                />
                {/* Top-center plot (Centro) */}
                <polygon
                  points="112,14 212,22 218,68 134,68"
                  fill="#679642"
                  stroke="#FFFFFF"
                  strokeWidth="1.3"
                />
                {/* Right plot */}
                <polygon
                  points="220,24 298,35 292,98 220,70"
                  fill="#679642"
                  stroke="#FFFFFF"
                  strokeWidth="1.3"
                />
                {/* Bottom-left stressed plot (Norte lower with warning !) */}
                <polygon
                  points="55,80 134,68 154,136 70,148"
                  fill="#C5A349"
                  stroke="#FFFFFF"
                  strokeWidth="1.4"
                />
                {/* Bottom-center plot (Sul) */}
                <polygon
                  points="134,68 218,68 238,136 154,136"
                  fill="#487A24"
                  stroke="#FFFFFF"
                  strokeWidth="1.3"
                />

                {/* Plot Pills */}
                <g transform="translate(72, 34)">
                  <rect x="0" y="0" width="46" height="16" rx="8" fill="#FFFFFF" />
                  <text x="23" y="11" textAnchor="middle" fill="#1A1A1A" fontSize="9.5" fontWeight="bold">
                    Norte
                  </text>
                </g>
                <g transform="translate(158, 38)">
                  <rect x="0" y="0" width="50" height="16" rx="8" fill="#FFFFFF" />
                  <text x="25" y="11" textAnchor="middle" fill="#1A1A1A" fontSize="9.5" fontWeight="bold">
                    Centro
                  </text>
                </g>

                {/* Alert marker on stressed area */}
                <g transform="translate(96, 102)">
                  <circle cx="0" cy="0" r="13" fill="#EF9F27" fillOpacity="0.35" />
                  <circle cx="0" cy="0" r="8.5" fill="#EF9F27" />
                  <text x="0" y="3.5" textAnchor="middle" fill="#FFFFFF" fontSize="11" fontWeight="bold">
                    !
                  </text>
                </g>
              </svg>
            </div>

            {/* Legend */}
            <div className="mt-2.5">
              <div className="flex items-center justify-between text-[9px] text-[#5F5E5A] mb-1">
                <span>Saudável</span>
                <span>Seco</span>
              </div>
              <div className="w-2/3 h-2 rounded-sm overflow-hidden grid grid-cols-4">
                <div className="bg-[#487A24]" />
                <div className="bg-[#679642]" />
                <div className="bg-[#C5A349]" />
                <div className="bg-[#A87042]" />
              </div>
            </div>
          </div>

          {/* Card: Sugestão da IA */}
          <div
            onClick={() => onNavigate('tela-15')}
            className="bg-[#FAECD8]/85 hover:bg-[#FAECD8] rounded-2xl p-3.5 border border-[#E8C99B] flex items-center gap-3 cursor-pointer transition"
          >
            <div className="w-10 h-10 rounded-full bg-white text-[#EF9F27] font-bold text-[18px] flex items-center justify-center shrink-0 shadow-sm">
              !
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-[10px] font-bold text-[#854F0B] tracking-wide">
                SUGESTÃO DA IA
              </p>
              <p className="text-[14px] font-bold text-[#1A1A1A] truncate">
                Talhão Norte com NDVI caindo
              </p>
              <p className="text-[12px] text-[#5F5E5A] truncate">
                Recomendamos vistoria nos próximos 3 dias
              </p>
            </div>
            <ChevronRight className="w-4 h-4 text-[#5F5E5A] shrink-0" />
          </div>

          {/* Card: Score Agro+ */}
          <div
            onClick={() => onNavigate('tela-24')}
            className="bg-[#EEEDFE] hover:bg-[#e4e2fc] rounded-2xl p-3.5 border border-[#C5C0F2] flex items-center gap-3 cursor-pointer transition"
          >
            <div className="w-10 h-10 rounded-full bg-[#534AB7] text-white font-bold text-[15px] flex items-center justify-center shrink-0">
              ₮
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-[10px] font-bold text-[#534AB7] tracking-wide">SCORE AGRO+</p>
              <p className="text-[13.5px] font-bold text-[#1A1A1A] truncate">
                Você tem {agroScore.totalScore} pontos. 3 ofertas abertas.
              </p>
              <p className="text-[12px] text-[#5F5E5A]">Veja crédito pré-aprovado</p>
            </div>
            <ChevronRight className="w-4 h-4 text-[#5F5E5A] shrink-0" />
          </div>
        </div>

        <BottomNavBar
          activeTab="MAPA"
          unreadAlertsCount={unreadCount}
          onNavigate={onNavigate}
        />
      </div>
    );
  }

  // ==========================================================================
  // TELA 10 — DETALHE DO TALHÃO NORTE
  // ==========================================================================
  if (screen === 'tela-10') {
    return (
      <div
        className="w-full h-full flex flex-col justify-between bg-[#F7F6F1]"
        data-node-id="2:2602"
      >
        <div className="bg-white shrink-0">
          <StatusBar offlineMode={offlineMode} />
          <TopSubHeader
            title={selectedPlot.name}
            onBack={() => onNavigate('tela-09')}
            showMore
            onMoreClick={() => onNavigate('tela-35')}
          />
        </div>

        <div className="flex-1 overflow-y-auto">
          {/* Zoomed Polygon Map */}
          <div className="relative w-full h-44 bg-[#3B4B2B] overflow-hidden">
            <svg viewBox="0 0 360 180" className="w-full h-full">
              <path
                d="M0 50 Q 180 40, 360 55 M0 120 Q 180 110, 360 125"
                stroke="#ffffff1a"
                strokeWidth="1"
                fill="none"
              />
              <polygon
                points="46,24 312,38 292,152 64,136"
                fill="#5E8C3E"
                stroke="#FFFFFF"
                strokeWidth="2"
              />
              <circle cx="46" cy="24" r="4" fill="#FFFFFF" />
              <circle cx="312" cy="38" r="4" fill="#FFFFFF" />
              <circle cx="292" cy="152" r="4" fill="#FFFFFF" />
              <circle cx="64" cy="136" r="4" fill="#FFFFFF" />

              {/* Stressed hotspots inside plot */}
              <circle cx="165" cy="75" r="26" fill="#C5A349" fillOpacity="0.85" />
              <g transform="translate(210, 108)">
                <circle cx="0" cy="0" r="20" fill="#D4883A" fillOpacity="0.55" />
                <circle cx="0" cy="0" r="12" fill="#EF9F27" />
                <text x="0" y="4" textAnchor="middle" fill="#fff" fontSize="12" fontWeight="bold">
                  !
                </text>
              </g>
            </svg>

            {/* Zoom buttons */}
            <div className="absolute top-3 right-3 flex flex-col gap-1.5">
              <button
                type="button"
                className="w-8 h-8 rounded-lg bg-white shadow flex items-center justify-center text-[#1A1A1A]"
              >
                <Plus className="w-4 h-4" />
              </button>
              <button
                type="button"
                className="w-8 h-8 rounded-lg bg-white shadow flex items-center justify-center text-[#1A1A1A]"
              >
                <Minus className="w-4 h-4" />
              </button>
            </div>
          </div>

          <div className="px-4 py-3 space-y-3">
            {/* Metrics Row */}
            <div className="bg-white rounded-2xl p-3.5 border border-[#E5E3DC] grid grid-cols-3 divide-x divide-[#E5E3DC] shadow-sm">
              <div className="pr-2">
                <p className="text-[10px] text-[#5F5E5A]">NDVI ATUAL</p>
                <div className="flex items-baseline gap-1 mt-0.5">
                  <span className="text-[22px] font-extrabold text-[#3B6D11]">
                    {selectedPlot.currentNdvi.toFixed(2)}
                  </span>
                  <span className="text-[10px] font-bold text-[#E24B4A]">
                    {selectedPlot.ndviDelta30d > 0 ? `+${selectedPlot.ndviDelta30d}` : selectedPlot.ndviDelta30d}
                  </span>
                </div>
                <p className="text-[11px] text-[#5F5E5A]">vs. 30 dias</p>
              </div>
              <div className="px-3">
                <p className="text-[10px] text-[#5F5E5A]">ÁREA</p>
                <p className="text-[22px] font-extrabold text-[#1A1A1A] mt-0.5">
                  {selectedPlot.areaHa.toString().replace('.', ',')}{' '}
                  <span className="text-[12px] font-normal text-[#5F5E5A]">ha</span>
                </p>
                <p className="text-[11px] text-[#5F5E5A]">{selectedPlot.crop}</p>
              </div>
              <div className="pl-3">
                <p className="text-[10px] text-[#5F5E5A]">PLANTIO</p>
                <p className="text-[22px] font-extrabold text-[#1A1A1A] mt-0.5">
                  {selectedPlot.ageYears.toString().replace('.', ',')}{' '}
                  <span className="text-[12px] font-normal text-[#5F5E5A]">anos</span>
                </p>
                <p className="text-[11px] text-[#5F5E5A]">{selectedPlot.plantingDateLabel}</p>
              </div>
            </div>

            {/* NDVI Evolution Chart */}
            <div className="bg-white rounded-2xl p-3.5 border border-[#E5E3DC] shadow-sm">
              <div className="flex items-center justify-between mb-2">
                <div>
                  <h3 className="font-bold text-[14px] text-[#1A1A1A]">Evolução NDVI</h3>
                  <p className="text-[11px] text-[#5F5E5A]">
                    Últimos {chartRange === '6m' ? '6 meses' : '3 meses'}
                  </p>
                </div>
                <div className="flex items-center gap-1 bg-[#F7F6F1] p-1 rounded-full">
                  {(['3m', '6m'] as const).map((r) => (
                    <button
                      key={r}
                      type="button"
                      onClick={() => setChartRange(r)}
                      className={`px-2.5 py-0.5 rounded-full text-[11px] font-semibold transition ${
                        chartRange === r
                          ? 'bg-[#3B6D11] text-white'
                          : 'text-[#5F5E5A] hover:text-[#1A1A1A]'
                      }`}
                    >
                      {r}
                    </button>
                  ))}
                </div>
              </div>

              <svg viewBox="0 0 300 90" className="w-full h-22">
                <path
                  d={
                    chartRange === '6m'
                      ? 'M 20 32 L 110 20 L 200 38 L 280 58 L 280 80 L 20 80 Z'
                      : 'M 20 26 L 110 34 L 200 44 L 280 58 L 280 80 L 20 80 Z'
                  }
                  fill="#EAF2E2"
                />
                <path
                  d={
                    chartRange === '6m'
                      ? 'M 20 32 L 110 20 L 200 38 L 280 58'
                      : 'M 20 26 L 110 34 L 200 44 L 280 58'
                  }
                  fill="none"
                  stroke="#3B6D11"
                  strokeWidth="2.2"
                />
                <circle cx="20" cy={chartRange === '6m' ? 32 : 26} r="3.5" fill="#3B6D11" />
                <circle cx="110" cy={chartRange === '6m' ? 20 : 34} r="3.5" fill="#3B6D11" />
                <circle cx="200" cy={chartRange === '6m' ? 38 : 44} r="3.5" fill="#3B6D11" />
                <circle cx="280" cy="58" r="4.5" fill="#FFFFFF" stroke="#E24B4A" strokeWidth="2.5" />
              </svg>

              <div className="grid grid-cols-4 text-center text-[9px] text-[#5F5E5A] mt-1">
                <span>Dez</span>
                <span>Fev</span>
                <span>Abr</span>
                <span>Jun</span>
              </div>
            </div>

            {/* Alert Card */}
            <div
              onClick={() => onNavigate('tela-15')}
              className="bg-[#FAECD8] rounded-2xl p-3.5 border border-[#E8C99B] flex items-center gap-3 cursor-pointer"
            >
              <div className="w-9 h-9 rounded-full bg-white text-[#EF9F27] font-bold flex items-center justify-center shrink-0">
                !
              </div>
              <div className="flex-1">
                <p className="font-bold text-[13px] text-[#1A1A1A]">Risco de broca-do-café</p>
                <p className="text-[11px] text-[#5F5E5A]">
                  Previsto em 9 dias · Toque para detalhes
                </p>
              </div>
              <ChevronRight className="w-4 h-4 text-[#5F5E5A]" />
            </div>

            {/* History */}
            <div className="pt-1">
              <h4 className="font-bold text-[14px] text-[#1A1A1A] mb-2">Últimas ações</h4>
              <div className="flex items-center gap-2.5">
                <span className="w-2.5 h-2.5 rounded-full bg-[#3B6D11]" />
                <div>
                  <p className="text-[12px] font-medium text-[#1A1A1A]">Pulverização preventiva</p>
                  <p className="text-[11px] text-[#5F5E5A]">{selectedPlot.lastActionLabel} · 4 ha</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <BottomNavBar
          activeTab="MAPA"
          unreadAlertsCount={unreadCount}
          onNavigate={onNavigate}
        />
      </div>
    );
  }

  // ==========================================================================
  // TELA 11 — CENTRAL DE ALERTAS
  // ==========================================================================
  if (screen === 'tela-11') {
    const filteredAlerts =
      alertFilter === 'TODOS'
        ? alerts
        : alerts.filter((a) => a.category === alertFilter);

    const todayAlerts = filteredAlerts.filter((a) => a.dayGroup === 'HOJE');
    const yesterdayAlerts = filteredAlerts.filter((a) => a.dayGroup === 'ONTEM');

    return (
      <div
        className="w-full h-full flex flex-col justify-between bg-[#F7F6F1]"
        data-node-id="2:3160"
      >
        <div className="bg-white border-b border-[#E5E3DC] shrink-0">
          <StatusBar offlineMode={offlineMode} />
          <div className="px-5 pt-2 pb-3">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-[22px] font-extrabold text-[#1A1A1A]">Alertas</h1>
                <p className="text-[11px] text-[#5F5E5A]">6 alertas · 1 crítico · 2 médios</p>
              </div>
              <button
                type="button"
                onClick={() => onNavigate('tela-14')}
                className="px-2.5 py-1 rounded-full bg-[#EAF2E2] text-[#3B6D11] text-[10px] font-bold"
              >
                Ver Push Lockscreen
              </button>
            </div>

            {/* Filter Pills */}
            <div className="flex items-center gap-1.5 mt-3 overflow-x-auto no-scrollbar">
              {[
                { id: 'TODOS' as const, label: 'Todos' },
                { id: 'CRITICOS' as const, label: 'Críticos' },
                { id: 'PRAGAS' as const, label: 'Pragas' },
                { id: 'CLIMA' as const, label: 'Clima' },
                { id: 'AGRO_PLUS' as const, label: 'Agro+' },
              ].map((pill) => (
                <button
                  key={pill.id}
                  type="button"
                  onClick={() => setAlertFilter(pill.id)}
                  className={`px-3 py-1 rounded-full text-[11px] font-semibold whitespace-nowrap transition ${
                    alertFilter === pill.id
                      ? 'bg-[#3B6D11] text-white'
                      : 'bg-[#F7F6F1] text-[#5F5E5A] border border-[#E5E3DC]'
                  }`}
                >
                  {pill.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="px-4 py-3 flex-1 overflow-y-auto space-y-4">
          {todayAlerts.length > 0 && (
            <div>
              <p className="text-[10px] font-bold tracking-wider text-[#5F5E5A] mb-2">HOJE</p>
              <div className="space-y-2.5">
                {todayAlerts.map((item) => (
                  <div
                    key={item.id}
                    onClick={() => onNavigate(item.targetScreen)}
                    className="bg-white rounded-2xl p-3.5 border border-[#E5E3DC] shadow-sm flex items-start justify-between cursor-pointer hover:border-[#3B6D11] transition"
                  >
                    <div className="space-y-1">
                      <span
                        className={`inline-block px-2 py-0.5 rounded-full text-[9px] font-bold ${
                          item.severity === 'CRITICO'
                            ? 'bg-[#FCE8E8] text-[#E24B4A]'
                            : item.severity === 'MEDIO'
                            ? 'bg-[#FAECD8] text-[#854F0B]'
                            : 'bg-[#EAF2E2] text-[#3B6D11]'
                        }`}
                      >
                        {item.severity === 'CRITICO'
                          ? 'CRÍTICO'
                          : item.severity === 'MEDIO'
                          ? 'MÉDIO'
                          : 'INFO'}
                      </span>
                      <p className="font-bold text-[14px] text-[#1A1A1A]">{item.title}</p>
                      <p className="text-[12px] text-[#5F5E5A]">{item.subtitle}</p>
                    </div>
                    <span className="text-[10px] text-[#5F5E5A] whitespace-nowrap">
                      {item.timeAgo}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {yesterdayAlerts.length > 0 && (
            <div>
              <p className="text-[10px] font-bold tracking-wider text-[#5F5E5A] mb-2">ONTEM</p>
              <div className="space-y-2.5">
                {yesterdayAlerts.map((item) => (
                  <div
                    key={item.id}
                    onClick={() => onNavigate(item.targetScreen)}
                    className="bg-white rounded-2xl p-3.5 border border-[#E5E3DC] shadow-sm flex items-start justify-between cursor-pointer hover:border-[#3B6D11] transition"
                  >
                    <div className="space-y-1">
                      <span
                        className={`inline-block px-2 py-0.5 rounded-full text-[9px] font-bold ${
                          item.severity === 'AGRO+'
                            ? 'bg-[#EEEDFE] text-[#534AB7]'
                            : 'bg-[#EAF2E2] text-[#3B6D11]'
                        }`}
                      >
                        {item.severity}
                      </span>
                      <p className="font-bold text-[14px] text-[#1A1A1A]">{item.title}</p>
                      <p className="text-[12px] text-[#5F5E5A]">{item.subtitle}</p>
                    </div>
                    <span className="text-[10px] text-[#5F5E5A]">{item.timeAgo}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        <BottomNavBar
          activeTab="ALERTAS"
          unreadAlertsCount={unreadCount}
          onNavigate={onNavigate}
        />
      </div>
    );
  }

  // ==========================================================================
  // TELA 12 — PERFIL DO PRODUTOR
  // ==========================================================================
  if (screen === 'tela-12') {
    return (
      <div
        className="w-full h-full flex flex-col justify-between bg-[#F7F6F1]"
        data-node-id="2:1833"
      >
        <div className="bg-white border-b border-[#E5E3DC] shrink-0">
          <StatusBar offlineMode={offlineMode} />
          <div className="px-5 py-3 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full bg-[#EAF2E2] text-[#3B6D11] font-extrabold text-[16px] flex items-center justify-center">
                {producer.initials}
              </div>
              <div>
                <h1 className="font-bold text-[17px] text-[#1A1A1A]">
                  {producer.fullName.split(' ').slice(0, 2).join(' ')}
                </h1>
                <p className="text-[12px] text-[#5F5E5A]">
                  {farm.name} · {producer.municipality}/{producer.state}
                </p>
                <span className="inline-block mt-1 px-2.5 py-0.5 rounded-full bg-[#EEEDFE] text-[#534AB7] text-[10px] font-bold">
                  Score Agro+ {agroScore.totalScore}
                </span>
              </div>
            </div>
            <button
              type="button"
              onClick={() => onNavigate('tela-13')}
              className="w-9 h-9 rounded-full bg-[#F7F6F1] flex items-center justify-center text-[#1A1A1A]"
              aria-label="Configurações"
            >
              <Settings className="w-4 h-4" />
            </button>
          </div>
        </div>

        <div className="px-4 py-3 flex-1 overflow-y-auto space-y-3">
          {/* Stats Strip */}
          <div className="bg-white rounded-2xl p-3.5 border border-[#E5E3DC] grid grid-cols-3 divide-x divide-[#E5E3DC] text-center shadow-sm">
            <div>
              <p className="text-[18px] font-extrabold text-[#3B6D11]">
                {farm.totalAreaHa.toString().replace('.', ',')}{' '}
                <span className="text-[11px] font-normal">ha</span>
              </p>
              <p className="text-[10px] text-[#5F5E5A]">monitorados</p>
              <p className="text-[10px] font-semibold text-[#3B6D11] mt-0.5">
                {plots.length} talhões
              </p>
            </div>
            <div>
              <p className="text-[18px] font-extrabold text-[#1A1A1A]">
                {producer.resolvedAlertsCount}
              </p>
              <p className="text-[10px] text-[#5F5E5A]">alertas</p>
              <p className="text-[10px] font-semibold text-[#5F5E5A] mt-0.5">resolvidos</p>
            </div>
            <div>
              <p className="text-[18px] font-extrabold text-[#1A1A1A]">
                {producer.monthsInSafra}
              </p>
              <p className="text-[10px] text-[#5F5E5A]">meses</p>
              <p className="text-[10px] font-semibold text-[#5F5E5A] mt-0.5">no SAFRA</p>
            </div>
          </div>

          {/* Menu Items */}
          <div className="bg-white rounded-2xl border border-[#E5E3DC] divide-y divide-[#E5E3DC] shadow-sm">
            {[
              {
                icon: <MapPin className="w-4 h-4 text-[#3B6D11]" />,
                title: 'Minha fazenda',
                sub: 'Talhões, limites e culturas',
                target: 'tela-33' as ScreenId,
              },
              {
                icon: <TrendingUp className="w-4 h-4 text-[#534AB7]" />,
                title: 'Score Agro+',
                sub: 'Crédito, ofertas e histórico',
                target: 'tela-24' as ScreenId,
              },
              {
                icon: <History className="w-4 h-4 text-[#3B6D11]" />,
                title: 'Histórico de ações',
                sub: 'Pulverizações, plantios, colheitas',
                target: 'tela-19' as ScreenId,
              },
              {
                icon: <Users className="w-4 h-4 text-[#E24B4A]" />,
                title: 'Vizinhos e defesa civil',
                sub: 'Rede de 12 contatos',
                target: 'tela-22' as ScreenId,
              },
              {
                icon: <Share2 className="w-4 h-4 text-[#EF9F27]" />,
                title: 'Convidar produtor',
                sub: 'Ganhe pontos no Agro+',
                target: 'tela-13' as ScreenId,
              },
            ].map((item) => (
              <button
                key={item.title}
                type="button"
                onClick={() => onNavigate(item.target)}
                className="w-full p-3.5 flex items-center gap-3 text-left hover:bg-[#F7F6F1] transition"
              >
                <div className="w-9 h-9 rounded-xl bg-[#F7F6F1] flex items-center justify-center shrink-0">
                  {item.icon}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-bold text-[13.5px] text-[#1A1A1A]">{item.title}</p>
                  <p className="text-[11px] text-[#5F5E5A]">{item.sub}</p>
                </div>
                <ChevronRight className="w-4 h-4 text-[#5F5E5A]" />
              </button>
            ))}
          </div>
        </div>

        <BottomNavBar
          activeTab="PERFIL"
          unreadAlertsCount={unreadCount}
          onNavigate={onNavigate}
        />
      </div>
    );
  }

  // ==========================================================================
  // TELA 13 — CONFIGURAÇÕES (INCLUINDO MODO OFFLINE-FIRST)
  // ==========================================================================
  return (
    <div
      className="w-full h-full flex flex-col justify-between bg-[#F7F6F1]"
      data-node-id="2:2116"
    >
      <div>
        <StatusBar offlineMode={offlineMode} />
        <TopSubHeader title="Configurações" onBack={() => onNavigate('tela-12')} />
      </div>

      <div className="px-4 py-3 flex-1 overflow-y-auto space-y-4">
        {/* Conta */}
        <div>
          <p className="text-[10px] font-bold tracking-wider text-[#5F5E5A] mb-1.5">CONTA</p>
          <div className="bg-white rounded-2xl border border-[#E5E3DC] divide-y divide-[#E5E3DC]">
            <div className="p-3 flex justify-between text-[13px]">
              <span className="text-[#5F5E5A]">Nome</span>
              <span className="font-semibold text-[#1A1A1A]">
                {producer.fullName.split(' ').slice(0, 2).join(' ')}
              </span>
            </div>
            <div className="p-3 flex justify-between text-[13px]">
              <span className="text-[#5F5E5A]">Telefone</span>
              <span className="font-semibold text-[#1A1A1A]">(27) 99812-4530</span>
            </div>
            <div className="p-3 flex justify-between text-[13px]">
              <span className="text-[#5F5E5A]">Município</span>
              <span className="font-semibold text-[#1A1A1A]">
                {producer.municipality} · {producer.state}
              </span>
            </div>
          </div>
        </div>

        {/* Notificações */}
        <div>
          <p className="text-[10px] font-bold tracking-wider text-[#5F5E5A] mb-1.5">
            NOTIFICAÇÕES
          </p>
          <div className="bg-white rounded-2xl border border-[#E5E3DC] divide-y divide-[#E5E3DC]">
            {[
              {
                label: 'Alertas críticos',
                sub: 'Queimadas, riscos imediatos',
                val: notifCritical,
                set: setNotifCritical,
              },
              {
                label: 'Pragas e doenças',
                sub: 'Previsões 7-14 dias',
                val: notifPests,
                set: setNotifPests,
              },
              {
                label: 'Ofertas de crédito Agro+',
                sub: 'Novas linhas pré-aprovadas',
                val: notifAgro,
                set: setNotifAgro,
              },
            ].map((item) => (
              <div key={item.label} className="p-3 flex items-center justify-between">
                <div>
                  <p className="font-bold text-[13px] text-[#1A1A1A]">{item.label}</p>
                  <p className="text-[11px] text-[#5F5E5A]">{item.sub}</p>
                </div>
                <button
                  type="button"
                  onClick={() => item.set(!item.val)}
                  className={`w-11 h-6 rounded-full p-0.5 transition ${
                    item.val ? 'bg-[#3B6D11]' : 'bg-[#D3D1C7]'
                  }`}
                >
                  <div
                    className={`w-5 h-5 rounded-full bg-white shadow transition transform ${
                      item.val ? 'translate-x-5' : 'translate-x-0'
                    }`}
                  />
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Preferências */}
        <div>
          <p className="text-[10px] font-bold tracking-wider text-[#5F5E5A] mb-1.5">
            PREFERÊNCIAS
          </p>
          <div className="bg-white rounded-2xl border border-[#E5E3DC] divide-y divide-[#E5E3DC]">
            <div className="p-3 flex justify-between text-[13px]">
              <span className="text-[#5F5E5A]">Idioma</span>
              <span className="font-semibold text-[#1A1A1A]">Português</span>
            </div>
            <div className="p-3 flex justify-between text-[13px]">
              <span className="text-[#5F5E5A]">Unidades</span>
              <span className="font-semibold text-[#1A1A1A]">Hectares · °C</span>
            </div>
            <div className="p-3 flex items-center justify-between">
              <div>
                <p className="font-bold text-[13px] text-[#1A1A1A]">Modo offline</p>
                <p className="text-[10px] text-[#5F5E5A]">
                  Salva dados localmente (Room DB) sem internet
                </p>
              </div>
              <button
                type="button"
                onClick={() => onToggleOffline(!offlineMode)}
                className={`w-11 h-6 rounded-full p-0.5 transition ${
                  offlineMode ? 'bg-[#3B6D11]' : 'bg-[#D3D1C7]'
                }`}
              >
                <div
                  className={`w-5 h-5 rounded-full bg-white shadow transition transform ${
                    offlineMode ? 'translate-x-5' : 'translate-x-0'
                  }`}
                />
              </button>
            </div>
          </div>
        </div>

        <button
          type="button"
          onClick={() => onNavigate('tela-01')}
          className="w-full py-3 rounded-2xl bg-white border border-[#E5E3DC] text-[#E24B4A] font-bold text-[13px]"
        >
          Sair da conta
        </button>
      </div>

      <HomeIndicatorOnly />
    </div>
  );
};
