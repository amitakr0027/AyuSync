"use client"

import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

export default function ProfilePage() {
  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-bold">👤 Profile Settings</h1>
      <p className="text-muted-foreground">
        Manage your personal and professional information.
      </p>

      <Card>
        <CardHeader>
          <CardTitle>Basic Information</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center gap-4">
            <Avatar className="h-16 w-16">
              <AvatarImage src="/user.png" alt="Profile" />
              <AvatarFallback>U</AvatarFallback>
            </Avatar>
            <Button variant="outline">Upload New Photo</Button>
          </div>
          <div>
            <Label>Full Name</Label>
            <Input placeholder="Enter your name" />
          </div>
          <div>
            <Label>Email</Label>
            <Input placeholder="doctor@example.com" type="email" />
          </div>
          <div>
            <Label>Phone</Label>
            <Input placeholder="+91 9876543210" type="tel" />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Professional Details</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label>Specialization</Label>
            <Input placeholder="Ayurveda / Biomedicine / Unani" />
          </div>
          <div>
            <Label>License / Registration No.</Label>
            <Input placeholder="AYUSH12345" />
          </div>
          <div>
            <Label>ABHA ID</Label>
            <Input placeholder="ABHA-XXXXXXXXXX" />
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-end">
        <Button className="px-6">Save Changes</Button>
      </div>
    </div>
  )
}
