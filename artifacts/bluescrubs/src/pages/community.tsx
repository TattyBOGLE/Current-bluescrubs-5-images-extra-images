import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { 
  Users, 
  MessageCircle, 
  Calendar, 
  MapPin, 
  Award, 
  BookOpen, 
  Heart,
  Share,
  Search,
  Plus,
  Filter,
  Stethoscope,
  Globe,
  Video,
  UserPlus,
  Star,
  Clock
} from 'lucide-react';

interface CommunityPost {
  id: number;
  author: {
    name: string;
    avatar: string;
    title: string;
    location: string;
  };
  content: string;
  timestamp: string;
  likes: number;
  replies: number;
  tags: string[];
  isLiked: boolean;
}

interface StudyGroup {
  id: number;
  name: string;
  description: string;
  members: number;
  specialty: string;
  meetingTime: string;
  location: string;
  isJoined: boolean;
}

interface Event {
  id: number;
  title: string;
  type: string;
  date: string;
  time: string;
  attendees: number;
  host: string;
  isRegistered: boolean;
}

export default function Community() {
  const [activeTab, setActiveTab] = useState('discussions');
  const [searchQuery, setSearchQuery] = useState('');
  const [newPost, setNewPost] = useState('');
  const [isPosting, setIsPosting] = useState(false);

  const communityPosts: CommunityPost[] = [
    {
      id: 1,
      author: {
        name: "Dr. Ahmed Khan",
        avatar: "AK",
        title: "IMT2 Doctor",
        location: "Manchester, UK"
      },
      content: "Just passed my PLAB 2! The OSCE stations were challenging but the practice here really helped. Happy to share tips with anyone preparing. Key advice: practice clinical communication and stay calm during examination stations.",
      timestamp: "2 hours ago",
      likes: 24,
      replies: 8,
      tags: ["PLAB2", "Success Story", "Tips"],
      isLiked: false
    },
    {
      id: 2,
      author: {
        name: "Dr. Sarah Patel",
        avatar: "SP",
        title: "F1 Doctor",
        location: "London, UK"
      },
      content: "Starting my foundation year next month! Looking for other international graduates in London area for study groups and networking. The journey from PLAB to practicing in the NHS has been incredible.",
      timestamp: "5 hours ago",
      likes: 18,
      replies: 12,
      tags: ["Networking", "London", "Foundation"],
      isLiked: true
    },
    {
      id: 3,
      author: {
        name: "Dr. Michael Chen",
        avatar: "MC",
        title: "Core Trainee",
        location: "Birmingham, UK"
      },
      content: "Hosting a virtual study session this weekend covering cardiovascular medicine topics. We'll go through recent NICE guidelines and practice clinical scenarios. All levels welcome!",
      timestamp: "1 day ago",
      likes: 31,
      replies: 15,
      tags: ["Study Group", "Cardiology", "Virtual"],
      isLiked: false
    }
  ];

  const studyGroups: StudyGroup[] = [
    {
      id: 1,
      name: "PLAB 1 Prep Warriors",
      description: "Intensive preparation group for PLAB 1 with weekly mock tests and discussion sessions",
      members: 156,
      specialty: "General Medicine",
      meetingTime: "Saturdays 2:00 PM GMT",
      location: "Online",
      isJoined: true
    },
    {
      id: 2,
      name: "OSCE Masters London",
      description: "In-person OSCE practice sessions in Central London with experienced doctors",
      members: 89,
      specialty: "PLAB 2 OSCE",
      meetingTime: "Sundays 10:00 AM GMT",
      location: "London, UK",
      isJoined: false
    },
    {
      id: 3,
      name: "International Med Grads UK",
      description: "Support network for international medical graduates navigating the UK healthcare system",
      members: 234,
      specialty: "All Specialties",
      meetingTime: "Bi-weekly Thursdays 7:00 PM GMT",
      location: "Online",
      isJoined: false
    }
  ];

  const upcomingEvents: Event[] = [
    {
      id: 1,
      title: "PLAB Success Webinar",
      type: "Educational",
      date: "June 20, 2025",
      time: "6:00 PM GMT",
      attendees: 145,
      host: "Dr. Williams",
      isRegistered: false
    },
    {
      id: 2,
      title: "Mock OSCE Session",
      type: "Practice",
      date: "June 22, 2025",
      time: "2:00 PM GMT",
      attendees: 78,
      host: "PLAB Masters",
      isRegistered: true
    },
    {
      id: 3,
      title: "NHS Application Workshop",
      type: "Career",
      date: "June 25, 2025",
      time: "4:00 PM GMT",
      attendees: 92,
      host: "Dr. Thompson",
      isRegistered: false
    }
  ];

  const handleLikePost = async (postId: number) => {
    try {
      const response = await fetch('/api/community/posts/like', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ postId })
      });
      
      if (response.ok) {
        // Update local state to reflect the like
        const updatedPosts = communityPosts.map(post => 
          post.id === postId 
            ? { ...post, isLiked: !post.isLiked, likes: post.isLiked ? post.likes - 1 : post.likes + 1 }
            : post
        );
        // In a real implementation, this would update state via setState
        console.log('Post liked successfully');
      }
    } catch (error) {
      console.error('Error liking post:', error);
    }
  };

  const handleJoinGroup = async (groupId: number) => {
    try {
      const response = await fetch('/api/community/groups/join', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ groupId })
      });
      
      if (response.ok) {
        console.log('Group joined successfully');
        // Update local state to reflect membership
      }
    } catch (error) {
      console.error('Error joining group:', error);
    }
  };

  const handleRegisterEvent = async (eventId: number) => {
    try {
      const response = await fetch('/api/community/events/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ eventId })
      });
      
      if (response.ok) {
        console.log('Event registration successful');
        // Update local state to reflect registration
      }
    } catch (error) {
      console.error('Error registering for event:', error);
    }
  };

  const handleCreatePost = async () => {
    if (!newPost.trim()) return;
    
    setIsPosting(true);
    try {
      const response = await fetch('/api/community/posts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          content: newPost,
          tags: ['Discussion'],
          author: {
            name: "Student User",
            avatar: "SU",
            title: "PLAB Candidate",
            location: "UK"
          }
        })
      });
      
      if (response.ok) {
        setNewPost('');
        console.log('Post created successfully');
      }
    } catch (error) {
      console.error('Error creating post:', error);
    } finally {
      setIsPosting(false);
    }
  };

  const handleConnectMentor = async (mentorId: string) => {
    try {
      const response = await fetch('/api/mentorship/connect', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ mentorId })
      });
      
      if (response.ok) {
        console.log('Mentor connection request sent');
      }
    } catch (error) {
      console.error('Error connecting to mentor:', error);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-2">Community</h1>
        <p className="text-muted-foreground text-lg">
          Connect with fellow medical professionals preparing for PLAB and working in the UK
        </p>
      </div>

      {/* Community Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <Card>
          <CardContent className="p-6 text-center">
            <Users className="w-8 h-8 mx-auto mb-2 text-blue-600" />
            <div className="text-2xl font-bold">2,847</div>
            <div className="text-sm text-muted-foreground">Active Members</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6 text-center">
            <MessageCircle className="w-8 h-8 mx-auto mb-2 text-green-600" />
            <div className="text-2xl font-bold">1,234</div>
            <div className="text-sm text-muted-foreground">Discussions</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6 text-center">
            <Award className="w-8 h-8 mx-auto mb-2 text-purple-600" />
            <div className="text-2xl font-bold">456</div>
            <div className="text-sm text-muted-foreground">Success Stories</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6 text-center">
            <Calendar className="w-8 h-8 mx-auto mb-2 text-orange-600" />
            <div className="text-2xl font-bold">89</div>
            <div className="text-sm text-muted-foreground">Upcoming Events</div>
          </CardContent>
        </Card>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="discussions" className="flex items-center gap-2">
            <MessageCircle className="w-4 h-4" />
            Discussions
          </TabsTrigger>
          <TabsTrigger value="groups" className="flex items-center gap-2">
            <Users className="w-4 h-4" />
            Study Groups
          </TabsTrigger>
          <TabsTrigger value="events" className="flex items-center gap-2">
            <Calendar className="w-4 h-4" />
            Events
          </TabsTrigger>
          <TabsTrigger value="mentorship" className="flex items-center gap-2">
            <Stethoscope className="w-4 h-4" />
            Mentorship
          </TabsTrigger>
        </TabsList>

        {/* Discussions Tab */}
        <TabsContent value="discussions" className="space-y-6">
          <div className="flex gap-4">
            <div className="flex-1">
              <Input
                placeholder="Search discussions..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full"
              />
            </div>
            <Button variant="outline">
              <Filter className="w-4 h-4 mr-2" />
              Filter
            </Button>
          </div>

          {/* New Post */}
          <Card>
            <CardContent className="p-6">
              <div className="flex gap-4">
                <Avatar>
                  <AvatarFallback>SA</AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <Textarea
                    placeholder="Share your experience, ask questions, or start a discussion..."
                    value={newPost}
                    onChange={(e) => setNewPost(e.target.value)}
                    rows={3}
                  />
                  <div className="flex justify-between items-center mt-4">
                    <div className="flex gap-2">
                      <Badge variant="outline">PLAB1</Badge>
                      <Badge variant="outline">PLAB2</Badge>
                      <Badge variant="outline">Tips</Badge>
                    </div>
                    <Button 
                      disabled={!newPost.trim() || isPosting}
                      onClick={handleCreatePost}
                    >
                      <Plus className="w-4 h-4 mr-2" />
                      {isPosting ? 'Posting...' : 'Post'}
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Discussion Posts */}
          <div className="space-y-4">
            {communityPosts.map((post) => (
              <Card key={post.id}>
                <CardContent className="p-6">
                  <div className="flex gap-4">
                    <Avatar>
                      <AvatarFallback>{post.author.avatar}</AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <h4 className="font-semibold">{post.author.name}</h4>
                        <Badge variant="secondary" className="text-xs">
                          {post.author.title}
                        </Badge>
                        <span className="text-sm text-muted-foreground">
                          <MapPin className="w-3 h-3 inline mr-1" />
                          {post.author.location}
                        </span>
                      </div>
                      <p className="text-gray-700 mb-3">{post.content}</p>
                      <div className="flex flex-wrap gap-2 mb-3">
                        {post.tags.map((tag) => (
                          <Badge key={tag} variant="outline" className="text-xs">
                            {tag}
                          </Badge>
                        ))}
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4 text-sm text-muted-foreground">
                          <span>{post.timestamp}</span>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleLikePost(post.id)}
                            className={`flex items-center gap-1 ${post.isLiked ? 'text-red-600' : ''}`}
                          >
                            <Heart className="w-4 h-4" />
                            {post.likes}
                          </Button>
                          <Button variant="ghost" size="sm" className="flex items-center gap-1">
                            <MessageCircle className="w-4 h-4" />
                            {post.replies}
                          </Button>
                        </div>
                        <Button variant="ghost" size="sm">
                          <Share className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* Study Groups Tab */}
        <TabsContent value="groups" className="space-y-6">
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-bold">Study Groups</h2>
            <Button>
              <Plus className="w-4 h-4 mr-2" />
              Create Group
            </Button>
          </div>

          <div className="grid gap-6">
            {studyGroups.map((group) => (
              <Card key={group.id}>
                <CardContent className="p-6">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="text-xl font-semibold mb-2">{group.name}</h3>
                      <p className="text-muted-foreground mb-3">{group.description}</p>
                    </div>
                    <Button
                      variant={group.isJoined ? "outline" : "default"}
                      onClick={() => handleJoinGroup(group.id)}
                    >
                      {group.isJoined ? (
                        <>
                          <Users className="w-4 h-4 mr-2" />
                          Joined
                        </>
                      ) : (
                        <>
                          <UserPlus className="w-4 h-4 mr-2" />
                          Join Group
                        </>
                      )}
                    </Button>
                  </div>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                    <div className="flex items-center gap-2">
                      <Users className="w-4 h-4 text-muted-foreground" />
                      <span>{group.members} members</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <BookOpen className="w-4 h-4 text-muted-foreground" />
                      <span>{group.specialty}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4 text-muted-foreground" />
                      <span>{group.meetingTime}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <MapPin className="w-4 h-4 text-muted-foreground" />
                      <span>{group.location}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* Events Tab */}
        <TabsContent value="events" className="space-y-6">
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-bold">Upcoming Events</h2>
            <Button>
              <Plus className="w-4 h-4 mr-2" />
              Create Event
            </Button>
          </div>

          <div className="grid gap-6">
            {upcomingEvents.map((event) => (
              <Card key={event.id}>
                <CardContent className="p-6">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="text-xl font-semibold mb-2">{event.title}</h3>
                      <Badge className="mb-3">{event.type}</Badge>
                    </div>
                    <Button
                      variant={event.isRegistered ? "outline" : "default"}
                      onClick={() => handleRegisterEvent(event.id)}
                    >
                      {event.isRegistered ? "Registered" : "Register"}
                    </Button>
                  </div>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4 text-muted-foreground" />
                      <span>{event.date}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Clock className="w-4 h-4 text-muted-foreground" />
                      <span>{event.time}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Users className="w-4 h-4 text-muted-foreground" />
                      <span>{event.attendees} attending</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Stethoscope className="w-4 h-4 text-muted-foreground" />
                      <span>Host: {event.host}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* Mentorship Tab */}
        <TabsContent value="mentorship" className="space-y-6">
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-bold">Mentorship Program</h2>
            <div className="flex gap-2">
              <Button variant="outline">
                <Star className="w-4 h-4 mr-2" />
                Become a Mentor
              </Button>
              <Button>
                <UserPlus className="w-4 h-4 mr-2" />
                Find a Mentor
              </Button>
            </div>
          </div>

          {/* Mentorship Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <Card>
              <CardContent className="p-4 text-center">
                <div className="text-2xl font-bold text-blue-600">127</div>
                <div className="text-sm text-muted-foreground">Active Mentors</div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4 text-center">
                <div className="text-2xl font-bold text-green-600">342</div>
                <div className="text-sm text-muted-foreground">Successful Matches</div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4 text-center">
                <div className="text-2xl font-bold text-purple-600">94%</div>
                <div className="text-sm text-muted-foreground">Success Rate</div>
              </CardContent>
            </Card>
          </div>

          {/* Available Mentors */}
          <div className="grid gap-6">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-start gap-4">
                  <Avatar className="w-12 h-12">
                    <AvatarFallback>DR</AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <h3 className="text-lg font-semibold">Dr. Rebecca Williams</h3>
                      <Badge className="bg-green-100 text-green-800">Available</Badge>
                    </div>
                    <p className="text-sm text-muted-foreground mb-2">
                      Consultant Cardiologist • Imperial College Healthcare NHS Trust
                    </p>
                    <p className="text-sm mb-3">
                      Experienced in guiding international medical graduates through PLAB and specialty training. 
                      Specializes in cardiology pathway mentoring and NHS application processes.
                    </p>
                    <div className="flex flex-wrap gap-2 mb-4">
                      <Badge variant="outline">PLAB Guidance</Badge>
                      <Badge variant="outline">Cardiology</Badge>
                      <Badge variant="outline">NHS Applications</Badge>
                      <Badge variant="outline">Career Development</Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4 text-sm text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <Star className="w-4 h-4 text-yellow-500" />
                          4.9 (23 reviews)
                        </span>
                        <span>London, UK</span>
                      </div>
                      <Button size="sm">
                        <MessageCircle className="w-4 h-4 mr-2" />
                        Connect
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-start gap-4">
                  <Avatar className="w-12 h-12">
                    <AvatarFallback>JS</AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <h3 className="text-lg font-semibold">Dr. James Singh</h3>
                      <Badge className="bg-yellow-100 text-yellow-800">Busy</Badge>
                    </div>
                    <p className="text-sm text-muted-foreground mb-2">
                      Emergency Medicine Consultant • Manchester Royal Infirmary
                    </p>
                    <p className="text-sm mb-3">
                      Passionate about supporting international doctors in emergency medicine. 
                      Offers guidance on PLAB preparation, specialty applications, and work-life balance in the NHS.
                    </p>
                    <div className="flex flex-wrap gap-2 mb-4">
                      <Badge variant="outline">Emergency Medicine</Badge>
                      <Badge variant="outline">PLAB 2 OSCE</Badge>
                      <Badge variant="outline">Specialty Training</Badge>
                      <Badge variant="outline">Work-Life Balance</Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4 text-sm text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <Star className="w-4 h-4 text-yellow-500" />
                          4.8 (31 reviews)
                        </span>
                        <span>Manchester, UK</span>
                      </div>
                      <Button size="sm" variant="outline" disabled>
                        <Clock className="w-4 h-4 mr-2" />
                        Join Waitlist
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-start gap-4">
                  <Avatar className="w-12 h-12">
                    <AvatarFallback>AL</AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <h3 className="text-lg font-semibold">Dr. Amira Lopez</h3>
                      <Badge className="bg-green-100 text-green-800">Available</Badge>
                    </div>
                    <p className="text-sm text-muted-foreground mb-2">
                      GP Partner • Birmingham Health Centre
                    </p>
                    <p className="text-sm mb-3">
                      Former international medical graduate who successfully transitioned to UK general practice. 
                      Specializes in PLAB preparation strategies and GP training pathway guidance.
                    </p>
                    <div className="flex flex-wrap gap-2 mb-4">
                      <Badge variant="outline">General Practice</Badge>
                      <Badge variant="outline">PLAB 1 & 2</Badge>
                      <Badge variant="outline">GP Training</Badge>
                      <Badge variant="outline">Cultural Adaptation</Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4 text-sm text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <Star className="w-4 h-4 text-yellow-500" />
                          5.0 (18 reviews)
                        </span>
                        <span>Birmingham, UK</span>
                      </div>
                      <Button size="sm">
                        <MessageCircle className="w-4 h-4 mr-2" />
                        Connect
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Success Stories */}
          <Card className="bg-gradient-to-r from-slate-50 to-teal-700">
            <CardContent className="p-6">
              <h3 className="text-lg font-semibold mb-4">Success Stories</h3>
              <div className="space-y-4">
                <div className="flex gap-3">
                  <Avatar className="w-8 h-8">
                    <AvatarFallback>MK</AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="text-sm font-medium">Dr. Maya Kumar</p>
                    <p className="text-sm text-muted-foreground">
                      "Dr. Williams was instrumental in my PLAB success. Her guidance on clinical communication 
                      and NHS culture helped me pass PLAB 2 on my first attempt!"
                    </p>
                  </div>
                </div>
                <div className="flex gap-3">
                  <Avatar className="w-8 h-8">
                    <AvatarFallback>RN</AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="text-sm font-medium">Dr. Raj Nair</p>
                    <p className="text-sm text-muted-foreground">
                      "The mentorship program connected me with Dr. Singh who helped me navigate the specialty 
                      application process. Now I'm a registrar in emergency medicine!"
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}