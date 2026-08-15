import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { seedDefaultCategories } from './db/seed'
import { generateDueRecurringTransactions } from './db/recurring'
import { captureQuickAddFromUrl } from './db/quickAddCapture'

seedDefaultCategories().then(generateDueRecurringTransactions)
captureQuickAddFromUrl()

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
