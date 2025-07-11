import DashboardCard from "@/components/DashboardCard";
import { useDashboardAnalytics } from "@/hooks/useDashboardAnalytics";
import { Users, DollarSign, Clock, UserCheck, UserPlus, CheckCircle, ListChecks } from "lucide-react";

export default function Home() {
  const { data, loading } = useDashboardAnalytics();

  const getColorByStatus = (status: string): "blue" | "green" | "purple" | "orange" | "red" | "yellow" => {
    const map: Record<string, "blue" | "green" | "purple" | "orange" | "red" | "yellow"> = {
      ASSIGNED: "blue",
      PENDING: "yellow",
      NEWLY_GENERATED: "green",
      CBL: "red",
      PAID: "purple",
    };
    return map[status] || "blue";
  };

  const primaryCards = [
    {
      title: "Total Leads",
      value:
        data?.leadStatusCounts.reduce(
          (acc, item) => acc + item._count.status,
          0
        ) || 0,
      color: "blue",
      icon: <Users className="w-7 h-7" />,
    },
    {
      title: "Revenue Today",
      value: `₹${data?.revenue?.value ?? 0}`,
      color: "green",
      icon: <DollarSign className="w-7 h-7" />,
    },
  ];

  const statusIconMap: Record<string, React.ReactNode> = {
    CBL: <Clock className="w-6 h-6" />,
    PENDING: <ListChecks className="w-6 h-6" />,
    NEWLY_GENERATED: <UserPlus className="w-6 h-6" />,
    PAID: <CheckCircle className="w-6 h-6" />,
    ASSIGNED: <UserCheck className="w-6 h-6" />,
  };

  const secondaryCards: { title: string; value: number; color: "blue" | "green" | "purple" | "orange" | "red" | "yellow"; icon: React.ReactNode; }[] =
    data?.leadStatusCounts.map((item) => ({
      title: item.status
        .replace(/_/g, " ")
        .toLowerCase()
        .replace(/\b\w/g, (c) => c.toUpperCase()),
      value: item._count.status,
      color: getColorByStatus(item.status) as "blue" | "green" | "purple" | "orange" | "red" | "yellow",
      icon: statusIconMap[item.status] || <Users className="w-6 h-6" />,
    })) || [];

  return (
    <div className="px-4 sm:px-8 py-6 w-full max-w-screen-2xl mx-auto">
      <h1 className="text-4xl font-bold mb-10 text-gray-900">Dashboard</h1>

      {loading ? (
        <p className="text-center text-gray-500">Loading dashboard...</p>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-12 gap-8 mb-10">
            {primaryCards.map((item, index) => (
              <div key={item.title} className="md:col-span-6">
                <DashboardCard
                  title={item.title}
                  value={item.value}
                  color={item.color}
                  icon={item.icon}
                />
              </div>
            ))}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {secondaryCards.map((item) => (
              <DashboardCard
                key={item.title}
                title={item.title}
                value={item.value}
                color={item.color}
                icon={item.icon}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
}
