import { useState } from 'react';
import { useNavigate, Navigate } from 'react-router-dom';
import Cookies from 'js-cookie';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // Route Guard check for existing sessions
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
    <div className="min-h-screen flex items-center justify-center p-5 font-sans bg-gradient-to-br from-slate-50 to-slate-200 dark:from-slate-900 dark:to-slate-950 transition-colors duration-300">
      <div className="w-full max-w-[420px] p-10 rounded-2xl shadow-xl transition-all duration-300 bg-white dark:bg-slate-900 border border-transparent dark:border-slate-800">
        
        {/* Brand Header */}
        <div className="text-center mb-8">
          <div className="w-12 height h-12 bg-blue-600 rounded-xl flex items-center justify-center text-white text-xl font-bold mx-auto mb-4 shadow-lg shadow-blue-600/20">
            Go
          </div>
          <h1 className="text-2xl font-bold tracking-tight mb-2 text-slate-900 dark:text-white transition-colors">
            Welcome Back
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 transition-colors">
            Enter your credentials to access your dashboard
          </p>
        </div>
        
        {/* Sign In Form */}
        <form onSubmit={handleSignIn} className="space-y-5">
          <div>
            <label htmlFor="email" className="block text-xs font-semibold tracking-wide uppercase mb-1.5 text-slate-600 dark:text-slate-400 transition-colors">
              Email Address
            </label>
            <input
              id="email"
              type="email"
              placeholder="name@company.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full px-4 py-3 rounded-lg border outline-none text-sm font-medium transition-all duration-200
                         bg-slate-50 border-slate-200 text-slate-900 placeholder-slate-400 focus:bg-white focus:border-blue-600 focus:ring-4 focus:ring-blue-600/10
                         dark:bg-slate-800 dark:border-slate-700 dark:text-slate-100 dark:placeholder-slate-500 dark:focus:bg-slate-850 dark:focus:border-blue-500"
            />
          </div>

          <div>
            <label htmlFor="password" className="block text-xs font-semibold tracking-wide uppercase mb-1.5 text-slate-600 dark:text-slate-400 transition-colors">
              Password
            </label>
            <input
              id="password"
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full px-4 py-3 rounded-lg border outline-none text-sm font-medium transition-all duration-200
                         bg-slate-50 border-slate-200 text-slate-900 placeholder-slate-400 focus:bg-white focus:border-blue-600 focus:ring-4 focus:ring-blue-600/10
                         dark:bg-slate-800 dark:border-slate-700 dark:text-slate-100 dark:placeholder-slate-500 dark:focus:bg-slate-850 dark:focus:border-blue-500"
            />
          </div>

          {/* Error Message Module */}
          {errorMessage && (
            <div role="alert" className="flex items-center gap-2 p-3 text-sm font-medium border rounded-lg bg-red-50 border-red-200 text-red-700 dark:bg-red-950/30 dark:border-red-900/50 dark:text-red-400 transition-colors">
              <span>⚠️</span> {errorMessage}
            </div>
          )}

          {/* Primary Action Button */}
          <button 
            type="submit" 
            disabled={loading}
            className="w-full py-3.5 px-4 font-semibold text-sm text-white rounded-lg shadow-md transition-all duration-200
                       bg-blue-600 hover:bg-blue-700 active:bg-blue-800 hover:shadow-lg hover:shadow-blue-600/25
                       disabled:bg-slate-300 disabled:text-slate-500 disabled:cursor-not-allowed disabled:shadow-none
                       dark:bg-blue-600 dark:hover:bg-blue-500 dark:disabled:bg-slate-800 dark:disabled:text-slate-600"
          >
            {loading ? 'Authenticating...' : 'Sign In to Dashboard'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;