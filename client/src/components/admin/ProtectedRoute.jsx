import { Navigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen" style={{ background: 'var(--color-bg-primary)' }}>
        <div className="animate-spin-slow" style={{ width: 48, height: 48, border: '3px solid var(--color-border-subtle)', borderTopColor: 'var(--color-accent-cyan)', borderRadius: '50%' }} />
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/admin/login" replace />;
  }

  return children;
};

export default ProtectedRoute;
