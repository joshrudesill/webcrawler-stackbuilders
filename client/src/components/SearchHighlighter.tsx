import { useEffect, useState } from "react";

export default function SearchHighlighter({
  needle,
  haystack,
}: {
  needle: string;
  haystack: string;
}) {
  if (!needle) return <>{haystack}</>;

  const [highlightedIndices, setHighlightedIndices] = useState<number[]>([]);

  function findAllIndices(haystack: string, needle: string) {
    const indices = [];
    let index = haystack.indexOf(needle);

    while (index !== -1) {
      indices.push(index);
      index = haystack.indexOf(needle, index + 1);
    }

    return indices;
  }

  useEffect(() => {
    let indices = findAllIndices(
      haystack.toLocaleLowerCase(),
      needle.toLocaleLowerCase()
    );
    let tempIndices = [];

    for (let i = 0; i < indices.length; i++) {
      let toPush = Array.from(
        { length: needle.length },
        (_, j) => indices[i] + j
      );
      tempIndices.push(...toPush);
    }
    indices.push(...tempIndices);

    setHighlightedIndices([...indices]);
  }, [needle, haystack]);

  return (
    <>
      {haystack.split("").map((char, index) => {
        if (highlightedIndices.includes(index)) {
          return (
            <span key={index} className="bg-yellow-200">
              {char}
            </span>
          );
        } else {
          return <>{char}</>;
        }
      })}
    </>
  );
}
