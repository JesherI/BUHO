import { Suspense } from "react";
import ChatContent from "./ChatContent";
import OfflineGate from "../components/OfflineGate";

export default function ChatPage() {
  return (
    <Suspense fallback={<div className="flex items-center justify-center h-screen bg-black text-white">Cargando...</div>}>
      <OfflineGate>
        <ChatContent />
      </OfflineGate>
    </Suspense>
  );
}
