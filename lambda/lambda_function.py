import json
import boto3
import os

# Configuración del agente
AGENT_ARN = os.environ.get('AGENT_ARN', 'arn:aws:bedrock-agentcore:us-east-2:413370510567:runtime/MedicalAgent-6Kd6khBvsu')
REGION = os.environ.get('AWS_REGION', 'us-east-2')

# Cliente de AgentCore
agentcore_client = boto3.client('bedrock-agentcore', region_name=REGION)

def lambda_handler(event, context):
    """
    Función Lambda que invoca el agente de AWS AgentCore
    """
    
    try:
        # Parsear el body
        body = json.loads(event.get('body', '{}'))
        prompt = body.get('prompt', '')
        session_id = body.get('sessionId', f"session-{os.urandom(16).hex()}")  # Genera 40 caracteres
        
        if not prompt:
            return {
                'statusCode': 400,
                'body': json.dumps({'error': 'El prompt es requerido'})
            }
        
        # Preparar el payload
        payload = json.dumps({"prompt": prompt})
        
        # Invocar el agente
        response = agentcore_client.invoke_agent_runtime(
            agentRuntimeArn=AGENT_ARN,
            runtimeSessionId=session_id,
            contentType='application/json',
            accept='application/json',
            payload=payload.encode('utf-8')
        )
        
        # Leer la respuesta
        response_body = response['response'].read().decode('utf-8')
        
        # Intentar parsear como JSON
        try:
            response_json = json.loads(response_body)
            if isinstance(response_json, dict):
                if 'response' in response_json:
                    agent_response = response_json['response']
                elif 'output' in response_json:
                    agent_response = response_json['output']
                elif 'text' in response_json:
                    agent_response = response_json['text']
                else:
                    agent_response = str(response_json)
            else:
                agent_response = str(response_json)
        except json.JSONDecodeError:
            agent_response = response_body if response_body else 'No se recibió respuesta del agente.'
        
        return {
            'statusCode': 200,
            'body': json.dumps({
                'response': agent_response,
                'sessionId': session_id
            })
        }
        
    except Exception as e:
        print(f"Error: {str(e)}")
        return {
            'statusCode': 500,
            'body': json.dumps({'error': f'Error al invocar el agente: {str(e)}'})
        }
