# WebCrawler for YCombinator (server-filtersort branch)
> alternate branch
### Requirements
- Node@latest
  
### Getting started
1. Clone and `cd` into directory
2. `cd server` -> `npm install`
3. `cd ..` -> `cd client` -> `npm install`
4. Still in client directory `npm run all`
5. Open [localhost:5173](http://localhost:5173/)

### Basic Functionality
When the main `App` component mounts it sends a request to the server with query parameters dictating filters and sorting. The server then gets the content from [YCombintor](https://news.ycombinator.com) and 
parses the first 30 posts. _See server/util/crawler.js_ 
It pulls everything available from each post, title, rank, points, user, number of comments, the link, and the timestamp. It also counts the words excluding special characters. This array of 30 posts is 
then sent to a sorting and filtering utility which uses the query parameters to sort and filter. It is then sent back to the client to be displayed as is. On the client, any time a filter or sort value changes, and new request is sent to the server
and the whole process starts again. It is worth noting that when the search field or the # of words field are changed, there is a delay of 500ms after the last keystroke to avoid sending a request for every change. 
_see client/src/components/CrawlResults.tsx_

__The main difference between this branch and main is where the sorting and filtering is performed. Since the project description was unclear about where it should be performed I made this separate branch to illustate 
what server-side filtering could look like.__
