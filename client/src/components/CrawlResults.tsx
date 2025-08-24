import { useEffect, useState } from "react";
import type {
  CrawlResult,
  Filter,
  Query,
  ServerStatusType,
  SortBy,
} from "../types";
import CrawlRow from "./CrawlRow";

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
  fetchData,
}: {
  data: CrawlResult[];
  status: ServerStatusType;
  fetchData: (query: Query) => Promise<void>;
}) {
  const [filter, setFilter] = useState<Filter>("none");
  const [sortBy, setSortBy] = useState<SortBy>("rank");
  const [search, setSearch] = useState<string>("");
  const [debouncedSearch, setDebouncedSearch] = useState<string>("");

  const [wordCount, setWordCount] = useState<number>(5);
  const [debouncedWordCount, setDebouncedWordCount] = useState<number>(5);
  const [expandedKey, setExpandedKey] = useState<number | null>(null);

  // to prevent a ton of requests while typing - wait 500ms
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(search);
    }, 500);

    return () => clearTimeout(timer);
  }, [search]);

  // to prevent a ton of requests while typing or using up down arrows - wait 500ms
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedWordCount(wordCount);
    }, 500);

    return () => clearTimeout(timer);
  }, [wordCount]);

  const updateWordCount = (count: number) => {
    if (count < 0) return;
    setWordCount(count);
  };

  const updateFilter = (filter: Filter) => {
    setFilter(filter);
  };

  useEffect(() => {
    let query: Query = {
      search: debouncedSearch,
      wordOperator: filter,
      sortBy: sortBy,
      wordCount: debouncedWordCount.toString(),
    };

    if (wordCount === debouncedWordCount && debouncedSearch === search) {
      // to prevent debounce to send double queries when resetting ^
      fetchData(query);
    }
  }, [filter, debouncedWordCount, sortBy, debouncedSearch, search, wordCount]);

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
              Word Count Filter:
            </label>
            <select
              id="filter"
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
            Count: {data.length}
          </div>

          <div>
            <button
              className="bg-red-500 text-white p-2 rounded cursor-pointer"
              onClick={() => {
                setFilter("none");
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
        ) : data.length === 0 ? (
          <div className="text-2xl font-bold mt-2">Nothing here..</div>
        ) : (
          data.map((result) => (
            <CrawlRow
              key={result.elementId}
              result={result}
              setExpandedIndex={setExpandedKey}
              expandedKey={expandedKey}
              search={debouncedSearch}
            />
          ))
        )}
      </div>
    </div>
  );
}
