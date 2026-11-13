import React, { useState } from 'react';
import {
  ActionPlanStepEntity,
  ActiveIngredientEntity,
  AgroScoreBreakdownEntity,
  ScreenId,
  SprayingScheduleEntity,
} from '../../types/models';
import { HomeIndicatorOnly, StatusBar, TopSubHeader } from '../MobileShell';
import {
  AlertTriangle,
  Calendar,
  Check,
  CloudRain,
  Droplets,
  ShieldAlert,
  Sparkles,
  Sun,
  Thermometer,
  Wind,
} from 'lucide-react';

interface Module3Props {
  screen: ScreenId;
  offlineMode: boolean;
  steps: ActionPlanStepEntity[];
  ingredients: ActiveIngredientEntity[];
  schedule: SprayingScheduleEntity;
  agroScore: AgroScoreBreakdownEntity;
  onNavigate: (screen: ScreenId) => void;
  onToggleStep: (stepNumber: number) => void;
  onConfirmSchedule: (updated: SprayingScheduleEntity) => void;
}

export const Module3PestsAndEmbrapa: React.FC<Module3Props> = ({
  screen,
  offlineMode,
  steps,
  ingredients,
  schedule,
  agroScore,
  onNavigate,
  onToggleStep,
  onConfirmSchedule,
}) => {
  const [ingFilter, setIngFilter] = useState<'TODOS' | 'BIOLOGICOS' | 'QUIMICOS' | 'ORGANICO'>(
    'TODOS'
  );
  const [selectedIngredientId, setSelectedIngredientId] = useState(schedule.ingredientId);
  const [selectedDay, setSelectedDay] = useState(schedule.dayOfMonth);
  const [selectedPeriod, setSelectedPeriod] = useState<'MANHA' | 'TARDE' | 'NOITE'>(
    schedule.period
  );

  const selectedIng =
    ingredients.find((i) => i.id === selectedIngredientId) || ingredients[0];

  // ==========================================================================
  // TELA 14 — PUSH NOTIFICATION LOCKSCREEN
  // ==========================================================================
  if (screen === 'tela-14') {
    return (
      <div
        className="w-full h-full flex flex-col justify-between bg-gradient-to-b from-[#162915] via-[#1E381C] to-[#122211] text-white select-none"
        data-node-id="2:3360"
      >
        <StatusBar darkTheme offlineMode={offlineMode} />

        <div className="px-5 flex-1 flex flex-col pt-8">
          <div className="text-center mb-8">
            <p className="text-[54px] font-light tracking-tight leading-none">9:41</p>
            <p className="text-[14px] text-white/80 mt-1">terça-feira, 12 de maio</p>
          </div>

          {/* SAFRA Push Card */}
          <div
            onClick={() => onNavigate('tela-15')}
            className="bg-white/95 text-[#1A1A1A] rounded-3xl p-4 shadow-xl cursor-pointer hover:scale-[1.01] transition mb-3"
          >
            <div className="flex items-center justify-between mb-1.5">
              <div className="flex items-center gap-2">
                <span className="w-5 h-5 rounded-md bg-[#3B6D11] text-white text-[10px] font-bold flex items-center justify-center">
                  S
                </span>
                <span className="text-[11px] font-bold text-[#3B6D11]">SAFRA</span>
                <span className="px-2 py-0.5 rounded-full bg-[#FAECD8] text-[#854F0B] text-[9px] font-bold">
                  RISCO MÉDIO
                </span>
              </div>
              <span className="text-[10px] text-[#5F5E5A]">há 1 min</span>
            </div>
            <p className="font-bold text-[14px] text-[#1A1A1A]">
              Broca-do-café detectada no Talhão Norte
            </p>
            <p className="text-[12px] text-[#5F5E5A] mt-0.5">
              IA prevê surto em 9 dias. Toque pra ver plano.
            </p>
          </div>

          {/* Secondary WhatsApp Push Card */}
          <div className="bg-white/20 backdrop-blur-md text-white rounded-3xl p-3.5 border border-white/15">
            <div className="flex items-center justify-between text-[11px] text-white/80 mb-1">
              <span className="font-semibold">WhatsApp</span>
              <span>há 18 min</span>
            </div>
            <p className="text-[12.5px] font-medium">
              Cooperativa: nova lista de preços disponível
            </p>
          </div>
        </div>

        <div className="pb-2 text-center">
          <button
            type="button"
            onClick={() => onNavigate('tela-15')}
            className="text-[12px] text-white/70 hover:text-white mb-2"
          >
            deslize para abrir
          </button>
          <HomeIndicatorOnly dark />
        </div>
      </div>
    );
  }

  // ==========================================================================
  // TELA 15 — DETALHE DO ALERTA DE PRAGA (BROCA-DO-CAFÉ)
  // ==========================================================================
  if (screen === 'tela-15') {
    return (
      <div
        className="w-full h-full flex flex-col justify-between bg-[#F7F6F1]"
        data-node-id="2:2036"
      >
        <div>
          <StatusBar offlineMode={offlineMode} />
          <TopSubHeader
            title="Alerta de praga"
            onBack={() => onNavigate('tela-09')}
            rightBadge="RISCO MÉDIO"
            rightBadgeColor="amber"
          />
        </div>

        <div className="px-4 py-3 flex-1 overflow-y-auto space-y-3">
          {/* Pest Identification Banner */}
          <div className="bg-white rounded-2xl p-4 border border-[#E8C99B] shadow-sm">
            <span className="px-2.5 py-0.5 rounded-full bg-[#FAECD8] text-[#854F0B] text-[10px] font-bold">
              RISCO MÉDIO
            </span>
            <h2 className="text-[22px] font-extrabold text-[#1A1A1A] mt-2">Broca-do-café</h2>
            <p className="text-[12px] italic text-[#5F5E5A]">Hypothenemus hampei</p>
            <p className="text-[12px] font-semibold text-[#854F0B] mt-1">
              Talhão Norte · 6,2 ha · em 9 dias
            </p>
          </div>

          {/* 3 Signals Card */}
          <div className="bg-white rounded-2xl p-4 border border-[#E5E3DC] shadow-sm space-y-2.5">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-[13.5px] text-[#1A1A1A]">
                Por que estamos avisando
              </h3>
              <span className="text-[10px] font-semibold text-[#3B6D11]">
                Cruzamento de 3 sinais
              </span>
            </div>

            <div className="space-y-2 pt-1">
              <div className="flex items-center gap-2.5 p-2 rounded-xl bg-[#F7F6F1]">
                <Thermometer className="w-4 h-4 text-[#EF9F27] shrink-0" />
                <span className="text-[12px] font-medium text-[#1A1A1A]">
                  Temperatura média 24°C há 8 dias
                </span>
              </div>
              <div className="flex items-center gap-2.5 p-2 rounded-xl bg-[#F7F6F1]">
                <Droplets className="w-4 h-4 text-[#3B6D11] shrink-0" />
                <span className="text-[12px] font-medium text-[#1A1A1A]">
                  Umidade relativa entre 70-85%
                </span>
              </div>
              <div className="flex items-center gap-2.5 p-2 rounded-xl bg-[#F7F6F1]">
                <Sparkles className="w-4 h-4 text-[#534AB7] shrink-0" />
                <span className="text-[12px] font-medium text-[#1A1A1A]">
                  Frutos no estágio chumbinho
                </span>
              </div>
            </div>

            <p className="text-[9.5px] font-bold tracking-wider text-[#5F5E5A] pt-1">
              FONTE: EMBRAPA CAFÉ · IA SAFRA v2
            </p>
          </div>

          {/* Affected Area */}
          <div className="bg-white rounded-2xl p-3.5 border border-[#E5E3DC] shadow-sm">
            <div className="flex items-center justify-between mb-2">
              <span className="font-bold text-[13px] text-[#1A1A1A]">Área afetada</span>
              <span className="text-[12px] font-bold text-[#854F0B]">2,1 ha de 6,2 ha</span>
            </div>
            <div className="w-full h-3 rounded-full bg-[#EAF2E2] overflow-hidden flex">
              <div className="w-[15%] bg-[#E24B4A]" title="crítico" />
              <div className="w-[20%] bg-[#EF9F27]" title="médio" />
            </div>
            <div className="flex items-center gap-4 mt-1.5 text-[10px] text-[#5F5E5A]">
              <span className="flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-[#E24B4A]" /> crítico
              </span>
              <span className="flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-[#EF9F27]" /> médio
              </span>
            </div>
          </div>

          {/* CTAs */}
          <button
            type="button"
            onClick={() => onNavigate('tela-16')}
            className="w-full py-3.5 rounded-2xl bg-[#3B6D11] hover:bg-[#2F590D] text-white font-bold text-[15px] shadow-sm transition"
          >
            Ver plano de ação
          </button>
          <div className="flex items-center justify-between px-2 text-[11px] font-medium text-[#5F5E5A]">
            <button type="button" onClick={() => onNavigate('tela-11')}>
              Adiar 3 dias
            </button>
            <button type="button" onClick={() => onNavigate('tela-09')}>
              Não é o que vejo no campo
            </button>
          </div>
        </div>

        <HomeIndicatorOnly />
      </div>
    );
  }

  // ==========================================================================
  // TELA 16 — PLANO DE AÇÃO EM 4 PASSOS (EMBRAPA)
  // ==========================================================================
  if (screen === 'tela-16') {
    const completedCount = steps.filter((s) => s.completed).length;

    return (
      <div
        className="w-full h-full flex flex-col justify-between bg-[#F7F6F1]"
        data-node-id="2:2786"
      >
        <div>
          <StatusBar offlineMode={offlineMode} />
          <TopSubHeader
            title="Plano de ação"
            onBack={() => onNavigate('tela-15')}
            rightBadge="EMBRAPA"
          />
        </div>

        <div className="px-4 py-3 flex-1 overflow-y-auto space-y-3">
          {/* Progress header */}
          <div className="bg-white rounded-2xl p-3.5 border border-[#E5E3DC]">
            <div className="flex items-center justify-between text-[11px]">
              <span className="font-bold text-[#5F5E5A] tracking-wider">PROGRESSO</span>
              <span className="font-semibold text-[#3B6D11]">4 passos · 3 dias</span>
            </div>
            <div className="w-full h-2 rounded-full bg-[#F7F6F1] mt-2 overflow-hidden">
              <div
                className="h-full bg-[#3B6D11] transition-all duration-300"
                style={{ width: `${(completedCount / steps.length) * 100}%` }}
              />
            </div>
            <p className="text-[11px] text-[#5F5E5A] mt-1.5">
              {completedCount} de {steps.length} concluídos
            </p>
          </div>

          {/* 4 Steps */}
          {steps.map((step) => (
            <div
              key={step.stepNumber}
              className={`bg-white rounded-2xl p-3.5 border transition ${
                step.completed ? 'border-[#3B6D11] bg-[#EAF2E2]/30' : 'border-[#E5E3DC]'
              }`}
            >
              <div className="flex items-start gap-3">
                <button
                  type="button"
                  onClick={() => onToggleStep(step.stepNumber)}
                  className={`w-7 h-7 rounded-full text-[12px] font-bold flex items-center justify-center shrink-0 mt-0.5 transition ${
                    step.completed
                      ? 'bg-[#3B6D11] text-white'
                      : 'bg-[#EAF2E2] text-[#3B6D11]'
                  }`}
                >
                  {step.completed ? <Check className="w-4 h-4" /> : step.stepNumber}
                </button>
                <div className="flex-1">
                  <p className="text-[9.5px] font-bold tracking-wider text-[#5F5E5A]">
                    {step.timingBadge}
                  </p>
                  <h4 className="font-bold text-[14px] text-[#1A1A1A] mt-0.5">{step.title}</h4>
                  <p className="text-[11.5px] text-[#5F5E5A] mt-1 leading-snug">
                    {step.description}
                  </p>

                  <div className="mt-2.5 flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => onToggleStep(step.stepNumber)}
                      className={`px-3 py-1 rounded-full text-[10.5px] font-bold transition ${
                        step.completed
                          ? 'bg-[#EAF2E2] text-[#3B6D11]'
                          : 'bg-[#3B6D11] text-white'
                      }`}
                    >
                      {step.completed ? 'Concluído ✓' : 'Marcar como feito'}
                    </button>
                    {step.linkedScreen && (
                      <button
                        type="button"
                        onClick={() => onNavigate(step.linkedScreen!)}
                        className="px-3 py-1 rounded-full bg-[#F7F6F1] border border-[#E5E3DC] text-[#3B6D11] text-[10.5px] font-bold"
                      >
                        Ver princípios ativos →
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}

          <button
            type="button"
            onClick={() => onNavigate('tela-17')}
            className="w-full py-3.5 rounded-2xl bg-[#3B6D11] hover:bg-[#2F590D] text-white font-bold text-[15px] shadow-sm transition"
          >
            Vou seguir o plano
          </button>
        </div>

        <HomeIndicatorOnly />
      </div>
    );
  }

  // ==========================================================================
  // TELA 17 — PRINCÍPIOS ATIVOS RECOMENDADOS PELA EMBRAPA
  // ==========================================================================
  if (screen === 'tela-17') {
    const filteredIngredients = ingredients.filter((ing) => {
      if (ingFilter === 'BIOLOGICOS') return ing.type === 'BIOLOGICO';
      if (ingFilter === 'QUIMICOS') return ing.type === 'QUIMICO';
      if (ingFilter === 'ORGANICO') return ing.isOrganic;
      return true;
    });

    return (
      <div
        className="w-full h-full flex flex-col justify-between bg-[#F7F6F1]"
        data-node-id="2:2916"
      >
        <div>
          <StatusBar offlineMode={offlineMode} />
          <TopSubHeader
            title="Princípios ativos"
            onBack={() => onNavigate('tela-16')}
            rightBadge="EMBRAPA"
          />
        </div>

        <div className="px-4 py-3 flex-1 overflow-y-auto space-y-3">
          {/* Filter Pills */}
          <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar">
            {[
              { id: 'TODOS' as const, label: 'Todos' },
              { id: 'BIOLOGICOS' as const, label: 'Biológicos' },
              { id: 'QUIMICOS' as const, label: 'Químicos' },
              { id: 'ORGANICO' as const, label: 'Orgânico' },
            ].map((pill) => (
              <button
                key={pill.id}
                type="button"
                onClick={() => setIngFilter(pill.id)}
                className={`px-3 py-1 rounded-full text-[11px] font-semibold whitespace-nowrap transition ${
                  ingFilter === pill.id
                    ? 'bg-[#3B6D11] text-white'
                    : 'bg-white text-[#5F5E5A] border border-[#E5E3DC]'
                }`}
              >
                {pill.label}
              </button>
            ))}
          </div>

          {filteredIngredients.map((ing) => {
            const isSelected = ing.id === selectedIngredientId;
            return (
              <div
                key={ing.id}
                onClick={() => setSelectedIngredientId(ing.id)}
                className={`bg-white rounded-2xl p-4 border-2 cursor-pointer transition ${
                  isSelected ? 'border-[#3B6D11] shadow-sm' : 'border-[#E5E3DC]'
                }`}
              >
                {ing.recommended && (
                  <span className="inline-block mb-1.5 px-2.5 py-0.5 rounded-full bg-[#3B6D11] text-white text-[9px] font-bold">
                    + RECOMENDADO
                  </span>
                )}
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="font-bold text-[15px] text-[#1A1A1A]">{ing.name}</h3>
                    <p className="text-[11px] text-[#5F5E5A]">{ing.subtitle}</p>
                  </div>
                  <span className="text-[12px] text-[#EF9F27]">
                    {'★'.repeat(ing.stars)}
                  </span>
                </div>

                <div className="flex flex-wrap gap-1.5 mt-2">
                  {ing.tags.map((tag) => (
                    <span
                      key={tag}
                      className="px-2 py-0.5 rounded bg-[#EAF2E2] text-[#3B6D11] text-[9px] font-bold"
                    >
                      {tag}
                    </span>
                  ))}
                </div>

                <div className="mt-3 pt-2.5 border-t border-[#E5E3DC] grid grid-cols-3 gap-2 text-[11px]">
                  <div>
                    <span className="text-[#5F5E5A] block text-[10px]">Dose:</span>
                    <span className="font-bold text-[#1A1A1A]">{ing.dosage}</span>
                  </div>
                  <div>
                    <span className="text-[#5F5E5A] block text-[10px]">Custo:</span>
                    <span className="font-bold text-[#1A1A1A]">{ing.costLabel}</span>
                  </div>
                  <div>
                    <span className="text-[#5F5E5A] block text-[10px]">Eficácia:</span>
                    <span className="font-bold text-[#3B6D11]">{ing.efficacyLabel}</span>
                  </div>
                </div>
              </div>
            );
          })}

          <div className="p-3 rounded-xl bg-[#FAECD8]/60 border border-[#E8C99B] text-[10.5px] text-[#854F0B]">
            <p className="font-bold">Sempre siga a bula e use EPI</p>
            <p>Dados de referência. Receituário agronômico obrigatório.</p>
          </div>

          <button
            type="button"
            onClick={() => onNavigate('tela-18')}
            className="w-full py-3.5 rounded-2xl bg-[#3B6D11] hover:bg-[#2F590D] text-white font-bold text-[15px] shadow-sm transition"
          >
            Agendar pulverização
          </button>
        </div>

        <HomeIndicatorOnly />
      </div>
    );
  }

  // ==========================================================================
  // TELA 18 — AGENDAR PULVERIZAÇÃO (CALENDÁRIO DE VENTO < 10 KM/H)
  // ==========================================================================
  if (screen === 'tela-18') {
    const days = [10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30];
    const idealDays = [18, 19, 21];
    const rainyDays = [13, 14, 24];
    const totalCost = Math.round(selectedIng.costPerHa * schedule.areaHa);

    const handleConfirm = () => {
      const periodHours =
        selectedPeriod === 'MANHA'
          ? '5h - 9h'
          : selectedPeriod === 'TARDE'
          ? '14h - 17h'
          : '19h - 22h';
      onConfirmSchedule({
        ...schedule,
        dayOfMonth: selectedDay,
        dateLabel: `Terça, ${selectedDay} de maio`,
        period: selectedPeriod,
        periodHours,
        ingredientId: selectedIng.id,
        ingredientName: selectedIng.name,
        estimatedTotalCost: totalCost,
        confirmed: true,
      });
      onNavigate('tela-19');
    };

    return (
      <div
        className="w-full h-full flex flex-col justify-between bg-[#F7F6F1]"
        data-node-id="2:2479"
      >
        <div>
          <StatusBar offlineMode={offlineMode} />
          <TopSubHeader
            title="Agendar pulverização"
            onBack={() => onNavigate('tela-17')}
          />
        </div>

        <div className="px-4 py-3 flex-1 overflow-y-auto space-y-3">
          <div>
            <h2 className="font-bold text-[16px] text-[#1A1A1A]">Quando você vai aplicar?</h2>
            <p className="text-[11.5px] text-[#5F5E5A]">
              A IA recomenda dias com vento &lt; 10 km/h
            </p>
          </div>

          {/* Calendar Card */}
          <div className="bg-white rounded-2xl p-3.5 border border-[#E5E3DC] shadow-sm">
            <div className="flex items-center justify-between mb-2">
              <span className="font-bold text-[13px] text-[#1A1A1A]">Maio 2026</span>
              <div className="flex items-center gap-3 text-[10px] text-[#5F5E5A]">
                <span className="flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full bg-[#3B6D11]" /> Dia ideal
                </span>
                <span className="flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full bg-[#E24B4A]" /> Chuva prevista
                </span>
              </div>
            </div>

            <div className="grid grid-cols-7 gap-1 text-center text-[10px] font-bold text-[#5F5E5A] mb-1">
              <span>D</span>
              <span>S</span>
              <span>T</span>
              <span>Q</span>
              <span>Q</span>
              <span>S</span>
              <span>S</span>
            </div>

            <div className="grid grid-cols-7 gap-1">
              {days.map((d) => {
                const isSelected = d === selectedDay;
                const isIdeal = idealDays.includes(d);
                const isRain = rainyDays.includes(d);
                return (
                  <button
                    key={d}
                    type="button"
                    onClick={() => setSelectedDay(d)}
                    className={`h-8 rounded-lg text-[12px] font-semibold flex flex-col items-center justify-center relative transition ${
                      isSelected
                        ? 'bg-[#3B6D11] text-white font-bold'
                        : isIdeal
                        ? 'bg-[#EAF2E2] text-[#3B6D11]'
                        : isRain
                        ? 'bg-[#FCE8E8] text-[#E24B4A]'
                        : 'hover:bg-[#F7F6F1] text-[#1A1A1A]'
                    }`}
                  >
                    {d}
                  </button>
                );
              })}
            </div>

            <div className="mt-2.5 pt-2 border-t border-[#E5E3DC] flex items-center justify-between text-[11px]">
              <span className="text-[#5F5E5A]">Selecionado:</span>
              <span className="font-bold text-[#3B6D11]">
                Terça, {selectedDay} de maio · vento 6 km/h
              </span>
            </div>
          </div>

          {/* Period of Day */}
          <div>
            <p className="text-[10px] font-bold tracking-wider text-[#5F5E5A] mb-1.5">
              PERÍODO DO DIA
            </p>
            <div className="grid grid-cols-3 gap-2">
              {[
                { id: 'MANHA' as const, label: 'Manhã', hours: '5h - 9h' },
                { id: 'TARDE' as const, label: 'Tarde', hours: '14h - 17h' },
                { id: 'NOITE' as const, label: 'Noite', hours: '19h - 22h' },
              ].map((p) => (
                <button
                  key={p.id}
                  type="button"
                  onClick={() => setSelectedPeriod(p.id)}
                  className={`p-2.5 rounded-xl border text-center transition ${
                    selectedPeriod === p.id
                      ? 'bg-[#EAF2E2] border-[#3B6D11] text-[#3B6D11]'
                      : 'bg-white border-[#E5E3DC] text-[#1A1A1A]'
                  }`}
                >
                  <p className="font-bold text-[12.5px]">{p.label}</p>
                  <p className="text-[10px] text-[#5F5E5A]">{p.hours}</p>
                </button>
              ))}
            </div>
          </div>

          {/* Summary Card */}
          <div className="bg-white rounded-2xl p-3.5 border border-[#E5E3DC]">
            <p className="text-[10px] font-bold text-[#5F5E5A] uppercase">Resumo</p>
            <p className="font-bold text-[13px] text-[#1A1A1A] mt-0.5">
              {selectedDay}/mai ·{' '}
              {selectedPeriod === 'MANHA'
                ? '5h-9h'
                : selectedPeriod === 'TARDE'
                ? '14h-17h'
                : '19h-22h'}{' '}
              · {selectedIng.name.split(' ')[0]} · 6,2 ha
            </p>
            <p className="text-[12px] font-semibold text-[#3B6D11] mt-0.5">
              Custo estimado: R$ {totalCost.toLocaleString('pt-BR')}
            </p>
          </div>

          <button
            type="button"
            onClick={handleConfirm}
            className="w-full py-3.5 rounded-2xl bg-[#3B6D11] hover:bg-[#2F590D] text-white font-bold text-[15px] shadow-sm transition"
          >
            Confirmar agendamento
          </button>
        </div>

        <HomeIndicatorOnly />
      </div>
    );
  }

  // ==========================================================================
  // TELA 19 — PULVERIZAÇÃO AGENDADA E REGISTRADA (+12 PTS AGRO+)
  // ==========================================================================
  return (
    <div
      className="w-full h-full flex flex-col justify-between bg-[#F7F6F1]"
      data-node-id="2:3017"
    >
      <StatusBar offlineMode={offlineMode} />

      <div className="px-5 py-3 flex-1 flex flex-col justify-center space-y-4">
        <div className="text-center">
          <div className="w-14 h-14 rounded-full bg-[#3B6D11] text-white flex items-center justify-center mx-auto mb-3 shadow-md">
            <Check className="w-8 h-8 stroke-[2.5]" />
          </div>
          <h1 className="text-[24px] font-extrabold text-[#1A1A1A]">Tudo certo, José!</h1>
          <p className="text-[13px] text-[#5F5E5A]">Pulverização agendada e registrada</p>
        </div>

        <div className="bg-white rounded-2xl p-4 border border-[#E5E3DC] space-y-2.5 text-[12.5px]">
          <p className="text-[10px] font-bold tracking-wider text-[#5F5E5A]">
            DETALHES DA AÇÃO
          </p>
          <div className="flex justify-between">
            <span className="text-[#5F5E5A]">Data e hora</span>
            <span className="font-bold text-[#1A1A1A]">
              {schedule.dayOfMonth}/mai · {schedule.periodHours}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-[#5F5E5A]">Talhão</span>
            <span className="font-bold text-[#1A1A1A]">Norte · 6,2 ha</span>
          </div>
          <div className="flex justify-between">
            <span className="text-[#5F5E5A]">Produto</span>
            <span className="font-bold text-[#1A1A1A]">{schedule.ingredientName}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-[#5F5E5A]">Custo estimado</span>
            <span className="font-bold text-[#1A1A1A]">
              R$ {schedule.estimatedTotalCost.toLocaleString('pt-BR')},00
            </span>
          </div>
        </div>

        {/* Score Bonus Card */}
        <div
          onClick={() => onNavigate('tela-24')}
          className="bg-[#EEEDFE] rounded-2xl p-3.5 border border-[#C5C0F2] cursor-pointer"
        >
          <p className="text-[10px] font-bold text-[#534AB7] tracking-wider">
            PONTUOU NO AGRO+
          </p>
          <p className="text-[15px] font-extrabold text-[#1A1A1A] mt-0.5">
            +12 pontos no seu score
          </p>
          <p className="text-[11.5px] text-[#5F5E5A]">
            Ação preventiva registrada · agora {agroScore.totalScore}
          </p>
        </div>

        <div className="bg-[#EAF2E2] rounded-2xl p-3 text-center">
          <p className="font-bold text-[12px] text-[#3B6D11]">A gente lembra você no dia</p>
          <p className="text-[11px] text-[#5F5E5A]">
            Lembrete enviado para {schedule.dayOfMonth - 1}/05 às 19h
          </p>
        </div>
      </div>

      <div className="px-5 pb-2">
        <button
          type="button"
          onClick={() => onNavigate('tela-09')}
          className="w-full py-3.5 rounded-2xl bg-[#3B6D11] hover:bg-[#2F590D] text-white font-bold text-[15px] transition"
        >
          Voltar para o mapa
        </button>
        <HomeIndicatorOnly />
      </div>
    </div>
  );
};
