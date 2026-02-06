import { initVoxioAgent } from "voxioagent";
import { useEffect } from "react";

const API_KEY = process.env.REACT_APP_VOXIO_API_KEY || "";

export default function App() {
  useEffect(() => {
    (async () => {
      await initVoxioAgent({
        apiKey: API_KEY,
        floating: true,
        holdable: true,
        draggable: true,
        position: {
          bottom: "50px",
          right: "50px",
        },
      });
    })();
  }, []);

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontFamily: "Arial, sans-serif",
      }}
    >
      <h1>Voice Agent is Ready - Click the icon to start!</h1>
    </div>
  );
}
