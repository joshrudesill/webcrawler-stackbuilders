# WebCrawler for YCombinator (main branch)
> _see server-sortfilter branch for alternate version_
### Requirements
- Node@latest
  
### Getting started
1. Clone and `cd` into directory
2. `cd server` -> `npm install`
3. `cd ..` -> `cd client` -> `npm install`
4. Still in client directory `npm run all`
5. Open [localhost:5173](http://localhost:5173/)

### Basic Functionality
When the main `App` component mounts it sends a request to the server which gets the content from [YCombinator](https://news.ycombinator.com) and parses the first 30 posts. _See server/util/crawler.js_ 
It pulls everything available from each post, title, rank, points, user, number of comments, the link, and the timestamp. It also counts the words excluding special characters. This array of 30 posts is sent back to the client
where it is passed through filters and sorted based on which options are selected. Each post can be expanded by clicking it. 

### Tests
1. In client directory run `npm run test`
2. In cypress window -> Component Testing -> Choose your browser preference
3. Click App.cy.tsx and let the test run
