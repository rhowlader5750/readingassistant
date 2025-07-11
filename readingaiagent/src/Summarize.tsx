// Summarize.tsx
import { useEffect, useState } from "react";
import { getSummary } from "./api/axios";

const Summarize = () => {
  const [summary, setSummary] = useState<string>("Loading summary...");
  const [error, setError] = useState<string | null>(null);
  

  useEffect(() => {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      if (!tabs[0]?.id || !tabs[0]?.url) {
        setError("No active tab");
        return;
      }

      const tabUrl = tabs[0].url;
      const cacheKey = `summary_${tabUrl}`;

      // First, check if we have a cached summary
      chrome.storage.local.get([cacheKey], (result) => {
        if (result[cacheKey]) {
          // Found cached summary
          console.log("✅ Loaded cached summary for:", tabUrl);
          setSummary(result[cacheKey]);
          
          
          return;
        }

        // No cached summary, generate a new one
        console.log("🔄 Generating new summary for:", tabUrl);
        chrome.tabs.sendMessage(tabs[0].id!, { type: "GET_PAGE_TEXT" }, async (res) => {
          if (!res?.text) {
            setError("No text found on the page.");
            return;
          }

          try {
            const response = await getSummary(res.text);
            const newSummary = response.data.summary;
            
            // Save to cache
            chrome.storage.local.set({ [cacheKey]: newSummary }, () => {
              console.log("💾 Summary cached for:", tabUrl);
            });
            
            setSummary(newSummary);
            
          } catch (err) {
            setError("Failed to fetch summary.");
            console.error(err);
          }
        });
      });
    });
  }, []);

  const handleRefresh = () => {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      if (!tabs[0]?.id || !tabs[0]?.url) return;

      const tabUrl = tabs[0].url;
      const cacheKey = `summary_${tabUrl}`;

      // Clear cache and regenerate
      chrome.storage.local.remove([cacheKey], () => {
        console.log("🗑️ Cache cleared for:", tabUrl);
        setSummary("Regenerating summary...");
        setError(null);
        

        chrome.tabs.sendMessage(tabs[0].id!, { type: "GET_PAGE_TEXT" }, async (res) => {
          if (!res?.text) {
            setError("No text found on the page.");
            return;
          }

          try {
            const response = await getSummary(res.text);
            const newSummary = response.data.summary;
            
            // Save new summary to cache
            chrome.storage.local.set({ [cacheKey]: newSummary }, () => {
              console.log("💾 New summary cached for:", tabUrl);
            });
            
            setSummary(newSummary);
          } catch (err) {
            setError("Failed to fetch summary.");
            console.error(err);
          }
        });
      });
    });
  };

  if (error) return <div style={{ color: "red" }}>{error}</div>;

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <h2>Summary</h2>
        <button 
          onClick={handleRefresh}
          style={{
            padding: "4px 8px",
            fontSize: "12px",
            cursor: "pointer",
            backgroundColor: "#f0f0f0",
            border: "1px solid #ccc",
            borderRadius: "4px"
          }}
        >
          Refresh
        </button>
      </div>
      
     
      
      <p>{summary}</p>
    </div>
  );
};

export default Summarize;