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
      const data = await response.json();
      setResults(data as CrawlResult[]);
      setStatus("Running");
    } catch (error) {
      console.error("Error fetching data:", error);
      setStatus("Down");
    }
  };

  useEffect(() => {
    pingServer();
  }, []);

  return (
    <div className="container mx-auto p-4">
      <div className="bg-gray-100 p-4 rounded-lg shadow-md mb-4">
        Stack Builders WebCrawler -{" "}
        <span className="font-bold">YCombinator</span>
      </div>
      <div className="flex flex-row gap-2 items-center justify-between">
        <ServerStatus status={status} />
        <RequestButtons pingServer={pingServer} fetchData={fetchData} />
      </div>
      <div>
        <CrawlResults data={results} />
      </div>
    </div>
  );
}

export default App;
