import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { ProtectedRoute } from './components/ProtectedRoute';
import { Layout } from './components/Layout';
import { Login } from './pages/Login';
import { Register } from './pages/Register';
import { ForgotPassword } from './pages/ForgotPassword';
import { Dashboard } from './pages/Dashboard';
import { CreateForm } from './pages/CreateForm';
import { FormList } from './pages/FormList';
import { FillForm } from './pages/FillForm';
import { Responses } from './pages/Responses';
import EditForm from './pages/EditForm';

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          {/* Public routes */}
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          
          {/* Public route for filling forms */}
          <Route path="/fill/:formId" element={<FillForm />} />
          
          {/* Protected admin routes with layout */}
          <Route path="/*" element={
            <ProtectedRoute>
              <Layout>
                <Routes>
                  <Route path="/" element={<Dashboard />} />
                  <Route path="/create" element={<CreateForm />} />
                  <Route path="/forms" element={<FormList />} />
                  <Route path="/responses" element={<Responses />} />
                  <Route path="/responses/:formId" element={<Responses />} />
                  <Route path="/edit-form/:id" element={<EditForm />} />
                </Routes>
              </Layout>
            </ProtectedRoute>
          } />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;