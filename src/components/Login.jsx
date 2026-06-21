import { useState } from 'react';
import { useNavigate, Navigate } from 'react-router-dom';
import Cookies from 'js-cookie';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  if (Cookies.get('jwt_token')) {
    return <Navigate to="/" replace />;
  }

  const handleSignIn = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrorMessage('');

    const cleanEmail = email.trim();
    const cleanPassword = password.trim();

    if (!cleanEmail || !cleanPassword) {
      setErrorMessage('Please fill in both fields.');
      setLoading(false);
      return;
    }
    
    try {
      const response = await fetch('https://v9fes04dwf.execute-api.eu-north-1.amazonaws.com/api/auth/signin', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: cleanEmail, password: cleanPassword }),
      });

      const responseJson = await response.json();

      if (response.ok) {
        const token = responseJson.token || (responseJson.data && responseJson.data.token);
        if (token) {
          Cookies.set('jwt_token', token, { expires: 30, secure: true, sameSite: 'strict' });
          navigate('/', { replace: true });
        } else {
          setErrorMessage('Token missing from server.');
        }
      } else {
        setErrorMessage(responseJson.message || 'Invalid credentials.');
      }
    } catch (error) {
      setErrorMessage('Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: 'var(--code-bg)', 
      fontFamily: 'var(--sans)',
      padding: '20px',
      boxSizing: 'border-box'
    }}>
      <div style={{
        width: '100%',
        maxWidth: '420px',
        background: 'var(--bg)', 
        padding: '40px',
        borderRadius: '16px',
        border: '1px solid var(--border)',
        boxShadow: 'var(--shadow)',
        boxSizing: 'border-box',
        textAlign: 'left'
      }}>
        
        {/* Brand Header */}
        <div style={{ textAlign: 'center', marginBottom: '32px' }}>
          <div style={{ 
            width: '48px', 
            height: '48px', 
            background: 'var(--accent)', 
            borderRadius: '12px', 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center', 
            color: '#fff', 
            fontSize: '20px', 
            fontWeight: 'bold', 
            margin: '0 auto 16px auto' 
          }}>
            Go
          </div>
          <h1 style={{ margin: '0 0 8px 0', fontSize: '26px', fontWeight: '700', color: 'var(--text-h)', letterSpacing: '-0.5px' }}>
            Welcome Back
          </h1>
          <p style={{ color: 'var(--text)', margin: '0', fontSize: '14px' }}>
            Enter your credentials to access your dashboard
          </p>
        </div>
        
        {/* Sign In Form */}
        <form onSubmit={handleSignIn}>
          <div style={{ marginBottom: '20px' }}>
            <label htmlFor="email" style={{ display: 'block', fontWeight: '600', fontSize: '13px', color: 'var(--text-h)', marginBottom: '6px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
              Email Address
            </label>
            <input
              id="email"
              type="email"
              placeholder="name@company.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              style={{
                width: '100%',
                padding: '12px 16px',
                boxSizing: 'border-box',
                border: '1px solid var(--border)',
                borderRadius: '8px',
                fontSize: '15px',
                outline: 'none',
                background: 'var(--bg)', 
                color: 'var(--text-h)' 
              }}
            />
          </div>

          <div style={{ marginBottom: '24px' }}>
            <label htmlFor="password" style={{ display: 'block', fontWeight: '600', fontSize: '13px', color: 'var(--text-h)', marginBottom: '6px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
              Password
            </label>
            <input
              id="password"
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              style={{
                width: '100%',
                padding: '12px 16px',
                boxSizing: 'border-box',
                border: '1px solid var(--border)',
                borderRadius: '8px',
                fontSize: '15px',
                outline: 'none',
                background: 'var(--bg)', 
                color: 'var(--text-h)' 
              }}
            />
          </div>

          {errorMessage && (
            <div role="alert" style={{ display: 'flex', alignItems: 'center', gap: '8px', background: 'var(--accent-bg)', border: '1px solid var(--accent-border)', color: 'var(--accent)', padding: '12px', borderRadius: '8px', fontSize: '13px', marginBottom: '20px', fontWeight: '500' }}>
              ⚠️ {errorMessage}
            </div>
          )}

          <button 
            type="submit" 
            disabled={loading}
            style={{
              width: '100%',
              padding: '14px',
              background: loading ? 'var(--border)' : 'var(--accent)',
              color: '#fff',
              border: 'none',
              borderRadius: '8px',
              cursor: loading ? 'not-allowed' : 'pointer',
              fontWeight: '600',
              fontSize: '15px',
              boxShadow: 'var(--shadow)',
              transition: 'all 0.2s ease'
            }}
          >
            {loading ? 'Authenticating...' : 'Sign In to Dashboard'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;