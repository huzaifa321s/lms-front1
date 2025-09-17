import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from "recharts";

export default function PlansOverviewCard({ plans }) {
  const COLORS = [
  "#8b5cf6", // Violet / Indigo
  "#6366f1", // Indigo
  "#ec4899", // Pink
  "#facc15", // Amber / Yellow for contrast
  "#22d3ee"  // Cyan / Teal for additional plan if needed
];
 // Purple, Indigo, Pink

  return (
    <Card className="w-full rounded-2xl shadow-md bg-gradient-to-br from-indigo-50 via-white to-purple-50 border border-indigo-200">
      <CardHeader>
        <CardTitle className="text-lg font-bold text-indigo-700">
          📊 Plans Overview
        </CardTitle>
        <CardDescription className="text-sm text-gray-600">
          Distribution of student subscriptions across different plans.
        </CardDescription>
      </CardHeader>

      <CardContent className="h-62">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={plans}
              dataKey="value"
              nameKey="name"
              cx="50%"
              cy="50%"
              outerRadius={90}
              fill="#fff"
              label
            >
              {plans.map((_, i) => (
                <Cell key={i} fill={COLORS[i % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip />
            <Legend />
          </PieChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
