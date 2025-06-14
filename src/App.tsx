import './App.css'
import Home from '@/pages/Home'
import Layout from '@/layouts/Layout'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Login from '@/pages/Login'

function App() {
  return (
    <BrowserRouter>
      <Layout>
        <Routes>
          <Route path="/" element={<Home />} />
        </Routes>
        <Routes>
          <Route path="/home" element={<Login />} />
        </Routes>
      </Layout>
      
    </BrowserRouter>
  )
}

export default App
