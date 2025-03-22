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
import { Trophy, ArrowUp, ArrowDown } from "lucide-react";

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
  points: UserPoints;
  rank: number;
  avatar?: string;
  specialization?: string;
}

export default function LeaderboardPage() {
  const { token, user } = useAuth();
  const [users, setUsers] = useState<LeaderboardUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [timeframe, setTimeframe] = useState("total");
  const [category, setCategory] = useState("total");

  const fetchLeaderboard = async () => {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/auth/leaderboard?timeframe=${timeframe}&category=${category}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) throw new Error("Failed to fetch leaderboard");
      const data = await response.json();
      setUsers(data.users);
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
  }, [token, timeframe, category]);

  const getPointsDisplay = (user: LeaderboardUser) => {
    if (category === "total") {
      return user.points[timeframe as keyof Omit<UserPoints, "categoryPoints">];
    }
    return user.points.categoryPoints[
      category as keyof UserPoints["categoryPoints"]
    ];
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Leaderboard</h1>
          <p className="text-muted-foreground">
            Your Rank: #{user?.rank || "N/A"}
          </p>
        </div>

        <div className="flex gap-4">
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
              <SelectItem value="total">Overall</SelectItem>
              <SelectItem value="physics">Physics</SelectItem>
              <SelectItem value="chemistry">Chemistry</SelectItem>
              <SelectItem value="biology">Biology</SelectItem>
              <SelectItem value="computerScience">Computer Science</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Top Performers</CardTitle>
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
                    {index + 1}
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
        </CardContent>
      </Card>
    </div>
  );
}
