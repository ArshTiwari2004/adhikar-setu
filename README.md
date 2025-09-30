<div align="center">

# ADHIKAR SETU

### Digitizing Forest Rights for Tribal Empowerment

[![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)](https://reactjs.org/)
[![Node.js](https://img.shields.io/badge/Node.js-43853D?style=for-the-badge&logo=node.js&logoColor=white)](https://nodejs.org/)
[![Python](https://img.shields.io/badge/Python-3776AB?style=for-the-badge&logo=python&logoColor=white)](https://python.org/)
[![TensorFlow](https://img.shields.io/badge/TensorFlow-FF6F00?style=for-the-badge&logo=tensorflow&logoColor=white)](https://tensorflow.org/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-316192?style=for-the-badge&logo=postgresql&logoColor=white)](https://postgresql.org/)
[![Docker](https://img.shields.io/badge/Docker-2496ED?style=for-the-badge&logo=docker&logoColor=white)](https://docker.com/)
[![AWS](https://img.shields.io/badge/AWS-232F3E?style=for-the-badge&logo=amazon-aws&logoColor=white)](https://aws.amazon.com/)
[![License](https://img.shields.io/badge/License-MIT-yellow.svg?style=for-the-badge)](LICENSE)

**India's First End-to-End AI-Powered FRA Atlas and Decision Support System**

[Features](#features) • [Installation](#installation) • [Architecture](#architecture) • [Tech Stack](#tech-stack) • [Documentation](#documentation)

</div>

---

## 📋 Table of Contents

- [About](#about)
- [Problem Statement](#problem-statement)
- [Solution Overview](#solution-overview)
- [Key Features](#features)
- [System Architecture](#architecture)
- [Technology Stack](#tech-stack)
- [Folder Structure](#folder-structure)
- [Installation](#installation)
- [Usage](#usage)
- [Role-Based Access Control](#rbac)
- [AI/ML Components](#aiml-components)
- [Compliance & Legal Framework](#compliance)
- [Impact & Benefits](#impact)
- [Future Scope](#future-scope)
- [Contributors](#contributors)
- [Contact](#contact)

---

## 🌳 About

**Adhikar Setu** is a comprehensive AI-powered platform designed to revolutionize the implementation of the **Forest Rights Act (FRA), 2006** in India. The solution addresses critical challenges in FRA implementation by digitizing legacy records, creating an interactive FRA Atlas, enabling satellite-based asset mapping, and providing a Decision Support System (DSS) for targeted scheme delivery.

### Target States
- Madhya Pradesh
- Tripura
- Odisha
- Telangana

---

## 🎯 Problem Statement

**Problem Statement ID:** 25108  
**Organization:** Ministry of Tribal Affairs (MoTA)

### Background

The Forest Rights Act, 2006 recognizes the rights of forest-dwelling communities over land and forest resources. However, significant challenges persist:

- **Legacy Records:** Individual Forest Rights (IFR), Community Rights (CR), and Community Forest Resource Rights (CFR) records are scattered, non-digitized, and difficult to verify
- **No Centralized Atlas:** There is no real-time visual repository of FRA claims and granted titles
- **Missing Integration:** Satellite-based asset mapping and legacy data are not integrated with FRA data
- **Scheme Delivery Gap:** Decision-makers lack a DSS to layer Central Sector Schemes (CSS) benefits for FRA patta holders
- **Scale of Inefficiency:** Over 3 lakh claims rejected in Madhya Pradesh, 1 lakh in Odisha, 94,000 in Telangana, and 68,000 in Tripura (May 2025 MoTA Progress Report)

---

## 💡 Solution Overview

Adhikar Setu is structured around **seven key innovations**:

### 1. **Digitize**
Converting legacy FRA documents (Forms A/B/C, pattas, maps) into standardized digital records using OCR and layout-aware models.

### 2. **Extract**
Applied NER and AI/ML models to auto-extract village names, patta-holder details, title numbers, coordinates, area, claim status, and case provenance.

### 3. **Verify**
Enable human-in-loop verification (Gram Sabha / FRC) with bounding-box provenance and tamper-evident audit trails ensuring community validation and legal audit readiness.

### 4. **Map**
Building an **AI-powered FRA Atlas (WebGIS)** integrating claim polygons, shapefiles, and satellite-derived asset layers (agriculture, forest cover, ponds, water bodies, homesteads) for state/district/village monitoring.

### 5. **DSS Layering**
Developing a **Decision Support System** that cross-links FRA patta holders with Central Sector Schemes (PM-KISAN, Jal Jeevan Mission, MGNREGA, DAJGUA) and recommends prioritized interventions.

### 6. **Automate**
Auto-generating standardized Annexure II/III/IV PDFs (fillable templates) with digital signatures, immutable provenance, and DLC-ready outputs.

### 7. **Govern**
Implementing role-based access, WebGIS integration, FRA progress tracking (village/block/district/state), anonymized public Atlas, and secure audit trails.

---

## ✨ Features

### Core Capabilities

- **🔍 AI-Powered Document Digitization**
  - OCR for legacy FRA documents (Forms A/B/C, pattas)
  - Named Entity Recognition (NER) for automated data extraction
  - Support for Indic scripts (Hindi, Odia, Telugu, Bengali)

- **🗺️ Interactive FRA Atlas (WebGIS)**
  - Real-time visualization of IFR/CR/CFR claims
  - Polygon-level claim mapping with geo-referenced data
  - Satellite imagery integration for asset mapping
  - Multi-layer visualization (village boundaries, forest cover, water bodies)

- **🛰️ AI-Based Asset Mapping**
  - Computer Vision on high-resolution satellite imagery
  - Detection of agricultural land, forest cover, water bodies, homesteads
  - Land-use classification using supervised ML models
  - Integration with forest data, groundwater data, and PM Gati Shakti infrastructure

- **📊 Decision Support System (DSS)**
  - Rule-based + AI-enhanced DSS engine
  - Cross-linking FRA holders with CSS scheme eligibility
  - Prioritized intervention recommendations
  - Scheme layering for DAJGUA and other benefits

- **📝 Automated Workflow Management**
  - Statutory workflow modeling: Gram Sabha → FRC → SDLC → DLC
  - Auto-generation of Annexure II/III/IV with digital signatures
  - Non-delegable District Collector signature enforcement
  - Tamper-proof audit trails

- **👥 Role-Based Access Control (RBAC)**
  - Granular permissions for Gram Sabha, FRC, SDLC, DLC, SLMC, MoTA
  - Anonymized public Atlas access
  - Multi-level authentication and authorization

- **📱 Mobile & Offline Support**
  - FRC mobile app for offline GPS capture
  - Photo and audio recording capabilities
  - Sync-on-connection functionality

---

## 🏗️ Architecture

### High-Level System Components










---

## 🛠️ Technology Stack

### Frontend
- **React.js** - UI framework
- **Redux** - State management
- **React Query** - Server state management
- **Mapbox GL JS** - Interactive mapping
- **Tailwind CSS** - Styling
- **React Native** - Mobile application

### Backend
- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **FastAPI** - Python API framework (Python 3.10+)
- **Firebase** - Real-time database and authentication

### Database
- **PostgreSQL** - Primary database
- **PostGIS** - Spatial database extension
- **Firestore** - Real-time NoSQL database
- **AWS S3** - Object storage
- **Redis** - Caching layer

### AI/ML
- **TensorFlow** - Deep learning framework
- **LayoutLM** - Document understanding
- **Tesseract** - OCR engine
- **Rasterio** - Geospatial raster processing
- **GeoPandas** - Geospatial data manipulation
- **OpenCV** - Computer vision

### API Services
- **Auth0** - Authentication
- **Cloudinary** - Media management
- **Google Vision API** - OCR enhancement
- **ReportLab** - PDF generation
- **wkhtmltopdf** - HTML to PDF conversion

### Cloud & Deployment
- **AWS** - Cloud infrastructure
- **Docker** - Containerization
- **Kubernetes (EKS)** - Container orchestration
- **GitHub Actions** - CI/CD

### Monitoring
- **Prometheus** - Metrics collection
- **Grafana** - Visualization and dashboards

### Testing
- **Jest** - Unit testing
- **Postman** - API testing

---


## 🚀 Installation

### Prerequisites

- **Node.js** (v18.x or higher)
- **Python** (3.10 or higher)
- **PostgreSQL** (14.x or higher) with PostGIS extension
- **Docker** (for containerized deployment)
- **Git**
- **AWS Account** (for cloud deployment)

### Step 1: Clone the Repository
```bash
git clone https://github.com/your-org/adhikar-setu.git
cd adhikar-setu
```
### Step 2: Frontend Setup
```bash
cd front-end
npm install
```
Create a .env file in the front-end directory:
```bash
VITE_MAPBOX_TOKEN=your_mapbox_token
VITE_FIREBASE_API_KEY=your_firebase_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_firebase_auth_domain
VITE_FIREBASE_PROJECT_ID=your_firebase_project_id
VITE_API_BASE_URL=http://localhost:5000/api
```
Start the development server:
```bash
npm run dev
```

The frontend will be available at http://localhost:5173


### Step 3: Backend Setup
```bash
cd ../backend
npm install
```
Create a .env file in the backend directory:
```bash
PORT=5000
DATABASE_URL=postgresql://user:password@localhost:5432/adhikar_setu
REDIS_URL=redis://localhost:6379
AWS_ACCESS_KEY_ID=your_aws_access_key
AWS_SECRET_ACCESS_KEY=your_aws_secret_key
AWS_S3_BUCKET=your_s3_bucket_name
JWT_SECRET=your_jwt_secret
```
Start the backend server:
```bash
npm start
```
The backend API will be available at http://localhost:5000


### Step 4: Docker Deployment 
For containerized deployment ( Note: This will be done when the development is completed )
```bash
cd adhikar-setu
docker-compose up --build
```



## ROLE-BASED ACCESS CONTROL (RBAC)

### Gram Sabha / Claimant
Actions: Create claims, attach evidence, view village claims, download approved titles  
Rationale: Gram Sabha initiates the FRA process

### Forest Rights Committee (FRC)
Actions: Site verification, create field reports, attach GPS/photos, recommend decisions  
Rationale: FRC conducts site verification per Rule 12A

### Forest Officer (DFO/DCF)
Actions: Upload official documents, satellite imagery, technical comments, sign verification reports  
Rationale: Forest officials must be present during verification (Rule 12A(1))

### Revenue Officer
Actions: Provide revenue maps, khasra details, boundary evidence, sign verification reports  
Rationale: Revenue authority participation is required by FRA rules

### SDLC Members
Actions: Review claims, conduct hearings, pass orders, prepare draft records, forward to DLC  
Rationale: SDLC examines claims and forwards to DLC (Rule 6/14)

### DLC / District Collector
Actions: Final approval/rejection, generate Annexure titles, perform non-delegable signing  
Rationale: DLC makes final decisions; Collector signature cannot be delegated

### District Tribal Welfare Officer (DTO)
Actions: Co-sign titles, assist DLC, maintain records  
Rationale: DTO is listed signatory in Annexures

### SLMC / MoTA
Actions: Aggregated dashboards, monitoring reports, request re-examination, download datasets  
Rationale: SLMC monitors implementation and handles complaints

### NGOs / Researchers / Public
Actions: Read-only access to aggregated/anonymized maps and statistics  
Rationale: Protect claimant personal data while enabling research






## 📚 Documentation

### Technical Documentation
- [Architecture Guide](front-end/src/ner-models-docs/docs/architecture.md)
- [Deployment Guide](front-end/src/ner-models-docs/docs/deployment.md)
- [Digitization Process](front-end/src/ner-models-docs/docs/README_digitization.md)
- [Quick Start Guide](front-end/src/ner-models-docs/docs/README_quickstart.md)
- [Annotation Guidelines](front-end/src/ner-models-docs/docs/annotation_guidelines.md)
- [Entity Schema](front-end/src/ner-models-docs/docs/entity_schema.json)

### Legal & Policy References
- [FRA Act 2006](https://tribal.nic.in/FRA.aspx)
- [FRA Rules and Guidelines](https://tribal.nic.in/FRA.aspx)
- [MoTA Monthly Progress Reports](https://tribal.nic.in)
- [Foresters' Guide to FRA](https://tribal.nic.in/FRA.aspx)

### Research References
- Ministry of Tribal Affairs (MoTA) Guidelines
- EuroSat Dataset for land classification
- Guidelines on Implementation for Scheduled Tribes
- FRA Rule Book and Amendments

### API Documentation
- REST API endpoints documentation available at `/api/docs`
- Python FastAPI service documentation at `http://localhost:8000/docs`
- WebGIS API reference in technical documentation

---

## Team
Team Synapse  
This project was developed as part of the Smart India Hackathon 2025 to address Problem Statement 25108 by the Ministry of Tribal Affairs.

## Contact Information
**Ministry of Tribal Affairs (MoTA)**  

**State Tribal Welfare Departments**  
- Madhya Pradesh: dirtadp@mp.gov.in, ctd.tribal@mp.gov.in  
- Odisha: stscdev@gmail.com, directorstoffice@gmail.com  
- Tripura: twdtripura@gmail.com, director.twd-tr@gov.in  
- Telangana: secretary_tw@telangana.gov.in, ctwtgs@gmail.com  

**General FRA Queries**  
- Email: fra-tribal@gov.in  
- Phone: +011-23340513 / +011-23340473  

**FRA Resources**  
- Official Guidelines: [https://tribal.nic.in/FRA.aspx](https://tribal.nic.in/FRA.aspx)

## Project Support
For technical queries, bug reports, or feature requests:  
- Create an issue on GitHub  
- Email: arshtiwari12345@gmail.com

## License
This project is licensed under the MIT License - see the LICENSE file for details.

---

<div align="center">
If you find Adhikar Setu useful, please consider giving it a star on GitHub.  
Built by Team Synapse for Tribal Empowerment.  

"Empowering Forest-Dwelling Communities Through Technology"  
© 2025 Adhikar Setu | Ministry of Tribal Affairs, Government of India
</div>





