import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  MapPin, Calendar, Clock, Users, Stethoscope, Building, 
  Search, Filter, Star, Phone, Mail, Globe, ChevronRight,
  GraduationCap, Award, BookOpen, UserCheck, Heart, Brain
} from 'lucide-react';

interface Placement {
  id: string;
  hospitalName: string;
  department: string;
  specialty: string;
  location: {
    city: string;
    region: string;
    postcode: string;
  };
  duration: string;
  startDate: string;
  endDate: string;
  availableSpots: number;
  totalSpots: number;
  requirements: string[];
  description: string;
  supervisor: {
    name: string;
    title: string;
    email: string;
  };
  rating: number;
  reviews: number;
  applicationDeadline: string;
  benefits: string[];
  contact: {
    phone: string;
    email: string;
    website: string;
  };
  isApplied: boolean;
  difficulty: 'Foundation' | 'Intermediate' | 'Advanced';
  tags: string[];
}

export default function Placements() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSpecialty, setSelectedSpecialty] = useState('all');
  const [selectedRegion, setSelectedRegion] = useState('all');
  const [selectedTab, setSelectedTab] = useState('available');

  // Mock data - in real app this would come from API
  const placements: Placement[] = [
    {
      id: '1',
      hospitalName: 'Royal London Hospital',
      department: 'Emergency Medicine',
      specialty: 'Emergency Medicine',
      location: {
        city: 'London',
        region: 'London',
        postcode: 'E1 1BB'
      },
      duration: '6 months',
      startDate: '2024-03-01',
      endDate: '2024-08-31',
      availableSpots: 3,
      totalSpots: 5,
      requirements: ['PLAB 2 passed', 'GMC Registration', 'Basic Life Support'],
      description: 'Excellent opportunity to gain experience in a busy emergency department. Exposure to major trauma, cardiac arrests, and acute medical emergencies.',
      supervisor: {
        name: 'Dr. Sarah Ahmed',
        title: 'Consultant Emergency Medicine',
        email: 's.ahmed@bartshealth.nhs.uk'
      },
      rating: 4.8,
      reviews: 24,
      applicationDeadline: '2024-02-15',
      benefits: ['Teaching program', 'Research opportunities', 'Mentorship', 'Career guidance'],
      contact: {
        phone: '+44 20 3416 5000',
        email: 'enquiries@NHSprep.co.uk',
        website: 'www.bartshealth.nhs.uk'
      },
      isApplied: false,
      difficulty: 'Intermediate',
      tags: ['Urban', 'Major Trauma Centre', 'Teaching Hospital']
    },
    {
      id: '2',
      hospitalName: 'Manchester Royal Infirmary',
      department: 'General Medicine',
      specialty: 'Internal Medicine',
      location: {
        city: 'Manchester',
        region: 'North West',
        postcode: 'M13 9WL'
      },
      duration: '4 months',
      startDate: '2024-04-01',
      endDate: '2024-07-31',
      availableSpots: 2,
      totalSpots: 4,
      requirements: ['PLAB 2 passed', 'GMC Registration', 'Previous hospital experience preferred'],
      description: 'Join our general medicine team in a vibrant teaching hospital. Great exposure to complex medical cases and multidisciplinary team working.',
      supervisor: {
        name: 'Dr. James Wilson',
        title: 'Consultant Physician',
        email: 'j.wilson@mft.nhs.uk'
      },
      rating: 4.6,
      reviews: 18,
      applicationDeadline: '2024-02-28',
      benefits: ['Weekly teaching', 'Audit opportunities', 'Conference attendance', 'Professional development'],
      contact: {
        phone: '+44 161 276 1234',
        email: 'medical.education@mft.nhs.uk',
        website: 'www.mft.nhs.uk'
      },
      isApplied: true,
      difficulty: 'Foundation',
      tags: ['Teaching Hospital', 'Research Active', 'University Hospital']
    },
    {
      id: '3',
      hospitalName: 'Edinburgh Royal Infirmary',
      department: 'Cardiology',
      specialty: 'Cardiology',
      location: {
        city: 'Edinburgh',
        region: 'Scotland',
        postcode: 'EH16 4SA'
      },
      duration: '8 months',
      startDate: '2024-05-01',
      endDate: '2024-12-31',
      availableSpots: 1,
      totalSpots: 2,
      requirements: ['PLAB 2 passed', 'GMC Registration', 'Cardiology interest', 'Research experience preferred'],
      description: 'Prestigious cardiology placement in Scotland\'s leading cardiac centre. Exposure to interventional procedures, heart failure clinic, and cardiac surgery.',
      supervisor: {
        name: 'Prof. Michael Thompson',
        title: 'Professor of Cardiology',
        email: 'm.thompson@nhslothian.scot.nhs.uk'
      },
      rating: 4.9,
      reviews: 31,
      applicationDeadline: '2024-03-15',
      benefits: ['Interventional training', 'Research projects', 'International conferences', 'Career mentorship'],
      contact: {
        phone: '+44 131 536 1000',
        email: 'cardiology.education@nhslothian.scot.nhs.uk',
        website: 'www.nhslothian.scot.nhs.uk'
      },
      isApplied: false,
      difficulty: 'Advanced',
      tags: ['Specialist Centre', 'Research Excellence', 'International Recognition']
    },
    {
      id: '4',
      hospitalName: 'Birmingham Heartlands Hospital',
      department: 'Respiratory Medicine',
      specialty: 'Respiratory Medicine',
      location: {
        city: 'Birmingham',
        region: 'West Midlands',
        postcode: 'B9 5SS'
      },
      duration: '6 months',
      startDate: '2024-06-01',
      endDate: '2024-11-30',
      availableSpots: 4,
      totalSpots: 6,
      requirements: ['PLAB 2 passed', 'GMC Registration', 'Respiratory interest'],
      description: 'Join our respiratory team in one of the UK\'s busiest respiratory departments. Experience with COVID recovery, lung cancer, and sleep medicine.',
      supervisor: {
        name: 'Dr. Priya Patel',
        title: 'Consultant Respiratory Physician',
        email: 'p.patel@heartofengland.nhs.uk'
      },
      rating: 4.5,
      reviews: 22,
      applicationDeadline: '2024-04-15',
      benefits: ['Bronchoscopy training', 'Sleep study exposure', 'Lung function training', 'MDT meetings'],
      contact: {
        phone: '+44 121 424 2000',
        email: 'respiratory.education@heartofengland.nhs.uk',
        website: 'www.uhb.nhs.uk'
      },
      isApplied: false,
      difficulty: 'Intermediate',
      tags: ['Specialist Unit', 'Modern Facilities', 'Diverse Population']
    }
  ];

  const specialties = ['all', 'Emergency Medicine', 'Internal Medicine', 'Cardiology', 'Respiratory Medicine', 'Surgery', 'Psychiatry', 'Paediatrics', 'Obstetrics & Gynaecology'];
  const regions = ['all', 'London', 'North West', 'Scotland', 'West Midlands', 'South East', 'Yorkshire', 'North East', 'East of England'];

  const filteredPlacements = placements.filter(placement => {
    const matchesSearch = placement.hospitalName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         placement.specialty.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         placement.location.city.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesSpecialty = selectedSpecialty === 'all' || placement.specialty === selectedSpecialty;
    const matchesRegion = selectedRegion === 'all' || placement.location.region === selectedRegion;
    
    if (selectedTab === 'applied') {
      return matchesSearch && matchesSpecialty && matchesRegion && placement.isApplied;
    }
    
    return matchesSearch && matchesSpecialty && matchesRegion;
  });

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Foundation': return 'bg-green-100 text-green-800';
      case 'Intermediate': return 'bg-yellow-100 text-yellow-800';
      case 'Advanced': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getSpecialtyIcon = (specialty: string) => {
    switch (specialty) {
      case 'Emergency Medicine': return <Stethoscope className="h-5 w-5" />;
      case 'Cardiology': return <Heart className="h-5 w-5" />;
      case 'Respiratory Medicine': return <Brain className="h-5 w-5" />;
      default: return <Building className="h-5 w-5" />;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-teal-50 to-blue-100 dark:from-gray-900 dark:to-gray-800">
      <div className="container mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2">
            Clinical Placements
          </h1>
          <p className="text-gray-600 dark:text-gray-300 text-lg">
            Find and apply for clinical placements across UK hospitals
          </p>
        </div>

        {/* Search and Filters */}
        <Card className="mb-8">
          <CardContent className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search hospitals, specialties, locations..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-9"
                />
              </div>
              <select
                value={selectedSpecialty}
                onChange={(e) => setSelectedSpecialty(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                {specialties.map(specialty => (
                  <option key={specialty} value={specialty}>
                    {specialty === 'all' ? 'All Specialties' : specialty}
                  </option>
                ))}
              </select>
              <select
                value={selectedRegion}
                onChange={(e) => setSelectedRegion(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                {regions.map(region => (
                  <option key={region} value={region}>
                    {region === 'all' ? 'All Regions' : region}
                  </option>
                ))}
              </select>
              <Button variant="outline" className="flex items-center gap-2">
                <Filter className="h-4 w-4" />
                More Filters
              </Button>
            </div>
          </CardContent>
        </Card>

        <Tabs value={selectedTab} onValueChange={setSelectedTab} className="w-full">
          <TabsList className="grid w-full grid-cols-3 mb-6">
            <TabsTrigger value="available">Available Placements</TabsTrigger>
            <TabsTrigger value="applied">My Applications</TabsTrigger>
            <TabsTrigger value="resources">Resources</TabsTrigger>
          </TabsList>

          <TabsContent value="available" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {filteredPlacements.map((placement) => (
                <Card key={placement.id} className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-3">
                        {getSpecialtyIcon(placement.specialty)}
                        <div>
                          <CardTitle className="text-lg">{placement.hospitalName}</CardTitle>
                          <CardDescription className="flex items-center gap-2">
                            <MapPin className="h-4 w-4" />
                            {placement.location.city}, {placement.location.region}
                          </CardDescription>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Star className="h-4 w-4 text-yellow-500" />
                        <span className="text-sm font-medium">{placement.rating}</span>
                        <span className="text-sm text-gray-500">({placement.reviews})</span>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center justify-between">
                      <Badge variant="secondary" className="text-sm">
                        {placement.department}
                      </Badge>
                      <Badge className={getDifficultyColor(placement.difficulty)}>
                        {placement.difficulty}
                      </Badge>
                    </div>

                    <p className="text-gray-600 dark:text-gray-300 text-sm line-clamp-2">
                      {placement.description}
                    </p>

                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div className="flex items-center gap-2">
                        <Calendar className="h-4 w-4 text-gray-400" />
                        <span>{placement.duration}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Users className="h-4 w-4 text-gray-400" />
                        <span>{placement.availableSpots}/{placement.totalSpots} spots</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Clock className="h-4 w-4 text-gray-400" />
                        <span>Starts {new Date(placement.startDate).toLocaleDateString()}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <UserCheck className="h-4 w-4 text-gray-400" />
                        <span>{placement.supervisor.name}</span>
                      </div>
                    </div>

                    <div className="flex flex-wrap gap-2">
                      {placement.tags.slice(0, 3).map((tag, index) => (
                        <Badge key={index} variant="outline" className="text-xs">
                          {tag}
                        </Badge>
                      ))}
                    </div>

                    <div className="flex items-center justify-between pt-4 border-t">
                      <div className="text-sm text-gray-600 dark:text-gray-300">
                        Deadline: {new Date(placement.applicationDeadline).toLocaleDateString()}
                      </div>
                      <div className="flex gap-2">
                        <Button variant="outline" size="sm">
                          View Details
                        </Button>
                        <Button size="sm" disabled={placement.isApplied}>
                          {placement.isApplied ? 'Applied' : 'Apply Now'}
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="applied" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {filteredPlacements.filter(p => p.isApplied).map((placement) => (
                <Card key={placement.id} className="border-blue-200 bg-blue-50 dark:bg-blue-900/10">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-3">
                        {getSpecialtyIcon(placement.specialty)}
                        <div>
                          <CardTitle className="text-lg">{placement.hospitalName}</CardTitle>
                          <CardDescription className="flex items-center gap-2">
                            <MapPin className="h-4 w-4" />
                            {placement.location.city}, {placement.location.region}
                          </CardDescription>
                        </div>
                      </div>
                      <Badge className="bg-blue-100 text-blue-800">
                        Application Submitted
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <p className="text-sm text-gray-600 dark:text-gray-300">
                        Your application is being reviewed. You'll hear back by {new Date(placement.applicationDeadline).toLocaleDateString()}.
                      </p>
                      <div className="flex gap-2">
                        <Button variant="outline" size="sm">
                          View Application
                        </Button>
                        <Button variant="outline" size="sm">
                          Withdraw
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="resources" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <BookOpen className="h-5 w-5 text-blue-500" />
                    Application Guide
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-gray-600 dark:text-gray-300 mb-4">
                    Step-by-step guide to applying for clinical placements in the UK.
                  </p>
                  <Button variant="outline" size="sm" className="w-full">
                    Read Guide
                  </Button>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Award className="h-5 w-5 text-green-500" />
                    CV Templates
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-gray-600 dark:text-gray-300 mb-4">
                    Professional CV templates tailored for medical placements.
                  </p>
                  <Button variant="outline" size="sm" className="w-full">
                    Download Templates
                  </Button>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <GraduationCap className="h-5 w-5 text-purple-500" />
                    Interview Prep
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-gray-600 dark:text-gray-300 mb-4">
                    Common interview questions and tips for placement interviews.
                  </p>
                  <Button variant="outline" size="sm" className="w-full">
                    Start Preparation
                  </Button>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}