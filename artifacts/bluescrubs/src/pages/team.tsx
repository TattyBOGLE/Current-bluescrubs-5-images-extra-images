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
      bio: "UK-trained General Practitioner (MRCGP) with over 10 years' NHS experience as a Salaried and Sessional GP in Central Manchester. Clinical Supervisor and PCN-level Audit Lead with a strong focus on chronic disease management, education, and quality improvement — bringing deep insight into the realities of UK primary care for international medical graduates.",
      qualifications: [
        "BSc (Hons) Biomedical Sciences, King's College London",
        "MBBS",
        "MRCGP",
        "PGCert Clinical Practice, Management & Education",
        "PGCert Advancing Diabetes Care",
        "GMC No. 7051255"
      ],
      experience: [
        "Portfolio Salaried/Locum GP, Central Manchester (2016 – present)",
        "Clinical Supervisor — mentoring GP trainees and junior clinicians",
        "CMN Audit Lead at PCN level — driving QOF and guideline adherence",
        "GP VTS, Northwest Deanery, Pennine Acute Trust (2012 – 2016)",
        "Foundation Training, Tameside General Hospital (2010 – 2012)"
      ],
      specialties: [
        "General Practice",
        "Chronic Disease Management",
        "Diabetes Care",
        "Clinical Audit & Quality Improvement",
        "Medical Education & Supervision"
      ],
      achievements: [
        "Led audits improving anticoagulation safety in AF and warfarin TTR monitoring",
        "Improved prescribing safety in bisphosphonates, clopidogrel/PPI, lipids and antihypertensives",
        "Contributed to national audits (NPDA, EVAR) supporting benchmarking",
        "Accredited Clinical and APEP Supervisor",
        "Nidan Black Belt karate instructor — 20+ years; medical relief work, Pakistan earthquake"
      ]
    },
    {
      name: "Keith Hunter",
      role: "Co-Founder & Creative Director",
      image: "/api/placeholder/150/150",
      bio: "Co-founder of Core Principles and one of the UK's leading authorities in training design, with 30 years across coaching, consulting and deep-tissue therapy. Best known for 20 years on the Track and Field coaching staff at Sale Harriers Manchester. A Leeds-trained graphic designer by background, Keith blends elite-coaching discipline with creative direction to shape the BlueScrubsPrep learner experience.",
      qualifications: [
        "BA Graphic Design, Leeds University (1982)",
        "Level 4 British Athletics Coach",
        "British Athletics — Mobilis Stabilise / Normalise / Functionalise Phase",
        "British Athletics — Strength & Conditioning",
        "Biomechanical Assessment — Sporting Therapy Organisation",
        "Myofascial Release & Structural Integration — Sporting Therapy Organisation",
        "Sports, Deep Tissue, Swedish & Pregnancy Massage Therapist"
      ],
      experience: [
        "Co-Founder, Core Principles",
        "Lead Jumps Coach, Sale Harriers Manchester",
        "20 years on the Track & Field coaching staff, Sale Harriers Manchester",
        "Lecturer in biomechanics, training design and event-specific courses",
        "Consultant in football player development and combine prep (2013 – present)",
        "Graphic Designer and Author, The Business in Manchester"
      ],
      specialties: [
        "Training Design & Curriculum Development",
        "Biomechanics & Speed/Power Training",
        "Strength & Conditioning",
        "Sports Therapy & Rehabilitation",
        "Graphic Design & Creative Direction"
      ],
      achievements: [
        "Level 4 British Athletics Coach — the sport's highest UK coaching qualification",
        "Coached Lee Whiteley to a Bronze medal at the 2013 World Championships",
        "Coached Clovis Asong (400m) to European and Commonwealth Junior Championships",
        "33 English Schools gold medallists coached",
        "Masterminded 4 English Schools gold medallists in 2011",
        "Level I, II and III certified; voted Ambassador for the Sporting Therapy Organisation",
        "England Athletics Local Coach Mentoring Programme"
      ],
      location: "Manchester, UK"
    }
  ];

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="p-3 bg-teal-100 rounded-full">
              <Users className="h-8 w-8 text-teal-700" />
            </div>
            <h1 className="text-3xl md:text-4xl font-bold text-slate-900">Who are BlueScrubsPrep</h1>
          </div>
          <p className="text-lg text-slate-600 max-w-3xl mx-auto">
            Meet the dedicated team behind BlueScrubsPrep — combining medical expertise with innovative technology
            to transform PLAB preparation for international medical graduates.
          </p>
        </div>

        {/* Vision & Mission */}
        <div className="mb-12">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <Card className="bg-white border-slate-200 rounded-2xl">
              <CardHeader>
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-teal-50 rounded-xl">
                    <Heart className="h-5 w-5 text-teal-700" />
                  </div>
                  <CardTitle className="text-slate-900">Our Mission</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-slate-700 leading-relaxed">
                  To empower international medical graduates with comprehensive, authentic PLAB preparation tools
                  that bridge the gap between medical knowledge and UK healthcare practice, ensuring successful
                  integration into the NHS.
                </p>
              </CardContent>
            </Card>

            <Card className="bg-white border-slate-200 rounded-2xl">
              <CardHeader>
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-teal-50 rounded-xl">
                    <Star className="h-5 w-5 text-teal-700" />
                  </div>
                  <CardTitle className="text-slate-900">Our Vision</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-slate-700 leading-relaxed">
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
            <Card key={index} className="overflow-hidden hover:shadow-xl transition-shadow rounded-2xl border-slate-200">
              <CardHeader className="bg-gradient-to-r from-teal-600 to-teal-700">
                <div className="flex items-start gap-4">
                  <div className="w-20 h-20 bg-white/20 rounded-full flex items-center justify-center flex-shrink-0">
                    {member.name.includes('Dr.') ? (
                      <Stethoscope className="h-10 w-10" style={{ color: '#ffffff' }} />
                    ) : (
                      <Code className="h-10 w-10" style={{ color: '#ffffff' }} />
                    )}
                  </div>
                  <div className="flex-1">
                    <h2 className="text-xl font-bold" style={{ color: '#ffffff' }}>{member.name}</h2>
                    <p style={{ color: 'rgba(255,255,255,0.9)' }}>{member.role}</p>
                    {member.location && (
                      <div className="flex items-center gap-1 mt-2" style={{ color: 'rgba(255,255,255,0.9)' }}>
                        <MapPin className="h-4 w-4" />
                        <span className="text-sm">{member.location}</span>
                      </div>
                    )}
                  </div>
                </div>
              </CardHeader>
              
              <CardContent className="p-6 space-y-6 bg-white">
                <p className="text-slate-700 leading-relaxed">{member.bio}</p>

                {/* Qualifications */}
                <div>
                  <h4 className="font-semibold text-slate-900 mb-3 flex items-center gap-2">
                    <Award className="h-4 w-4 text-teal-600" />
                    Qualifications
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {member.qualifications.map((qual, idx) => (
                      <Badge key={idx} variant="outline" className="bg-teal-50 text-teal-700 border-teal-200">
                        {qual}
                      </Badge>
                    ))}
                  </div>
                </div>

                {/* Experience */}
                <div>
                  <h4 className="font-semibold text-slate-900 mb-3">Experience</h4>
                  <ul className="space-y-1">
                    {member.experience.map((exp, idx) => (
                      <li key={idx} className="text-slate-600 text-sm flex items-start gap-2">
                        <span className="w-1.5 h-1.5 bg-teal-500 rounded-full mt-2 flex-shrink-0"></span>
                        {exp}
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Specialties */}
                <div>
                  <h4 className="font-semibold text-slate-900 mb-3">Specialties</h4>
                  <div className="flex flex-wrap gap-2">
                    {member.specialties.map((specialty, idx) => (
                      <Badge key={idx} variant="secondary" className="bg-slate-100 text-slate-700">
                        {specialty}
                      </Badge>
                    ))}
                  </div>
                </div>

                {/* Achievements */}
                <div>
                  <h4 className="font-semibold text-slate-900 mb-3">Key Achievements</h4>
                  <ul className="space-y-1">
                    {member.achievements.map((achievement, idx) => (
                      <li key={idx} className="text-slate-600 text-sm flex items-start gap-2">
                        <Star className="w-3 h-3 text-amber-500 mt-1 flex-shrink-0" />
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
          <h2 className="text-2xl font-bold text-slate-900 mb-8 text-center">Our Values</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="text-center p-6 hover:shadow-lg transition-shadow bg-white rounded-2xl border-slate-200">
              <div className="w-16 h-16 bg-teal-50 rounded-full flex items-center justify-center mx-auto mb-4">
                <Stethoscope className="h-8 w-8 text-teal-700" />
              </div>
              <h3 className="font-semibold text-slate-900 mb-2">Medical Excellence</h3>
              <p className="text-slate-600 text-sm">
                Authentic, evidence-based content aligned with UK medical standards and GMC guidelines.
              </p>
            </Card>

            <Card className="text-center p-6 hover:shadow-lg transition-shadow bg-white rounded-2xl border-slate-200">
              <div className="w-16 h-16 bg-teal-50 rounded-full flex items-center justify-center mx-auto mb-4">
                <Users className="h-8 w-8 text-teal-700" />
              </div>
              <h3 className="font-semibold text-slate-900 mb-2">Cultural Understanding</h3>
              <p className="text-slate-600 text-sm">
                Supporting international doctors with culturally-aware preparation and UK healthcare integration.
              </p>
            </Card>

            <Card className="text-center p-6 hover:shadow-lg transition-shadow bg-white rounded-2xl border-slate-200">
              <div className="w-16 h-16 bg-teal-50 rounded-full flex items-center justify-center mx-auto mb-4">
                <Code className="h-8 w-8 text-teal-700" />
              </div>
              <h3 className="font-semibold text-slate-900 mb-2">Innovation</h3>
              <p className="text-slate-600 text-sm">
                Cutting-edge technology and adaptive learning systems for personalised medical education.
              </p>
            </Card>
          </div>
        </div>

        {/* Contact Section */}
        <div className="text-center">
          <Card className="bg-white border-slate-200 rounded-2xl max-w-2xl mx-auto">
            <CardContent className="p-8">
              <div className="w-14 h-14 bg-teal-50 rounded-full flex items-center justify-center mx-auto mb-4">
                <Mail className="h-7 w-7 text-teal-700" />
              </div>
              <h3 className="text-xl font-semibold text-slate-900 mb-3">Get in Touch</h3>
              <p className="text-slate-600 mb-6">
                Have questions about BlueScrubsPrep or want to share your PLAB success story?
                We'd love to hear from you.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button className="bg-gradient-to-r from-teal-500 to-teal-600 hover:from-teal-600 hover:to-teal-700" style={{ color: '#ffffff' }}>
                  <Mail className="h-4 w-4 mr-2" />
                  Contact Us
                </Button>
                <Button variant="outline" className="border-teal-300 text-teal-700 hover:bg-teal-50">
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