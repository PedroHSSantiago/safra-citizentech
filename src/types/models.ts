export type ScreenId =
  | 'tela-01' | 'tela-02' | 'tela-03' | 'tela-04' | 'tela-05' | 'tela-06' | 'tela-07' | 'tela-08'
  | 'tela-09' | 'tela-10' | 'tela-11' | 'tela-12' | 'tela-13'
  | 'tela-14' | 'tela-15' | 'tela-16' | 'tela-17' | 'tela-18' | 'tela-19'
  | 'tela-20' | 'tela-21' | 'tela-22' | 'tela-23'
  | 'tela-24' | 'tela-25' | 'tela-26' | 'tela-27' | 'tela-28' | 'tela-29'
  | 'tela-30' | 'tela-31' | 'tela-32'
  | 'tela-33' | 'tela-34' | 'tela-35';

export type ModuleId = 1 | 2 | 3 | 4 | 5 | 6;

export interface ScreenCatalogItem {
  id: ScreenId;
  figmaNodeId: string;
  figmaName: string;
  title: string;
  moduleId: ModuleId;
  moduleName: string;
}

// ============================================================================
// ENTIDADES DO DOMÍNIO (PRONTAS PARA BACKEND JAVA SPRING BOOT + MYSQL/ORACLE)
// ============================================================================

export interface ProducerEntity {
  id: string;
  fullName: string;
  initials: string;
  cpfMasked: string;
  phoneWhatsapp: string;
  municipality: string;
  state: string;
  primaryCrop: string;
  secondaryCrops: string[];
  lgpdAccepted: boolean;
  gpsAuthorized: boolean;
  monthsInSafra: number;
  resolvedAlertsCount: number;
}

export interface FarmEntity {
  id: string;
  producerId: string;
  name: string;
  carCode: string;
  carValid: boolean;
  totalAreaHa: number;
  mappingMethod: 'DRAW_POLYGON' | 'IMPORT_CAR';
  municipality: string;
  state: string;
  averageNdvi: number;
  nextSatellitePassHours: number;
  satelliteName: 'Sentinel-2A' | 'Landsat-9' | 'CBERS-4A';
  lastUpdatedLabel: string;
}

export interface NdviHistoryPoint {
  month: string;
  value3m?: number;
  value6m: number;
}

export interface PlotAlertPreferences {
  pestAndDisease: boolean;
  ndviDropOver5Pct: boolean;
  weatherAndRain: boolean;
  nearbyFiresInpe: boolean;
  checkFrequency: '12h' | 'DAILY' | 'WEEKLY';
  notifyPush: boolean;
  notifyWhatsapp: boolean;
  notifySmsCritical: boolean;
}

export interface PlotEntity {
  id: string;
  farmId: string;
  name: string;
  shortName: string;
  crop: string;
  areaHa: number;
  plantingYear: number;
  plantingDateLabel: string;
  ageYears: number;
  currentNdvi: number;
  ndviDelta30d: number;
  status: 'SAUDAVEL' | 'ALERTA' | 'CRITICO';
  lastActionLabel: string;
  lastActionDetail: string;
  polygonPoints: Array<{ x: number; y: number }>;
  ndviHistory: NdviHistoryPoint[];
  alertPreferences: PlotAlertPreferences;
}

export interface AlertEntity {
  id: string;
  farmId: string;
  plotId?: string;
  plotName?: string;
  category: 'CRITICOS' | 'PRAGAS' | 'CLIMA' | 'AGRO_PLUS';
  severity: 'CRITICO' | 'MEDIO' | 'INFO' | 'AGRO+';
  dayGroup: 'HOJE' | 'ONTEM';
  title: string;
  subtitle: string;
  timeAgo: string;
  targetScreen: ScreenId;
  read: boolean;
}

export interface ActionPlanStepEntity {
  stepNumber: number;
  timingBadge: string;
  title: string;
  description: string;
  completed: boolean;
  linkedScreen?: ScreenId;
}

export interface ActiveIngredientEntity {
  id: string;
  name: string;
  type: 'BIOLOGICO' | 'QUIMICO';
  isOrganic: boolean;
  recommended: boolean;
  subtitle: string;
  tags: string[];
  dosage: string;
  costPerHa: number;
  costLabel: string;
  efficacyLabel: string;
  stars: number;
}

export interface SprayingScheduleEntity {
  id: string;
  plotId: string;
  plotName: string;
  areaHa: number;
  dateIso: string;
  dateLabel: string;
  dayOfMonth: number;
  windSpeedKmh: number;
  period: 'MANHA' | 'TARDE' | 'NOITE';
  periodHours: string;
  ingredientId: string;
  ingredientName: string;
  estimatedTotalCost: number;
  agroScoreBonusPoints: number;
  confirmed: boolean;
}

export interface NeighborContactEntity {
  id: string;
  initials: string;
  name: string;
  farmName: string;
  distanceKm: number;
  phone: string;
  selected: boolean;
  deliveryChannel: 'SMS + WhatsApp' | 'SMS';
  deliveryStatus: 'ENTREGUE' | 'LIDO' | 'ENVIANDO';
}

export interface FireRiskEntity {
  id: string;
  hotspotsCount: number;
  nearestDistanceKm: number;
  windDirection: string;
  windSpeedKmh: number;
  humidityPct: number;
  temperatureC: number;
  estimatedArrivalHours: number;
  detectedMinutesAgo: number;
  notifyCivilDefense: boolean;
  prepareFirebreaks: boolean;
  civilDefenseProtocol: string;
  customMessage: string;
}

export interface AgroScoreBreakdownEntity {
  totalScore: number;
  maxScore: number;
  ratingLabel: 'EXCELENTE' | 'BOM' | 'REGULAR';
  ndviPoints: number;
  ndviMax: number;
  actionsPoints: number;
  actionsMax: number;
  carDocsPoints: number;
  carDocsMax: number;
  actionPlanAdherencePoints: number;
  actionPlanAdherenceMax: number;
}

export interface CreditOfferEntity {
  id: string;
  code: string;
  institution: string;
  lineName: string;
  category: 'INSUMOS' | 'CUSTEIO' | 'MAQUINAS';
  maxAmount: number;
  maxTermMonths: number;
  graceMonths: number;
  interestRateYearly: number;
  cetYearly: number;
  bestRateBadge?: boolean;
  partnerInputBonus?: number;
  colorHex: string;
}

export interface CreditSimulationEntity {
  offerId: string;
  institution: string;
  requestedAmount: number;
  installments: 12 | 24 | 36;
  graceMonths: number;
  interestRateYearly: number;
  monthlyInstallment: number;
  totalInterest: number;
  taxesAndFees: number;
  totalPayable: number;
  lgpdSharingAccepted: boolean;
  contractAccepted: boolean;
  status: 'DRAFT' | 'SUBMITTED' | 'APPROVED';
  bankAccountLabel: string;
}

export interface VoicePromptEntity {
  id: string;
  utterance: string;
  subtitle: string;
  aiHeadline: string;
  aiBody: string;
  ndviValue: string;
  ndviChange: string;
  pestRiskLevel: 'MÉDIO' | 'BAIXO' | 'ALTO';
  pestRiskDetail: string;
  recommendation: string;
  audioDuration: string;
}

export interface OfflineSyncQueueItem {
  id: string;
  timestamp: string;
  method: 'POST' | 'PUT' | 'PATCH';
  endpoint: string;
  entityType: string;
  payload: unknown;
  status: 'PENDING_OFFLINE' | 'SYNCED';
}

export interface ApiRequestLog {
  id: string;
  timestamp: string;
  method: 'GET' | 'POST' | 'PUT' | 'PATCH';
  endpoint: string;
  status: number;
  mode: 'ONLINE_REST' | 'OFFLINE_ROOM_CACHE';
  durationMs: number;
  summary: string;
}
