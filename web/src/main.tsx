import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { App } from './App'

import './styles/tokens.css'
import './styles/base.css'
import './styles/components.css'
import './styles/blocks.css'
import './styles/motion.css'
import './styles/commerce.css'

const rootElement = document.getElementById('root')

if (!rootElement) {
  throw new Error('No se encontró el contenedor #root')
}

createRoot(rootElement).render(
  <StrictMode>
    <App />
  </StrictMode>,
)

import './styles/experience.css'
