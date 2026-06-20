import { useState } from 'react';
import { useNavigate, Navigate } from 'react-router-dom';
import Cookies from 'js-cookie';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
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
      background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)',
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
      padding: '20px'
    }}>
      <div style={{
        width: '100%',
        maxWidth: '420px',
        background: '#ffffff',
        padding: '40px',
        borderRadius: '16px',
        boxShadow: '0 10px 25px rgba(0, 0, 0, 0.05), 0 20px 48px rgba(0, 0, 0, 0.05)',
        boxSizing: 'border-box',
        transition: 'transform 0.3s ease'
      }}>
        <div style={{ textAlign: 'center', marginBottom: '32px' }}>
          {/* Custom Brand Icon Accent */}
          <div style={{ width: '48px', height: '48px', background: '#0066cc', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontSize: '20px', fontWeight: 'bold', margin: '0 auto 16px auto', boxShadow: '0 8px 16px rgba(0,102,204,0.2)' }}>
            Go
          </div>
          <h1 style={{ margin: '0 0 8px 0', fontSize: '26px', fontWeight: '700', color: '#1a1a1a', letterSpacing: '-0.5px' }}>Welcome Back</h1>
          <p style={{ color: '#666', margin: '0', fontSize: '14px' }}>Enter your credentials to access your dashboard</p>
        </div>
        
        <form onSubmit={handleSignIn}>
          <div style={{ marginBottom: '20px' }}>
            <label htmlFor="email" style={{ display: 'block', fontWeight: '600', fontSize: '13px', color: '#4a4a4a', marginBottom: '6px', uppercase: 'true' }}>Email Address</label>
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
                border: '1px solid #e0e0e0',
                borderRadius: '8px',
                fontSize: '15px',
                transition: 'all 0.2s ease',
                outline: 'none',
                background: '#f9f9f9'
              }}
              onFocus={(e) => {
                e.target.style.border = '1px solid #0066cc';
                e.target.style.background = '#fff';
                e.target.style.boxShadow = '0 0 0 4px rgba(0,102,204,0.1)';
              }}
              onBlur={(e) => {
                e.target.style.border = '1px solid #e0e0e0';
                e.target.style.background = '#f9f9f9';
                e.target.style.boxShadow = 'none';
              }}
            />
          </div>

          <div style={{ marginBottom: '24px' }}>
            <label htmlFor="password" style={{ display: 'block', fontWeight: '600', fontSize: '13px', color: '#4a4a4a', marginBottom: '6px' }}>Password</label>
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
                border: '1px solid #e0e0e0',
                borderRadius: '8px',
                fontSize: '15px',
                transition: 'all 0.2s ease',
                outline: 'none',
                background: '#f9f9f9'
              }}
              onFocus={(e) => {
                e.target.style.border = '1px solid #0066cc';
                e.target.style.background = '#fff';
                e.target.style.boxShadow = '0 0 0 4px rgba(0,102,204,0.1)';
              }}
              onBlur={(e) => {
                e.target.style.border = '1px solid #e0e0e0';
                e.target.style.background = '#f9f9f9';
                e.target.style.boxShadow = 'none';
              }}
            />
          </div>

          {errorMessage && (
            <div role="alert" style={{ display: 'flex', alignItems: 'center', background: '#fff5f5', border: '1px solid #ffccd5', color: '#c53030', padding: '12px', borderRadius: '8px', fontSize: '13px', marginBottom: '20px', fontWeight: '500' }}>
              ⚠️ {errorMessage}
            </div>
          )}

          <button 
            type="submit" 
            disabled={loading}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            style={{
              width: '100%',
              padding: '14px',
              background: loading ? '#cccccc' : (isHovered ? '#0052a3' : '#0066cc'),
              color: '#fff',
              border: 'none',
              borderRadius: '8px',
              cursor: loading ? 'not-allowed' : 'pointer',
              fontWeight: '600',
              fontSize: '15px',
              boxShadow: isHovered && !loading ? '0 4px 12px rgba(0,102,204,0.3)' : 'none',
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