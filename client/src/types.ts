export type ServerStatusType = "Pinging" | "Running" | "Down" | "Fetching";
export type CrawlResult = {
  rank: number;
  title: string;
  link: string;
  score: number;
  comments: number;
  elementId: number;
  numWords: number;
};
