const cheerio = require("cheerio");
const e = require("express");

async function crawlWebsite(url = "https://news.ycombinator.com/") {
  try {
    const $ = await cheerio.fromURL(url);

    let $submissions = $(".athing");

    if ($submissions.length === 0) {
      throw new Error("No submissions found");
    }
    if ($submissions.length < 30) {
      throw new Error("Not enough submissions found");
    }

    let result = [];

    $submissions.each((_, element) => {
      let $element = $(element);
      let $elementInfo = $($element.next());

      let title = $element.find(".titleline > a").text();
      let link = $element.find(".titleline > a").attr("href");

      let rank = $element.find(".rank").text().replace(".", "");

      let $subline = $elementInfo.find(".subline");

      let elementId = $element.attr("id");

      let timeStamp = $elementInfo.find(".age").attr("title").split(" ")[0];
      let user = $elementInfo.find(".hnuser").text();

      let score = 0;
      let comments = 0;

      if ($subline.length === 0) {
        // If there isn't a .subline we know it's just a time and hide button
        comments = 0;
        score = 0;
      } else {
        let $score = $elementInfo.find(".score");
        score = Number($score.text().split(" ")[0]);
        comments = $subline.children().last().text();

        comments =
          comments === "discuss"
            ? 0
            : Number(
                comments.replace("comments", "").replace("comment", "").trim()
              ); // simply using a double replace here for "1 comment" or "2+ comments"
      }

      rank = Number(rank);
      elementId = Number(elementId);

      let numWords = title
        .replace(/[^a-zA-Z0-9 ]/g, "") // match NOT a-z, A-Z, 0-9, and space and replace with empty string
        .replace(/\s+/g, " ") // match one or more \s (whitespace), replace with single space
        .trim() // remove leading and trailing whitespace
        .split(" ").length;

      if (
        isNaN(rank) ||
        isNaN(elementId) ||
        isNaN(score) ||
        isNaN(comments) ||
        isNaN(numWords) ||
        !timeStamp
      ) {
        console.warn(`Invalid rank or elementId for element:`, {
          title,
          rank,
          elementId,
          link,
          comments,
          score,
          numWords,
          timeStamp,
          user,
        });
        throw new Error("Submission has unexpected values");
      }

      result.push({
        rank,
        title,
        link,
        score,
        comments,
        elementId,
        numWords,
        timeStamp,
        user,
      });
    });

    return result;
  } catch (error) {
    console.error(`Error crawling ${url}:`, error.message);
    throw new Error(`Failed to crawl ${url}: ${error.message}`);
  }
}

module.exports = { crawlWebsite };
