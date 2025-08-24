export type ServerStatusType = "Pinging" | "Running" | "Down" | "Fetching";
export type CrawlResult = {
  rank: number;
  title: string;
  link: string;
  score: number;
  comments: number;
  elementId: number;
  numWords: number;
  timeStamp: string;
  user: string;
};
export type Filter = "eq" | "lte" | "gte" | "none";
export type SortBy = "rank" | "comments" | "score" | "numWords" | "timeStamp";

export type Query = {
  search: string;
  wordOperator: Filter;
  sortBy: SortBy;
  wordCount: string;
};
