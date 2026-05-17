import { useState } from "react";
import { useAuth } from "@/hooks/use-auth";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";

interface PostFormProps {
  onPostCreated: () => void;
  onCancel: () => void;
}

export default function PostForm({ onPostCreated, onCancel }: PostFormProps) {
  const { user } = useAuth();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    content: "",
    category: "",
  });

  const categories = [
    { value: "plab1", label: "PLAB 1 Questions & Study Tips" },
    { value: "plab2", label: "PLAB 2 OSCE & Clinical Skills" },
    { value: "nhs", label: "NHS Jobs & Career Guidance" },
    { value: "general", label: "General Discussion" },
  ];

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.title.trim() || !formData.content.trim() || !formData.category) {
      toast({
        title: "Missing information",
        description: "Please fill in all required fields.",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await fetch("/api/community/posts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          authorId: user?.id,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to create post");
      }

      toast({
        title: "Post created successfully!",
        description: "Your discussion has been posted to the community.",
      });

      onPostCreated();
    } catch (error) {
      toast({
        title: "Error creating post",
        description: "Please try again later.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <svg className="w-5 h-5 mr-2 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
          </svg>
          Create New Discussion
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          
          {/* Category Selection */}
          <div className="space-y-2">
            <Label htmlFor="category">Category *</Label>
            <Select value={formData.category} onValueChange={(value) => handleInputChange("category", value)}>
              <SelectTrigger>
                <SelectValue placeholder="Select a category for your discussion" />
              </SelectTrigger>
              <SelectContent>
                {categories.map((category) => (
                  <SelectItem key={category.value} value={category.value}>
                    {category.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Title */}
          <div className="space-y-2">
            <Label htmlFor="title">Title *</Label>
            <Input
              id="title"
              placeholder="Write a clear, descriptive title for your discussion..."
              value={formData.title}
              onChange={(e) => handleInputChange("title", e.target.value)}
              maxLength={150}
            />
            <div className="text-xs text-muted-foreground">
              {formData.title.length}/150 characters
            </div>
          </div>

          {/* Content */}
          <div className="space-y-2">
            <Label htmlFor="content">Content *</Label>
            <Textarea
              id="content"
              placeholder="Share your question, experience, or advice with the community. Be specific and provide context to help others understand and respond effectively."
              value={formData.content}
              onChange={(e) => handleInputChange("content", e.target.value)}
              className="min-h-[150px]"
              maxLength={2000}
            />
            <div className="text-xs text-muted-foreground">
              {formData.content.length}/2000 characters
            </div>
          </div>

          {/* Guidelines */}
          <div className="bg-muted/30 rounded-lg p-4">
            <h4 className="font-medium text-sm mb-2">Community Guidelines:</h4>
            <ul className="text-xs text-muted-foreground space-y-1">
              <li>• Be respectful and supportive to fellow medical graduates</li>
              <li>• Share accurate information and cite sources when possible</li>
              <li>• Use clear titles that describe your question or topic</li>
              <li>• Search existing discussions before posting duplicates</li>
              <li>• Follow professional medical communication standards</li>
            </ul>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-3 sm:justify-end">
            <Button
              type="button"
              variant="outline"
              onClick={onCancel}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isSubmitting || !formData.title.trim() || !formData.content.trim() || !formData.category}
            >
              {isSubmitting ? (
                <div className="flex items-center space-x-2">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary-foreground"></div>
                  <span>Publishing...</span>
                </div>
              ) : (
                "Publish Discussion"
              )}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
