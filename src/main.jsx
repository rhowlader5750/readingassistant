import React from 'react';
import ReactDOM from 'react-dom/client';

function App() {
  return (
    <div style={{
      position: 'fixed',
      right: 0,
      top: 0,
      width: '300px',
      height: '100vh',
      backgroundColor: '#f0f0f0',
      padding: '1rem',
      zIndex: 999999
    }}>
      <h2>📖 Summary</h2>
      <p>This will show the selected text or summaries.</p>
    </div>
  );
}

const root = ReactDOM.createRoot(document.getElementById('react-sidebar-root'));
root.render(<App />);
