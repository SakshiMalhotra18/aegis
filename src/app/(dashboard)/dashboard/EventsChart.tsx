"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

const chartData = [
  { day: "Mon", events: 4 },
  { day: "Tue", events: 7 },
  { day: "Wed", events: 3 },
  { day: "Thu", events: 9 },
  { day: "Fri", events: 6 },
  { day: "Sat", events: 2 },
  { day: "Sun", events: 11 },
];

export function EventsChart() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base font-semibold">Governance Events — Last 7 Days</CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={280}>
          <AreaChart data={chartData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
            <XAxis dataKey="day" tick={{ fontSize: 12 }} />
            <YAxis tick={{ fontSize: 12 }} />
            <Tooltip />
            <Area
              type="monotone"
              dataKey="events"
              stroke="#6366f1"
              fill="#6366f1"
              fillOpacity={0.2}
              strokeWidth={2}
            />
          </AreaChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
