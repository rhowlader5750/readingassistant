import { useState } from 'react';
import Summarize from './Summarize';
import Peter from './Peter';

function App() {
  const [activeTab, setActiveTab] = useState('summarize');

  return (
    <div>
      <div style={{ display: 'flex', gap: '10px' }}>
        <button
          style={{
            padding: '8px 16px',
            cursor: 'pointer',
            backgroundColor: activeTab === 'summarize' ? '#007bff' : '#eee',
            color: activeTab === 'summarize' ? 'white' : 'black',
            border: 'none',
            borderBottom: activeTab === 'summarize' ? '3px solid #0056b3' : 'none',
          }}
          onClick={() => setActiveTab('summarize')}
        >
          summarize
        </button>

        <button
          style={{
            padding: '8px 16px',
            cursor: 'pointer',
            backgroundColor: activeTab === 'peter' ? '#007bff' : '#eee',
            color: activeTab === 'peter' ? 'white' : 'black',
            border: 'none',
            borderBottom: activeTab === 'peter' ? '3px solid #0056b3' : 'none',
          }}
          onClick={() => setActiveTab('peter')}
        >
          peter will take over
        </button>
      </div>

      <div style={{ marginTop: 20 }}>
        {activeTab === 'summarize' && <Summarize />}
        {activeTab === 'peter' && <Peter />}
      </div>
    </div>
  );
}

export default App;
