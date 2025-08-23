import { useEffect, useState } from "react";
import type { ServerStatusType } from "../types";

export default function ServerStatusIcon({
  status,
}: {
  status: ServerStatusType;
}) {
  const [color, setColor] = useState<string>("");

  useEffect(() => {
    switch (status) {
      case "Running":
        setColor("green");
        break;
      case "Down":
        setColor("red");
        break;
      case "Pinging":
        setColor("gray");
        break;
      case "Fetching":
        setColor("blue");
        break;
      default:
        setColor("gray");
    }
  }, [status]);

  return (
    <div className="flex items-center gap-2">
      <div>Status:</div>
      <div className="inline-flex items-center gap-1">
        <svg height="10" width="10" xmlns="http://www.w3.org/2000/svg">
          <circle cx="5" cy="5" r="4" fill={color} />
        </svg>
        {status}
      </div>
    </div>
  );
}
