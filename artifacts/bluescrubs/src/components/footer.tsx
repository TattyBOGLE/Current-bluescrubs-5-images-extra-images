import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { 
  FileText, Shield, Mail, Phone, 
  MapPin, Stethoscope, ExternalLink,
  Twitter, Facebook, Linkedin, Instagram, Accessibility
} from "lucide-react";

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gray-800 text-white mt-auto">
      {/* Enhanced Footer with Accessibility Links */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Prominent Neurodiverse Support Button */}
        <div className="mb-8 text-center">
          <Link href="/more" 
                className="inline-flex items-center gap-3 bg-purple-600 hover:bg-purple-700 text-white px-6 py-3 rounded-lg font-semibold text-lg transition-colors shadow-lg hover:shadow-xl">
            <Accessibility className="h-6 w-6 text-blue-500" strokeWidth={3.5} />
            Neurodiverse Support & Accessibility
          </Link>
          <p className="text-gray-400 text-sm mt-2">Specialized support for ADHD, dyslexia, autism, and other neurodivergent learning styles</p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Quick Access</h3>
            <ul className="space-y-2 text-sm text-gray-300">
              <li><Link href="/dashboard" className="hover:text-white transition-colors">Dashboard</Link></li>
              <li><Link href="/plab1-new" className="hover:text-white transition-colors">PLAB 1</Link></li>
              <li><Link href="/plab2-osce" className="hover:text-white transition-colors">PLAB 2</Link></li>
              <li><Link href="/ask-ai" className="hover:text-white transition-colors bg-blue-600 hover:bg-blue-700 px-3 py-1 rounded-md font-medium">Ask AI Medical Questions</Link></li>
              <li><Link href="/mentors" className="hover:text-white transition-colors">Expert Mentors</Link></li>
              <li><Link href="/premium" className="hover:text-white transition-colors">Premium Features</Link></li>
              <li>
                <Link href="/more" 
                      className="inline-flex items-center gap-2 bg-purple-600 hover:bg-purple-700 text-white px-3 py-2 rounded-md font-medium transition-colors">
                  <Accessibility className="h-4 w-4 text-blue-500" strokeWidth={3.5} />
                  Neurodiverse Support
                </Link>
              </li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Support</h3>
            <ul className="space-y-2 text-sm text-gray-300">
              <li><Link href="/help" className="hover:text-white transition-colors">Help Center</Link></li>
              <li><Link href="/contact" className="hover:text-white transition-colors">Contact Us</Link></li>
              <li><Link href="/community" className="hover:text-white transition-colors">Community</Link></li>
              <li><Link href="/feedback" className="hover:text-white transition-colors">Feedback</Link></li>
            </ul>
          </div>

          {/* Accessibility & Inclusion */}
          <div>
            <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <Accessibility className="h-5 w-5 text-blue-500" strokeWidth={3.5} />
              Accessibility
            </h3>
            <ul className="space-y-2 text-sm text-gray-300">
              <li><Link href="/accessibility" className="hover:text-white transition-colors">Accessibility Features</Link></li>
              <li>
                <Link href="/more" 
                      className="hover:text-white transition-colors bg-purple-600 hover:bg-purple-700 px-3 py-2 rounded-md font-medium inline-flex items-center gap-2">
                  <Accessibility className="h-4 w-4 text-blue-500" strokeWidth={3.5} />
                  Neurodiverse Support
                </Link>
              </li>
              <li><Link href="/reasonable-adjustments" className="hover:text-white transition-colors">Reasonable Adjustments</Link></li>
              <li><Link href="/inclusive-learning" className="hover:text-white transition-colors">Inclusive Learning</Link></li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Legal</h3>
            <ul className="space-y-2 text-sm text-gray-300">
              <li><Link href="/disclaimer" className="hover:text-white transition-colors font-semibold">Important Disclaimer</Link></li>
              <li><Link href="/privacy" className="hover:text-white transition-colors">Privacy Policy</Link></li>
              <li><Link href="/terms" className="hover:text-white transition-colors">Terms of Service</Link></li>
              <li><Link href="/cookies" className="hover:text-white transition-colors">Cookie Policy</Link></li>
              <li><Link href="/accessibility-statement" className="hover:text-white transition-colors">Accessibility Statement</Link></li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-gray-700 pt-6">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-2 md:space-y-0 text-sm text-gray-400">
            <div className="flex items-center space-x-4">
              <span>© {currentYear} NHSprep Ltd. All rights reserved.</span>
              <span>Company Number: 12345678</span>
            </div>
            <div className="flex items-center space-x-4">
              <span>Registered in England and Wales</span>
              <span>VAT: GB123456789</span>
              <span className="flex items-center gap-1">
                <Accessibility className="h-4 w-4 text-blue-500" strokeWidth={3.5} />
                WCAG 2.1 AA Compliant
              </span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}