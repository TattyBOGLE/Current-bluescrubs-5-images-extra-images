import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  Users, 
  Award, 
  MapPin, 
  Stethoscope, 
  Code, 
  Heart,
  Star,
  Mail,
  Linkedin,
  Github
} from "lucide-react";

export default function Team() {
  const team = [
    {
      name: "Dr. Yasar Ahmad",
      role: "Medical Director & Co-Founder",
      image: "/api/placeholder/150/150",
      bio: "Leading NHS doctor with extensive experience in medical education and PLAB preparation. Dr. Ahmad brings deep clinical expertise and understanding of the challenges faced by international medical graduates seeking to practice in the UK.",
      qualifications: [
        "MBBS",
        "MRCP",
        "NHS Consultant",
        "Medical Education Specialist"
      ],
      experience: [
        "10+ years NHS clinical experience",
        "PLAB examination expert",
        "Medical education curriculum developer",
        "International medical graduate mentor"
      ],
      specialties: [
        "Internal Medicine",
        "Medical Education",
        "PLAB Preparation",
        "Clinical Skills Training"
      ],
      achievements: [
        "Helped 500+ international doctors pass PLAB",
        "Developed UK-specific clinical scenarios",
        "NHS training programme contributor",
        "Medical education research publications"
      ]
    },
    {
      name: "Keith Hunter",
      role: "Co-Founder & Creative Director",
      image: "/api/placeholder/150/150", 
      bio: "Creative technology leader with 25+ years of experience in digital innovation and educational platform development. Keith combines technical expertise with creative vision to build engaging medical education experiences.",
      qualifications: [
        "BA Hons Dip CSD",
        "Certified Sports Massage Therapist",
        "Advanced Digital Design Specialist",
        "Educational Technology Expert"
      ],
      experience: [
        "25+ years creative technology leadership",
        "Educational platform development",
        "Digital innovation specialist",
        "Sports performance coach"
      ],
      specialties: [
        "Educational Technology",
        "User Experience Design",
        "Platform Development",
        "Creative Direction"
      ],
      achievements: [
        "Coach of the Year 2012",
        "Queens Award 2020",
        "Coached 1 European bronze medalist",
        "One European long jump champion",
        "One world champion bronze medalist"
      ],
      location: "Manchester, UK"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-teal-700">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="p-3 bg-blue-500/10 rounded-full">
              <Users className="h-8 w-8 text-blue-600" />
            </div>
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900">Who are BlueScrubsPrep</h1>
          </div>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            Meet the dedicated team behind BlueScrubsPrep - combining medical expertise with innovative technology 
            to transform PLAB preparation for international medical graduates.
          </p>
        </div>

        {/* Vision & Mission */}
        <div className="mb-12">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <Card className="bg-gradient-to-br from-slate-50 to-teal-50 border-slate-200">
              <CardHeader>
                <div className="flex items-center gap-3">
                  <Heart className="h-6 w-6 text-blue-600" />
                  <CardTitle className="text-blue-900">Our Mission</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-blue-800">
                  To empower international medical graduates with comprehensive, authentic PLAB preparation tools 
                  that bridge the gap between medical knowledge and UK healthcare practice, ensuring successful 
                  integration into the NHS.
                </p>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-teal-500 to-teal-700 border-purple-200">
              <CardHeader>
                <div className="flex items-center gap-3">
                  <Star className="h-6 w-6 text-purple-600" />
                  <CardTitle className="text-purple-900">Our Vision</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-purple-800">
                  To become the leading platform for medical education technology, providing innovative, 
                  accessible, and culturally-aware learning experiences that prepare doctors for excellence 
                  in global healthcare systems.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Team Members */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
          {team.map((member, index) => (
            <Card key={index} className="overflow-hidden hover:shadow-xl transition-shadow">
              <CardHeader className="bg-gradient-to-r from-teal-600 to-teal-700 text-white">
                <div className="flex items-start gap-4">
                  <div className="w-20 h-20 bg-white/20 rounded-full flex items-center justify-center">
                    {member.name.includes('Dr.') ? (
                      <Stethoscope className="h-10 w-10 text-white" />
                    ) : (
                      <Code className="h-10 w-10 text-white" />
                    )}
                  </div>
                  <div className="flex-1">
                    <h2 className="text-xl font-bold">{member.name}</h2>
                    <p className="text-blue-100">{member.role}</p>
                    {member.location && (
                      <div className="flex items-center gap-1 mt-2">
                        <MapPin className="h-4 w-4" />
                        <span className="text-sm text-blue-100">{member.location}</span>
                      </div>
                    )}
                  </div>
                </div>
              </CardHeader>
              
              <CardContent className="p-6 space-y-6">
                <p className="text-gray-700 leading-relaxed">{member.bio}</p>
                
                {/* Qualifications */}
                <div>
                  <h4 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                    <Award className="h-4 w-4 text-blue-600" />
                    Qualifications
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {member.qualifications.map((qual, idx) => (
                      <Badge key={idx} variant="outline" className="bg-blue-50 text-blue-700 border-slate-200">
                        {qual}
                      </Badge>
                    ))}
                  </div>
                </div>

                {/* Experience */}
                <div>
                  <h4 className="font-semibold text-gray-900 mb-3">Experience</h4>
                  <ul className="space-y-1">
                    {member.experience.map((exp, idx) => (
                      <li key={idx} className="text-gray-600 text-sm flex items-start gap-2">
                        <span className="w-1.5 h-1.5 bg-blue-500 rounded-full mt-2 flex-shrink-0"></span>
                        {exp}
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Specialties */}
                <div>
                  <h4 className="font-semibold text-gray-900 mb-3">Specialties</h4>
                  <div className="flex flex-wrap gap-2">
                    {member.specialties.map((specialty, idx) => (
                      <Badge key={idx} variant="secondary" className="bg-purple-50 text-purple-700">
                        {specialty}
                      </Badge>
                    ))}
                  </div>
                </div>

                {/* Achievements */}
                <div>
                  <h4 className="font-semibold text-gray-900 mb-3">Key Achievements</h4>
                  <ul className="space-y-1">
                    {member.achievements.map((achievement, idx) => (
                      <li key={idx} className="text-gray-600 text-sm flex items-start gap-2">
                        <Star className="w-3 h-3 text-yellow-500 mt-1 flex-shrink-0" />
                        {achievement}
                      </li>
                    ))}
                  </ul>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Company Values */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-8 text-center">Our Values</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="text-center p-6 hover:shadow-lg transition-shadow">
              <div className="w-16 h-16 bg-blue-500/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <Stethoscope className="h-8 w-8 text-blue-600" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Medical Excellence</h3>
              <p className="text-gray-600 text-sm">
                Authentic, evidence-based content aligned with UK medical standards and GMC guidelines.
              </p>
            </Card>

            <Card className="text-center p-6 hover:shadow-lg transition-shadow">
              <div className="w-16 h-16 bg-purple-500/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <Users className="h-8 w-8 text-purple-600" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Cultural Understanding</h3>
              <p className="text-gray-600 text-sm">
                Supporting international doctors with culturally-aware preparation and UK healthcare integration.
              </p>
            </Card>

            <Card className="text-center p-6 hover:shadow-lg transition-shadow">
              <div className="w-16 h-16 bg-green-500/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <Code className="h-8 w-8 text-green-600" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Innovation</h3>
              <p className="text-gray-600 text-sm">
                Cutting-edge technology and adaptive learning systems for personalised medical education.
              </p>
            </Card>
          </div>
        </div>

        {/* Contact Section */}
        <div className="text-center">
          <Card className="bg-gradient-to-r from-slate-50 to-teal-700 border-slate-200 max-w-2xl mx-auto">
            <CardContent className="p-8">
              <Mail className="h-12 w-12 text-blue-600 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-blue-900 mb-4">Get in Touch</h3>
              <p className="text-blue-700 mb-6">
                Have questions about BlueScrubsPrep or want to share your PLAB success story? 
                We'd love to hear from you.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button className="bg-blue-600 hover:bg-blue-700">
                  <Mail className="h-4 w-4 mr-2" />
                  Contact Us
                </Button>
                <Button variant="outline" className="border-teal-300 text-blue-700 hover:bg-blue-50">
                  <Users className="h-4 w-4 mr-2" />
                  Join Community
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}