import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'

// XY Flow
import '@xyflow/react/dist/style.css'

// FontAwesome Pro (renderização SVG via JS)
import '@fortawesome/fontawesome-pro/js/all.min.js'

// Estilos globais
import './index.css'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)
