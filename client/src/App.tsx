import { useEffect, useState } from "react";
import RequestButtons from "./components/RequestButtons";
import ServerStatus from "./components/ServerStatus";
import type { CrawlResult, ServerStatusType } from "./types";
import CrawlResults from "./components/CrawlResults";

function App() {
  const [status, setStatus] = useState<ServerStatusType>("Pinging");
  const [results, setResults] = useState<CrawlResult[]>([]);

  const pingServer = async () => {
    try {
      const response = await fetch("/api/ping");
      if (response.ok) {
        setStatus("Running");
      }
    } catch (error) {
      console.error("Error fetching data:", error);
      setStatus("Down");
    }
  };
  const fetchData = async () => {
    try {
      setStatus("Fetching");
      const response = await fetch("/api/crawl");
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      setResults(data as CrawlResult[]);
      setStatus("Running");
    } catch (error) {
      console.log("Error fetching data:", error);
      alert("Error fetching data - check server status and try again.");
      setStatus("Down");
      setResults([]);
    }
  };

  useEffect(() => {
    pingServer();
    fetchData();
  }, []);

  return (
    <div className="max-w-screen-xl mx-auto px-4 mt-5 ">
      <div className="bg-gray-100 p-4 rounded-lg shadow-md mb-4">
        Stack Builders WebCrawler -{" "}
        <span className="font-bold">YCombinator</span>
      </div>
      <div className="flex flex-row gap-2 items-center justify-between">
        <ServerStatus status={status} />
        <RequestButtons
          pingServer={pingServer}
          fetchData={fetchData}
          status={status}
        />
      </div>
      <div>
        <CrawlResults data={results} status={status} />
      </div>
    </div>
  );
}

export default App;
