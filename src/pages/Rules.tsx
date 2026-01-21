import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";


const roleRules = [
  {
    role: "Vertical Manager",
    permissions: [
      "Can upload leads using the designated Excel format.",
      "Can assign leads to any team.",
      "Can delete leads only if they are not assigned to any team",
      "Cannot edit lead status or ticket fields (upfront fee, remaining fee)",
      "Cannot assign leads directly to individual team members — only to team-level",
      "Can apply for leave using the leave application system.",
    ],
  },
  {
    role: "Executive",
    permissions: [
      "Can upload leads using the designated Excel format",
      "Can assign leads to own team members or to self.",
      "Can edit lead status and ticket fields (upfront fee, remaining fee).",
      "Can delete unassigned leads (leads not yet allocated to a team).",
      "Acts as a Team Lead, responsible for managing internal team operations.",
      "Can apply for leave using the leave application system.",
    ],
  },
  {
    role: "Intern",
    permissions: [
      "Cannot upload leads.",
      "Can edit lead status and ticket fields (upfront fee, remaining fee).",
      "Cannot delete leads, regardless of assignment status.",
      "Acts as a Team Member, responsible for managing own leads.",
      "Can apply for leave using the leave application system.",
    ],
  },
  {
    role: "OPS Team",
    permissions: [
        "Can update lead status (e.g., move a lead from pending to paid ).",
        "Can view the analytics dashboard, including lead counts by status (PAID, PENDING) and total revenue from PAID leads.",
      "Cannot upload leads",
      "Cannot assign leads to own team members or to self.",
      "Cannot update ticket fields (upfront or remaining fee).",
      "Cannot delete leads, regardless of assignment status.",
      "Can apply for leave using the leave application system.",
    ],
  },
  {
    role: "HR",
    permissions: [
      "Can view staff login records, filterable by date (today, yesterday, or a specific date).",
      "Can update login status for any staff member within 3 days of the original work date.",
      "Can approve or reject leave applications submitted by other employees.",
      "Cannot upload, assign, or delete leads — no access to lead management",
      "Can apply for leave using the leave application system.",
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
"Employees cannot log in on a day for which they have an approved full-day leave.",
];

export default function Rules() {
  return (
    <div className="max-w-8xl mx-auto py-10 px-4 space-y-6">
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