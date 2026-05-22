import { useState } from 'react';
import { Check, Star, Zap, Crown, Building2, ArrowRight, X, Mail, User, Phone, MapPin } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Separator } from '@/components/ui/separator';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';

export default function Pricing() {
  const [isAnnual, setIsAnnual] = useState(true);
  const [showDemoForm, setShowDemoForm] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  // Demo request form state
  const [demoForm, setDemoForm] = useState({
    name: '',
    email: '',
    phone: '',
    organization: '',
    role: '',
    organizationType: '',
    numberOfUsers: '',
    requirements: ''
  });

  const handleDemoRequest = async () => {
    if (!demoForm.name || !demoForm.email || !demoForm.organization) {
      toast({
        title: "Required fields missing",
        description: "Please fill in name, email, and organization",
        variant: "destructive"
      });
      return;
    }

    setIsSubmitting(true);
    
    try {
      const response = await fetch('/api/demo-request', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(demoForm),
      });

      if (response.ok) {
        toast({
          title: "Demo request submitted",
          description: "We'll contact you within 24 hours to schedule your personalized demo",
        });
        setShowDemoForm(false);
        setDemoForm({
          name: '',
          email: '',
          phone: '',
          organization: '',
          role: '',
          organizationType: '',
          numberOfUsers: '',
          requirements: ''
        });
      } else {
        throw new Error('Failed to submit demo request');
      }
    } catch (error) {
      toast({
        title: "Request failed",
        description: "Please try again or contact us directly",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const plans = [
    {
      name: 'Foundation',
      description: 'Perfect for getting started with PLAB preparation',
      monthlyPrice: 39,
      annualPrice: 390,
      originalAnnualPrice: 468,
      icon: Star,
      color: 'from-blue-500 to-blue-600',
      features: [
        '5,000 smart-generated PLAB questions',
        'Basic study recommendations',
        'Progress tracking & analytics',
        'Mobile app access',
        'Community forums',
        '3 language support',
        'Email support',
        'Offline study mode'
      ],
      limitations: [
        'Limited AI systems (5 basic)',
        'No VR OSCE training',
        'Standard question difficulty'
      ]
    },
    {
      name: 'Professional',
      description: 'Complete PLAB preparation with advanced AI',
      monthlyPrice: 69,
      annualPrice: 590,
      originalAnnualPrice: 828,
      icon: Zap,
      color: 'from-purple-500 to-purple-600',
      popular: true,
      features: [
        'Everything in Foundation',
        '20 Advanced smart systems',
        'VR OSCE training (10 stations)',
        'Live NHS guidelines integration',
        '15 language support',
        'Predictive success analytics',
        'Professional development tools',
        'Priority support',
        'Adaptive learning engine',
        'Weakness pattern analysis',
        'Custom study schedules'
      ],
      limitations: []
    },
    {
      name: 'Premium',
      description: 'Elite preparation with personalized guidance',
      monthlyPrice: 99,
      annualPrice: 890,
      originalAnnualPrice: 1188,
      icon: Crown,
      color: 'from-yellow-500 to-orange-600',
      features: [
        'Everything in Professional',
        'All 40+ AI systems',
        'Complete VR OSCE suite (50+ stations)',
        'All 35 languages',
        'Virtual patient actors',
        'Career guidance & hospital partnerships',
        '1-on-1 mentorship matching',
        'Custom study plans',
        'Priority queue for new features',
        'Phone support',
        'Dedicated success manager',
        'Advanced performance analytics'
      ],
      limitations: []
    }
  ];

  const enterpriseFeatures = [
    'Bulk licenses (50+ users)',
    'Institution branding',
    'Admin dashboard & reporting',
    'Custom content integration',
    'Dedicated account manager',
    'On-site training',
    'API access',
    'Custom integrations'
  ];

  return (
    <div className="min-h-screen bg-white">
      <div className="container mx-auto px-4 py-16">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-4xl font-bold mb-4 text-black">
            Choose Your Path to PLAB Success
          </h1>
          <p className="text-xl text-gray-900 max-w-3xl mx-auto">
            Join thousands of international medical graduates who've passed PLAB with our smart platform. 
            From basic preparation to elite mentorship - we have the right plan for your journey.
          </p>
        </div>

        {/* Billing Toggle */}
        <div className="flex items-center justify-center mb-12">
          <div className="flex items-center bg-gray-100 rounded-lg p-1">
            <button
              onClick={() => setIsAnnual(false)}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${
                !isAnnual 
                  ? 'bg-white text-gray-900 shadow-sm' 
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Monthly
            </button>
            <button
              onClick={() => setIsAnnual(true)}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${
                isAnnual 
                  ? 'bg-white text-gray-900 shadow-sm' 
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Annual
            </button>
          </div>
          <Badge variant="secondary" className="ml-3 bg-green-100 text-green-800">
            Save up to 33%
          </Badge>
        </div>

        {/* Pricing Cards */}
        <div className="grid lg:grid-cols-3 md:grid-cols-2 gap-8 mb-16">
          {plans.map((plan) => {
            const Icon = plan.icon;
            const price = isAnnual ? plan.annualPrice : plan.monthlyPrice;
            const originalPrice = isAnnual ? plan.originalAnnualPrice : null;
            const savings = isAnnual && originalPrice ? originalPrice - price : 0;

            return (
              <Card 
                key={plan.name}
                className={`relative overflow-hidden transition-all duration-300 hover:shadow-2xl bg-white ${
                  plan.popular ? 'ring-2 ring-purple-500 scale-105' : 'hover:scale-105'
                }`}
              >
                {plan.popular && (
                  <div className="absolute top-0 left-0 right-0 bg-gradient-to-r from-purple-500 to-purple-600 text-white text-center py-2 font-semibold">
                    Most Popular Choice
                  </div>
                )}
                
                <CardHeader className={`${plan.popular ? 'pt-12' : 'pt-6'} pb-4 bg-white`}>
                  <div className={`w-12 h-12 bg-gradient-to-r ${plan.color} rounded-lg flex items-center justify-center mb-4`}>
                    <Icon className="w-6 h-6 text-white" />
                  </div>
                  
                  <CardTitle className="text-2xl font-bold text-black">
                    {plan.name}
                  </CardTitle>
                  <CardDescription className="text-gray-900">
                    {plan.description}
                  </CardDescription>
                  
                  <div className="flex items-baseline mt-4">
                    <span className="text-4xl font-bold text-black">
                      £{price}
                    </span>
                    <span className="text-gray-900 ml-1">
                      /{isAnnual ? 'year' : 'month'}
                    </span>
                    {originalPrice && isAnnual && (
                      <span className="ml-2 text-sm text-gray-400 line-through">
                        £{originalPrice}
                      </span>
                    )}
                  </div>
                  
                  {savings > 0 && (
                    <Badge variant="secondary" className="w-fit mt-2 bg-green-100 text-green-800">
                      Save £{savings}
                    </Badge>
                  )}
                  
                  {!isAnnual && (
                    <p className="text-sm text-gray-900 mt-2">
                      Less than £{(price / 30).toFixed(2)}/day
                    </p>
                  )}
                </CardHeader>

                <CardContent className="pt-0 bg-white">
                  <Button 
                    className={`w-full mb-6 bg-gradient-to-r ${plan.color} hover:opacity-90 text-white font-semibold py-3`}
                    onClick={() => console.log(`Starting ${plan.name} plan`)}
                  >
                    Start {plan.name} Plan
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>

                  <div className="space-y-3">
                    {plan.features.map((feature, index) => (
                      <div key={index} className="flex items-start">
                        <Check className="w-5 h-5 text-green-500 mr-3 mt-0.5 flex-shrink-0" />
                        <span className="text-sm text-black">{feature}</span>
                      </div>
                    ))}
                  </div>

                  {plan.limitations.length > 0 && (
                    <>
                      <Separator className="my-4" />
                      <p className="text-xs text-gray-500 mb-2">Limitations:</p>
                      {plan.limitations.map((limitation, index) => (
                        <div key={index} className="flex items-start">
                          <span className="w-5 h-5 text-gray-300 mr-3 mt-0.5 text-xs">✗</span>
                          <span className="text-xs text-gray-500">{limitation}</span>
                        </div>
                      ))}
                    </>
                  )}
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Enterprise Section */}
        <Card className="mb-16 bg-gradient-to-r from-gray-50 to-blue-50 border-2 border-gray-200">
          <CardHeader className="text-center">
            <div className="w-16 h-16 bg-gradient-to-r from-gray-600 to-gray-700 rounded-lg flex items-center justify-center mx-auto mb-4">
              <Building2 className="w-8 h-8 text-white" />
            </div>
            <CardTitle className="text-3xl font-bold" style={{ color: '#000000' }}>
              Enterprise & Institutional
            </CardTitle>
            <CardDescription className="text-lg">
              Perfect for medical schools, hospitals, and training institutions
            </CardDescription>
          </CardHeader>
          
          <CardContent className="text-center">
            <div className="grid md:grid-cols-2 gap-6 mb-8">
              <div>
                <h4 className="font-semibold mb-4" style={{ color: '#000000' }}>What's Included:</h4>
                <div className="space-y-2">
                  {enterpriseFeatures.map((feature, index) => (
                    <div key={index} className="flex items-start">
                      <Check className="w-4 h-4 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                      <span className="text-sm text-gray-700 text-left">{feature}</span>
                    </div>
                  ))}
                </div>
              </div>
              
              <div className="flex flex-col justify-center">
                <div className="text-center mb-6">
                  <p className="text-lg font-semibold mb-2" style={{ color: '#000000' }}>
                    Starting from £25-35 per user/month
                  </p>
                  <p className="text-gray-600">Volume discounts available</p>
                </div>
                
                <Dialog open={showDemoForm} onOpenChange={setShowDemoForm}>
                  <DialogTrigger asChild>
                    <Button 
                      size="lg"
                      className="bg-gray-700 hover:bg-gray-800 text-white font-semibold"
                    >
                      Request Demo
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-[500px]">
                    <DialogHeader>
                      <DialogTitle className="flex items-center gap-2">
                        <Building2 className="w-5 h-5" />
                        Request Enterprise Demo
                      </DialogTitle>
                      <DialogDescription>
                        Get a personalized demo of our complete medical education platform
                      </DialogDescription>
                    </DialogHeader>
                    
                    <div className="grid gap-4 py-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="name">Name *</Label>
                          <Input
                            id="name"
                            value={demoForm.name}
                            onChange={(e) => setDemoForm({...demoForm, name: e.target.value})}
                            placeholder="Your full name"
                          />
                        </div>
                        <div>
                          <Label htmlFor="email">Email *</Label>
                          <Input
                            id="email"
                            type="email"
                            value={demoForm.email}
                            onChange={(e) => setDemoForm({...demoForm, email: e.target.value})}
                            placeholder="your@email.com"
                          />
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="phone">Phone</Label>
                          <Input
                            id="phone"
                            value={demoForm.phone}
                            onChange={(e) => setDemoForm({...demoForm, phone: e.target.value})}
                            placeholder="+44 123 456 7890"
                          />
                        </div>
                        <div>
                          <Label htmlFor="role">Your Role</Label>
                          <Input
                            id="role"
                            value={demoForm.role}
                            onChange={(e) => setDemoForm({...demoForm, role: e.target.value})}
                            placeholder="e.g., Training Director"
                          />
                        </div>
                      </div>
                      
                      <div>
                        <Label htmlFor="organization">Organization *</Label>
                        <Input
                          id="organization"
                          value={demoForm.organization}
                          onChange={(e) => setDemoForm({...demoForm, organization: e.target.value})}
                          placeholder="Hospital, Medical School, or Institution"
                        />
                      </div>
                      
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="orgType">Organization Type</Label>
                          <Select value={demoForm.organizationType} onValueChange={(value) => setDemoForm({...demoForm, organizationType: value})}>
                            <SelectTrigger>
                              <SelectValue placeholder="Select type" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="medical-school">Medical School</SelectItem>
                              <SelectItem value="hospital">Hospital</SelectItem>
                              <SelectItem value="training-center">Training Center</SelectItem>
                              <SelectItem value="government">Government Body</SelectItem>
                              <SelectItem value="private-college">Private College</SelectItem>
                              <SelectItem value="other">Other</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div>
                          <Label htmlFor="users">Expected Users</Label>
                          <Select value={demoForm.numberOfUsers} onValueChange={(value) => setDemoForm({...demoForm, numberOfUsers: value})}>
                            <SelectTrigger>
                              <SelectValue placeholder="Number of users" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="10-50">10-50 users</SelectItem>
                              <SelectItem value="50-100">50-100 users</SelectItem>
                              <SelectItem value="100-500">100-500 users</SelectItem>
                              <SelectItem value="500-1000">500-1,000 users</SelectItem>
                              <SelectItem value="1000+">1,000+ users</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                      
                      <div>
                        <Label htmlFor="requirements">Specific Requirements</Label>
                        <Textarea
                          id="requirements"
                          value={demoForm.requirements}
                          onChange={(e) => setDemoForm({...demoForm, requirements: e.target.value})}
                          placeholder="Tell us about your specific needs, integration requirements, or questions..."
                          rows={3}
                        />
                      </div>
                    </div>
                    
                    <div className="flex justify-end gap-3">
                      <Button 
                        variant="outline" 
                        onClick={() => setShowDemoForm(false)}
                        disabled={isSubmitting}
                      >
                        Cancel
                      </Button>
                      <Button 
                        onClick={handleDemoRequest}
                        disabled={isSubmitting}
                        className="bg-gray-700 hover:bg-gray-800"
                      >
                        {isSubmitting ? (
                          <>
                            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                            Submitting...
                          </>
                        ) : (
                          <>
                            <Mail className="w-4 h-4 mr-2" />
                            Request Demo
                          </>
                        )}
                      </Button>
                    </div>
                  </DialogContent>
                </Dialog>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Value Propositions */}
        <div className="grid md:grid-cols-3 gap-8 mb-16">
          <div className="text-center">
            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Zap className="w-8 h-8 text-blue-600" />
            </div>
            <h3 className="text-xl font-semibold mb-2" style={{ color: '#000000' }}>
              40+ Smart Systems
            </h3>
            <p className="text-gray-600">
              No competitor offers this level of integration for personalized learning
            </p>
          </div>
          
          <div className="text-center">
            <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Crown className="w-8 h-8 text-purple-600" />
            </div>
            <h3 className="text-xl font-semibold mb-2" style={{ color: '#000000' }}>
              VR OSCE Training
            </h3>
            <p className="text-gray-600">
              World's first VR clinical skills training for PLAB candidates
            </p>
          </div>
          
          <div className="text-center">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Star className="w-8 h-8 text-green-600" />
            </div>
            <h3 className="text-xl font-semibold mb-2" style={{ color: '#000000' }}>
              95% Pass Rate
            </h3>
            <p className="text-gray-600">
              Our students achieve significantly higher PLAB pass rates
            </p>
          </div>
        </div>

        {/* Guarantees */}
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-8 text-center text-white">
          <h2 className="text-3xl font-bold mb-4">
            Risk-Free Investment in Your Medical Career
          </h2>
          <div className="grid md:grid-cols-3 gap-6 mb-6">
            <div>
              <h4 className="font-semibold mb-2">14-Day Free Trial</h4>
              <p className="text-blue-100">Experience the full platform before committing</p>
            </div>
            <div>
              <h4 className="font-semibold mb-2">30-Day Money Back</h4>
              <p className="text-blue-100">Not satisfied? Get a full refund, no questions asked</p>
            </div>
            <div>
              <h4 className="font-semibold mb-2">Success Guarantee</h4>
              <p className="text-blue-100">Pass PLAB or get additional support at no cost</p>
            </div>
          </div>
          <Button 
            size="lg"
            className="bg-white text-blue-600 hover:bg-gray-100 font-semibold px-8"
            onClick={() => console.log('Starting free trial')}
          >
            Start Your Free Trial Today
          </Button>
        </div>
      </div>
    </div>
  );
}