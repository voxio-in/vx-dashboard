"use client";

import { useEffect, useRef } from "react";
// @ts-ignore - Ignoring type check in case the package lacks type definitions
import { initVoxioAgent } from "voxioagent";

export default function VoxioWidget() {
  const initialized = useRef(false);

  useEffect(() => {
    if (initialized.current) return;

    const init = async () => {
      try {
        const apiKey = process.env.NEXT_PUBLIC_VOXIO_API_KEY;

        if (!apiKey) {
          console.warn(
            "Voxio Agent: Missing NEXT_PUBLIC_VOXIO_API_KEY in .env"
          );
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
