"use client"

import { useState } from "react"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Shield, Key, Users, FileText, Activity, AlertTriangle, Smartphone, Globe, Clock, CheckCircle, XCircle, Monitor, MapPin, Mail, Bell, LogOut, Eye, EyeOff, ChevronRight, Lock, UserCheck, Settings } from 'lucide-react'

export default function SecurityPage() {
  const [showPassword, setShowPassword] = useState(false)
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(true)
  const [emergencyOverride, setEmergencyOverride] = useState(false)
  const [researchDataConsent, setResearchDataConsent] = useState(true)
  const [emailAlerts, setEmailAlerts] = useState(true)
  const [consentNotifications, setConsentNotifications] = useState(true)

  const activeSessions = [
    { device: "MacBook Pro", location: "New Delhi, India", ip: "192.168.1.1", lastActive: "Active now", current: true },
    { device: "iPhone 15", location: "Mumbai, India", ip: "192.168.1.2", lastActive: "2 hours ago", current: false },
    { device: "Chrome Browser", location: "Bangalore, India", ip: "192.168.1.3", lastActive: "1 day ago", current: false },
  ]

  const loginAttempts = [
    { timestamp: "Sept 10, 2025 - 2:30 PM", device: "MacBook Pro", ip: "192.168.1.1", location: "New Delhi", status: "success" },
    { timestamp: "Sept 10, 2025 - 8:15 AM", device: "iPhone 15", ip: "192.168.1.2", location: "Mumbai", status: "success" },
    { timestamp: "Sept 9, 2025 - 11:45 PM", device: "Unknown Device", ip: "203.0.113.1", location: "Unknown", status: "failed" },
    { timestamp: "Sept 9, 2025 - 6:20 PM", device: "Chrome Browser", ip: "192.168.1.3", location: "Bangalore", status: "success" },
    { timestamp: "Sept 8, 2025 - 3:10 PM", device: "MacBook Pro", ip: "192.168.1.1", location: "New Delhi", status: "success" },
  ]

  const patientConsents = [
    { patientId: "P-2025-001", name: "Rajesh Kumar", consentType: "Treatment Data", status: "granted", date: "Sept 8, 2025" },
    { patientId: "P-2025-002", name: "Priya Sharma", consentType: "Research Participation", status: "granted", date: "Sept 7, 2025" },
    { patientId: "P-2025-003", name: "Amit Singh", consentType: "Data Sharing", status: "denied", date: "Sept 6, 2025" },
    { patientId: "P-2025-004", name: "Sunita Patel", consentType: "Emergency Access", status: "granted", date: "Sept 5, 2025" },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5">
      {/* Header Section */}
      <div className="relative overflow-hidden bg-gradient-to-r from-primary/10 via-primary/5 to-secondary/10 border-b border-border/50">
        <div className="absolute inset-0 bg-gradient-to-r from-primary/5 to-secondary/5 opacity-50" />
        <div className="relative container mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="flex items-center space-x-4 mb-6">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-primary/20 to-secondary/20 border border-primary/20">
              <Shield className="h-8 w-8 text-primary" />
            </div>
            <div>
              <h1 className="text-4xl font-bold tracking-tight text-foreground sm:text-5xl">
                Security Center
              </h1>
              <p className="text-lg text-muted-foreground mt-2">
                Manage authentication, access control, and privacy settings with ISO 22600 compliance
              </p>
            </div>
          </div>
          
          {/* Security Status Badge */}
          <div className="inline-flex items-center rounded-full border border-primary/20 bg-primary/10 px-4 py-2 text-sm font-medium text-primary">
            <CheckCircle className="mr-2 h-4 w-4" />
            Security Status: Protected
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {/* Authentication Section */}
        <Card className="relative group hover:shadow-xl transition-all duration-500 border-border/50 bg-card/50 backdrop-blur">
          <CardHeader className="pb-4">
            <div className="flex items-center space-x-3">
              <div className="inline-flex items-center justify-center w-10 h-10 rounded-lg bg-gradient-to-br from-primary/10 to-primary/20">
                <Key className="h-5 w-5 text-primary" />
              </div>
              <div>
                <CardTitle className="text-xl font-semibold">Authentication</CardTitle>
                <p className="text-sm text-muted-foreground">Secure your account with strong authentication methods</p>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Change Password */}
            <div className="space-y-3">
              <Label className="text-sm font-medium">Change Password</Label>
              <div className="relative">
                <Input 
                  type={showPassword ? "text" : "password"} 
                  placeholder="Enter new password" 
                  className="pr-10 bg-background/50 border-border/50 focus:border-primary/50"
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </Button>
              </div>
              <p className="text-xs text-muted-foreground">Use at least 8 characters with a mix of letters, numbers, and symbols</p>
            </div>

            <Separator className="bg-border/50" />

            {/* Two-Factor Authentication */}
            <div className="flex items-center justify-between p-4 rounded-lg bg-gradient-to-r from-primary/5 to-secondary/5 border border-primary/10">
              <div className="flex items-center space-x-3">
                <Smartphone className="h-5 w-5 text-primary" />
                <div>
                  <Label className="text-sm font-medium">Two-Factor Authentication</Label>
                  <p className="text-xs text-muted-foreground">Add an extra layer of security to your account</p>
                </div>
              </div>
              <Switch 
                checked={twoFactorEnabled} 
                onCheckedChange={setTwoFactorEnabled}
                className="data-[state=checked]:bg-primary"
              />
            </div>

            {/* ABHA OAuth Status */}
            <div className="flex items-center justify-between p-4 rounded-lg bg-muted/30 border border-border/50">
              <div className="flex items-center space-x-3">
                <Globe className="h-5 w-5 text-secondary" />
                <div>
                  <Label className="text-sm font-medium">ABHA OAuth Connection</Label>
                  <p className="text-xs text-muted-foreground">Connected to Ayushman Bharat Health Account</p>
                </div>
              </div>
              <Badge variant="secondary" className="bg-secondary/20 text-secondary border-secondary/20">
                <CheckCircle className="mr-1 h-3 w-3" />
                Connected
              </Badge>
            </div>
          </CardContent>
        </Card>

        {/* Access Control Section */}
        <Card className="relative group hover:shadow-xl transition-all duration-500 border-border/50 bg-card/50 backdrop-blur">
          <CardHeader className="pb-4">
            <div className="flex items-center space-x-3">
              <div className="inline-flex items-center justify-center w-10 h-10 rounded-lg bg-gradient-to-br from-secondary/10 to-secondary/20">
                <Users className="h-5 w-5 text-secondary" />
              </div>
              <div>
                <CardTitle className="text-xl font-semibold">Access Control</CardTitle>
                <p className="text-sm text-muted-foreground">Manage your role and permissions within the system</p>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Current Role */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="text-sm font-medium">Current Role</Label>
                <div className="flex items-center space-x-2 p-3 rounded-lg bg-primary/10 border border-primary/20">
                  <UserCheck className="h-4 w-4 text-primary" />
                  <span className="font-medium text-primary">Senior Doctor</span>
                </div>
              </div>
              <div className="space-y-2">
                <Label className="text-sm font-medium">Department</Label>
                <div className="flex items-center space-x-2 p-3 rounded-lg bg-muted/30 border border-border/50">
                  <Settings className="h-4 w-4 text-muted-foreground" />
                  <span className="text-foreground">Cardiology</span>
                </div>
              </div>
            </div>

            {/* Permissions Overview */}
            <div className="space-y-3">
              <Label className="text-sm font-medium">Current Permissions</Label>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {[
                  { permission: "View Patient Records", granted: true },
                  { permission: "Edit Medical Data", granted: true },
                  { permission: "Prescribe Medications", granted: true },
                  { permission: "Access Lab Results", granted: true },
                  { permission: "Admin Functions", granted: false },
                  { permission: "System Configuration", granted: false },
                ].map((item, index) => (
                  <div key={index} className="flex items-center space-x-2 p-2 rounded-lg bg-background/50 border border-border/30">
                    {item.granted ? (
                      <CheckCircle className="h-4 w-4 text-primary" />
                    ) : (
                      <XCircle className="h-4 w-4 text-muted-foreground" />
                    )}
                    <span className={`text-xs ${item.granted ? 'text-foreground' : 'text-muted-foreground'}`}>
                      {item.permission}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <Separator className="bg-border/50" />

            {/* Emergency Override */}
            <div className="flex items-center justify-between p-4 rounded-lg bg-gradient-to-r from-destructive/5 to-destructive/10 border border-destructive/20">
              <div className="flex items-center space-x-3">
                <AlertTriangle className="h-5 w-5 text-destructive" />
                <div>
                  <Label className="text-sm font-medium">Emergency Override Access</Label>
                  <p className="text-xs text-muted-foreground">Enable emergency access with full audit logging</p>
                </div>
              </div>
              <Switch 
                checked={emergencyOverride} 
                onCheckedChange={setEmergencyOverride}
                className="data-[state=checked]:bg-destructive"
              />
            </div>

            {/* Role Upgrade Request */}
            <div className="p-4 rounded-lg bg-muted/30 border border-border/50">
              <div className="flex items-center justify-between">
                <div>
                  <Label className="text-sm font-medium">Request Role Upgrade</Label>
                  <p className="text-xs text-muted-foreground">Submit a request for additional permissions</p>
                </div>
                <Button variant="outline" size="sm" className="border-primary/20 text-primary hover:bg-primary/10">
                  Request Upgrade
                  <ChevronRight className="ml-1 h-3 w-3" />
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Consent Management Section */}
        <Card className="relative group hover:shadow-xl transition-all duration-500 border-border/50 bg-card/50 backdrop-blur">
          <CardHeader className="pb-4">
            <div className="flex items-center space-x-3">
              <div className="inline-flex items-center justify-center w-10 h-10 rounded-lg bg-gradient-to-br from-primary/10 to-primary/20">
                <FileText className="h-5 w-5 text-primary" />
              </div>
              <div>
                <CardTitle className="text-xl font-semibold">Consent Management</CardTitle>
                <p className="text-sm text-muted-foreground">Overview of patient consents and data usage permissions</p>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Research Data Consent */}
            <div className="flex items-center justify-between p-4 rounded-lg bg-gradient-to-r from-secondary/5 to-secondary/10 border border-secondary/20">
              <div className="flex items-center space-x-3">
                <FileText className="h-5 w-5 text-secondary" />
                <div>
                  <Label className="text-sm font-medium">Allow Research Use of De-identified Data</Label>
                  <p className="text-xs text-muted-foreground">Contribute to medical research while maintaining privacy</p>
                </div>
              </div>
              <Switch 
                checked={researchDataConsent} 
                onCheckedChange={setResearchDataConsent}
                className="data-[state=checked]:bg-secondary"
              />
            </div>

            {/* Active Patient Consents */}
            <div className="space-y-3">
              <Label className="text-sm font-medium">Recent Patient Consents</Label>
              <div className="space-y-2 max-h-64 overflow-y-auto">
                {patientConsents.map((consent, index) => (
                  <div key={index} className="flex items-center justify-between p-3 rounded-lg bg-background/50 border border-border/30 hover:bg-background/80 transition-colors">
                    <div className="flex items-center space-x-3">
                      <div className={`w-2 h-2 rounded-full ${consent.status === 'granted' ? 'bg-primary' : 'bg-destructive'}`} />
                      <div>
                        <p className="text-sm font-medium">{consent.name}</p>
                        <p className="text-xs text-muted-foreground">{consent.consentType} • {consent.date}</p>
                      </div>
                    </div>
                    <Badge variant={consent.status === 'granted' ? 'default' : 'destructive'} className="text-xs">
                      {consent.status}
                    </Badge>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Audit & Activity Section */}
        <Card className="relative group hover:shadow-xl transition-all duration-500 border-border/50 bg-card/50 backdrop-blur">
          <CardHeader className="pb-4">
            <div className="flex items-center space-x-3">
              <div className="inline-flex items-center justify-center w-10 h-10 rounded-lg bg-gradient-to-br from-secondary/10 to-secondary/20">
                <Activity className="h-5 w-5 text-secondary" />
              </div>
              <div>
                <CardTitle className="text-xl font-semibold">Audit & Activity</CardTitle>
                <p className="text-sm text-muted-foreground">Monitor your account activity and manage active sessions</p>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Recent Login Attempts */}
            <div className="space-y-3">
              <Label className="text-sm font-medium">Recent Login Attempts</Label>
              <div className="space-y-2 max-h-48 overflow-y-auto">
                {loginAttempts.map((attempt, index) => (
                  <div key={index} className="flex items-center justify-between p-3 rounded-lg bg-background/50 border border-border/30">
                    <div className="flex items-center space-x-3">
                      {attempt.status === 'success' ? (
                        <CheckCircle className="h-4 w-4 text-primary" />
                      ) : (
                        <XCircle className="h-4 w-4 text-destructive" />
                      )}
                      <div>
                        <p className="text-sm font-medium">{attempt.device}</p>
                        <p className="text-xs text-muted-foreground">
                          {attempt.timestamp} • {attempt.location} • {attempt.ip}
                        </p>
                      </div>
                    </div>
                    <Badge variant={attempt.status === 'success' ? 'default' : 'destructive'} className="text-xs">
                      {attempt.status}
                    </Badge>
                  </div>
                ))}
              </div>
            </div>

            <Separator className="bg-border/50" />

            {/* Active Sessions */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <Label className="text-sm font-medium">Active Sessions</Label>
                <Button variant="outline" size="sm" className="text-destructive border-destructive/20 hover:bg-destructive/10">
                  <LogOut className="mr-1 h-3 w-3" />
                  Log Out All Devices
                </Button>
              </div>
              <div className="space-y-2">
                {activeSessions.map((session, index) => (
                  <div key={index} className={`flex items-center justify-between p-3 rounded-lg border transition-colors ${
                    session.current 
                      ? 'bg-primary/10 border-primary/20' 
                      : 'bg-background/50 border-border/30 hover:bg-background/80'
                  }`}>
                    <div className="flex items-center space-x-3">
                      <Monitor className="h-4 w-4 text-muted-foreground" />
                      <div>
                        <p className="text-sm font-medium flex items-center">
                          {session.device}
                          {session.current && (
                            <Badge variant="secondary" className="ml-2 text-xs bg-primary/20 text-primary">
                              Current
                            </Badge>
                          )}
                        </p>
                        <p className="text-xs text-muted-foreground flex items-center">
                          <MapPin className="mr-1 h-3 w-3" />
                          {session.location} • {session.ip} • {session.lastActive}
                        </p>
                      </div>
                    </div>
                    {!session.current && (
                      <Button variant="ghost" size="sm" className="text-destructive hover:bg-destructive/10">
                        <LogOut className="h-3 w-3" />
                      </Button>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Security Alerts Section */}
        <Card className="relative group hover:shadow-xl transition-all duration-500 border-border/50 bg-card/50 backdrop-blur">
          <CardHeader className="pb-4">
            <div className="flex items-center space-x-3">
              <div className="inline-flex items-center justify-center w-10 h-10 rounded-lg bg-gradient-to-br from-destructive/10 to-destructive/20">
                <Bell className="h-5 w-5 text-destructive" />
              </div>
              <div>
                <CardTitle className="text-xl font-semibold">Security Alerts</CardTitle>
                <p className="text-sm text-muted-foreground">Configure notifications for security events</p>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Email Alerts */}
            <div className="flex items-center justify-between p-4 rounded-lg bg-gradient-to-r from-primary/5 to-secondary/5 border border-primary/10">
              <div className="flex items-center space-x-3">
                <Mail className="h-5 w-5 text-primary" />
                <div>
                  <Label className="text-sm font-medium">Email Alerts for Failed Login Attempts</Label>
                  <p className="text-xs text-muted-foreground">Get notified when someone tries to access your account</p>
                </div>
              </div>
              <Switch 
                checked={emailAlerts} 
                onCheckedChange={setEmailAlerts}
                className="data-[state=checked]:bg-primary"
              />
            </div>

            {/* Consent Override Notifications */}
            <div className="flex items-center justify-between p-4 rounded-lg bg-gradient-to-r from-secondary/5 to-secondary/10 border border-secondary/20">
              <div className="flex items-center space-x-3">
                <AlertTriangle className="h-5 w-5 text-secondary" />
                <div>
                  <Label className="text-sm font-medium">Consent Override Notifications</Label>
                  <p className="text-xs text-muted-foreground">Alert when patient consent is overridden in emergencies</p>
                </div>
              </div>
              <Switch 
                checked={consentNotifications} 
                onCheckedChange={setConsentNotifications}
                className="data-[state=checked]:bg-secondary"
              />
            </div>

            {/* Recent Security Events */}
            <div className="space-y-3">
              <Label className="text-sm font-medium">Recent Security Events</Label>
              <div className="space-y-2">
                <div className="flex items-center space-x-3 p-3 rounded-lg bg-background/50 border border-border/30">
                  <div className="w-2 h-2 rounded-full bg-destructive" />
                  <div className="flex-1">
                    <p className="text-sm font-medium">Failed login attempt detected</p>
                    <p className="text-xs text-muted-foreground">Sept 9, 2025 - 11:45 PM from Unknown Device</p>
                  </div>
                  <Badge variant="destructive" className="text-xs">High</Badge>
                </div>
                <div className="flex items-center space-x-3 p-3 rounded-lg bg-background/50 border border-border/30">
                  <div className="w-2 h-2 rounded-full bg-secondary" />
                  <div className="flex-1">
                    <p className="text-sm font-medium">Emergency override activated</p>
                    <p className="text-xs text-muted-foreground">Sept 8, 2025 - 3:20 AM for Patient P-2025-005</p>
                  </div>
                  <Badge variant="secondary" className="text-xs">Medium</Badge>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Save Button */}
        <div className="flex justify-end pt-6">
          <Button 
            size="lg" 
            className="bg-primary hover:bg-primary/90 text-primary-foreground px-8 py-4 text-lg font-semibold transition-all duration-300 hover:scale-105 hover:shadow-lg group"
          >
            <Lock className="mr-2 h-5 w-5 transition-transform duration-300 group-hover:scale-110" />
            Save Security Settings
          </Button>
        </div>
      </div>
    </div>
  )
}
