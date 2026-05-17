import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Textarea } from "@/components/ui/textarea";

interface DiscussionPostProps {
  post: any;
}

export default function DiscussionPost({ post }: DiscussionPostProps) {
  const [showReplies, setShowReplies] = useState(false);
  const [showReplyForm, setShowReplyForm] = useState(false);
  const [replyContent, setReplyContent] = useState("");

  const { data: replies = [] } = useQuery({
    queryKey: ["/api/community/posts", post.id, "replies"],
    enabled: showReplies,
  });

  const timeAgo = (date: string) => {
    const now = new Date();
    const postDate = new Date(date);
    const diffInHours = Math.floor((now.getTime() - postDate.getTime()) / (1000 * 60 * 60));
    
    if (diffInHours < 1) return "Just now";
    if (diffInHours < 24) return `${diffInHours}h ago`;
    const diffInDays = Math.floor(diffInHours / 24);
    if (diffInDays < 7) return `${diffInDays}d ago`;
    return postDate.toLocaleDateString();
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case "plab1":
        return "bg-primary/10 text-primary border-primary/20";
      case "plab2":
        return "bg-secondary/10 text-secondary border-secondary/20";
      case "nhs":
        return "bg-success/10 text-success border-success/20";
      case "general":
        return "bg-accent/10 text-accent border-accent/20";
      default:
        return "bg-muted text-muted-foreground";
    }
  };

  const handleSubmitReply = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!replyContent.trim()) return;

    try {
      const response = await fetch(`/api/community/posts/${post.id}/replies`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          authorId: 1, // Current user ID
          content: replyContent,
        }),
      });

      if (response.ok) {
        setReplyContent("");
        setShowReplyForm(false);
        // Refresh replies would happen here
      }
    } catch (error) {
      console.error("Failed to submit reply:", error);
    }
  };

  return (
    <Card className="community-post">
      <CardContent className="p-6">
        
        {/* Post Header */}
        <div className="flex items-start space-x-4">
          <Avatar className="w-12 h-12">
            <AvatarFallback className="bg-primary/20 text-primary">
              {post.author.firstName[0]}{post.author.lastName[0]}
            </AvatarFallback>
          </Avatar>
          
          <div className="flex-1 min-w-0">
            <div className="flex items-center space-x-2 mb-2">
              <h4 className="font-semibold text-foreground">
                {post.author.firstName} {post.author.lastName}
              </h4>
              <Badge variant="outline" className={getCategoryColor(post.category)}>
                {post.category.toUpperCase()}
              </Badge>
              <span className="text-sm text-muted-foreground">
                {timeAgo(post.createdAt)}
              </span>
            </div>
            
            <h3 className="text-lg font-medium text-foreground mb-3 leading-tight">
              {post.title}
            </h3>
            
            <p className="text-foreground leading-relaxed mb-4">
              {post.content}
            </p>
            
            {/* Post Actions */}
            <div className="post-actions">
              <button className="flex items-center space-x-2 hover:text-primary transition-colors">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 10h4.764a2 2 0 011.789 2.894l-3.5 7A2 2 0 0115.263 21h-4.017c-.163 0-.326-.02-.485-.06L7 20m7-10V9a2 2 0 00-2-2h-.095c-.5 0-.905.405-.905.905 0 .714-.211 1.412-.608 2.006L7 11v9m7-10h-2M7 20H5a2 2 0 01-2-2v-6a2 2 0 012-2h2.5" />
                </svg>
                <span>{post.upvotes} helpful</span>
              </button>
              
              <button 
                className="flex items-center space-x-2 hover:text-primary transition-colors"
                onClick={() => setShowReplies(!showReplies)}
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                </svg>
                <span>{post.replies} replies</span>
              </button>
              
              <button className="flex items-center space-x-2 hover:text-primary transition-colors">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.367 2.684 3 3 0 00-5.367-2.684z" />
                </svg>
                <span>Share</span>
              </button>
              
              <button 
                className="flex items-center space-x-2 hover:text-primary transition-colors"
                onClick={() => setShowReplyForm(!showReplyForm)}
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h10a8 8 0 018 8v2M3 10l6 6m-6-6l6-6" />
                </svg>
                <span>Reply</span>
              </button>
            </div>
          </div>
        </div>

        {/* Reply Form */}
        {showReplyForm && (
          <form onSubmit={handleSubmitReply} className="mt-6 pl-16 space-y-4">
            <Textarea
              placeholder="Write your reply..."
              value={replyContent}
              onChange={(e) => setReplyContent(e.target.value)}
              className="min-h-[100px]"
            />
            <div className="flex justify-end space-x-3">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => setShowReplyForm(false)}
              >
                Cancel
              </Button>
              <Button type="submit" size="sm" disabled={!replyContent.trim()}>
                Post Reply
              </Button>
            </div>
          </form>
        )}

        {/* Replies */}
        {showReplies && replies.length > 0 && (
          <div className="mt-6 pl-16 space-y-4">
            {replies.map((reply: any) => (
              <div key={reply.id} className="border-l-2 border-border pl-4">
                <div className="flex items-center space-x-2 mb-2">
                  <Avatar className="w-6 h-6">
                    <AvatarFallback className="bg-muted text-muted-foreground text-xs">
                      {reply.author.firstName[0]}{reply.author.lastName[0]}
                    </AvatarFallback>
                  </Avatar>
                  <span className="font-medium text-sm text-foreground">
                    {reply.author.firstName} {reply.author.lastName}
                  </span>
                  <span className="text-xs text-muted-foreground">
                    {timeAgo(reply.createdAt)}
                  </span>
                </div>
                <p className="text-sm text-foreground leading-relaxed">
                  {reply.content}
                </p>
                <div className="flex items-center space-x-4 mt-2 text-xs text-muted-foreground">
                  <button className="hover:text-primary transition-colors">
                    👍 {reply.upvotes}
                  </button>
                  <button className="hover:text-primary transition-colors">
                    Reply
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
