
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

const roleRules = [
  {
    role: "ADMIN",
    permissions: [
      "Can view and manage all leads and teams",
      "Can upload leads and assign to any team",
      "Access to full analytics and revenue reports",
      "Can create/update users, teams, and configurations",
    ],
  },
  {
    role: "LEAD_MANAGER",
    permissions: [
      "Can view leads assigned to their team",
      "Can upload leads for their own team",
      "Can assign leads to team members",
      "Can update ticket amount, fee, and lead status",
    ],
  },
  {
    role: "TEAM_MEMBER",
    permissions: [
      "Can only view and update their own leads",
      "Can change lead status (e.g., PENDING → IN_PROGRESS → COMPLETED)",
      "Cannot reassign leads or edit ticket amount",
    ],
  },
];

const operationalRules = [
  "Leads must be updated within 24 hours of assignment",
  "Once a lead is marked COMPLETED, it cannot be edited",
  "Ticket amount changes must be approved by a lead manager",
  "Only ADMIN can delete a lead permanently",
  "Statuses must follow: PENDING → IN_PROGRESS → COMPLETED/REJECTED",
  "Revenue is calculated only from COMPLETED + PAID leads",
];

export default function Rules() {
  return (
    <div className="max-w-4xl mx-auto py-10 px-4 space-y-6">
      <h1 className="text-3xl font-bold text-primary">Platform Rules & Permissions</h1>
      <p className="text-muted-foreground text-sm">
        These rules govern how users interact with leads, teams, and revenue on the CRM.
      </p>

      <Separator />

      <div className="space-y-4">
        {roleRules.map((rule) => (
          <Card key={rule.role} className="border">
            <CardHeader>
              <CardTitle className="text-xl font-semibold">{rule.role} Permissions</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="list-disc pl-5 space-y-1 text-sm text-foreground">
                {rule.permissions.map((p, i) => (
                  <li key={i}>{p}</li>
                ))}
              </ul>
            </CardContent>
          </Card>
        ))}
      </div>

      <Separator />

      <Card className="border">
        <CardHeader>
          <CardTitle className="text-xl font-semibold">General Operational Rules</CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="list-decimal pl-5 space-y-1 text-sm text-foreground">
            {operationalRules.map((r, i) => (
              <li key={i}>{r}</li>
            ))}
          </ul>
        </CardContent>
      </Card>
    </div>
  );
}
