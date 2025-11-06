import { useState, useRef, useEffect } from 'react'
import './App.css'

// Configuración de la Lambda
const LAMBDA_URL = import.meta.env.VITE_LAMBDA_URL

function App() {
  const [messages, setMessages] = useState([])
  const [input, setInput] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [sessionId] = useState(`session-${crypto.randomUUID()}`)
  const messagesEndRef = useRef(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const callAgent = async (userMessage) => {
    setIsLoading(true)
    
    try {
      // Llamar a la Lambda Function URL
      const response = await fetch(LAMBDA_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          prompt: userMessage,
          sessionId: sessionId
        })
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const data = await response.json()
      
      if (data.error) {
        throw new Error(data.error)
      }

      return data.response.replace(/\\n/g, '\n') || 'No se recibió respuesta del agente.'
      
    } catch (error) {
      console.error('Error al invocar el agente:', error)
      throw new Error(`Error al contactar al agente: ${error.message}`)
    } finally {
      setIsLoading(false)
    }
  }

  const handleSend = async () => {
    if (!input.trim() || isLoading) return

    const userMessage = input.trim()
    setInput('')

    // Agregar mensaje del usuario
    setMessages(prev => [...prev, { role: 'user', content: userMessage }])

    try {
      // Llamar al agente
      const agentResponse = await callAgent(userMessage)
      
      // Agregar respuesta del agente
      setMessages(prev => [...prev, { role: 'assistant', content: agentResponse }])
    } catch (error) {
      setMessages(prev => [...prev, { 
        role: 'assistant', 
        content: `Error: ${error.message}` 
      }])
    }
  }

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  return (
    <div className="app">
      <div className="header">
        <h1>🩺 Asistente de Diagnóstico Médico (IA)</h1>
      </div>

      <div className="chat-container">
        <div className="messages-container">
          {messages.map((message, index) => (
            <div key={index} className={`message ${message.role}`}>
              <div className="message-avatar">
                {message.role === 'user' ? '👤' : '🤖'}
              </div>
              <div className="message-content">
                {message.content}
              </div>
            </div>
          ))}
          {isLoading && (
            <div className="loading">El Dr. IA está pensando...</div>
          )}
          <div ref={messagesEndRef} />
        </div>

        <div className="input-container">
          <input
            type="text"
            className="chat-input"
            placeholder="¿Cómo puedo ayudarte hoy?"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={handleKeyPress}
            disabled={isLoading}
          />
          <button
            className="send-button"
            onClick={handleSend}
            disabled={isLoading || !input.trim()}
          >
            Enviar
          </button>
        </div>
      </div>
    </div>
  )
}

export default App
