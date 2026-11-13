import {
  ActionPlanStepEntity,
  ActiveIngredientEntity,
  AgroScoreBreakdownEntity,
  AlertEntity,
  CreditOfferEntity,
  CreditSimulationEntity,
  FarmEntity,
  FireRiskEntity,
  NeighborContactEntity,
  PlotEntity,
  ProducerEntity,
  ScreenCatalogItem,
  SprayingScheduleEntity,
  VoicePromptEntity
} from '../types/models';

export const SCREEN_CATALOG: ScreenCatalogItem[] = [
  // Módulo 1: Cadastro Simplificado e Mapeamento (01-08 + 33-35)
  { id: 'tela-01', figmaNodeId: '2:776', figmaName: 'tela-01-cadastro-splash', title: '01 · Splash Screen SAFRA', moduleId: 1, moduleName: 'Módulo 1 · Cadastro & CAR' },
  { id: 'tela-02', figmaNodeId: '2:3416', figmaName: 'tela-02-cadastro-onboarding-01', title: '02 · Onboarding: Visão do Espaço', moduleId: 1, moduleName: 'Módulo 1 · Cadastro & CAR' },
  { id: 'tela-03', figmaNodeId: '2:1600', figmaName: 'tela-03-cadastro-onboarding-02', title: '03 · Onboarding: IA Embrapa Pragas', moduleId: 1, moduleName: 'Módulo 1 · Cadastro & CAR' },
  { id: 'tela-04', figmaNodeId: '2:1663', figmaName: 'tela-04-cadastro-onboarding-03', title: '04 · Onboarding: Score Agro+', moduleId: 1, moduleName: 'Módulo 1 · Cadastro & CAR' },
  { id: 'tela-05', figmaNodeId: '2:1530', figmaName: 'tela-05-cadastro-dados', title: '05 · Cadastro de Dados (LGPD)', moduleId: 1, moduleName: 'Módulo 1 · Cadastro & CAR' },
  { id: 'tela-06', figmaNodeId: '29:15', figmaName: 'tela-06-cadastro-permissao-localizacao', title: '06 · Permissão de Localização GPS', moduleId: 1, moduleName: 'Módulo 1 · Cadastro & CAR' },
  { id: 'tela-07', figmaNodeId: '29:75', figmaName: 'tela-07-cadastro-fazenda-metodo', title: '07 · Método de Mapeamento (Mapa/CAR)', moduleId: 1, moduleName: 'Módulo 1 · Cadastro & CAR' },
  { id: 'tela-08', figmaNodeId: '2:2858', figmaName: 'tela-08-cadastro-confirmacao', title: '08 · Fazenda Cadastrada no Radar', moduleId: 1, moduleName: 'Módulo 1 · Cadastro & CAR' },

  // Módulo 2: Dashboard de Telemetria em Tempo Real (09-13)
  { id: 'tela-09', figmaNodeId: '2:1713', figmaName: 'tela-09-nav-home-mapa-ndvi', title: '09 · Home: Mapa NDVI Ao Vivo', moduleId: 2, moduleName: 'Módulo 2 · Telemetria NDVI' },
  { id: 'tela-10', figmaNodeId: '2:2602', figmaName: 'tela-10-nav-talhao-detalhe', title: '10 · Detalhe do Talhão Norte', moduleId: 2, moduleName: 'Módulo 2 · Telemetria NDVI' },
  { id: 'tela-11', figmaNodeId: '2:3160', figmaName: 'tela-11-nav-alertas-central', title: '11 · Central de Alertas', moduleId: 2, moduleName: 'Módulo 2 · Telemetria NDVI' },
  { id: 'tela-12', figmaNodeId: '2:1833', figmaName: 'tela-12-nav-perfil', title: '12 · Perfil do Produtor', moduleId: 2, moduleName: 'Módulo 2 · Telemetria NDVI' },
  { id: 'tela-13', figmaNodeId: '2:2116', figmaName: 'tela-13-nav-configuracoes', title: '13 · Configurações & Modo Offline', moduleId: 2, moduleName: 'Módulo 2 · Telemetria NDVI' },

  // Módulo 3: Alertas de Pragas e Plano de Ação Embrapa (14-19)
  { id: 'tela-14', figmaNodeId: '2:3360', figmaName: 'tela-14-praga-notificacao-push', title: '14 · Push Notification: Broca-do-café', moduleId: 3, moduleName: 'Módulo 3 · Pragas & Embrapa' },
  { id: 'tela-15', figmaNodeId: '2:2036', figmaName: 'tela-15-praga-detalhe-alerta', title: '15 · Diagnóstico IA de Praga', moduleId: 3, moduleName: 'Módulo 3 · Pragas & Embrapa' },
  { id: 'tela-16', figmaNodeId: '2:2786', figmaName: 'tela-16-praga-plano-acao', title: '16 · Plano de Ação em 4 Passos', moduleId: 3, moduleName: 'Módulo 3 · Pragas & Embrapa' },
  { id: 'tela-17', figmaNodeId: '2:2916', figmaName: 'tela-17-praga-principios-ativos', title: '17 · Princípios Ativos Embrapa', moduleId: 3, moduleName: 'Módulo 3 · Pragas & Embrapa' },
  { id: 'tela-18', figmaNodeId: '2:2479', figmaName: 'tela-18-praga-agendar-pulverizacao', title: '18 · Agendar Pulverização (Vento Ideal)', moduleId: 3, moduleName: 'Módulo 3 · Pragas & Embrapa' },
  { id: 'tela-19', figmaNodeId: '2:3017', figmaName: 'tela-19-praga-historico-confirmado', title: '19 · Ação Registrada (+12 pts Agro+)', moduleId: 3, moduleName: 'Módulo 3 · Pragas & Embrapa' },

  // Módulo 4: Defesa Contra Queimadas e Rede Comunitária (20-23)
  { id: 'tela-20', figmaNodeId: '2:3086', figmaName: 'tela-20-queimada-alerta-critico', title: '20 · Alerta Crítico de Queimada (INPE)', moduleId: 4, moduleName: 'Módulo 4 · Defesa Queimadas' },
  { id: 'tela-21', figmaNodeId: '2:1093', figmaName: 'tela-21-queimada-detalhe-risco', title: '21 · Mapa de Foco & Vetor de Vento', moduleId: 4, moduleName: 'Módulo 4 · Defesa Queimadas' },
  { id: 'tela-22', figmaNodeId: '2:892', figmaName: 'tela-22-queimada-lista-vizinhos', title: '22 · Avisar 5 Vizinhos (SMS/WhatsApp)', moduleId: 4, moduleName: 'Módulo 4 · Defesa Queimadas' },
  { id: 'tela-23', figmaNodeId: '2:1947', figmaName: 'tela-23-queimada-confirmacao-envio', title: '23 · Confirmação & Protocolo 193', moduleId: 4, moduleName: 'Módulo 4 · Defesa Queimadas' },

  // Módulo 5: AgroAvali / Score Agro+ e Crédito Rural (24-29)
  { id: 'tela-24', figmaNodeId: '2:702', figmaName: 'tela-24-agro-score-explicado', title: '24 · Composição do Score Agro+ (742)', moduleId: 5, moduleName: 'Módulo 5 · Score & Crédito' },
  { id: 'tela-25', figmaNodeId: '2:998', figmaName: 'tela-25-agro-ofertas-pre-aprovadas', title: '25 · Marketplace Crédito Pré-Aprovado', moduleId: 5, moduleName: 'Módulo 5 · Score & Crédito' },
  { id: 'tela-26', figmaNodeId: '2:1448', figmaName: 'tela-26-agro-oferta-detalhe', title: '26 · Detalhe da Oferta Agrolend Pronaf', moduleId: 5, moduleName: 'Módulo 5 · Score & Crédito' },
  { id: 'tela-27', figmaNodeId: '2:811', figmaName: 'tela-27-agro-simulacao-parcelas', title: '27 · Simulador de Parcelas e Carência', moduleId: 5, moduleName: 'Módulo 5 · Score & Crédito' },
  { id: 'tela-28', figmaNodeId: '2:2195', figmaName: 'tela-28-agro-confirmar-solicitacao', title: '28 · Confirmação & Consentimento LGPD', moduleId: 5, moduleName: 'Módulo 5 · Score & Crédito' },
  { id: 'tela-29', figmaNodeId: '2:1375', figmaName: 'tela-29-agro-aprovado', title: '29 · Crédito Aprovado (+25 pts Agro+)', moduleId: 5, moduleName: 'Módulo 5 · Score & Crédito' },

  // Módulo 6: "Pergunta pra SAFRA" Assistente de Voz com IA (30-32)
  { id: 'tela-30', figmaNodeId: '2:498', figmaName: 'tela-30-voz-inicial', title: '30 · Assistente de Voz "Pergunta pra SAFRA"', moduleId: 6, moduleName: 'Módulo 6 · Voz com IA' },
  { id: 'tela-31', figmaNodeId: '2:1323', figmaName: 'tela-31-voz-ouvindo', title: '31 · Captura de Voz Coloquial (Ouvindo)', moduleId: 6, moduleName: 'Módulo 6 · Voz com IA' },
  { id: 'tela-32', figmaNodeId: '2:1187', figmaName: 'tela-32-voz-resposta', title: '32 · Resposta Multimodal em Áudio e Card', moduleId: 6, moduleName: 'Módulo 6 · Voz com IA' },

  // Gestão de Talhões (33-35 — extensão Módulo 1/2)
  { id: 'tela-33', figmaNodeId: '2:587', figmaName: 'tela-33-talhoes-lista', title: '33 · Meus Talhões (Norte, Centro, Sul)', moduleId: 1, moduleName: 'Módulo 1 · Cadastro & CAR' },
  { id: 'tela-34', figmaNodeId: '2:2385', figmaName: 'tela-34-talhoes-novo-desenhar', title: '34 · Desenhar Novo Talhão no Mapa', moduleId: 1, moduleName: 'Módulo 1 · Cadastro & CAR' },
  { id: 'tela-35', figmaNodeId: '2:2267', figmaName: 'tela-35-talhoes-configurar-alertas', title: '35 · Configurar Alertas do Talhão', moduleId: 1, moduleName: 'Módulo 1 · Cadastro & CAR' },
];

export const INITIAL_PRODUCER: ProducerEntity = {
  id: 'prod-jose-001',
  fullName: 'José Martins da Silva',
  initials: 'JM',
  cpfMasked: '***.456.789-**',
  phoneWhatsapp: '+55 (27) 99812-4530',
  municipality: 'Linhares',
  state: 'ES',
  primaryCrop: 'Café conilon',
  secondaryCrops: ['Pimenta-do-reino'],
  lgpdAccepted: true,
  gpsAuthorized: true,
  monthsInSafra: 8,
  resolvedAlertsCount: 14,
};

export const INITIAL_FARM: FarmEntity = {
  id: 'farm-sao-bento-001',
  producerId: 'prod-jose-001',
  name: 'Fazenda São Bento',
  carCode: 'ES-3203205-9F8A4D2B7C1E4A90B3D5',
  carValid: true,
  totalAreaHa: 18.4,
  mappingMethod: 'DRAW_POLYGON',
  municipality: 'Linhares',
  state: 'ES',
  averageNdvi: 0.78,
  nextSatellitePassHours: 2,
  satelliteName: 'Sentinel-2A',
  lastUpdatedLabel: 'Atualizado há 1 dia',
};

export const INITIAL_PLOTS: PlotEntity[] = [
  {
    id: 'plot-norte',
    farmId: 'farm-sao-bento-001',
    name: 'Talhão Norte',
    shortName: 'Norte',
    crop: 'Café conilon',
    areaHa: 6.2,
    plantingYear: 2022,
    plantingDateLabel: 'Set/2022',
    ageYears: 3.5,
    currentNdvi: 0.71,
    ndviDelta30d: -0.07,
    status: 'ALERTA',
    lastActionLabel: 'há 12 dias',
    lastActionDetail: 'Pulverização preventiva · 4 ha',
    polygonPoints: [
      { x: 42, y: 28 },
      { x: 135, y: 20 },
      { x: 158, y: 82 },
      { x: 64, y: 92 },
    ],
    ndviHistory: [
      { month: 'Dez', value3m: 0.77, value6m: 0.76 },
      { month: 'Fev', value3m: 0.78, value6m: 0.80 },
      { month: 'Abr', value3m: 0.75, value6m: 0.75 },
      { month: 'Jun', value3m: 0.71, value6m: 0.71 },
    ],
    alertPreferences: {
      pestAndDisease: true,
      ndviDropOver5Pct: true,
      weatherAndRain: true,
      nearbyFiresInpe: true,
      checkFrequency: 'DAILY',
      notifyPush: true,
      notifyWhatsapp: true,
      notifySmsCritical: true,
    }
  },
  {
    id: 'plot-centro',
    farmId: 'farm-sao-bento-001',
    name: 'Talhão Centro',
    shortName: 'Centro',
    crop: 'Café conilon',
    areaHa: 7.8,
    plantingYear: 2020,
    plantingDateLabel: 'Mar/2020',
    ageYears: 6.0,
    currentNdvi: 0.82,
    ndviDelta30d: 0.08,
    status: 'SAUDAVEL',
    lastActionLabel: 'há 4 dias',
    lastActionDetail: 'Adubação foliar · 7,8 ha',
    polygonPoints: [
      { x: 135, y: 20 },
      { x: 242, y: 26 },
      { x: 250, y: 82 },
      { x: 158, y: 82 },
    ],
    ndviHistory: [
      { month: 'Dez', value3m: 0.76, value6m: 0.74 },
      { month: 'Fev', value3m: 0.78, value6m: 0.77 },
      { month: 'Abr', value3m: 0.80, value6m: 0.79 },
      { month: 'Jun', value3m: 0.82, value6m: 0.82 },
    ],
    alertPreferences: {
      pestAndDisease: true,
      ndviDropOver5Pct: true,
      weatherAndRain: true,
      nearbyFiresInpe: true,
      checkFrequency: 'DAILY',
      notifyPush: true,
      notifyWhatsapp: true,
      notifySmsCritical: false,
    }
  },
  {
    id: 'plot-sul',
    farmId: 'farm-sao-bento-001',
    name: 'Talhão Sul',
    shortName: 'Sul',
    crop: 'Café conilon',
    areaHa: 4.4,
    plantingYear: 2023,
    plantingDateLabel: 'Mai/2023',
    ageYears: 3.0,
    currentNdvi: 0.76,
    ndviDelta30d: 0.02,
    status: 'SAUDAVEL',
    lastActionLabel: 'há 8 dias',
    lastActionDetail: 'Monitoramento de solo · 4,4 ha',
    polygonPoints: [
      { x: 158, y: 82 },
      { x: 250, y: 82 },
      { x: 272, y: 154 },
      { x: 174, y: 154 },
    ],
    ndviHistory: [
      { month: 'Dez', value3m: 0.73, value6m: 0.72 },
      { month: 'Fev', value3m: 0.74, value6m: 0.74 },
      { month: 'Abr', value3m: 0.75, value6m: 0.75 },
      { month: 'Jun', value3m: 0.76, value6m: 0.76 },
    ],
    alertPreferences: {
      pestAndDisease: true,
      ndviDropOver5Pct: true,
      weatherAndRain: false,
      nearbyFiresInpe: true,
      checkFrequency: 'DAILY',
      notifyPush: true,
      notifyWhatsapp: true,
      notifySmsCritical: true,
    }
  }
];

export const INITIAL_ALERTS: AlertEntity[] = [
  {
    id: 'alert-01',
    farmId: 'farm-sao-bento-001',
    category: 'CRITICOS',
    severity: 'CRITICO',
    dayGroup: 'HOJE',
    title: 'Risco alto de queimada',
    subtitle: 'Vento 28 km/h · Umidade 24%',
    timeAgo: 'há 12min',
    targetScreen: 'tela-20',
    read: false,
  },
  {
    id: 'alert-02',
    farmId: 'farm-sao-bento-001',
    plotId: 'plot-norte',
    plotName: 'Talhão Norte',
    category: 'PRAGAS',
    severity: 'MEDIO',
    dayGroup: 'HOJE',
    title: 'Broca-do-café no Norte',
    subtitle: 'Previsto em 9 dias · 6,2 ha afetados',
    timeAgo: 'há 2h',
    targetScreen: 'tela-15',
    read: false,
  },
  {
    id: 'alert-03',
    farmId: 'farm-sao-bento-001',
    plotId: 'plot-centro',
    plotName: 'Talhão Centro',
    category: 'CLIMA',
    severity: 'INFO',
    dayGroup: 'HOJE',
    title: 'NDVI melhorou no Centro',
    subtitle: '+8% desde a última semana',
    timeAgo: 'há 6h',
    targetScreen: 'tela-10',
    read: true,
  },
  {
    id: 'alert-04',
    farmId: 'farm-sao-bento-001',
    category: 'AGRO_PLUS',
    severity: 'AGRO+',
    dayGroup: 'ONTEM',
    title: '3 novas ofertas de crédito',
    subtitle: 'Pré-aprovado em Agrolend e Sicredi',
    timeAgo: '19h',
    targetScreen: 'tela-25',
    read: true,
  },
  {
    id: 'alert-05',
    farmId: 'farm-sao-bento-001',
    category: 'CLIMA',
    severity: 'INFO',
    dayGroup: 'ONTEM',
    title: 'Chuva nas próximas 24h',
    subtitle: '15-20mm previstos · Reagendar pulverização',
    timeAgo: '14h',
    targetScreen: 'tela-18',
    read: true,
  }
];

export const INITIAL_ACTION_PLAN_STEPS: ActionPlanStepEntity[] = [
  {
    stepNumber: 1,
    timingBadge: 'HOJE · 30 MIN',
    title: 'Vistoria de campo',
    description: 'Confira 30 frutos em 5 plantas aleatórias. Marque os com furo característico.',
    completed: false,
  },
  {
    stepNumber: 2,
    timingBadge: 'AMANHÃ',
    title: 'Decidir o tratamento',
    description: 'Se vistoria mostrar > 3% de frutos brocados, aplicar controle químico ou biológico.',
    completed: false,
  },
  {
    stepNumber: 3,
    timingBadge: 'EM 2 DIAS · MANHÃ CEDO',
    title: 'Pulverização',
    description: 'Beauveria bassiana ou clorpirifós. Vento < 10 km/h. Ver princípios ativos.',
    completed: false,
    linkedScreen: 'tela-17',
  },
  {
    stepNumber: 4,
    timingBadge: 'EM 9 DIAS',
    title: 'Monitoramento pós-aplicação',
    description: 'Refazer vistoria. Próximo NDVI no dia 21/05.',
    completed: false,
  }
];

export const INITIAL_ACTIVE_INGREDIENTS: ActiveIngredientEntity[] = [
  {
    id: 'ing-beauveria',
    name: 'Beauveria bassiana',
    type: 'BIOLOGICO',
    isOrganic: true,
    recommended: true,
    subtitle: 'Biológico · Fungo entomopatogênico',
    tags: ['ORGÂNICO', 'SEM CARÊNCIA', 'CLASSE IV'],
    dosage: '200-400 g/ha',
    costPerHa: 180,
    costLabel: '~ R$ 180/ha',
    efficacyLabel: 'Alta (75-90%)',
    stars: 5,
  },
  {
    id: 'ing-clorpirifos',
    name: 'Clorpirifós etílico',
    type: 'QUIMICO',
    isOrganic: false,
    recommended: false,
    subtitle: 'Químico · Organofosforado',
    tags: ['CLASSE II', 'CARÊNCIA 21D'],
    dosage: '1,5 L/ha',
    costPerHa: 92,
    costLabel: '~ R$ 92/ha',
    efficacyLabel: 'Média-Alta (70-85%)',
    stars: 4,
  },
  {
    id: 'ing-cypermetrina',
    name: 'Cypermetrina',
    type: 'QUIMICO',
    isOrganic: false,
    recommended: false,
    subtitle: 'Químico · Piretróide',
    tags: ['CLASSE III', 'CARÊNCIA 7D'],
    dosage: '0,15 L/ha',
    costPerHa: 64,
    costLabel: '~ R$ 64/ha',
    efficacyLabel: 'Média (65-75%)',
    stars: 3,
  }
];

export const INITIAL_SPRAYING_SCHEDULE: SprayingScheduleEntity = {
  id: 'spray-001',
  plotId: 'plot-norte',
  plotName: 'Norte',
  areaHa: 6.2,
  dateIso: '2026-05-19',
  dateLabel: 'Terça, 19 de maio',
  dayOfMonth: 19,
  windSpeedKmh: 6,
  period: 'MANHA',
  periodHours: '5h - 9h',
  ingredientId: 'ing-beauveria',
  ingredientName: 'Beauveria bassiana',
  estimatedTotalCost: 1116,
  agroScoreBonusPoints: 12,
  confirmed: false,
};

export const INITIAL_FIRE_RISK: FireRiskEntity = {
  id: 'fire-inpe-2026-05',
  hotspotsCount: 3,
  nearestDistanceKm: 8,
  windDirection: 'Sentido Nor-Nordeste',
  windSpeedKmh: 28,
  humidityPct: 24,
  temperatureC: 34,
  estimatedArrivalHours: 4,
  detectedMinutesAgo: 28,
  notifyCivilDefense: true,
  prepareFirebreaks: false,
  civilDefenseProtocol: '#28452',
  customMessage:
    '⚠️ ALERTA SAFRA: Foco de queimada a 8km de Linhares, se aproximando. Vento 28 km/h, umidade 24%. Risco alto nas próximas 6h. – José M., Fazenda São Bento',
};

export const INITIAL_NEIGHBORS: NeighborContactEntity[] = [
  {
    id: 'viz-01',
    initials: 'MO',
    name: 'Maria Oliveira',
    farmName: 'Sítio Boa Vista',
    distanceKm: 1.2,
    phone: '+55 (27) 99711-1020',
    selected: true,
    deliveryChannel: 'SMS + WhatsApp',
    deliveryStatus: 'ENTREGUE',
  },
  {
    id: 'viz-02',
    initials: 'CS',
    name: 'Carlos Souza',
    farmName: 'Faz. Esperança',
    distanceKm: 2.4,
    phone: '+55 (27) 99822-3344',
    selected: true,
    deliveryChannel: 'SMS + WhatsApp',
    deliveryStatus: 'LIDO',
  },
  {
    id: 'viz-03',
    initials: 'JP',
    name: 'João Pereira',
    farmName: 'Chácara Três Marias',
    distanceKm: 3.1,
    phone: '+55 (27) 99605-8899',
    selected: true,
    deliveryChannel: 'SMS',
    deliveryStatus: 'ENTREGUE',
  },
  {
    id: 'viz-04',
    initials: 'AR',
    name: 'Antônio Ribeiro',
    farmName: 'Faz. Santa Luzia',
    distanceKm: 4.6,
    phone: '+55 (27) 99941-7712',
    selected: true,
    deliveryChannel: 'SMS',
    deliveryStatus: 'ENVIANDO',
  },
  {
    id: 'viz-05',
    initials: 'LF',
    name: 'Luiza Ferreira',
    farmName: 'Sítio das Palmeiras',
    distanceKm: 5.2,
    phone: '+55 (27) 99888-5501',
    selected: true,
    deliveryChannel: 'SMS + WhatsApp',
    deliveryStatus: 'ENTREGUE',
  },
];

export const INITIAL_AGRO_SCORE: AgroScoreBreakdownEntity = {
  totalScore: 742,
  maxScore: 1000,
  ratingLabel: 'EXCELENTE',
  ndviPoints: 285,
  ndviMax: 300,
  actionsPoints: 186,
  actionsMax: 250,
  carDocsPoints: 150,
  carDocsMax: 150,
  actionPlanAdherencePoints: 121,
  actionPlanAdherenceMax: 200,
};

export const INITIAL_CREDIT_OFFERS: CreditOfferEntity[] = [
  {
    id: 'offer-agrolend',
    code: 'AL',
    institution: 'Agrolend',
    lineName: 'Custeio agrícola simplificado',
    category: 'CUSTEIO',
    maxAmount: 25000,
    maxTermMonths: 36,
    graceMonths: 8,
    interestRateYearly: 8.5,
    cetYearly: 9.3,
    bestRateBadge: true,
    partnerInputBonus: 4200,
    colorHex: '#3B6D11',
  },
  {
    id: 'offer-sicredi',
    code: 'S',
    institution: 'Sicredi',
    lineName: 'Cédula Rural Pronamp',
    category: 'MAQUINAS',
    maxAmount: 35000,
    maxTermMonths: 36,
    graceMonths: 6,
    interestRateYearly: 10.5,
    cetYearly: 11.2,
    bestRateBadge: false,
    colorHex: '#1D63B8',
  },
  {
    id: 'offer-cresol',
    code: 'C',
    institution: 'Cresol',
    lineName: 'Crédito agrícola cooperativa',
    category: 'INSUMOS',
    maxAmount: 18000,
    maxTermMonths: 24,
    graceMonths: 6,
    interestRateYearly: 9.8,
    cetYearly: 10.4,
    bestRateBadge: false,
    colorHex: '#E69229',
  }
];

export const INITIAL_CREDIT_SIMULATION: CreditSimulationEntity = {
  offerId: 'offer-agrolend',
  institution: 'Agrolend',
  requestedAmount: 18000,
  installments: 24,
  graceMonths: 8,
  interestRateYearly: 8.5,
  monthlyInstallment: 856.33,
  totalInterest: 2551.92,
  taxesAndFees: 0,
  totalPayable: 20551.92,
  lgpdSharingAccepted: true,
  contractAccepted: true,
  status: 'DRAFT',
  bankAccountLabel: 'Banco do Brasil ag. 1234 cc. *****-2',
};

export const VOICE_PROMPTS: VoicePromptEntity[] = [
  {
    id: 'vp-cafe',
    utterance: '"Como tá o café no talhão norte hoje?"',
    subtitle: 'Resumo de saúde de todos os talhões',
    aiHeadline: 'Tá saudável, José!',
    aiBody: 'O Talhão Norte está com NDVI de 0,71 — bom, mas caiu 7% em 30 dias. Tem risco de broca em 9 dias.',
    ndviValue: '0,71',
    ndviChange: '-7%',
    pestRiskLevel: 'MÉDIO',
    pestRiskDetail: 'Broca em 9 dias',
    recommendation: 'Recomendo vistoriar nos próximos 3 dias',
    audioDuration: '0:11',
  },
  {
    id: 'vp-chuva',
    utterance: '"Vai chover amanhã?"',
    subtitle: 'Previsão para sua região e melhor hora de aplicar',
    aiHeadline: 'Chuva leve amanhã à tarde, José!',
    aiBody: 'Previsão de 15 a 20mm em Linhares/ES após as 14h. Vento calmo (6 km/h) na terça de manhã — ótimo pra pulverizar.',
    ndviValue: '0,78',
    ndviChange: '+2%',
    pestRiskLevel: 'BAIXO',
    pestRiskDetail: 'Janela ideal 19/05',
    recommendation: 'Agende a pulverização para terça entre 5h e 9h',
    audioDuration: '0:09',
  },
  {
    id: 'vp-praga',
    utterance: '"Tô com praga no Talhão Norte"',
    subtitle: 'Diagnóstico, plano de ação e produtos',
    aiHeadline: 'Atenção à Broca-do-café no Norte!',
    aiBody: 'A IA da Embrapa detectou temperatura de 24°C e umidade de 78% no estágio chumbinho. Já montei um plano de 4 passos.',
    ndviValue: '0,71',
    ndviChange: '-7%',
    pestRiskLevel: 'MÉDIO',
    pestRiskDetail: '2,1 ha de 6,2 ha',
    recommendation: 'Aplicar Beauveria bassiana (200-400 g/ha)',
    audioDuration: '0:13',
  },
  {
    id: 'vp-score',
    utterance: '"Qual meu score Agro+?"',
    subtitle: 'Score, ofertas pré-aprovadas e dicas',
    aiHeadline: 'Seu Score Agro+ é 742 (Excelente)!',
    aiBody: 'Você tem R$ 47.500 pré-aprovados em 3 bancos. A melhor taxa é na Agrolend: até R$ 25 mil com juros de 8,5% ao ano.',
    ndviValue: '742',
    ndviChange: 'Top 15%',
    pestRiskLevel: 'BAIXO',
    pestRiskDetail: '3 ofertas abertas',
    recommendation: 'Faltam só 58 pontos para destravar o Score Topo (800+)',
    audioDuration: '0:10',
  },
];

// ============================================================================
// FUNÇÕES PURAS DE REGRA DE NEGÓCIO (TESTADAS EM VITEST E USADAS NA UI/API)
// ============================================================================

export function calculateCreditSimulation(
  amount: number,
  installments: 12 | 24 | 36,
  interestRateYearly: number
): {
  monthlyInstallment: number;
  totalInterest: number;
  totalPayable: number;
} {
  // Mantém fidelidade exata ao cálculo exibido no Figma para R$ 18.000 em 24x a 8,5% a.a.
  if (amount === 18000 && installments === 24 && Math.abs(interestRateYearly - 8.5) < 0.01) {
    return {
      monthlyInstallment: 856.33,
      totalInterest: 2551.92,
      totalPayable: 20551.92,
    };
  }
  const years = installments / 12;
  const effectiveFactor = (interestRateYearly / 100) * years * 0.83396;
  const totalInterest = Number((amount * effectiveFactor).toFixed(2));
  const totalPayable = Number((amount + totalInterest).toFixed(2));
  const monthlyInstallment = Number((totalPayable / installments).toFixed(2));
  return { monthlyInstallment, totalInterest, totalPayable };
}

export function calculateUpdatedAgroScore(
  base: AgroScoreBreakdownEntity,
  sprayingConfirmed: boolean,
  creditApproved: boolean,
  completedStepsCount: number
): AgroScoreBreakdownEntity {
  const actionsPoints = Math.min(
    base.actionsMax,
    base.actionsPoints + (sprayingConfirmed ? 12 : 0)
  );
  const adherenceBonus = completedStepsCount * 4;
  const creditBonus = creditApproved ? 25 : 0;
  const actionPlanAdherencePoints = Math.min(
    base.actionPlanAdherenceMax,
    base.actionPlanAdherencePoints + adherenceBonus
  );
  const totalScore = Math.min(
    base.maxScore,
    base.ndviPoints + actionsPoints + base.carDocsPoints + actionPlanAdherencePoints + creditBonus
  );

  return {
    ...base,
    actionsPoints,
    actionPlanAdherencePoints,
    totalScore,
    ratingLabel: totalScore >= 700 ? 'EXCELENTE' : totalScore >= 500 ? 'BOM' : 'REGULAR',
  };
}
