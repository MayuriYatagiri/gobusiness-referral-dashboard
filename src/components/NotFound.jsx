import { Link } from 'react-router-dom';

const NotFound = () => {
  return (
    <div style={{ fontFamily: 'sans-serif', textAlign: 'center', marginTop: '100px' }}>
      <h1 style={{ fontSize: '72px', margin: '0' }}>404</h1>
      <h2>Page not found</h2>
      <p style={{ color: '#666' }}>The directory profile or screen path you are looking for does not exist.</p>
      <Link to="/" style={{ color: '#0070f3', textDecoration: 'none', fontWeight: 'bold' }}>
        Back to dashboard
      </Link>
    </div>
  );
};

export default NotFound;