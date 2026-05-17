import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Calendar, CheckCircle, Clock, RotateCcw, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { apiRequest } from "@/lib/queryClient";
import type { StudyPlan, InsertStudyPlan } from "@shared/schema";
import type { StudyTask } from "@/lib/types";

interface StudyPlannerProps {
  userId: number;
  selectedDate?: string;
}

export function StudyPlanner({ userId, selectedDate }: StudyPlannerProps) {
  const [currentDate] = useState(selectedDate || new Date().toISOString().split('T')[0]);
  const queryClient = useQueryClient();

  const { data: studyPlan, isLoading } = useQuery<StudyPlan>({
    queryKey: [`/api/users/${userId}/study-plan/${currentDate}`],
    enabled: !!userId && !!currentDate,
  });

  const createPlanMutation = useMutation({
    mutationFn: async (plan: InsertStudyPlan) => {
      const response = await apiRequest("POST", "/api/study-plans", plan);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [`/api/users/${userId}/study-plan/${currentDate}`] });
    },
  });

  const updatePlanMutation = useMutation({
    mutationFn: async ({ id, updates }: { id: number; updates: Partial<StudyPlan> }) => {
      const response = await apiRequest("PATCH", `/api/study-plans/${id}`, updates);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [`/api/users/${userId}/study-plan/${currentDate}`] });
    },
  });

  // Generate default study plan if none exists
  const generateDefaultPlan = () => {
    const defaultTasks: StudyTask[] = [
      {
        id: "1",
        title: "Cardiology MCQs",
        description: "30 adaptive questions",
        type: "mcq",
        duration: 45,
        completed: false,
        progress: 0,
      },
      {
        id: "2",
        title: "OSCE Communication Station",
        description: "Practice breaking bad news",
        type: "osce",
        duration: 30,
        completed: false,
        progress: 0,
      },
      {
        id: "3",
        title: "Review Weak Topics",
        description: "Respiratory & Endocrinology",
        type: "review",
        duration: 25,
        completed: false,
        progress: 0,
      },
      {
        id: "4",
        title: "Mock Exam Review",
        description: "Analyze previous errors",
        type: "mock",
        duration: 40,
        completed: false,
        progress: 0,
      },
    ];

    createPlanMutation.mutate({
      userId,
      date: currentDate,
      tasks: defaultTasks,
      completed: false,
      progress: 0,
    });
  };

  const toggleTaskCompletion = async (taskId: string) => {
    if (!studyPlan) return;

    const tasks = studyPlan.tasks as StudyTask[];
    const updatedTasks = tasks.map(task => 
      task.id === taskId 
        ? { ...task, completed: !task.completed, progress: !task.completed ? 100 : 0 }
        : task
    );

    const completedTasks = updatedTasks.filter(task => task.completed).length;
    const progress = Math.round((completedTasks / updatedTasks.length) * 100);
    const completed = progress === 100;

    await updatePlanMutation.mutateAsync({
      id: studyPlan.id,
      updates: {
        tasks: updatedTasks,
        progress,
        completed,
      },
    });
  };

  const getTaskIcon = (type: string) => {
    const iconMap = {
      mcq: "📋",
      osce: "🎭",
      review: "📚",
      mock: "⏱️",
    };
    return iconMap[type as keyof typeof iconMap] || "📝";
  };

  const getTaskTypeColor = (type: string) => {
    const colorMap = {
      mcq: "bg-primary/10 text-primary",
      osce: "bg-secondary/10 text-secondary",
      review: "bg-accent/10 text-accent",
      mock: "bg-warning/10 text-warning",
    };
    return colorMap[type as keyof typeof colorMap] || "bg-muted text-muted-foreground";
  };

  if (isLoading) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="space-y-4">
            {[1, 2, 3, 4].map(i => (
              <div key={i} className="h-16 bg-muted rounded-lg animate-pulse" />
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  const tasks = (studyPlan?.tasks as StudyTask[]) || [];
  const completedTasks = tasks.filter(task => task.completed).length;
  const planProgress = tasks.length > 0 ? Math.round((completedTasks / tasks.length) * 100) : 0;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span className="flex items-center space-x-2">
            <Calendar className="w-5 h-5" />
            <span>Today's Study Plan</span>
          </span>
          <div className="flex items-center space-x-2">
            {!studyPlan ? (
              <Button
                onClick={generateDefaultPlan}
                size="sm"
                variant="outline"
                disabled={createPlanMutation.isPending}
                className="flex items-center space-x-2"
              >
                {createPlanMutation.isPending ? (
                  <div className="spinner w-4 h-4" />
                ) : (
                  <Plus className="w-4 h-4" />
                )}
                <span>Generate Plan</span>
              </Button>
            ) : (
              <Button size="sm" variant="ghost">
                Edit Plan
              </Button>
            )}
          </div>
        </CardTitle>
      </CardHeader>

      <CardContent>
        {!studyPlan ? (
          <div className="text-center py-8">
            <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
              <Calendar className="w-8 h-8 text-muted-foreground" />
            </div>
            <h3 className="text-lg font-semibold mb-2">No Study Plan Yet</h3>
            <p className="text-muted-foreground mb-4">
              Create a personalized study plan for today to stay on track with your PLAB preparation.
            </p>
            <Button
              onClick={generateDefaultPlan}
              disabled={createPlanMutation.isPending}
              className="btn-primary"
            >
              {createPlanMutation.isPending && <div className="spinner w-4 h-4 mr-2" />}
              Generate Study Plan
            </Button>
          </div>
        ) : (
          <div className="space-y-4">
            {/* Study Tasks */}
            <div className="space-y-3">
              {tasks.map((task) => (
                <div
                  key={task.id}
                  className={`study-task ${
                    task.completed ? "study-task-completed" : ""
                  } cursor-pointer`}
                  onClick={() => toggleTaskCompletion(task.id)}
                >
                  <div className="flex items-center space-x-3">
                    <div className={`
                      w-8 h-8 rounded-full flex items-center justify-center transition-colors
                      ${task.completed 
                        ? "bg-success text-white" 
                        : "border-2 border-border hover:border-primary"
                      }
                    `}>
                      {task.completed ? (
                        <CheckCircle className="w-5 h-5" />
                      ) : (
                        <span className="text-lg">{getTaskIcon(task.type)}</span>
                      )}
                    </div>
                    
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-1">
                        <h4 className={`font-medium ${
                          task.completed ? "line-through text-muted-foreground" : "text-foreground"
                        }`}>
                          {task.title}
                        </h4>
                        <Badge
                          variant="secondary"
                          className={`text-xs ${getTaskTypeColor(task.type)}`}
                        >
                          {task.type.toUpperCase()}
                        </Badge>
                      </div>
                      <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                        <span>{task.description}</span>
                        <span className="flex items-center space-x-1">
                          <Clock className="w-3 h-3" />
                          <span>{task.duration} min</span>
                        </span>
                      </div>
                    </div>

                    {task.progress > 0 && task.progress < 100 && (
                      <div className="flex items-center space-x-2">
                        <div className="w-16 progress-bar">
                          <div 
                            className="progress-fill bg-primary" 
                            style={{ width: `${task.progress}%` }}
                          />
                        </div>
                        <span className="text-xs text-muted-foreground">{task.progress}%</span>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>

            {/* Daily Progress */}
            <div className="pt-6 border-t border-border">
              <div className="flex items-center justify-between text-sm mb-2">
                <span className="font-medium text-foreground">Daily Progress</span>
                <span className="font-medium text-primary">
                  {completedTasks} of {tasks.length} completed
                </span>
              </div>
              <div className="progress-bar">
                <div 
                  className="progress-fill bg-primary" 
                  style={{ width: `${planProgress}%` }}
                />
              </div>
              <div className="flex justify-between items-center mt-2 text-xs text-muted-foreground">
                <span>{planProgress}% complete</span>
                <span>{Math.round(tasks.reduce((sum, task) => sum + task.duration, 0) * (planProgress / 100))} / {tasks.reduce((sum, task) => sum + task.duration, 0)} minutes</span>
              </div>
            </div>

            {/* Action Buttons */}
            {planProgress === 100 && (
              <div className="pt-4 border-t border-border">
                <div className="text-center">
                  <div className="text-success font-semibold mb-2">
                    🎉 Congratulations! Today's plan completed!
                  </div>
                  <Button
                    size="sm"
                    variant="outline"
                    className="flex items-center space-x-2"
                  >
                    <RotateCcw className="w-4 h-4" />
                    <span>Plan Tomorrow</span>
                  </Button>
                </div>
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
