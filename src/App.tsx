import React, { useEffect, useState } from 'react';
import {
  ActionPlanStepEntity,
  CreditSimulationEntity,
  FarmEntity,
  FireRiskEntity,
  NeighborContactEntity,
  PlotAlertPreferences,
  PlotEntity,
  ProducerEntity,
  ScreenId,
  SprayingScheduleEntity,
  VoicePromptEntity,
} from './types/models';
import {
  INITIAL_ACTION_PLAN_STEPS,
  INITIAL_ACTIVE_INGREDIENTS,
  INITIAL_AGRO_SCORE,
  INITIAL_ALERTS,
  INITIAL_CREDIT_OFFERS,
  INITIAL_CREDIT_SIMULATION,
  INITIAL_FARM,
  INITIAL_FIRE_RISK,
  INITIAL_NEIGHBORS,
  INITIAL_PLOTS,
  INITIAL_PRODUCER,
  INITIAL_SPRAYING_SCHEDULE,
  SCREEN_CATALOG,
  VOICE_PROMPTS,
  calculateUpdatedAgroScore,
} from './data/seedData';
import { safraApi } from './services/api';
import { Module1OnboardingAndPlots } from './components/screens/Module1OnboardingAndPlots';
import { Module2TelemetryAndNav } from './components/screens/Module2TelemetryAndNav';
import { Module3PestsAndEmbrapa } from './components/screens/Module3PestsAndEmbrapa';
import { Module4FireDefense } from './components/screens/Module4FireDefense';
import { Module5AgroScoreAndCredit } from './components/screens/Module5AgroScoreAndCredit';
import { Module6VoiceAssistant } from './components/screens/Module6VoiceAssistant';
import { CitizenTechInspector } from './components/CitizenTechInspector';
import {
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  ChevronUp,
  Database,
  Eye,
  EyeOff,
  Globe,
  Home,
  Layers,
  Server,
  ShieldCheck,
} from 'lucide-react';

export function App() {
  const [currentScreen, setCurrentScreen] = useState<ScreenId>('tela-09');
  const [showInspector, setShowInspector] = useState<boolean>(true);
  const [showProjectOverview, setShowProjectOverview] = useState<boolean>(true);
  const [offlineMode, setOfflineMode] = useState<boolean>(safraApi.isOffline());
  const [apiLogs, setApiLogs] = useState(safraApi.getLogs());
  const [syncQueue, setSyncQueue] = useState(safraApi.getSyncQueue());

  // Core Domain State (Ready for Backend Hydration)
  const [producer, setProducer] = useState<ProducerEntity>(INITIAL_PRODUCER);
  const [farm, setFarm] = useState<FarmEntity>(INITIAL_FARM);
  const [plots, setPlots] = useState<PlotEntity[]>(INITIAL_PLOTS);
  const [selectedPlotId, setSelectedPlotId] = useState<string>('plot-norte');
  const [alerts] = useState(INITIAL_ALERTS);
  const [steps, setSteps] = useState<ActionPlanStepEntity[]>(INITIAL_ACTION_PLAN_STEPS);
  const [ingredients] = useState(INITIAL_ACTIVE_INGREDIENTS);
  const [schedule, setSchedule] = useState<SprayingScheduleEntity>(INITIAL_SPRAYING_SCHEDULE);
  const [fireRisk, setFireRisk] = useState<FireRiskEntity>(INITIAL_FIRE_RISK);
  const [neighbors, setNeighbors] = useState<NeighborContactEntity[]>(INITIAL_NEIGHBORS);
  const [offers] = useState(INITIAL_CREDIT_OFFERS);
  const [simulation, setSimulation] = useState<CreditSimulationEntity>(
    INITIAL_CREDIT_SIMULATION
  );
  const [selectedVoicePrompt, setSelectedVoicePrompt] = useState<VoicePromptEntity>(
    VOICE_PROMPTS[0]
  );

  useEffect(() => {
    return safraApi.subscribe(() => {
      setOfflineMode(safraApi.isOffline());
      setApiLogs([...safraApi.getLogs()]);
      setSyncQueue([...safraApi.getSyncQueue()]);
    });
  }, []);

  const completedStepsCount = steps.filter((s) => s.completed).length;
  const agroScore = calculateUpdatedAgroScore(
    INITIAL_AGRO_SCORE,
    schedule.confirmed,
    simulation.status === 'APPROVED',
    completedStepsCount
  );

  // Handlers wired to Backend Service Layer (src/services/api.ts)
  const handleToggleOffline = (offline: boolean) => {
    safraApi.setOfflineMode(offline);
  };

  const handleUpdateProducer = (updated: ProducerEntity) => {
    setProducer(updated);
    safraApi.updateProducer(updated);
  };

  const handleUpdateFarm = (updated: FarmEntity) => {
    setFarm(updated);
    safraApi.registerFarm(updated);
  };

  const handleAddPlot = (newPlot: PlotEntity) => {
    const nextPlots = [...plots, newPlot];
    setPlots(nextPlots);
    const totalArea = Number(
      nextPlots.reduce((acc, p) => acc + p.areaHa, 0).toFixed(1)
    );
    setFarm({ ...farm, totalAreaHa: totalArea });
    safraApi.createPlot(newPlot);
  };

  const handleUpdatePlotAlerts = (plotId: string, prefs: PlotAlertPreferences) => {
    setPlots(
      plots.map((p) => (p.id === plotId ? { ...p, alertPreferences: prefs } : p))
    );
    safraApi.updatePlotAlertPreferences(plotId, prefs);
  };

  const handleToggleStep = (stepNumber: number) => {
    setSteps(
      steps.map((s) =>
        s.stepNumber === stepNumber ? { ...s, completed: !s.completed } : s
      )
    );
  };

  const handleConfirmSchedule = (updated: SprayingScheduleEntity) => {
    setSchedule(updated);
    safraApi.scheduleSpraying(updated);
  };

  const handleToggleNeighbor = (id: string) => {
    setNeighbors(
      neighbors.map((n) => (n.id === id ? { ...n, selected: !n.selected } : n))
    );
  };

  const handleBroadcastFireAlert = () => {
    safraApi.broadcastFireAlert(fireRisk, neighbors);
    setNeighbors(
      neighbors.map((n) =>
        n.selected ? { ...n, deliveryStatus: 'ENTREGUE' } : n
      )
    );
  };

  const handleSubmitCreditProposal = (sim: CreditSimulationEntity) => {
    const approved: CreditSimulationEntity = { ...sim, status: 'APPROVED' };
    setSimulation(approved);
    safraApi.submitCreditProposal(approved);
  };

  // Screen Index Navigation Helpers
  const currentIdx = SCREEN_CATALOG.findIndex((s) => s.id === currentScreen);
  const goPrevScreen = () => {
    const prevIdx = (currentIdx - 1 + SCREEN_CATALOG.length) % SCREEN_CATALOG.length;
    setCurrentScreen(SCREEN_CATALOG[prevIdx].id);
  };
  const goNextScreen = () => {
    const nextIdx = (currentIdx + 1) % SCREEN_CATALOG.length;
    setCurrentScreen(SCREEN_CATALOG[nextIdx].id);
  };

  const renderActiveScreen = () => {
    if (
      [
        'tela-01',
        'tela-02',
        'tela-03',
        'tela-04',
        'tela-05',
        'tela-06',
        'tela-07',
        'tela-08',
        'tela-33',
        'tela-34',
        'tela-35',
      ].includes(currentScreen)
    ) {
      return (
        <Module1OnboardingAndPlots
          screen={currentScreen}
          offlineMode={offlineMode}
          producer={producer}
          farm={farm}
          plots={plots}
          selectedPlotId={selectedPlotId}
          onNavigate={setCurrentScreen}
          onSelectPlot={setSelectedPlotId}
          onUpdateProducer={handleUpdateProducer}
          onUpdateFarm={handleUpdateFarm}
          onAddPlot={handleAddPlot}
          onUpdatePlotAlerts={handleUpdatePlotAlerts}
        />
      );
    }

    if (['tela-09', 'tela-10', 'tela-11', 'tela-12', 'tela-13'].includes(currentScreen)) {
      return (
        <Module2TelemetryAndNav
          screen={currentScreen}
          offlineMode={offlineMode}
          producer={producer}
          farm={farm}
          plots={plots}
          selectedPlotId={selectedPlotId}
          alerts={alerts}
          agroScore={agroScore}
          onNavigate={setCurrentScreen}
          onSelectPlot={setSelectedPlotId}
          onToggleOffline={handleToggleOffline}
        />
      );
    }

    if (
      ['tela-14', 'tela-15', 'tela-16', 'tela-17', 'tela-18', 'tela-19'].includes(
        currentScreen
      )
    ) {
      return (
        <Module3PestsAndEmbrapa
          screen={currentScreen}
          offlineMode={offlineMode}
          steps={steps}
          ingredients={ingredients}
          schedule={schedule}
          agroScore={agroScore}
          onNavigate={setCurrentScreen}
          onToggleStep={handleToggleStep}
          onConfirmSchedule={handleConfirmSchedule}
        />
      );
    }

    if (['tela-20', 'tela-21', 'tela-22', 'tela-23'].includes(currentScreen)) {
      return (
        <Module4FireDefense
          screen={currentScreen}
          offlineMode={offlineMode}
          fireRisk={fireRisk}
          neighbors={neighbors}
          onNavigate={setCurrentScreen}
          onToggleNeighbor={handleToggleNeighbor}
          onUpdateFireRisk={setFireRisk}
          onBroadcastFireAlert={handleBroadcastFireAlert}
        />
      );
    }

    if (
      ['tela-24', 'tela-25', 'tela-26', 'tela-27', 'tela-28', 'tela-29'].includes(
        currentScreen
      )
    ) {
      return (
        <Module5AgroScoreAndCredit
          screen={currentScreen}
          offlineMode={offlineMode}
          producer={producer}
          farm={farm}
          agroScore={agroScore}
          offers={offers}
          simulation={simulation}
          onNavigate={setCurrentScreen}
          onUpdateSimulation={setSimulation}
          onSubmitCreditProposal={handleSubmitCreditProposal}
        />
      );
    }

    return (
      <Module6VoiceAssistant
        screen={currentScreen}
        offlineMode={offlineMode}
        selectedVoicePrompt={selectedVoicePrompt}
        onSelectVoicePrompt={setSelectedVoicePrompt}
        onNavigate={setCurrentScreen}
      />
    );
  };

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-[#0F1E0E] via-[#172D16] to-[#0C180B] flex flex-col items-center justify-center p-2 sm:p-5">
      {/* Top Quick Bar */}
      <div className="w-full max-w-[1080px] mb-3 px-2 flex flex-wrap items-center justify-between gap-2 text-white">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-[#689F28] flex items-center justify-center font-extrabold text-base shadow-md">
            🌱
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-extrabold tracking-tight text-[16px]">SAFRA</span>
              <span className="px-2 py-0.5 rounded-full bg-[#689F28]/30 border border-[#689F28]/50 text-[#A8E063] text-[10px] font-bold uppercase tracking-wider">
                CitizenTech · FIAP GS 2026
              </span>
            </div>
            <span className="text-[11px] text-white/65 block">
              "O espaço plantando junto com você." — Resiliência Climática & Crédito Agrícola
            </span>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={() => setShowProjectOverview(!showProjectOverview)}
            className="px-2.5 py-1 rounded-lg bg-white/10 hover:bg-white/20 text-[11px] font-semibold flex items-center gap-1"
          >
            {showProjectOverview ? (
              <>
                <ChevronUp className="w-3.5 h-3.5" /> Resumo & Tecnologias
              </>
            ) : (
              <>
                <ChevronDown className="w-3.5 h-3.5" /> Sobre o Projeto & Stack
              </>
            )}
          </button>
          <button
            type="button"
            onClick={() => setCurrentScreen('tela-01')}
            className="px-2.5 py-1 rounded-lg bg-white/10 hover:bg-white/15 text-[11px] font-semibold"
          >
            Splash (01)
          </button>
          <button
            type="button"
            onClick={() => setCurrentScreen('tela-09')}
            className="px-2.5 py-1 rounded-lg bg-[#689F28] hover:bg-[#588821] text-[11px] font-bold flex items-center gap-1"
          >
            <Home className="w-3 h-3" /> Home NDVI (09)
          </button>
          <div className="flex items-center bg-white/10 rounded-lg overflow-hidden">
            <button
              type="button"
              onClick={goPrevScreen}
              className="px-2 py-1 hover:bg-white/15"
              title="Tela anterior"
            >
              <ChevronLeft className="w-3.5 h-3.5" />
            </button>
            <span className="px-2 text-[11px] font-mono">
              {currentIdx + 1}/35
            </span>
            <button
              type="button"
              onClick={goNextScreen}
              className="px-2 py-1 hover:bg-white/15"
              title="Próxima tela"
            >
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>
          <button
            type="button"
            onClick={() => setShowInspector(!showInspector)}
            className="hidden lg:flex items-center gap-1.5 px-3 py-1 rounded-lg bg-white/10 hover:bg-white/20 text-[11px] font-semibold"
          >
            {showInspector ? (
              <>
                <EyeOff className="w-3.5 h-3.5" /> Ocultar Painel
              </>
            ) : (
              <>
                <Eye className="w-3.5 h-3.5" /> Mostrar Painel Técnico
              </>
            )}
          </button>
        </div>
      </div>

      {/* Main Page Project Explanation & Technologies Overview */}
      {showProjectOverview && (
        <section className="w-full max-w-[1080px] mb-5 rounded-2xl bg-white/95 backdrop-blur-md border border-white/20 shadow-xl p-4 sm:p-5 text-[#1B2B1A]">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-start">
            {/* About the Project */}
            <div className="lg:col-span-5 space-y-2">
              <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-[#EBF3E0] text-[#2D5016] text-[11px] font-extrabold uppercase tracking-wide">
                <Globe className="w-3.5 h-3.5 text-[#689F28]" /> Sobre o Projeto SAFRA
              </div>
              <h1 className="text-[17px] sm:text-[19px] font-extrabold leading-snug text-[#1B2B1A]">
                Inteligência Climática Orbital & Crédito Verde para a Agricultura Familiar
              </h1>
              <p className="text-[12px] text-[#4A5548] leading-relaxed">
                O <strong>SAFRA</strong> é uma plataforma <em>CitizenTech</em> multiplataforma e{' '}
                <strong>Offline-First</strong> que democratiza o monitoramento via satélite (NDVI{' '}
                <strong>Sentinel-2 / CBERS-4A</strong>), alertas precoces de pragas e clima (
                <strong>Embrapa / INMET</strong>), rede comunitária contra incêndios florestais (
                <strong>INPE / Defesa Civil</strong>) e acesso desburocratizado ao crédito rural subsidiado (
                <strong>Score Agro + Pronaf / BCB Sicor</strong>), com assistente de voz pensado para o pequeno produtor rural.
              </p>
              <div className="flex flex-wrap gap-1.5 pt-1">
                <span className="px-2 py-0.5 rounded-md bg-[#2D5016] text-white text-[10px] font-bold">
                  ODS 2 · Fome Zero e Agricultura Sustentável
                </span>
                <span className="px-2 py-0.5 rounded-md bg-[#689F28] text-white text-[10px] font-bold">
                  ODS 8 · Trabalho Decente
                </span>
                <span className="px-2 py-0.5 rounded-md bg-[#B96E00] text-white text-[10px] font-bold">
                  ODS 12 & 13 · Clima e Produção Responsável
                </span>
              </div>
            </div>

            {/* Technologies Used */}
            <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              <div className="p-3 rounded-xl bg-[#F7F6F1] border border-[#E2DFD5]">
                <div className="flex items-center gap-1.5 text-[12px] font-extrabold text-[#2D5016] mb-1">
                  <Layers className="w-4 h-4 text-[#689F28]" /> Frontend Multiplataforma (Ativo)
                </div>
                <p className="text-[11px] text-[#4A5548] leading-relaxed">
                  <strong>React 18</strong>, <strong>TypeScript 5</strong>, <strong>Vite 5</strong>,{' '}
                  <strong>Tailwind CSS</strong>, <strong>Lucide Icons</strong>,{' '}
                  <strong>Web Speech API</strong> (acessibilidade por voz nativa) e motor{' '}
                  <strong>Offline-First</strong> com fila persistente em <code>localStorage</code>.
                </p>
              </div>

              <div className="p-3 rounded-xl bg-[#F7F6F1] border border-[#E2DFD5]">
                <div className="flex items-center gap-1.5 text-[12px] font-extrabold text-[#2D5016] mb-1">
                  <Server className="w-4 h-4 text-[#689F28]" /> Backend REST Preparado (<code>backend/</code>)
                </div>
                <p className="text-[11px] text-[#4A5548] leading-relaxed">
                  Arquitetura pronta para <strong>Java 21 LTS + Spring Boot 3</strong> (Spring Web,
                  Spring Data JPA, Bean Validation), cliente HTTP REST em{' '}
                  <code>src/services/api.ts</code> e contrato <strong>OpenAPI 3.0</strong> (
                  <code>/api/v1</code>).
                </p>
              </div>

              <div className="p-3 rounded-xl bg-[#F7F6F1] border border-[#E2DFD5]">
                <div className="flex items-center gap-1.5 text-[12px] font-extrabold text-[#2D5016] mb-1">
                  <Database className="w-4 h-4 text-[#689F28]" /> Banco de Dados Relacional (<code>database/</code>)
                </div>
                <p className="text-[11px] text-[#4A5548] leading-relaxed">
                  Modelagem em 3ª Forma Normal (3FN) para <strong>MySQL 8+</strong> e{' '}
                  <strong>Oracle Database</strong> com 8 tabelas relacionais (DDL + Seed SQL em{' '}
                  <code>database/schema.sql</code>).
                </p>
              </div>

              <div className="p-3 rounded-xl bg-[#F7F6F1] border border-[#E2DFD5]">
                <div className="flex items-center gap-1.5 text-[12px] font-extrabold text-[#2D5016] mb-1">
                  <ShieldCheck className="w-4 h-4 text-[#689F28]" /> Qualidade, CI/CD & APIs Públicas
                </div>
                <p className="text-[11px] text-[#4A5548] leading-relaxed">
                  Testes automatizados com <strong>Vitest</strong>, pipeline{' '}
                  <strong>GitHub Actions CI/CD</strong> e integração prevista com{' '}
                  <strong>Embrapa AgroAPI</strong>, <strong>INPE Queimadas</strong>,{' '}
                  <strong>INMET</strong> e <strong>SICAR/CAR</strong>.
                </p>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Main Workspace: iPhone 393x852 Frame + Optional Technical Inspector */}
      <div className="w-full max-w-[1080px] flex flex-col lg:flex-row items-center lg:items-start justify-center gap-6">
        {/* iPhone 15 Pro 393x852 Viewport matching Figma exactly */}
        <div className="relative w-[393px] h-[852px] rounded-[46px] p-[10px] bg-[#262629] shadow-2xl ring-1 ring-white/20 shrink-0">
          <div className="w-full h-full rounded-[38px] overflow-hidden bg-[#F7F6F1] relative">
            {renderActiveScreen()}
          </div>
        </div>

        {/* CitizenTech & Backend Inspector Panel */}
        {showInspector && (
          <div className="w-full lg:flex-1 flex justify-center">
            <CitizenTechInspector
              currentScreen={currentScreen}
              offlineMode={offlineMode}
              apiLogs={apiLogs}
              syncQueue={syncQueue}
              onNavigate={setCurrentScreen}
              onToggleOffline={handleToggleOffline}
              onSyncPending={() => safraApi.syncAllPendingToBackend()}
            />
          </div>
        )}
      </div>
    </div>
  );
}
export default App;
