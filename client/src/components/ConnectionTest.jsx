import { useState } from 'react';

const ConnectionTest = () => {
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const testConnection = async () => {
    setLoading(true);
    setError(null);
    setData(null);

    try {
      // Using relative path to utilize Vite proxy
      const response = await fetch('/api/health');
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const result = await response.json();
      setData(result);
    } catch (err) {
      setError(err.message || 'Failed to connect to backend');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: '20px', margin: '20px 0', border: '1px solid #ddd', borderRadius: '8px' }}>
      <h2>Backend Connection Test</h2>
      <p>Click the button below to test the connection to the backend server via the Vite proxy.</p>
      
      <button 
        onClick={testConnection}
        disabled={loading}
        style={{
          padding: '10px 15px',
          backgroundColor: '#4CAF50',
          color: 'white',
          border: 'none',
          borderRadius: '4px',
          cursor: loading ? 'not-allowed' : 'pointer',
          fontSize: '16px'
        }}
      >
        {loading ? 'Testing...' : 'Test Connection'}
      </button>

      {error && (
        <div style={{ marginTop: '20px', padding: '15px', backgroundColor: '#ffebee', color: '#c62828', borderRadius: '4px' }}>
          <strong>Error: </strong> {error}
        </div>
      )}

      {data && (
        <div style={{ marginTop: '20px', padding: '15px', backgroundColor: '#e8f5e9', color: '#2e7d32', borderRadius: '4px' }}>
          <strong>Success! </strong>
          <pre style={{ marginTop: '10px', backgroundColor: 'rgba(255,255,255,0.7)', padding: '10px' }}>
            {JSON.stringify(data, null, 2)}
          </pre>
        </div>
      )}
    </div>
  );
};

export default ConnectionTest;
