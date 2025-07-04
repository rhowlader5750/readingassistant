import { useState } from "react";
import Summarize from "./Summarize";
import Peter from "./Peter";

const tabStyle = (active: boolean) => ({
  flex: 1,
  padding: "12px 16px",
  cursor: "pointer",
  backgroundColor: active ? "#007bff" : "#f8f9fa",
  color: active ? "white" : "#495057",
  border: "1px solid #dee2e6",
  borderBottom: active ? "3px solid #0056b3" : "1px solid #dee2e6",
  fontWeight: active ? "600" : "500",
  fontSize: "14px",
  transition: "all 0.2s ease",
  borderRadius: "6px 6px 0 0",
  textTransform: "capitalize" as const,
  outline: "none",
});

function App() {
  const [activeTab, setActiveTab] = useState("summarize");

  const handleTabChange = (tabName: string) => {
    setActiveTab(tabName);
  };

  return (
    <div
      style={{
        fontFamily:
          '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen, Ubuntu, Cantarell, "Open Sans", "Helvetica Neue", sans-serif',
        width: 360,
        height: 480,
        display: "flex",
        flexDirection: "column",
        border: "1px solid #dee2e6",
        borderRadius: 8,
        overflow: "hidden",
        boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
        backgroundColor: "#fff",
        margin: "0 auto",
      }}
    >
      <nav 
        style={{ 
          display: "flex", 
          gap: 2, 
          padding: "8px 8px 0 8px",
          backgroundColor: "#f8f9fa",
          borderBottom: "1px solid #dee2e6"
        }}
        role="tablist"
        aria-label="Main navigation"
      >
        <button
          style={tabStyle(activeTab === "summarize")}
          onClick={() => handleTabChange("summarize")}
          aria-selected={activeTab === "summarize"}
          role="tab"
          aria-controls="summarize-panel"
          id="summarize-tab"
          type="button"
        >
          Summarize
        </button>

        <button
          style={tabStyle(activeTab === "peter")}
          onClick={() => handleTabChange("peter")}
          aria-selected={activeTab === "peter"}
          role="tab"
          aria-controls="peter-panel"
          id="peter-tab"
          type="button"
        >
          Peter Will Take Over
        </button>
      </nav>

      <main
        style={{
          flex: 1,
          padding: 20,
          overflowY: "auto",
          fontSize: 14,
          color: "#212529",
          backgroundColor: "#ffffff",
          borderRadius: "0 0 8px 8px",
        }}
        role="tabpanel"
        id={`${activeTab}-panel`}
        aria-labelledby={`${activeTab}-tab`}
      >
        {activeTab === "summarize" && <Summarize />}
        {activeTab === "peter" && <Peter />}
      </main>
    </div>
  );
}

export default App;