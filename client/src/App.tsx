import { useEffect } from "react";
import "./App.css";

function App() {
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch("/api/data");
        const data = await response.json();
        console.log(data);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    fetchData();
  }, []);

  return <div></div>;
}

export default App;
