import './index.css'
import { ObrasList } from './components/ObrasList'

export default function App() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="container mx-auto p-6">
        <ObrasList />
      </div>
    </div>
  )
}
