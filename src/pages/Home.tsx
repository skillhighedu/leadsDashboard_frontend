import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

function DashboardCard({
  title,
  value,
  color,
}: {
  title: string;
  value: string | number;
  color: string;
}) {
  return (
    <Card className="transition-transform hover:scale-[1.03] shadow-md rounded-2xl min-h-[140px] min-w-[140px] flex flex-col justify-between">
      <CardHeader className="pb-2">
        <CardTitle className="text-md font-semibold text-gray-700">
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <p className={`text-4xl font-extrabold text-${color}-600`}>{value}</p>
      </CardContent>
    </Card>
  );
}

export default function Home() {
  // Sample data (replace with actual API data later)
  const dashboardData = {
    totalLeads: 150,
    newLeadsToday: 12,
    interestedLeads: 45,
    totalPaymentToday: "$1,230",
  };

  return (
    <div className="px-4 sm:px-8 py-6 w-full max-w-screen-2xl mx-auto">
      <h1 className="text-4xl font-bold mb-10 text-gray-900">Dashboard</h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
        <DashboardCard title="Total Leads" value={dashboardData.totalLeads} color="blue" />
        <DashboardCard title="New Leads Today" value={dashboardData.newLeadsToday} color="green" />
        <DashboardCard title="Interested Leads" value={dashboardData.interestedLeads} color="purple" />
        <DashboardCard title="Total Payment Today" value={dashboardData.totalPaymentToday} color="orange" />
      </div>
    </div>
  );
}
