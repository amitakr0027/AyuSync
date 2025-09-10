"use client"

import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

export default function PreferencesPage() {
  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-bold">⚙️ Preferences</h1>
      <p className="text-muted-foreground">
        Customize your experience and default settings.
      </p>

      <Card>
        <CardHeader>
          <CardTitle>Language & Terminology</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label>Default Language</Label>
            <Select>
              <SelectTrigger>
                <SelectValue placeholder="Select language" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="en">English</SelectItem>
                <SelectItem value="hi">Hindi</SelectItem>
                <SelectItem value="ta">Tamil</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="flex items-center justify-between">
            <Label>Enable Dual Coding (NAMASTE + ICD-11)</Label>
            <Switch />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>System Preferences</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <Label>Dark Mode</Label>
            <Switch />
          </div>
          <div>
            <Label>Default Landing Page</Label>
            <Select>
              <SelectTrigger>
                <SelectValue placeholder="Choose page" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="dashboard">Dashboard</SelectItem>
                <SelectItem value="patients">Patients</SelectItem>
                <SelectItem value="appointments">Appointments</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label>Date/Time Format</Label>
            <Select>
              <SelectTrigger>
                <SelectValue placeholder="Choose format" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ddmmyyyy">DD/MM/YYYY</SelectItem>
                <SelectItem value="mmddyyyy">MM/DD/YYYY</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
