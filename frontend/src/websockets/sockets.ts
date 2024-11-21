import { useEffect, useState, useCallback, useRef } from "react";

export const WEBSOCKET_URL =
  process.env.NODE_ENV === "production" ? undefined : "ws://localhost:4000/ws";

export function useWebSocket({
  url,
  onMessage,
}: {
  url: string;
  onMessage?: (message: MessageEvent<any>) => void;
}) {
  const [socket, setSocket] = useState<WebSocket | null>(null);
  const [isConnected, setIsConnected] = useState(false);

  // Ref to track if WebSocket connection is already established
  const hasConnected = useRef(false);

  // Function to connect the WebSocket
  const connect = useCallback(() => {
    // Avoid reconnecting if already connected or connecting
    if (
      socket &&
      (socket.readyState === WebSocket.OPEN ||
        socket.readyState === WebSocket.CONNECTING)
    ) {
      console.log("WebSocket is already connecting or connected.");
      return;
    }

    if (hasConnected.current) {
      console.log("WebSocket is already connected.");
      return;
    }

    const ws = new WebSocket(url);

    ws.onopen = () => {
      console.log("Connected to the WebSocket server");
      setIsConnected(true);
      setSocket(ws);
      hasConnected.current = true; // Mark as connected
    };

    ws.onclose = () => {
      console.log("Disconnected from the WebSocket server");
      setIsConnected(false);
      setSocket(null);
      hasConnected.current = false; // Reset the connection state
    };

    ws.onerror = (error) => {
      console.error("WebSocket error:", error);
    };

    ws.onmessage = (message) => {
      console.log("Received from the server:", message.data);
      onMessage?.(message);
    };
  }, [url, socket]);

  // Function to disconnect the WebSocket
  const disconnect = useCallback(() => {
    if (socket) {
      socket.close();
      hasConnected.current = false; // Reset the connection state when disconnecting
    } else {
      console.warn("WebSocket wasn't connected.");
    }
  }, [socket]);

  return { connect, disconnect, socket, isConnected };
}
