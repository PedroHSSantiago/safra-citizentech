-- ============================================================================
-- SAFRA — SISTEMA DE RESILIÊNCIA CLIMÁTICA E CRÉDITO AGRÍCOLA
-- Script DDL Relacional (Compatível com MySQL 8+ / Oracle Database)
-- Pronto para integração com Backend Java 21 + Spring Boot 3 (Spring Data JPA)
-- ============================================================================

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
