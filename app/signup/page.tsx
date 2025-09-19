"use client"

import type React from "react"
import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Eye, EyeOff, Loader2, Sparkles, User, Mail, Lock, UserCheck, Heart, Stethoscope, CheckCircle, AlertCircle, Shield } from 'lucide-react'

// Firebase imports
import { createUserWithEmailAndPassword, updateProfile, GoogleAuthProvider, signInWithPopup } from "firebase/auth"
import { doc, setDoc, getDoc, serverTimestamp } from "firebase/firestore"
import { auth, db } from "@/lib/firebase"

export default function SignUpPage() {
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [isGoogleLoading, setIsGoogleLoading] = useState(false)
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    password: "",
    confirmPassword: "",
    role: "",
    agreeToTerms: false,
  })
  const [errors, setErrors] = useState<Record<string, string>>({})
  const router = useRouter()

  // Password strength calculation
  const getPasswordStrength = (password: string) => {
    let strength = 0
    if (password.length >= 8) strength++
    if (/[A-Z]/.test(password)) strength++
    if (/[a-z]/.test(password)) strength++
    if (/[0-9]/.test(password)) strength++
    if (/[^A-Za-z0-9]/.test(password)) strength++
    return strength
  }

  const passwordStrength = getPasswordStrength(formData.password)
  const strengthLabels = ["Very Weak", "Weak", "Fair", "Good", "Strong"]
  const strengthColors = ["bg-destructive", "bg-orange-500", "bg-yellow-500", "bg-blue-500", "bg-green-500"]

  const validateForm = () => {
    const newErrors: Record<string, string> = {}

    if (!formData.fullName.trim()) newErrors.fullName = "Full name is required"
    if (!formData.email.trim()) newErrors.email = "Email is required"
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) newErrors.email = "Please enter a valid email address"
    if (!formData.password) newErrors.password = "Password is required"
    else if (formData.password.length < 8) newErrors.password = "Password must be at least 8 characters"
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
    setErrors({}) // Clear any previous errors

    try {
      // Create user in Firebase Auth
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        formData.email,
        formData.password
      )
      const user = userCredential.user

      // Set display name in Auth profile (optional but useful)
      await updateProfile(user, { displayName: formData.fullName })

      // Save profile data in Firestore under "users/{uid}"
      await setDoc(doc(db, "users", user.uid), {
        fullName: formData.fullName,
        email: formData.email,
        role: formData.role,
        createdAt: serverTimestamp(),
      })

      // Redirect based on role
      if (formData.role === "doctor" || formData.role === "hospital-admin") {
        router.push("/")
      } else {
        router.push("/")
      }
    } catch (error: any) {
      console.error("Signup error:", error)
      
      // Handle specific Firebase errors with user-friendly messages
      let errorMessage = "An error occurred during registration"
      
      switch (error.code) {
        case "auth/email-already-in-use":
          errorMessage = "An account with this email already exists"
          break
        case "auth/invalid-email":
          errorMessage = "Please enter a valid email address"
          break
        case "auth/operation-not-allowed":
          errorMessage = "Email/password accounts are not enabled. Please contact support."
          break
        case "auth/weak-password":
          errorMessage = "Password is too weak. Please choose a stronger password."
          break
        case "auth/network-request-failed":
          errorMessage = "Network error. Please check your connection and try again."
          break
        case "auth/too-many-requests":
          errorMessage = "Too many failed attempts. Please try again later."
          break
        default:
          errorMessage = error.message || errorMessage
      }
      
      setErrors({ submit: errorMessage })
    } finally {
      setIsLoading(false)
    }
  }

  const handleGoogleSignUp = async () => {
    setIsGoogleLoading(true)
    setErrors({}) // Clear any previous errors

    try {
      const provider = new GoogleAuthProvider()
      // Add additional scopes if needed
      provider.addScope('email')
      provider.addScope('profile')

      const result = await signInWithPopup(auth, provider)
      const user = result.user

      // Check if user already exists in Firestore
      const userRef = doc(db, "users", user.uid)
      const userSnap = await getDoc(userRef)

      if (!userSnap.exists()) {
        // Save profile in Firestore for new users
        await setDoc(userRef, {
          fullName: user.displayName || "",
          email: user.email || "",
          role: "patient", // Default role for Google signups
          createdAt: serverTimestamp(),
          photoURL: user.photoURL || "",
          provider: "google",
        })
      }

      // Redirect to home page
      router.push("/")
    } catch (error: any) {
      console.error("Google signup error:", error)
      
      // Handle specific Google Auth errors
      let errorMessage = "Google sign-in failed"
      
      switch (error.code) {
        case "auth/popup-closed-by-user":
          errorMessage = "Sign-in was cancelled. Please try again."
          break
        case "auth/popup-blocked":
          errorMessage = "Pop-up was blocked by your browser. Please allow pop-ups and try again."
          break
        case "auth/cancelled-popup-request":
          errorMessage = "Only one sign-in request at a time is allowed."
          break
        case "auth/account-exists-with-different-credential":
          errorMessage = "An account already exists with this email using a different sign-in method."
          break
        case "auth/network-request-failed":
          errorMessage = "Network error. Please check your connection and try again."
          break
        case "auth/too-many-requests":
          errorMessage = "Too many failed attempts. Please try again later."
          break
        default:
          errorMessage = error.message || errorMessage
      }
      
      setErrors({ submit: errorMessage })
    } finally {
      setIsGoogleLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/10 via-background to-secondary/5 flex items-center justify-center p-4 relative overflow-hidden">
      {/* Enhanced floating background elements with original color scheme */}
      <div className="absolute top-20 left-10 w-32 h-32 bg-primary/8 rounded-full blur-3xl animate-pulse" />
      <div className="absolute bottom-20 right-10 w-40 h-40 bg-secondary/8 rounded-full blur-3xl animate-pulse delay-1000" />
      <div className="absolute top-1/2 right-1/4 w-24 h-24 bg-accent/6 rounded-full blur-xl animate-pulse delay-500" />
      <div className="absolute top-1/3 left-1/3 w-20 h-20 bg-primary/5 rounded-full blur-2xl animate-pulse delay-700" />
      <div className="absolute bottom-1/3 left-1/5 w-28 h-28 bg-secondary/6 rounded-full blur-2xl animate-pulse delay-300" />

      <div className="w-full max-w-lg">
        <Card className="animate-in slide-in-from-bottom-4 duration-500 shadow-2xl hover:shadow-3xl transition-all duration-500 border border-primary/20 hover:border-primary/30 backdrop-blur-sm bg-background/95">
          <CardHeader className="text-center pb-8">
            {/* Enhanced logo with floating animation */}
            <Link href="/" className="flex items-center justify-center space-x-3 group mb-8">
              <div className="relative h-14 w-14 rounded-xl bg-gradient-to-br from-primary to-secondary flex items-center justify-center group-hover:scale-110 group-hover:rotate-3 transition-all duration-300 shadow-lg animate-float">
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
            {errors.submit && (
              <div className="p-4 rounded-lg bg-destructive/10 border border-destructive/20 text-destructive text-sm animate-in slide-in-from-top-2 font-sans flex items-center gap-2">
                <AlertCircle className="h-4 w-4 flex-shrink-0" />
                {errors.submit}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 gap-6">
                {/* Enhanced Full Name Field with validation icons */}
                <div className="space-y-3">
                  <Label htmlFor="fullName" className="text-sm font-medium flex items-center gap-2 font-sans">
                    <User className="h-4 w-4 text-primary" />
                    Full Name
                  </Label>
                  <div className="relative">
                    <Input
                      id="fullName"
                      type="text"
                      placeholder="Enter your full name"
                      value={formData.fullName}
                      onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                      className={`h-12 pr-10 transition-all duration-300 focus:ring-2 focus:ring-primary/30 border-2 font-sans ${
                        errors.fullName
                          ? "border-destructive focus:border-destructive"
                          : formData.fullName.trim()
                          ? "border-green-500 focus:border-green-500"
                          : "border-border hover:border-primary/50 focus:border-primary"
                      }`}
                      required
                    />
                    {formData.fullName.trim() && !errors.fullName && (
                      <CheckCircle className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-green-500" />
                    )}
                  </div>
                  {errors.fullName && <p className="text-xs text-destructive mt-1 font-sans flex items-center gap-1">
                    <AlertCircle className="h-3 w-3" />
                    {errors.fullName}
                  </p>}
                </div>

                {/* Enhanced Email Field with validation icons */}
                <div className="space-y-3">
                  <Label htmlFor="email" className="text-sm font-medium flex items-center gap-2 font-sans">
                    <Mail className="h-4 w-4 text-primary" />
                    Email / ABHA ID
                  </Label>
                  <div className="relative">
                    <Input
                      id="email"
                      type="email"
                      placeholder="Enter your email or ABHA ID"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className={`h-12 pr-10 transition-all duration-300 focus:ring-2 focus:ring-primary/30 border-2 font-sans ${
                        errors.email
                          ? "border-destructive focus:border-destructive"
                          : formData.email.includes("@") && formData.email.trim()
                          ? "border-green-500 focus:border-green-500"
                          : "border-border hover:border-primary/50 focus:border-primary"
                      }`}
                      required
                    />
                    {formData.email.includes("@") && formData.email.trim() && !errors.email && (
                      <CheckCircle className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-green-500" />
                    )}
                  </div>
                  {errors.email && <p className="text-xs text-destructive mt-1 font-sans flex items-center gap-1">
                    <AlertCircle className="h-3 w-3" />
                    {errors.email}
                  </p>}
                </div>

                {/* Enhanced Password Fields with strength indicator */}
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
                    
                    {/* Password strength indicator */}
                    {formData.password && (
                      <div className="space-y-2">
                        <div className="flex gap-1">
                          {[...Array(5)].map((_, i) => (
                            <div
                              key={i}
                              className={`h-1 flex-1 rounded-full transition-all duration-300 ${
                                i < passwordStrength ? strengthColors[passwordStrength - 1] : "bg-muted"
                              }`}
                            />
                          ))}
                        </div>
                        <p className="text-xs text-muted-foreground font-sans">
                          Strength: {strengthLabels[passwordStrength - 1] || "Very Weak"}
                        </p>
                      </div>
                    )}
                    
                    {errors.password && <p className="text-xs text-destructive mt-1 font-sans flex items-center gap-1">
                      <AlertCircle className="h-3 w-3" />
                      {errors.password}
                    </p>}
                  </div>

                  <div className="space-y-3">
                    <Label htmlFor="confirmPassword" className="text-sm font-medium flex items-center gap-2 font-sans">
                      <Shield className="h-4 w-4 text-primary" />
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
                            : formData.confirmPassword && formData.password === formData.confirmPassword
                            ? "border-green-500 focus:border-green-500"
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
                      {formData.confirmPassword && formData.password === formData.confirmPassword && (
                        <CheckCircle className="absolute right-12 top-1/2 -translate-y-1/2 h-4 w-4 text-green-500" />
                      )}
                    </div>
                    {errors.confirmPassword && (
                      <p className="text-xs text-destructive mt-1 font-sans flex items-center gap-1">
                        <AlertCircle className="h-3 w-3" />
                        {errors.confirmPassword}
                      </p>
                    )}
                  </div>
                </div>

                {/* Enhanced Role Field with better styling */}
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
                          : formData.role
                          ? "border-green-500 focus:border-green-500"
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
                  {errors.role && <p className="text-xs text-destructive mt-1 font-sans flex items-center gap-1">
                    <AlertCircle className="h-3 w-3" />
                    {errors.role}
                  </p>}
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
                {errors.agreeToTerms && <p className="text-xs text-destructive font-sans flex items-center gap-1">
                  <AlertCircle className="h-3 w-3" />
                  {errors.agreeToTerms}
                </p>}
              </div>

              <div className="space-y-4 pt-4">
                {/* Enhanced submit button with shimmer effect */}
                <Button
                  type="submit"
                  className="w-full h-12 bg-primary hover:bg-secondary text-primary-foreground font-sans font-semibold hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group relative overflow-hidden"
                  disabled={isLoading || isGoogleLoading}
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

                {/* Enhanced Google button with hover effects */}
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleGoogleSignUp}
                  disabled={isLoading || isGoogleLoading}
                  className="w-full h-12 bg-transparent hover:bg-primary/5 hover:border-primary/50 border-2 transition-all duration-300 font-sans group"
                >
                  {isGoogleLoading ? (
                    <>
                      <Loader2 className="mr-3 h-5 w-5 animate-spin" />
                      Signing in with Google...
                    </>
                  ) : (
                    <>
                      <svg className="mr-3 h-5 w-5 transition-transform duration-300 group-hover:scale-110" viewBox="0 0 24 24">
                        <path
                          fill="#4285F4"
                          d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                        />
                        <path
                          fill="#34A853"
                          d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                        />
                        <path
                          fill="#FBBC05"
                          d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                        />
                        <path
                          fill="#EA4335"
                          d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                        />
                      </svg>
                      Continue with Google
                    </>
                  )}
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

      {/* Add floating animation keyframes */}
      <style jsx>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-10px) rotate(2deg); }
        }
        .animate-float {
          animation: float 3s ease-in-out infinite;
        }
      `}</style>
    </div>
  )
}