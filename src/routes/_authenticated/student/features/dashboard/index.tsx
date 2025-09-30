import { useQuery, useSuspenseQuery } from '@tanstack/react-query';
import { IconLock } from '@tabler/icons-react';
import {
  BookOpen,
  CheckSquare,
  CreditCard,
  DollarSign,
  ShieldCheck,
  UserCog,
  TrendingUp,
  Calendar,
  Award,
  Lock,
  Settings,
  User,
} from 'lucide-react';
import { useSelector } from 'react-redux';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Header } from '@/components/layout/header';
import { Main } from '@/components/layout/main';
import { TopNav } from '@/components/layout/top-nav';
import { Search } from '@/components/search';
import { dashboardQueryOption } from '../..';
import { useAppUtils } from '../../../../../hooks/useAppUtils';
import { openModal } from '../../../../../shared/config/reducers/student/studentDialogSlice';
import { ProfileDropdown } from '../tasks/-components/student-profile-dropdown';
import { ChartBarLabelCustom } from './-components/spendingByYear';
import { memo, useCallback, useMemo } from 'react';
import CountUp from 'react-countup'

// Memoized MiniBarChart
const MiniBarChart = memo(({ data, color = '#2563eb' }) => {
  const maxValue = useMemo(() => Math.max(...data), [data]);
  return (
    <div className="flex h-8 items-end gap-1">
      {data.map((value, index) => (
        <div
          key={index}
          className="w-2 rounded-t-sm transition-all duration-300 hover:opacity-80"
          style={{
            height: maxValue ? `${(value / maxValue) * 100}%` : '4px',
            backgroundColor: color,
            minHeight: '4px',
          }}
        />
      ))}
    </div>
  );
});
MiniBarChart.displayName = 'MiniBarChart';

// Memoized MiniLineChart
const MiniLineChart = memo(({ data, color = '#10b981' }) => {
  const maxValue = useMemo(() => Math.max(...data), [data]);
  const points = useMemo(
    () =>
      data
        .map(
          (value, index) =>
            `${(index / (data.length - 1)) * 100},${30 - (value / maxValue) * 25}`
        )
        .join(' '),
    [data, maxValue]
  );

  return (
    <div className="relative h-8 w-full">
      <svg className="h-full w-full" viewBox="0 0 100 30">
        <polyline fill="none" stroke={color} strokeWidth="2" points={points} />
        {data.map((value, index) => (
          <circle
            key={index}
            cx={(index / (data.length - 1)) * 100}
            cy={30 - (value / maxValue) * 25}
            r="2"
            fill={color}
          />
        ))}
      </svg>
    </div>
  );
});
MiniLineChart.displayName = 'MiniLineChart';

// Memoized MiniDonutChart
const MiniDonutChart = memo(({ percentage, color = '#f59e0b' }) => {
  const circumference = 2 * Math.PI * 16;
  const strokeDasharray = `${(percentage / 100) * circumference} ${circumference}`;

  return (
    <div className="relative h-12 w-12">
      <svg className="h-12 w-12 -rotate-90 transform">
        <circle
          cx="24"
          cy="24"
          r="16"
          stroke="#e5e7eb"
          strokeWidth="3"
          fill="transparent"
        />
        <circle
          cx="24"
          cy="24"
          r="16"
          stroke={color}
          strokeWidth="3"
          fill="transparent"
          strokeDasharray={strokeDasharray}
          strokeLinecap="round"
        />
      </svg>
      <div className="absolute inset-0 flex items-center justify-center">
        <span className="text-xs font-semibold">{percentage}%</span>
      </div>
    </div>
  );
});
MiniDonutChart.displayName = 'MiniDonutChart';

function WelcomeBanner({ userName ,creds }) {
  return (
    <div className="relative bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-3xl overflow-hidden p-8 mb-8 shadow-lg">
      {/* Floating Decorative Circles */}
      <div className="absolute -top-16 -left-16 w-56 h-56 bg-blue-400/20 rounded-full filter blur-3xl animate-[spin_25s_linear_infinite]"></div>
      <div className="absolute -bottom-16 -right-16 w-72 h-72 bg-blue-500/20 rounded-full filter blur-3xl animate-[spin_30s_linear_infinite]"></div>

      <div className="relative z-10 flex flex-col md:flex-row items-center md:justify-between gap-6">
        <div className="text-center md:text-left">
          <h1 className="text-3xl md:text-4xl font-bold mb-2">
            Welcome {creds?.customerId ? "back" : ""}, <span className="text-blue-200">{userName}</span> 👋
          </h1>
          <p className="text-blue-100 text-lg max-w-lg">
            Track your learning progress, explore new courses, and unlock premium features.
          </p>
        </div>
        <div className="flex gap-4">
          {/* Settings Button */}
          <Button
            size=""
            className="bg-gradient-to-r from-blue-500 to-blue-600 shadow-lg hover:from-blue-600 hover:to-blue-700 transition-all flex items-center gap-2"
          >
            <Settings className="h-5 w-5" />
            Settings
          </Button>

          {/* Profile Button */}
          <Button
            size=""
            variant="outline"
            className="bg-white/20 transition-all flex items-center gap-2"
          >
            <User className="h-5 w-5" />
            My Profile
          </Button>
        </div>
      </div>
    </div>
  )
}

export default function Dashboard() {
  const { dispatch, navigate } = useAppUtils();
  const { data } = useQuery({
    ...dashboardQueryOption(),
    staleTime: 5 * 60 * 1000,
    suspense:true
  });
  const {
    enrolledCourses,
    totalCharges,
    paymentMethods,
    courseTeachers,
    spendingByYear,
  } = data;
  const credentials = useSelector((state) => state.studentAuth.credentials);
  const subscription = useSelector((state) => state.studentAuth.subscription);

  // Memoized subscription status check
  const isSubscribed = useMemo(
    () =>
      subscription?.subscriptionId &&
      (subscription?.status === 'active' || subscription?.status === 'pending'),
    [subscription]
  );

  // Memoized data arrays
  const courseProgressData = useMemo(() => [65, 78, 82, 90, 85, 92, 88], []);
  const spendingTrendData = useMemo(() => [120, 150, 180, 160, 200, 250, 220], []);
  const quizScoreData = useMemo(() => [85, 90, 78, 95, 88, 92, 96], []);
  const teacherTrendData = useMemo(() => [3, 5, 4, 6, 5, 7, 6], []);

  // Memoized event handlers
  const handleViewTeachers = useCallback(() => {
    if (isSubscribed) {
      navigate({
        to: '/student/course-teachers/',
        search: { courseTeachers: JSON.stringify(courseTeachers) },
      });
    } else {
      dispatch(
        openModal({
          type: 'subscription-modal',
          props: {
            title: 'Subscribe to view teachers',
            redirect: '/student/course-teachers',
            courseTeachers,
          },
        })
      );
    }
  }, [isSubscribed, navigate, dispatch, courseTeachers]);

  const handleViewSpending = useCallback(() => {
    dispatch(
      openModal({
        type: 'subscription-modal',
        props: {
          title: 'Subscribe to view spendings',
          redirect: '/student',
        },
      })
    );
  }, [dispatch]);

  const handleViewPaymentMethods = useCallback(() => {
    if (isSubscribed) {
      navigate({ to: '/student/payment-methods' });
    } else {
      dispatch(
        openModal({
          type: 'subscription-modal',
          props: {
            title: 'Subscribe to view methods',
            redirect: '/student/payment-methods',
          },
        })
      );
    }
  }, [isSubscribed, navigate, dispatch]);

  const handleManagePlan = useCallback(() => {
    if (isSubscribed && subscription?.status === 'active') {
      navigate({ to: '/student/settings/billing' });
    } else if (subscription?.status === 'pending') {
      dispatch(
        openModal({
          type: 'activate-subscription-modal',
          props: { redirect: '/student' },
        })
      );
    } else {
      dispatch(
        openModal({
          type: 'subscription-modal',
          props: {
            title: 'Subscribe to view spendings',
            redirect: '/student',
          },
        })
      );
    }
  }, [isSubscribed, subscription?.status, navigate, dispatch]);

  return (
    <div className="flex flex-col min-h-screen">
      <Header>
        <TopNav links={topNav} />
        <div className="ml-auto flex items-center space-x-4">
          <Search />
          <ProfileDropdown />
        </div>
      </Header>
      <Main className="flex-grow">
          <WelcomeBanner userName={credentials?.firstName + " " + credentials?.lastName} creds={credentials} />
        <Tabs orientation="vertical" defaultValue="overview" className="space-y-4">
          <div className="w-full overflow-x-auto ">
            <TabsList className="border border-gray-200 bg-white shadow-sm">
              <TabsTrigger
                value="overview"
                className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-500 data-[state=active]:to-blue-600 data-[state=active]:text-white"
              >
                Overview
              </TabsTrigger>
              <TabsTrigger
                value="analytics"
                className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-green-500 data-[state=active]:to-green-600 data-[state=active]:text-white"
              >
                Analytics
              </TabsTrigger>
              <TabsTrigger value="reports" disabled>
                Activity Log (Dummy)
              </TabsTrigger>
              <TabsTrigger value="notifications" disabled>
                Notifications (Dummy)
              </TabsTrigger>
            </TabsList>
          </div>

          <TabsContent value="overview" className="space-y-2">
            <div className="space-y-2 text-center">
              <h1 className="bg-gradient-to-r from-[#2563eb] to-[#1d4ed8] bg-clip-text text-3xl font-bold text-transparent">
                Student Dashboard
              </h1>
              <p className="font-medium text-gray-600">
                Track your learning progress and achievements
              </p>
            </div>

            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {/* Enrolled Courses Card */}
              <Card className="group relative overflow-hidden border border-blue-100 bg-gradient-to-br from-white to-blue-50/30 shadow-sm transition-all duration-300 hover:scale-[1.02] hover:shadow-md">
                <CardHeader className="pb-2">
                  <div className="flex items-center gap-2">
                    <div className="rounded-lg bg-blue-100 p-2">
                      <BookOpen className="h-4 w-4 text-blue-600" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-600">Enrolled Courses</p>
                      <p className="text-2xl font-bold text-blue-600"><CountUp end={enrolledCourses || 0}className="counter-value inline-block" /> </p>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="pt-0">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <MiniBarChart data={courseProgressData} color="#2563eb" />
                    </div>
                    <div className="ml-2 text-right">
                      <p className="text-xs text-gray-500">Progress</p>
                      <p className="text-sm font-semibold text-green-600">+12%</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Course Teachers Card */}
              <Card className="group relative overflow-hidden border border-green-100 bg-gradient-to-br from-white to-green-50/30 shadow-sm transition-all duration-300 hover:scale-[1.02] hover:shadow-md">
                <CardHeader className="">
                  <div className="flex items-center gap-2">
                    <div className="rounded-lg bg-green-100 p-2">
                      <UserCog className="h-4 w-4 text-green-600" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-600">Teachers</p>
                      <p className="text-2xl font-bold text-green-600"><CountUp end={courseTeachers?.length || 0}className="counter-value inline-block" /></p>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="pt-0">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <MiniLineChart data={teacherTrendData} color="#10b981" />
                    </div>
                    <Button
                      size="sm"
                      variant="outline"
                      className="h-6 border-green-200 bg-transparent px-2 py-1 text-xs text-green-700 hover:bg-green-50"
                      onClick={handleViewTeachers}
                    >
                      View
                    </Button>
                  </div>
                </CardContent>
              </Card>

              {/* Quiz Attempts Card */}
              <Card className="group relative overflow-hidden border border-yellow-100 bg-gradient-to-br from-white to-yellow-50/30 shadow-sm transition-all duration-300 hover:scale-[1.02] hover:shadow-md">
                <CardHeader className="pb-2">
                  <div className="flex items-center gap-2">
                    <div className="rounded-lg bg-yellow-100 p-2">
                      <CheckSquare className="h-4 w-4 text-yellow-600" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-600">
                        Quiz Score <span className="rounded-md bg-gray-800 px-2 py-1 text-sm font-medium text-white">Demo Feature</span>
                      </p>
                      <p className="text-2xl font-bold text-yellow-600"><CountUp end={87}className="counter-value inline-block" />%</p>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="pt-0">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <MiniBarChart data={quizScoreData} color="#f59e0b" />
                    </div>
                    <div className="ml-2 text-right">
                      <p className="text-xs text-gray-500">Avg Score</p>
                      <p className="text-sm font-semibold text-yellow-600"><CountUp end={87}className="counter-value inline-block" />%</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Progress Card */}
              <Card className="group relative overflow-hidden border border-purple-100 bg-gradient-to-br from-white to-purple-50/30 shadow-sm transition-all duration-300 hover:scale-[1.02] hover:shadow-md">
                <CardHeader className="pb-2">
                  <div className="flex items-center gap-2">
                    <div className="rounded-lg bg-purple-100 p-2">
                      <Award className="h-4 w-4 text-purple-600" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-600">
                        Overall Progress <span className="rounded-md bg-gray-800 px-2 py-1 text-sm font-medium text-white">Demo Feature</span>
                      </p>
                      <p className="text-2xl font-bold text-purple-600"><CountUp end={73}className="counter-value inline-block" />%</p>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="pt-0">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="h-2 w-full rounded-full bg-gray-200">
                        <div
                          className="h-2 rounded-full bg-gradient-to-r from-purple-500 to-purple-600 transition-all duration-500"
                          style={{ width: '73%' }}
                        ></div>
                      </div>
                    </div>
                    <MiniDonutChart percentage={73} color="#9333ea" />
                  </div>
                </CardContent>
              </Card>
            </div>

            <Separator className="opacity-20" />

            <div className="py-2 text-center">
              <div className="inline-flex items-center gap-2 rounded-full border border-blue-200 bg-gradient-to-r from-blue-50 to-purple-50 px-4 py-2 shadow-sm">
                <div className="h-2 w-2 animate-pulse rounded-full bg-gradient-to-r from-blue-500 to-purple-500"></div>
                <p className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text font-semibold text-transparent">
                  Premium Features
                </p>
                <div className="h-2 w-2 animate-pulse rounded-full bg-gradient-to-r from-blue-500 to-purple-500"></div>
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {/* Spendings Card */}
              <Card className="group relative overflow-hidden border border-blue-100 bg-gradient-to-br from-white to-blue-50/30 shadow-sm transition-all duration-300 hover:scale-[1.02] hover:shadow-md">
                <CardHeader className="pb-2">
                  <div className="flex items-center gap-2">
                    <div className="rounded-lg bg-blue-100 p-2">
                      <DollarSign className="h-4 w-4 text-blue-600" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-600">Total Spending</p>
                      {isSubscribed ? (
                        <p className="text-2xl font-bold text-blue-600">${<CountUp end={totalCharges}className="counter-value inline-block" />}</p>
                      ) : (
                        <div className="flex items-center gap-1">
                          <IconLock className="h-4 w-4 text-gray-400" />
                          <p className="text-sm text-gray-500">Locked</p>
                        </div>
                      )}
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="pt-0">
                  {isSubscribed ? (
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <MiniLineChart data={spendingTrendData} color="#2563eb" />
                      </div>
                      <div className="ml-2 text-right">
                        <p className="text-xs text-gray-500">This Month</p>
                        <p className="text-sm font-semibold text-green-600">+8%</p>
                      </div>
                    </div>
                  ) : (
                    <Button
                      size="sm"
                      variant="outline"
                      className="w-full border-blue-200 bg-transparent text-xs text-blue-700 hover:bg-blue-50"
                      onClick={handleViewSpending}
                    >
                      <Lock className="mr-1 h-3 w-3" />
                      View
                    </Button>
                  )}
                </CardContent>
              </Card>

              {/* Payment Methods Card */}
              <Card className="group relative overflow-hidden border border-green-100 bg-gradient-to-br from-white to-green-50/30 shadow-sm transition-all duration-300 hover:scale-[1.02] hover:shadow-md">
                <CardHeader className="pb-2">
                  <div className="flex items-center gap-2">
                    <div className="rounded-lg bg-green-100 p-2">
                      <CreditCard className="h-4 w-4 text-green-600" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-600">Payment Methods</p>
                      {isSubscribed ? (
                        <p className="text-2xl font-bold text-green-600">{<CountUp end={paymentMethods?.length || 0}className="counter-value inline-block" />}</p>
                      ) : (
                        <div className="flex items-center gap-1">
                          <IconLock className="h-4 w-4 text-gray-400" />
                          <p className="text-sm text-gray-500">Locked</p>
                        </div>
                      )}
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="pt-0">
                  <Button
                    size="sm"
                    variant="outline"
                    className="w-full border-green-200 bg-transparent text-xs text-green-700 hover:bg-green-50"
                    onClick={handleViewPaymentMethods}
                  >
                    {isSubscribed ? (
                      <>
                        <CreditCard className="mr-1 h-3 w-3" />
                        View Methods
                      </>
                    ) : (
                      <>
                        <Lock className="mr-1 h-3 w-3" />
                        View
                      </>
                    )}
                  </Button>
                </CardContent>
              </Card>

              {/* Active Plan Card */}
              <Card className="group relative overflow-hidden border border-yellow-100 bg-gradient-to-br from-white to-yellow-50/30 shadow-sm transition-all duration-300 hover:scale-[1.02] hover:shadow-md lg:col-span-2">
                <CardHeader className="pb-2">
                  <div className="flex items-center gap-2">
                    <div className="rounded-lg bg-yellow-100 p-2">
                      <ShieldCheck className="h-4 w-4 text-yellow-600" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-600">Active Plan</p>
                      {isSubscribed ? (
                        <p className="text-lg font-bold text-yellow-600">{subscription?.name || 'N/A'}</p>
                      ) : (
                        <div className="flex items-center gap-1">
                          <IconLock className="h-4 w-4 text-gray-400" />
                          <p className="text-sm text-gray-500">No Active Plan</p>
                        </div>
                      )}
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="pt-0">
                  {isSubscribed && subscription?.status === 'active' ? (
                    <>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <p className="text-xs text-gray-500">Renews on</p>
                          <p className="text-sm font-semibold">
                            {subscription?.currentPeriodEnd
                              ? new Date(subscription.currentPeriodEnd * 1000).toLocaleDateString('en-US')
                              : 'N/A'}
                          </p>
                        </div>
                        <div>
                          <p className="text-xs text-gray-500">Status</p>
                          <span className="inline-flex items-center rounded-full bg-green-100 px-2 py-1 text-xs font-medium text-green-800">
                            {subscription?.status?.toUpperCase() || 'N/A'}
                          </span>
                        </div>
                      </div>
                      <Button
                        size="sm"
                        variant="outline"
                        className="mt-2 w-full border-yellow-200 bg-transparent text-xs text-yellow-700 hover:bg-yellow-50"
                        onClick={handleManagePlan}
                      >
                        <ShieldCheck className="mr-1 h-3 w-3" />
                        Manage Plan
                      </Button>
                    </>
                  ) : (
                    <Button
                      size="sm"
                      variant="outline"
                      className="w-full border-yellow-200 bg-transparent text-xs text-yellow-700 hover:bg-yellow-50"
                      onClick={handleManagePlan}
                    >
                      <Lock className="mr-1 h-3 w-3" />
                      Manage Plan
                    </Button>
                  )}
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="analytics" className="space-y-2">
            <div className="space-y-2 text-center">
              <h1 className="bg-gradient-to-r from-green-600 via-emerald-600 to-green-500 bg-clip-text text-3xl font-bold text-transparent">
                Analytics Dashboard
              </h1>
              <p className="font-medium text-gray-600">Detailed insights into your learning journey</p>
            </div>

            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {/* Performance Trends */}
              <Card className="border border-green-100 bg-gradient-to-br from-white to-green-50/30">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-green-700">
                    <TrendingUp className="h-5 w-5" />
                    Performance Trends <span className="rounded-md bg-gray-800 px-2 py-1 text-sm font-medium text-white">Demo Feature</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div className="h-24">
                      <MiniLineChart data={[75, 82, 78, 85, 90, 88, 92]} color="#10b981" />
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Last 7 days</span>
                      <span className="font-semibold text-green-600">+12%</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Study Time */}
              <Card className="border border-blue-100 bg-gradient-to-br from-white to-blue-50/30">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-blue-700">
                    <Calendar className="h-5 w-5" />
                    Study Time <span className="rounded-md bg-gray-800 px-2 py-1 text-sm font-medium text-white">Demo Feature</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="text-center">
                      <p className="text-3xl font-bold text-blue-600">24.5h</p>
                      <p className="text-sm text-gray-600">This week</p>
                    </div>
                    <div className="h-16">
                      <MiniBarChart data={[3, 4, 2, 5, 6, 3, 4]} color="#2563eb" />
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Achievement Rate */}
              <Card className="border border-purple-100 bg-gradient-to-br from-white to-purple-50/30">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-purple-700">
                    <Award className="h-5 w-5" />
                    Achievement Rate <span className="rounded-md bg-gray-800 px-2 py-1 text-sm font-medium text-white">Demo Feature</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-center space-x-4">
                    <MiniDonutChart percentage={85} color="#9333ea" />
                    <div>
                      <p className="text-2xl font-bold text-purple-600"><CountUp end={85}className="counter-value inline-block" />%</p>
                      <p className="text-sm text-gray-600">Completion rate</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {isSubscribed ? (
              <Card className="border border-gray-200">
                <CardHeader>
                  <CardTitle className="text-gray-800">Spending Analysis</CardTitle>
                </CardHeader>
                <CardContent>
                 {spendingByYear && <ChartBarLabelCustom spendingByYear={spendingByYear} />} 
                </CardContent>
              </Card>
            ) : (
              <Card className="border border-gray-200">
                <CardHeader>
                  <CardTitle className="text-gray-800">Spending Analysis</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-col items-center justify-center gap-4 py-8">
                    <div className="rounded-full bg-gray-100 p-4">
                      <IconLock className="h-8 w-8 text-gray-400" />
                    </div>
                    <div className="text-center">
                      <p className="text-lg font-semibold text-gray-700">Feature Locked</p>
                      <p className="text-gray-600">Subscribe to unlock detailed spending analytics</p>
                    </div>
                    <Button
                      variant="outline"
                      className="border-blue-200 text-blue-700 hover:bg-blue-50"
                      onClick={handleViewSpending}
                    >
                      Subscribe Now
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}
          </TabsContent>
        </Tabs>
      </Main>
    </div>
  );
}

const topNav = [
  {
    title: 'Overview',
    href: '/student',
    isActive: true,
    disabled: false,
  },
  {
    title: 'Courses',
    href: '/student/enrolledcourses',
    isActive: false,
    disabled: false,
  },
  {
    title: 'Quizzes (Dummy)',
    href: 'dashboard/products',
    isActive: false,
    disabled: true,
  },
  {
    title: 'Settings',
    href: '/student/settings',
    isActive: false,
    disabled: false,
  },
];