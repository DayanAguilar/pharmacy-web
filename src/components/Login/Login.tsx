import { useState } from 'react';
import './Login.css';
import { login } from '../../services/utils';


interface LoginProps {
  onLoginSuccess: () => void;
}

const Login = ({ onLoginSuccess }: LoginProps) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const data = await login(username, password); 
      console.log(data);
      if (data.message=="Login exitoso") {
        localStorage.setItem('isLoggedIn', 'true');
        localStorage.setItem('role',data.user.role);
        localStorage.setItem('user',data.user.username);
        onLoginSuccess();
      } else {
        setError(data?.message || 'Usuario o contraseña incorrectos');
      }
    } catch (err) {
      console.error(err);
      setError('Error de conexión. Intenta nuevamente.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-overlay">
      <form className="login-box" onSubmit={handleSubmit}>
        <h2>Login</h2>
        <input
          type="text"
          placeholder="Usuario"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
        <input
          type="password"
          placeholder="Contraseña"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button type="submit" className="btn btn-blue" disabled={loading}>
          {loading ? 'Ingresando...' : 'Entrar'}
        </button>
        {error && <p className="login-error">{error}</p>}
      </form>
    </div>
  );
};

export default Login;
