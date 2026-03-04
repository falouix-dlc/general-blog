// AdminLayout.tsx (Server Component)
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import AdminSidebarClient from "@/components/admin/AdminSidebarClient";

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) redirect("/auth/login?redirectTo=/admin");

  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single();

  if (!profile || profile.role !== "admin") redirect("/");

  return (
    <div className="min-h-screen bg-gray-100 flex">
      {/* Mobile sidebar toggle handled inside client component */}
      <AdminSidebarClient user={user} />
      <main className="flex-1 p-8 overflow-auto">{children}</main>
    </div>
  );
}