"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  BookOpen,
  Clock,
  FlaskRoundIcon as Flask,
  Award,
  ArrowRight,
  Zap,
  BarChart,
  Trophy,
  Users,
  Lightbulb,
} from "lucide-react";
import { useAuth } from "../hooks/use-auth";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

interface UserStats {
  name: string;
  coursesEnrolled: number;
  completedCourses: number;
  labHours: number;
  totalExperiments: number;
  completedExperiments: number;
  achievements: number;
  newAchievements: number;
  lastActive: string;
}

export default function DashboardPage() {
  const router = useRouter();
  const { token, user, isHydrated } = useAuth();
  const [stats, setStats] = useState<UserStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isHydrated) return;

    if (!token) {
      router.push("/auth/sign-in");
      return;
    }

    const fetchStats = async () => {
      try {
        if (!process.env.NEXT_PUBLIC_API_URL) {
          throw new Error(
            "API URL is not configured. Please check your environment variables."
          );
        }

        const apiUrl = `${process.env.NEXT_PUBLIC_API_URL}/auth/stats`;
        console.log("Fetching stats from:", apiUrl);

        const response = await fetch(apiUrl, {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });

        if (!response.ok) {
          const errorData = await response.text();
          console.error("API Error Response:", {
            status: response.status,
            statusText: response.statusText,
            data: errorData,
          });
          throw new Error(
            `Failed to fetch statistics: ${response.status} ${response.statusText}`
          );
        }

        const data = await response.json();
        setStats(data);
      } catch (error) {
        console.error("Error fetching stats:", error);
        toast.error(
          error instanceof Error
            ? error.message
            : "Failed to load dashboard statistics"
        );
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, [token, router, isHydrated]);

  if (!isHydrated || !token) {
    return null;
  }

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        <p className="text-muted-foreground">Loading your dashboard...</p>
      </div>
    );
  }

  if (!stats) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
        <p className="text-lg font-medium">Unable to load dashboard</p>
        <p className="text-muted-foreground">Please try refreshing the page</p>
        <Button onClick={() => window.location.reload()} variant="outline">
          Refresh Page
        </Button>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold tracking-tight">
          Welcome back, {stats.name}!
        </h1>
        <p className="text-muted-foreground">
          Track your progress and continue your learning journey.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Courses Enrolled
            </CardTitle>
            <BookOpen className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.coursesEnrolled}</div>
            <p className="text-xs text-muted-foreground">
              {stats.completedCourses} completed,{" "}
              {stats.coursesEnrolled - stats.completedCourses} in progress
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Lab Hours</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {stats.labHours.toFixed(1)}
            </div>
            <p className="text-xs text-muted-foreground">
              Total hours spent in labs
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Experiments</CardTitle>
            <Flask className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalExperiments}</div>
            <p className="text-xs text-muted-foreground">
              {stats.completedExperiments} completed,{" "}
              {stats.totalExperiments - stats.completedExperiments} in progress
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Achievements</CardTitle>
            <Award className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.achievements}</div>
            <p className="text-xs text-muted-foreground">
              {stats.newAchievements} new this month
            </p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="in-progress" className="space-y-4">
        <TabsList>
          <TabsTrigger value="in-progress">In Progress</TabsTrigger>
          <TabsTrigger value="recommended">Recommended</TabsTrigger>
          <TabsTrigger value="achievements">Achievements</TabsTrigger>
        </TabsList>
        <TabsContent value="in-progress" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle>Advanced Physics Lab</CardTitle>
                <CardDescription>Quantum Mechanics Experiments</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex justify-between mb-2 text-sm">
                  <span>Progress</span>
                  <span className="font-medium">65%</span>
                </div>
                <Progress value={65} className="h-2" />
                <div className="mt-4 flex items-center text-sm text-muted-foreground">
                  <Clock className="mr-1 h-4 w-4" />
                  Last accessed 2 days ago
                </div>
              </CardContent>
              <CardFooter>
                <Button className="w-full">
                  Continue Learning
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </CardFooter>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle>Data Science Fundamentals</CardTitle>
                <CardDescription>
                  Statistical Analysis & Visualization
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex justify-between mb-2 text-sm">
                  <span>Progress</span>
                  <span className="font-medium">42%</span>
                </div>
                <Progress value={42} className="h-2" />
                <div className="mt-4 flex items-center text-sm text-muted-foreground">
                  <Clock className="mr-1 h-4 w-4" />
                  Last accessed 5 days ago
                </div>
              </CardContent>
              <CardFooter>
                <Button className="w-full">
                  Continue Learning
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </CardFooter>
            </Card>
          </div>
        </TabsContent>
        <TabsContent value="recommended" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle>AI for Scientific Research</CardTitle>
                <CardDescription>
                  Machine Learning Applications in Research
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-2 text-sm text-muted-foreground mb-4">
                  <Zap className="h-4 w-4 text-primary" />
                  <span>Recommended based on your interests</span>
                </div>
                <div className="flex items-center gap-4 text-sm">
                  <div className="flex items-center">
                    <BookOpen className="mr-1 h-4 w-4 text-muted-foreground" />
                    <span>12 modules</span>
                  </div>
                  <div className="flex items-center">
                    <Clock className="mr-1 h-4 w-4 text-muted-foreground" />
                    <span>24 hours</span>
                  </div>
                </div>
              </CardContent>
              <CardFooter>
                <Button className="w-full">Enroll Now</Button>
              </CardFooter>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle>Advanced Electronics Lab</CardTitle>
                <CardDescription>
                  Circuit Design & Microcontrollers
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-2 text-sm text-muted-foreground mb-4">
                  <BarChart className="h-4 w-4 text-primary" />
                  <span>Popular among your peers</span>
                </div>
                <div className="flex items-center gap-4 text-sm">
                  <div className="flex items-center">
                    <BookOpen className="mr-1 h-4 w-4 text-muted-foreground" />
                    <span>8 modules</span>
                  </div>
                  <div className="flex items-center">
                    <Clock className="mr-1 h-4 w-4 text-muted-foreground" />
                    <span>18 hours</span>
                  </div>
                </div>
              </CardContent>
              <CardFooter>
                <Button className="w-full">Enroll Now</Button>
              </CardFooter>
            </Card>
          </div>
        </TabsContent>
        <TabsContent value="achievements" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Card className="flex flex-col items-center p-4">
              <div className="rounded-full bg-primary/10 p-3 mb-3">
                <Award className="h-6 w-6 text-primary" />
              </div>
              <h3 className="font-medium text-center">First Experiment</h3>
              <p className="text-xs text-center text-muted-foreground mt-1">
                Completed your first lab experiment
              </p>
            </Card>
            <Card className="flex flex-col items-center p-4">
              <div className="rounded-full bg-primary/10 p-3 mb-3">
                <Trophy className="h-6 w-6 text-primary" />
              </div>
              <h3 className="font-medium text-center">Top Performer</h3>
              <p className="text-xs text-center text-muted-foreground mt-1">
                Ranked in the top 10% of your class
              </p>
            </Card>
            <Card className="flex flex-col items-center p-4">
              <div className="rounded-full bg-primary/10 p-3 mb-3">
                <Zap className="h-6 w-6 text-primary" />
              </div>
              <h3 className="font-medium text-center">Quick Learner</h3>
              <p className="text-xs text-center text-muted-foreground mt-1">
                Completed 5 modules in one week
              </p>
            </Card>
            <Card className="flex flex-col items-center p-4">
              <div className="rounded-full bg-primary/10 p-3 mb-3">
                <Users className="h-6 w-6 text-primary" />
              </div>
              <h3 className="font-medium text-center">Team Player</h3>
              <p className="text-xs text-center text-muted-foreground mt-1">
                Collaborated on 3 group experiments
              </p>
            </Card>
          </div>
        </TabsContent>
      </Tabs>

      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Upcoming Sessions</CardTitle>
            <CardDescription>
              Your scheduled lab sessions and classes
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-start justify-between">
                <div>
                  <p className="font-medium">Advanced Physics Lab</p>
                  <p className="text-sm text-muted-foreground">
                    Quantum Mechanics Experiment #3
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-medium">Tomorrow</p>
                  <p className="text-sm text-muted-foreground">10:00 - 12:00</p>
                </div>
              </div>
              <div className="flex items-start justify-between">
                <div>
                  <p className="font-medium">Data Science Workshop</p>
                  <p className="text-sm text-muted-foreground">
                    Predictive Modeling Techniques
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-medium">Mar 23, 2025</p>
                  <p className="text-sm text-muted-foreground">14:00 - 16:00</p>
                </div>
              </div>
              <div className="flex items-start justify-between">
                <div>
                  <p className="font-medium">Group Project Meeting</p>
                  <p className="text-sm text-muted-foreground">
                    Research Methodology Discussion
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-medium">Mar 25, 2025</p>
                  <p className="text-sm text-muted-foreground">15:30 - 17:00</p>
                </div>
              </div>
            </div>
          </CardContent>
          <CardFooter>
            <Button variant="outline" className="w-full">
              View All Sessions
            </Button>
          </CardFooter>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>AI Mentor Insights</CardTitle>
            <CardDescription>
              Personalized recommendations from your AI mentor
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="rounded-lg border p-3">
                <div className="flex items-center gap-2 mb-2">
                  <Lightbulb className="h-4 w-4 text-primary" />
                  <p className="font-medium">Learning Pattern Analysis</p>
                </div>
                <p className="text-sm text-muted-foreground">
                  You seem to learn best in the morning hours. Consider
                  scheduling more lab sessions between 9-11 AM for optimal
                  performance.
                </p>
              </div>
              <div className="rounded-lg border p-3">
                <div className="flex items-center gap-2 mb-2">
                  <Zap className="h-4 w-4 text-primary" />
                  <p className="font-medium">Skill Gap Identified</p>
                </div>
                <p className="text-sm text-muted-foreground">
                  Your data visualization skills could use improvement. I've
                  added some recommended resources to your learning path.
                </p>
              </div>
              <div className="rounded-lg border p-3">
                <div className="flex items-center gap-2 mb-2">
                  <BarChart className="h-4 w-4 text-primary" />
                  <p className="font-medium">Progress Trend</p>
                </div>
                <p className="text-sm text-muted-foreground">
                  Your progress in quantum mechanics has accelerated by 15% this
                  month. Keep up the good work!
                </p>
              </div>
            </div>
          </CardContent>
          <CardFooter>
            <Button variant="outline" className="w-full">
              Chat with AI Mentor
            </Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}
