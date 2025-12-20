"use client";

import React, { useState, useEffect, useRef } from "react";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { X, Loader2, Mic } from "lucide-react";
import { VisuallyHidden } from "@radix-ui/react-visually-hidden";

interface TestFlowDialogProps {
  isOpen: boolean;
  onClose: () => void;
  flowId: string;
  apiKey: string;
  flowName: string;
}

interface Message {
  id: string;
  sender: "user" | "bot";
  text: string;
  timestamp: string;
  isInterim?: boolean;
}

export default function TestFlowDialog({
  isOpen,
  onClose,
  flowId,
  apiKey,
  flowName,
}: TestFlowDialogProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const chatEndRef = useRef<HTMLDivElement>(null);
  const voxioInstanceRef = useRef<any>(null);
  const originalWebSocketRef = useRef<any>(null);

  const [isInitializing, setIsInitializing] = useState(false);
  const [isListening, setIsListening] = useState(false);

  // Auto-scroll to bottom
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  useEffect(() => {
    let isMounted = true;

    if (isOpen) {
      // 1. Store the original WebSocket immediately
      if (!originalWebSocketRef.current) {
        originalWebSocketRef.current = window.WebSocket;
      }

      setMessages([]);
      setIsInitializing(true);

      // 2. Setup the listener BEFORE initializing the agent
      setupVoxioListeners();

      // 3. Dynamically import voxioagent (client-side only)
      import("voxioagent")
        .then((module) => {
          const { initVoxioAgent } = module;
          return initVoxioAgent({
            apiKey: apiKey,
            position: {
              bottom: "50px",
              right: "50px",
            },
          });
        })
        .then((instance: any) => {
          if (isMounted) {
            voxioInstanceRef.current = instance;
            setIsInitializing(false);
          } else {
            if (instance && instance.destroy) instance.destroy();
          }
        })
        .catch((err: any) => {
          console.error("Failed to initialize Voxio Agent:", err);
          if (isMounted) setIsInitializing(false);
        });
    }

    return () => {
      isMounted = false;
      // Optional: Restore WebSocket on cleanup if desired,
      // but usually safe to leave patched or handle via reload.
    };
  }, [isOpen, apiKey]);

  const setupVoxioListeners = () => {
    const OriginalWebSocket = originalWebSocketRef.current;
    if (typeof window === "undefined" || !OriginalWebSocket) return;

    // Monkey-patch WebSocket to intercept messages
    (window as any).WebSocket = function (
      url: string,
      protocols?: string | string[]
    ) {
      const ws = new OriginalWebSocket(url, protocols);

      ws.addEventListener("message", (event: MessageEvent) => {
        try {
          const rawData = event.data;
          // Ensure we are parsing a JSON string
          if (
            typeof rawData === "string" &&
            (rawData.startsWith("{") || rawData.startsWith("["))
          ) {
            const data = JSON.parse(rawData);

            // LOGGING: See exactly what hits the listener
            console.log("[TestFlowDialog] WS Data Intercepted:", data);

            // Check for user_input
            if (data.user_input) {
              console.log("-> Processing User Input:", data.user_input);
              addMessage("user", data.user_input);
            }

            // Check for 'speak'
            if (data.speak) {
              // Sometimes 'speak' might come with user_input as an echo, prevent double logging if needed.
              // But usually bot speaks separately.
              if (!data.user_input) {
                console.log("-> Processing Bot Speak:", data.speak);
                addMessage("bot", data.speak);
              }
            }
          }
        } catch (e) {
          // Silent catch for non-JSON messages
        }
      });

      return ws;
    };

    // Restore static properties to ensure library doesn't crash on checks
    (window as any).WebSocket.CONNECTING = OriginalWebSocket.CONNECTING;
    (window as any).WebSocket.OPEN = OriginalWebSocket.OPEN;
    (window as any).WebSocket.CLOSING = OriginalWebSocket.CLOSING;
    (window as any).WebSocket.CLOSED = OriginalWebSocket.CLOSED;
  };

  const addMessage = (sender: "user" | "bot", rawText: any) => {
    const text =
      typeof rawText === "object" ? JSON.stringify(rawText) : String(rawText);

    if (!text || text.trim() === "") return;

    const timestamp = new Date().toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
    });

    setMessages((prev) => {
      const filtered = prev.filter(
        (m) => !(m.isInterim && m.sender === sender)
      );

      const lastMsg = filtered[filtered.length - 1];
      if (lastMsg && lastMsg.sender === sender && lastMsg.text === text) {
        return prev;
      }

      const newMessage: Message = {
        id: `${sender}-${Date.now()}-${Math.random()}`,
        sender,
        text,
        timestamp,
        isInterim: false,
      };

      return [...filtered, newMessage];
    });
  };

  const handleInternalClose = () => {
    if (voxioInstanceRef.current && voxioInstanceRef.current.destroy) {
      try {
        voxioInstanceRef.current.destroy();
      } catch (e) {
        console.error("Error destroying instance", e);
      }
    }
    window.location.reload();
  };

  return (
    <Dialog
      open={isOpen}
      onOpenChange={(open) => {
        if (!open) handleInternalClose();
      }}
      modal={false}
    >
      {isOpen && (
        <div className="fixed inset-0 bg-black/80 z-40 animate-in fade-in duration-200" />
      )}

      <DialogContent
        className="z-50 p-0 gap-0 border-0 bg-transparent shadow-none sm:max-w-md outline-none [&>button]:hidden fixed top-[50%] left-[50%] translate-x-[-50%] translate-y-[-50%]"
        onPointerDownOutside={(e) => e.preventDefault()}
        onInteractOutside={(e) => e.preventDefault()}
      >
        <VisuallyHidden>
          <DialogTitle>Test Flow Chat</DialogTitle>
          <DialogDescription>
            Voice agent conversation interface for testing your flow
          </DialogDescription>
        </VisuallyHidden>

        <div className="bg-white dark:bg-slate-900 rounded-xl shadow-2xl w-full flex flex-col overflow-hidden h-[600px] border border-slate-200 dark:border-slate-800">
          <div className="bg-gradient-to-r from-indigo-600 to-indigo-700 text-white p-4 flex items-center justify-between shrink-0">
            <div className="flex items-center gap-3">
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center border-2 transition-all ${
                  isListening
                    ? "bg-red-500 border-red-400 animate-pulse"
                    : "bg-indigo-500 border-indigo-400"
                }`}
              >
                <Mic className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="font-semibold text-base">Test Flow Chat</h3>
                {isInitializing ? (
                  <div className="flex items-center gap-1 text-xs text-indigo-200">
                    <Loader2 className="h-3 w-3 animate-spin" />
                    Connecting Voice...
                  </div>
                ) : (
                  <p className="text-xs text-indigo-200">Voice Agent Active</p>
                )}
              </div>
            </div>

            <button
              onClick={handleInternalClose}
              className="text-white hover:bg-indigo-600 rounded-full p-2 transition"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto p-4 bg-gray-50 dark:bg-slate-950/50 scrollbar-thin scrollbar-thumb-gray-200">
            {messages.length === 0 ? (
              <div className="flex items-center justify-center h-full">
                <div className="text-center text-gray-400 dark:text-slate-500">
                  <Mic className="w-12 h-12 mx-auto mb-3 opacity-50" />
                  <p className="text-sm">
                    Click the voice button to start conversation
                  </p>
                  <p className="text-xs mt-1">
                    Your conversation will appear here
                  </p>
                </div>
              </div>
            ) : (
              messages.map((msg) => (
                <div
                  key={msg.id}
                  className={`mb-4 flex ${
                    msg.sender === "user" ? "justify-end" : "justify-start"
                  }`}
                >
                  <div
                    className={`max-w-[80%] ${
                      msg.sender === "user" ? "order-2" : "order-1"
                    }`}
                  >
                    <div
                      className={`rounded-2xl px-4 py-2.5 shadow-sm transition-opacity ${
                        msg.isInterim ? "opacity-60" : "opacity-100"
                      } ${
                        msg.sender === "user"
                          ? "bg-indigo-600 text-white rounded-br-none"
                          : "bg-white dark:bg-slate-800 text-gray-800 dark:text-slate-200 rounded-bl-none border border-gray-100 dark:border-slate-700"
                      }`}
                    >
                      <p className="text-sm leading-relaxed">{msg.text}</p>
                    </div>
                    <span
                      className={`text-[10px] text-gray-400 mt-1 block ${
                        msg.sender === "user" ? "text-right" : "text-left"
                      }`}
                    >
                      {msg.timestamp}
                    </span>
                  </div>
                </div>
              ))
            )}
            <div ref={chatEndRef} />
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
