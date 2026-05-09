import { Dot, GroupIcon } from "lucide-react";
import { Button } from "@repo/ui/button";
import { useRouter } from "next/navigation";

const Header = ({
  slug,
  count,
  client,
  roomId,
}: {
  slug: string;
  count: number;
  client: WebSocket | null;
  roomId: string;
}) => {
  const router = useRouter();
  const leaveroom = () => {
    client?.send(
      JSON.stringify({
        type: "leave-room",
        roomId,
      }),
    );
    client?.close();
    router.push("/");
  };
  return (
    <div className="bg-gray-500 h-16 flex items-center justify-between px-6">
      <div className="flex gap-2">
        <GroupIcon />
        <div>
          <span>Room-</span>
          <span>{slug}</span>
        </div>
        <div className="flex">
          <Dot className="text-green-600" />
          <span>Active Users-</span>
          <span>{count}</span>
        </div>
      </div>
      <div>
        <Button variant="primary" onClick={leaveroom}>
          Leave Room
        </Button>
      </div>
    </div>
  );
};

export default Header;
