import './App.css';
import Home from '@/pages/Home';
import Layout from '@/layouts/Layout';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Login from '@/pages/Login';
import { ProtectedRoute } from '@/pages/ProtectedRoutes';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public Route */}
        <Route path="/login" element={<Login />} />

        {/* Protected Routes */}
           <Route element={<ProtectedRoute />}>
                <Route
                  path="/home"
                  element={
                    <Layout>
                      <Home />
                    </Layout>
                  }
                />
          <Route path="/" element={<Home />} />
 
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
