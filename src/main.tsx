import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { seedDefaultCategories } from './db/seed'
import { generateDueRecurringTransactions } from './db/recurring'

seedDefaultCategories().then(generateDueRecurringTransactions)

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
