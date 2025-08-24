import type { ServerStatusType } from "../types";

// only needed locally
type RequestButtonsProps = {
  pingServer: () => Promise<void>;
  fetchData: () => Promise<void>;
  status: ServerStatusType;
};

export default function RequestButtons({
  pingServer,
  fetchData,
  status,
}: RequestButtonsProps) {
  return (
    <>
      <div>
        <button
          className="bg-blue-500 text-white p-2 rounded cursor-pointer me-2 disabled:cursor-not-allowed"
          onClick={pingServer}
          disabled={status === "Fetching"}
        >
          Check Server Status
        </button>

        <button
          className="bg-green-500 text-white p-2 rounded cursor-pointer disabled:cursor-not-allowed"
          onClick={fetchData}
          disabled={status === "Fetching"}
        >
          Re-Crawl YCombinator
        </button>
      </div>
    </>
  );
}
