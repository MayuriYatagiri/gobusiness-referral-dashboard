import { useState, useEffect } from 'react';
import { useNavigate, Navigate } from 'react-router-dom';
import Cookies from 'js-cookie';

const Dashboard = () => {
  const navigate = useNavigate();
  const token = Cookies.get('jwt_token');

  // 1. ROUTE GUARD: Strict security redirect if token does not exist
  if (!token) {
    return <Navigate to="/login" replace />;
  }
  
  // Core API State variables
  const [metrics, setMetrics] = useState([]);
  const [serviceSummary, setServiceSummary] = useState(null);
  const [shareData, setShareData] = useState({ link: '', code: '' });
  const [allReferrals, setAllReferrals] = useState([]);
  
  // Filter, Sort, Pagination, and UX State variables
  const [searchQuery, setSearchQuery] = useState('');
  const [sortOrder, setSortOrder] = useState('desc'); // default newest first (desc)
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [errorText, setErrorText] = useState('');

  // Logout Handler
  const handleLogout = () => {
    Cookies.remove('jwt_token');
    navigate('/login');
  };

  // Fetch data from API based on search queries and sorting selections
  useEffect(() => {
    let isMounted = true; // Prevents state updates on unmounted components
    
    const fetchDashboardData = async () => {
      setLoading(true);
      setErrorText('');

      try {
        // Build API request URL containing active filter values
        let url = `https://v9fes04dwf.execute-api.eu-north-1.amazonaws.com/api/referrals?sort=${sortOrder}`;
        if (searchQuery) {
          url += `&search=${encodeURIComponent(searchQuery)}`;
        }

        const response = await fetch(url, {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });

        const responseJson = await response.json();

        if (isMounted) {
          if (response.ok && responseJson.success) {
            const data = responseJson.data;
            setMetrics(data.metrics || []);
            setServiceSummary(data.serviceSummary || null);
            setShareData(data.referral || { link: '', code: '' });
            setAllReferrals(data.referrals || []);
          } else {
            setErrorText(responseJson.message || `Error status: ${response.status}`);
          }
        }
      } catch (err) {
        if (isMounted) {
          setErrorText('Failed to connect to the network. Please check your connection.');
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    fetchDashboardData();

    return () => {
      isMounted = false; // Cleanup flag
    };
  }, [searchQuery, sortOrder, token]);

  // Utility to format numeric profit directly into en-US currency ($1,234)
  const formatProfit = (value) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      maximumFractionDigits: 0
    }).format(value);
  };

  // Utility to format ISO date strings (YYYY-MM-DD) into custom layout (YYYY/MM/DD)
  const formatDate = (dateStr) => {
    if (!dateStr) return '';
    return String(dateStr).replace(/-/g, '/');
  };

  // Clipboard text action utility
  const handleCopyText = (textToCopy) => {
    if (!textToCopy) return;
    navigator.clipboard.writeText(textToCopy);
    alert('Copied to clipboard!');
  };

  // Process client-side chunking (10 rows per page limit)
  const itemsPerPage = 10;
  const totalEntries = allReferrals.length;
  const totalPages = Math.ceil(totalEntries / itemsPerPage) || 1;
  
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = Math.min(startIndex + itemsPerPage, totalEntries);
  const paginatedReferrals = allReferrals.slice(startIndex, endIndex);

  return (
    <div style={{ fontFamily: 'sans-serif', padding: '20px', maxWidth: '1200px', margin: '0 auto' }}>
      
      {/* Navbar Component */}
      <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #ccc', paddingBottom: '10px' }}>
        <a href="/" aria-label="Go to dashboard home" style={{ fontSize: '20px', fontWeight: 'bold', textDecoration: 'none', color: '#000' }}>Go Business</a>
        <nav aria-label="Primary" style={{ display: 'flex', gap: '20px', alignItems: 'center' }}>
          <a href="/" style={{ textDecoration: 'none', color: '#0070f3', fontWeight: 'bold' }}>Home</a>
          <button onClick={handleLogout} style={{ padding: '6px 12px', cursor: 'pointer', border: '1px solid #ccc', borderRadius: '4px', background: '#fff' }}>Log out</button>
        </nav>
      </header>

      {/* Main Content Header */}
      <main style={{ marginTop: '20px' }}>
        <h1>Referral Dashboard</h1>
        <p style={{ color: '#555' }}>Track your referrals, earnings, and partner activity in one place.</p>

        {/* Loading and Error Alert Region */}
        {loading && <p style={{ color: '#666', fontStyle: 'italic' }}>Loading application dashboard data...</p>}
        {errorText && (
          <div role="alert" style={{ color: 'red', border: '1px solid red', padding: '10px', borderRadius: '4px', margin: '10px 0', backgroundColor: '#fff5f5' }}>
            {errorText}
          </div>
        )}

        {/* Overview Metrics Section */}
        <section role="region" aria-label="Overview metrics" style={{ margin: '30px 0', border: '1px solid #ddd', padding: '20px', borderRadius: '6px' }}>
          <h2>Overview</h2>
          <div style={{ display: 'flex', gap: '20px', flexWrap: 'wrap' }}>
            {metrics.map((metric) => (
              <div key={metric.id} style={{ border: '1px solid #eee', padding: '15px', borderRadius: '4px', minWidth: '150px', backgroundColor: '#fafafa' }}>
                <p style={{ margin: 0, color: '#666', fontSize: '14px' }}>{metric.label}</p>
                <h3 style={{ margin: '5px 0 0 0', fontSize: '22px' }}>{metric.value}</h3>
              </div>
            ))}
          </div>
        </section>

        {/* Service Summary Metrics Section */}
        <section aria-label="Service summary" style={{ margin: '30px 0', border: '1px solid #ddd', padding: '20px', borderRadius: '6px' }}>
          <h2>Service summary</h2>
          {serviceSummary ? (
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                <thead>
                  <tr style={{ borderBottom: '2px solid #ddd' }}>
                    <th style={{ padding: '8px' }}>Service</th>
                    <th style={{ padding: '8px' }}>Your Referrals</th>
                    <th style={{ padding: '8px' }}>Active Referrals</th>
                    <th style={{ padding: '8px' }}>Total Ref. Earnings</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td style={{ padding: '8px', fontWeight: '500' }}>{serviceSummary.service}</td>
                    <td style={{ padding: '8px' }}>{serviceSummary.yourReferrals}</td>
                    <td style={{ padding: '8px' }}>{serviceSummary.activeReferrals}</td>
                    <td style={{ padding: '8px' }}>{serviceSummary.totalRefEarnings}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          ) : <p style={{ color: '#666' }}>No service breakdown profile available.</p>}
        </section>

        {/* Referral Sharing Action Section */}
        <section aria-label="Share referral" style={{ margin: '30px 0', border: '1px solid #ddd', padding: '20px', borderRadius: '6px' }}>
          <h2>Refer friends and earn more</h2>
          <div style={{ display: 'flex', gap: '20px', flexWrap: 'wrap', marginTop: '10px' }}>
            <div>
              <label htmlFor="referralLinkInput" style={{ display: 'block', fontWeight: 'bold', fontSize: '14px', marginBottom: '5px' }}>
                Your Referral Link
                <input 
                  id="referralLinkInput"
                  name="referralLink"
                  type="text" 
                  readOnly 
                  value={shareData.link} 
                  style={{ display: 'block', padding: '8px', width: '250px', marginTop: '5px', marginRight: '10px', border: '1px solid #ccc', borderRadius: '4px', background: '#f9f9f9' }} 
                />
              </label>
              <button onClick={() => handleCopyText(shareData.link)} style={{ padding: '8px 12px', cursor: 'pointer', border: '1px solid #ccc', borderRadius: '4px', background: '#fff' }}>Copy</button>
            </div>
            
            <div>
              <label htmlFor="referralCodeInput" style={{ display: 'block', fontWeight: 'bold', fontSize: '14px', marginBottom: '5px' }}>
                Your Referral Code
                <input 
                  id="referralCodeInput"
                  name="referralCode"
                  type="text" 
                  readOnly 
                  value={shareData.code} 
                  style={{ display: 'block', padding: '8px', width: '150px', marginTop: '5px', marginRight: '10px', border: '1px solid #ccc', borderRadius: '4px', background: '#f9f9f9' }} 
                />
              </label>
              <button onClick={() => handleCopyText(shareData.code)} style={{ padding: '8px 12px', cursor: 'pointer', border: '1px solid #ccc', borderRadius: '4px', background: '#fff' }}>Copy</button>
            </div>
          </div>
        </section>

        {/* Complete Filterable Referrals Data Table */}
        <section style={{ margin: '30px 0', border: '1px solid #ddd', padding: '20px', borderRadius: '6px' }}>
          <h2>All referrals</h2>
          
          {/* Controls Bar */}
          <div style={{ display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: '15px', marginBottom: '15px' }}>
            <div>
              <label htmlFor="searchReferralsInput" style={{ display: 'none' }}>Search referrals</label>
              <input 
                id="searchReferralsInput"
                name="searchQuery"
                type="text" 
                placeholder="Name or service…" 
                aria-label="Search referrals"
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setCurrentPage(1); 
                }}
                style={{ padding: '8px', width: '250px', border: '1px solid #ccc', borderRadius: '4px' }}
              />
            </div>
            <div>
              <label htmlFor="sortSelect" style={{ marginRight: '8px', fontWeight: 'bold', fontSize: '14px' }}>Sort by date</label>
              <select 
                id="sortSelect" 
                name="sortOrder"
                value={sortOrder}
                onChange={(e) => {
                  setSortOrder(e.target.value);
                  setCurrentPage(1); 
                }}
                style={{ padding: '8px', border: '1px solid #ccc', borderRadius: '4px' }}
              >
                <option value="desc">Newest first</option>
                <option value="asc">Oldest first</option>
              </select>
            </div>
          </div>

          {/* Data Presentation Layout */}
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
              <thead>
                <tr style={{ borderBottom: '2px solid #ddd', backgroundColor: '#f9f9f9' }}>
                  <th style={{ padding: '10px' }}>Name</th>
                  <th style={{ padding: '10px' }}>Service</th>
                  <th style={{ padding: '10px' }}>Date</th>
                  <th style={{ padding: '10px' }}>Profit</th>
                </tr>
              </thead>
              <tbody>
                {paginatedReferrals.length === 0 ? (
                  <tr>
                    <td colSpan="4" style={{ padding: '20px', textAlign: 'center', color: '#999' }}>No matching entries</td>
                  </tr>
                ) : (
                  paginatedReferrals.map((row) => (
                    <tr 
                      key={row.id} 
                      onClick={() => navigate(`/referral/${row.id}`)}
                      style={{ borderBottom: '1px solid #eee', cursor: 'pointer', transition: 'background-color 0.1s' }}
                      onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#f1f5f9'}
                      onMouseOut={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                    >
                      <td style={{ padding: '10px' }}>{row.name}</td>
                      <td style={{ padding: '10px' }}>{row.serviceName}</td>
                      <td style={{ padding: '10px' }}>{formatDate(row.date)}</td>
                      <td style={{ padding: '10px' }}>{formatProfit(row.profit)}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* Client Side Pagination Control Panel */}
          {totalEntries > 0 && (
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '15px', flexWrap: 'wrap', gap: '10px' }}>
              <p style={{ margin: 0, fontSize: '14px', color: '#333' }}>
                Showing {totalEntries === 0 ? 0 : startIndex + 1}–{endIndex} of {totalEntries} entries
              </p>
              <div style={{ display: 'flex', gap: '5px' }}>
                <button 
                  onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))} 
                  disabled={currentPage === 1}
                  style={{ padding: '6px 12px', cursor: currentPage === 1 ? 'not-allowed' : 'pointer', border: '1px solid #ccc', borderRadius: '4px', background: '#fff' }}
                >
                  Previous
                </button>
                
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((pageNumber) => (
                  <button
                    key={pageNumber}
                    onClick={() => setCurrentPage(pageNumber)}
                    style={{
                      padding: '6px 12px',
                      cursor: 'pointer',
                      fontWeight: currentPage === pageNumber ? 'bold' : 'normal',
                      border: '1px solid #ccc',
                      borderRadius: '4px',
                      backgroundColor: currentPage === pageNumber ? '#0070f3' : '#fff',
                      color: currentPage === pageNumber ? '#fff' : '#000'
                    }}
                  >
                    {pageNumber}
                  </button>
                ))}

                <button 
                  onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))} 
                  disabled={currentPage === totalPages}
                  style={{ padding: '6px 12px', cursor: currentPage === totalPages ? 'not-allowed' : 'pointer', border: '1px solid #ccc', borderRadius: '4px', background: '#fff' }}
                >
                  Next
                </button>
              </div>
            </div>
          )}
        </section>
      </main>

      {/* Footer Branding Component */}
      <footer style={{ marginTop: '20px', padding: '20px 0', borderTop: '1px solid #ccc', display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', alignItems: 'center' }}>
        <span style={{ fontWeight: 'bold' }}>Go Business</span>
        <nav aria-label="Footer" style={{ display: 'flex', gap: '15px' }}>
          <a href="#" style={{ textDecoration: 'none', color: '#666', fontSize: '14px' }}>About</a>
          <a href="#" style={{ textDecoration: 'none', color: '#666', fontSize: '14px' }}>Privacy</a>
        </nav>
        <p style={{ margin: 0, color: '#999', fontSize: '14px' }}>&copy; 2026 Go Business</p>
      </footer>

    </div>
  );
};

export default Dashboard;