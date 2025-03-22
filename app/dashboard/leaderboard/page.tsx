"use client";

import { useEffect, useState } from "react";
import { useAuth } from "../../hooks/use-auth";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Trophy,
  ArrowUp,
  Medal,
  School,
  Star,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";

interface Achievement {
  title: string;
  description: string;
  dateEarned: string;
  type: string;
}

interface UserPoints {
  total: number;
  weekly: number;
  monthly: number;
  categoryPoints: {
    physics: number;
    chemistry: number;
    biology: number;
    computerScience: number;
  };
}

interface LeaderboardUser {
  _id: string;
  name: string;
  institution: string;
  specialization?: string;
  avatar?: string;
  rank: number;
  points: UserPoints;
  achievements: Achievement[];
}

interface LeaderboardResponse {
  users: LeaderboardUser[];
  userRank: number;
  currentPage: number;
  totalPages: number;
  totalUsers: number;
}

export default function LeaderboardPage() {
  const { token, user } = useAuth();
  const [users, setUsers] = useState<LeaderboardUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [timeframe, setTimeframe] = useState("total");
  const [category, setCategory] = useState("Overall");
  const [view, setView] = useState<"global" | "institution">("global");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [userRank, setUserRank] = useState(0);

  const fetchLeaderboard = async () => {
    try {
      setLoading(true);
      const endpoint = view === "global" ? "global" : "institution";
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/leaderboard/${endpoint}?timeframe=${timeframe}&category=${category}&page=${currentPage}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) throw new Error("Failed to fetch leaderboard");
      const data: LeaderboardResponse = await response.json();
      setUsers(data.users);
      setUserRank(data.userRank);
      setTotalPages(data.totalPages);
    } catch (error) {
      console.error("Error fetching leaderboard:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (token) {
      fetchLeaderboard();
    }
  }, [token, timeframe, category, view, currentPage]);

  const getPointsDisplay = (user: LeaderboardUser) => {
    if (category === "Overall") {
      return user.points[timeframe as keyof Omit<UserPoints, "categoryPoints">];
    }
    return user.points.categoryPoints[
      category
        .toLowerCase()
        .replace(/\s+/g, "") as keyof UserPoints["categoryPoints"]
    ];
  };

  const getAchievementIcon = (type: string) => {
    switch (type) {
      case "course":
        return <School className="h-4 w-4" />;
      case "experiment":
        return <Star className="h-4 w-4" />;
      case "excellence":
        return <Medal className="h-4 w-4" />;
      default:
        return <Trophy className="h-4 w-4" />;
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-6 p-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Leaderboard</h1>
          <p className="text-muted-foreground">Your Rank: #{userRank}</p>
        </div>

        <div className="flex gap-4">
          <Select
            value={view}
            onValueChange={(v) => setView(v as "global" | "institution")}
          >
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Select View" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="global">Global</SelectItem>
              <SelectItem value="institution">Institution</SelectItem>
            </SelectContent>
          </Select>

          <Select value={timeframe} onValueChange={setTimeframe}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Select Timeframe" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="total">All Time</SelectItem>
              <SelectItem value="monthly">This Month</SelectItem>
              <SelectItem value="weekly">This Week</SelectItem>
            </SelectContent>
          </Select>

          <Select value={category} onValueChange={setCategory}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Select Category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Overall">Overall</SelectItem>
              <SelectItem value="Physics">Physics</SelectItem>
              <SelectItem value="Chemistry">Chemistry</SelectItem>
              <SelectItem value="Biology">Biology</SelectItem>
              <SelectItem value="Computer Science">Computer Science</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>
            {view === "global" ? "Global Rankings" : "Institution Rankings"}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {users.map((user, index) => (
              <div
                key={user._id}
                className={`flex items-center justify-between p-4 rounded-lg ${
                  index === 0
                    ? "bg-yellow-50 dark:bg-yellow-900/10"
                    : "bg-background"
                } border`}
              >
                <div className="flex items-center gap-4">
                  <div className="flex items-center justify-center w-8 text-xl font-bold">
                    {user.rank}
                  </div>
                  <Avatar className="h-12 w-12">
                    <AvatarImage src={user.avatar} />
                    <AvatarFallback>
                      {user.name
                        .split(" ")
                        .map((n) => n[0])
                        .join("")}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-medium">{user.name}</p>
                    <p className="text-sm text-muted-foreground">
                      {user.institution} • {user.specialization}
                    </p>
                    <div className="flex gap-1 mt-1">
                      {user.achievements.slice(0, 3).map((achievement, i) => (
                        <Badge
                          key={i}
                          variant="secondary"
                          className="flex items-center gap-1"
                        >
                          {getAchievementIcon(achievement.type)}
                          {achievement.title}
                        </Badge>
                      ))}
                      {user.achievements.length > 3 && (
                        <Badge variant="outline">
                          +{user.achievements.length - 3}
                        </Badge>
                      )}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  {index === 0 && (
                    <Badge className="bg-yellow-500">
                      <Trophy className="h-4 w-4 mr-1" />
                      Leader
                    </Badge>
                  )}
                  <div className="text-right">
                    <p className="text-2xl font-bold">
                      {getPointsDisplay(user)}
                    </p>
                    <div className="flex items-center text-sm text-green-600">
                      <ArrowUp className="h-4 w-4 mr-1" />
                      <span>+{user.points.weekly}</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Pagination */}
          <div className="flex items-center justify-center gap-4 mt-6">
            <Button
              variant="outline"
              size="icon"
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              disabled={currentPage === 1}
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <span className="text-sm">
              Page {currentPage} of {totalPages}
            </span>
            <Button
              variant="outline"
              size="icon"
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
