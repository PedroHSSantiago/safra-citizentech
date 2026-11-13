# Camada de Banco de Dados Relacional (`database/`)

Esta pasta contém o modelo relacional normalizado (**3ª Forma Normal — 3FN**) preparado para receber a persistência do ecossistema **SAFRA CitizenTech** em **MySQL 8+** ou **Oracle Database**.

## Arquivos

- [schema.sql](./schema.sql): Script DDL completo (`CREATE TABLE`, `PRIMARY KEY`, `FOREIGN KEY`) + carga inicial (`INSERT INTO`) com os dados do produtor rural **Seu Antônio Ferreira da Silva (Sítio São José — MG)**.

## Tabelas do Modelo de Dados (8 Entidades)

| Tabela | Descrição | Entidade Frontend Equivalente (`src/types/models.ts`) |
| :--- | :--- | :--- |
| `TB_PRODUTOR_RURAL` | Dados cadastrais do agricultor familiar, município, UF e aceite LGPD | `ProducerEntity` |
| `TB_PROPRIEDADE_CAR` | Propriedade rural, recibo SICAR/CAR, área total (ha) e NDVI médio | `FarmEntity` |
| `TB_TALHAO_GEOMETRIA` | Subdivisão de talhões, cultura, coordenadas GPS do polígono e saúde NDVI | `PlotEntity` |
| `TB_ALERTA_PRAGA_IA` | Diagnóstico preditivo de pragas/doenças (IA + Embrapa + INMET) | `AlertEntity` |
| `TB_AGENDAMENTO_MANEJO` | Agendamento de pulverização sustentável em janela de vento seguro | `SprayingScheduleEntity` |
| `TB_REDE_COMUNITARIA_ALERTA` | Disparo de alerta de foco de queimada (INPE) para vizinhos e Defesa Civil | `FireRiskEntity` / `NeighborContactEntity` |
| `TB_SCORE_AGRO_AVALI` | Pontuação **Score Agro (0–1000)** auditada por satélite e boas práticas ESG | `AgroScoreEntity` |
| `TB_PROPOSTA_CREDITO_RURAL` | Simulação e solicitação de crédito rural subsidiado (Pronaf / BCB Sicor) | `CreditSimulationEntity` |

## Como Executar

### Opção 1: MySQL 8+
```bash
mysql -u root -p -e "CREATE DATABASE IF NOT EXISTS safra_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;"
mysql -u root -p safra_db < database/schema.sql
```

### Opção 2: Oracle SQL Developer / SQL*Plus
Abra o arquivo `database/schema.sql` no Oracle SQL Developer e execute com `F5` (Run Script).
