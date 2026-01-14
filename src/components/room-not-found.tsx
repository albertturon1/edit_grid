import { useNavigate } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";

type RoomNotFoundProps = {
  error: string;
};

export function RoomNotFound({ error }: RoomNotFoundProps) {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col items-center justify-center h-screen gap-y-4">
      <h1 className="text-2xl font-bold">Room Not Found</h1>
      <p className="text-muted-foreground">{error}</p>
      <Button onClick={() => navigate({ to: "/room" })}>Go to Local Editing</Button>
    </div>
  );
}
