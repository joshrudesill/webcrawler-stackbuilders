function sortAndFilter(data, sortBy, words, wordOperator, search) {
  let out = applyWordFilter(data, words, wordOperator);
  out = sortData(out, sortBy);
  out = applySearchFilter(out, search);
  return out;
}

function applyWordFilter(data, numWords, wordOperator) {
  if (wordOperator === "none") return data;

  return data.filter((item) => {
    const wordCountValue = numWords === "" ? 0 : Number(numWords);
    if (isNaN(wordCountValue)) {
      throw new Error("Invalid word count");
    }
    switch (wordOperator) {
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
}

function applySearchFilter(data, search) {
  if (!search) return data;
  return data.filter((item) =>
    item.title.toLowerCase().includes(search.toLowerCase())
  );
}

function sortData(data, sortBy) {
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
}

module.exports = { sortAndFilter };
