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

  // Fetch the user's profile and active subscriptions
  const [profileResponse, subscriptionsResponse] = await Promise.all([
    supabase.from("profiles").select("*").eq("id", session.user.id).single(),
    supabase.from("subscriptions").select("*").eq("user_id", session.user.id)
  ]);

  const profile = profileResponse.data;
  const dbSubscriptions = subscriptionsResponse.data || [];

  return (
    <main className="relative min-h-screen pt-32 pb-20 px-6 bg-white overflow-hidden">
      {/* Background Ambience */}
      <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-blue-500/[0.01] blur-[120px] rounded-full pointer-events-none"></div>
      
      <div className="max-w-7xl mx-auto relative z-10">
        <div className="mb-16">
          <h1 className="text-4xl font-bold tracking-tight mb-2 text-gray-900">
            System <span className="text-blue-500">Dashboard</span>
          </h1>
          <p className="text-[10px] text-gray-400 tracking-[0.5em] mb-12 uppercase font-bold">
            Orchestration Node & Operator Designation
          </p>
        </div>

        <DashboardClient 
          user={session.user} 
          initialProfile={profile} 
          dbSubscriptions={dbSubscriptions}
        />
      </div>
    </main>
  );
}
