"use client"

import React, { useState } from "react"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import {
  Settings,
  User,
  Building,
  Palette,
  Users,
  CreditCard,
  Shield,
  FileText,
  Link2,
  Archive,
  Database,
  Bell,
  Globe,
  Eye,
  Upload,
  Download,
  CheckCircle,
  AlertTriangle,
  Sparkles,
  Lock,
  Key,
  Activity,
  Search,
  Zap,
  Edit,
  Save,
  X,
  Plus,
  MoreHorizontal,
  Calendar,
  DollarSign,
  FileDown,
  HelpCircle,
} from "lucide-react"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState("profile")
  const [searchQuery, setSearchQuery] = useState("")
  const [syncStatus, setSyncStatus] = useState("Last synced 2 hours ago")
  const [mfaEnabled, setMfaEnabled] = useState(false)
  const [darkMode, setDarkMode] = useState(false)
  const [editingSections, setEditingSections] = useState<Record<string, boolean>>({})
  const [notifications, setNotifications] = useState({
    email: true,
    sms: false,
    push: true,
  })

  const tabs = [
    { id: "profile", label: "Profile", icon: User },
    { id: "organization", label: "Organization", icon: Building },
    { id: "preferences", label: "Preferences", icon: Palette },
    { id: "users", label: "Users & Roles", icon: Users },
    { id: "billing", label: "Billing", icon: CreditCard },
    { id: "security", label: "Security", icon: Shield },
    { id: "consent", label: "Consent", icon: FileText },
    { id: "integration", label: "Integration", icon: Link2 },
    { id: "audit", label: "Audit", icon: Archive },
    { id: "terminology", label: "Terminology", icon: Database },
  ]

  const filteredTabs = tabs.filter(
    (tab) =>
      searchQuery === "" ||
      tab.label.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (searchQuery.toLowerCase().includes("consent") && tab.id === "consent"),
  )

  const toggleEdit = (section: string) => {
    setEditingSections((prev) => ({
      ...prev,
      [section]: !prev[section],
    }))
  }

  const saveSection = (section: string) => {
    setEditingSections((prev) => ({
      ...prev,
      [section]: false,
    }))
    // Here you would typically save the data to your backend
  }

  const isEditing = (section: string) => editingSections[section] || false
  const hasAnyEditing = Object.values(editingSections).some(Boolean)

  React.useEffect(() => {
    if (searchQuery.toLowerCase().includes("consent") && activeTab !== "consent") {
      setActiveTab("consent")
    }
  }, [searchQuery, activeTab])

  const StatusIndicator = ({ status, text }: { status: string; text: string }) => (
    <div className="flex items-center space-x-2">
      {status === "success" && <CheckCircle className="h-4 w-4 text-green-500" />}
      {status === "warning" && <AlertTriangle className="h-4 w-4 text-yellow-500" />}
      {status === "error" && <AlertTriangle className="h-4 w-4 text-red-500" />}
      <span className="text-sm text-muted-foreground">{text}</span>
    </div>
  )

  const TooltipWrapper = ({ children, content }: { children: React.ReactNode; content: string }) => (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <div className="flex items-center space-x-2">
            {children}
            <HelpCircle className="h-4 w-4 text-muted-foreground hover:text-foreground transition-colors" />
          </div>
        </TooltipTrigger>
        <TooltipContent>
          <p className="max-w-xs">{content}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  )

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-accent/5 relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute top-20 left-10 w-32 h-32 bg-primary/5 rounded-full blur-2xl animate-pulse" />
      <div className="absolute bottom-20 right-10 w-40 h-40 bg-accent/5 rounded-full blur-2xl animate-pulse delay-1000" />

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-8 relative">
        {/* Header */}
        <div className="mb-6 sm:mb-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0 mb-4">
            <div className="flex items-center space-x-3">
              <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
                <Settings className="h-5 w-5 text-primary" />
              </div>
              <div>
                <h1 className="font-playfair text-2xl sm:text-3xl font-bold">System Settings</h1>
                <p className="text-muted-foreground text-sm sm:text-base">
                  Configure your AyuSync platform preferences and integrations
                </p>
              </div>
            </div>

            <div className="relative w-full sm:w-80">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search settings (e.g., 'consent', 'users')"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>

          {/* Quick Status Cards */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4 mb-6">
            <Card className="hover:shadow-lg transition-all duration-300 border-primary/20">
              <CardContent className="p-3 sm:p-4">
                <div className="flex items-center space-x-2">
                  <CheckCircle className="h-4 w-4 text-green-500" />
                  <span className="text-xs sm:text-sm font-medium">System Online</span>
                </div>
                <p className="text-xs text-muted-foreground mt-1">All services operational</p>
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition-all duration-300 border-primary/20">
              <CardContent className="p-3 sm:p-4">
                <div className="flex items-center space-x-2">
                  <Activity className="h-4 w-4 text-primary" />
                  <span className="text-xs sm:text-sm font-medium">API Status</span>
                </div>
                <p className="text-xs text-muted-foreground mt-1">Connected to WHO ICD</p>
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition-all duration-300 border-primary/20">
              <CardContent className="p-3 sm:p-4">
                <div className="flex items-center space-x-2">
                  <Shield className="h-4 w-4 text-blue-500" />
                  <span className="text-xs sm:text-sm font-medium">Compliance</span>
                </div>
                <p className="text-xs text-muted-foreground mt-1">FHIR & HIPAA Ready</p>
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition-all duration-300 border-primary/20">
              <CardContent className="p-3 sm:p-4">
                <div className="flex items-center space-x-2">
                  <Database className="h-4 w-4 text-accent" />
                  <span className="text-xs sm:text-sm font-medium">Data Sync</span>
                </div>
                <p className="text-xs text-muted-foreground mt-1">{syncStatus}</p>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Main Settings Interface */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          {/* Enhanced Tab Navigation */}
          <div className="mb-6 overflow-x-auto">
            <TabsList className="inline-flex h-12 items-center justify-center rounded-xl bg-muted/50 p-1 backdrop-blur-sm border border-border/50 min-w-max">
              {filteredTabs.map((tab) => {
                const IconComponent = tab.icon
                return (
                  <TabsTrigger
                    key={tab.id}
                    value={tab.id}
                    className="inline-flex items-center justify-center whitespace-nowrap rounded-lg px-3 sm:px-4 py-2 text-sm font-medium transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow-sm hover:bg-background/60 group"
                  >
                    <IconComponent className="h-4 w-4 mr-2 group-hover:scale-110 transition-transform duration-200" />
                    <span className="hidden sm:inline">{tab.label}</span>
                  </TabsTrigger>
                )
              })}
            </TabsList>
          </div>

          {/* Profile Settings */}
          <TabsContent value="profile" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card className="hover:shadow-xl transition-all duration-300 border-primary/20">
                <CardHeader className="flex flex-row items-center justify-between">
                  <CardTitle className="flex items-center space-x-2">
                    <User className="h-5 w-5 text-primary" />
                    <span>Personal Information</span>
                  </CardTitle>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => (isEditing("profile") ? saveSection("profile") : toggleEdit("profile"))}
                  >
                    {isEditing("profile") ? (
                      <>
                        <Save className="h-4 w-4 mr-2" />
                        Save
                      </>
                    ) : (
                      <>
                        <Edit className="h-4 w-4 mr-2" />
                        Edit
                      </>
                    )}
                  </Button>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center space-x-4 mb-4">
                    <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center relative group cursor-pointer">
                      <User className="h-6 w-6 text-primary" />
                      {isEditing("profile") && (
                        <div className="absolute inset-0 rounded-full bg-primary/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                          <Upload className="h-4 w-4 text-primary" />
                        </div>
                      )}
                    </div>
                    <div>
                      {isEditing("profile") && (
                        <Button variant="outline" size="sm">
                          Change Photo
                        </Button>
                      )}
                      <p className="text-xs text-muted-foreground mt-1">JPG, PNG up to 2MB</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="firstName">First Name</Label>
                      <Input
                        id="firstName"
                        placeholder="John"
                        className="mt-1"
                        disabled={!isEditing("profile")}
                        defaultValue="John"
                      />
                    </div>
                    <div>
                      <Label htmlFor="lastName">Last Name</Label>
                      <Input
                        id="lastName"
                        placeholder="Doe"
                        className="mt-1"
                        disabled={!isEditing("profile")}
                        defaultValue="Doe"
                      />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="designation">Designation</Label>
                    <Input
                      id="designation"
                      placeholder="Chief Medical Officer"
                      className="mt-1"
                      disabled={!isEditing("profile")}
                      defaultValue="Chief Medical Officer"
                    />
                  </div>

                  <div>
                    <Label htmlFor="email">Email Address</Label>
                    <div className="flex space-x-2 mt-1">
                      <Input
                        id="email"
                        placeholder="john.doe@hospital.com"
                        className="flex-1"
                        disabled={!isEditing("profile")}
                        defaultValue="john.doe@hospital.com"
                      />
                      {isEditing("profile") && (
                        <Button variant="outline" size="sm">
                          Verify
                        </Button>
                      )}
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="phone">Phone Number</Label>
                    <div className="flex space-x-2 mt-1">
                      <Input
                        id="phone"
                        placeholder="+91 98765 43210"
                        className="flex-1"
                        disabled={!isEditing("profile")}
                        defaultValue="+91 98765 43210"
                      />
                      {isEditing("profile") && (
                        <Button variant="outline" size="sm">
                          Verify
                        </Button>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="hover:shadow-xl transition-all duration-300 border-primary/20">
                <CardHeader className="flex flex-row items-center justify-between">
                  <CardTitle className="flex items-center space-x-2">
                    <Shield className="h-5 w-5 text-primary" />
                    <span>Security & Access</span>
                  </CardTitle>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => (isEditing("security") ? saveSection("security") : toggleEdit("security"))}
                  >
                    {isEditing("security") ? (
                      <>
                        <Save className="h-4 w-4 mr-2" />
                        Save
                      </>
                    ) : (
                      <>
                        <Edit className="h-4 w-4 mr-2" />
                        Edit
                      </>
                    )}
                  </Button>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label htmlFor="abhaId">ABHA ID</Label>
                    <div className="flex space-x-2 mt-1">
                      <Input
                        id="abhaId"
                        placeholder="14-1234-5678-9012"
                        className="flex-1"
                        disabled={!isEditing("security")}
                        defaultValue="14-1234-5678-9012"
                      />
                      <Button variant="outline" size="sm" className="shrink-0 bg-transparent">
                        <CheckCircle className="h-4 w-4 mr-1 text-green-500" />
                        Verified
                      </Button>
                    </div>
                  </div>

                  {isEditing("security") && (
                    <div>
                      <Label>Change Password</Label>
                      <div className="space-y-2 mt-1">
                        <Input type="password" placeholder="Current password" />
                        <Input type="password" placeholder="New password" />
                        <Input type="password" placeholder="Confirm new password" />
                      </div>
                    </div>
                  )}

                  <div className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                    <div className="space-y-1">
                      <Label>Two-Factor Authentication</Label>
                      <p className="text-sm text-muted-foreground">Add an extra layer of security</p>
                    </div>
                    <Switch checked={mfaEnabled} onCheckedChange={setMfaEnabled} disabled={!isEditing("security")} />
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="users" className="space-y-6">
            <Card className="hover:shadow-xl transition-all duration-300 border-primary/20">
              <CardHeader>
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
                  <CardTitle className="flex items-center space-x-2">
                    <Users className="h-5 w-5 text-primary" />
                    <span>User Management</span>
                  </CardTitle>
                  <div className="flex space-x-2">
                    <Button variant="outline" size="sm">
                      <Download className="h-4 w-4 mr-2" />
                      Export Users
                    </Button>
                    <Button className="group">
                      <Plus className="h-4 w-4 mr-2 group-hover:scale-110 transition-transform duration-200" />
                      Invite User
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Name</TableHead>
                        <TableHead>Email</TableHead>
                        <TableHead>Role</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Last Active</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {[
                        {
                          name: "Dr. Sarah Chen",
                          email: "sarah.chen@hospital.com",
                          role: "Admin",
                          status: "Active",
                          lastActive: "2 hours ago",
                        },
                        {
                          name: "Dr. Michael Kumar",
                          email: "michael.kumar@hospital.com",
                          role: "Doctor",
                          status: "Active",
                          lastActive: "1 day ago",
                        },
                        {
                          name: "Nurse Jane Smith",
                          email: "jane.smith@hospital.com",
                          role: "Nurse",
                          status: "Inactive",
                          lastActive: "3 days ago",
                        },
                        {
                          name: "Dr. Robert Wilson",
                          email: "robert.wilson@hospital.com",
                          role: "Doctor",
                          status: "Pending",
                          lastActive: "Never",
                        },
                      ].map((user, index) => (
                        <TableRow key={index}>
                          <TableCell className="font-medium">{user.name}</TableCell>
                          <TableCell>{user.email}</TableCell>
                          <TableCell>
                            <Badge variant={user.role === "Admin" ? "default" : "secondary"}>{user.role}</Badge>
                          </TableCell>
                          <TableCell>
                            <Badge
                              variant={
                                user.status === "Active"
                                  ? "default"
                                  : user.status === "Pending"
                                    ? "secondary"
                                    : "outline"
                              }
                            >
                              {user.status}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-muted-foreground">{user.lastActive}</TableCell>
                          <TableCell className="text-right">
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="sm">
                                  <MoreHorizontal className="h-4 w-4" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                <DropdownMenuItem>Edit Role</DropdownMenuItem>
                                <DropdownMenuItem>Resend Invite</DropdownMenuItem>
                                <DropdownMenuItem>Deactivate</DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="billing" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card className="hover:shadow-xl transition-all duration-300 border-primary/20">
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <CreditCard className="h-5 w-5 text-primary" />
                    <span>Current Plan</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="text-center p-6 rounded-lg bg-primary/5 border border-primary/20">
                    <h3 className="text-2xl font-bold text-primary mb-2">Enterprise Plan</h3>
                    <p className="text-3xl font-bold mb-2">
                      ₹25,000<span className="text-sm font-normal text-muted-foreground">/month</span>
                    </p>
                    <p className="text-sm text-muted-foreground">
                      Unlimited users • Advanced features • Priority support
                    </p>
                  </div>

                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Next billing date</span>
                      <span className="text-sm font-medium">March 15, 2024</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Users</span>
                      <span className="text-sm font-medium">24 / Unlimited</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Storage used</span>
                      <span className="text-sm font-medium">2.4 TB / Unlimited</span>
                    </div>
                  </div>

                  <div className="flex space-x-2">
                    <Button variant="outline" className="flex-1 bg-transparent">
                      <DollarSign className="h-4 w-4 mr-2" />
                      Change Plan
                    </Button>
                    <Button variant="outline" className="flex-1 bg-transparent">
                      <Calendar className="h-4 w-4 mr-2" />
                      Billing History
                    </Button>
                  </div>
                </CardContent>
              </Card>

              <Card className="hover:shadow-xl transition-all duration-300 border-primary/20">
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <FileDown className="h-5 w-5 text-primary" />
                    <span>Recent Invoices</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {[
                      { date: "Feb 15, 2024", amount: "₹25,000", status: "Paid", invoice: "INV-2024-002" },
                      { date: "Jan 15, 2024", amount: "₹25,000", status: "Paid", invoice: "INV-2024-001" },
                      { date: "Dec 15, 2023", amount: "₹25,000", status: "Paid", invoice: "INV-2023-012" },
                    ].map((invoice, index) => (
                      <div key={index} className="flex items-center justify-between p-3 rounded-lg bg-muted/30">
                        <div>
                          <p className="text-sm font-medium">{invoice.invoice}</p>
                          <p className="text-xs text-muted-foreground">{invoice.date}</p>
                        </div>
                        <div className="text-right">
                          <p className="text-sm font-medium">{invoice.amount}</p>
                          <Badge variant="default" className="text-xs">
                            {invoice.status}
                          </Badge>
                        </div>
                      </div>
                    ))}
                  </div>
                  <Button variant="outline" className="w-full mt-4 bg-transparent">
                    <FileDown className="h-4 w-4 mr-2" />
                    View All Invoices
                  </Button>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="integration" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card className="hover:shadow-xl transition-all duration-300 border-primary/20">
                <CardHeader className="flex flex-row items-center justify-between">
                  <CardTitle className="flex items-center space-x-2">
                    <Database className="h-5 w-5 text-primary" />
                    <span>External APIs</span>
                  </CardTitle>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => (isEditing("integration") ? saveSection("integration") : toggleEdit("integration"))}
                  >
                    {isEditing("integration") ? (
                      <>
                        <Save className="h-4 w-4 mr-2" />
                        Save
                      </>
                    ) : (
                      <>
                        <Edit className="h-4 w-4 mr-2" />
                        Edit
                      </>
                    )}
                  </Button>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <TooltipWrapper content="API key for accessing WHO International Classification of Diseases 11th Revision">
                      <Label>WHO ICD-11 API Key</Label>
                    </TooltipWrapper>
                    <div className="flex space-x-2 mt-1">
                      <Input
                        type="password"
                        placeholder="••••••••••••••••"
                        className="flex-1"
                        disabled={!isEditing("integration")}
                      />
                      {isEditing("integration") && (
                        <Button variant="outline" size="sm">
                          <Zap className="h-4 w-4 mr-1" />
                          Test
                        </Button>
                      )}
                    </div>
                    <StatusIndicator status="success" text="Connected successfully" />
                  </div>

                  <div>
                    <TooltipWrapper content="Fast Healthcare Interoperability Resources server endpoint for data exchange">
                      <Label>FHIR Server Endpoint</Label>
                    </TooltipWrapper>
                    <Input
                      placeholder="https://api.hospital.com/fhir/r4"
                      className="mt-1"
                      disabled={!isEditing("integration")}
                      defaultValue="https://api.hospital.com/fhir/r4"
                    />
                    <StatusIndicator status="warning" text="Connection pending" />
                  </div>

                  <div>
                    <Label>Insurance API URL</Label>
                    <Input
                      placeholder="https://insurance.gov.in/api/v2"
                      className="mt-1"
                      disabled={!isEditing("integration")}
                      defaultValue="https://insurance.gov.in/api/v2"
                    />
                    <StatusIndicator status="error" text="Authentication failed" />
                  </div>
                </CardContent>
              </Card>

              <Card className="hover:shadow-xl transition-all duration-300 border-primary/20">
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Link2 className="h-5 w-5 text-primary" />
                    <span>System Integration</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label>Lab System (HL7)</Label>
                    <div className="flex items-center justify-between p-3 rounded-lg bg-muted/50 mt-1">
                      <span className="text-sm">Enable HL7 integration</span>
                      <Switch disabled={!isEditing("integration")} />
                    </div>
                  </div>

                  <div>
                    <Label>Government Reporting</Label>
                    <div className="flex items-center justify-between p-3 rounded-lg bg-muted/50 mt-1">
                      <span className="text-sm">Auto-sync with MoHFW</span>
                      <Switch disabled={!isEditing("integration")} />
                    </div>
                  </div>

                  <div>
                    <TooltipWrapper content="URL endpoint for receiving real-time updates and notifications">
                      <Label>Webhook URL</Label>
                    </TooltipWrapper>
                    <Input
                      placeholder="https://your-webhook.com/api/updates"
                      className="mt-1"
                      disabled={!isEditing("integration")}
                      defaultValue="https://your-webhook.com/api/updates"
                    />
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="consent" className="space-y-6">
            <Card className="hover:shadow-xl transition-all duration-300 border-primary/20">
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle className="flex items-center space-x-2">
                  <FileText className="h-5 w-5 text-primary" />
                  <span>Consent Management</span>
                </CardTitle>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => (isEditing("consent") ? saveSection("consent") : toggleEdit("consent"))}
                >
                  {isEditing("consent") ? (
                    <>
                      <Save className="h-4 w-4 mr-2" />
                      Save
                    </>
                  ) : (
                    <>
                      <Edit className="h-4 w-4 mr-2" />
                      Edit
                    </>
                  )}
                </Button>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label>Default Consent Policy</Label>
                  <Input
                    placeholder="ISO 22600 compliant policy"
                    className="mt-1"
                    disabled={!isEditing("consent")}
                    defaultValue="ISO 22600 compliant policy"
                  />
                </div>

                <div className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                  <div>
                    <TooltipWrapper content="Allows emergency access to patient data with complete audit trail for compliance">
                      <Label>Emergency Override Access</Label>
                    </TooltipWrapper>
                    <p className="text-sm text-muted-foreground">Allow emergency access with full audit trail</p>
                  </div>
                  <Switch disabled={!isEditing("consent")} />
                </div>

                <div>
                  <Label>Consent Templates</Label>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-1">
                    <Button variant="outline" className="h-20 flex-col bg-transparent">
                      <Eye className="h-5 w-5 mb-2" />
                      <span>View Templates</span>
                    </Button>
                    <Button variant="outline" className="h-20 flex-col bg-transparent">
                      <Sparkles className="h-5 w-5 mb-2" />
                      <span>Create New</span>
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* ... existing code for other tabs ... */}
          <TabsContent value="organization" className="space-y-6">
            <Card className="hover:shadow-xl transition-all duration-300 border-primary/20">
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle className="flex items-center space-x-2">
                  <Building className="h-5 w-5 text-primary" />
                  <span>Organization Details</span>
                </CardTitle>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => (isEditing("organization") ? saveSection("organization") : toggleEdit("organization"))}
                >
                  {isEditing("organization") ? (
                    <>
                      <Save className="h-4 w-4 mr-2" />
                      Save
                    </>
                  ) : (
                    <>
                      <Edit className="h-4 w-4 mr-2" />
                      Edit
                    </>
                  )}
                </Button>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div>
                      <Label>Organization Name</Label>
                      <Input
                        placeholder="Apollo Hospitals"
                        className="mt-1"
                        disabled={!isEditing("organization")}
                        defaultValue="Apollo Hospitals"
                      />
                    </div>
                    <div>
                      <Label>Facility Code</Label>
                      <Input
                        placeholder="ABHA-FAC-001234"
                        className="mt-1"
                        disabled={!isEditing("organization")}
                        defaultValue="ABHA-FAC-001234"
                      />
                    </div>
                    <div>
                      <Label>Registration Number</Label>
                      <Input
                        placeholder="REG/2023/001234"
                        className="mt-1"
                        disabled={!isEditing("organization")}
                        defaultValue="REG/2023/001234"
                      />
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <Label>Organization Logo</Label>
                      {isEditing("organization") ? (
                        <div className="border-2 border-dashed border-border rounded-lg p-6 text-center hover:border-primary/50 transition-colors duration-300 cursor-pointer group">
                          <Upload className="h-6 w-6 mx-auto text-muted-foreground group-hover:text-primary transition-colors duration-300" />
                          <p className="text-sm text-muted-foreground mt-2">Upload logo (PNG, SVG)</p>
                        </div>
                      ) : (
                        <div className="border rounded-lg p-6 text-center bg-muted/30">
                          <Building className="h-6 w-6 mx-auto text-muted-foreground" />
                          <p className="text-sm text-muted-foreground mt-2">Current logo</p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                <Separator />

                <div>
                  <Label>Address</Label>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-1">
                    <Input
                      placeholder="Street Address"
                      disabled={!isEditing("organization")}
                      defaultValue="123 Medical Center Drive"
                    />
                    <Input placeholder="City" disabled={!isEditing("organization")} defaultValue="Mumbai" />
                    <Input placeholder="State" disabled={!isEditing("organization")} defaultValue="Maharashtra" />
                    <Input placeholder="PIN Code" disabled={!isEditing("organization")} defaultValue="400001" />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label>Contact Email</Label>
                    <Input
                      placeholder="contact@hospital.com"
                      className="mt-1"
                      disabled={!isEditing("organization")}
                      defaultValue="contact@apollo.com"
                    />
                  </div>
                  <div>
                    <Label>Contact Phone</Label>
                    <Input
                      placeholder="+91 11 2345 6789"
                      className="mt-1"
                      disabled={!isEditing("organization")}
                      defaultValue="+91 22 1234 5678"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="preferences" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card className="hover:shadow-xl transition-all duration-300 border-primary/20">
                <CardHeader className="flex flex-row items-center justify-between">
                  <CardTitle className="flex items-center space-x-2">
                    <Globe className="h-5 w-5 text-primary" />
                    <span>Localization</span>
                  </CardTitle>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() =>
                      isEditing("localization") ? saveSection("localization") : toggleEdit("localization")
                    }
                  >
                    {isEditing("localization") ? (
                      <>
                        <Save className="h-4 w-4 mr-2" />
                        Save
                      </>
                    ) : (
                      <>
                        <Edit className="h-4 w-4 mr-2" />
                        Edit
                      </>
                    )}
                  </Button>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label>Language</Label>
                    <Input
                      placeholder="English (India)"
                      className="mt-1"
                      disabled={!isEditing("localization")}
                      defaultValue="English (India)"
                    />
                  </div>
                  <div>
                    <Label>Timezone</Label>
                    <Input
                      placeholder="Asia/Kolkata (UTC +5:30)"
                      className="mt-1"
                      disabled={!isEditing("localization")}
                      defaultValue="Asia/Kolkata (UTC +5:30)"
                    />
                  </div>
                  <div>
                    <Label>Date Format</Label>
                    <Input
                      placeholder="DD/MM/YYYY"
                      className="mt-1"
                      disabled={!isEditing("localization")}
                      defaultValue="DD/MM/YYYY"
                    />
                  </div>
                  <div>
                    <Label>Currency</Label>
                    <Input
                      placeholder="INR (₹)"
                      className="mt-1"
                      disabled={!isEditing("localization")}
                      defaultValue="INR (₹)"
                    />
                  </div>
                </CardContent>
              </Card>

              <Card className="hover:shadow-xl transition-all duration-300 border-primary/20">
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Bell className="h-5 w-5 text-primary" />
                    <span>Notifications</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {Object.entries(notifications).map(([key, enabled]) => (
                    <div key={key} className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                      <div className="space-y-1">
                        <Label className="capitalize">{key} Notifications</Label>
                        <p className="text-sm text-muted-foreground">Receive {key} alerts for important updates</p>
                      </div>
                      <Switch
                        checked={enabled}
                        onCheckedChange={(checked) => setNotifications((prev) => ({ ...prev, [key]: checked }))}
                      />
                    </div>
                  ))}

                  <div className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                    <div className="space-y-1">
                      <Label>Dark Mode</Label>
                      <p className="text-sm text-muted-foreground">Switch to dark theme</p>
                    </div>
                    <Switch checked={darkMode} onCheckedChange={setDarkMode} />
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="terminology" className="space-y-6">
            <Card className="hover:shadow-xl transition-all duration-300 border-primary/20">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Database className="h-5 w-5 text-primary" />
                  <span>Terminology Management</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="text-center p-4 rounded-lg bg-primary/5 border border-primary/20">
                    <div className="text-2xl font-bold text-primary">15,847</div>
                    <div className="text-sm text-muted-foreground">ICD-11 Codes</div>
                  </div>
                  <div className="text-center p-4 rounded-lg bg-accent/5 border border-accent/20">
                    <div className="text-2xl font-bold text-accent">2,341</div>
                    <div className="text-sm text-muted-foreground">NAMASTE Codes</div>
                  </div>
                  <div className="text-center p-4 rounded-lg bg-green-50 border border-green-200">
                    <div className="text-2xl font-bold text-green-600">94.2%</div>
                    <div className="text-sm text-muted-foreground">Mapping Coverage</div>
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <Label>NAMASTE Dataset Upload</Label>
                    <div className="border-2 border-dashed border-border rounded-lg p-6 text-center hover:border-primary/50 transition-colors duration-300 cursor-pointer group mt-1">
                      <Upload className="h-6 w-6 mx-auto text-muted-foreground group-hover:text-primary transition-colors duration-300" />
                      <p className="text-sm text-muted-foreground mt-2">Upload CSV file (Max 50MB)</p>
                      <p className="text-xs text-muted-foreground">Supports: CSV, XLS, XLSX</p>
                    </div>
                  </div>

                  <div className="flex items-center justify-between p-4 rounded-lg bg-muted/50">
                    <div>
                      <Label>WHO ICD-11 Sync</Label>
                      <p className="text-sm text-muted-foreground">{syncStatus}</p>
                    </div>
                    <Button onClick={() => setSyncStatus("Syncing... Please wait")} className="group">
                      <Activity className="h-4 w-4 mr-2 group-hover:animate-pulse" />
                      Sync Now
                    </Button>
                  </div>

                  <div>
                    <Label>Auto-Mapping Settings</Label>
                    <div className="space-y-2 mt-1">
                      <div className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                        <span className="text-sm">Enable auto-mapping for new codes</span>
                        <Switch defaultChecked />
                      </div>
                      <div className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                        <span className="text-sm">Require manual review for low confidence</span>
                        <Switch defaultChecked />
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="security" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card className="hover:shadow-xl transition-all duration-300 border-primary/20">
                <CardHeader className="flex flex-row items-center justify-between">
                  <CardTitle className="flex items-center space-x-2">
                    <Lock className="h-5 w-5 text-primary" />
                    <span>Access Control</span>
                  </CardTitle>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => (isEditing("access") ? saveSection("access") : toggleEdit("access"))}
                  >
                    {isEditing("access") ? (
                      <>
                        <Save className="h-4 w-4 mr-2" />
                        Save
                      </>
                    ) : (
                      <>
                        <Edit className="h-4 w-4 mr-2" />
                        Edit
                      </>
                    )}
                  </Button>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label>OAuth 2.0 Configuration</Label>
                    <div className="space-y-2 mt-1">
                      <Input placeholder="Client ID" disabled={!isEditing("access")} defaultValue="ayusync-client-id" />
                      <Input type="password" placeholder="Client Secret" disabled={!isEditing("access")} />
                      <Input
                        placeholder="Redirect URI"
                        disabled={!isEditing("access")}
                        defaultValue="https://app.ayusync.com/callback"
                      />
                    </div>
                  </div>

                  <div>
                    <Label>Session Management</Label>
                    <Input
                      placeholder="Session timeout (minutes)"
                      className="mt-1"
                      disabled={!isEditing("access")}
                      defaultValue="30"
                    />
                  </div>

                  <div className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                    <div>
                      <TooltipWrapper content="Allows emergency access to critical systems during emergencies with full audit logging">
                        <Label>Emergency Override</Label>
                      </TooltipWrapper>
                      <p className="text-sm text-muted-foreground">Allow emergency access with audit</p>
                    </div>
                    <Switch disabled={!isEditing("access")} />
                  </div>
                </CardContent>
              </Card>

              <Card className="hover:shadow-xl transition-all duration-300 border-primary/20">
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Key className="h-5 w-5 text-primary" />
                    <span>API Security</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label>Rate Limiting</Label>
                    <Input
                      placeholder="1000 requests/hour"
                      className="mt-1"
                      disabled={!isEditing("access")}
                      defaultValue="1000 requests/hour"
                    />
                  </div>

                  <div>
                    <Label>IP Whitelist</Label>
                    <Input
                      placeholder="192.168.1.0/24, 10.0.0.0/8"
                      className="mt-1"
                      disabled={!isEditing("access")}
                      defaultValue="192.168.1.0/24"
                    />
                  </div>

                  <div>
                    <Label>API Keys</Label>
                    <div className="flex space-x-2 mt-1">
                      <Input
                        type="password"
                        placeholder="••••••••••••••••"
                        className="flex-1"
                        disabled={!isEditing("access")}
                      />
                      {isEditing("access") && (
                        <Button variant="outline" size="sm">
                          Regenerate
                        </Button>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="audit" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card className="hover:shadow-xl transition-all duration-300 border-primary/20">
                <CardHeader className="flex flex-row items-center justify-between">
                  <CardTitle className="flex items-center space-x-2">
                    <Archive className="h-5 w-5 text-primary" />
                    <span>Audit Configuration</span>
                  </CardTitle>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => (isEditing("audit") ? saveSection("audit") : toggleEdit("audit"))}
                  >
                    {isEditing("audit") ? (
                      <>
                        <Save className="h-4 w-4 mr-2" />
                        Save
                      </>
                    ) : (
                      <>
                        <Edit className="h-4 w-4 mr-2" />
                        Edit
                      </>
                    )}
                  </Button>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label>Log Retention Period</Label>
                    <div className="flex space-x-2 mt-1">
                      <Input
                        type="number"
                        placeholder="10"
                        className="w-20"
                        disabled={!isEditing("audit")}
                        defaultValue="10"
                      />
                      <span className="flex items-center text-sm text-muted-foreground">years</span>
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">Minimum 7 years for healthcare compliance</p>
                  </div>

                  <div>
                    <Label>Audit Alerts</Label>
                    <div className="space-y-2 mt-1">
                      <div className="flex items-center justify-between p-2 rounded bg-muted/30">
                        <span className="text-sm">Unauthorized access attempts</span>
                        <Switch defaultChecked disabled={!isEditing("audit")} />
                      </div>
                      <div className="flex items-center justify-between p-2 rounded bg-muted/30">
                        <span className="text-sm">Data export activities</span>
                        <Switch defaultChecked disabled={!isEditing("audit")} />
                      </div>
                      <div className="flex items-center justify-between p-2 rounded bg-muted/30">
                        <span className="text-sm">Emergency overrides</span>
                        <Switch defaultChecked disabled={!isEditing("audit")} />
                      </div>
                    </div>
                  </div>

                  <div className="flex space-x-2">
                    <Button variant="outline" className="flex-1 bg-transparent">
                      <Download className="h-4 w-4 mr-2" />
                      Export Logs
                    </Button>
                    <Button variant="outline" className="flex-1 bg-transparent">
                      <Bell className="h-4 w-4 mr-2" />
                      Configure Alerts
                    </Button>
                  </div>
                </CardContent>
              </Card>

              <Card className="hover:shadow-xl transition-all duration-300 border-primary/20">
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Activity className="h-5 w-5 text-primary" />
                    <span>Recent Activity</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {[
                      { action: "User login", user: "Dr. Sarah Chen", time: "2 minutes ago", status: "success" },
                      { action: "Data export", user: "Admin User", time: "1 hour ago", status: "success" },
                      { action: "Failed login", user: "Unknown", time: "3 hours ago", status: "warning" },
                      { action: "System backup", user: "System", time: "6 hours ago", status: "success" },
                    ].map((activity, index) => (
                      <div key={index} className="flex items-center justify-between p-3 rounded-lg bg-muted/30">
                        <div className="flex items-center space-x-3">
                          {activity.status === "success" && <CheckCircle className="h-4 w-4 text-green-500" />}
                          {activity.status === "warning" && <AlertTriangle className="h-4 w-4 text-yellow-500" />}
                          <div>
                            <p className="text-sm font-medium">{activity.action}</p>
                            <p className="text-xs text-muted-foreground">{activity.user}</p>
                          </div>
                        </div>
                        <span className="text-xs text-muted-foreground">{activity.time}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>

        {hasAnyEditing && (
          <div className="fixed bottom-6 right-6 z-50">
            <div className="flex space-x-2">
              <Button
                variant="outline"
                size="lg"
                onClick={() => setEditingSections({})}
                className="shadow-lg hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
              >
                <X className="h-4 w-4 mr-2" />
                Cancel
              </Button>
              <Button
                size="lg"
                onClick={() => {
                  // Save all editing sections
                  Object.keys(editingSections).forEach((section) => {
                    if (editingSections[section]) {
                      saveSection(section)
                    }
                  })
                }}
                className="shadow-lg hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group"
              >
                <CheckCircle className="h-4 w-4 mr-2 group-hover:scale-110 transition-transform duration-200" />
                Save All Changes
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
