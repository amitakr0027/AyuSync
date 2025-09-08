"use client"

import type React from "react"
import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Eye, EyeOff, Loader2, Sparkles, User, Mail, Lock, UserCheck, Heart, Stethoscope } from "lucide-react"

export default function SignUpPage() {
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    password: "",
    confirmPassword: "",
    role: "",
    agreeToTerms: false,
  })
  const [errors, setErrors] = useState<Record<string, string>>({})

  const validateForm = () => {
    const newErrors: Record<string, string> = {}

    if (!formData.fullName.trim()) newErrors.fullName = "Full name is required"
    if (!formData.email.trim()) newErrors.email = "Email is required"
    if (!formData.password) newErrors.password = "Password is required"
    if (formData.password.length < 8) newErrors.password = "Password must be at least 8 characters"
    if (formData.password !== formData.confirmPassword) newErrors.confirmPassword = "Passwords don't match"
    if (!formData.role) newErrors.role = "Please select your role"
    if (!formData.agreeToTerms) newErrors.agreeToTerms = "You must agree to the terms"

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!validateForm()) return

    setIsLoading(true)

    // Simulate API call
    setTimeout(() => {
      // Success - redirect to home page
      window.location.href = "/home"
      setIsLoading(false)
    }, 2000)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/10 via-background to-secondary/5 flex items-center justify-center p-4 relative overflow-hidden">
      <div className="absolute top-20 left-10 w-32 h-32 bg-primary/8 rounded-full blur-3xl animate-pulse" />
      <div className="absolute bottom-20 right-10 w-40 h-40 bg-secondary/8 rounded-full blur-3xl animate-pulse delay-1000" />
      <div className="absolute top-1/2 right-1/4 w-24 h-24 bg-accent/6 rounded-full blur-xl animate-pulse delay-500" />

      <div className="w-full max-w-lg">
        <Card className="animate-in slide-in-from-bottom-4 duration-500 shadow-2xl hover:shadow-3xl transition-all duration-500 border border-primary/20 hover:border-primary/30 backdrop-blur-sm bg-background/95">
          <CardHeader className="text-center pb-8">
            <Link href="/" className="flex items-center justify-center space-x-3 group mb-8">
              <div className="relative h-14 w-14 rounded-xl bg-gradient-to-br from-primary to-secondary flex items-center justify-center group-hover:scale-110 group-hover:rotate-3 transition-all duration-300 shadow-lg">
                <Heart className="h-6 w-6 text-white absolute" />
                <Stethoscope className="h-5 w-5 text-white/80 absolute translate-x-1 translate-y-1" />
              </div>
              <span className="font-sans font-bold text-3xl text-foreground group-hover:text-primary transition-colors duration-300">
                AyuSync
              </span>
            </Link>

            <div className="space-y-3">
              <CardTitle className="text-2xl font-sans font-semibold text-foreground">Join AyuSync</CardTitle>
              <CardDescription className="text-muted-foreground font-sans leading-relaxed">
                Bridge traditional and modern healthcare with intelligent code mapping
              </CardDescription>
            </div>
          </CardHeader>

          <CardContent className="space-y-6">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 gap-6">
                {/* Full Name Field */}
                <div className="space-y-3">
                  <Label htmlFor="fullName" className="text-sm font-medium flex items-center gap-2 font-sans">
                    <User className="h-4 w-4 text-primary" />
                    Full Name
                  </Label>
                  <Input
                    id="fullName"
                    type="text"
                    placeholder="Enter your full name"
                    value={formData.fullName}
                    onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                    className={`h-12 transition-all duration-300 focus:ring-2 focus:ring-primary/30 border-2 font-sans ${
                      errors.fullName
                        ? "border-destructive focus:border-destructive"
                        : "border-border hover:border-primary/50 focus:border-primary"
                    }`}
                    required
                  />
                  {errors.fullName && <p className="text-xs text-destructive mt-1 font-sans">{errors.fullName}</p>}
                </div>

                {/* Email Field */}
                <div className="space-y-3">
                  <Label htmlFor="email" className="text-sm font-medium flex items-center gap-2 font-sans">
                    <Mail className="h-4 w-4 text-primary" />
                    Email / ABHA ID
                  </Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="Enter your email or ABHA ID"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className={`h-12 transition-all duration-300 focus:ring-2 focus:ring-primary/30 border-2 font-sans ${
                      errors.email
                        ? "border-destructive focus:border-destructive"
                        : "border-border hover:border-primary/50 focus:border-primary"
                    }`}
                    required
                  />
                  {errors.email && <p className="text-xs text-destructive mt-1 font-sans">{errors.email}</p>}
                </div>

                {/* Password Fields Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-3">
                    <Label htmlFor="password" className="text-sm font-medium flex items-center gap-2 font-sans">
                      <Lock className="h-4 w-4 text-primary" />
                      Password
                    </Label>
                    <div className="relative">
                      <Input
                        id="password"
                        type={showPassword ? "text" : "password"}
                        placeholder="Create password"
                        value={formData.password}
                        onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                        className={`h-12 pr-12 transition-all duration-300 focus:ring-2 focus:ring-primary/30 border-2 font-sans ${
                          errors.password
                            ? "border-destructive focus:border-destructive"
                            : "border-border hover:border-primary/50 focus:border-primary"
                        }`}
                        required
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-primary transition-colors duration-200"
                      >
                        {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </button>
                    </div>
                    {errors.password && <p className="text-xs text-destructive mt-1 font-sans">{errors.password}</p>}
                  </div>

                  <div className="space-y-3">
                    <Label htmlFor="confirmPassword" className="text-sm font-medium flex items-center gap-2 font-sans">
                      <Lock className="h-4 w-4 text-primary" />
                      Confirm
                    </Label>
                    <div className="relative">
                      <Input
                        id="confirmPassword"
                        type={showConfirmPassword ? "text" : "password"}
                        placeholder="Confirm password"
                        value={formData.confirmPassword}
                        onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                        className={`h-12 pr-12 transition-all duration-300 focus:ring-2 focus:ring-primary/30 border-2 font-sans ${
                          errors.confirmPassword
                            ? "border-destructive focus:border-destructive"
                            : "border-border hover:border-primary/50 focus:border-primary"
                        }`}
                        required
                      />
                      <button
                        type="button"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-primary transition-colors duration-200"
                      >
                        {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </button>
                    </div>
                    {errors.confirmPassword && (
                      <p className="text-xs text-destructive mt-1 font-sans">{errors.confirmPassword}</p>
                    )}
                  </div>
                </div>

                {/* Role Field */}
                <div className="space-y-3">
                  <Label htmlFor="role" className="text-sm font-medium flex items-center gap-2 font-sans">
                    <UserCheck className="h-4 w-4 text-primary" />
                    Professional Role
                  </Label>
                  <Select value={formData.role} onValueChange={(value) => setFormData({ ...formData, role: value })}>
                    <SelectTrigger
                      className={`h-12 transition-all duration-300 focus:ring-2 focus:ring-primary/30 border-2 font-sans ${
                        errors.role
                          ? "border-destructive focus:border-destructive"
                          : "border-border hover:border-primary/50 focus:border-primary"
                      }`}
                    >
                      <SelectValue placeholder="Select your professional role" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="patient">Patient / Individual User</SelectItem>
                      <SelectItem value="doctor">Healthcare Provider / Doctor</SelectItem>
                      <SelectItem value="researcher">Medical Researcher</SelectItem>
                      <SelectItem value="hospital-admin">Hospital Administrator</SelectItem>
                      <SelectItem value="pharmacist">Pharmacist</SelectItem>
                      <SelectItem value="nurse">Nurse / Healthcare Staff</SelectItem>
                      <SelectItem value="other">Other Healthcare Professional</SelectItem>
                    </SelectContent>
                  </Select>
                  {errors.role && <p className="text-xs text-destructive mt-1 font-sans">{errors.role}</p>}
                </div>
              </div>

              <div className="space-y-4 pt-2">
                <div className="flex items-start space-x-3">
                  <Checkbox
                    id="terms"
                    checked={formData.agreeToTerms}
                    onCheckedChange={(checked) => setFormData({ ...formData, agreeToTerms: checked as boolean })}
                    className="mt-1 border-2 border-primary/30 data-[state=checked]:bg-primary data-[state=checked]:border-primary"
                  />
                  <Label
                    htmlFor="terms"
                    className="text-sm cursor-pointer leading-relaxed text-muted-foreground font-sans"
                  >
                    I agree to AyuSync's{" "}
                    <Link
                      href="/terms"
                      className="text-primary hover:text-secondary transition-colors duration-200 underline underline-offset-2 font-medium"
                    >
                      Terms of Service
                    </Link>{" "}
                    and{" "}
                    <Link
                      href="/privacy"
                      className="text-primary hover:text-secondary transition-colors duration-200 underline underline-offset-2 font-medium"
                    >
                      Privacy Policy
                    </Link>
                  </Label>
                </div>
                {errors.agreeToTerms && <p className="text-xs text-destructive font-sans">{errors.agreeToTerms}</p>}
              </div>

              <div className="space-y-4 pt-4">
                <Button
                  type="submit"
                  className="w-full h-12 bg-primary hover:bg-secondary text-primary-foreground font-sans font-semibold hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group relative overflow-hidden"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                      Creating Your Account...
                    </>
                  ) : (
                    <>
                      <span className="relative z-10">Create AyuSync Account</span>
                      <Sparkles className="ml-2 h-4 w-4 opacity-0 group-hover:opacity-100 group-hover:animate-pulse transition-all duration-300 relative z-10" />
                      <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/10 to-white/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700" />
                    </>
                  )}
                </Button>

                <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <span className="w-full border-t border-border" />
                  </div>
                  <div className="relative flex justify-center text-xs uppercase">
                    <span className="bg-background px-3 text-muted-foreground font-sans">Or continue with</span>
                  </div>
                </div>

                <Button
                  type="button"
                  variant="outline"
                  className="w-full h-12 bg-transparent hover:bg-primary/5 hover:border-primary/50 border-2 transition-all duration-300 font-sans"
                >
                  <svg className="mr-3 h-5 w-5" viewBox="0 0 24 24">
                    <path
                      fill="currentColor"
                      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                    />
                    <path
                      fill="currentColor"
                      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                    />
                    <path
                      fill="currentColor"
                      d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                    />
                    <path
                      fill="currentColor"
                      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                    />
                  </svg>
                  Continue with Google
                </Button>
              </div>
            </form>

            <div className="text-center pt-6 border-t border-border">
              <p className="text-sm text-muted-foreground font-sans">
                Already have an account?{" "}
                <Link
                  href="/login"
                  className="text-primary hover:text-secondary transition-colors duration-200 font-semibold underline underline-offset-2"
                >
                  Sign in here
                </Link>
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
