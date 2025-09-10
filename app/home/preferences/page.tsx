"use client"

import { useState } from "react"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { Slider } from "@/components/ui/slider"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import {
  Settings,
  Globe,
  Palette,
  Bell,
  Navigation,
  Code,
  Monitor,
  Sun,
  Moon,
  Smartphone,
  Mail,
  Save,
  RotateCcw,
  Zap,
  Search,
  Type,
  Layout,
  Volume2,
} from "lucide-react"

export default function PreferencesPage() {
  const [preferences, setPreferences] = useState({
    // Language & Localization
    defaultLanguage: "en",
    dateTimeFormat: "12h",
    timezone: "UTC+05:30",

    // Terminology & Coding
    defaultCodingSystem: "namaste",
    dualCoding: true,
    autocompleteSpeed: "fast",

    // Theme & Layout
    theme: "system",
    viewMode: "detailed",
    fontSize: [16],

    // Notifications
    inAppNotifications: true,
    emailNotifications: true,
    smsNotifications: false,
    newAppointmentAlert: true,
    labResultAlert: true,
    consentRequestAlert: true,
    terminologyUpdateAlert: false,

    // Default Navigation
    defaultLandingPage: "dashboard",
  })

  const updatePreference = (key: string, value: any) => {
    setPreferences((prev) => ({ ...prev, [key]: value }))
  }

  const resetToDefaults = () => {
    // Reset logic here
    console.log("Resetting to defaults...")
  }

  const savePreferences = () => {
    // Save logic here
    console.log("Saving preferences...", preferences)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5">
      {/* Header Section */}
      <div className="relative overflow-hidden bg-gradient-to-r from-primary/10 via-primary/5 to-secondary/10 border-b border-border/50">
        <div className="absolute inset-0 bg-gradient-to-r from-primary/5 to-secondary/5 opacity-50" />
        <div className="relative container mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
            <div className="space-y-2">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-primary/20 rounded-lg">
                  <Settings className="h-6 w-6 text-primary" />
                </div>
                <h1 className="text-3xl sm:text-4xl font-bold text-foreground">Preferences</h1>
              </div>
              <p className="text-lg text-muted-foreground max-w-2xl">
                Customize your experience and configure default settings to match your workflow.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-3">
              <Button
                variant="outline"
                onClick={resetToDefaults}
                className="border-border/50 hover:bg-muted/50 transition-all duration-300 hover:scale-105 bg-transparent"
              >
                <RotateCcw className="h-4 w-4 mr-2" />
                Reset to Defaults
              </Button>
              <Button
                onClick={savePreferences}
                className="bg-primary hover:bg-primary/90 text-primary-foreground transition-all duration-300 hover:scale-105 hover:shadow-lg"
              >
                <Save className="h-4 w-4 mr-2" />
                Save Changes
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Language & Localization */}
          <Card className="border-border/50 bg-card/50 backdrop-blur hover:shadow-xl transition-all duration-500 hover:scale-[1.02] group">
            <CardHeader className="pb-6">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-primary/20 rounded-lg group-hover:bg-primary/30 transition-colors duration-300">
                  <Globe className="h-5 w-5 text-primary" />
                </div>
                <CardTitle className="text-xl font-semibold">Language & Localization</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label className="text-sm font-medium">Default Language</Label>
                <Select
                  value={preferences.defaultLanguage}
                  onValueChange={(value) => updatePreference("defaultLanguage", value)}
                >
                  <SelectTrigger className="bg-background/50 border-border/50 hover:border-primary/50 transition-colors duration-300">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="en">🇺🇸 English</SelectItem>
                    <SelectItem value="hi">🇮🇳 Hindi</SelectItem>
                    <SelectItem value="sa">🕉️ Sanskrit</SelectItem>
                    <SelectItem value="ta">🇮🇳 Tamil</SelectItem>
                    <SelectItem value="te">🇮🇳 Telugu</SelectItem>
                    <SelectItem value="bn">🇮🇳 Bengali</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label className="text-sm font-medium">Date/Time Format</Label>
                <Select
                  value={preferences.dateTimeFormat}
                  onValueChange={(value) => updatePreference("dateTimeFormat", value)}
                >
                  <SelectTrigger className="bg-background/50 border-border/50 hover:border-primary/50 transition-colors duration-300">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="12h">12-hour (2:30 PM)</SelectItem>
                    <SelectItem value="24h">24-hour (14:30)</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label className="text-sm font-medium">Timezone</Label>
                <Select value={preferences.timezone} onValueChange={(value) => updatePreference("timezone", value)}>
                  <SelectTrigger className="bg-background/50 border-border/50 hover:border-primary/50 transition-colors duration-300">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="UTC+05:30">🇮🇳 India Standard Time (UTC+05:30)</SelectItem>
                    <SelectItem value="UTC+00:00">🇬🇧 Greenwich Mean Time (UTC+00:00)</SelectItem>
                    <SelectItem value="UTC-05:00">🇺🇸 Eastern Time (UTC-05:00)</SelectItem>
                    <SelectItem value="UTC-08:00">🇺🇸 Pacific Time (UTC-08:00)</SelectItem>
                    <SelectItem value="UTC+09:00">🇯🇵 Japan Standard Time (UTC+09:00)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          {/* Terminology & Coding */}
          <Card className="border-border/50 bg-card/50 backdrop-blur hover:shadow-xl transition-all duration-500 hover:scale-[1.02] group">
            <CardHeader className="pb-6">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-secondary/20 rounded-lg group-hover:bg-secondary/30 transition-colors duration-300">
                  <Code className="h-5 w-5 text-secondary" />
                </div>
                <CardTitle className="text-xl font-semibold">Terminology & Coding</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label className="text-sm font-medium">Default Coding System</Label>
                <Select
                  value={preferences.defaultCodingSystem}
                  onValueChange={(value) => updatePreference("defaultCodingSystem", value)}
                >
                  <SelectTrigger className="bg-background/50 border-border/50 hover:border-secondary/50 transition-colors duration-300">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="namaste">
                      <div className="flex items-center gap-2">
                        <Badge variant="secondary" className="text-xs">
                          NAMASTE
                        </Badge>
                        Traditional Medicine
                      </div>
                    </SelectItem>
                    <SelectItem value="icd11-bio">
                      <div className="flex items-center gap-2">
                        <Badge variant="outline" className="text-xs">
                          ICD-11
                        </Badge>
                        Biomedical
                      </div>
                    </SelectItem>
                    <SelectItem value="icd11-tm2">
                      <div className="flex items-center gap-2">
                        <Badge variant="outline" className="text-xs">
                          ICD-11
                        </Badge>
                        Traditional Medicine 2
                      </div>
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex items-center justify-between p-4 bg-muted/30 rounded-lg border border-border/30">
                <div className="space-y-1">
                  <Label className="text-sm font-medium">Enable Dual Coding</Label>
                  <p className="text-xs text-muted-foreground">Always save NAMASTE + ICD together</p>
                </div>
                <Switch
                  checked={preferences.dualCoding}
                  onCheckedChange={(checked) => updatePreference("dualCoding", checked)}
                />
              </div>

              <div className="space-y-2">
                <Label className="text-sm font-medium">Autocomplete Speed</Label>
                <Select
                  value={preferences.autocompleteSpeed}
                  onValueChange={(value) => updatePreference("autocompleteSpeed", value)}
                >
                  <SelectTrigger className="bg-background/50 border-border/50 hover:border-secondary/50 transition-colors duration-300">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="fast">
                      <div className="flex items-center gap-2">
                        <Zap className="h-4 w-4 text-primary" />
                        Fast Search
                      </div>
                    </SelectItem>
                    <SelectItem value="detailed">
                      <div className="flex items-center gap-2">
                        <Search className="h-4 w-4 text-secondary" />
                        Detailed Search
                      </div>
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          {/* Theme & Layout */}
          <Card className="border-border/50 bg-card/50 backdrop-blur hover:shadow-xl transition-all duration-500 hover:scale-[1.02] group">
            <CardHeader className="pb-6">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-primary/20 rounded-lg group-hover:bg-primary/30 transition-colors duration-300">
                  <Palette className="h-5 w-5 text-primary" />
                </div>
                <CardTitle className="text-xl font-semibold">Theme & Layout</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-3">
                <Label className="text-sm font-medium">Theme Preference</Label>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { value: "light", icon: Sun, label: "Light" },
                    { value: "dark", icon: Moon, label: "Dark" },
                    { value: "system", icon: Monitor, label: "System" },
                  ].map((theme) => (
                    <button
                      key={theme.value}
                      onClick={() => updatePreference("theme", theme.value)}
                      className={`p-3 rounded-lg border transition-all duration-300 hover:scale-105 ${
                        preferences.theme === theme.value
                          ? "border-primary bg-primary/10 text-primary"
                          : "border-border/50 hover:border-primary/50 hover:bg-muted/30"
                      }`}
                    >
                      <theme.icon className="h-5 w-5 mx-auto mb-1" />
                      <span className="text-xs font-medium">{theme.label}</span>
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-3">
                <Label className="text-sm font-medium">Table View Mode</Label>
                <div className="grid grid-cols-2 gap-2">
                  {[
                    { value: "compact", icon: Layout, label: "Compact" },
                    { value: "detailed", icon: Type, label: "Detailed" },
                  ].map((mode) => (
                    <button
                      key={mode.value}
                      onClick={() => updatePreference("viewMode", mode.value)}
                      className={`p-3 rounded-lg border transition-all duration-300 hover:scale-105 ${
                        preferences.viewMode === mode.value
                          ? "border-secondary bg-secondary/10 text-secondary"
                          : "border-border/50 hover:border-secondary/50 hover:bg-muted/30"
                      }`}
                    >
                      <mode.icon className="h-5 w-5 mx-auto mb-1" />
                      <span className="text-xs font-medium">{mode.label}</span>
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <Label className="text-sm font-medium">Font Size</Label>
                  <Badge variant="outline" className="text-xs">
                    {preferences.fontSize[0]}px
                  </Badge>
                </div>
                <Slider
                  value={preferences.fontSize}
                  onValueChange={(value) => updatePreference("fontSize", value)}
                  max={24}
                  min={12}
                  step={1}
                  className="w-full"
                />
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>Small (12px)</span>
                  <span>Large (24px)</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Notifications */}
          <Card className="border-border/50 bg-card/50 backdrop-blur hover:shadow-xl transition-all duration-500 hover:scale-[1.02] group">
            <CardHeader className="pb-6">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-secondary/20 rounded-lg group-hover:bg-secondary/30 transition-colors duration-300">
                  <Bell className="h-5 w-5 text-secondary" />
                </div>
                <CardTitle className="text-xl font-semibold">Notifications</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <h4 className="text-sm font-medium text-muted-foreground uppercase tracking-wide">Delivery Methods</h4>

                {[
                  {
                    key: "inAppNotifications",
                    icon: Volume2,
                    label: "In-App Notifications",
                    desc: "Show notifications within the application",
                  },
                  {
                    key: "emailNotifications",
                    icon: Mail,
                    label: "Email Notifications",
                    desc: "Send notifications to your email address",
                  },
                  {
                    key: "smsNotifications",
                    icon: Smartphone,
                    label: "SMS Notifications",
                    desc: "Send text messages to your phone",
                  },
                ].map((method) => (
                  <div
                    key={method.key}
                    className="flex items-center justify-between p-4 bg-muted/30 rounded-lg border border-border/30 hover:bg-muted/50 transition-colors duration-300"
                  >
                    <div className="flex items-center gap-3">
                      <method.icon className="h-5 w-5 text-primary" />
                      <div>
                        <Label className="text-sm font-medium">{method.label}</Label>
                        <p className="text-xs text-muted-foreground">{method.desc}</p>
                      </div>
                    </div>
                    <Switch
                      checked={preferences[method.key as keyof typeof preferences] as boolean}
                      onCheckedChange={(checked) => updatePreference(method.key, checked)}
                    />
                  </div>
                ))}
              </div>

              <Separator />

              <div className="space-y-4">
                <h4 className="text-sm font-medium text-muted-foreground uppercase tracking-wide">Alert Types</h4>

                {[
                  {
                    key: "newAppointmentAlert",
                    label: "New Appointment Assigned",
                    desc: "When a new appointment is scheduled for you",
                  },
                  { key: "labResultAlert", label: "Lab Result Uploaded", desc: "When new lab results are available" },
                  {
                    key: "consentRequestAlert",
                    label: "Consent Request Pending",
                    desc: "When patient consent is required",
                  },
                  {
                    key: "terminologyUpdateAlert",
                    label: "Terminology Update Sync",
                    desc: "When terminology databases are updated",
                  },
                ].map((alert) => (
                  <div
                    key={alert.key}
                    className="flex items-center justify-between p-3 rounded-lg hover:bg-muted/30 transition-colors duration-300"
                  >
                    <div className="space-y-1">
                      <Label className="text-sm font-medium">{alert.label}</Label>
                      <p className="text-xs text-muted-foreground">{alert.desc}</p>
                    </div>
                    <Switch
                      checked={preferences[alert.key as keyof typeof preferences] as boolean}
                      onCheckedChange={(checked) => updatePreference(alert.key, checked)}
                    />
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Default Navigation */}
          <Card className="border-border/50 bg-card/50 backdrop-blur hover:shadow-xl transition-all duration-500 hover:scale-[1.02] group lg:col-span-2">
            <CardHeader className="pb-6">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-primary/20 rounded-lg group-hover:bg-primary/30 transition-colors duration-300">
                  <Navigation className="h-5 w-5 text-primary" />
                </div>
                <CardTitle className="text-xl font-semibold">Default Navigation</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <Label className="text-sm font-medium">Default Landing Page After Login</Label>
                <p className="text-xs text-muted-foreground mb-4">
                  Choose which page to display immediately after signing in
                </p>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  {[
                    { value: "dashboard", label: "Dashboard", desc: "Overview & analytics" },
                    { value: "patients", label: "Patients", desc: "Patient management" },
                    { value: "appointments", label: "Appointments", desc: "Schedule & calendar" },
                    { value: "terminology", label: "Terminology", desc: "Coding & references" },
                  ].map((page) => (
                    <button
                      key={page.value}
                      onClick={() => updatePreference("defaultLandingPage", page.value)}
                      className={`p-4 rounded-lg border text-left transition-all duration-300 hover:scale-105 ${
                        preferences.defaultLandingPage === page.value
                          ? "border-primary bg-primary/10 text-primary"
                          : "border-border/50 hover:border-primary/50 hover:bg-muted/30"
                      }`}
                    >
                      <div className="font-medium text-sm mb-1">{page.label}</div>
                      <div className="text-xs text-muted-foreground">{page.desc}</div>
                    </button>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Bottom Actions */}
        <div className="mt-12 flex flex-col sm:flex-row gap-4 justify-center items-center p-6 bg-muted/30 rounded-xl border border-border/50">
          <div className="text-center sm:text-left">
            <p className="text-sm font-medium text-foreground">Ready to save your preferences?</p>
            <p className="text-xs text-muted-foreground">
              Changes will be applied immediately across all your sessions.
            </p>
          </div>
          <div className="flex gap-3">
            <Button
              variant="outline"
              onClick={resetToDefaults}
              className="border-border/50 hover:bg-muted/50 transition-all duration-300 bg-transparent"
            >
              <RotateCcw className="h-4 w-4 mr-2" />
              Reset All
            </Button>
            <Button
              onClick={savePreferences}
              className="bg-gradient-to-r from-primary to-secondary hover:from-primary/90 hover:to-secondary/90 text-white transition-all duration-300 hover:scale-105 hover:shadow-lg"
            >
              <Save className="h-4 w-4 mr-2" />
              Save Preferences
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
