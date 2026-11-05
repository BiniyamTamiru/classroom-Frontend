import { useGetIdentity } from "@refinedev/core";

import type { HomeIdentity } from "@/components/home/home-navigation";
import { DashboardContent } from "./dashboard-content";

export default function StudentDashboard() {
  const { data: identity } = useGetIdentity<HomeIdentity>();
  return <DashboardContent role="student" identity={identity} />;
}
