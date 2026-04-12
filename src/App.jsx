import { Toaster } from 'react-hot-toast'
import AppRouter from './routes/AppRouter'

export default function App() {
  return (
    <>
      <AppRouter />
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 4000,
          style: {
            fontFamily: "'Plus Jakarta Sans', sans-serif",
            fontSize: '14px',
            borderRadius: '12px',
            boxShadow: '0 4px 24px rgba(0,0,0,0.12)',
          },
          success: { iconTheme: { primary: '#2563eb', secondary: '#fff' } },
        }}
      />
    </>
  )
}
