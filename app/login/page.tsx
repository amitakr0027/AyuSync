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
import { Eye, EyeOff, Loader2, Heart, Stethoscope } from "lucide-react"

// Firebase imports
import { signInWithEmailAndPassword, GoogleAuthProvider, signInWithPopup } from "firebase/auth"
import { doc, getDoc, setDoc, serverTimestamp } from "firebase/firestore"
import { auth, db } from "@/lib/firebase"

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [isAbhaLoading, setIsAbhaLoading] = useState(false)
  const [isGoogleLoading, setIsGoogleLoading] = useState(false)
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    rememberMe: false,
  })
  const [error, setError] = useState("")
  
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError("")

    try {
      const userCredential = await signInWithEmailAndPassword(
        auth,
        formData.email,
        formData.password
      )
      const user = userCredential.user

      // Fetch profile from Firestore
      const userDoc = await getDoc(doc(db, "users", user.uid))
      const profile = userDoc.exists() ? userDoc.data() : null

      // Store a minimal session object for compatibility with existing code
      // DO NOT store password. Only store minimal safe info:
      const currentUser = {
        uid: user.uid,
        email: user.email,
        fullName: profile?.fullName || user.displayName || "User",
        role: profile?.role || "patient",
      }
      localStorage.setItem("currentUser", JSON.stringify(currentUser))
      localStorage.setItem("isLoggedIn", "true")

      // Redirect based on role
      if (currentUser.role === "doctor" || currentUser.role === "hospital-admin") {
        router.push("/")
      } else {
        router.push("/")
      }
    } catch (err: any) {
      console.error("Login error:", err)
      
      // Provide user-friendly error messages
      let errorMessage = "Invalid email or password"
      
      if (err.code === "auth/user-not-found") {
        errorMessage = "No account found with this email address"
      } else if (err.code === "auth/wrong-password") {
        errorMessage = "Incorrect password"
      } else if (err.code === "auth/invalid-email") {
        errorMessage = "Please enter a valid email address"
      } else if (err.code === "auth/user-disabled") {
        errorMessage = "This account has been disabled"
      } else if (err.code === "auth/too-many-requests") {
        errorMessage = "Too many failed attempts. Please try again later"
      } else if (err.message) {
        errorMessage = err.message
      }
      
      setError(errorMessage)
    } finally {
      setIsLoading(false)
    }
  }

  const handleAbhaLogin = async () => {
    setIsAbhaLoading(true)
    setError("")

    try {
      // Simulate ABHA OAuth flow - replace with actual ABHA integration
      // For demo purposes, we'll create a temporary ABHA user
      const abhaUser = {
        id: "abha_user_" + Date.now(),
        uid: "abha_user_" + Date.now(),
        fullName: "ABHA User",
        email: "abha_user@example.com",
        role: "patient",
        createdAt: new Date().toISOString()
      }
      
      // Store current user session
      localStorage.setItem("currentUser", JSON.stringify(abhaUser))
      localStorage.setItem("isLoggedIn", "true")
      
      router.push("/dashboard?auth=abha")
    } catch (err) {
      setError("ABHA authentication failed. Please try again.")
    } finally {
      setIsAbhaLoading(false)
    }
  }

  const handleGoogleLogin = async () => {
    setIsGoogleLoading(true)
    setError("")
    
    try {
      const provider = new GoogleAuthProvider()
      const result = await signInWithPopup(auth, provider)

      const user = result.user

      // Fetch or create user profile in Firestore
      const userRef = doc(db, "users", user.uid)
      const userSnap = await getDoc(userRef)

      let profile
      if (!userSnap.exists()) {
        // Create new user profile if it doesn't exist
        const newProfile = {
          fullName: user.displayName || "",
          email: user.email,
          role: "patient", // default role
          createdAt: serverTimestamp(),
        }
        await setDoc(userRef, newProfile)
        profile = { fullName: user.displayName || "", role: "patient" }
      } else {
        profile = userSnap.data()
      }

      // Save session to localStorage (for compatibility with your AuthContext)
      const currentUser = {
        uid: user.uid,
        email: user.email,
        fullName: profile?.fullName || user.displayName || "User",
        role: profile?.role || "patient",
      }
      localStorage.setItem("currentUser", JSON.stringify(currentUser))
      localStorage.setItem("isLoggedIn", "true")

      // Redirect to home
      router.push("/home")
    } catch (err: any) {
      console.error("Google login error:", err)
      
      // Provide user-friendly error messages for Google auth
      let errorMessage = "Google sign-in failed"
      
      if (err.code === "auth/popup-closed-by-user") {
        errorMessage = "Sign-in was cancelled"
      } else if (err.code === "auth/popup-blocked") {
        errorMessage = "Pop-up was blocked. Please allow pop-ups and try again"
      } else if (err.code === "auth/cancelled-popup-request") {
        errorMessage = "Sign-in was cancelled"
      } else if (err.code === "auth/network-request-failed") {
        errorMessage = "Network error. Please check your connection and try again"
      } else if (err.message) {
        errorMessage = err.message
      }
      
      setError(errorMessage)
    } finally {
      setIsGoogleLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/10 via-background to-secondary/5 flex items-center justify-center p-4 relative overflow-hidden">
      <div className="absolute top-20 left-10 w-32 h-32 bg-primary/8 rounded-full blur-3xl animate-pulse" />
      <div className="absolute bottom-20 right-10 w-40 h-40 bg-secondary/8 rounded-full blur-3xl animate-pulse delay-1000" />
      <div className="absolute top-1/2 left-1/4 w-20 h-20 bg-accent/6 rounded-full blur-xl animate-pulse delay-500" />
      <div className="absolute bottom-1/3 right-1/3 w-24 h-24 bg-primary/5 rounded-full blur-2xl animate-pulse delay-700" />

      <Card className="w-full max-w-md animate-in slide-in-from-bottom-4 duration-500 shadow-2xl hover:shadow-3xl transition-all duration-500 border border-primary/20 hover:border-primary/30 backdrop-blur-sm bg-background/95">
        <CardHeader className="text-center space-y-4 pb-8">
          <Link href="/" className="flex items-center justify-center space-x-3 group mb-6">
            <div className="relative h-12 w-12 rounded-xl bg-gradient-to-br from-primary to-secondary flex items-center justify-center group-hover:scale-110 group-hover:rotate-3 transition-all duration-300 shadow-lg">
              <Heart className="h-5 w-5 text-white absolute" />
              <Stethoscope className="h-4 w-4 text-white/80 absolute translate-x-1 translate-y-1" />
            </div>
            <span className="font-sans font-bold text-3xl text-foreground group-hover:text-primary transition-colors duration-300">
              AyuSync
            </span>
          </Link>

          <div className="space-y-2">
            <CardTitle className="text-2xl font-sans font-semibold text-foreground">Welcome back</CardTitle>
            <CardDescription className="text-base text-muted-foreground font-sans">
              Sign in to access your healthcare dashboard
            </CardDescription>
          </div>
        </CardHeader>

        <CardContent className="space-y-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <div className="p-4 rounded-lg bg-destructive/10 border border-destructive/20 text-destructive text-sm animate-in slide-in-from-top-2 font-sans">
                {error}
              </div>
            )}

            <div className="space-y-3">
              <Label htmlFor="email" className="text-sm font-medium font-sans text-foreground">
                Email / ABHA ID
              </Label>
              <Input
                id="email"
                type="email"
                placeholder="Enter your email or ABHA ID"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className={`h-12 transition-all duration-300 focus:ring-2 focus:ring-primary/30 border-2 font-sans ${
                  error
                    ? "border-destructive focus:border-destructive"
                    : "border-border hover:border-primary/50 focus:border-primary"
                }`}
                required
                disabled={isLoading || isGoogleLoading || isAbhaLoading}
              />
            </div>

            <div className="space-y-3">
              <Label htmlFor="password" className="text-sm font-medium font-sans text-foreground">
                Password
              </Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter your password"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  className={`h-12 pr-12 transition-all duration-300 focus:ring-2 focus:ring-primary/30 border-2 font-sans ${
                    error
                      ? "border-destructive focus:border-destructive"
                      : "border-border hover:border-primary/50 focus:border-primary"
                  }`}
                  required
                  disabled={isLoading || isGoogleLoading || isAbhaLoading}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-primary transition-colors duration-200 disabled:opacity-50"
                  disabled={isLoading || isGoogleLoading || isAbhaLoading}
                >
                  {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between pt-2">
              <div className="flex items-center space-x-3">
                <Checkbox
                  id="remember"
                  checked={formData.rememberMe}
                  onCheckedChange={(checked) => setFormData({ ...formData, rememberMe: checked as boolean })}
                  className="border-2 border-primary/30 data-[state=checked]:bg-primary data-[state=checked]:border-primary"
                  disabled={isLoading || isGoogleLoading || isAbhaLoading}
                />
                <Label htmlFor="remember" className="text-sm cursor-pointer font-sans text-muted-foreground">
                  Remember me
                </Label>
              </div>
              <Link
                href="/forgot-password"
                className="text-sm text-primary hover:text-secondary transition-colors duration-200 hover:underline font-sans font-medium"
              >
                Forgot Password?
              </Link>
            </div>

            <Button
              type="submit"
              className="w-full h-12 bg-primary hover:bg-secondary text-primary-foreground font-sans font-semibold hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group relative overflow-hidden"
              disabled={isLoading || isAbhaLoading || isGoogleLoading}
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                  Signing In...
                </>
              ) : (
                <>
                  <span className="relative z-10">Sign In</span>
                  <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/10 to-white/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700" />
                </>
              )}
            </Button>

            <div className="relative my-6">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t border-border" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-background px-3 text-muted-foreground font-sans">Or continue with</span>
              </div>
            </div>

            <Button
              type="button"
              onClick={handleAbhaLogin}
              disabled={isAbhaLoading || isLoading || isGoogleLoading}
              className="w-full h-12 bg-primary hover:bg-secondary text-primary-foreground font-sans font-semibold hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group relative overflow-hidden"
            >
              {isAbhaLoading ? (
                <>
                  <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                  Connecting to ABHA...
                </>
              ) : (
                <>
                  <div className="mr-3 h-5 w-5 bg-white rounded-sm flex items-center justify-center">
                    <span className="text-secondary font-bold text-xs">A</span>
                  </div>
                  <span className="relative z-10">Login with ABHA</span>
                  <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/10 to-white/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700" />
                </>
              )}
            </Button>

            <Button
              type="button"
              variant="outline"
              onClick={handleGoogleLogin}
              disabled={isLoading || isAbhaLoading || isGoogleLoading}
              className="w-full h-12 bg-transparent hover:bg-primary/5 hover:border-primary/50 border-2 transition-all duration-300 font-sans"
            >
              {isGoogleLoading ? (
                <>
                  <Loader2 className="mr-3 h-5 w-5 animate-spin" />
                  Signing in with Google...
                </>
              ) : (
                <>
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
                  Sign in with Google
                </>
              )}
            </Button>
          </form>

          <div className="mt-8 text-center pt-6 border-t border-border">
            <p className="text-sm text-muted-foreground font-sans">
              New to AyuSync?{" "}
              <Link
                href="/signup"
                className="text-primary hover:text-secondary transition-colors duration-200 hover:underline font-semibold"
              >
                Create an account
              </Link>
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}