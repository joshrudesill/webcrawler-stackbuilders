import { useEffect, useState } from "react";
import type { CrawlResult } from "../types";

type Filter = "eq" | "lt" | "gt" | "none";
type SortBy = "rank" | "comments" | "score";

const filterOptions: Filter[] = ["none", "eq", "lt", "gt"];
const filterLabels: Record<Filter, string> = {
  none: "No Filter",
  eq: "Equal to",
  lt: "Less Than",
  gt: "Greater Than",
};
const sortOptions: SortBy[] = ["rank", "comments", "score"];
const sortLabels: Record<SortBy, string> = {
  rank: "Rank",
  comments: "# Comments",
  score: "Score",
};

export default function CrawlResults({ data }: { data: CrawlResult[] }) {
  const [filter, setFilter] = useState<Filter>("none");
  const [sortBy, setSortBy] = useState<SortBy>("rank");
  const [wordCount, setWordCount] = useState<number | "">("");

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
        case "lt":
          return item.numWords < wordCountValue;
        case "gt":
          return item.numWords > wordCountValue;
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
    <div>
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
          <input
            type="number"
            className="border p-0.5 rounded"
            width={20}
            value={wordCount}
            disabled={filter === "none"}
            onChange={(e) => updateWordCount(Number(e.target.value))}
          />
        </div>
        <div className="flex-grow text-left">Words</div>
        <p className="font-semibold">Count: {processedData.length}</p>
      </div>
      <div className="flex flex-col gap-2 ">
        {processedData.map((result) => (
          <div key={result.elementId} className="flex border-b py-2 gap-1">
            <div className="font-semibold">
              Rank <span className="font-normal">{result.rank}</span>.{" |"}
            </div>
            <div className="font-semibold">
              Title: <span className="font-normal">{result.title}</span>
              {" |"}
            </div>
            <div className="font-semibold">
              Score: <span className="font-normal">{result.score}</span>
              {" |"}
            </div>
            <div className="font-semibold">
              Comments: <span className="font-normal">{result.comments}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
