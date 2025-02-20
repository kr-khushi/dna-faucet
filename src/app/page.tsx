import SendToken from "@/components/SendToken";
import { MiniAppButton } from "@/components/MiniAppButton";

export default function Home() {
  return (
    <div className="flex flex-col gap-4">
      <SendToken />
      <MiniAppButton />
    </div>
  );
}
