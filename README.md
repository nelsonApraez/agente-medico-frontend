# 🏥 Asistente de Diagnóstico Médico (IA)

Sistema inteligente de asistencia médica basado en AWS Bedrock AgentCore con arquitectura serverless segura.

## 🚀 Demo en Vivo

**URL:** [https://main.d1nw05u86hr54.amplifyapp.com](https://main.d1nw05u86hr54.amplifyapp.com)

## 📂 Repositorios del Proyecto

- **Frontend (este repo):** [agente-medico-frontend](https://github.com/nelsonApraez/agente-medico-frontend)
- **Backend (AgentCore):** [agente-medico-backend](https://github.com/nelsonApraez/agente-medico-backend)

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

- **Modelo:** Claude 3.5 Sonnet v2 (`us.anthropic.claude-3-5-sonnet-20241022-v2:0`)
- **Framework:** Strands (Python SDK para agentes)
- **Región:** us-east-2 (Ohio)
- **ARN:** `arn:aws:bedrock-agentcore:us-east-2:413370510567:runtime/MedicalAgent-6Kd6khBvsu`

**Implementación:**
```python
from strands import Agent, tool
from strands.models import BedrockModel
from bedrock_agentcore import BedrockAgentCoreApp

# Agente singleton con modelo Claude 3.5 Sonnet v2
_agente_medico = Agent(
    name='Agente Medico',
    model=BedrockModel(model_id='us.anthropic.claude-3-5-sonnet-20241022-v2:0'),
    description='Asistente medico',
    system_prompt='Eres un asistente medico. Usa las herramientas disponibles.',
    tools=[consult_knowledge_base, get_patient_record, analyze_medical_image]
)
```

**Capacidades:**
- Orquestación inteligente de tareas médicas
- Selección automática de herramientas según el contexto
- Procesamiento de lenguaje natural en español
- Gestión de estado global (singleton) para optimizar rendimiento

#### 4. 🧰 Herramientas del Agente

El agente tiene acceso a tres herramientas especializadas (decoradas con `@tool` de Strands):

##### 📚 Herramienta 1: Base de Conocimientos (RAG)
```python
@tool
def consult_knowledge_base(query: str) -> str:
    # Consulta a Bedrock Knowledge Base usando retrieve_and_generate
```
- **Knowledge Base ID:** `CJUFII3SIM`
- **Backend:** AWS Bedrock Agent Runtime (`bedrock-agent-runtime`)
- **Método:** `retrieve_and_generate` con Knowledge Base Configuration
- **Inference Profile:** Configurado via variable de entorno `KB_INFERENCE_PROFILE_ARN`
- **Función:** Recupera información de documentos médicos indexados usando búsqueda semántica
- **Ejemplo:** "¿Cuáles son los síntomas de la hipertensión?"

##### 👤 Herramienta 2: Registros de Pacientes (Simulado)
```python
@tool
def get_patient_record(patient_id: str) -> str:
    # Retorna datos simulados de pacientes
```
- **Parámetro:** `patient_id` (string)
- **Implementación:** Datos hardcoded (simulación de EHR)
- **Paciente de ejemplo:** ID `456` → "Juan Pérez, 55 años, Hipertensión"
- **Función:** Simula consulta a Sistema de Expedientes Médicos Electrónicos
- **Ejemplo:** "Dame los registros del paciente 456"

##### 🖼️ Herramienta 3: Análisis de Imágenes Médicas (Simulado)
```python
@tool
def analyze_medical_image(s3_url: str, patient_context: str) -> str:
    # Analiza imágenes médicas basándose en la URL
```
- **Parámetros:** 
  - `s3_url`: URL de la imagen médica
  - `patient_context`: Contexto clínico del paciente
- **Implementación:** Lógica básica basada en keywords (ej: detecta "rayos-x" en URL)
- **Función:** Simula análisis visual de estudios médicos (Rx, TAC, resonancias)
- **Ejemplo:** "Analiza esta imagen: s3://bucket/rayos-x-torax.jpg para paciente con tos"

---

## 🛠️ Tecnologías Utilizadas

### Frontend
- **React** 18.2.0
- **Vite** 5.4.21
- **CSS3** (Dark theme personalizado)

### Backend
- **AWS Lambda** (Python 3.11)
- **AWS Bedrock** (Claude 3.5 Sonnet v2)
- **AWS AgentCore** (Strands Framework)
- **AWS Bedrock Agent Runtime** (Knowledge Base retrieval)
- **Boto3** (AWS SDK para Python)

### Infraestructura
- **AWS Amplify** (Hosting + CI/CD)
- **Lambda Function URL** (API endpoint)
- **AWS IAM** (Gestión de permisos)
- **AWS Bedrock Knowledge Base** (RAG - ID: CJUFII3SIM)
- **Amazon Bedrock Agent Runtime** (Retrieve & Generate API)

---

## � Detalles Técnicos del Agente

### Arquitectura del Agente (Strands Framework)

El agente médico está construido con el framework **Strands**, que proporciona una abstracción de alto nivel para crear agentes de IA con herramientas.

#### Patrón Singleton
```python
_agente_medico = None  # Variable global para cachear el agente

def _get_or_create_agent():
    global _agente_medico
    if _agente_medico is not None:
        return _agente_medico
    # Crear agente solo una vez
    _agente_medico = Agent(...)
    return _agente_medico
```
**Beneficio:** Evita recrear el agente en cada invocación, mejorando latencia y reduciendo costos.

#### Entrypoint de AgentCore
```python
from bedrock_agentcore import BedrockAgentCoreApp

app = BedrockAgentCoreApp()

@app.entrypoint
def medical_agent_entrypoint(query: str) -> str:
    # Lambda invoca este entrypoint a través de AgentCore Runtime
    agente = _get_or_create_agent()
    response = agente(query)
    return response
```

#### Sistema de Herramientas (@tool)

Las herramientas se registran usando el decorador `@tool` de Strands:

```python
from strands import tool

@tool
def consult_knowledge_base(query: str) -> str:
    """Consulta la base de conocimientos médicos"""
    # El agente puede llamar esta función automáticamente
    # cuando detecta que necesita información médica
```

**Proceso de selección:**
1. Usuario envía prompt al agente
2. Claude 3.5 Sonnet analiza el prompt
3. Decide si necesita usar herramientas o puede responder directamente
4. Si necesita herramientas, selecciona la apropiada y genera los parámetros
5. Ejecuta la herramienta y procesa el resultado
6. Genera respuesta final al usuario

### Variables de Entorno (AgentCore Runtime)

```bash
AWS_REGION=us-east-2
KB_INFERENCE_PROFILE_ARN=arn:aws:bedrock:us-east-2:...
DOCKER_CONTAINER=true  # Indica ejecución en contenedor AgentCore
```

### Flujo de Datos Completo

```
1. Usuario escribe: "¿Cuáles son los síntomas de la diabetes?"
   ↓
2. React envía POST a Lambda Function URL
   ↓
3. Lambda invoca: invoke_agent_runtime(agentId, sessionId, prompt)
   ↓
4. AgentCore Runtime ejecuta: medical_agent_entrypoint(query)
   ↓
5. Agente analiza prompt con Claude 3.5 Sonnet
   ↓
6. Claude decide: "Necesito consultar la Knowledge Base"
   ↓
7. Ejecuta: consult_knowledge_base("síntomas de diabetes")
   ↓
8. Bedrock KB realiza búsqueda semántica en documentos
   ↓
9. Retorna información relevante al agente
   ↓
10. Agente genera respuesta final en lenguaje natural
    ↓
11. Lambda retorna JSON al frontend
    ↓
12. React muestra respuesta al usuario
```

---

##  Estructura del Proyecto

### Frontend (Este Repositorio)

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

### Backend (Repositorio Separado)

El código del agente de AgentCore está en: [agente-medico-backend](https://github.com/nelsonApraez/agente-medico-backend)

```
agente-medico-backend/
├── agente_medico.py         # Código del agente con Strands
├── requirements.txt         # Dependencias Python
├── Dockerfile               # Imagen para AgentCore Runtime
└── README.md                # Documentación del agente
```

**Archivos clave del backend:**
- `agente_medico.py` - Implementación del agente con tools (@tool decorators)
- Herramientas: `consult_knowledge_base`, `get_patient_record`, `analyze_medical_image`

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

- AWS Bedrock Team por AgentCore Runtime y Knowledge Bases
- Anthropic por Claude 3.5 Sonnet v2
- Strands Framework para orquestación de agentes
- Comunidad de React y Vite

---

**⚕️ Nota Importante:** Este es un sistema de asistencia y **no reemplaza** el diagnóstico médico profesional. Siempre consulta con un profesional de la salud certificado.
