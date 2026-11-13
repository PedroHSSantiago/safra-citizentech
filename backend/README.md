# Camada de Backend REST API (`backend/`)

Esta pasta está preparada para receber a API REST em **Java 21 LTS + Spring Boot 3 (Spring Web, Spring Data JPA, Bean Validation, Spring Security/CORS)**.

O frontend multiplataforma já consome todos os endpoints abaixo através do cliente HTTP e fila Offline-First configurados em [`../src/services/api.ts`](../src/services/api.ts).

## Estrutura de Pacotes Recomendada (Spring Boot)

```text
backend/
├── src/main/java/br/com/fiap/safra/
│   ├── SafraApplication.java
│   ├── config/
│   │   └── CorsConfig.java               # Libera http://localhost:5173
│   ├── controller/
│   │   ├── ProducerController.java       # PUT /api/v1/producers/{id}
│   │   ├── FarmController.java           # POST /api/v1/farms | POST /api/v1/plots
│   │   ├── ManagementController.java     # POST /api/v1/management/spraying-schedules
│   │   ├── FireDefenseController.java    # POST /api/v1/community/fire-alerts
│   │   └── CreditController.java         # POST /api/v1/credit/proposals
│   ├── service/
│   │   ├── AgroScoreService.java         # Cálculo auditável do Score Agro (0-1000)
│   │   └── CreditSimulatorService.java   # Cálculo de juros Pronaf / BCB Sicor
│   ├── repository/                       # Interfaces JpaRepository<Entity, String>
│   ├── entity/                           # Entidades mapeadas para database/schema.sql
│   └── dto/                              # Records Java 21 para Request/Response JSON
├── src/main/resources/
│   └── application.yml                   # Copie de application.yml.example
├── application.yml.example
└── openapi-contract.json                 # Especificação OpenAPI 3.0.3 dos endpoints
```

## Endpoints Esperados pelo Frontend (`VITE_API_BASE_URL=http://safra/api/v1`)

| Método | Endpoint | Payload (Tipo TS em `src/types/models.ts`) | Tabela Relacional (`database/schema.sql`) |
| :--- | :--- | :--- | :--- |
| `PUT` | `/api/v1/producers/{id}` | `ProducerEntity` | `TB_PRODUTOR_RURAL` |
| `POST` | `/api/v1/farms` | `FarmEntity` | `TB_PROPRIEDADE_CAR` |
| `POST` | `/api/v1/plots` | `PlotEntity` | `TB_TALHAO_GEOMETRIA` |
| `PATCH` | `/api/v1/plots/{id}/alert-preferences` | `PlotAlertPreferences` | `TB_TALHAO_GEOMETRIA` |
| `POST` | `/api/v1/management/spraying-schedules` | `SprayingScheduleEntity` | `TB_AGENDAMENTO_MANEJO` |
| `POST` | `/api/v1/community/fire-alerts` | `{ fireRisk, recipients, defenseProtocol }` | `TB_REDE_COMUNITARIA_ALERTA` |
| `POST` | `/api/v1/credit/proposals` | `CreditSimulationEntity` | `TB_PROPOSTA_CREDITO_RURAL` |

## Como Conectar ao Frontend

1. Suba o banco de dados executando [`../database/schema.sql`](../database/schema.sql).
2. Inicie a aplicação Spring Boot na porta `8080`.
3. Na raiz do projeto, copie `.env.example` para `.env` e garanta:
   ```env
   VITE_API_BASE_URL=http://safra/api/v1
   ```
4. No painel **CitizenTech & Backend Inspector** do frontend, clique em **"Sincronizar Fila com Backend"** para despachar em lote todas as operações registradas em modo Offline.
