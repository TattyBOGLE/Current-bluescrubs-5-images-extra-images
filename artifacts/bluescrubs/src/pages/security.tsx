import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  Shield, 
  Lock, 
  Key, 
  Eye, 
  Database, 
  Globe, 
  UserCheck, 
  AlertTriangle,
  CheckCircle,
  Settings,
  FileText,
  Smartphone
} from "lucide-react";

export default function Security() {
  const securityFeatures = [
    {
      icon: Shield,
      title: "Data Encryption",
      description: "All data encrypted in transit and at rest using industry-standard AES-256 encryption",
      status: "Active",
      level: "Enterprise"
    },
    {
      icon: Lock,
      title: "Secure Authentication",
      description: "Multi-factor authentication and secure session management with encrypted tokens",
      status: "Active",
      level: "Enterprise"
    },
    {
      icon: Database,
      title: "Database Security",
      description: "PostgreSQL with encrypted connections, regular backups, and access controls",
      status: "Active",
      level: "Enterprise"
    },
    {
      icon: Globe,
      title: "HTTPS/TLS",
      description: "All communications secured with TLS 1.3 and HTTPS certificates",
      status: "Active",
      level: "Standard"
    },
    {
      icon: UserCheck,
      title: "Privacy Compliance",
      description: "GDPR compliant with comprehensive privacy policy and data protection measures",
      status: "Active",
      level: "Enterprise"
    },
    {
      icon: Eye,
      title: "Access Monitoring",
      description: "Real-time monitoring of user access patterns and security events",
      status: "Active",
      level: "Standard"
    }
  ];

  const securityPolicies = [
    {
      title: "Privacy Policy",
      description: "Comprehensive data protection and privacy guidelines",
      icon: FileText,
      updated: "26 June 2025"
    },
    {
      title: "Terms of Service",
      description: "Platform usage terms and user responsibilities",
      icon: FileText,
      updated: "26 June 2025"
    },
    {
      title: "Data Protection Policy",
      description: "GDPR compliance and data handling procedures",
      icon: Shield,
      updated: "26 June 2025"
    },
    {
      title: "Cookie Policy",
      description: "Cookie usage and tracking preferences",
      icon: Settings,
      updated: "26 June 2025"
    }
  ];

  const securityTips = [
    "Use a strong, unique password for your BlueScrubsPrep account",
    "Enable two-factor authentication when available",
    "Log out from shared or public computers",
    "Keep your browser and device software updated",
    "Report any suspicious activity immediately",
    "Review your account activity regularly"
  ];

  return (
    <div className="min-h-screen bg-slate-50 pb-24">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="p-3 bg-blue-500/10 rounded-full">
              <Shield className="h-8 w-8 text-blue-600" />
            </div>
            <h1 className="text-3xl md:text-4xl font-semibold text-gray-900">Security Centre</h1>
          </div>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Your data security and privacy are our top priorities. Learn about our comprehensive security measures and best practices.
          </p>
        </div>

        {/* Security Status Overview */}
        <div className="mb-12">
          <Card className="bg-gradient-to-r from-green-50 to-emerald-50 border-green-200">
            <CardContent className="p-6">
              <div className="flex items-center gap-4 mb-4">
                <CheckCircle className="h-8 w-8 text-green-600" />
                <div>
                  <h2 className="text-xl font-semibold text-green-900">Security Status: Excellent</h2>
                  <p className="text-green-700">All security systems are operational and up to date</p>
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-white/50 p-4 rounded-lg">
                  <div className="text-2xl font-semibold text-green-600">99.9%</div>
                  <div className="text-sm text-green-700">Uptime</div>
                </div>
                <div className="bg-white/50 p-4 rounded-lg">
                  <div className="text-2xl font-semibold text-green-600">256-bit</div>
                  <div className="text-sm text-green-700">Encryption</div>
                </div>
                <div className="bg-white/50 p-4 rounded-lg">
                  <div className="text-2xl font-semibold text-green-600">GDPR</div>
                  <div className="text-sm text-green-700">Compliant</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Security Features */}
        <div className="mb-12">
          <h2 className="text-2xl font-semibold text-gray-900 mb-6">Security Features</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {securityFeatures.map((feature, index) => (
              <Card key={index} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-blue-500/10 rounded-lg">
                        <feature.icon className="h-6 w-6 text-blue-600" />
                      </div>
                      <div>
                        <CardTitle className="text-lg">{feature.title}</CardTitle>
                        <Badge 
                          variant={feature.status === 'Active' ? 'default' : 'secondary'}
                          className="mt-1"
                        >
                          {feature.status}
                        </Badge>
                      </div>
                    </div>
                    <Badge variant="outline" className="text-xs">
                      {feature.level}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600">{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Security Policies */}
        <div className="mb-12">
          <h2 className="text-2xl font-semibold text-gray-900 mb-6">Security Policies</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {securityPolicies.map((policy, index) => (
              <Card key={index} className="hover:shadow-lg transition-shadow cursor-pointer">
                <CardContent className="p-6">
                  <div className="flex items-start gap-4">
                    <div className="p-3 bg-purple-500/10 rounded-lg flex-shrink-0">
                      <policy.icon className="h-6 w-6 text-purple-600" />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-900 mb-2">{policy.title}</h3>
                      <p className="text-gray-600 text-sm mb-3">{policy.description}</p>
                      <div className="flex items-center justify-between">
                        <span className="text-xs text-gray-500">Updated: {policy.updated}</span>
                        <Button variant="outline" size="sm">View Policy</Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Security Best Practices */}
        <div className="mb-12">
          <h2 className="text-2xl font-semibold text-gray-900 mb-6">Security Best Practices</h2>
          <Card className="bg-gradient-to-r from-orange-50 to-amber-50 border-orange-200">
            <CardHeader>
              <div className="flex items-center gap-3">
                <AlertTriangle className="h-6 w-6 text-orange-600" />
                <CardTitle className="text-orange-900">Keep Your Account Secure</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {securityTips.map((tip, index) => (
                  <div key={index} className="flex items-start gap-3">
                    <CheckCircle className="h-5 w-5 text-orange-600 flex-shrink-0 mt-0.5" />
                    <span className="text-orange-800">{tip}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Security Contact */}
        <div className="text-center">
          <Card className="bg-white border-slate-200 rounded-2xl max-w-2xl mx-auto">
            <CardContent className="p-8">
              <div className="w-14 h-14 bg-teal-50 rounded-full flex items-center justify-center mx-auto mb-4">
                <Smartphone className="h-7 w-7 text-teal-700" />
              </div>
              <h3 className="text-xl font-semibold text-slate-900 mb-3">Report Security Issues</h3>
              <p className="text-slate-600 mb-6">
                If you discover a security vulnerability or have concerns about your account security,
                please contact our security team immediately.
              </p>
              <Button className="bg-gradient-to-r from-teal-500 to-teal-600 hover:from-teal-600 hover:to-teal-700" style={{ color: '#ffffff' }}>
                Contact Security Team
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}