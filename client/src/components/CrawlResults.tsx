import { useEffect, useState } from "react";
import type { CrawlResult, ServerStatusType } from "../types";
import CrawlRow from "./CrawlRow";

type Filter = "eq" | "lte" | "gte" | "none";
type SortBy = "rank" | "comments" | "score";

const filterOptions: Filter[] = ["none", "eq", "lte", "gte"];
const filterLabels: Record<Filter, string> = {
  none: "No Filter",
  eq: "Equal to",
  lte: "Less Than or Equal to",
  gte: "Greater Than or Equal to",
};
const sortOptions: SortBy[] = ["rank", "comments", "score"];
const sortLabels: Record<SortBy, string> = {
  rank: "Rank",
  comments: "# Comments",
  score: "Score",
};

export default function CrawlResults({
  data,
  status,
}: {
  data: CrawlResult[];
  status: ServerStatusType;
}) {
  const [filter, setFilter] = useState<Filter>("none");
  const [sortBy, setSortBy] = useState<SortBy>("rank");
  const [wordCount, setWordCount] = useState<number | "">("");
  const [expandedKey, setExpandedKey] = useState<number | null>(null);

  const [processedData, setProcessedData] = useState<CrawlResult[]>(data);

  const updateWordCount = (count: number) => {
    if (count < 0) return;
    setWordCount(count);
  };

  const updateFilter = (filter: Filter) => {
    setFilter(filter);
    if (filter === "none") {
      setWordCount("");
    } else {
      setWordCount(5); //default to 5
    }
  };

  const applyFilter = (data: CrawlResult[]) => {
    if (filter === "none") return data;

    return data.filter((item) => {
      const wordCountValue = wordCount === "" ? 0 : wordCount;
      switch (filter) {
        case "eq":
          return item.numWords === wordCountValue;
        case "lte":
          return item.numWords <= wordCountValue;
        case "gte":
          return item.numWords >= wordCountValue;
        default:
          return true;
      }
    });
  };

  const sortData = (data: CrawlResult[]) => {
    let freshCopy = [...data];
    if (sortBy === "rank") {
      return freshCopy.sort((a, b) => {
        if (a[sortBy] < b[sortBy]) return -1;
        if (a[sortBy] > b[sortBy]) return 1;
        return 0;
      });
    }
    return freshCopy.sort((a, b) => {
      if (a[sortBy] > b[sortBy]) return -1;
      if (a[sortBy] < b[sortBy]) return 1;
      return 0;
    });
  };

  useEffect(() => {
    let out = applyFilter(data);
    out = sortData(out);
    setProcessedData(out);
  }, [data, filter, wordCount, sortBy]);

  return (
    <div className="mb-10">
      <h2 className="font-bold mb-2">Crawl Results</h2>
      <div className="flex gap-3 items-center border-1 p-2 rounded border-gray-500 bg-gray-200">
        <div>
          <label htmlFor="filter" className="me-1">
            Sort By:
          </label>
          <select
            id="sort"
            className="border p-1 rounded"
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as SortBy)}
          >
            {sortOptions.map((option) => (
              <option key={option} value={option}>
                {sortLabels[option]}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label htmlFor="filter" className="me-1">
            Filter:
          </label>
          <select
            id="filter"
            className="border p-1 rounded me-1"
            value={filter}
            onChange={(e) => updateFilter(e.target.value as Filter)}
          >
            {filterOptions.map((option) => (
              <option key={option} value={option}>
                {filterLabels[option]}
              </option>
            ))}
          </select>
          {filter !== "none" && (
            <>
              <input
                type="number"
                className="border p-0.5 rounded"
                width={20}
                value={wordCount}
                onChange={(e) => updateWordCount(Number(e.target.value))}
              />
            </>
          )}
        </div>
        {filter !== "none" && <div>Words</div>}
        <div className="font-semibold flex-grow text-right">
          Count: {processedData.length}
        </div>
        <div>
          <button
            className="bg-red-500 text-white p-2 rounded cursor-pointer"
            onClick={() => {
              setFilter("none");
              setWordCount("");
            }}
          >
            Reset
          </button>
        </div>
      </div>
      <div className="flex flex-col gap-2 ">
        {status === "Fetching" ? (
          <div className="text-2xl font-bold mt-2">Loading...</div>
        ) : processedData.length === 0 ? (
          <div className="text-2xl font-bold mt-2">Nothing here..</div>
        ) : (
          processedData.map((result) => (
            <CrawlRow
              key={result.elementId}
              result={result}
              setExpandedIndex={setExpandedKey}
              expandedKey={expandedKey}
            />
          ))
        )}
      </div>
    </div>
  );
}
