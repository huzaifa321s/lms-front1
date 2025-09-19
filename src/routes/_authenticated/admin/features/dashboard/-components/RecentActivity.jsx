
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { User, BookOpen, Star, CreditCard } from "lucide-react"

// ----- Dummy Data (replace later) -----
const activities = [
  { id: 1, type: "course",  message: "New course “React Basics” created",  time: "2h ago" },
  { id: 2, type: "teacher", message: "Teacher Sarah joined the platform",  time: "5h ago" },
  { id: 3, type: "student", message: "Ali enrolled in “Node.js Mastery”",  time: "1d ago" },
  { id: 4, type: "payment", message: "Payment of $120 received from Ahmad", time: "2d ago" },
  { id: 5, type: "course",  message: "Quiz added to “MongoDB Crash Course”", time: "3d ago" },
];

const enrollments = [
  { id: 1, studentName: "Ali Khan",      courseName: "React Basics",            date: "Aug 21, 2025" },
  { id: 2, studentName: "Sara Ahmed",    courseName: "Python for Beginners",    date: "Aug 20, 2025" },
  { id: 3, studentName: "Bilal Hussain", courseName: "UI/UX Design",            date: "Aug 19, 2025" },
  { id: 4, studentName: "Maryam Fatima", courseName: "MongoDB Crash Course",    date: "Aug 18, 2025" },
  { id: 5, studentName: "Hamza Ali",     courseName: "JavaScript Advanced",     date: "Aug 18, 2025" },
];

// ----- Helpers -----
const typeMeta = {
  course:  { icon: BookOpen,  label: "Course",  color: "#2563eb" }, // Primary Blue
  teacher: { icon: User,      label: "Teacher", color: "#10b981" }, // Success Green
  student: { icon: User,      label: "Student", color: "#f59e0b" }, // Warning Yellow
  payment: { icon: CreditCard,label: "Payment", color: "#ef4444" }, // Danger Red
  feedback:{ icon: Star,      label: "Feedback",color: "#2563eb" }, // Primary Blue
};

function GradientBorderCard({ title, children }) {
  return (
    <div className="rounded-[12px] p-[2px] bg-gradient-to-r from-[#2563eb] to-[#1d4ed8] shadow-[0_4px_10px_rgba(37,99,235,0.2)]">
      <Card className="rounded-[10px] bg-white border border-[#e2e8f0] shadow-sm">
        <CardHeader className="pb-2">
          <CardTitle className="text-lg md:text-xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-[#2563eb] to-[#1d4ed8]">
            {title} (Demo Feature)
          </CardTitle>
        </CardHeader>
        <CardContent>{children}</CardContent>
      </Card>
    </div>
  );
}

function RecentActivityCard() {
  return (
    <GradientBorderCard title="Recent Activity">
      <ScrollArea className="h-[320px] pr-3">
        <ul className="space-y-4">
          {activities.map((a) => {
            const Icon = (typeMeta[a.type]?.icon) || User;
            const label = (typeMeta[a.type]?.label) || "Activity";
            const color = (typeMeta[a.type]?.color) || "#2563eb";
            return (
              <li
                key={a.id}
                className="group flex items-start gap-3 rounded-[8px] p-3 transition-all hover:bg-[#f8fafc] hover:shadow-inner"
              >
                {/* Icon */}
                <div className="shrink-0 grid place-items-center h-10 w-10 rounded-full bg-gradient-to-br from-[#2563eb] to-[#1d4ed8] text-white shadow-md">
                  <Icon className="h-5 w-5" />
                </div>

                {/* Content */}
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <Badge
                      variant="outline"
                      className="border-[#e2e8f0] text-[#1e293b] bg-[#f1f5f9]"
                    >
                      {label}
                    </Badge>
                    <span className="text-xs text-[#94a3b8]">{a.time}</span>
                  </div>
                  <p className="mt-1 text-sm font-medium text-[#1e293b]">
                    {a.message}
                  </p>
                </div>
              </li>
            );
          })}
        </ul>
      </ScrollArea>
    </GradientBorderCard>
  );
}

function LatestEnrollmentsCard() {
  return (
    <GradientBorderCard title="Latest Enrollments">
      <ScrollArea className="h-[320px] pr-3">
        <ul className="space-y-4">
          {enrollments.map((e) => {
            const initials = e.studentName.split(" ").map(s => s[0]).slice(0,2).join("").toUpperCase();
            return (
              <li
                key={e.id}
                className="group flex items-center gap-3 rounded-[8px] p-3 transition-all hover:bg-[#f8fafc] hover:shadow-inner"
              >
                <Avatar className="h-10 w-10 ring-2 ring-[#e2e8f0] shadow-sm">
                  <AvatarFallback className="bg-gradient-to-br from-[#2563eb] to-[#1d4ed8] text-white font-semibold">
                    {initials}
                  </AvatarFallback>
                </Avatar>

                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-[#1e293b] truncate">{e.studentName}</p>
                  <p className="text-xs text-[#2563eb] truncate">{e.courseName}</p>
                </div>

                <span className="text-xs text-[#94a3b8]">{e.date}</span>
              </li>
            );
          })}
        </ul>
      </ScrollArea>
    </GradientBorderCard>
  );
}

export default function DashboardActivitySection() {
  return (
    <section className="w-full">
      {/* Responsive 2-column: stacks on small, side-by-side on lg+ */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <RecentActivityCard />
        <LatestEnrollmentsCard />
      </div>
    </section>
  );
}
