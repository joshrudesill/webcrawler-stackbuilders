import { useEffect, useState } from "react";
import type { CrawlResult } from "../types";
import SearchHighlighter from "./SearchHighlighter";

export default function CrawlRow({
  result,
  expandedKey,
  setExpandedIndex,
  search,
}: {
  result: CrawlResult;
  expandedKey: number | null;
  setExpandedIndex: (index: number | null) => void;
  search: string;
}) {
  const [expanded, setExpanded] = useState<boolean>(false);

  const updateExpandedState = () => {
    setExpandedIndex(expanded ? null : result.elementId);
  };

  const formatTimeAgo = (timestamp: string) => {
    const now = new Date();
    const time = new Date(`${timestamp}Z`); // add z so date is constructed with UTC time

    const diffInSeconds = Math.floor((now.getTime() - time.getTime()) / 1000);

    // less than 1 minute
    if (diffInSeconds < 60) {
      return "just now";
    }

    // less than 1 hour
    const diffInMinutes = Math.floor(diffInSeconds / 60);
    if (diffInMinutes < 60) {
      return `${diffInMinutes} minute${diffInMinutes === 1 ? "" : "s"} ago`;
    }

    // less than 24 hours
    const diffInHours = Math.floor(diffInMinutes / 60);
    if (diffInHours < 24) {
      return `${diffInHours} hour${diffInHours === 1 ? "" : "s"} ago`;
    }

    // 24 hours or more - return days
    const diffInDays = Math.floor(diffInHours / 24);
    if (diffInDays < 7) {
      return `${diffInDays} day${diffInDays === 1 ? "" : "s"} ago`;
    }
  };

  useEffect(() => {
    setExpanded(expandedKey === result.elementId);
  }, [expandedKey]);

  return (
    <div className="flex flex-col border-b cursor-pointer">
      <div
        className="flex py-2 gap-1 divide-x divide-gray-500"
        onClick={updateExpandedState}
      >
        <div className="font-semibold px-2">
          Rank <span className="font-normal">{result.rank}</span>
        </div>
        <div className="font-semibold px-2">
          Title:{" "}
          <span className="font-normal">
            {" "}
            <SearchHighlighter needle={search} haystack={result.title} />
          </span>
        </div>
        <div className="font-semibold px-2">
          Score: <span className="font-normal">{result.score}</span>
        </div>
        <div className="font-semibold px-2">
          Comments: <span className="font-normal">{result.comments}</span>
        </div>
      </div>
      {expanded && (
        <div className="ms-2 flex flex-row gap-1 divide-x divide-gray-500 py-1">
          <div className="text-sm px-2">
            - Timestamp:{" "}
            <span className="text-gray-500">
              {new Date(result.timeStamp).toISOString()} (
              {formatTimeAgo(result.timeStamp)})
            </span>
          </div>
          <div className="text-sm px-2">
            User:{" "}
            <span className="text-gray-500">
              {result.user || "YCombinator"}
            </span>
          </div>
          <a
            className="text-sm font-bold px-2 underline cursor-pointer"
            href={result.link}
            target="_blank"
          >
            Link
          </a>
        </div>
      )}
    </div>
  );
}
