"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function PatientPage() {
  return (
    <div className="min-h-screen bg-background py-12 px-6">
      <h1 className="text-3xl font-bold text-center mb-8">Patient Dashboard</h1>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle>Medical Records</CardTitle>
          </CardHeader>
          <CardContent>
            <p>View and manage your health history securely.</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Appointments</CardTitle>
          </CardHeader>
          <CardContent>
            <p>Book, view, and track your doctor appointments.</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Prescriptions</CardTitle>
          </CardHeader>
          <CardContent>
            <p>Access prescriptions given by your healthcare providers.</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Reports</CardTitle>
          </CardHeader>
          <CardContent>
            <p>Download lab reports and diagnostic test results.</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
