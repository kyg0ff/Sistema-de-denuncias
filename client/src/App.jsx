import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Navbar from './components/Navbar';
import Home from './pages/public/Home';
import CreateDenuncia from './pages/public/CreateDenuncia';
import Login from './pages/auth/Login';
import TrackDenuncia from './pages/public/TrackDenuncia';
import Register from './pages/auth/Register';
import MyComplaints from './pages/citizen/MyComplaints';
// IMPORTAR EL DASHBOARD
import Dashboard from './pages/authority/Dashboard';

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Navbar />
        <div className="main-content">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/registro" element={<Register />} />
            <Route path="/nueva-denuncia" element={<CreateDenuncia />} />
            <Route path="/ciudadano/mis-denuncias" element={<MyComplaints />} />
            
            {/* RUTA DE AUTORIDAD */}
            <Route path="/autoridad/dashboard" element={<Dashboard />} />

            {/* RUTA DE SEGUIMIENTO */}
            <Route path="/seguimiento" element={<TrackDenuncia />} />
            <Route path="/seguimiento/:codigoUrl" element={<TrackDenuncia />} />
            
          </Routes>
        </div>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;