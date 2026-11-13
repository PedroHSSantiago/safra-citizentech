-- ============================================================================
-- SAFRA — SISTEMA DE RESILIÊNCIA CLIMÁTICA E CRÉDITO AGRÍCOLA (CITIZENTECH)
-- Script DDL + Seed Data Relacional (Compatível com MySQL 8+ / Oracle Database)
-- Pronto para integração com Backend Java 21 + Spring Boot 3 (Spring Data JPA)
-- ============================================================================

-- 1. Tabela de Produtores Rurais (Agricultura Familiar / Pronaf)
CREATE TABLE TB_PRODUTOR_RURAL (
    id_produtor VARCHAR(64) PRIMARY KEY,
    nm_completo VARCHAR(150) NOT NULL,
    nr_cpf_hash VARCHAR(64) NOT NULL,
    nr_telefone_whatsapp VARCHAR(30) NOT NULL,
    nm_municipio VARCHAR(100) NOT NULL,
    sg_uf CHAR(2) NOT NULL,
    ds_cultura_principal VARCHAR(80) NOT NULL,
    st_lgpd_aceite BOOLEAN NOT NULL DEFAULT TRUE,
    st_gps_autorizado BOOLEAN NOT NULL DEFAULT TRUE,
    dt_cadastro TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 2. Tabela de Propriedades Rurais e Vínculo SICAR (CAR)
CREATE TABLE TB_PROPRIEDADE_CAR (
    id_propriedade VARCHAR(64) PRIMARY KEY,
    id_produtor VARCHAR(64) NOT NULL,
    nm_propriedade VARCHAR(120) NOT NULL,
    cd_recibo_car VARCHAR(64) NOT NULL UNIQUE,
    st_car_ativo BOOLEAN NOT NULL DEFAULT TRUE,
    vl_area_total_ha DECIMAL(10,2) NOT NULL,
    tp_mapeamento VARCHAR(20) NOT NULL, -- 'DRAW_POLYGON' | 'IMPORT_CAR'
    vl_ndvi_medio DECIMAL(4,2) NOT NULL DEFAULT 0.78,
    nm_satelite_atual VARCHAR(40) DEFAULT 'Sentinel-2A',
    CONSTRAINT fk_prop_produtor FOREIGN KEY (id_produtor) REFERENCES TB_PRODUTOR_RURAL(id_produtor)
);

-- 3. Tabela de Talhões e Polígonos Georreferenciados (NDVI Orbital)
CREATE TABLE TB_TALHAO_GEOMETRIA (
    id_talhao VARCHAR(64) PRIMARY KEY,
    id_propriedade VARCHAR(64) NOT NULL,
    nm_talhao VARCHAR(80) NOT NULL,
    ds_cultura VARCHAR(80) NOT NULL,
    vl_area_ha DECIMAL(10,2) NOT NULL,
    nr_ano_plantio INT NOT NULL,
    vl_ndvi_atual DECIMAL(4,2) NOT NULL,
    vl_variacao_ndvi_30d DECIMAL(4,2) NOT NULL,
    st_saude VARCHAR(20) NOT NULL, -- 'SAUDAVEL' | 'ALERTA' | 'CRITICO'
    js_poligono_coordenadas TEXT NOT NULL,
    CONSTRAINT fk_talhao_prop FOREIGN KEY (id_propriedade) REFERENCES TB_PROPRIEDADE_CAR(id_propriedade)
);

-- 4. Tabela de Alertas Fitossanitários e Climáticos (IA + Embrapa + INMET)
CREATE TABLE TB_ALERTA_PRAGA_IA (
    id_alerta VARCHAR(64) PRIMARY KEY,
    id_talhao VARCHAR(64) NOT NULL,
    nm_praga VARCHAR(100) NOT NULL,
    nm_cientifico VARCHAR(100),
    nv_risco VARCHAR(20) NOT NULL, -- 'BAIXO' | 'MEDIO' | 'CRITICO'
    nr_dias_previsao INT NOT NULL,
    vl_area_afetada_ha DECIMAL(10,2) NOT NULL,
    vl_temp_media_c DECIMAL(4,1),
    vl_umidade_rel_pct DECIMAL(4,1),
    ds_estagio_fenologico VARCHAR(60),
    dt_deteccao TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_alerta_talhao FOREIGN KEY (id_talhao) REFERENCES TB_TALHAO_GEOMETRIA(id_talhao)
);

-- 5. Tabela de Agendamento de Manejo e Pulverização Sustentável
CREATE TABLE TB_AGENDAMENTO_MANEJO (
    id_agendamento VARCHAR(64) PRIMARY KEY,
    id_talhao VARCHAR(64) NOT NULL,
    dt_aplicacao DATE NOT NULL,
    ds_periodo_dia VARCHAR(20) NOT NULL, -- 'MANHA' | 'TARDE' | 'NOITE'
    vl_velocidade_vento_kmh DECIMAL(4,1) NOT NULL,
    nm_principio_ativo VARCHAR(120) NOT NULL,
    vl_custo_estimado DECIMAL(12,2) NOT NULL,
    nr_pontos_agro_bonus INT NOT NULL DEFAULT 12,
    st_confirmado BOOLEAN NOT NULL DEFAULT TRUE,
    CONSTRAINT fk_agend_talhao FOREIGN KEY (id_talhao) REFERENCES TB_TALHAO_GEOMETRIA(id_talhao)
);

-- 6. Tabela de Rede Comunitária de Alerta de Incêndio (INPE BDQueimadas + Defesa Civil)
CREATE TABLE TB_REDE_COMUNITARIA_ALERTA (
    id_disparo VARCHAR(64) PRIMARY KEY,
    id_propriedade_origem VARCHAR(64) NOT NULL,
    vl_distancia_foco_km DECIMAL(6,2) NOT NULL,
    vl_vento_kmh DECIMAL(5,2) NOT NULL,
    vl_umidade_pct DECIMAL(5,2) NOT NULL,
    nr_vizinhos_notificados INT NOT NULL,
    cd_protocolo_defesa_civil VARCHAR(30) NOT NULL,
    ds_mensagem TEXT NOT NULL,
    dt_envio TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_disparo_prop FOREIGN KEY (id_propriedade_origem) REFERENCES TB_PROPRIEDADE_CAR(id_propriedade)
);

-- 7. Tabela de Pontuação AgroScore (Avaliação de Resiliência e ESG)
CREATE TABLE TB_SCORE_AGRO_AVALI (
    id_score VARCHAR(64) PRIMARY KEY,
    id_produtor VARCHAR(64) NOT NULL,
    nr_score_total INT NOT NULL,
    nr_pts_ndvi INT NOT NULL,
    nr_pts_acoes INT NOT NULL,
    nr_pts_car_docs INT NOT NULL,
    nr_pts_adesao_planos INT NOT NULL,
    dt_atualizacao TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_score_produtor FOREIGN KEY (id_produtor) REFERENCES TB_PRODUTOR_RURAL(id_produtor)
);

-- 8. Tabela de Simulações e Propostas de Crédito Rural (Pronaf / BCB Sicor)
CREATE TABLE TB_PROPOSTA_CREDITO_RURAL (
    id_proposta VARCHAR(64) PRIMARY KEY,
    id_produtor VARCHAR(64) NOT NULL,
    nm_instituicao VARCHAR(80) NOT NULL,
    ds_linha_credito VARCHAR(100) NOT NULL,
    vl_solicitado DECIMAL(12,2) NOT NULL,
    nr_parcelas INT NOT NULL,
    nr_meses_carencia INT NOT NULL,
    tx_juros_anual DECIMAL(5,2) NOT NULL,
    vl_parcela_mensal DECIMAL(12,2) NOT NULL,
    vl_total_pagar DECIMAL(12,2) NOT NULL,
    st_lgpd_compartilhamento BOOLEAN NOT NULL DEFAULT TRUE,
    st_status VARCHAR(20) NOT NULL DEFAULT 'APPROVED',
    dt_solicitacao TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_cred_produtor FOREIGN KEY (id_produtor) REFERENCES TB_PRODUTOR_RURAL(id_produtor)
);

-- ============================================================================
-- SEED DATA INICIAL (Carga Inicial para Testes Integrados com o Frontend)
-- ============================================================================

INSERT INTO TB_PRODUTOR_RURAL (
    id_produtor, nm_completo, nr_cpf_hash, nr_telefone_whatsapp,
    nm_municipio, sg_uf, ds_cultura_principal, st_lgpd_aceite, st_gps_autorizado
) VALUES (
    'prod-antonio-01', 'Antônio Ferreira da Silva', 'sha256:9f86d081884c7d659a2feaa0c55ad015',
    '(35) 99814-2209', 'São Sebastião do Paraíso', 'MG', 'Café Arábica & Milho', TRUE, TRUE
);

INSERT INTO TB_PROPRIEDADE_CAR (
    id_propriedade, id_produtor, nm_propriedade, cd_recibo_car,
    st_car_ativo, vl_area_total_ha, tp_mapeamento, vl_ndvi_medio, nm_satelite_atual
) VALUES (
    'farm-sao-jose-01', 'prod-antonio-01', 'Sítio São José', 'MG-3164704-89A4B2C1D9E0F3A7',
    TRUE, 14.50, 'IMPORT_CAR', 0.78, 'Sentinel-2A'
);

INSERT INTO TB_TALHAO_GEOMETRIA (
    id_talhao, id_propriedade, nm_talhao, ds_cultura, vl_area_ha,
    nr_ano_plantio, vl_ndvi_atual, vl_variacao_ndvi_30d, st_saude, js_poligono_coordenadas
) VALUES (
    'plot-norte', 'farm-sao-jose-01', 'Talhão Norte', 'Café Arábica (Catuaí)', 6.20,
    2021, 0.84, 0.06, 'SAUDAVEL', '[[-20.9162,-46.9914],[-20.9155,-46.9899],[-20.9171,-46.9891]]'
);

INSERT INTO TB_SCORE_AGRO_AVALI (
    id_score, id_produtor, nr_score_total, nr_pts_ndvi, nr_pts_acoes, nr_pts_car_docs, nr_pts_adesao_planos
) VALUES (
    'score-antonio-2026', 'prod-antonio-01', 742, 232, 185, 190, 135
);
