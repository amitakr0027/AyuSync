"use client"

import type React from "react"
import { useState, useRef } from "react"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Separator } from "@/components/ui/separator"
import {
  User,
  Camera,
  Shield,
  Stethoscope,
  Phone,
  Mail,
  MapPin,
  Calendar,
  Clock,
  Monitor,
  CheckCircle,
  AlertCircle,
  Plus,
  X,
  Save,
  Upload,
  Award,
  Building2,
  UserCheck,
  Activity,
  ChevronRight,
  Star,
  Briefcase,
  Edit,
} from "lucide-react"

export default function ProfileSettings() {
  const [isLoading, setIsLoading] = useState(false)
  const [isEditing, setIsEditing] = useState(false)
  const [profileImage, setProfileImage] = useState("/professional-doctor-avatar.png")
  const [expertiseTags, setExpertiseTags] = useState(["Cardiology", "Internal Medicine"])
  const [newTag, setNewTag] = useState("")
  const [activeSection, setActiveSection] = useState("overview")
  const [originalFormData, setOriginalFormData] = useState({
    fullName: "Dr. Sarah Johnson",
    gender: "female",
    dob: "1985-03-15",
    email: "sarah.johnson@cityhospital.com",
    phone: "+91 9876543210",
    address: "123 Medical Center Drive, Mumbai, Maharashtra 400001",
    specialization: "biomedicine",
    license: "MCI789456",
    hospital: "City General Hospital",
    experience: "6-10",
    abha: "ABHA-1234567890",
    npi: "NPI987654321",
    employeeId: "EMP789456",
    emergencyName: "Michael Johnson",
    relationship: "spouse",
    emergencyPhone: "+91 9876543211",
  })
  const [formData, setFormData] = useState({ ...originalFormData })
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      // Validate file size (5MB limit)
      if (file.size > 5 * 1024 * 1024) {
        alert("File size must be less than 5MB")
        return
      }

      // Validate file type
      if (!file.type.startsWith("image/")) {
        alert("Please select a valid image file")
        return
      }

      const reader = new FileReader()
      reader.onload = (e) => {
        setProfileImage(e.target?.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  const addExpertiseTag = () => {
    if (newTag.trim() && !expertiseTags.includes(newTag.trim())) {
      setExpertiseTags([...expertiseTags, newTag.trim()])
      setNewTag("")
    }
  }

  const removeExpertiseTag = (tagToRemove: string) => {
    setExpertiseTags(expertiseTags.filter((tag) => tag !== tagToRemove))
  }

  const handleSave = async () => {
    setIsLoading(true)
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 2000))

      // Update original data to reflect saved changes
      setOriginalFormData({ ...formData })
      setIsEditing(false)

      // Show success feedback (you can replace with toast notification)
      console.log("[v0] Profile saved successfully")
    } catch (error) {
      console.error("[v0] Error saving profile:", error)
      alert("Error saving profile. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  const handleCancel = () => {
    setFormData({ ...originalFormData })
    setIsEditing(false)
    // Reset profile image if it was changed
    setProfileImage("/professional-doctor-avatar.png")
    setNewTag("")
  }

  const handleEdit = () => {
    setIsEditing(true)
  }

  const handleInputChange = (field: keyof typeof formData, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }))
  }

  const sections = [
    { id: "overview", label: "Overview", icon: User },
    { id: "personal", label: "Personal Info", icon: UserCheck },
    { id: "professional", label: "Professional", icon: Stethoscope },
    { id: "credentials", label: "Credentials", icon: Award },
    { id: "emergency", label: "Emergency", icon: AlertCircle },
    { id: "system", label: "System", icon: Monitor },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-muted/20 to-primary/5">
      <div className="relative overflow-hidden bg-gradient-to-r from-primary via-primary/90 to-secondary">
        <div className="absolute inset-0 bg-[url('/placeholder.svg?key=3ytw4')] opacity-10" />
        <div className="relative px-4 py-12 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-7xl">
            <div className="text-center">
              <div className="inline-flex items-center rounded-full bg-white/20 px-4 py-2 text-sm font-medium text-white backdrop-blur-sm">
                <Shield className="mr-2 h-4 w-4" />
                Healthcare Professional Portal
              </div>
              <h1 className="mt-4 text-4xl font-bold tracking-tight text-white sm:text-5xl lg:text-6xl">
                Profile Management
              </h1>
              <p className="mx-auto mt-6 max-w-2xl text-lg leading-8 text-white/90">
                Maintain your professional credentials and ensure compliance with healthcare standards
              </p>

              <div className="mt-10 grid grid-cols-1 gap-4 sm:grid-cols-3 lg:gap-8">
                <div className="rounded-lg bg-black/30 p-6 backdrop-blur-sm border border-white/20">
                  <div className="flex items-center justify-center w-12 h-12 bg-white/20 rounded-lg mx-auto mb-4">
                    <CheckCircle className="w-6 h-6 text-white" />
                  </div>
                  <div className="text-2xl font-bold text-white">92%</div>
                  <div className="text-sm text-white/90">Profile Complete</div>
                </div>
                <div className="rounded-lg bg-black/30 p-6 backdrop-blur-sm border border-white/20">
                  <div className="flex items-center justify-center w-12 h-12 bg-white/20 rounded-lg mx-auto mb-4">
                    <Star className="w-6 h-6 text-white" />
                  </div>
                  <div className="text-2xl font-bold text-white">4.9</div>
                  <div className="text-sm text-white/90">Patient Rating</div>
                </div>
                <div className="rounded-lg bg-black/30 p-6 backdrop-blur-sm border border-white/20">
                  <div className="flex items-center justify-center w-12 h-12 bg-white/20 rounded-lg mx-auto mb-4">
                    <Activity className="w-6 h-6 text-white" />
                  </div>
                  <div className="text-2xl font-bold text-white">8+</div>
                  <div className="text-sm text-white/90">Years Experience</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-4">
          <div className="lg:col-span-1">
            <div className="sticky top-8">
              <Card className="border-0 shadow-lg">
                <CardHeader className="pb-4">
                  <div className="flex items-center space-x-4">
                    <Avatar className="h-16 w-16 border-4 border-primary/20">
                      <AvatarImage src={profileImage || "/placeholder.svg"} alt="Profile" />
                      <AvatarFallback className="bg-primary/10 text-primary font-semibold text-lg">SJ</AvatarFallback>
                    </Avatar>
                    <div>
                      <h3 className="font-semibold text-lg">Dr. Sarah Johnson</h3>
                      <p className="text-sm text-muted-foreground">Internal Medicine</p>
                      <div className="flex items-center mt-1">
                        <div className="w-2 h-2 bg-green-500 rounded-full mr-2" />
                        <span className="text-xs text-green-600 font-medium">Online</span>
                      </div>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="pt-0">
                  <nav className="space-y-1">
                    {sections.map((section) => {
                      const Icon = section.icon
                      return (
                        <button
                          key={section.id}
                          onClick={() => setActiveSection(section.id)}
                          className={`w-full flex items-center justify-between px-3 py-2 text-sm font-medium rounded-lg transition-all duration-200 ${
                            activeSection === section.id
                              ? "bg-primary text-primary-foreground shadow-sm"
                              : "text-muted-foreground hover:bg-muted hover:text-foreground"
                          }`}
                        >
                          <div className="flex items-center">
                            <Icon className="mr-3 h-4 w-4" />
                            {section.label}
                          </div>
                          <ChevronRight className="h-4 w-4" />
                        </button>
                      )
                    })}
                  </nav>
                </CardContent>
              </Card>
            </div>
          </div>

          <div className="lg:col-span-3">
            <div className="space-y-6">
              {activeSection === "overview" && (
                <Card className="border-0 shadow-lg">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-xl">
                      <User className="h-5 w-5 text-primary" />
                      Profile Overview
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                      <div className="bg-gradient-to-br from-primary/10 to-primary/5 p-6 rounded-xl border border-primary/20">
                        <div className="flex items-center justify-between mb-4">
                          <Stethoscope className="h-8 w-8 text-primary" />
                          <Badge variant="secondary" className="bg-primary text-primary-foreground">
                            Active
                          </Badge>
                        </div>
                        <h3 className="font-semibold text-lg mb-2">Medical License</h3>
                        <p className="text-sm text-muted-foreground mb-2">MCI789456</p>
                        <div className="flex items-center text-xs text-green-600">
                          <CheckCircle className="w-3 h-3 mr-1" />
                          Verified & Active
                        </div>
                      </div>

                      <div className="bg-gradient-to-br from-secondary/10 to-secondary/5 p-6 rounded-xl border border-secondary/20">
                        <div className="flex items-center justify-between mb-4">
                          <Building2 className="h-8 w-8 text-secondary" />
                          <Badge variant="outline">Primary</Badge>
                        </div>
                        <h3 className="font-semibold text-lg mb-2">Hospital</h3>
                        <p className="text-sm text-muted-foreground mb-2">City General Hospital</p>
                        <div className="flex items-center text-xs text-blue-600">
                          <Activity className="w-3 h-3 mr-1" />
                          8+ Years
                        </div>
                      </div>

                      <div className="bg-gradient-to-br from-green-100 to-green-50 p-6 rounded-xl border border-green-200">
                        <div className="flex items-center justify-between mb-4">
                          <Award className="h-8 w-8 text-green-600" />
                          <Badge variant="secondary" className="bg-green-100 text-green-700">
                            Verified
                          </Badge>
                        </div>
                        <h3 className="font-semibold text-lg mb-2">ABHA ID</h3>
                        <p className="text-sm text-muted-foreground mb-2">ABHA-1234567890</p>
                        <div className="flex items-center text-xs text-green-600">
                          <Shield className="w-3 h-3 mr-1" />
                          Government Verified
                        </div>
                      </div>
                    </div>

                    <Separator className="my-8" />

                    <div className="space-y-4">
                      <h3 className="font-semibold text-lg">Areas of Expertise</h3>
                      <div className="flex flex-wrap gap-2">
                        {expertiseTags.map((tag, index) => (
                          <Badge
                            key={index}
                            variant="secondary"
                            className="px-4 py-2 bg-primary text-primary-foreground border-primary/20 hover:bg-primary/90 transition-colors"
                          >
                            {tag}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}

              {activeSection === "personal" && (
                <Card className="border-0 shadow-lg">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-xl">
                      <UserCheck className="h-5 w-5 text-primary" />
                      Personal Information
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-8">
                    <div className="flex flex-col lg:flex-row items-start gap-8">
                      <div className="flex flex-col items-center space-y-4">
                        <div className="relative group">
                          <Avatar className="h-32 w-32 border-4 border-primary/20 shadow-xl">
                            <AvatarImage
                              src={profileImage || "/placeholder.svg"}
                              alt="Profile"
                              className="object-cover"
                            />
                            <AvatarFallback className="text-2xl font-semibold bg-primary/10 text-primary">
                              SJ
                            </AvatarFallback>
                          </Avatar>
                          {isEditing && (
                            <div
                              className="absolute inset-0 bg-black/50 rounded-full opacity-0 group-hover:opacity-100 transition-all duration-300 flex items-center justify-center cursor-pointer"
                              onClick={() => fileInputRef.current?.click()}
                            >
                              <Camera className="h-8 w-8 text-white" />
                            </div>
                          )}
                        </div>
                        <div className="text-center space-y-2">
                          {isEditing && (
                            <>
                              <Button
                                variant="outline"
                                onClick={() => fileInputRef.current?.click()}
                                className="bg-primary/5 border-primary/20 hover:bg-primary/10"
                              >
                                <Upload className="mr-2 h-4 w-4" />
                                Change Photo
                              </Button>
                              <p className="text-xs text-muted-foreground">JPG, PNG up to 5MB</p>
                            </>
                          )}
                        </div>
                        <input
                          ref={fileInputRef}
                          type="file"
                          accept="image/*"
                          onChange={handleImageUpload}
                          className="hidden"
                        />
                      </div>

                      <div className="flex-1 space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <div className="space-y-2">
                            <Label htmlFor="fullName" className="text-sm font-medium flex items-center gap-2">
                              <User className="h-4 w-4 text-primary" />
                              Full Name *
                            </Label>
                            {isEditing ? (
                              <Input
                                id="fullName"
                                value={formData.fullName}
                                onChange={(e) => handleInputChange("fullName", e.target.value)}
                                className="bg-card border-border/50 focus:border-primary/50 focus:ring-primary/20"
                                placeholder="Enter your full name"
                              />
                            ) : (
                              <div className="px-3 py-2 bg-muted/30 rounded-md border border-border/30">
                                {formData.fullName}
                              </div>
                            )}
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="gender" className="text-sm font-medium">
                              Gender *
                            </Label>
                            {isEditing ? (
                              <Select
                                value={formData.gender}
                                onValueChange={(value) => handleInputChange("gender", value)}
                              >
                                <SelectTrigger className="bg-card border-border/50 focus:border-primary/50 focus:ring-primary/20">
                                  <SelectValue placeholder="Select gender" />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="female">Female</SelectItem>
                                  <SelectItem value="male">Male</SelectItem>
                                  <SelectItem value="other">Other</SelectItem>
                                  <SelectItem value="prefer-not-to-say">Prefer not to say</SelectItem>
                                </SelectContent>
                              </Select>
                            ) : (
                              <div className="px-3 py-2 bg-muted/30 rounded-md border border-border/30 capitalize">
                                {formData.gender}
                              </div>
                            )}
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="dob" className="text-sm font-medium flex items-center gap-2">
                              <Calendar className="h-4 w-4 text-primary" />
                              Date of Birth *
                            </Label>
                            {isEditing ? (
                              <Input
                                id="dob"
                                type="date"
                                value={formData.dob}
                                onChange={(e) => handleInputChange("dob", e.target.value)}
                                className="bg-card border-border/50 focus:border-primary/50 focus:ring-primary/20"
                              />
                            ) : (
                              <div className="px-3 py-2 bg-muted/30 rounded-md border border-border/30">
                                {new Date(formData.dob).toLocaleDateString()}
                              </div>
                            )}
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="email" className="text-sm font-medium flex items-center gap-2">
                              <Mail className="h-4 w-4 text-primary" />
                              Email Address *
                            </Label>
                            {isEditing ? (
                              <Input
                                id="email"
                                type="email"
                                value={formData.email}
                                onChange={(e) => handleInputChange("email", e.target.value)}
                                className="bg-card border-border/50 focus:border-primary/50 focus:ring-primary/20"
                                placeholder="Enter your email address"
                              />
                            ) : (
                              <div className="px-3 py-2 bg-muted/30 rounded-md border border-border/30">
                                {formData.email}
                              </div>
                            )}
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="phone" className="text-sm font-medium flex items-center gap-2">
                              <Phone className="h-4 w-4 text-primary" />
                              Phone Number *
                            </Label>
                            {isEditing ? (
                              <Input
                                id="phone"
                                type="tel"
                                value={formData.phone}
                                onChange={(e) => handleInputChange("phone", e.target.value)}
                                className="bg-card border-border/50 focus:border-primary/50 focus:ring-primary/20"
                                placeholder="Enter your phone number"
                              />
                            ) : (
                              <div className="px-3 py-2 bg-muted/30 rounded-md border border-border/30">
                                {formData.phone}
                              </div>
                            )}
                          </div>
                          <div className="space-y-2 md:col-span-2">
                            <Label htmlFor="address" className="text-sm font-medium flex items-center gap-2">
                              <MapPin className="h-4 w-4 text-primary" />
                              Address
                            </Label>
                            {isEditing ? (
                              <Textarea
                                id="address"
                                value={formData.address}
                                onChange={(e) => handleInputChange("address", e.target.value)}
                                className="bg-card border-border/50 focus:border-primary/50 focus:ring-primary/20 min-h-[100px]"
                                placeholder="Enter your complete address"
                              />
                            ) : (
                              <div className="px-3 py-2 bg-muted/30 rounded-md border border-border/30 min-h-[100px]">
                                {formData.address}
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}

              {activeSection === "professional" && (
                <Card className="border-0 shadow-lg">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-xl">
                      <Stethoscope className="h-5 w-5 text-primary" />
                      Professional Details
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-8">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <Label htmlFor="specialization" className="text-sm font-medium flex items-center gap-2">
                          <Briefcase className="h-4 w-4 text-primary" />
                          Primary Specialization *
                        </Label>
                        {isEditing ? (
                          <Select
                            value={formData.specialization}
                            onValueChange={(value) => handleInputChange("specialization", value)}
                          >
                            <SelectTrigger className="bg-card border-border/50 focus:border-primary/50 focus:ring-primary/20">
                              <SelectValue placeholder="Select specialization" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="ayurveda">Ayurveda</SelectItem>
                              <SelectItem value="unani">Unani</SelectItem>
                              <SelectItem value="biomedicine">Biomedicine</SelectItem>
                              <SelectItem value="homeopathy">Homeopathy</SelectItem>
                              <SelectItem value="siddha">Siddha</SelectItem>
                              <SelectItem value="naturopathy">Naturopathy</SelectItem>
                            </SelectContent>
                          </Select>
                        ) : (
                          <div className="px-3 py-2 bg-muted/30 rounded-md border border-border/30 capitalize">
                            {formData.specialization}
                          </div>
                        )}
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="license" className="text-sm font-medium flex items-center gap-2">
                          <Award className="h-4 w-4 text-primary" />
                          License Number *
                        </Label>
                        {isEditing ? (
                          <Input
                            id="license"
                            value={formData.license}
                            onChange={(e) => handleInputChange("license", e.target.value)}
                            className="bg-card border-border/50 focus:border-primary/50 focus:ring-primary/20"
                            placeholder="Enter license number"
                          />
                        ) : (
                          <div className="px-3 py-2 bg-muted/30 rounded-md border border-border/30">
                            {formData.license}
                          </div>
                        )}
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="hospital" className="text-sm font-medium flex items-center gap-2">
                          <Building2 className="h-4 w-4 text-primary" />
                          Affiliated Hospital/Clinic
                        </Label>
                        {isEditing ? (
                          <Input
                            id="hospital"
                            value={formData.hospital}
                            onChange={(e) => handleInputChange("hospital", e.target.value)}
                            className="bg-card border-border/50 focus:border-primary/50 focus:ring-primary/20"
                            placeholder="Enter hospital/clinic name"
                          />
                        ) : (
                          <div className="px-3 py-2 bg-muted/30 rounded-md border border-border/30">
                            {formData.hospital}
                          </div>
                        )}
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="experience" className="text-sm font-medium flex items-center gap-2">
                          <Activity className="h-4 w-4 text-primary" />
                          Years of Practice
                        </Label>
                        {isEditing ? (
                          <Select
                            value={formData.experience}
                            onValueChange={(value) => handleInputChange("experience", value)}
                          >
                            <SelectTrigger className="bg-card border-border/50 focus:border-primary/50 focus:ring-primary/20">
                              <SelectValue placeholder="Select experience range" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="0-2">0-2 years</SelectItem>
                              <SelectItem value="3-5">3-5 years</SelectItem>
                              <SelectItem value="6-10">6-10 years</SelectItem>
                              <SelectItem value="11-15">11-15 years</SelectItem>
                              <SelectItem value="16-20">16-20 years</SelectItem>
                              <SelectItem value="20+">20+ years</SelectItem>
                            </SelectContent>
                          </Select>
                        ) : (
                          <div className="px-3 py-2 bg-muted/30 rounded-md border border-border/30">
                            {formData.experience} years
                          </div>
                        )}
                      </div>
                    </div>

                    <Separator />

                    <div className="space-y-4">
                      <Label className="text-sm font-medium flex items-center gap-2">
                        <Star className="h-4 w-4 text-primary" />
                        Areas of Expertise
                      </Label>
                      <div className="flex flex-wrap gap-3">
                        {expertiseTags.map((tag, index) => (
                          <Badge
                            key={index}
                            variant="secondary"
                            className="px-4 py-2 bg-primary text-primary-foreground border-primary/20 hover:bg-primary/90 transition-all duration-200 group"
                          >
                            {tag}
                            {isEditing && (
                              <button
                                onClick={() => removeExpertiseTag(tag)}
                                className="ml-2 opacity-0 group-hover:opacity-100 hover:text-primary-foreground/70 transition-all duration-200"
                              >
                                <X className="h-3 w-3" />
                              </button>
                            )}
                          </Badge>
                        ))}
                      </div>
                      {isEditing && (
                        <div className="flex gap-2">
                          <Input
                            placeholder="Add new expertise area"
                            value={newTag}
                            onChange={(e) => setNewTag(e.target.value)}
                            onKeyPress={(e) => e.key === "Enter" && addExpertiseTag()}
                            className="flex-1 bg-card border-border/50 focus:border-primary/50 focus:ring-primary/20"
                          />
                          <Button
                            onClick={addExpertiseTag}
                            className="bg-primary hover:bg-primary/90 text-primary-foreground"
                          >
                            <Plus className="h-4 w-4" />
                          </Button>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              )}

              {activeSection === "credentials" && (
                <Card className="border-0 shadow-lg">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-xl">
                      <Award className="h-5 w-5 text-primary" />
                      Professional Identifiers
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <Label htmlFor="abha" className="text-sm font-medium flex items-center gap-2">
                          <Shield className="h-4 w-4 text-primary" />
                          ABHA ID
                        </Label>
                        <div className="relative">
                          {isEditing ? (
                            <Input
                              id="abha"
                              value={formData.abha}
                              onChange={(e) => handleInputChange("abha", e.target.value)}
                              className="pr-10 bg-card border-border/50 focus:border-primary/50 focus:ring-primary/20"
                              placeholder="Enter ABHA ID"
                            />
                          ) : (
                            <div className="px-3 py-2 pr-10 bg-muted/30 rounded-md border border-border/30">
                              {formData.abha}
                            </div>
                          )}
                          <CheckCircle className="absolute right-3 top-3 h-4 w-4 text-green-500" />
                        </div>
                        <div className="flex items-center gap-2 text-xs text-green-600">
                          <CheckCircle className="h-3 w-3" />
                          Government Verified
                        </div>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="npi" className="text-sm font-medium">
                          National Provider ID
                        </Label>
                        {isEditing ? (
                          <Input
                            id="npi"
                            value={formData.npi}
                            onChange={(e) => handleInputChange("npi", e.target.value)}
                            className="bg-card border-border/50 focus:border-primary/50 focus:ring-primary/20"
                            placeholder="Enter National Provider ID"
                          />
                        ) : (
                          <div className="px-3 py-2 bg-muted/30 rounded-md border border-border/30">{formData.npi}</div>
                        )}
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="employeeId" className="text-sm font-medium">
                          Employee ID
                        </Label>
                        {isEditing ? (
                          <Input
                            id="employeeId"
                            value={formData.employeeId}
                            onChange={(e) => handleInputChange("employeeId", e.target.value)}
                            className="bg-card border-border/50 focus:border-primary/50 focus:ring-primary/20"
                            placeholder="Enter Employee ID"
                          />
                        ) : (
                          <div className="px-3 py-2 bg-muted/30 rounded-md border border-border/30">
                            {formData.employeeId}
                          </div>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}

              {activeSection === "emergency" && (
                <Card className="border-0 shadow-lg">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-xl">
                      <AlertCircle className="h-5 w-5 text-primary" />
                      Emergency Contact
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      <div className="space-y-2">
                        <Label htmlFor="emergencyName" className="text-sm font-medium">
                          Contact Name *
                        </Label>
                        {isEditing ? (
                          <Input
                            id="emergencyName"
                            value={formData.emergencyName}
                            onChange={(e) => handleInputChange("emergencyName", e.target.value)}
                            className="bg-card border-border/50 focus:border-primary/50 focus:ring-primary/20"
                            placeholder="Enter contact name"
                          />
                        ) : (
                          <div className="px-3 py-2 bg-muted/30 rounded-md border border-border/30">
                            {formData.emergencyName}
                          </div>
                        )}
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="relationship" className="text-sm font-medium">
                          Relationship *
                        </Label>
                        {isEditing ? (
                          <Select
                            value={formData.relationship}
                            onValueChange={(value) => handleInputChange("relationship", value)}
                          >
                            <SelectTrigger className="bg-card border-border/50 focus:border-primary/50 focus:ring-primary/20">
                              <SelectValue placeholder="Select relationship" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="spouse">Spouse</SelectItem>
                              <SelectItem value="parent">Parent</SelectItem>
                              <SelectItem value="sibling">Sibling</SelectItem>
                              <SelectItem value="child">Child</SelectItem>
                              <SelectItem value="friend">Friend</SelectItem>
                              <SelectItem value="colleague">Colleague</SelectItem>
                            </SelectContent>
                          </Select>
                        ) : (
                          <div className="px-3 py-2 bg-muted/30 rounded-md border border-border/30 capitalize">
                            {formData.relationship}
                          </div>
                        )}
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="emergencyPhone" className="text-sm font-medium flex items-center gap-2">
                          <Phone className="h-4 w-4 text-primary" />
                          Phone Number *
                        </Label>
                        {isEditing ? (
                          <Input
                            id="emergencyPhone"
                            type="tel"
                            value={formData.emergencyPhone}
                            onChange={(e) => handleInputChange("emergencyPhone", e.target.value)}
                            className="bg-card border-border/50 focus:border-primary/50 focus:ring-primary/20"
                            placeholder="Enter emergency contact phone"
                          />
                        ) : (
                          <div className="px-3 py-2 bg-muted/30 rounded-md border border-border/30">
                            {formData.emergencyPhone}
                          </div>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}

              {activeSection === "system" && (
                <Card className="border-0 shadow-lg">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-xl">
                      <Monitor className="h-5 w-5 text-primary" />
                      System Information
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="flex items-center gap-4 p-6 bg-gradient-to-r from-primary/5 to-primary/10 rounded-xl border border-primary/20">
                        <div className="flex items-center justify-center w-12 h-12 bg-primary/20 rounded-lg">
                          <Calendar className="h-6 w-6 text-primary" />
                        </div>
                        <div>
                          <p className="font-medium">Date Joined</p>
                          <p className="text-sm text-muted-foreground">March 15, 2023</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-4 p-6 bg-gradient-to-r from-secondary/5 to-secondary/10 rounded-xl border border-secondary/20">
                        <div className="flex items-center justify-center w-12 h-12 bg-secondary/20 rounded-lg">
                          <Clock className="h-6 w-6 text-secondary" />
                        </div>
                        <div>
                          <p className="font-medium">Last Login</p>
                          <p className="text-sm text-muted-foreground">Today, 2:30 PM</p>
                        </div>
                      </div>
                    </div>
                    <div className="p-6 bg-gradient-to-r from-muted/50 to-muted/30 rounded-xl border border-border/50">
                      <div className="flex items-center gap-4">
                        <div className="flex items-center justify-center w-12 h-12 bg-background rounded-lg shadow-sm">
                          <Monitor className="h-6 w-6 text-foreground" />
                        </div>
                        <div>
                          <p className="font-medium">Last Login Device</p>
                          <p className="text-sm text-muted-foreground">Chrome on Windows • IP: 192.168.1.100</p>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}

              <div className="flex flex-col sm:flex-row gap-4 justify-end items-center pt-8 border-t border-border/50">
                {!isEditing ? (
                  <Button
                    size="lg"
                    onClick={handleEdit}
                    className="w-full sm:w-auto bg-primary hover:bg-primary/90 text-primary-foreground px-8 shadow-lg hover:shadow-xl transition-all duration-300"
                  >
                    <Edit className="mr-2 h-4 w-4" />
                    Edit Profile
                  </Button>
                ) : (
                  <>
                    <Button
                      variant="outline"
                      size="lg"
                      onClick={handleCancel}
                      className="w-full sm:w-auto bg-background hover:bg-muted border-border/50"
                    >
                      Cancel Changes
                    </Button>
                    <Button
                      size="lg"
                      onClick={handleSave}
                      disabled={isLoading}
                      className="w-full sm:w-auto bg-primary hover:bg-primary/90 text-primary-foreground px-8 shadow-lg hover:shadow-xl transition-all duration-300"
                    >
                      {isLoading ? (
                        <>
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary-foreground mr-2" />
                          Saving Changes...
                        </>
                      ) : (
                        <>
                          <Save className="mr-2 h-4 w-4" />
                          Save Changes
                        </>
                      )}
                    </Button>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
