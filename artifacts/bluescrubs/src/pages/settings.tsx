import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Slider } from "@/components/ui/slider";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { 
  Settings as SettingsIcon, 
  User, 
  Bell, 
  Shield, 
  Eye, 
  Palette, 
  Globe, 
  Monitor,
  Volume2,
  Timer,
  Accessibility,
  Download,
  Trash2,
  Save,
  RefreshCw
} from "lucide-react";
import { useState } from "react";

export default function Settings() {
  const [notifications, setNotifications] = useState({
    email: true,
    push: false,
    study: true,
    achievements: true,
    leaderboard: false
  });

  const [preferences, setPreferences] = useState({
    theme: "light",
    language: "en-GB",
    timezone: "Europe/London",
    fontSize: [16],
    autoSave: true,
    offlineMode: false,
    soundEffects: true,
    animations: true
  });

  const [accessibility, setAccessibility] = useState({
    highContrast: false,
    largeButtons: false,
    reduceMotion: false,
    screenReader: false,
    keyboardNav: true,
    extendedTime: false
  });

  const languages = [
    { code: "en-GB", name: "English (UK)", flag: "🇬🇧" },
    { code: "en-US", name: "English (US)", flag: "🇺🇸" },
    { code: "ar", name: "العربية", flag: "🇸🇦" },
    { code: "ur", name: "اردو", flag: "🇵🇰" },
    { code: "hi", name: "हिन्दी", flag: "🇮🇳" },
    { code: "bn", name: "বাংলা", flag: "🇧🇩" },
    { code: "es", name: "Español", flag: "🇪🇸" },
    { code: "fr", name: "Français", flag: "🇫🇷" },
    { code: "de", name: "Deutsch", flag: "🇩🇪" },
    { code: "zh", name: "中文", flag: "🇨🇳" }
  ];

  const timezones = [
    "Europe/London",
    "Europe/Paris",
    "Europe/Berlin",
    "Asia/Dubai",
    "Asia/Karachi",
    "Asia/Kolkata",
    "Asia/Dhaka",
    "Asia/Shanghai",
    "America/New_York",
    "America/Los_Angeles"
  ];

  return (
    <div className="min-h-screen bg-slate-50 pb-24">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="p-3 bg-blue-500/10 rounded-full">
              <SettingsIcon className="h-8 w-8 text-blue-600" />
            </div>
            <h1 className="text-3xl md:text-4xl font-semibold text-gray-900">Settings</h1>
          </div>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Customise your BlueScrubsPrep experience with personalised preferences and accessibility options.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Account Settings */}
          <Card>
            <CardHeader>
              <div className="flex items-center gap-3">
                <User className="h-6 w-6 text-blue-600" />
                <CardTitle>Account Settings</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <label className="text-sm font-medium text-gray-700 mb-2 block">Display Name</label>
                <input 
                  type="text" 
                  defaultValue="Medical Student" 
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              
              <div>
                <label className="text-sm font-medium text-gray-700 mb-2 block">Email Address</label>
                <input 
                  type="email" 
                  defaultValue="student@example.com" 
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="text-sm font-medium text-gray-700 mb-2 block">Medical School</label>
                <input 
                  type="text" 
                  placeholder="Enter your medical school" 
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="text-sm font-medium text-gray-700 mb-2 block">Country</label>
                <Select defaultValue="uk">
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="uk">🇬🇧 United Kingdom</SelectItem>
                    <SelectItem value="us">🇺🇸 United States</SelectItem>
                    <SelectItem value="ae">🇦🇪 United Arab Emirates</SelectItem>
                    <SelectItem value="pk">🇵🇰 Pakistan</SelectItem>
                    <SelectItem value="in">🇮🇳 India</SelectItem>
                    <SelectItem value="bd">🇧🇩 Bangladesh</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          {/* Notification Settings */}
          <Card>
            <CardHeader>
              <div className="flex items-center gap-3">
                <Bell className="h-6 w-6 text-blue-600" />
                <CardTitle>Notifications</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Email Notifications</p>
                  <p className="text-sm text-gray-600">Receive updates via email</p>
                </div>
                <Switch 
                  checked={notifications.email}
                  onCheckedChange={(checked) => setNotifications({...notifications, email: checked})}
                />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Study Reminders</p>
                  <p className="text-sm text-gray-600">Daily study session reminders</p>
                </div>
                <Switch 
                  checked={notifications.study}
                  onCheckedChange={(checked) => setNotifications({...notifications, study: checked})}
                />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Achievement Alerts</p>
                  <p className="text-sm text-gray-600">Celebrate your milestones</p>
                </div>
                <Switch 
                  checked={notifications.achievements}
                  onCheckedChange={(checked) => setNotifications({...notifications, achievements: checked})}
                />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Leaderboard Updates</p>
                  <p className="text-sm text-gray-600">Ranking changes and competitions</p>
                </div>
                <Switch 
                  checked={notifications.leaderboard}
                  onCheckedChange={(checked) => setNotifications({...notifications, leaderboard: checked})}
                />
              </div>
            </CardContent>
          </Card>

          {/* Appearance & Language */}
          <Card>
            <CardHeader>
              <div className="flex items-center gap-3">
                <Palette className="h-6 w-6 text-blue-600" />
                <CardTitle>Appearance & Language</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <label className="text-sm font-medium text-gray-700 mb-2 block">Theme</label>
                <Select value={preferences.theme} onValueChange={(value) => setPreferences({...preferences, theme: value})}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="light">☀️ Light</SelectItem>
                    <SelectItem value="dark">🌙 Dark</SelectItem>
                    <SelectItem value="auto">🔄 Auto</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="text-sm font-medium text-gray-700 mb-2 block">Language</label>
                <Select value={preferences.language} onValueChange={(value) => setPreferences({...preferences, language: value})}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {languages.map((lang) => (
                      <SelectItem key={lang.code} value={lang.code}>
                        {lang.flag} {lang.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="text-sm font-medium text-gray-700 mb-2 block">Timezone</label>
                <Select value={preferences.timezone} onValueChange={(value) => setPreferences({...preferences, timezone: value})}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {timezones.map((tz) => (
                      <SelectItem key={tz} value={tz}>{tz}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="text-sm font-medium text-gray-700 mb-2 block">
                  Font Size: {preferences.fontSize[0]}px
                </label>
                <Slider 
                  value={preferences.fontSize}
                  onValueChange={(value) => setPreferences({...preferences, fontSize: value})}
                  min={12}
                  max={24}
                  step={1}
                  className="w-full"
                />
              </div>
            </CardContent>
          </Card>

          {/* Accessibility */}
          <Card>
            <CardHeader>
              <div className="flex items-center gap-3">
                <Accessibility className="h-6 w-6 text-blue-600" />
                <CardTitle>Accessibility</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">High Contrast</p>
                  <p className="text-sm text-gray-600">Enhanced visual contrast</p>
                </div>
                <Switch 
                  checked={accessibility.highContrast}
                  onCheckedChange={(checked) => setAccessibility({...accessibility, highContrast: checked})}
                />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Large Buttons</p>
                  <p className="text-sm text-gray-600">Bigger touch targets</p>
                </div>
                <Switch 
                  checked={accessibility.largeButtons}
                  onCheckedChange={(checked) => setAccessibility({...accessibility, largeButtons: checked})}
                />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Reduce Motion</p>
                  <p className="text-sm text-gray-600">Minimise animations</p>
                </div>
                <Switch 
                  checked={accessibility.reduceMotion}
                  onCheckedChange={(checked) => setAccessibility({...accessibility, reduceMotion: checked})}
                />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Extended Time</p>
                  <p className="text-sm text-gray-600">Extra time for questions</p>
                </div>
                <Switch 
                  checked={accessibility.extendedTime}
                  onCheckedChange={(checked) => setAccessibility({...accessibility, extendedTime: checked})}
                />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Keyboard Navigation</p>
                  <p className="text-sm text-gray-600">Enhanced keyboard support</p>
                </div>
                <Switch 
                  checked={accessibility.keyboardNav}
                  onCheckedChange={(checked) => setAccessibility({...accessibility, keyboardNav: checked})}
                />
              </div>
            </CardContent>
          </Card>

          {/* Study Preferences */}
          <Card>
            <CardHeader>
              <div className="flex items-center gap-3">
                <Timer className="h-6 w-6 text-blue-600" />
                <CardTitle>Study Preferences</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Auto-save Progress</p>
                  <p className="text-sm text-gray-600">Automatically save your work</p>
                </div>
                <Switch 
                  checked={preferences.autoSave}
                  onCheckedChange={(checked) => setPreferences({...preferences, autoSave: checked})}
                />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Sound Effects</p>
                  <p className="text-sm text-gray-600">Audio feedback for actions</p>
                </div>
                <Switch 
                  checked={preferences.soundEffects}
                  onCheckedChange={(checked) => setPreferences({...preferences, soundEffects: checked})}
                />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Animations</p>
                  <p className="text-sm text-gray-600">Smooth transitions and effects</p>
                </div>
                <Switch 
                  checked={preferences.animations}
                  onCheckedChange={(checked) => setPreferences({...preferences, animations: checked})}
                />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Offline Mode</p>
                  <p className="text-sm text-gray-600">Download content for offline use</p>
                </div>
                <Switch 
                  checked={preferences.offlineMode}
                  onCheckedChange={(checked) => setPreferences({...preferences, offlineMode: checked})}
                />
              </div>
            </CardContent>
          </Card>

          {/* Data & Privacy */}
          <Card>
            <CardHeader>
              <div className="flex items-center gap-3">
                <Shield className="h-6 w-6 text-blue-600" />
                <CardTitle>Data & Privacy</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <Button variant="outline" className="w-full justify-start">
                <Download className="h-4 w-4 mr-2" />
                Export My Data
              </Button>
              
              <Button variant="outline" className="w-full justify-start">
                <Eye className="h-4 w-4 mr-2" />
                View Privacy Policy
              </Button>
              
              <Button variant="outline" className="w-full justify-start">
                <RefreshCw className="h-4 w-4 mr-2" />
                Reset All Settings
              </Button>
              
              <Separator />
              
              <Button variant="destructive" className="w-full justify-start">
                <Trash2 className="h-4 w-4 mr-2" />
                Delete Account
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Save Button */}
        <div className="mt-8 text-center">
          <Button size="lg" className="bg-blue-600 hover:bg-blue-700">
            <Save className="h-5 w-5 mr-2" />
            Save All Settings
          </Button>
        </div>
      </div>
    </div>
  );
}