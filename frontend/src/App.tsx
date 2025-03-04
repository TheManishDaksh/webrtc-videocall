import { Route, Routes } from 'react-router-dom'
import './App.css'
import { Sender } from './components/Sender'
import { Receiver } from './components/Receiver'

function App() {

  return (
    <Routes>
          <Route path="/" element={<Sender/>} />
          <Route path='/receiver' element={<Receiver/>} />
    </Routes>
  )
}

export default App
