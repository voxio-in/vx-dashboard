import { useEffect, useRef } from "react";
// @ts-ignore
import { initVoxioAgent } from "voxioagent";

export default function VoxioWidget() {
  const initialized = useRef(false);

  useEffect(() => {
    if (initialized.current) return;

    const init = async () => {
      try {
        // Vite env vars use VITE_ prefix instead of NEXT_PUBLIC_
        const apiKey = import.meta.env.VITE_VOXIO_API_KEY;

        if (!apiKey) {
          console.warn("Voxio Agent: Missing VITE_VOXIO_API_KEY in .env.local");
          return;
        }

        await initVoxioAgent({
          apiKey: apiKey,
          position: {
            bottom: "50px",
            right: "50px",
          },
          floating: true,
        });

        initialized.current = true;
      } catch (error) {
        console.error("Failed to initialize Voxio Agent:", error);
      }
    };

    init();
  }, []);

  return null;
}
