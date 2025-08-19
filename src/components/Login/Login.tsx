import { useState } from 'react';
import './Login.css'; 

interface LoginProps {
  onLoginSuccess: () => void;
}

const Login = ({ onLoginSuccess }: LoginProps) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const envUser = import.meta.env.VITE_USER;
    const envPass = import.meta.env.VITE_PASSWORD;

    if (username === envUser && password === envPass) {
      setError('');
      localStorage.setItem('isLoggedIn', 'true'); 
      onLoginSuccess();
    } else {
      setError('Usuario o contraseña incorrectos');
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
        <button type="submit" className="btn btn-blue">Entrar</button>
        {error && <p className="login-error">{error}</p>}
      </form>
    </div>
  );
};

export default Login;
