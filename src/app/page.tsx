import { LoginDialog } from "@/components/login-dialog";
import { Toaster } from "@/components/ui/toaster";

export default function Home() {
  return (
    <main className="min-h-screen w-full">
      <LoginDialog />
      <Toaster />
    </main>
  );
}
