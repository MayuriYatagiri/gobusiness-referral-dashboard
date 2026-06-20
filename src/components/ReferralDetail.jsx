import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import Cookies from 'js-cookie';

const ReferralDetail = () => {
  const { id } = useParams(); // Extracts the ID directly from the URL parameter
  const [referral, setReferral] = useState(null);
  const [loading, setLoading] = useState(true);
  const [errorText, setErrorText] = useState('');

  useEffect(() => {
    const fetchSingleReferral = async () => {
      setLoading(true);
      setErrorText('');
      const token = Cookies.get('jwt_token');

      try {
        // Fetch single referral profile using query parameter assignment matching specifications
        const response = await fetch(`https://v9fes04dwf.execute-api.eu-north-1.amazonaws.com/api/referrals?id=${id}`, {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });

        const responseJson = await response.json();

        // Check if rows returned contain actual object matches
        if (response.ok && responseJson.success && responseJson.data.referrals && responseJson.data.referrals.length > 0) {
          // Find row match matching active route ID
          const match = responseJson.data.referrals.find(item => item.id.toString() === id.toString());
          if (match) {
            setReferral(match);
          } else {
            setErrorText('404');
          }
        } else {
          setErrorText('404');
        }
      } catch (err) {
        setErrorText('Failed to fetch item data profile.');
      } finally {
        setLoading(false);
      }
    };

    fetchSingleReferral();
  }, [id]);

  const formatProfit = (value) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      maximumFractionDigits: 0
    }).format(value);
  };

  if (loading) return <div style={{ padding: '40px', fontFamily: 'sans-serif' }}>Loading partner data view...</div>;

  // Fallback structural rendering if item is missing / API rejects profile route
  if (errorText === '404' || !referral) {
    return (
      <div style={{ padding: '40px', fontFamily: 'sans-serif', textAlign: 'center' }}>
        <h2>Referral not found</h2>
        <Link to="/" style={{ color: '#0070f3', textDecoration: 'none' }}>← Back to dashboard</Link>
      </div>
    );
  }

  return (
    <div style={{ fontFamily: 'sans-serif', maxWidth: '600px', margin: '50px auto', padding: '20px', border: '1px solid #ddd', borderRadius: '8px' }}>
      <Link to="/" style={{ color: '#0070f3', textDecoration: 'none', display: 'inline-block', marginBottom: '20px' }}>
        ← Back to dashboard
      </Link>
      
      <h1>Referral Details</h1>
      <h2 style={{ color: '#333', borderBottom: '1px solid #eee', paddingBottom: '10px' }}>{referral.name}</h2>
      
      <dl style={{ display: 'grid', gridTemplateColumns: '150px 1fr', gap: '15px', margin: '20px 0' }}>
        <dt style={{ fontWeight: 'bold', color: '#666' }}>Referral ID</dt>
        <dd style={{ margin: 0 }}>{referral.id}</dd>

        <dt style={{ fontWeight: 'bold', color: '#666' }}>Service Name</dt>
        <dd style={{ margin: 0 }}>{referral.serviceName}</dd>

        <dt style={{ fontWeight: 'bold', color: '#666' }}>Date Created</dt>
        <dd style={{ margin: 0 }}>{referral.date.replace(/-/g, '/')}</dd>

        <dt style={{ fontWeight: 'bold', color: '#666' }}>Total Profit</dt>
        <dd style={{ margin: 0, fontWeight: 'bold', color: 'green' }}>{formatProfit(referral.profit)}</dd>
      </dl>
    </div>
  );
};

export default ReferralDetail;