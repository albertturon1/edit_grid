import { Input } from "@/components/ui/input";
import { Route } from "@/routes/room.$roomId";
import { useEffect, useRef, useState } from "react";

export function RoomPage() {
  const { roomId } = Route.useParams();
  const [username, setUsername] = useState("");
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState<string[]>([]);
  const socketRef = useRef<WebSocket | null>(null);

  useEffect(() => {
    const storedId = localStorage.getItem("userId");
    const URL = `ws://localhost:8080/room/${roomId}?user_id=${storedId}`;

    console.log("URL: ", URL);

    const ws = new WebSocket(URL);
    socketRef.current = ws;

    ws.onopen = () => {
      console.log("WebSocket connection opened.");
    };

    ws.onmessage = (event) => {
      const msg = JSON.parse(event.data);
      setMessages((prevMessages) => [...prevMessages, msg]);
    };

    ws.onclose = () => {
      console.log("WebSocket connection closed.");
    };

    // Cleanup on unmount
    return () => {
      if (socketRef.current) {
        socketRef.current.close();
      }
    };
  }, []);

  const sendMessage = () => {
    if (socketRef.current && socketRef.current.readyState === WebSocket.OPEN) {
      const msg = {
        username: username,
        message: message,
      };
      socketRef.current.send(JSON.stringify(msg));
      setMessage(""); // Clear input after sending
    } else {
      console.error("WebSocket is not open.");
    }
  };

  return (
    <div>
      <h1>Real-time Chat</h1>
      <div className="flex flex-col gap-y-5">
        <div className="flex gap-x-5 place-items-center">
          <Input
            type="text"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
        </div>
        <Input
          placeholder="Message"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
        />
        <button type="button" onClick={sendMessage}>
          Send
        </button>
      </div>
      <div>
        {messages.map((msg, index) => (
          <div key={index}>
            <strong>{msg.username}</strong>: {msg.message}
          </div>
        ))}
      </div>
    </div>
  );
}
