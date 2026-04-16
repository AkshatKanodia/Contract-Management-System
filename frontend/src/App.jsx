import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';

// Pages
import Navbar from './components/Navbar';
import Dashboard from './pages/Dashboard';
import Login from './pages/Login';
import Register from './pages/Register';
import ContractDetail from './pages/ContractDetail';
import ContractFormPage from './pages/ContractFormPage';

function App() {
  const { user } = useSelector((state) => state.auth);

  return (
    <Router>
      <div className="page-wrapper">
        <Navbar />
        <main className="main-content container">
          <Routes>
            <Route path="/" element={user ? <Dashboard /> : <Navigate to="/login" />} />
            <Route path="/login" element={!user ? <Login /> : <Navigate to="/" />} />
            <Route path="/register" element={!user ? <Register /> : <Navigate to="/" />} />
            <Route path="/contract/new" element={user ? <ContractFormPage /> : <Navigate to="/login" />} />
            <Route path="/contract/:id" element={user ? <ContractDetail /> : <Navigate to="/login" />} />
            <Route path="/contract/:id/edit" element={user ? <ContractFormPage /> : <Navigate to="/login" />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;
