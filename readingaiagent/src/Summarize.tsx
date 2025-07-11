import { useEffect, useState } from 'react';
import { getSummary } from './api/axios';

function Summarize() {
  const [summary, setSummary] = useState<string>('Loading...');
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      if (!tabs[0]?.url || !tabs[0].id) return;

      const url = tabs[0].url;

      // Check storage for cached summary
      chrome.storage.local.get([url], async (result) => {
        if (result[url]) {
          console.log('✅ Loaded cached summary');
          setSummary(result[url]);
          setIsLoading(false);
        } else {
          // No cached summary — generate it
          chrome.tabs.sendMessage(tabs[0].id!, { type: 'GET_PAGE_TEXT' }, async (res) => {
            if (!res?.text) {
              setSummary('No text found');
              setIsLoading(false);
              return;
            }

            try {
              const response = await getSummary(res.text);
              const newSummary = response.data.summary;
              setSummary(newSummary);
              chrome.storage.local.set({ [url]: newSummary });
            } catch (err) {
              setSummary('❌ Failed to generate summary.');
              console.error(err);
            } finally {
              setIsLoading(false);
            }
          });
        }
      });
    });
  }, []);

  return (
    <div>
      <h3>📄 Page Summary</h3>
      {isLoading ? <p>Summarizing...</p> : <p>{summary}</p>}
    </div>
  );
}

export default Summarize;
