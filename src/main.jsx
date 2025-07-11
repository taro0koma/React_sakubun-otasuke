import 'milligram/dist/milligram.css'
import React, { Suspense } from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './assets/css/index.css';
import './i18n';

ReactDOM.createRoot(document.getElementById('root')).render(
  <Suspense fallback="loading">
    <App />
  </Suspense>
)
