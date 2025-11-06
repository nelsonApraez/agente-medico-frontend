# 🏥 Asistente de Diagnóstico Médico (IA)

Sistema inteligente de asistencia médica basado en AWS Bedrock AgentCore con arquitectura serverless segura.

## 🚀 Demo en Vivo

**URL:** [https://main.d1nw05u86hr54.amplifyapp.com](https://main.d1nw05u86hr54.amplifyapp.com)

## 📋 Descripción

Este proyecto implementa un asistente médico impulsado por IA que puede:

1. ✅ **Consultar información médica** en la base de conocimientos
2. ✅ **Acceder a registros de pacientes** (requiere ID del paciente)
3. ✅ **Analizar imágenes médicas** (requiere URL de imagen y contexto del paciente)

El asistente utiliza **Claude Sonnet 4.5** (AWS Bedrock) y está equipado con herramientas especializadas para proporcionar información médica precisa y contextualizada.

---

## 🏗️ Arquitectura del Sistema

### Diagrama de Flujo

```
Usuario (Navegador)
    ↓
React App (AWS Amplify)
    ↓
Lambda Function URL (HTTPS)
    ↓
AWS Lambda (Proxy Seguro)
    ↓
AWS Bedrock AgentCore Runtime
    ↓
Herramientas del Agente
    ├── 📚 Knowledge Base (RAG)
    ├── 👤 Patient Records (Simulado)
    └── 🖼️ Medical Image Analysis
```

### Componentes de la Arquitectura

#### 1. 🖥️ Frontend (React + AWS Amplify)

**Tecnología:** React 18 + Vite 5  
**Hosting:** AWS Amplify (CI/CD automático + CDN global)

- **Función:** Interfaz de chat interactiva para el usuario
- **Características:**
  - Diseño responsivo con tema oscuro
  - Gestión de estado de conversación
  - Manejo de sesiones con UUID persistente
  - Sin credenciales AWS expuestas (🔒 máxima seguridad)

**Archivos clave:**
- `src/App.jsx` - Componente principal del chat
- `src/App.css` - Estilos del asistente médico
- `vite.config.js` - Configuración de Vite

#### 2. 🛡️ Capa de Seguridad (Lambda + Function URL)

**Backend-for-Frontend (BFF)** que protege las credenciales y controla el acceso al agente.

##### Componente A: AWS Lambda (Proxy)
- **Runtime:** Python 3.11
- **Función:** Intermediario seguro entre frontend y AgentCore
- **Rol IAM:** Permisos exclusivos para `bedrock-agentcore:InvokeAgentRuntime`
- **Timeout:** 30 segundos
- **Memoria:** 128 MB

##### Componente B: Lambda Function URL
- **Endpoint:** `https://jarb7ezte3oqci2ynas3pd4oeu0qpcmc.lambda-url.us-east-2.on.aws/`
- **CORS:** Configurado para permitir llamadas desde el frontend
- **Ventaja:** No requiere API Gateway completo (arquitectura simplificada)

**Archivo clave:**
- `lambda/lambda_function.py` - Handler que invoca al agente

#### 3. 🧠 Backend Inteligente (AWS Bedrock AgentCore)

**AgentCore Runtime** desplegado con el framework **Strands**.

- **Modelo:** Claude Sonnet 4.5 (AWS Bedrock)
- **Región:** us-east-2 (Ohio)
- **ARN:** `arn:aws:bedrock-agentcore:us-east-2:413370510567:runtime/MedicalAgent-6Kd6khBvsu`

**Capacidades:**
- Orquestación inteligente de tareas médicas
- Selección automática de herramientas según el contexto
- Procesamiento de lenguaje natural en español

#### 4. 🧰 Herramientas del Agente

##### 📚 Herramienta 1: Base de Conocimientos (RAG)
- **Función:** `consult_knowledge_base`
- **Fuente:** Knowledge Base `KB_Diagnostico_Medico`
- **Backend:** Amazon S3 + Vector Database (OpenSearch Serverless)
- **Contenido:** Documentos médicos indexados para consultas semánticas

##### 👤 Herramienta 2: Registros de Pacientes (Simulado)
- **Función:** `get_patient_record`
- **Parámetro:** ID del paciente
- **Simula:** Sistema de Expedientes Médicos Electrónicos (EHR)
- **Uso:** "dame los registros del paciente 456"

##### 🖼️ Herramienta 3: Análisis de Imágenes Médicas
- **Función:** `analyze_medical_image`
- **Parámetros:** URL de imagen + contexto del paciente
- **Capacidad:** Análisis visual de estudios médicos

---

## 🛠️ Tecnologías Utilizadas

### Frontend
- **React** 18.2.0
- **Vite** 5.4.21
- **CSS3** (Dark theme personalizado)

### Backend
- **AWS Lambda** (Python 3.11)
- **AWS Bedrock** (Claude Sonnet 4.5)
- **AWS AgentCore** (Framework Strands)
- **Boto3** (AWS SDK para Python)

### Infraestructura
- **AWS Amplify** (Hosting + CI/CD)
- **Lambda Function URL** (API endpoint)
- **AWS IAM** (Gestión de permisos)
- **Amazon S3** (Almacenamiento de documentos)
- **OpenSearch Serverless** (Vector database)

---

## 📦 Estructura del Proyecto

```
agente-medico-frontend/
├── src/
│   ├── App.jsx              # Componente principal del chat
│   ├── App.css              # Estilos del asistente
│   ├── main.jsx             # Punto de entrada React
│   └── index.css            # Estilos globales
├── lambda/
│   └── lambda_function.py   # Proxy Lambda para invocar AgentCore
├── public/                  # Recursos estáticos
├── amplify.yml              # Configuración de build para Amplify
├── vite.config.js           # Configuración de Vite
├── package.json             # Dependencias del proyecto
├── .env.example             # Template de variables de entorno
└── README.md                # Este archivo
```

---

## 🚀 Despliegue

### Prerrequisitos

1. **Cuenta de AWS** con acceso a:
   - AWS Bedrock
   - AWS Lambda
   - AWS Amplify
   - AWS AgentCore

2. **Agente desplegado** en AWS AgentCore Runtime

3. **Node.js** 18+ y npm instalados localmente

### Variables de Entorno

Crea un archivo `.env` en la raíz del proyecto:

```bash
VITE_LAMBDA_URL=https://tu-lambda-function-url.lambda-url.us-east-2.on.aws/
```

### Instalación Local

```bash
# Clonar el repositorio
git clone https://github.com/nelsonApraez/agente-medico-frontend.git
cd agente-medico-frontend

# Instalar dependencias
npm install

# Ejecutar en modo desarrollo
npm run dev
```

La aplicación estará disponible en `http://localhost:3000`

### Despliegue en AWS Amplify

1. **Conectar repositorio:**
   - Ve a [AWS Amplify Console](https://console.aws.amazon.com/amplify)
   - Click en "New app" → "Host web app"
   - Selecciona GitHub y autoriza el acceso
   - Elige el repositorio `nelsonApraez/agente-medico-frontend`
   - Selecciona la rama `main`

2. **Configurar build:**
   - Amplify detecta automáticamente `amplify.yml`
   - Agrega la variable de entorno `VITE_LAMBDA_URL`

3. **Deploy:**
   - Click en "Save and deploy"
   - Amplify construirá y desplegará automáticamente

### Despliegue de Lambda

```bash
# Empaquetar función Lambda
cd lambda
zip lambda_function.zip lambda_function.py

# Actualizar función (requiere AWS CLI configurado)
aws lambda update-function-code \
  --function-name MedicalAgentProxy \
  --zip-file fileb://lambda_function.zip \
  --region us-east-2
```

---

## 🔒 Seguridad

### Principios Implementados

1. **Zero Trust Frontend:**
   - Ninguna credencial AWS expuesta en el código del navegador
   - Todas las llamadas pasan por Lambda autenticado

2. **Principio de Menor Privilegio:**
   - Lambda tiene **solo** permisos para invocar el agente
   - Rol IAM: `MedicalAgentLambdaRole`

3. **CORS Configurado:**
   - Lambda Function URL acepta peticiones del dominio de Amplify
   - Headers de seguridad automáticos

4. **Sesiones Únicas:**
   - Cada conversación usa un `sessionId` único (UUID)
   - Mínimo 33 caracteres para cumplir con requisitos de AgentCore

### Permisos IAM Requeridos

```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Action": "bedrock-agentcore:InvokeAgentRuntime",
      "Resource": "arn:aws:bedrock-agentcore:us-east-2:413370510567:runtime/MedicalAgent-*"
    }
  ]
}
```

---

## 💡 Uso del Asistente

### Ejemplos de Consultas

**Consulta de Conocimiento:**
```
"¿Cuáles son los síntomas de la hipertensión?"
```

**Acceso a Registros:**
```
"Dame los registros del paciente 456"
```

**Análisis de Imagen:**
```
"Analiza esta imagen: [URL] para el paciente con diabetes"
```

### Limitaciones Conocidas

- ⚠️ Los registros de pacientes son **simulados** (no conectados a EHR real)
- ⚠️ Requiere conexión a internet
- ⚠️ Timeout de Lambda: 30 segundos máximo por consulta

---

## 🐛 Troubleshooting

### Error: "Failed to fetch"
- **Causa:** CORS no configurado correctamente
- **Solución:** Verifica que `VITE_LAMBDA_URL` esté correctamente configurada en Amplify

### Error: "Invalid sessionId length"
- **Causa:** SessionId demasiado corto
- **Solución:** El código genera automáticamente UUIDs válidos (40+ caracteres)

### Lambda no responde
- **Causa:** Timeout o error en AgentCore
- **Solución:** Revisa CloudWatch Logs en `/aws/lambda/MedicalAgentProxy`

---

## 📝 Licencia

Este proyecto es privado y confidencial.

---

## 👨‍💻 Autor

**Nelson Apráez**  
GitHub: [@nelsonApraez](https://github.com/nelsonApraez)

---

## 🙏 Agradecimientos

- AWS Bedrock Team por AgentCore Runtime
- Anthropic por Claude Sonnet 4.5
- Comunidad de React y Vite

---

**⚕️ Nota Importante:** Este es un sistema de asistencia y **no reemplaza** el diagnóstico médico profesional. Siempre consulta con un profesional de la salud certificado.
