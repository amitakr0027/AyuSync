"use client"
import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Search,
  BarChart3,
  Settings,
  User,
  LogOut,
  Plus,
  Download,
  Users,
  Heart,
  Stethoscope,
  Bell,
  Shield,
  Eye,
  Edit,
  Calendar,
  Home,
  CheckCircle2,
  Database,
  Code,
  Layers,
  FileCode,
  CloudUpload,
  Languages,
  Shuffle,
  TrendingUp,
  UserCheck,
  Lock,
  Zap,
  Menu,
  X,
  ChevronLeft,
  FlaskConical,
  FileText,
  ClipboardList,
  UserCog,
  History,
  AlertTriangle,
  FileSpreadsheet,
  Clock,
  Info,
  RefreshCw,
  Globe,
  TestTube,
  MoreHorizontal,
  CheckCircle,
} from "lucide-react"

const getSidebarMenuItems = (userRole: string) => {
  const baseItems = [{ icon: Home, label: "Dashboard", href: "/home", active: true }]

  if (userRole === "doctor" || userRole === "nurse") {
    return [
      ...baseItems,
      { icon: Users, label: "Patients", href: "/patients", badge: "12" },
      { icon: Calendar, label: "Appointments", href: "/appointments", badge: "3" },
      { icon: ClipboardList, label: "Problem List", href: "/problems" },
      { icon: FlaskConical, label: "Lab Results", href: "/lab", badge: "2" },
      { icon: CloudUpload, label: "Bundle Upload", href: "/bundle" },
      { icon: Code, label: "NAMASTE", href: "/namaste" },
      { icon: Languages, label: "WHO Terms", href: "/who-terms" },
      { icon: Layers, label: "ICD-11", href: "/icd11" },
      { icon: Database, label: "FHIR", href: "/fhir" },
      { icon: BarChart3, label: "Analytics", href: "/analytics" },
      { icon: Settings, label: "Settings", href: "/settings" },
    ]
  } else if (userRole === "hospital-admin") {
    return [
      ...baseItems,
      { icon: UserCog, label: "User Management", href: "/users" },
      { icon: History, label: "Audit Logs", href: "/audit" },
      { icon: FileText, label: "Version Control", href: "/versions" },
      { icon: BarChart3, label: "Analytics", href: "/analytics" },
      { icon: Settings, label: "Settings", href: "/settings" },
    ]
  } else if (userRole === "patient") {
    return [
      ...baseItems,
      { icon: FileText, label: "My Records", href: "/records" },
      { icon: Calendar, label: "Appointments", href: "/appointments" },
      { icon: History, label: "Consent Logs", href: "/consent" },
      { icon: Settings, label: "Settings", href: "/settings" },
    ]
  } else {
    return [
      ...baseItems,
      { icon: Users, label: "Patients", href: "/patients", badge: "12" },
      { icon: Calendar, label: "Appointments", href: "/appointments", badge: "3" },
      { icon: Code, label: "NAMASTE", href: "/namaste" },
      { icon: Languages, label: "WHO Terms", href: "/who-terms" },
      { icon: Layers, label: "ICD-11", href: "/icd11" },
      { icon: Database, label: "FHIR", href: "/fhir" },
      { icon: BarChart3, label: "Analytics", href: "/analytics" },
      { icon: Settings, label: "Settings", href: "/settings" },
    ]
  }
}

const searchResults = [
  {
    disorder: "Vata Imbalance with Digestive Issues",
    description: "Traditional Ayurvedic condition characterized by irregular digestion, bloating, and gas formation",
    system: "Ayurveda",
    confidence: 95,
    namaste: "VAT.DIG.001",
    whoTerms: "WHO-AYU-VAT-001",
    icd11tm: "TM2.A01.1Z",
    icd11bio: "K59.1",
    fhirCode: "http://namaste.gov.in/CodeSystem/ayurveda#VAT.DIG.001",
    mappingConfidence: "High",
    lastUpdated: "2024-01-15",
  },
]

const patientRecords = [
  {
    id: "P001",
    name: "Rajesh Kumar",
    age: 45,
    abhaId: "12-3456-7890-1234",
    lastEncounter: "2024-01-15",
    conditions: 3,
    status: "Active Treatment",
  },
  {
    id: "P002",
    name: "Priya Sharma",
    age: 32,
    abhaId: "12-3456-7890-5678",
    lastEncounter: "2024-01-14",
    conditions: 2,
    status: "Follow-up Required",
  },
]

const consentRequests = [
  {
    id: "CR001",
    patient: "Anita Patel",
    requestType: "Data Sharing",
    status: "Pending",
    requestedBy: "Dr. Mehta",
    timestamp: "2024-01-15T10:30:00Z",
  },
  {
    id: "CR002",
    patient: "Suresh Kumar",
    requestType: "Research Participation",
    status: "Approved",
    requestedBy: "Research Team",
    timestamp: "2024-01-14T15:45:00Z",
  },
]

const labResults = [
  {
    id: "LAB001",
    testName: "Complete Blood Count",
    loincCode: "58410-2",
    snomedCode: "26604007",
    value: "Normal",
    unit: "cells/μL",
    date: "2024-01-15",
    status: "Final",
    patient: "Rajesh Kumar",
  },
  {
    id: "LAB002",
    testName: "Hemoglobin A1c",
    loincCode: "4548-4",
    snomedCode: "43396009",
    value: "6.2",
    unit: "%",
    date: "2024-01-14",
    status: "Final",
    patient: "Priya Sharma",
  },
]

const auditLogs = [
  {
    id: "AUD001",
    action: "Diagnosis Added",
    performedBy: "Dr. Rajesh Sharma (ABHA: 12-3456-7890-1234)",
    timestamp: "2024-01-15T14:30:00Z",
    consent: "Yes",
    version: "v1.2",
    details: "Added Vata Imbalance diagnosis with dual coding",
  },
  {
    id: "AUD002",
    action: "Consent Given",
    performedBy: "Anita Patel (ABHA: 12-3456-7890-5678)",
    timestamp: "2024-01-15T10:15:00Z",
    consent: "Yes",
    version: "v1.1",
    details: "Patient consented to data sharing for research",
  },
  {
    id: "AUD003",
    action: "Bundle Uploaded",
    performedBy: "Dr. Mehta (ABHA: 12-3456-7890-9012)",
    timestamp: "2024-01-14T16:45:00Z",
    consent: "Yes",
    version: "v1.0",
    details: "FHIR R4 bundle uploaded with 15 resources",
  },
]

const sampleNotifications = [
  {
    id: "N001",
    title: "New Lab Results Available",
    message: "CBC results for Rajesh Kumar are ready for review",
    type: "lab",
    timestamp: "2024-01-15T14:30:00Z",
    read: false,
  },
  {
    id: "N002",
    title: "Consent Request Pending",
    message: "Anita Patel has requested data sharing consent",
    type: "consent",
    timestamp: "2024-01-15T10:15:00Z",
    read: false,
  },
  {
    id: "N003",
    title: "FHIR Bundle Uploaded",
    message: "New patient bundle successfully processed",
    type: "system",
    timestamp: "2024-01-14T16:45:00Z",
    read: true,
  },
  {
    id: "N004",
    title: "Appointment Reminder",
    message: "Upcoming appointment with Priya Sharma at 3:00 PM",
    type: "appointment",
    timestamp: "2024-01-15T08:00:00Z",
    read: false,
  },
]

export default function HomePage() {
  const router = useRouter()
  const [searchQuery, setSearchQuery] = useState("")
  const [searchResultsState, setSearchResults] = useState([])
  const [isSearching, setIsSearching] = useState(false)
  const [selectedView, setSelectedView] = useState("dashboard")
  const [notifications, setNotifications] = useState(3)
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [userRole, setUserRole] = useState("doctor")
  const [isAbhaAuth, setIsAbhaAuth] = useState(false)

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search)
    if (urlParams.get("auth") === "abha") {
      setIsAbhaAuth(true)
    }

    setUserRole("doctor")
  }, [])

  const sidebarMenuItems = getSidebarMenuItems(userRole)

  const handleSearch = async (query: string) => {
    if (!query.trim()) {
      setSearchResults([])
      return
    }

    setIsSearching(true)
    setTimeout(() => {
      const mockResults = [
        {
          disorder: "Vata Imbalance with Digestive Issues",
          description: "Traditional Ayurvedic condition with FHIR R4 compliance",
          system: "Ayurveda",
          confidence: 95,
          namaste: "VAT.DIG.001",
          whoTerms: "WHO-AYU-VAT-001",
          icd11tm: "TM2.A01.1Z",
          icd11bio: "K59.1",
          fhirCode: "http://namaste.gov.in/CodeSystem/ayurveda#VAT.DIG.001",
          mappingConfidence: "High",
        },
      ]
      setSearchResults(mockResults)
      setIsSearching(false)
    }, 800)
  }

 const handleSidebarItemClick = (href: string) => {
  if (!sidebarOpen) {
    setSidebarOpen(true)
  }
  router.push(href)   // 👉 ab page navigate karega
}

useEffect(() => {
  const saved = localStorage.getItem("sidebarOpen");
  if (saved !== null) {
    setSidebarOpen(saved === "true");
  }
}, []);

const toggleSidebar = () => {
  const newState = !sidebarOpen;
  setSidebarOpen(newState);
  localStorage.setItem("sidebarOpen", String(newState));
};



  const handleLogoClick = () => {
    if (!sidebarOpen) {
      setSidebarOpen(true)
    }
  }

  const handleSignOut = () => {
    // Clear any stored user data/tokens here if needed
    router.push("/")
  }

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case "lab":
        return <FlaskConical className="h-4 w-4 text-primary" />
      case "consent":
        return <UserCheck className="h-4 w-4 text-secondary" />
      case "appointment":
        return <Calendar className="h-4 w-4 text-accent" />
      default:
        return <Info className="h-4 w-4 text-muted-foreground" />
    }
  }
<Button onClick={toggleSidebar}>Toggle</Button>

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-secondary/5 font-sans">
      <aside
        className={`fixed left-0 top-0 z-40 h-screen bg-background/95 backdrop-blur-md border-r border-border shadow-lg transition-all duration-300 ${
          sidebarOpen ? "w-64" : "w-16"
        } ${mobileMenuOpen ? "translate-x-0" : "-translate-x-full"} lg:translate-x-0`}
      >
        <div className="flex h-full flex-col">
          <div className="flex h-16 items-center justify-between px-4 border-b border-border min-h-[4rem]">
            <div className="flex items-center space-x-3 cursor-pointer" onClick={handleLogoClick}>
              <div className="relative h-8 w-8 rounded-lg bg-gradient-to-br from-primary to-primary/80 flex items-center justify-center shadow-md">
                <div className="relative">
                  <Heart className="h-3 w-3 text-primary-foreground absolute -top-0.5 -left-0.5" />
                  <Stethoscope className="h-3 w-3 text-primary-foreground/80 absolute top-0.5 left-0.5" />
                </div>
              </div>
              {sidebarOpen && <span className="font-bold text-lg text-foreground">AyuSync</span>}
            </div>
            {sidebarOpen && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setSidebarOpen(!sidebarOpen)}
                className="hidden lg:flex h-8 w-8 hover:bg-primary/10 flex-shrink-0 p-0"
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
            )}
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setMobileMenuOpen(false)}
              className="lg:hidden h-8 w-8 p-0"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
          <nav className="flex-1 space-y-2 px-4 py-4">
            {sidebarMenuItems.map((item) => (
              <Button
                key={item.href}
                variant={item.active ? "default" : "ghost"}
                className={`w-full justify-start transition-all duration-200 ${
                  item.active
                    ? "bg-primary text-primary-foreground shadow-md"
                    : "hover:bg-primary/10 hover:text-primary"
                } ${!sidebarOpen ? "px-0 justify-center" : "px-0"}`}
                onClick={() => handleSidebarItemClick(item.href)}
              >
                <item.icon className={`h-5 w-5 ${sidebarOpen ? "mr-3" : ""}`} />
                {sidebarOpen && (
                  <>
                    <span className="flex-1 text-left">{item.label}</span>
                    {item.badge && (
                      <Badge variant="secondary" className="ml-auto text-xs h-5 px-1.5">
                        {item.badge}
                      </Badge>
                    )}
                  </>
                )}
              </Button>
            ))}
          </nav>
        </div>
      </aside>

      {mobileMenuOpen && (
        <div className="fixed inset-0 z-30 bg-black/50 lg:hidden" onClick={() => setMobileMenuOpen(false)} />
      )}

      <div className={`transition-all duration-300 ${sidebarOpen ? "lg:ml-64" : "lg:ml-16"}`}>
        <header className="sticky top-0 z-20 w-full border-b border-l border-border bg-background/95 backdrop-blur-md supports-[backdrop-filter]:bg-background/80 shadow-sm lg:border-l-0">
          <div className="flex h-16 items-center justify-between px-6 min-h-[4rem]">
            <div className="flex items-center space-x-3">
              <Button variant="ghost" size="sm" onClick={() => setMobileMenuOpen(true)} className="lg:hidden">
                <Menu className="h-5 w-5" />
              </Button>
              <div className="flex items-center space-x-3 lg:hidden">
                <div className="relative h-8 w-8 rounded-lg bg-gradient-to-br from-primary to-primary/80 flex items-center justify-center shadow-md">
                  <div className="relative">
                    <Heart className="h-3 w-3 text-primary-foreground absolute -top-0.5 -left-0.5" />
                    <Stethoscope className="h-3 w-3 text-primary-foreground/80 absolute top-0.5 left-0.5" />
                  </div>
                </div>
                <span className="font-bold text-lg text-foreground">AyuSync</span>
              </div>
            </div>
            <div className="flex flex-1 max-w-md mx-8">
              <div className="relative w-full">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search NAMASTE, ABHA ID, ICD-11 codes..."
                  value={searchQuery}
                  onChange={(e) => {
                    setSearchQuery(e.target.value)
                    handleSearch(e.target.value)
                  }}
                  className="pl-10 bg-muted/50 border-0 focus:bg-background focus:ring-2 focus:ring-primary/20 transition-all duration-200"
                />
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="sm" className="relative hover:bg-primary/10 transition-colors">
                    <Bell className="h-5 w-5" />
                    {notifications > 0 && (
                      <span className="absolute -top-1 -right-1 h-5 w-5 bg-primary text-primary-foreground text-xs rounded-full flex items-center justify-center animate-pulse">
                        {notifications}
                      </span>
                    )}
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-80" align="end" forceMount>
                  <div className="flex items-center justify-between p-3 bg-gradient-to-r from-primary/5 to-secondary/5">
                    <h3 className="font-semibold text-foreground">Notifications</h3>
                    <Badge variant="secondary" className="text-xs">
                      {sampleNotifications.filter((n) => !n.read).length} new
                    </Badge>
                  </div>
                  <DropdownMenuSeparator />
                  <div className="max-h-80 overflow-y-auto">
                    {sampleNotifications.map((notification) => (
                      <DropdownMenuItem key={notification.id} className="p-3 hover:bg-primary/5 cursor-pointer">
                        <div className="flex items-start gap-3 w-full">
                          <div className="mt-1">{getNotificationIcon(notification.type)}</div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between mb-1">
                              <h4 className="font-medium text-sm text-foreground truncate">{notification.title}</h4>
                              {!notification.read && (
                                <div className="h-2 w-2 bg-primary rounded-full flex-shrink-0 ml-2" />
                              )}
                            </div>
                            <p className="text-xs text-muted-foreground line-clamp-2 mb-1">{notification.message}</p>
                            <div className="flex items-center gap-1 text-xs text-muted-foreground">
                              <Clock className="h-3 w-3" />
                              {new Date(notification.timestamp).toLocaleString()}
                            </div>
                          </div>
                        </div>
                      </DropdownMenuItem>
                    ))}
                  </div>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem className="p-3 text-center hover:bg-primary/5">
                    <span className="text-sm text-primary font-medium">View All Notifications</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    className="relative h-10 w-10 rounded-full hover:ring-2 hover:ring-primary/20 transition-all"
                  >
                    <Avatar className="h-10 w-10 ring-2 ring-primary/20">
                      <AvatarImage src="/caring-doctor.png" alt="Dr. Sharma" />
                      <AvatarFallback className="bg-primary text-primary-foreground font-semibold">DS</AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-64" align="end" forceMount>
                  <div className="flex items-center justify-start gap-3 p-3 bg-gradient-to-r from-primary/5 to-secondary/5">
                    <Avatar className="h-12 w-12">
                      <AvatarImage src="/caring-doctor.png" alt="Dr. Sharma" />
                      <AvatarFallback className="bg-primary text-primary-foreground">DS</AvatarFallback>
                    </Avatar>
                    <div className="flex flex-col space-y-1">
                      <p className="font-semibold text-foreground">Dr. Rajesh Sharma</p>
                      <p className="text-sm text-muted-foreground">Ayurvedic Physician</p>
                      <p className="text-xs text-muted-foreground">
                        {isAbhaAuth ? (
                          <span className="text-blue-600 font-medium">ABHA ID: 12-3456-7890-1234</span>
                        ) : (
                          "ABHA ID: 12-3456-7890-1234"
                        )}
                      </p>
                    </div>
                  </div>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem className="hover:bg-primary/5">
                    <User className="mr-2 h-4 w-4" />
                    <span>Profile Settings</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem className="hover:bg-primary/5">
                    <Settings className="mr-2 h-4 w-4" />
                    <span>Preferences</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem className="hover:bg-primary/5">
                    <Shield className="mr-2 h-4 w-4" />
                    <span>Security</span>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    className="hover:bg-destructive/5 text-destructive cursor-pointer"
                    onClick={handleSignOut}
                  >
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>Sign Out</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </header>

        <main className="p-3 sm:p-4 md:p-6 space-y-4 sm:space-y-6 md:space-y-8 border-l border-border lg:border-l-0">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 md:gap-6">
            <Card className="bg-gradient-to-br from-primary/10 to-primary/5 border-primary/20 hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
              <CardContent className="p-4 sm:p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs sm:text-sm font-medium text-muted-foreground">Patients Managed</p>
                    <p className="text-2xl sm:text-3xl font-bold text-primary">247</p>
                    <p className="text-xs text-muted-foreground mt-1">+12 this week</p>
                  </div>
                  <div className="p-2 sm:p-3 bg-primary/10 rounded-full">
                    <Users className="h-5 w-5 sm:h-6 sm:w-6 text-primary" />
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card className="bg-gradient-to-br from-secondary/10 to-secondary/5 border-secondary/20 hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
              <CardContent className="p-4 sm:p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs sm:text-sm font-medium text-muted-foreground">Diagnoses Added Today</p>
                    <p className="text-2xl sm:text-3xl font-bold text-secondary">18</p>
                    <p className="text-xs text-muted-foreground mt-1">Dual-coded entries</p>
                  </div>
                  <div className="p-2 sm:p-3 bg-secondary/10 rounded-full">
                    <Code className="h-5 w-5 sm:h-6 sm:w-6 text-secondary" />
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card className="bg-gradient-to-br from-accent/10 to-accent/5 border-accent/20 hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
              <CardContent className="p-4 sm:p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs sm:text-sm font-medium text-muted-foreground">Dual-Coded Entries Synced</p>
                    <p className="text-2xl sm:text-3xl font-bold text-accent">156</p>
                    <p className="text-xs text-muted-foreground mt-1">NAMASTE + ICD-11</p>
                  </div>
                  <div className="p-2 sm:p-3 bg-accent/10 rounded-full">
                    <Shuffle className="h-5 w-5 sm:h-6 sm:w-6 text-accent" />
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card className="bg-gradient-to-br from-orange-100 to-orange-50 border-orange-200 hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
              <CardContent className="p-4 sm:p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs sm:text-sm font-medium text-muted-foreground">Pending Consent Requests</p>
                    <p className="text-2xl sm:text-3xl font-bold text-orange-600">3</p>
                    <p className="text-xs text-muted-foreground mt-1">Awaiting approval</p>
                  </div>
                  <div className="p-2 sm:p-3 bg-orange-200 rounded-full">
                    <UserCheck className="h-5 w-5 sm:h-6 sm:w-6 text-orange-600" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
          <div className="grid grid-cols-1 xl:grid-cols-3 gap-4 sm:gap-6 md:gap-8">
            <div className="xl:col-span-2 space-y-4 sm:space-y-6 md:space-y-8">
              <Card className="shadow-xl hover:shadow-2xl transition-all duration-500 border-primary/10">
                <CardHeader className="bg-gradient-to-r from-primary/5 to-secondary/5 rounded-t-lg p-4 sm:p-6">
                  <CardTitle className="flex items-center gap-2 sm:gap-3 text-lg sm:text-xl">
                    <div className="p-1.5 sm:p-2 bg-primary/10 rounded-lg">
                      <Shuffle className="h-4 w-4 sm:h-5 sm:w-5 text-primary" />
                    </div>
                    <span className="flex-1">Dual Coding Workspace</span>
                    <Badge variant="secondary" className="text-xs hidden sm:inline-flex">
                      Core Innovation
                    </Badge>
                  </CardTitle>
                  <CardDescription className="text-sm sm:text-base">
                    Side-by-side NAMASTE and ICD-11 coding with auto-mapping
                  </CardDescription>
                </CardHeader>
                <CardContent className="p-4 sm:p-6">
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
                    <div className="space-y-3 sm:space-y-4">
                      <div className="flex items-center gap-2 mb-3 sm:mb-4">
                        <Code className="h-4 w-4 sm:h-5 sm:w-5 text-primary" />
                        <h4 className="font-semibold text-primary text-sm sm:text-base">NAMASTE Terminology</h4>
                        <Badge variant="outline" className="text-xs hidden sm:inline-flex">
                          Ayurveda, Siddha, Unani
                        </Badge>
                      </div>
                      <Input placeholder="Search NAMASTE codes..." className="bg-primary/5 border-primary/20" />
                      <div className="space-y-2">
                        <div className="p-3 bg-primary/5 rounded-lg border border-primary/20 cursor-pointer hover:bg-primary/10 transition-colors">
                          <div className="font-medium text-sm text-foreground">Vata Dosha Imbalance</div>
                          <div className="text-xs text-foreground font-semibold">VAT.DIG.001</div>
                          <Badge variant="outline" className="text-xs mt-1">
                            Ayurveda
                          </Badge>
                        </div>
                      </div>
                    </div>
                    <div className="space-y-4">
                      <div className="flex items-center gap-2 mb-4">
                        <Layers className="h-5 w-5 text-secondary" />
                        <h4 className="font-semibold text-secondary">ICD-11 Mappings</h4>
                        <Badge variant="outline" className="text-xs">
                          TM2 + Biomedicine
                        </Badge>
                      </div>
                      <Input placeholder="Search ICD-11 codes..." className="bg-secondary/5 border-secondary/20" />
                      <div className="space-y-2">
                        <div className="p-3 bg-secondary/5 rounded-lg border border-secondary/20">
                          <div className="font-medium text-sm">Traditional Medicine Disorder</div>
                          <div className="text-xs text-muted-foreground">TM2.A01.1Z</div>
                          <Badge variant="outline" className="text-xs mt-1">
                            ICD-11 TM2
                          </Badge>
                        </div>
                        <div className="p-3 bg-accent/5 rounded-lg border border-accent/20">
                          <div className="font-medium text-sm">Functional Bowel Disorder</div>
                          <div className="text-xs text-muted-foreground">K59.1</div>
                          <Badge variant="outline" className="text-xs mt-1">
                            ICD-11 Bio
                          </Badge>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center justify-center mt-6">
                    <Button className="bg-primary text-primary-foreground hover:bg-primary/90 shadow-lg">
                      <Plus className="mr-2 h-4 w-4" />
                      Save Both Codes to Problem List
                    </Button>
                  </div>
                  <div className="mt-4 p-3 bg-green-50 rounded-lg border border-green-200">
                    <div className="flex items-center gap-2 text-green-700">
                      <CheckCircle2 className="h-4 w-4" />
                      <span className="font-medium text-sm">Mapping Confidence: High (95%)</span>
                    </div>
                    <div className="text-xs text-green-600 mt-1">Coding rules compliance verified</div>
                  </div>
                </CardContent>
              </Card>
              <Card className="shadow-xl hover:shadow-2xl transition-all duration-500 border-accent/10">
                <CardHeader className="p-4 sm:p-6">
                  <CardTitle className="flex items-center gap-2 sm:gap-3 text-lg sm:text-xl">
                    <div className="p-1.5 sm:p-2 bg-primary/10 rounded-lg">
                      <Database className="h-4 w-4 sm:h-5 sm:w-5 text-primary" />
                    </div>
                    Terminology Version & Sync Tracker
                    <Badge variant="secondary" className="text-xs hidden sm:inline-flex">
                      ISO 22600
                    </Badge>
                  </CardTitle>
                  <CardDescription className="text-sm sm:text-base">
                    Monitor and sync NAMASTE CSV and WHO ICD-11 terminology versions
                  </CardDescription>
                </CardHeader>
                <CardContent className="p-4 sm:p-6">
                  <div className="space-y-4 sm:space-y-6">
                    {/* Version Status Overview */}
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
                      <div className="p-4 bg-gradient-to-br from-primary/5 to-primary/10 rounded-lg border border-primary/20">
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center gap-2">
                            <FileText className="h-4 w-4 text-primary" />
                            <span className="font-semibold text-sm">NAMASTE CSV</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                            <CheckCircle className="h-3 w-3 text-green-600" />
                          </div>
                        </div>
                        <div className="text-xs text-muted-foreground">v4.2 • 15 Aug 2024</div>
                        <div className="text-xs text-muted-foreground">12,847 terms</div>
                      </div>

                      <div className="p-4 bg-gradient-to-br from-secondary/5 to-secondary/10 rounded-lg border border-secondary/20">
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center gap-2">
                            <Globe className="h-4 w-4 text-secondary" />
                            <span className="font-semibold text-sm">WHO ICD-11 TM2</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                            <AlertTriangle className="h-3 w-3 text-yellow-600" />
                          </div>
                        </div>
                        <div className="text-xs text-muted-foreground">2024-01 • 10 Sep 2025</div>
                        <div className="text-xs text-muted-foreground">3,247 codes</div>
                      </div>

                      <div className="p-4 bg-gradient-to-br from-accent/5 to-accent/10 rounded-lg border border-accent/20">
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center gap-2">
                            <Stethoscope className="h-4 w-4 text-accent" />
                            <span className="font-semibold text-sm">ICD-11 Bio</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                            <CheckCircle className="h-3 w-3 text-green-600" />
                          </div>
                        </div>
                        <div className="text-xs text-muted-foreground">2024-01 • 12 Sep 2025</div>
                        <div className="text-xs text-muted-foreground">55,000+ categories</div>
                      </div>
                    </div>

                    {/* Sync Actions */}
                    <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
                      <Button
                        className="flex-1 bg-gradient-to-r from-accent to-secondary hover:from-accent/90 hover:to-secondary/90 text-foreground hover:text-foreground"
                        onClick={() => {
                          console.log("[v0] Starting terminology sync...")
                        }}
                      >
                        <RefreshCw className="mr-2 h-4 w-4" />
                        Sync All Terminologies
                      </Button>
                      <div className="flex gap-2">
                        <Button variant="outline" size="sm" className="bg-transparent">
                          <Download className="mr-2 h-4 w-4" />
                          <span className="hidden sm:inline">Export</span>
                        </Button>
                        <Button variant="outline" size="sm" className="bg-transparent">
                          <Settings className="mr-2 h-4 w-4" />
                          <span className="hidden sm:inline">Settings</span>
                        </Button>
                      </div>
                    </div>

                    {/* Quick Stats */}
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
                      <div className="text-center p-3 bg-muted/30 rounded-lg">
                        <div className="text-lg sm:text-xl font-bold text-primary">98.7%</div>
                        <div className="text-xs text-muted-foreground">Accuracy</div>
                      </div>
                      <div className="text-center p-3 bg-muted/30 rounded-lg">
                        <div className="text-lg sm:text-xl font-bold text-green-600">2h</div>
                        <div className="text-xs text-muted-foreground">Last Sync</div>
                      </div>
                      <div className="text-center p-3 bg-muted/30 rounded-lg">
                        <div className="text-lg sm:text-xl font-bold text-blue-600">Daily</div>
                        <div className="text-xs text-muted-foreground">Auto-sync</div>
                      </div>
                      <div className="text-center p-3 bg-muted/30 rounded-lg">
                        <div className="text-lg sm:text-xl font-bold text-orange-600">23</div>
                        <div className="text-xs text-muted-foreground">Pending</div>
                      </div>
                    </div>

                    {/* Status Alert */}
                    <div className="p-3 sm:p-4 bg-yellow-50 rounded-lg border border-yellow-200">
                      <div className="flex items-start gap-2 sm:gap-3">
                        <AlertTriangle className="h-4 w-4 sm:h-5 sm:w-5 text-yellow-600 mt-0.5 flex-shrink-0" />
                        <div className="flex-1">
                          <h6 className="font-semibold text-yellow-800 text-sm">Update Available</h6>
                          <p className="text-xs sm:text-sm text-yellow-700 mt-1">
                            WHO ICD-11 TM2 has new updates available. Consider syncing to get the latest terminology
                            mappings.
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
              {(userRole === "doctor" || userRole === "nurse") && (
                <Card className="shadow-xl hover:shadow-2xl transition-all duration-500 border-primary/10">
                  <CardHeader className="p-4 sm:p-6">
                    <CardTitle className="flex items-center gap-2 sm:gap-3 text-lg sm:text-xl">
                      <div className="p-1.5 sm:p-2 bg-primary/10 rounded-lg">
                        <TestTube className="h-4 w-4 sm:h-5 sm:w-5 text-primary" />
                      </div>
                      Lab Results & Observations
                      <Badge variant="secondary" className="text-xs hidden sm:inline-flex">
                        SNOMED CT + LOINC
                      </Badge>
                    </CardTitle>
                    <CardDescription className="text-sm sm:text-base">
                      Standardized lab data with international coding systems
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="p-4 sm:p-6">
                    <div className="space-y-3 sm:space-y-4">
                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 mb-4 sm:mb-6">
                        <Input placeholder="Test Name (LOINC)" className="bg-primary/5 border-primary/20 text-sm" />
                        <Input placeholder="Value + Unit" className="bg-primary/5 border-primary/20 text-sm" />
                        <Input type="date" className="bg-primary/5 border-primary/20 text-sm" />
                      </div>

                      <div className="space-y-2 sm:space-y-3">
                        {labResults.map((lab) => (
                          <Card
                            key={lab.id}
                            className="p-3 sm:p-4 border-l-4 border-l-primary hover:shadow-md transition-all"
                          >
                            <div className="flex items-center justify-between">
                              <div className="flex-1 min-w-0">
                                <div className="flex items-center gap-2 sm:gap-3 mb-2">
                                  <h4 className="font-semibold text-foreground text-sm sm:text-base truncate">
                                    {lab.testName}
                                  </h4>
                                  <Badge variant="outline" className="text-xs bg-primary/5 flex-shrink-0">
                                    {lab.status}
                                  </Badge>
                                </div>
                                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-1 sm:gap-2 text-xs sm:text-sm text-muted-foreground">
                                  <div className="truncate">
                                    <span className="font-medium">LOINC:</span> {lab.loincCode}
                                  </div>
                                  <div className="truncate">
                                    <span className="font-medium">SNOMED:</span> {lab.snomedCode}
                                  </div>
                                  <div className="truncate">
                                    <span className="font-medium">Value:</span> {lab.value} {lab.unit}
                                  </div>
                                  <div className="truncate">
                                    <span className="font-medium">Date:</span> {lab.date}
                                  </div>
                                </div>
                              </div>
                              <Button variant="ghost" size="sm" className="ml-2 flex-shrink-0">
                                <MoreHorizontal className="h-4 w-4" />
                              </Button>
                            </div>
                          </Card>
                        ))}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}
              <Card className="shadow-xl hover:shadow-2xl transition-all duration-500 border-secondary/10">
                <CardHeader className="bg-gradient-to-r from-secondary/5 to-accent/5 rounded-t-lg">
                  <CardTitle className="flex items-center gap-3 text-xl">
                    <div className="p-2 bg-secondary/10 rounded-lg">
                      <Users className="h-5 w-5 text-secondary" />
                    </div>
                    Patient Records Panel
                    <div className="ml-auto flex gap-2">
                      <Button variant="outline" size="sm">
                        <Eye className="h-4 w-4 mr-1" />
                        List View
                      </Button>
                      <Button variant="ghost" size="sm">
                        Grid View
                      </Button>
                    </div>
                  </CardTitle>
                  <CardDescription className="text-base">
                    Manage patient demographics, history, and FHIR-compliant records
                  </CardDescription>
                </CardHeader>
                <CardContent className="p-6">
                  <div className="space-y-4">
                    {patientRecords.map((patient) => (
                      <Card
                        key={patient.id}
                        className="p-3 sm:p-4 hover:shadow-md transition-all duration-200 border-l-4 border-l-secondary/40"
                      >
                        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                          <div className="flex items-center gap-3 min-w-0 flex-1">
                            <Avatar className="h-10 w-10 sm:h-12 sm:w-12 flex-shrink-0">
                              <AvatarFallback className="bg-secondary/10 text-secondary font-semibold text-sm">
                                {patient.name
                                  .split(" ")
                                  .map((n) => n[0])
                                  .join("")}
                              </AvatarFallback>
                            </Avatar>
                            <div className="min-w-0 flex-1">
                              <h4 className="font-semibold text-foreground text-sm sm:text-base truncate">
                                {patient.name}
                              </h4>
                              <p className="text-xs sm:text-sm text-muted-foreground break-words">
                                Age: {patient.age} • ABHA: {patient.abhaId}
                              </p>
                              <div className="flex flex-wrap items-center gap-1 sm:gap-2 mt-1">
                                <Badge variant="outline" className="text-xs">
                                  {patient.status}
                                </Badge>
                                <Badge variant="outline" className="text-xs">
                                  {patient.conditions} conditions
                                </Badge>
                                <span className="text-xs text-muted-foreground truncate">
                                  Last: {patient.lastEncounter}
                                </span>
                              </div>
                            </div>
                          </div>
                          <div className="flex gap-2 flex-shrink-0 self-start sm:self-center">
                            <Button size="sm" variant="outline">
                              <Eye className="h-4 w-4" />
                            </Button>
                            <Button size="sm" className="bg-secondary hover:bg-secondary/90">
                              <Edit className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      </Card>
                    ))}
                  </div>
                  <Button className="w-full mt-4 bg-gradient-to-r from-secondary/10 to-accent/10 hover:from-secondary/20 hover:to-accent/20 border border-secondary/20 text-foreground hover:text-foreground">
                    <Plus className="mr-2 h-4 w-4" />
                    Add New Patient
                  </Button>
                </CardContent>
              </Card>
            </div>
            <div className="xl:col-span-1 space-y-6">
              <Card className="shadow-lg hover:shadow-xl transition-all duration-300 border-primary/10">
                <CardHeader className="bg-gradient-to-r from-accent/5 to-primary/5 rounded-t-lg">
                  <CardTitle className="flex items-center gap-2 text-lg">
                    <Database className="h-5 w-5 text-accent" />
                    FHIR Bundle Management
                  </CardTitle>
                  <CardDescription>Upload/Export FHIR R4 bundles</CardDescription>
                </CardHeader>
                <CardContent className="p-4 space-y-4">
                  <div className="grid grid-cols-2 gap-3">
                    <Button
                      variant="outline"
                      className="flex-col h-auto py-4 bg-gradient-to-b from-primary/5 to-primary/10 hover:from-primary/10 hover:to-primary/20 border-primary/20"
                    >
                      <CloudUpload className="h-6 w-6 mb-2 text-primary" />
                      <span className="text-xs font-medium">Upload Bundle</span>
                    </Button>
                    <Button
                      variant="outline"
                      className="flex-col h-auto py-4 bg-gradient-to-b from-secondary/5 to-secondary/10 hover:from-secondary/10 hover:to-secondary/20 border-secondary/20"
                    >
                      <Download className="h-6 w-6 mb-2 text-secondary" />
                      <span className="text-xs font-medium">Export Bundle</span>
                    </Button>
                  </div>
                  <div className="p-3 bg-blue-50 rounded-lg border border-blue-200">
                    <div className="text-xs text-blue-600 mb-1">Recent Export:</div>
                    <div className="text-sm font-medium text-blue-800">Patient_Bundle_001.json</div>
                    <div className="text-xs text-blue-600">FHIR R4 • 2.3MB • 15 resources</div>
                  </div>
                  <Button variant="outline" className="w-full bg-transparent border-accent/20 hover:bg-accent/5">
                    <FileCode className="mr-2 h-4 w-4" />
                    Validate Bundle
                  </Button>
                </CardContent>
              </Card>
              <Card className="shadow-lg hover:shadow-xl transition-all duration-300 border-primary/10">
                <CardHeader className="bg-gradient-to-r from-primary/5 to-secondary/5 rounded-t-lg">
                  <CardTitle className="flex items-center gap-2 text-lg">
                    <Lock className="h-5 w-5 text-primary" />
                    Consent & Access Control
                  </CardTitle>
                  <CardDescription>Manage patient consent requests</CardDescription>
                </CardHeader>
                <CardContent className="p-4 space-y-4">
                  <div className="space-y-3">
                    {consentRequests.slice(0, 2).map((request) => (
                      <div key={request.id} className="p-3 bg-primary/5 rounded-lg border border-primary/20">
                        <div className="flex items-center justify-between mb-2">
                          <span className="font-medium text-sm text-foreground">{request.patient}</span>
                          <Badge variant={request.status === "Pending" ? "destructive" : "default"} className="text-xs">
                            {request.status}
                          </Badge>
                        </div>
                        <div className="text-xs text-muted-foreground">{request.requestType}</div>
                        <div className="text-xs text-muted-foreground mt-1">By: {request.requestedBy}</div>
                      </div>
                    ))}
                  </div>
                  <Button variant="outline" className="w-full bg-transparent border-primary/20 hover:bg-primary/5">
                    <UserCheck className="mr-2 h-4 w-4" />
                    View All Requests
                  </Button>
                </CardContent>
              </Card>
              <Card className="shadow-lg hover:shadow-xl transition-all duration-300 border-primary/10">
                <CardHeader className="bg-gradient-to-r from-secondary/5 to-accent/5 rounded-t-lg">
                  <CardTitle className="flex items-center gap-2 text-lg">
                    <BarChart3 className="h-5 w-5 text-secondary" />
                    Analytics & Insights
                  </CardTitle>
                  <CardDescription>Ministry reporting & trends</CardDescription>
                </CardHeader>
                <CardContent className="p-4 space-y-4">
                  <div className="grid grid-cols-2 gap-3">
                    <div className="p-3 bg-secondary/10 rounded-lg text-center">
                      <div className="text-lg font-bold text-secondary">45%</div>
                      <div className="text-xs text-secondary">NAMASTE Usage</div>
                    </div>
                    <div className="p-3 bg-accent/10 rounded-lg text-center">
                      <div className="text-lg font-bold text-accent">89%</div>
                      <div className="text-xs text-accent">ICD-11 Mapping</div>
                    </div>
                  </div>
                  <div className="p-3 bg-primary/5 rounded-lg border border-primary/20">
                    <div className="flex items-center gap-2 text-primary mb-1">
                      <TrendingUp className="h-4 w-4" />
                      <span className="font-medium text-sm">Most Common This Month</span>
                    </div>
                    <div className="text-xs text-muted-foreground">Vata Disorders (23%), Pitta Conditions (18%)</div>
                  </div>
                  <Button variant="outline" className="w-full bg-transparent border-secondary/20 hover:bg-secondary/5">
                    <Download className="mr-2 h-4 w-4" />
                    <span className="text-xs">Export Analytics</span>
                  </Button>
                </CardContent>
              </Card>
              <Card className="shadow-lg hover:shadow-xl transition-all duration-300 border-primary/10">
                <CardHeader className="bg-gradient-to-r from-accent/5 to-primary/5 rounded-t-lg">
                  <CardTitle className="flex items-center gap-2 text-lg">
                    <Zap className="h-5 w-5 text-accent" />
                    Quick Actions
                  </CardTitle>
                  <CardDescription>Frequently used functions</CardDescription>
                </CardHeader>
                <CardContent className="p-4">
                  <div className="grid grid-cols-2 gap-3">
                    <Button
                      variant="outline"
                      className="flex-col h-auto py-3 bg-gradient-to-b from-primary/5 to-primary/10 hover:from-primary/10 hover:to-primary/20 border-primary/20"
                    >
                      <Plus className="h-5 w-5 mb-1 text-primary" />
                      <span className="text-xs">Add Patient</span>
                    </Button>
                    <Button
                      variant="outline"
                      className="flex-col h-auto py-3 bg-gradient-to-b from-secondary/5 to-secondary/10 hover:from-secondary/10 hover:to-secondary/20 border-secondary/20"
                    >
                      <Code className="h-5 w-5 mb-1 text-secondary" />
                      <span className="text-xs">Code Lookup</span>
                    </Button>
                    <Button
                      variant="outline"
                      className="flex-col h-auto py-3 bg-gradient-to-b from-accent/5 to-accent/10 hover:from-accent/10 hover:to-accent/20 border-accent/20"
                    >
                      <Plus className="h-5 w-5 mb-1 text-accent" />
                      <span className="text-xs">Add Diagnosis</span>
                    </Button>
                    <Button
                      variant="outline"
                      className="flex-col h-auto py-3 bg-gradient-to-b from-primary/5 to-secondary/5 hover:from-primary/10 hover:to-secondary/10 border-primary/20"
                    >
                      <Download className="h-5 w-5 mb-1 text-primary" />
                      <span className="text-xs">Export Data</span>
                    </Button>
                  </div>
                </CardContent>
              </Card>
              <Card className="shadow-lg hover:shadow-xl transition-all duration-300 border-primary/10">
                <CardHeader className="bg-gradient-to-r from-secondary/5 to-accent/5 rounded-t-lg">
                  <CardTitle className="flex items-center gap-2 text-lg">
                    <History className="h-5 w-5 text-secondary" />
                    Audit & Consent Logs
                  </CardTitle>
                  <CardDescription>ISO 22600 compliant tracking</CardDescription>
                </CardHeader>
                <CardContent className="p-3 sm:p-4 space-y-4">
                  <div className="space-y-3 max-h-64 overflow-y-auto">
                    {auditLogs.slice(0, 3).map((log) => (
                      <div key={log.id} className="p-3 bg-secondary/5 rounded-lg border border-secondary/20">
                        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mb-2">
                          <span className="font-medium text-sm text-foreground break-words pr-2">{log.action}</span>
                          <div className="flex flex-wrap items-center gap-1 sm:gap-2 flex-shrink-0">
                            <Badge
                              variant={log.consent === "Yes" ? "default" : "destructive"}
                              className={`text-xs ${log.consent === "Yes" ? "bg-green-100 text-green-800 hover:bg-green-200" : "bg-red-100 text-red-800 hover:bg-red-200"}`}
                            >
                              {log.consent === "Yes" ? (
                                <CheckCircle2 className="h-3 w-3 mr-1 text-green-800" />
                              ) : (
                                <AlertTriangle className="h-3 w-3 mr-1 text-red-800" />
                              )}
                              <span className={log.consent === "Yes" ? "text-green-800" : "text-red-800"}>
                                {log.consent}
                              </span>
                            </Badge>
                            <Badge variant="outline" className="text-xs">
                              {log.version}
                            </Badge>
                          </div>
                        </div>
                        <div className="text-xs text-muted-foreground mb-1 break-words">{log.performedBy}</div>
                        <div className="text-xs text-muted-foreground break-words">
                          {new Date(log.timestamp).toLocaleString()}
                        </div>
                        <div className="text-xs text-muted-foreground mt-1 italic break-words">{log.details}</div>
                      </div>
                    ))}
                  </div>
                  <div className="flex flex-col sm:flex-row gap-2">
                    <Button
                      variant="outline"
                      className="flex-1 bg-transparent border-secondary/20 hover:bg-secondary/5 text-xs sm:text-sm"
                    >
                      <History className="mr-2 h-4 w-4" />
                      <span className="truncate">View All</span>
                    </Button>
                    <Button
                      variant="outline"
                      className="flex-1 bg-transparent border-secondary/20 hover:bg-secondary/5 text-xs sm:text-sm"
                    >
                      <FileSpreadsheet className="mr-2 h-4 w-4" />
                      <span className="truncate">Export CSV</span>
                    </Button>
                  </div>
                </CardContent>
              </Card>
              {/* Terminology Version & Sync Tracker */}
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}
