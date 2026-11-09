import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <div className="flex-1 flex flex-col items-center justify-center p-8 text-center space-y-4">
      <h2 className="text-4xl font-black text-white font-mono">404</h2>
      <p className="text-sm text-zinc-400">Paddock zone not found or out of track bounds.</p>
      <Link href="/">
        <Button variant="racing" size="sm">
          Return to Pitlane
        </Button>
      </Link>
    </div>
  );
}
