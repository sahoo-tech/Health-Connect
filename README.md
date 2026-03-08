# HealthTech Application

A comprehensive, private healthcare technology project designed to bridge modern front-end experiences with secure, reliable, and intelligent backend services.

## Architecture Overview

The HealthTech ecosystem is built as a modernized, decoupled architecture consisting of a Next.js frontend, an Express.js backend, and integrated Artificial Intelligence/Machine Learning capabilities.

### high-Level Architecture

The below diagram illustrates the overarching architecture of the HealthTech system.

```mermaid
graph TD
    User([User / Patient]) -->|Interacts via| Frontend
    User -.->|Or via| MobileApp([Future Mobile Interfaces])
    
    subgraph "health-connect (Next.js 16 + React 19)"
        Frontend[Web Application UI]
        Optimizer[Schedule Optimizer UI]
    end
    
    subgraph "health-connect-api (Express.js)"
        API[Core API Gateway]
        Auth[Authentication & AuthZ]
        PatientService[Patient Records Service]
        BookingService[Appointment Service]
    end
    
    subgraph "AI / ML Subsystem (Python Training)"
        ModelTraining[CPU-Only LoRA Fine-Tuning]
        Inference[Inference Engine]
    end
    
    Frontend -->|REST / JSON| API
    Optimizer -->|REST / JSON| API
    
    API --> Auth
    API --> PatientService
    API --> BookingService
    
    BookingService --> Inference
```

## System Components

### 1. The Frontend (`health-connect`)
A modern interface utilizing Next.js and React.
- **Dynamic Routing**: Implements user flows like patient booking (`app/patient/book/page.tsx`).
- **Interactive UI**: Utilizing inline SVGs over emojis, polished micro-animations, and dynamic component rendering to offer a human-crafted touch.
- **Schedule Optimizer**: A specialized dashboard that helps configure and verify medical schedules dynamically.

### 2. The Backend API (`health-connect-api`)
A standalone Express.js server providing business logic routing, separated from the Next.js presentation layer to enforce strong separation of concerns.
- **TypeScript-Driven**: Ensures end-to-end type safety.
- **Stateless REST Architecture**: Enabling horizontal scalability for appointment booking and data retrieval.

### 3. AI Fine-Tuning Module
The project encompasses an isolated AI workflow targeted at fine-tuning Hugging Face language models (utilizing the OASST2 dataset). It incorporates:
- Specialized CPU-Only fine-tuning logic to account for hardware limitations.
- Low-Rank Adaptation (LoRA) for memory-efficient training runs.
- Advanced scripting for downloading datasets and subsequently evaluating inference performance.

## Core Workflows

### Patient Booking Flow

The booking mechanism is at the heart of the application, incorporating real-time availability sync and Schedule Optimizer verifications.

```mermaid
sequenceDiagram
    participant P as Patient (UI)
    participant F as Frontend (Next.js)
    participant B as Backend API (Express)
    participant DB as Database Subsystem
    
    P->>F: Navigate to /patient/book/page
    F->>B: GET /api/v1/doctors/availability
    B->>DB: Query open slots
    DB-->>B: Return slots
    B-->>F: Available slots JSON
    F-->>P: Render interactive calendar
    P->>F: Select Slot & Confirm
    F->>B: POST /api/v1/appointments
    B->>B: Validate via Schedule Optimizer
    B->>DB: Reserve Slot
    DB-->>B: Confirmation
    B-->>F: 200 OK (Booking Detail)
    F-->>P: Show Success Screen / Receipt
```

### AI Model Fine-Tuning Lifecycle

```mermaid
journey
    title Machine Learning Model Development Lifecycle
    section Data Preparation
      Download Dataset (OASST2): 5: Developer
      Format Data for Instruction: 3: Developer
    section Fine-Tuning 
      Configure Memory for CPU: 2: Engine
      Apply LoRA Adapters: 4: Engine
      Execute Training Loop: 3: Engine
    section Evaluation
      Save Model Checkpoints: 5: Engine
      Run Inference Tests: 4: Developer
      Verify Outputs: 5: Developer
```

## Project Timeline Tracking

The overall integration roadmap illustrating frontend, API, and AI module timelines.

```mermaid
gantt
    title HealthTech Implementation Roadmap
    dateFormat  YYYY-MM-DD
    section Frontend
    UI Redesign           :done,    des1, 2026-03-01, 2026-03-03
    Patient Booking Page  :done,    des2, 2026-03-03, 2026-03-05
    Schedule Optimizer UI :active,  des3, 2026-03-05, 4d
    section Backend
    Express.js Extraction :done,    api1, 2026-03-06, 2d
    Routing & Controllers :active,  api2, 2026-03-08, 4d
    section AI Module
    HuggingFace Assets    :done,    ai1,  2026-03-05, 2d
    CPU LoRA Training     :active,  ai2,  2026-03-07, 3d
    Model Evaluation      :         ai3,  after ai2, 2d
```

## Project Status & Contribution Guidelines

**This repository is strictly private and proprietary.** 

The HealthTech project is built internally and is **not open for collaboration**.
- **No contributions** are accepted.
- Pull requests and feature requests submitted by external developers will be unequivocally discarded.
- This project is entirely closed-source, intended solely for internal consumption and production deployment. No aspect of this code relates to open-source contributions. 
