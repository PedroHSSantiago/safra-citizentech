import React, { useState } from 'react';
import {
  AgroScoreBreakdownEntity,
  CreditOfferEntity,
  CreditSimulationEntity,
  FarmEntity,
  ProducerEntity,
  ScreenId,
} from '../../types/models';
import { calculateCreditSimulation } from '../../data/seedData';
import { HomeIndicatorOnly, StatusBar, TopSubHeader } from '../MobileShell';
import { Check, ChevronRight, Lock, ShieldCheck, Sparkles } from 'lucide-react';

interface Module5Props {
  screen: ScreenId;
  offlineMode: boolean;
  producer: ProducerEntity;
  farm: FarmEntity;
  agroScore: AgroScoreBreakdownEntity;
  offers: CreditOfferEntity[];
  simulation: CreditSimulationEntity;
  onNavigate: (screen: ScreenId) => void;
  onUpdateSimulation: (sim: CreditSimulationEntity) => void;
  onSubmitCreditProposal: (sim: CreditSimulationEntity) => void;
}

export const Module5AgroScoreAndCredit: React.FC<Module5Props> = ({
  screen,
  offlineMode,
  producer,
  farm,
  agroScore,
  offers,
  simulation,
  onNavigate,
  onUpdateSimulation,
  onSubmitCreditProposal,
}) => {
  const [offerFilter, setOfferFilter] = useState<'TODAS' | 'INSUMOS' | 'CUSTEIO' | 'MAQUINAS'>(
    'TODAS'
  );
  const [selectedOfferId, setSelectedOfferId] = useState(simulation.offerId);

  const selectedOffer =
    offers.find((o) => o.id === selectedOfferId) || offers[0];

  // ==========================================================================
  // TELA 24 — COMPOSIÇÃO DO SCORE AGRO+ (742 / 1000)
  // ==========================================================================
  if (screen === 'tela-24') {
    const missingForTop = Math.max(0, 800 - agroScore.totalScore);

    return (
      <div
        className="w-full h-full flex flex-col justify-between bg-[#F7F6F1]"
        data-node-id="2:702"
      >
        <div>
          <StatusBar offlineMode={offlineMode} />
          <TopSubHeader title="Score Agro+" onBack={() => onNavigate('tela-09')} />
        </div>

        <div className="px-4 py-3 flex-1 overflow-y-auto space-y-3">
          {/* Score Gauge Card */}
          <div className="bg-white rounded-3xl p-4 border border-[#C5C0F2] shadow-sm text-center">
            <div className="relative w-44 h-28 mx-auto flex flex-col items-center justify-end">
              <svg viewBox="0 0 160 95" className="w-full h-full">
                <path
                  d="M 18 82 A 62 62 0 0 1 142 82"
                  fill="none"
                  stroke="#E5E3DC"
                  strokeWidth="12"
                  strokeLinecap="round"
                />
                <path
                  d="M 18 82 A 62 62 0 0 1 128 42"
                  fill="none"
                  stroke="#534AB7"
                  strokeWidth="12"
                  strokeLinecap="round"
                />
              </svg>
              <div className="absolute bottom-1">
                <p className="text-[34px] font-extrabold text-[#1A1A1A] leading-none">
                  {agroScore.totalScore}
                </p>
                <p className="text-[10.5px] text-[#5F5E5A] mt-0.5">de 1000 pontos</p>
              </div>
            </div>

            <span className="inline-block mt-1 px-3 py-0.5 rounded-full bg-[#EAF2E2] text-[#3B6D11] text-[10px] font-extrabold">
              {agroScore.ratingLabel}
            </span>

            <div className="mt-3 p-2.5 rounded-2xl bg-[#EEEDFE] text-left flex items-center justify-between">
              <div>
                <p className="text-[11.5px] font-bold text-[#1A1A1A]">
                  Faltam {missingForTop} pontos para Score Topo (800+)
                </p>
                <p className="text-[10.5px] text-[#5F5E5A]">
                  Taxas até 1,2% menores em todos os bancos
                </p>
              </div>
              <span className="text-[12px] font-extrabold text-[#534AB7]">
                {Math.round((agroScore.totalScore / 1000) * 100)}%
              </span>
            </div>
          </div>

          {/* 4 Pillars Breakdown */}
          <div>
            <p className="text-[10px] font-bold tracking-wider text-[#5F5E5A] mb-1.5">
              O QUE COMPÕE SEU SCORE
            </p>
            <div className="bg-white rounded-2xl border border-[#E5E3DC] divide-y divide-[#E5E3DC]">
              {[
                {
                  title: 'Saúde do plantio (NDVI)',
                  sub: '8 meses de dados consistentes',
                  pts: agroScore.ndviPoints,
                  max: agroScore.ndviMax,
                },
                {
                  title: 'Ações registradas',
                  sub: '14 ações no app · 6 pulverizações',
                  pts: agroScore.actionsPoints,
                  max: agroScore.actionsMax,
                },
                {
                  title: 'CAR e documentos',
                  sub: 'CAR ativo · CPF regular',
                  pts: agroScore.carDocsPoints,
                  max: agroScore.carDocsMax,
                },
                {
                  title: 'Adesão aos planos de ação',
                  sub: 'Pode melhorar · 6 de 10 seguidos',
                  pts: agroScore.actionPlanAdherencePoints,
                  max: agroScore.actionPlanAdherenceMax,
                },
              ].map((p) => (
                <div key={p.title} className="p-3 flex items-center justify-between">
                  <div>
                    <p className="font-bold text-[12.5px] text-[#1A1A1A]">{p.title}</p>
                    <p className="text-[10.5px] text-[#5F5E5A]">{p.sub}</p>
                  </div>
                  <div className="text-right">
                    <span className="font-extrabold text-[13.5px] text-[#3B6D11]">
                      +{p.pts}
                    </span>
                    <span className="block text-[9.5px] text-[#5F5E5A]">de {p.max}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <button
            type="button"
            onClick={() => onNavigate('tela-25')}
            className="w-full py-3.5 rounded-2xl bg-[#534AB7] hover:bg-[#433B9E] text-white font-bold text-[15px] shadow-sm transition"
          >
            Ver ofertas pré-aprovadas
          </button>
        </div>

        <HomeIndicatorOnly />
      </div>
    );
  }

  // ==========================================================================
  // TELA 25 — OFERTAS DE CRÉDITO PRÉ-APROVADAS
  // ==========================================================================
  if (screen === 'tela-25') {
    const filteredOffers =
      offerFilter === 'TODAS'
        ? offers
        : offers.filter((o) => o.category === offerFilter);

    return (
      <div
        className="w-full h-full flex flex-col justify-between bg-[#F7F6F1]"
        data-node-id="2:998"
      >
        <div>
          <StatusBar offlineMode={offlineMode} />
          <TopSubHeader
            title="Pré-aprovado"
            onBack={() => onNavigate('tela-24')}
            rightBadge="AGRO+"
            rightBadgeColor="purple"
          />
        </div>

        <div className="px-4 py-3 flex-1 overflow-y-auto space-y-3">
          <p className="text-[11.5px] text-[#5F5E5A]">
            3 ofertas para José · Score {agroScore.totalScore}
          </p>

          {/* Total Available Banner */}
          <div className="bg-[#EEEDFE] rounded-2xl p-3.5 border border-[#C5C0F2] flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-white text-[#534AB7] font-extrabold flex items-center justify-center shrink-0">
              ₮
            </div>
            <div>
              <p className="font-extrabold text-[13.5px] text-[#1A1A1A]">
                Você pode pegar até R$ 47.500
              </p>
              <p className="text-[11px] text-[#5F5E5A]">
                Sem garantia · sem entrada · análise em 24h
              </p>
            </div>
          </div>

          {/* Filter Pills */}
          <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar">
            {[
              { id: 'TODAS' as const, label: 'Todas' },
              { id: 'INSUMOS' as const, label: 'Insumos' },
              { id: 'CUSTEIO' as const, label: 'Custeio' },
              { id: 'MAQUINAS' as const, label: 'Máquinas' },
            ].map((pill) => (
              <button
                key={pill.id}
                type="button"
                onClick={() => setOfferFilter(pill.id)}
                className={`px-3 py-1 rounded-full text-[11px] font-semibold whitespace-nowrap transition ${
                  offerFilter === pill.id
                    ? 'bg-[#3B6D11] text-white'
                    : 'bg-white text-[#5F5E5A] border border-[#E5E3DC]'
                }`}
              >
                {pill.label}
              </button>
            ))}
          </div>

          {/* Offers List */}
          <div className="space-y-3">
            {filteredOffers.map((offer) => (
              <div
                key={offer.id}
                onClick={() => {
                  setSelectedOfferId(offer.id);
                  onNavigate('tela-26');
                }}
                className={`relative bg-white rounded-2xl p-4 border-2 cursor-pointer transition ${
                  offer.bestRateBadge
                    ? 'border-[#534AB7] shadow-sm'
                    : 'border-[#E5E3DC] hover:border-[#534AB7]/60'
                }`}
              >
                {offer.bestRateBadge && (
                  <span className="absolute -top-2.5 right-3 px-2.5 py-0.5 rounded-full bg-[#534AB7] text-white text-[9px] font-bold">
                    ★ MELHOR TAXA
                  </span>
                )}

                <div className="flex items-center gap-3">
                  <div
                    className="w-9 h-9 rounded-xl text-white font-extrabold text-[12px] flex items-center justify-center shrink-0"
                    style={{ backgroundColor: offer.colorHex }}
                  >
                    {offer.code}
                  </div>
                  <div className="flex-1">
                    <h3 className="font-bold text-[14.5px] text-[#1A1A1A]">
                      {offer.institution}
                    </h3>
                    <p className="text-[11px] text-[#5F5E5A]">{offer.lineName}</p>
                  </div>
                  <ChevronRight className="w-4 h-4 text-[#5F5E5A]" />
                </div>

                <div className="mt-3 pt-2.5 border-t border-[#E5E3DC] grid grid-cols-2 gap-2">
                  <div>
                    <p className="text-[9.5px] text-[#5F5E5A] font-semibold">ATÉ</p>
                    <p className="text-[16px] font-extrabold text-[#1A1A1A]">
                      R$ {offer.maxAmount / 1000} mil
                    </p>
                    <p className="text-[10px] text-[#5F5E5A]">{offer.maxTermMonths} meses</p>
                  </div>
                  <div>
                    <p className="text-[9.5px] text-[#5F5E5A] font-semibold">JUROS A.A.</p>
                    <p className="text-[16px] font-extrabold text-[#3B6D11]">
                      {offer.interestRateYearly.toString().replace('.', ',')}%
                    </p>
                    <p className="text-[10px] text-[#5F5E5A]">Pronaf custeio</p>
                  </div>
                </div>

                {offer.bestRateBadge && (
                  <div className="mt-2.5 pt-2 border-t border-[#E5E3DC] text-center">
                    <span className="text-[11.5px] font-bold text-[#534AB7]">
                      Simular e contratar →
                    </span>
                  </div>
                )}
              </div>
            ))}
          </div>

          <p className="text-[10px] text-center text-[#5F5E5A]">
            Sujeito à análise final da instituição
          </p>
        </div>

        <HomeIndicatorOnly />
      </div>
    );
  }

  // ==========================================================================
  // TELA 26 — DETALHE DA OFERTA AGROLEND PRONAF
  // ==========================================================================
  if (screen === 'tela-26') {
    return (
      <div
        className="w-full h-full flex flex-col justify-between bg-[#F7F6F1]"
        data-node-id="2:1448"
      >
        <div>
          <StatusBar offlineMode={offlineMode} />
          <TopSubHeader
            title={selectedOffer.institution}
            onBack={() => onNavigate('tela-25')}
            rightBadge="PRONAF"
          />
        </div>

        <div className="px-4 py-3 flex-1 overflow-y-auto space-y-3">
          {/* Header Value Card */}
          <div className="bg-white rounded-2xl p-4 border border-[#E5E3DC] shadow-sm">
            <div className="flex items-center gap-3 mb-3">
              <div
                className="w-10 h-10 rounded-xl text-white font-bold flex items-center justify-center"
                style={{ backgroundColor: selectedOffer.colorHex }}
              >
                {selectedOffer.code}
              </div>
              <div>
                <h2 className="font-bold text-[15px] text-[#1A1A1A]">
                  {selectedOffer.institution}
                </h2>
                <p className="text-[11px] text-[#5F5E5A]">{selectedOffer.lineName}</p>
              </div>
            </div>

            <p className="text-[11px] text-[#5F5E5A]">Valor pré-aprovado</p>
            <p className="text-[28px] font-extrabold text-[#1A1A1A] leading-tight">
              R$ {selectedOffer.maxAmount.toLocaleString('pt-BR')}
            </p>
            <p className="text-[11.5px] font-semibold text-[#3B6D11] mt-0.5">
              + R$ 4.200 em insumos parceiros
            </p>
          </div>

          {/* Conditions */}
          <div>
            <p className="text-[10px] font-bold tracking-wider text-[#5F5E5A] mb-1.5">
              CONDIÇÕES
            </p>
            <div className="bg-white rounded-2xl border border-[#E5E3DC] divide-y divide-[#E5E3DC] text-[12.5px]">
              <div className="p-3 flex justify-between">
                <span className="text-[#5F5E5A]">Taxa de juros</span>
                <span className="font-bold text-[#3B6D11]">
                  {selectedOffer.interestRateYearly.toString().replace('.', ',')}% a.a.
                </span>
              </div>
              <div className="p-3 flex justify-between">
                <span className="text-[#5F5E5A]">Prazo total</span>
                <span className="font-bold text-[#1A1A1A]">
                  {selectedOffer.maxTermMonths} meses
                </span>
              </div>
              <div className="p-3 flex justify-between">
                <span className="text-[#5F5E5A]">Carência</span>
                <span className="font-bold text-[#1A1A1A]">
                  {selectedOffer.graceMonths} meses
                </span>
              </div>
              <div className="p-3 flex justify-between">
                <span className="text-[#5F5E5A]">Garantias</span>
                <span className="font-bold text-[#1A1A1A]">Sem garantia real</span>
              </div>
              <div className="p-3 flex justify-between">
                <span className="text-[#5F5E5A]">CET (Custo Efetivo Total)</span>
                <span className="font-bold text-[#1A1A1A]">
                  {selectedOffer.cetYearly.toString().replace('.', ',')}% a.a.
                </span>
              </div>
            </div>
            <p className="text-[10px] text-[#5F5E5A] mt-1">
              Atualizado em 12/05/2026 · Sujeito a análise
            </p>
          </div>

          {/* Benefits */}
          <div>
            <p className="text-[10px] font-bold tracking-wider text-[#5F5E5A] mb-1.5">
              POR QUE É BOM PRA VOCÊ
            </p>
            <div className="bg-white rounded-2xl p-3.5 border border-[#E5E3DC] space-y-2 text-[12px]">
              {[
                'Análise em até 24h sem sair de casa',
                'Aceita CAR + dados do SAFRA como garantia',
                'Pagamento atrelado à safra (jul/dez)',
                'Sem IOF para microprodutor Pronaf',
              ].map((b) => (
                <div key={b} className="flex items-center gap-2">
                  <span className="w-4 h-4 rounded-full bg-[#EAF2E2] text-[#3B6D11] flex items-center justify-center shrink-0">
                    <Check className="w-3 h-3" />
                  </span>
                  <span className="text-[#1A1A1A]">{b}</span>
                </div>
              ))}
            </div>
          </div>

          <button
            type="button"
            onClick={() => onNavigate('tela-27')}
            className="w-full py-3.5 rounded-2xl bg-[#3B6D11] hover:bg-[#2F590D] text-white font-bold text-[15px] shadow-sm transition"
          >
            Simular parcelas
          </button>
        </div>

        <HomeIndicatorOnly />
      </div>
    );
  }

  // ==========================================================================
  // TELA 27 — SIMULADOR DE PARCELAS E CARÊNCIA
  // ==========================================================================
  if (screen === 'tela-27') {
    const calc = calculateCreditSimulation(
      simulation.requestedAmount,
      simulation.installments,
      simulation.interestRateYearly
    );

    const handleAmountChange = (newAmount: number) => {
      const nextCalc = calculateCreditSimulation(
        newAmount,
        simulation.installments,
        simulation.interestRateYearly
      );
      onUpdateSimulation({
        ...simulation,
        requestedAmount: newAmount,
        ...nextCalc,
      });
    };

    const handleInstallmentsChange = (inst: 12 | 24 | 36) => {
      const nextCalc = calculateCreditSimulation(
        simulation.requestedAmount,
        inst,
        simulation.interestRateYearly
      );
      onUpdateSimulation({
        ...simulation,
        installments: inst,
        ...nextCalc,
      });
    };

    return (
      <div
        className="w-full h-full flex flex-col justify-between bg-[#F7F6F1]"
        data-node-id="2:811"
      >
        <div>
          <StatusBar offlineMode={offlineMode} />
          <TopSubHeader title="Simular" onBack={() => onNavigate('tela-26')} />
        </div>

        <div className="px-4 py-3 flex-1 overflow-y-auto space-y-3.5">
          {/* Amount Slider Card */}
          <div className="bg-white rounded-2xl p-4 border border-[#E5E3DC] shadow-sm">
            <p className="text-[10px] font-bold tracking-wider text-[#5F5E5A]">
              QUANTO VOCÊ QUER PEGAR
            </p>
            <p className="text-[28px] font-extrabold text-[#1A1A1A] mt-1">
              R$ {simulation.requestedAmount.toLocaleString('pt-BR')}
            </p>
            <p className="text-[11px] text-[#5F5E5A] mb-3">
              de até R$ 25.000 disponíveis
            </p>

            <input
              type="range"
              min={1000}
              max={25000}
              step={1000}
              value={simulation.requestedAmount}
              onChange={(e) => handleAmountChange(Number(e.target.value))}
              className="w-full accent-[#3B6D11] cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-[#5F5E5A] mt-1">
              <span>R$ 1k</span>
              <span>R$ 25k</span>
            </div>
          </div>

          {/* Installments Selector */}
          <div>
            <p className="text-[10px] font-bold tracking-wider text-[#5F5E5A] mb-1.5">
              EM QUANTAS PARCELAS
            </p>
            <div className="grid grid-cols-3 gap-2">
              {[
                { val: 12 as const, sub: '1 ano' },
                { val: 24 as const, sub: '2 anos' },
                { val: 36 as const, sub: '3 anos' },
              ].map((opt) => (
                <button
                  key={opt.val}
                  type="button"
                  onClick={() => handleInstallmentsChange(opt.val)}
                  className={`p-2.5 rounded-xl border text-center transition ${
                    simulation.installments === opt.val
                      ? 'bg-[#EAF2E2] border-[#3B6D11] text-[#3B6D11]'
                      : 'bg-white border-[#E5E3DC] text-[#1A1A1A]'
                  }`}
                >
                  <p className="font-extrabold text-[15px]">{opt.val}x</p>
                  <p className="text-[10px] text-[#5F5E5A]">{opt.sub}</p>
                </button>
              ))}
            </div>
          </div>

          {/* Monthly Installment Result */}
          <div className="bg-[#EAF2E2] rounded-2xl p-4 border border-[#3B6D11]/30">
            <p className="text-[10px] font-bold tracking-wider text-[#3B6D11]">
              SUA PARCELA SERÁ
            </p>
            <p className="text-[11px] text-[#5F5E5A]">Após 8 meses de carência</p>
            <p className="text-[28px] font-extrabold text-[#1A1A1A] mt-1">
              R$ {calc.monthlyInstallment.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
            </p>
            <p className="text-[11.5px] font-medium text-[#3B6D11]">
              por mês · {simulation.installments} parcelas
            </p>
          </div>

          {/* Balance Summary */}
          <div className="bg-white rounded-2xl p-3.5 border border-[#E5E3DC] space-y-2 text-[12px]">
            <p className="text-[10px] font-bold tracking-wider text-[#5F5E5A]">SALDO</p>
            <div className="flex justify-between">
              <span className="text-[#5F5E5A]">Você vai pegar</span>
              <span className="font-semibold text-[#1A1A1A]">
                R$ {simulation.requestedAmount.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-[#5F5E5A]">Juros total</span>
              <span className="font-semibold text-[#1A1A1A]">
                R$ {calc.totalInterest.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-[#5F5E5A]">Taxas e tributos</span>
              <span className="font-semibold text-[#3B6D11]">R$ 0,00</span>
            </div>
            <div className="pt-2 border-t border-[#E5E3DC] flex justify-between font-bold text-[13px]">
              <span className="text-[#1A1A1A]">Total a pagar</span>
              <span className="text-[#1A1A1A]">
                R$ {calc.totalPayable.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
              </span>
            </div>
          </div>

          <button
            type="button"
            onClick={() => onNavigate('tela-28')}
            className="w-full py-3.5 rounded-2xl bg-[#3B6D11] hover:bg-[#2F590D] text-white font-bold text-[15px] shadow-sm transition"
          >
            Quero esta proposta
          </button>
        </div>

        <HomeIndicatorOnly />
      </div>
    );
  }

  // ==========================================================================
  // TELA 28 — CONFIRMAR SOLICITAÇÃO & LGPD
  // ==========================================================================
  if (screen === 'tela-28') {
    const handleSendProposal = () => {
      onSubmitCreditProposal(simulation);
      onNavigate('tela-29');
    };

    return (
      <div
        className="w-full h-full flex flex-col justify-between bg-[#F7F6F1]"
        data-node-id="2:2195"
      >
        <div>
          <StatusBar offlineMode={offlineMode} />
          <TopSubHeader
            title="Confirmar solicitação"
            onBack={() => onNavigate('tela-27')}
          />
        </div>

        <div className="px-4 py-3 flex-1 overflow-y-auto space-y-3">
          {/* Summary Header */}
          <div className="bg-white rounded-2xl p-4 border border-[#E5E3DC] flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#3B6D11] text-white font-bold flex items-center justify-center shrink-0">
              AL
            </div>
            <div>
              <p className="text-[11.5px] text-[#5F5E5A]">
                Crédito {simulation.institution} · {simulation.installments}x
              </p>
              <p className="text-[20px] font-extrabold text-[#1A1A1A]">
                R$ {simulation.requestedAmount.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
              </p>
              <p className="text-[11.5px] font-semibold text-[#3B6D11]">
                Parcela: R${' '}
                {simulation.monthlyInstallment.toLocaleString('pt-BR', {
                  minimumFractionDigits: 2,
                })}
                /mês
              </p>
            </div>
          </div>

          {/* Producer & CAR Data */}
          <div>
            <p className="text-[10px] font-bold tracking-wider text-[#5F5E5A] mb-1.5">
              SEUS DADOS
            </p>
            <div className="bg-white rounded-2xl border border-[#E5E3DC] divide-y divide-[#E5E3DC] text-[12px]">
              <div className="p-3 flex justify-between">
                <span className="text-[#5F5E5A]">Titular</span>
                <span className="font-semibold text-[#1A1A1A]">{producer.fullName}</span>
              </div>
              <div className="p-3 flex justify-between">
                <span className="text-[#5F5E5A]">CPF</span>
                <span className="font-semibold text-[#1A1A1A]">{producer.cpfMasked}</span>
              </div>
              <div className="p-3 flex justify-between">
                <span className="text-[#5F5E5A]">Fazenda</span>
                <span className="font-semibold text-[#1A1A1A]">
                  São Bento · {farm.totalAreaHa.toString().replace('.', ',')} ha
                </span>
              </div>
              <div className="p-3 flex justify-between">
                <span className="text-[#5F5E5A]">CAR</span>
                <span className="font-bold text-[#3B6D11]">Ativo e válido ✓</span>
              </div>
            </div>
          </div>

          {/* Purpose */}
          <div className="bg-white rounded-2xl p-3.5 border border-[#E5E3DC]">
            <p className="text-[10px] font-bold tracking-wider text-[#5F5E5A]">FINALIDADE</p>
            <p className="font-bold text-[13px] text-[#1A1A1A] mt-0.5">
              Custeio agrícola — safra 2026/27
            </p>
            <p className="text-[11px] text-[#5F5E5A]">
              Adubos, defensivos e mão-de-obra para colheita
            </p>
          </div>

          {/* LGPD Consent */}
          <div className="bg-white rounded-2xl p-3.5 border border-[#E5E3DC] space-y-2.5 text-[11.5px]">
            <p className="text-[#5F5E5A] leading-snug">
              Eu autorizo o SAFRA a compartilhar com a Agrolend meus dados do score, NDVI e histórico de ações registradas para análise da proposta.
            </p>
            <label className="flex items-center gap-2.5 cursor-pointer pt-1">
              <input
                type="checkbox"
                checked={simulation.contractAccepted}
                onChange={(e) =>
                  onUpdateSimulation({
                    ...simulation,
                    contractAccepted: e.target.checked,
                  })
                }
                className="w-4 h-4 accent-[#3B6D11]"
              />
              <span className="font-semibold text-[#1A1A1A]">
                Li e aceito o contrato e a política LGPD
              </span>
            </label>
          </div>

          <button
            type="button"
            disabled={!simulation.contractAccepted}
            onClick={handleSendProposal}
            className="w-full py-3.5 rounded-2xl bg-[#3B6D11] hover:bg-[#2F590D] text-white font-bold text-[15px] shadow-sm transition disabled:opacity-50"
          >
            Enviar para análise
          </button>
        </div>

        <HomeIndicatorOnly />
      </div>
    );
  }

  // ==========================================================================
  // TELA 29 — CRÉDITO APROVADO (+25 PTS AGRO+)
  // ==========================================================================
  return (
    <div
      className="w-full h-full flex flex-col justify-between bg-[#F7F6F1]"
      data-node-id="2:1375"
    >
      <StatusBar offlineMode={offlineMode} />

      <div className="px-5 py-3 flex-1 flex flex-col justify-center space-y-4">
        <div className="text-center">
          <div className="w-14 h-14 rounded-full bg-[#3B6D11] text-white flex items-center justify-center mx-auto mb-2.5 shadow-md">
            <Check className="w-8 h-8 stroke-[2.5]" />
          </div>
          <h1 className="text-[26px] font-extrabold text-[#1A1A1A]">Aprovado! 🎉</h1>
          <p className="text-[13px] text-[#5F5E5A]">
            A {simulation.institution} liberou seu crédito em apenas 18 horas
          </p>
        </div>

        <div className="bg-white rounded-2xl p-4 border border-[#3B6D11] text-center shadow-sm">
          <p className="text-[10px] font-bold tracking-wider text-[#3B6D11]">
            DISPONÍVEL NA SUA CONTA
          </p>
          <p className="text-[28px] font-extrabold text-[#1A1A1A] mt-1">
            R$ {simulation.requestedAmount.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
          </p>
          <p className="text-[11.5px] text-[#5F5E5A]">Disponível em até 1 dia útil</p>
        </div>

        <div className="bg-white rounded-2xl p-4 border border-[#E5E3DC] space-y-2.5">
          <p className="text-[10px] font-bold tracking-wider text-[#5F5E5A]">
            PRÓXIMOS PASSOS
          </p>
          {[
            {
              step: 1,
              title: 'Conta corrente confirmada',
              sub: simulation.bankAccountLabel,
              done: true,
            },
            {
              step: 2,
              title: 'Assinar contrato digital',
              sub: 'Validação por SMS · pendente',
              done: false,
            },
            {
              step: 3,
              title: 'Liberação do valor',
              sub: 'Em até 24h após assinatura',
              done: false,
            },
          ].map((s) => (
            <div key={s.step} className="flex items-center gap-3">
              <span
                className={`w-6 h-6 rounded-full text-[11px] font-bold flex items-center justify-center shrink-0 ${
                  s.done ? 'bg-[#3B6D11] text-white' : 'bg-[#EAF2E2] text-[#3B6D11]'
                }`}
              >
                {s.done ? '✓' : s.step}
              </span>
              <div>
                <p className="font-bold text-[12.5px] text-[#1A1A1A]">{s.title}</p>
                <p className="text-[10.5px] text-[#5F5E5A]">{s.sub}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="bg-[#EEEDFE] rounded-2xl p-3.5 border border-[#C5C0F2] text-center">
          <p className="font-extrabold text-[13px] text-[#534AB7]">
            +25 pontos no Agro+ desbloqueados
          </p>
          <p className="text-[11.5px] text-[#5F5E5A]">
            Score atual: {agroScore.totalScore}/1000
          </p>
        </div>
      </div>

      <div className="px-5 pb-2">
        <button
          type="button"
          onClick={() => onNavigate('tela-09')}
          className="w-full py-3.5 rounded-2xl bg-[#3B6D11] hover:bg-[#2F590D] text-white font-bold text-[15px] transition"
        >
          Voltar ao início
        </button>
        <HomeIndicatorOnly />
      </div>
    </div>
  );
};
