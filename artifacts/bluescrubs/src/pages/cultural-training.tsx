import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Flag, Users, MessageCircle, Heart, Clock, CheckCircle, Book, Globe } from "lucide-react";

export default function CulturalTraining() {
  const [selectedScenario, setSelectedScenario] = useState(0);

  const culturalModules = [
    {
      title: "UK Healthcare Communication Style",
      progress: 85,
      topics: ["Professional Courtesy", "Patient-Centered Language", "Hierarchy Understanding"],
      duration: "45 minutes",
      completed: true
    },
    {
      title: "UK Healthcare System",
      progress: 70,
      topics: ["GP Referral System", "Hospital Structure", "Patient Rights"],
      duration: "60 minutes", 
      completed: false
    },
    {
      title: "Cultural Sensitivity",
      progress: 90,
      topics: ["Diverse Populations", "Religious Considerations", "Equality & Diversity"],
      duration: "40 minutes",
      completed: true
    },
    {
      title: "Professional Boundaries",
      progress: 65,
      topics: ["Doctor-Patient Relationship", "Confidentiality", "Consent Procedures"],
      duration: "50 minutes",
      completed: false
    }
  ];

  const communicationScenarios = [
    {
      title: "Breaking Bad News",
      setting: "Oncology Consultation",
      patient: "Mrs. Smith, 58, breast cancer diagnosis",
      challenge: "First time cancer diagnosis, patient very anxious",
      keyPoints: [
        "Use clear, simple language",
        "Allow time for emotional response", 
        "Offer support resources",
        "Check understanding frequently"
      ],
      culturalNotes: "UK patients expect direct but compassionate communication. Avoid euphemisms."
    },
    {
      title: "Dealing with Complaints",
      setting: "Emergency Department",
      patient: "Mr. Johnson, 45, waiting time complaint",
      challenge: "Patient angry about 4-hour wait, demanding immediate attention",
      keyPoints: [
        "Acknowledge concerns empathetically",
        "Explain triage system clearly",
        "Apologize for inconvenience",
        "Provide realistic timeframes"
      ],
      culturalNotes: "British patients value politeness and fair queuing. Explain UK healthcare resource constraints."
    },
    {
      title: "Religious Considerations",
      setting: "Medical Ward",
      patient: "Ms. Rahman, 35, Muslim patient, Ramadan",
      challenge: "Medication timing conflicts with fasting requirements",
      keyPoints: [
        "Respect religious practices",
        "Discuss flexible dosing options",
        "Involve family if appropriate",
        "Consult chaplaincy services"
      ],
      culturalNotes: "UK has diverse religious communities. Show cultural competence and respect."
    }
  ];

  const nhsValues = [
    {
      value: "Working together for patients",
      description: "Patients come first in everything we do",
      examples: ["Patient-centered care", "Collaborative decision making", "Holistic treatment approach"]
    },
    {
      value: "Respect and dignity",
      description: "We value every person as an individual",
      examples: ["Cultural sensitivity", "Privacy protection", "Equal treatment for all"]
    },
    {
      value: "Commitment to quality of care",
      description: "We earn the trust placed in us",
      examples: ["Evidence-based practice", "Continuous improvement", "Patient safety priority"]
    },
    {
      value: "Compassion",
      description: "We ensure that compassion is central to the care we provide",
      examples: ["Empathetic communication", "Emotional support", "Understanding patient needs"]
    },
    {
      value: "Improving lives",
      description: "We strive to improve health and wellbeing",
      examples: ["Preventive care", "Health promotion", "Community health focus"]
    },
    {
      value: "Everyone counts",
      description: "We use our resources for the benefit of the whole community",
      examples: ["Equality and diversity", "Accessible healthcare", "Fair resource allocation"]
    }
  ];

  const practicalTips = [
    {
      category: "Language & Communication",
      tips: [
        "Use 'please' and 'thank you' frequently - politeness is highly valued",
        "Avoid interrupting patients - allow them to finish speaking",
        "Use 'I'm sorry' for empathy, not admission of fault",
        "Address patients formally unless invited to use first names"
      ]
    },
    {
      category: "Professional Behavior",
      tips: [
        "Arrive punctually for all appointments and meetings",
        "Dress professionally - smart casual or formal attire",
        "Maintain eye contact during conversations",
        "Show respect for all team members regardless of role"
      ]
    },
    {
      category: "Patient Interaction",
      tips: [
        "Explain procedures clearly before performing them",
        "Respect patient autonomy and right to refuse treatment",
        "Involve patients in decision-making processes",
        "Be aware of non-verbal communication and body language"
      ]
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-teal-50 p-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-3 mb-4">
            <Flag className="w-8 h-8 text-red-600" />
            <h1 className="text-3xl font-bold text-gray-900">UK Healthcare Culture Training</h1>
          </div>
          <p className="text-gray-600 max-w-3xl mx-auto">
            Master UK healthcare culture, medical values, and professional communication standards. 
            Essential preparation for working effectively in the British healthcare system.
          </p>
        </div>

        <Tabs defaultValue="modules" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="modules">Training Modules</TabsTrigger>
            <TabsTrigger value="scenarios">Communication Scenarios</TabsTrigger>
            <TabsTrigger value="values">UK Healthcare Values</TabsTrigger>
            <TabsTrigger value="tips">Practical Tips</TabsTrigger>
          </TabsList>

          {/* Training Modules */}
          <TabsContent value="modules" className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              {culturalModules.map((module, index) => (
                <Card key={index} className={module.completed ? 'bg-green-50 border-green-200' : ''}>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-lg">{module.title}</CardTitle>
                      {module.completed && <CheckCircle className="w-5 h-5 text-green-600" />}
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <Clock className="w-4 h-4" />
                        <span>{module.duration}</span>
                      </div>
                      
                      <div>
                        <div className="flex justify-between text-sm mb-1">
                          <span>Progress</span>
                          <span>{module.progress}%</span>
                        </div>
                        <Progress value={module.progress} className="h-2" />
                      </div>

                      <div>
                        <h4 className="font-medium mb-2">Topics Covered:</h4>
                        <div className="space-y-1">
                          {module.topics.map((topic, topicIndex) => (
                            <div key={topicIndex} className="flex items-center gap-2 text-sm">
                              <div className="w-1.5 h-1.5 bg-blue-600 rounded-full"></div>
                              <span>{topic}</span>
                            </div>
                          ))}
                        </div>
                      </div>

                      <Button className="w-full" variant={module.completed ? "outline" : "default"}>
                        {module.completed ? "Review Module" : "Continue Learning"}
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Communication Scenarios */}
          <TabsContent value="scenarios" className="space-y-6">
            <div className="grid lg:grid-cols-3 gap-4 mb-6">
              {communicationScenarios.map((scenario, index) => (
                <Button
                  key={index}
                  variant={selectedScenario === index ? "default" : "outline"}
                  className="h-auto p-4 text-left"
                  onClick={() => setSelectedScenario(index)}
                >
                  <div>
                    <div className="font-medium">{scenario.title}</div>
                    <div className="text-sm opacity-75">{scenario.setting}</div>
                  </div>
                </Button>
              ))}
            </div>

            <Card>
              <CardHeader>
                <CardTitle>{communicationScenarios[selectedScenario].title}</CardTitle>
                <Badge variant="outline">{communicationScenarios[selectedScenario].setting}</Badge>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div>
                    <h4 className="font-medium mb-2">Patient Profile</h4>
                    <p className="text-gray-700">{communicationScenarios[selectedScenario].patient}</p>
                  </div>

                  <div>
                    <h4 className="font-medium mb-2">Challenge</h4>
                    <p className="text-gray-700">{communicationScenarios[selectedScenario].challenge}</p>
                  </div>

                  <div>
                    <h4 className="font-medium mb-2">Key Communication Points</h4>
                    <div className="space-y-2">
                      {communicationScenarios[selectedScenario].keyPoints.map((point, index) => (
                        <div key={index} className="flex items-start gap-2">
                          <CheckCircle className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                          <span className="text-gray-700">{point}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="p-4 bg-blue-50 rounded-lg">
                    <h4 className="font-medium mb-2 text-blue-900">UK Cultural Context</h4>
                    <p className="text-blue-800">{communicationScenarios[selectedScenario].culturalNotes}</p>
                  </div>

                  <Button className="w-full">
                    <MessageCircle className="w-4 h-4 mr-2" />
                    Practice This Scenario
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* UK Healthcare Values */}
          <TabsContent value="values" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Heart className="w-5 h-5 text-red-600" />
                  UK Healthcare Constitution Values
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-2 gap-6">
                  {nhsValues.map((item, index) => (
                    <div key={index} className="p-4 border rounded-lg">
                      <h3 className="font-semibold text-blue-900 mb-2">{item.value}</h3>
                      <p className="text-gray-700 mb-3">{item.description}</p>
                      <div>
                        <h4 className="font-medium mb-2">In Practice:</h4>
                        <div className="space-y-1">
                          {item.examples.map((example, exampleIndex) => (
                            <div key={exampleIndex} className="flex items-center gap-2 text-sm text-gray-600">
                              <div className="w-1 h-1 bg-blue-600 rounded-full"></div>
                              <span>{example}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Practical Tips */}
          <TabsContent value="tips" className="space-y-6">
            {practicalTips.map((section, index) => (
              <Card key={index}>
                <CardHeader>
                  <CardTitle>{section.category}</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {section.tips.map((tip, tipIndex) => (
                      <div key={tipIndex} className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
                        <Users className="w-4 h-4 text-blue-600 mt-0.5 flex-shrink-0" />
                        <span className="text-gray-700">{tip}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Globe className="w-5 h-5" />
                  Cultural Integration Assessment
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <p className="text-gray-700">
                    Test your understanding of UK healthcare culture with interactive scenarios and receive 
                    personalized feedback on your cultural competency.
                  </p>
                  <div className="grid md:grid-cols-3 gap-4">
                    <div className="text-center p-4 bg-blue-50 rounded-lg">
                      <div className="text-2xl font-bold text-blue-600">15</div>
                      <div className="text-sm text-gray-600">Scenarios Completed</div>
                    </div>
                    <div className="text-center p-4 bg-green-50 rounded-lg">
                      <div className="text-2xl font-bold text-green-600">88%</div>
                      <div className="text-sm text-gray-600">Cultural Competency</div>
                    </div>
                    <div className="text-center p-4 bg-purple-50 rounded-lg">
                      <div className="text-2xl font-bold text-purple-600">Bronze</div>
                      <div className="text-sm text-gray-600">Cultural Badge</div>
                    </div>
                  </div>
                  <Button className="w-full">
                    <Book className="w-4 h-4 mr-2" />
                    Take Cultural Assessment
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}