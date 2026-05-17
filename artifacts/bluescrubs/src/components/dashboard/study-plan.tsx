import { useState } from "react";
import { useAuth } from "@/hooks/use-auth";
import { useQuery, useMutation } from "@tanstack/react-query";
import { queryClient } from "@/lib/queryClient";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { useToast } from "@/hooks/use-toast";

export default function StudyPlan() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [selectedDate] = useState(new Date().toISOString().split('T')[0]);

  const { data: studyPlan } = useQuery({
    queryKey: ["/api/users", user?.id, "study-plan", selectedDate],
    enabled: !!user?.id,
  });

  const updatePlanMutation = useMutation({
    mutationFn: async (updatedPlan: any) => {
      const response = await fetch(`/api/users/${user?.id}/study-plan`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updatedPlan),
      });
      if (!response.ok) throw new Error("Failed to update study plan");
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/users", user?.id, "study-plan"] });
      toast({
        title: "Study plan updated",
        description: "Your progress has been saved.",
      });
    },
  });

  // Default study plan if none exists
  const defaultTasks = [
    {
      id: "1",
      title: "Cardiology MCQs",
      type: "mcq",
      completed: false,
      topicId: 1,
    },
    {
      id: "2",
      title: "OSCE Communication",
      type: "osce",
      completed: false,
    },
    {
      id: "3",
      title: "Review Flashcards",
      type: "review",
      completed: false,
    },
    {
      id: "4",
      title: "Mock Exam Practice",
      type: "mock",
      completed: false,
    },
  ];

  const currentTasks = studyPlan?.tasks || defaultTasks;
  const completedTasks = currentTasks.filter((task: any) => task.completed).length;
  const progressPercentage = currentTasks.length > 0 ? (completedTasks / currentTasks.length) * 100 : 0;

  const toggleTaskCompletion = async (taskId: string) => {
    const updatedTasks = currentTasks.map((task: any) =>
      task.id === taskId ? { ...task, completed: !task.completed } : task
    );

    const updatedPlan = {
      date: selectedDate,
      tasks: updatedTasks,
    };

    try {
      await updatePlanMutation.mutateAsync(updatedPlan);
    } catch (error) {
      toast({
        title: "Error updating task",
        description: "Please try again.",
        variant: "destructive",
      });
    }
  };

  const getTaskIcon = (type: string) => {
    switch (type) {
      case "mcq":
        return "📚";
      case "osce":
        return "🏥";
      case "review":
        return "📝";
      case "mock":
        return "⏱️";
      default:
        return "📋";
    }
  };

  const getTaskTypeColor = (type: string) => {
    switch (type) {
      case "mcq":
        return "text-primary";
      case "osce":
        return "text-secondary";
      case "review":
        return "text-accent";
      case "mock":
        return "text-warning";
      default:
        return "text-muted-foreground";
    }
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg">Today's Study Plan</CardTitle>
          <Button variant="ghost" size="sm" className="text-primary">
            Edit Plan
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        
        {/* Progress Overview */}
        <div className="space-y-3">
          <div className="flex justify-between items-center text-sm">
            <span className="font-medium">Daily Progress</span>
            <span className="text-primary font-medium">
              {completedTasks}/{currentTasks.length} completed
            </span>
          </div>
          <Progress value={progressPercentage} className="h-2" />
        </div>

        {/* Task List */}
        <div className="space-y-3">
          {currentTasks.map((task: any) => (
            <div
              key={task.id}
              className={`study-task ${task.completed ? "completed" : ""} cursor-pointer`}
              onClick={() => toggleTaskCompletion(task.id)}
            >
              <div className="flex items-center space-x-3">
                <div
                  className={`study-task-dot ${
                    task.completed ? "completed" : "pending"
                  }`}
                />
                <div className="text-2xl">{getTaskIcon(task.type)}</div>
                <div className="flex-1">
                  <div
                    className={`font-medium ${
                      task.completed ? "line-through text-muted-foreground" : ""
                    }`}
                  >
                    {task.title}
                  </div>
                  <div className={`text-sm ${getTaskTypeColor(task.type)}`}>
                    {task.type === "mcq" && "20 questions"}
                    {task.type === "osce" && "Practice station"}
                    {task.type === "review" && "Study notes"}
                    {task.type === "mock" && "Timed practice"}
                  </div>
                </div>
                {task.completed && (
                  <svg className="w-5 h-5 text-success" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"/>
                  </svg>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Motivation */}
        {progressPercentage === 100 ? (
          <div className="bg-success/10 border border-success/20 rounded-lg p-4 text-center">
            <div className="text-2xl mb-2">🎉</div>
            <div className="font-semibold text-success">Great job!</div>
            <div className="text-sm text-muted-foreground">
              You've completed today's study plan!
            </div>
          </div>
        ) : progressPercentage >= 50 ? (
          <div className="bg-primary/10 border border-primary/20 rounded-lg p-4 text-center">
            <div className="text-2xl mb-2">💪</div>
            <div className="font-semibold text-primary">Keep going!</div>
            <div className="text-sm text-muted-foreground">
              You're halfway through today's plan.
            </div>
          </div>
        ) : (
          <div className="bg-muted/30 rounded-lg p-4 text-center">
            <div className="text-2xl mb-2">📚</div>
            <div className="font-semibold">Ready to start?</div>
            <div className="text-sm text-muted-foreground">
              Let's tackle today's study goals!
            </div>
          </div>
        )}

        {/* Weekly Overview */}
        <div className="pt-4 border-t border-border">
          <div className="flex justify-between items-center text-sm mb-3">
            <span className="font-medium">This Week</span>
            <span className="text-muted-foreground">5 of 7 days</span>
          </div>
          <div className="flex space-x-1">
            {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map((day, index) => (
              <div
                key={day}
                className={`flex-1 h-8 rounded flex items-center justify-center text-xs font-medium ${
                  index < 5
                    ? "bg-success text-success-foreground"
                    : index === 5
                    ? "bg-primary text-primary-foreground"
                    : "bg-muted text-muted-foreground"
                }`}
              >
                {day}
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
