import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Heart, MessageCircle, Share2, MoreHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Textarea } from "@/components/ui/textarea";
import { apiRequest } from "@/lib/queryClient";
import type { CommunityPostWithUser } from "@/lib/types";
import type { InsertCommunityReply } from "@shared/schema";

interface CommunityPostProps {
  post: CommunityPostWithUser;
  userId: number;
  onReply?: () => void;
}

export function CommunityPost({ post, userId, onReply }: CommunityPostProps) {
  const [showReplyForm, setShowReplyForm] = useState(false);
  const [replyContent, setReplyContent] = useState("");
  const [isLiked, setIsLiked] = useState(false);

  const queryClient = useQueryClient();

  const createReplyMutation = useMutation({
    mutationFn: async (reply: InsertCommunityReply) => {
      const response = await apiRequest("POST", "/api/community/replies", reply);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/community/posts"] });
      setReplyContent("");
      setShowReplyForm(false);
      onReply?.();
    },
  });

  const handleSubmitReply = async () => {
    if (!replyContent.trim()) return;

    await createReplyMutation.mutateAsync({
      postId: post.id,
      userId,
      content: replyContent.trim(),
    });
  };

  const getCategoryBadge = (category: string) => {
    const categoryMap: Record<string, { label: string; variant: "default" | "secondary" | "destructive" | "outline" }> = {
      "plab1": { label: "PLAB 1", variant: "default" },
      "plab2": { label: "PLAB 2", variant: "secondary" },
      "study-groups": { label: "Study Groups", variant: "outline" },
      "nhs": { label: "NHS Prep", variant: "outline" },
      "success": { label: "Success Story", variant: "default" },
    };

    const config = categoryMap[category] || { label: category, variant: "outline" as const };
    return <Badge variant={config.variant}>{config.label}</Badge>;
  };

  const getExamStageBadge = (stage: string) => {
    const stageMap: Record<string, { label: string; className: string }> = {
      "plab1": { label: "PLAB 1 Candidate", className: "bg-primary/10 text-primary" },
      "plab2": { label: "PLAB 2 Candidate", className: "bg-secondary/10 text-secondary" },
      "both": { label: "PLAB Graduate", className: "bg-success/10 text-success" },
    };

    const config = stageMap[stage] || { label: "Student", className: "bg-muted text-muted-foreground" };
    return (
      <span className={`px-2 py-1 text-xs rounded-full ${config.className}`}>
        {config.label}
      </span>
    );
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));

    if (diffInHours < 1) return "Just now";
    if (diffInHours < 24) return `${diffInHours}h ago`;
    if (diffInHours < 168) return `${Math.floor(diffInHours / 24)}d ago`;
    return date.toLocaleDateString();
  };

  return (
    <Card className="community-post">
      <CardContent className="p-6">
        <div className="community-post-header">
          <Avatar className="w-12 h-12">
            <AvatarImage src={post.user.avatar} alt={post.user.name} />
            <AvatarFallback>
              {post.user.name.split(" ").map(n => n[0]).join("")}
            </AvatarFallback>
          </Avatar>
          
          <div className="flex-1">
            <div className="flex items-center space-x-2 mb-2">
              <h4 className="font-semibold text-foreground">{post.user.name}</h4>
              {getExamStageBadge(post.user.examStage)}
              <span className="text-muted-foreground text-sm">•</span>
              <span className="text-muted-foreground text-sm">{formatDate(post.createdAt)}</span>
            </div>
            
            <div className="flex items-center space-x-2 mb-3">
              {getCategoryBadge(post.category)}
            </div>
            
            <h3 className="text-lg font-medium text-foreground mb-3">{post.title}</h3>
            <p className="text-foreground leading-relaxed mb-4">{post.content}</p>
            
            <div className="community-post-actions">
              <button
                onClick={() => setIsLiked(!isLiked)}
                className={`flex items-center space-x-2 hover:text-destructive transition-colors ${
                  isLiked ? "text-destructive" : ""
                }`}
              >
                <Heart className={`w-4 h-4 ${isLiked ? "fill-current" : ""}`} />
                <span>{post.likes + (isLiked ? 1 : 0)} helpful</span>
              </button>
              
              <button
                onClick={() => setShowReplyForm(!showReplyForm)}
                className="flex items-center space-x-2 hover:text-primary transition-colors"
              >
                <MessageCircle className="w-4 h-4" />
                <span>{post.replies} replies</span>
              </button>
              
              <button className="flex items-center space-x-2 hover:text-primary transition-colors">
                <Share2 className="w-4 h-4" />
                <span>Share</span>
              </button>
              
              <button className="flex items-center space-x-2 hover:text-muted-foreground transition-colors ml-auto">
                <MoreHorizontal className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Reply Form */}
        {showReplyForm && (
          <div className="mt-6 pt-6 border-t border-border animate-slide-up">
            <div className="space-y-4">
              <Textarea
                value={replyContent}
                onChange={(e) => setReplyContent(e.target.value)}
                placeholder="Write your reply..."
                className="resize-none"
                rows={3}
              />
              <div className="flex justify-end space-x-3">
                <Button
                  variant="outline"
                  onClick={() => {
                    setShowReplyForm(false);
                    setReplyContent("");
                  }}
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleSubmitReply}
                  disabled={!replyContent.trim() || createReplyMutation.isPending}
                  className="btn-primary"
                >
                  {createReplyMutation.isPending && <div className="spinner w-4 h-4 mr-2" />}
                  Post Reply
                </Button>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
