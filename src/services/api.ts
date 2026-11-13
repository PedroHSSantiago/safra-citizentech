import {
  ApiRequestLog,
  CreditSimulationEntity,
  FarmEntity,
  FireRiskEntity,
  NeighborContactEntity,
  OfflineSyncQueueItem,
  PlotAlertPreferences,
  PlotEntity,
  ProducerEntity,
  SprayingScheduleEntity,
} from '../types/models';

export const API_BASE_URL =
  (typeof import.meta !== 'undefined' && (import.meta as unknown as { env?: Record<string, string> }).env?.VITE_API_BASE_URL) ||
  'http://localhost:8080/api/v1';

const STORAGE_KEYS = {
  STATE: 'safra_citizentech_state_v1',
  SYNC_QUEUE: 'safra_citizentech_sync_queue_v1',
  API_LOGS: 'safra_citizentech_api_logs_v1',
};

export interface SafraBackendContract {
  baseUrl: string;
  endpoints: {
    producerProfile: string;
    farmByCar: string;
    plots: string;
    plotAlerts: (plotId: string) => string;
    telemetryNdvi: (farmId: string) => string;
    pestAlerts: (farmId: string) => string;
    sprayingSchedule: string;
    fireHotspotsInpe: string;
    neighborBroadcast: string;
    civilDefense193: string;
    agroScore: (producerId: string) => string;
    creditOffers: (producerId: string) => string;
    creditProposals: string;
    voiceAssistantIa: string;
    batchOfflineSync: string;
  };
}

export const SAFRA_BACKEND_CONTRACT: SafraBackendContract = {
  baseUrl: API_BASE_URL,
  endpoints: {
    producerProfile: '/producers/me',
    farmByCar: '/farms/car-import',
    plots: '/plots',
    plotAlerts: (plotId: string) => `/plots/${plotId}/alert-preferences`,
    telemetryNdvi: (farmId: string) => `/telemetry/farms/${farmId}/ndvi`,
    pestAlerts: (farmId: string) => `/embrapa-ai/farms/${farmId}/pest-predictions`,
    sprayingSchedule: '/embrapa-ai/spraying-schedules',
    fireHotspotsInpe: '/inpe/fire-hotspots/nearby',
    neighborBroadcast: '/community/fire-alerts/broadcast',
    civilDefense193: '/emergency/defesa-civil/protocol',
    agroScore: (producerId: string) => `/agro-avali/producers/${producerId}/score`,
    creditOffers: (producerId: string) => `/agro-avali/producers/${producerId}/offers`,
    creditProposals: '/agro-avali/credit-proposals',
    voiceAssistantIa: '/safra-voice-ai/query',
    batchOfflineSync: '/offline-sync/batch',
  },
};

function nowTimeLabel(): string {
  const d = new Date();
  return d.toLocaleTimeString('pt-BR', { hour12: false });
}

export class SafraApiService {
  private offlineMode: boolean = false;
  private listeners: Array<() => void> = [];
  private logs: ApiRequestLog[] = [
    {
      id: 'log-init-1',
      timestamp: nowTimeLabel(),
      method: 'GET',
      endpoint: '/telemetry/farms/farm-sao-bento-001/ndvi',
      status: 200,
      mode: 'OFFLINE_ROOM_CACHE',
      durationMs: 14,
      summary: 'Sentinel-2A NDVI 0.78 carregado (Fazenda São Bento · 18,4 ha)',
    },
    {
      id: 'log-init-2',
      timestamp: nowTimeLabel(),
      method: 'GET',
      endpoint: '/embrapa-ai/farms/farm-sao-bento-001/pest-predictions',
      status: 200,
      mode: 'OFFLINE_ROOM_CACHE',
      durationMs: 19,
      summary: 'IA Embrapa: Risco Médio Broca-do-café (Talhão Norte em 9 dias)',
    },
    {
      id: 'log-init-3',
      timestamp: nowTimeLabel(),
      method: 'GET',
      endpoint: '/agro-avali/producers/prod-jose-001/score',
      status: 200,
      mode: 'OFFLINE_ROOM_CACHE',
      durationMs: 11,
      summary: 'Score Agro+ 742/1000 auditado · 3 ofertas pré-aprovadas',
    },
  ];
  private syncQueue: OfflineSyncQueueItem[] = [];

  constructor() {
    this.loadFromStorage();
  }

  private loadFromStorage() {
    try {
      if (typeof window === 'undefined' || !window.localStorage) return;
      const savedQueue = window.localStorage.getItem(STORAGE_KEYS.SYNC_QUEUE);
      if (savedQueue) {
        this.syncQueue = JSON.parse(savedQueue);
      }
    } catch {
      // ignore storage errors in restricted environments
    }
  }

  private persistQueue() {
    try {
      if (typeof window !== 'undefined' && window.localStorage) {
        window.localStorage.setItem(STORAGE_KEYS.SYNC_QUEUE, JSON.stringify(this.syncQueue));
      }
    } catch {
      // ignore
    }
    this.notify();
  }

  public subscribe(listener: () => void): () => void {
    this.listeners.push(listener);
    return () => {
      this.listeners = this.listeners.filter((l) => l !== listener);
    };
  }

  private notify() {
    this.listeners.forEach((l) => l());
  }

  public isOffline(): boolean {
    return this.offlineMode;
  }

  public setOfflineMode(offline: boolean) {
    this.offlineMode = offline;
    this.recordLog(
      'PATCH',
      '/device/connectivity-mode',
      200,
      offline ? 'Modo Offline-First ativado (Room DB Local)' : 'Modo Online ativado (Pronto para Sync REST)'
    );
    this.notify();
  }

  public getLogs(): ApiRequestLog[] {
    return this.logs;
  }

  public getSyncQueue(): OfflineSyncQueueItem[] {
    return this.syncQueue;
  }

  private recordLog(
    method: 'GET' | 'POST' | 'PUT' | 'PATCH',
    endpoint: string,
    status: number,
    summary: string
  ) {
    const entry: ApiRequestLog = {
      id: `log-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
      timestamp: nowTimeLabel(),
      method,
      endpoint,
      status,
      mode: this.offlineMode ? 'OFFLINE_ROOM_CACHE' : 'ONLINE_REST',
      durationMs: this.offlineMode ? 8 : 42,
      summary,
    };
    this.logs = [entry, ...this.logs].slice(0, 30);
    this.notify();
  }

  private enqueueMutation(
    method: 'POST' | 'PUT' | 'PATCH',
    endpoint: string,
    entityType: string,
    payload: unknown,
    summary: string
  ) {
    const item: OfflineSyncQueueItem = {
      id: `sync-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
      timestamp: nowTimeLabel(),
      method,
      endpoint,
      entityType,
      payload,
      status: this.offlineMode ? 'PENDING_OFFLINE' : 'SYNCED',
    };
    this.syncQueue = [item, ...this.syncQueue].slice(0, 25);
    this.recordLog(method, endpoint, this.offlineMode ? 202 : 200, summary);
    this.persistQueue();
  }

  public async updateProducer(producer: ProducerEntity): Promise<ProducerEntity> {
    this.enqueueMutation(
      'PUT',
      SAFRA_BACKEND_CONTRACT.endpoints.producerProfile,
      'TB_PRODUTOR_RURAL',
      producer,
      `Cadastro LGPD atualizado: ${producer.fullName} (${producer.municipality}/${producer.state})`
    );
    return producer;
  }

  public async registerFarm(farm: FarmEntity): Promise<FarmEntity> {
    this.enqueueMutation(
      'POST',
      SAFRA_BACKEND_CONTRACT.endpoints.farmByCar,
      'TB_PROPRIEDADE_CAR',
      farm,
      `Propriedade ${farm.name} (${farm.totalAreaHa} ha) vinculada ao CAR ${farm.carCode}`
    );
    return farm;
  }

  public async createPlot(plot: PlotEntity): Promise<PlotEntity> {
    this.enqueueMutation(
      'POST',
      SAFRA_BACKEND_CONTRACT.endpoints.plots,
      'TB_TALHAO_GEOMETRIA',
      plot,
      `Novo talhão salvo: ${plot.name} (${plot.areaHa} ha · ${plot.polygonPoints.length} vértices)`
    );
    return plot;
  }

  public async updatePlotAlertPreferences(
    plotId: string,
    prefs: PlotAlertPreferences
  ): Promise<PlotAlertPreferences> {
    this.enqueueMutation(
      'PUT',
      SAFRA_BACKEND_CONTRACT.endpoints.plotAlerts(plotId),
      'TB_PREFERENCIA_ALERTA',
      prefs,
      `Preferências de alerta salvas para ${plotId} (${prefs.checkFrequency})`
    );
    return prefs;
  }

  public async scheduleSpraying(schedule: SprayingScheduleEntity): Promise<SprayingScheduleEntity> {
    this.enqueueMutation(
      'POST',
      SAFRA_BACKEND_CONTRACT.endpoints.sprayingSchedule,
      'TB_AGENDAMENTO_MANEJO',
      schedule,
      `Pulverização agendada: ${schedule.ingredientName} em ${schedule.dateLabel} (+${schedule.agroScoreBonusPoints} pts Agro+)`
    );
    return schedule;
  }

  public async broadcastFireAlert(
    fireRisk: FireRiskEntity,
    neighbors: NeighborContactEntity[]
  ): Promise<{ deliveredCount: number; protocol: string }> {
    const selected = neighbors.filter((n) => n.selected);
    this.enqueueMutation(
      'POST',
      SAFRA_BACKEND_CONTRACT.endpoints.neighborBroadcast,
      'TB_REDE_COMUNITARIA_ALERTA',
      {
        fireRiskId: fireRisk.id,
        message: fireRisk.customMessage,
        recipients: selected.map((n) => ({ id: n.id, name: n.name, phone: n.phone })),
        notifyCivilDefense: fireRisk.notifyCivilDefense,
      },
      `Disparo comunitário enviado para ${selected.length} vizinhos + Defesa Civil (${fireRisk.civilDefenseProtocol})`
    );
    return {
      deliveredCount: selected.length,
      protocol: fireRisk.civilDefenseProtocol,
    };
  }

  public async submitCreditProposal(
    simulation: CreditSimulationEntity
  ): Promise<CreditSimulationEntity> {
    const approved: CreditSimulationEntity = {
      ...simulation,
      status: 'APPROVED',
    };
    this.enqueueMutation(
      'POST',
      SAFRA_BACKEND_CONTRACT.endpoints.creditProposals,
      'TB_PROPOSTA_CREDITO_RURAL',
      approved,
      `Proposta ${simulation.institution} R$ ${simulation.requestedAmount.toLocaleString('pt-BR')} (${simulation.installments}x) aprovada`
    );
    return approved;
  }

  public async syncAllPendingToBackend(): Promise<number> {
    const pendingCount = this.syncQueue.filter((i) => i.status === 'PENDING_OFFLINE').length;
    this.syncQueue = this.syncQueue.map((item) => ({
      ...item,
      status: 'SYNCED',
    }));
    this.offlineMode = false;
    this.recordLog(
      'POST',
      SAFRA_BACKEND_CONTRACT.endpoints.batchOfflineSync,
      200,
      `Sincronização Retrofit concluída: ${pendingCount} registros enviados ao Backend Spring Boot`
    );
    this.persistQueue();
    return pendingCount;
  }
}

export const safraApi = new SafraApiService();
