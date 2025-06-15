import './App.css'
import Home from '@/pages/Home'
import Layout from '@/layouts/Layout'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Login from '@/pages/Login'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element = {<Layout/>}>
            <Route path='/' element = {<Home/>}></Route>
        </Route>
        <Route path='/login' element = {<Login/>}></Route>
      </Routes>
    </BrowserRouter>
  )
}

export default App
