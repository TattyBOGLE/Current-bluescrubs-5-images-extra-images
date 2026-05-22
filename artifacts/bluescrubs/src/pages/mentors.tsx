import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Star, MessageCircle, Calendar, Clock, Users, Award, Video, BookOpen } from "lucide-react";

export default function Mentors() {
  const [selectedMentor, setSelectedMentor] = useState(null);

  const mentors = [
    {
      id: 1,
      name: "Dr. Sarah Ahmed",
      specialty: "Emergency Medicine",
      experience: "8 years NHS",
      rating: 4.9,
      reviews: 156,
      location: "London",
      availability: "Available",
      price: "£45/hour",
      avatar: "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=100&h=100&fit=crop&crop=face",
      bio: "NHS Emergency Medicine consultant with extensive PLAB mentoring experience. Specialized in helping international medical graduates transition to UK healthcare.",
      languages: ["English", "Arabic", "Urdu"],
      achievements: ["PLAB Mentor of the Year 2023", "Royal College Fellow"],
      sessionTypes: ["1-on-1 Mentoring", "OSCE Practice", "Career Guidance"]
    },
    {
      id: 2,
      name: "Dr. James Morrison",
      specialty: "General Practice",
      experience: "12 years NHS",
      rating: 4.8,
      reviews: 203,
      location: "Manchester",
      availability: "Available",
      price: "£40/hour",
      avatar: "https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=100&h=100&fit=crop&crop=face",
      bio: "GP Partner with passion for medical education. Helps PLAB candidates understand UK primary care and develop clinical reasoning skills.",
      languages: ["English", "Spanish"],
      achievements: ["GMC Medical Education Award", "RCGP Trainer"],
      sessionTypes: ["Clinical Skills", "Communication Training", "NHS System Overview"]
    },
    {
      id: 3,
      name: "Dr. Priya Patel",
      specialty: "Internal Medicine",
      experience: "6 years NHS",
      rating: 4.9,
      reviews: 98,
      location: "Birmingham",
      availability: "Busy",
      price: "£50/hour",
      avatar: "https://images.unsplash.com/photo-1594824804732-ca8db76fb37d?w=100&h=100&fit=crop&crop=face",
      bio: "Internal Medicine registrar who recently completed PLAB. Provides contemporary insights into exam preparation and NHS application process.",
      languages: ["English", "Hindi", "Gujarati"],
      achievements: ["PLAB 1 Score: 198/300", "PLAB 2 First Attempt Pass"],
      sessionTypes: ["Recent PLAB Experience", "Study Strategies", "Interview Preparation"]
    },
    {
      id: 4,
      name: "Dr. Michael Chen",
      specialty: "Cardiology",
      experience: "10 years NHS",
      rating: 4.7,
      reviews: 142,
      location: "Edinburgh",
      availability: "Available",
      price: "£55/hour",
      avatar: "https://images.unsplash.com/photo-1582750433449-648ed127bb54?w=100&h=100&fit=crop&crop=face",
      bio: "Cardiology consultant with expertise in complex medical cases. Excellent for advanced clinical reasoning and diagnostic skills development.",
      languages: ["English", "Mandarin"],
      achievements: ["British Cardiac Society Fellow", "Clinical Excellence Award"],
      sessionTypes: ["Advanced Clinical Cases", "Research Guidance", "Specialist Training"]
    }
  ];

  const upcomingSessions = [
    {
      mentor: "Dr. Sarah Ahmed",
      date: "June 25, 2024",
      time: "14:00-15:00",
      type: "OSCE Practice",
      status: "confirmed"
    },
    {
      mentor: "Dr. James Morrison", 
      date: "June 27, 2024",
      time: "16:00-17:00",
      type: "Career Guidance",
      status: "pending"
    }
  ];

  const testimonials = [
    {
      student: "Ahmed Hassan",
      mentor: "Dr. Sarah Ahmed",
      rating: 5,
      text: "Dr. Ahmed's guidance was invaluable for my PLAB 2 preparation. Her OSCE practice sessions helped me pass on the first attempt.",
      date: "May 2024"
    },
    {
      student: "Maria Rodriguez",
      mentor: "Dr. James Morrison",
      rating: 5,
      text: "Excellent mentor who really understands the challenges of international medical graduates. His NHS insights were incredibly helpful.",
      date: "April 2024"
    },
    {
      student: "Raj Kumar",
      mentor: "Dr. Priya Patel",
      rating: 5,
      text: "As someone who recently passed PLAB, Dr. Patel provided current and relevant study strategies that made a huge difference.",
      date: "March 2024"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-teal-700 p-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-3 mb-4">
            <Users className="w-8 h-8 text-blue-600" />
            <h1 className="text-3xl font-bold text-gray-900">Expert Medical Mentors</h1>
          </div>
          <p className="text-gray-600 max-w-3xl mx-auto">
            Connect with qualified NHS doctors who provide personalized guidance, OSCE practice, 
            and career advice to help you succeed in your PLAB journey.
          </p>
        </div>

        <Tabs defaultValue="browse" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="browse">Browse Mentors</TabsTrigger>
            <TabsTrigger value="sessions">My Sessions</TabsTrigger>
            <TabsTrigger value="reviews">Reviews</TabsTrigger>
            <TabsTrigger value="resources">Resources</TabsTrigger>
          </TabsList>

          {/* Browse Mentors */}
          <TabsContent value="browse" className="space-y-6">
            <div className="grid lg:grid-cols-2 xl:grid-cols-3 gap-6">
              {mentors.map((mentor) => (
                <Card key={mentor.id} className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="flex items-start gap-4">
                      <Avatar className="w-16 h-16">
                        <AvatarImage src={mentor.avatar} alt={mentor.name} />
                        <AvatarFallback>{mentor.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <CardTitle className="text-lg">{mentor.name}</CardTitle>
                        <p className="text-blue-600 font-medium">{mentor.specialty}</p>
                        <p className="text-gray-600 text-sm">{mentor.experience}</p>
                      </div>
                      <Badge variant={mentor.availability === 'Available' ? 'default' : 'secondary'}>
                        {mentor.availability}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex items-center gap-4">
                        <div className="flex items-center gap-1">
                          <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                          <span className="font-medium">{mentor.rating}</span>
                          <span className="text-gray-500">({mentor.reviews} reviews)</span>
                        </div>
                        <div className="text-lg font-bold text-green-600">{mentor.price}</div>
                      </div>

                      <p className="text-gray-700 text-sm">{mentor.bio}</p>

                      <div>
                        <h4 className="font-medium mb-2">Languages</h4>
                        <div className="flex flex-wrap gap-1">
                          {mentor.languages.map((lang) => (
                            <Badge key={lang} variant="outline" className="text-xs">
                              {lang}
                            </Badge>
                          ))}
                        </div>
                      </div>

                      <div>
                        <h4 className="font-medium mb-2">Session Types</h4>
                        <div className="flex flex-wrap gap-1">
                          {mentor.sessionTypes.map((type) => (
                            <Badge key={type} variant="secondary" className="text-xs">
                              {type}
                            </Badge>
                          ))}
                        </div>
                      </div>

                      <div className="flex gap-2">
                        <Button className="flex-1">
                          <Calendar className="w-4 h-4 mr-2" />
                          Book Session
                        </Button>
                        <Button variant="outline">
                          <MessageCircle className="w-4 h-4 mr-2" />
                          Message
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* My Sessions */}
          <TabsContent value="sessions" className="space-y-6">
            <div className="grid lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Upcoming Sessions</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {upcomingSessions.map((session, index) => (
                      <div key={index} className="p-4 border rounded-lg">
                        <div className="flex items-center justify-between mb-2">
                          <h4 className="font-medium">{session.mentor}</h4>
                          <Badge variant={session.status === 'confirmed' ? 'default' : 'secondary'}>
                            {session.status}
                          </Badge>
                        </div>
                        <div className="space-y-1 text-sm text-gray-600">
                          <div className="flex items-center gap-2">
                            <Calendar className="w-4 h-4" />
                            <span>{session.date}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Clock className="w-4 h-4" />
                            <span>{session.time}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <BookOpen className="w-4 h-4" />
                            <span>{session.type}</span>
                          </div>
                        </div>
                        <div className="flex gap-2 mt-3">
                          <Button size="sm">Join Session</Button>
                          <Button size="sm" variant="outline">Reschedule</Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Session History</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="text-center py-8 text-gray-500">
                      <BookOpen className="w-12 h-12 mx-auto mb-3 opacity-50" />
                      <p>No completed sessions yet</p>
                      <p className="text-sm">Book your first mentoring session to get started</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Session Statistics</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-4 gap-4">
                  <div className="text-center p-4 bg-blue-50 rounded-lg">
                    <div className="text-2xl font-bold text-blue-600">2</div>
                    <div className="text-sm text-gray-600">Sessions Booked</div>
                  </div>
                  <div className="text-center p-4 bg-green-50 rounded-lg">
                    <div className="text-2xl font-bold text-green-600">0</div>
                    <div className="text-sm text-gray-600">Sessions Completed</div>
                  </div>
                  <div className="text-center p-4 bg-purple-50 rounded-lg">
                    <div className="text-2xl font-bold text-purple-600">2</div>
                    <div className="text-sm text-gray-600">Hours Scheduled</div>
                  </div>
                  <div className="text-center p-4 bg-orange-50 rounded-lg">
                    <div className="text-2xl font-bold text-orange-600">3</div>
                    <div className="text-sm text-gray-600">Mentors Connected</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Reviews */}
          <TabsContent value="reviews" className="space-y-6">
            <div className="grid lg:grid-cols-2 gap-6">
              {testimonials.map((testimonial, index) => (
                <Card key={index}>
                  <CardContent className="p-6">
                    <div className="flex items-start gap-4">
                      <Avatar>
                        <AvatarFallback>{testimonial.student[0]}</AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <h4 className="font-medium">{testimonial.student}</h4>
                          <div className="flex">
                            {[...Array(testimonial.rating)].map((_, i) => (
                              <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                            ))}
                          </div>
                        </div>
                        <p className="text-gray-700 text-sm mb-2">{testimonial.text}</p>
                        <div className="flex justify-between text-xs text-gray-500">
                          <span>Mentor: {testimonial.mentor}</span>
                          <span>{testimonial.date}</span>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Resources */}
          <TabsContent value="resources" className="space-y-6">
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Video className="w-5 h-5" />
                    Video Sessions
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600 mb-4">
                    High-quality video calls with screen sharing and recording capabilities.
                  </p>
                  <Button className="w-full">Learn More</Button>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <BookOpen className="w-5 h-5" />
                    Study Materials
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600 mb-4">
                    Access exclusive study guides and practice materials from mentors.
                  </p>
                  <Button className="w-full">Browse Materials</Button>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Award className="w-5 h-5" />
                    Success Stories
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600 mb-4">
                    Read about successful PLAB candidates and their mentor experiences.
                  </p>
                  <Button className="w-full">Read Stories</Button>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>How Mentoring Works</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-4 gap-6">
                  <div className="text-center">
                    <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
                      <span className="text-blue-600 font-bold">1</span>
                    </div>
                    <h4 className="font-medium mb-2">Choose Mentor</h4>
                    <p className="text-sm text-gray-600">Browse and select from qualified NHS doctors</p>
                  </div>
                  <div className="text-center">
                    <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
                      <span className="text-green-600 font-bold">2</span>
                    </div>
                    <h4 className="font-medium mb-2">Book Session</h4>
                    <p className="text-sm text-gray-600">Schedule at your convenient time</p>
                  </div>
                  <div className="text-center">
                    <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-3">
                      <span className="text-purple-600 font-bold">3</span>
                    </div>
                    <h4 className="font-medium mb-2">Learn & Practice</h4>
                    <p className="text-sm text-gray-600">Get personalized guidance and feedback</p>
                  </div>
                  <div className="text-center">
                    <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-3">
                      <span className="text-orange-600 font-bold">4</span>
                    </div>
                    <h4 className="font-medium mb-2">Succeed</h4>
                    <p className="text-sm text-gray-600">Pass PLAB and start your NHS career</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}