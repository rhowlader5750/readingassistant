import React, { useEffect, useState } from 'react';
import ReactDOM from 'react-dom/client';

const Sidebar = () => {
  const [sections, setSections] = useState([]);

  useEffect(() => {
    // Safely access parsed data
    if (window.__READING_HELPER_CONTENT__) {
      setSections(window.__READING_HELPER_CONTENT__);
    }
  }, []);

  return (
    <div style={styles.sidebar}>
      <h2 style={styles.title}>🧠 Reading Helper</h2>
      <div style={styles.content}>
        {sections.map((section, i) => (
          <div key={i} style={styles.section}>
            <h3>{section.heading}</h3>
            {section.content.map((p, j) => (
              <p key={j} style={styles.paragraph}>{p}</p>
            ))}
          </div>
        ))}
        {sections.length === 0 && <p>No content found.</p>}
      </div>
    </div>
  );
};

const styles = {
  sidebar: {
    position: 'fixed',
    top: 0,
    right: 0,
    width: '360px',
    height: '100vh',
    backgroundColor: '#f5f5f5',
    borderLeft: '1px solid #ccc',
    boxShadow: '-2px 0 8px rgba(0,0,0,0.1)',
    zIndex: 999999999,
    padding: '16px',
    overflowY: 'auto',
    fontFamily: 'sans-serif'
  },
  title: {
    marginTop: 0
  },
  section: {
    marginBottom: '24px'
  },
  paragraph: {
    fontSize: '14px',
    lineHeight: '1.6'
  },
  content: {
    paddingTop: '8px'
  }
};

const root = document.getElementById('react-sidebar-root');
if (root) {
  ReactDOM.createRoot(root).render(<Sidebar />);
}
