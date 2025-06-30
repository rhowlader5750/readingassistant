import React from 'react';
import ReactDOM from 'react-dom/client';



function App() {
  return (
    <div style={{ backgroundColor: 'white', padding: '20px' }}>
      <h1>Hello from Sidebar</h1>
    </div>
  );
}

const root = document.getElementById('react-sidebar-root');
if (root) {
  console.log("✅ Mounting React app...");
  ReactDOM.createRoot(root).render(<App />);
} else {
  console.error("❌ Could not find root element!");
}
