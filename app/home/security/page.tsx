"use client"

import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"

export default function SecurityPage() {
  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-bold">🔒 Security</h1>
      <p className="text-muted-foreground">
        Manage authentication, access, and privacy settings.
      </p>

      <Card>
        <CardHeader>
          <CardTitle>Authentication</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label>Change Password</Label>
            <Input type="password" placeholder="New password" />
          </div>
          <div className="flex items-center justify-between">
            <Label>Enable Two-Factor Authentication</Label>
            <Switch />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Access Control</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label>Current Role</Label>
            <Input value="Doctor" disabled />
          </div>
          <div className="flex items-center justify-between">
            <Label>Emergency Override Access</Label>
            <Switch />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Audit & Activity</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          <p className="text-sm text-muted-foreground">Last login: Sept 10, 2025, from New Delhi</p>
          <p className="text-sm text-muted-foreground">Failed login attempt: 2 days ago</p>
        </CardContent>
      </Card>

      <div className="flex justify-end">
        <Button className="px-6">Save Security Settings</Button>
      </div>
    </div>
  )
}
