import { describe, expect, it } from 'vitest';
import {
  INITIAL_AGRO_SCORE,
  INITIAL_FIRE_RISK,
  INITIAL_NEIGHBORS,
  INITIAL_SPRAYING_SCHEDULE,
  SCREEN_CATALOG,
  calculateCreditSimulation,
  calculateUpdatedAgroScore,
} from '../data/seedData';
import { SafraApiService } from '../services/api';

describe('SAFRA CitizenTech — Cenários de Teste de Software (FIAP Global Solution)', () => {
  it('Catálogo deve conter exatamente as 35 telas mapeadas do protótipo Figma', () => {
    expect(SCREEN_CATALOG).toHaveLength(35);
    expect(SCREEN_CATALOG[0].id).toBe('tela-01');
    expect(SCREEN_CATALOG[34].id).toBe('tela-35');
  });

  it('Cenário de Teste 1 (CT-01): Agendamento Preventivo IA Embrapa incrementa +12 pts no Score Agro+', async () => {
    const api = new SafraApiService();
    const confirmedSchedule = await api.scheduleSpraying({
      ...INITIAL_SPRAYING_SCHEDULE,
      confirmed: true,
    });

    expect(confirmedSchedule.confirmed).toBe(true);
    expect(confirmedSchedule.estimatedTotalCost).toBe(1116);

    const updatedScore = calculateUpdatedAgroScore(
      INITIAL_AGRO_SCORE,
      true,
      false,
      0
    );
    expect(updatedScore.actionsPoints).toBe(198); // 186 + 12
    expect(updatedScore.totalScore).toBe(754); // 742 + 12
    expect(updatedScore.ratingLabel).toBe('EXCELENTE');
  });

  it('Cenário de Teste 2 (CT-02): Defesa Comunitária Contra Queimadas dispara alerta para 5 vizinhos e gera protocolo 193', async () => {
    const api = new SafraApiService();
    const result = await api.broadcastFireAlert(INITIAL_FIRE_RISK, INITIAL_NEIGHBORS);

    expect(result.deliveredCount).toBe(5);
    expect(result.protocol).toBe('#28452');
  });

  it('Cenário de Teste 3 (CT-03): Simulação de Microcrédito Rural Pronaf (R$ 18.000 em 24x a 8,5% a.a.) e bônus de +25 pts no Score Agro+', () => {
    const sim = calculateCreditSimulation(18000, 24, 8.5);
    expect(sim.monthlyInstallment).toBe(856.33);
    expect(sim.totalInterest).toBe(2551.92);
    expect(sim.totalPayable).toBe(20551.92);

    const scoreAfterCredit = calculateUpdatedAgroScore(
      INITIAL_AGRO_SCORE,
      false,
      true,
      0
    );
    expect(scoreAfterCredit.totalScore).toBe(767); // 742 + 25
  });

  it('Fila Offline-First deve armazenar mutações sem internet e sincronizar em lote com o Backend Spring Boot', async () => {
    const api = new SafraApiService();
    api.setOfflineMode(true);
    expect(api.isOffline()).toBe(true);

    await api.scheduleSpraying({ ...INITIAL_SPRAYING_SCHEDULE, confirmed: true });
    const pendingBefore = api
      .getSyncQueue()
      .filter((i) => i.status === 'PENDING_OFFLINE').length;
    expect(pendingBefore).toBeGreaterThanOrEqual(1);

    const syncedCount = await api.syncAllPendingToBackend();
    expect(syncedCount).toBeGreaterThanOrEqual(1);
    expect(api.isOffline()).toBe(false);
  });
});
