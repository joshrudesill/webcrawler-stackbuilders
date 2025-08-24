import { useEffect, useState } from "react";
import type { CrawlResult, ServerStatusType } from "../types";
import CrawlRow from "./CrawlRow";

type Filter = "eq" | "lte" | "gte" | "none";
type SortBy = "rank" | "comments" | "score" | "numWords" | "timeStamp";

const filterOptions: Filter[] = ["none", "eq", "lte", "gte"];
const filterLabels: Record<Filter, string> = {
  none: "No Filter",
  eq: "Equal to",
  lte: "Less Than or Equal to",
  gte: "Greater Than or Equal to",
};
const sortOptions: SortBy[] = [
  "rank",
  "comments",
  "score",
  "numWords",
  "timeStamp",
];
const sortLabels: Record<SortBy, string> = {
  rank: "Rank",
  comments: "# Comments",
  score: "Score",
  numWords: "# Words",
  timeStamp: "Most Recent",
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
  const [search, setSearch] = useState<string>("");

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

  const applyWordFilter = (data: CrawlResult[]) => {
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

  const applySearchFilter = (data: CrawlResult[]) => {
    if (!search) return data;
    return data.filter((item) =>
      item.title.toLowerCase().includes(search.toLowerCase())
    );
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
    if (data.length > 0) {
      let out = applyWordFilter(data);
      out = sortData(out);
      out = applySearchFilter(out);
      setProcessedData(out);
    }
  }, [data, filter, wordCount, sortBy, search]);

  return (
    <div className="mb-10">
      <h2 className="font-bold mb-2">Crawl Results (click items to expand)</h2>
      <div className="border-1 p-2 rounded border-gray-500 bg-gray-200">
        <div className="flex gap-3 items-center">
          <div>
            <label htmlFor="filter" className="me-1">
              Sort By:
            </label>
            <select
              data-testid="sort-select"
              id="sort"
              className="border p-1 rounded bg-gray-50"
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
              data-testid="filter-select"
              className="border p-1 rounded me-1 bg-gray-50"
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
                  data-testid="word-count-input"
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
              data-testid="reset-button"
              onClick={() => {
                setFilter("none");
                setWordCount("");
                setSortBy("rank");
                setSearch("");
              }}
            >
              Reset
            </button>
          </div>
        </div>

        <div>
          <label htmlFor="search" className="me-1">
            Search:
          </label>
          <input
            id="search"
            type="text"
            className="border p-0.5 rounded bg-gray-50"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
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
              search={search}
            />
          ))
        )}
      </div>
    </div>
  );
}
