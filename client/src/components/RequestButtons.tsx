// only needed locally
type RequestButtonsProps = {
  pingServer: () => Promise<void>;
  fetchData: () => Promise<void>;
};

export default function RequestButtons({
  pingServer,
  fetchData,
}: RequestButtonsProps) {
  return (
    <>
      <div>
        <button
          className="bg-blue-500 text-white p-2 rounded cursor-pointer me-2"
          onClick={pingServer}
        >
          Check Server Status
        </button>

        <button
          className="bg-green-500 text-white p-2 rounded cursor-pointer"
          onClick={fetchData}
        >
          Re-Crawl YCombinator
        </button>
      </div>
    </>
  );
}
