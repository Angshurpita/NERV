import { createClient } from "@/utils/supabase/server";
import { DashboardClient } from "./DashboardClient";
import { redirect } from "next/navigation";

export default async function DashboardPage() {
  const supabase = await createClient();
  const {
    data: { session },
  } = await supabase.auth.getSession();
  
  if (!session?.user) {
    redirect("/auth/login");
  }

  // Fetch the user's profile
  const { data: profile } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", session.user.id)
    .single();

  return (
    <main className="relative min-h-screen pt-32 pb-20 px-6 bg-black overflow-hidden">
      {/* Background Ambience */}
      <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-emerald-500/[0.03] blur-[120px] rounded-full pointer-events-none"></div>
      
      <div className="max-w-7xl mx-auto relative z-10">
        <div className="mb-16">
          <h1 className="text-4xl font-black tracking-tighter mb-2 uppercase italic text-white/90">
            System <span className="text-emerald-400">Dashboard</span>
          </h1>
          <p className="text-[10px] text-white/20 tracking-[0.5em] mb-12 uppercase font-bold">
            Orchestration Node & Operator Designation
          </p>
        </div>

        <DashboardClient 
          user={session.user} 
          initialProfile={profile} 
        />
      </div>
    </main>
  );
}
