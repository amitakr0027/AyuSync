// app/lab/page.tsx — Frontend-only CRUD demo 
"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { RefreshCw, Search, TestTube2, Activity, Plus, Edit3, Trash2 } from "lucide-react";

type DemoObs = {
  id: string;
  testName: string;
  loincCode: string; // http://loinc.org
  value?: string;
  unit?: string; // UCUM
  status: "registered" | "preliminary" | "final" | "amended" | "corrected" | "cancelled" | "entered-in-error" | "unknown";
  date: string; // YYYY-MM-DD
  category: "laboratory" | "vital-signs" | "imaging" | "survey" | "exam" | "therapy" | "activity";
  encounter?: string;
  patient?: string;
};

const DEMO_LABS_INITIAL: DemoObs[] = [
  { id: "o1", testName: "Hemoglobin A1c", loincCode: "4548-4", value: "6.2", unit: "%", status: "final", date: "2025-09-08", category: "laboratory", encounter: "Encounter/2001", patient: "Priya Sharma" },
  { id: "o2", testName: "Fasting plasma glucose", loincCode: "1558-6", value: "112", unit: "mg/dL", status: "final", date: "2025-09-07", category: "laboratory", encounter: "Encounter/2002", patient: "Rajesh Kumar" },
  { id: "o3", testName: "Lipid panel: LDL Cholesterol", loincCode: "13457-7", value: "128", unit: "mg/dL", status: "final", date: "2025-09-06", category: "laboratory", encounter: "Encounter/2003", patient: "Anita Patel" },
  { id: "o4", testName: "Complete blood count (WBC)", loincCode: "6690-2", value: "7.8", unit: "10^3/uL", status: "final", date: "2025-09-05", category: "laboratory", patient: "Rajesh Kumar" },
  { id: "o5", testName: "Serum creatinine", loincCode: "2160-0", value: "0.9", unit: "mg/dL", status: "final", date: "2025-09-04", category: "laboratory", patient: "Priya Sharma" },
  { id: "o6", testName: "Systolic blood pressure", loincCode: "8480-6", value: "132", unit: "mm[Hg]", status: "preliminary", date: "2025-09-03", category: "vital-signs", encounter: "Encounter/2010", patient: "Rajesh Kumar" },
  { id: "o7", testName: "Diastolic blood pressure", loincCode: "8462-4", value: "86", unit: "mm[Hg]", status: "preliminary", date: "2025-09-03", category: "vital-signs", encounter: "Encounter/2010", patient: "Rajesh Kumar" },
  { id: "o8", testName: "Body mass index (BMI)", loincCode: "39156-5", value: "27.4", unit: "kg/m2", status: "final", date: "2025-09-01", category: "vital-signs", patient: "Anita Patel" },
];

export default function LabDemoPage() {
  const [rows, setRows] = useState<DemoObs[]>(DEMO_LABS_INITIAL);
  const [q, setQ] = useState("");
  const [category, setCategory] = useState<"all" | "laboratory" | "vital-signs">("all");
  const [status, setStatus] = useState<"all" | "final" | "preliminary">("all");
  const [modal, setModal] = useState<null | { mode: "add" | "edit"; row?: DemoObs }>(null);

  const filtered = useMemo(() => {
    const s = q.toLowerCase();
    return rows.filter((o) => {
      const matchText = `${o.testName} ${o.loincCode} ${o.value ?? ""} ${o.unit ?? ""} ${o.patient ?? ""}`.toLowerCase().includes(s);
      const matchCat = category === "all" ? true : o.category === category;
      const matchStatus = status === "all" ? true : o.status === status;
      return matchText && matchCat && matchStatus;
    });
  }, [rows, q, category, status]);

  return (
    <div className="p-4 md:p-6 space-y-4">
      <Card>
        <CardHeader className="flex items-center justify-between">
          <div>
            <CardTitle>Lab Results & Observations</CardTitle>
            <CardDescription>LOINC-coded results with UCUM units (demo)</CardDescription>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={() => setRows((prev) => [...prev])}>
              <RefreshCw className="h-4 w-4 mr-2" />
              Refresh
            </Button>
            <Button onClick={() => setModal({ mode: "add" })}>
              <Plus className="h-4 w-4 mr-2" />
              Add Result
            </Button>
          </div>
        </CardHeader>

        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-2 mb-3">
            <div className="flex items-center gap-2 md:col-span-2">
              <Search className="h-4 w-4 text-muted-foreground" />
              <Input placeholder="Search test, code, value, patient…" value={q} onChange={(e) => setQ(e.target.value)} />
            </div>
            <select className="border rounded p-2 text-sm" value={category} onChange={(e) => setCategory(e.target.value as any)}>
              <option value="all">All categories</option>
              <option value="laboratory">Laboratory</option>
              <option value="vital-signs">Vital signs</option>
            </select>
            <select className="border rounded p-2 text-sm" value={status} onChange={(e) => setStatus(e.target.value as any)}>
              <option value="all">All status</option>
              <option value="final">final</option>
              <option value="preliminary">preliminary</option>
            </select>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-sm border">
              <thead className="bg-gray-50">
                <tr>
                  <th className="p-2 text-left">Test</th>
                  <th className="p-2 text-left">LOINC</th>
                  <th className="p-2 text-left">Value</th>
                  <th className="p-2 text-left">Status</th>
                  <th className="p-2 text-left">Date</th>
                  <th className="p-2 text-left">Category</th>
                  <th className="p-2 text-left">Encounter</th>
                  <th className="p-2 text-left">Patient</th>
                  <th className="p-2 text-left">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((o) => (
                  <tr key={o.id} className="border-t">
                    <td className="p-2">
                      <div className="font-medium">{o.testName}</div>
                    </td>
                    <td className="p-2">
                      <div className="text-sm">{o.loincCode}</div>
                      <div className="text-xs text-muted-foreground">http://loinc.org</div>
                    </td>
                    <td className="p-2">{o.value ? `${o.value} ${o.unit ?? ""}` : "-"}</td>
                    <td className="p-2">
                      <Badge variant={o.status === "final" ? "secondary" : "outline"}>{o.status}</Badge>
                    </td>
                    <td className="p-2">{o.date}</td>
                    <td className="p-2">
                      <div className="flex items-center gap-1">
                        {o.category === "laboratory" ? <TestTube2 className="h-4 w-4" /> : <Activity className="h-4 w-4" />}
                        <span>{o.category}</span>
                      </div>
                    </td>
                    <td className="p-2">{o.encounter ?? "-"}</td>
                    <td className="p-2">{o.patient ?? "-"}</td>
                    <td className="p-2">
                      <div className="flex gap-2">
                        <Button size="sm" variant="outline" onClick={() => setModal({ mode: "edit", row: o })}>
                          <Edit3 className="h-4 w-4" />
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => {
                            const ok = confirm("Delete this result?");
                            if (!ok) return;
                            setRows((prev) => prev.filter((r) => r.id !== o.id));
                          }}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
                {filtered.length === 0 && (
                  <tr>
                    <td colSpan={9} className="p-4 text-center text-muted-foreground">
                      No results match your filters
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {modal && (
        <LabModal
          mode={modal.mode}
          initial={modal.row}
          onClose={() => setModal(null)}
          onSave={(payload) => {
            if (modal.mode === "add") {
              const id = `o${Math.floor(Math.random() * 100000)}`;
              setRows((prev) => [{ ...payload, id }, ...prev]);
            } else {
              setRows((prev) => prev.map((r) => (r.id === payload.id ? payload : r)));
            }
            setModal(null);
          }}
        />
      )}
    </div>
  );
}

function LabModal({
  mode,
  initial,
  onClose,
  onSave,
}: {
  mode: "add" | "edit";
  initial?: DemoObs;
  onClose: () => void;
  onSave: (payload: DemoObs) => void;
}) {
  const [testName, setTestName] = useState<string>(initial?.testName ?? "");
  const [loincCode, setLoincCode] = useState<string>(initial?.loincCode ?? "");
  const [value, setValue] = useState<string>(initial?.value ?? "");
  const [unit, setUnit] = useState<string>(initial?.unit ?? "");
  const [status, setStatus] = useState<DemoObs["status"]>(initial?.status ?? "final");
  const [date, setDate] = useState<string>(initial?.date ?? new Date().toISOString().slice(0, 10));
  const [category, setCategory] = useState<DemoObs["category"]>(initial?.category ?? "laboratory");
  const [encounter, setEncounter] = useState<string>(initial?.encounter ?? "");
  const [patient, setPatient] = useState<string>(initial?.patient ?? "");

  const searchRef = useRef<HTMLInputElement>(null);
  useEffect(() => {
    searchRef.current?.focus();
  }, []);

  // Simple inline LOINC suggestions (static)
  const [loincQuery, setLoincQuery] = useState("");
  const loincSuggestions = useMemo(() => {
    const s = loincQuery.toLowerCase().trim();
    const pool = Array.from(new Set([loincCode, "4548-4", "1558-6", "13457-7", "6690-2", "2160-0", "8480-6", "8462-4", "39156-5"].filter(Boolean)));
    if (!s) return pool;
    return pool.filter((code) => code.toLowerCase().includes(s));
  }, [loincQuery, loincCode]);

  function handleSave() {
    if (!testName.trim()) return alert("Enter test name");
    if (!loincCode.trim()) return alert("Enter LOINC code");
    if (!date.trim()) return alert("Pick date");
    const payload: DemoObs = {
      id: initial?.id ?? "",
      testName: testName.trim(),
      loincCode: loincCode.trim(),
      value: value.trim() || undefined,
      unit: unit.trim() || undefined,
      status,
      date,
      category,
      encounter: encounter.trim() || undefined,
      patient: patient.trim() || undefined,
    };
    onSave(payload);
  }

  return (
    <div className="fixed inset-0 bg-black/40 grid place-items-center z-50">
      <div className="bg-white rounded-lg w-[960px] max-w-[95vw] p-5 space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="font-semibold">{mode === "add" ? "Add Result" : "Edit Result"}</h3>
          <Button variant="ghost" onClick={onClose}>Close</Button>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-3">
            <div>
              <label className="block text-xs text-muted-foreground mb-1">Test name</label>
              <Input ref={searchRef} placeholder="e.g., Hemoglobin A1c" value={testName} onChange={(e) => setTestName(e.target.value)} />
            </div>

            <div>
              <label className="block text-xs text-muted-foreground mb-1">LOINC code (http://loinc.org)</label>
              <div className="flex gap-2">
                <Input placeholder="e.g., 4548-4" value={loincCode} onChange={(e) => setLoincCode(e.target.value)} />
                <Input className="w-48" placeholder="Search LOINC…" value={loincQuery} onChange={(e) => setLoincQuery(e.target.value)} />
              </div>
              {loincSuggestions.length > 0 && (
                <div className="mt-2 border rounded max-h-40 overflow-auto">
                  {loincSuggestions.map((c) => (
                    <div key={c} className="p-2 text-sm cursor-pointer hover:bg-gray-50" onClick={() => setLoincCode(c)}>
                      {c}
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="block text-xs text-muted-foreground mb-1">Value</label>
                <Input placeholder="e.g., 6.2" value={value} onChange={(e) => setValue(e.target.value)} />
              </div>
              <div>
                <label className="block text-xs text-muted-foreground mb-1">Unit (UCUM)</label>
                <Input placeholder="e.g., %, mg/dL, mm[Hg]" value={unit} onChange={(e) => setUnit(e.target.value)} />
              </div>
            </div>
          </div>

          <div className="space-y-3">
            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="block text-xs text-muted-foreground mb-1">Status</label>
                <select className="w-full border rounded p-2 text-sm" value={status} onChange={(e) => setStatus(e.target.value as DemoObs["status"])}>
                  <option value="final">final</option>
                  <option value="preliminary">preliminary</option>
                  <option value="registered">registered</option>
                  <option value="amended">amended</option>
                  <option value="corrected">corrected</option>
                  <option value="cancelled">cancelled</option>
                  <option value="entered-in-error">entered-in-error</option>
                  <option value="unknown">unknown</option>
                </select>
              </div>
              <div>
                <label className="block text-xs text-muted-foreground mb-1">Date</label>
                <Input type="date" value={date} onChange={(e) => setDate(e.target.value)} />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="block text-xs text-muted-foreground mb-1">Category</label>
                <select className="w-full border rounded p-2 text-sm" value={category} onChange={(e) => setCategory(e.target.value as DemoObs["category"])}>
                  <option value="laboratory">laboratory</option>
                  <option value="vital-signs">vital-signs</option>
                  <option value="imaging">imaging</option>
                  <option value="survey">survey</option>
                  <option value="exam">exam</option>
                  <option value="therapy">therapy</option>
                  <option value="activity">activity</option>
                </select>
              </div>
              <div>
                <label className="block text-xs text-muted-foreground mb-1">Encounter (optional)</label>
                <Input placeholder="Encounter/123" value={encounter} onChange={(e) => setEncounter(e.target.value)} />
              </div>
            </div>

            <div>
              <label className="block text-xs text-muted-foreground mb-1">Patient (optional)</label>
              <Input placeholder="e.g., Rajesh Kumar" value={patient} onChange={(e) => setPatient(e.target.value)} />
            </div>

            <div className="p-2 border rounded bg-muted/30 text-xs">
              <div className="font-medium mb-1">Preview</div>
              <div>
                <Badge variant="outline" className="mr-2">LOINC: {loincCode || "-"}</Badge>
                <Badge variant="outline" className="mr-2">Value: {value || "-"} {unit || ""}</Badge>
                <Badge variant="secondary" className="mr-2">{status}</Badge>
                <Badge variant="secondary">{category}</Badge>
              </div>
            </div>

            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={onClose}>Cancel</Button>
              <Button
                onClick={() => {
                  const payload: DemoObs = {
                    id: initial?.id ?? "",
                    testName: testName.trim(),
                    loincCode: loincCode.trim(),
                    value: value.trim() || undefined,
                    unit: unit.trim() || undefined,
                    status,
                    date,
                    category,
                    encounter: encounter.trim() || undefined,
                    patient: patient.trim() || undefined,
                  };
                  if (!payload.testName) return alert("Enter test name");
                  if (!payload.loincCode) return alert("Enter LOINC code");
                  if (!payload.date) return alert("Pick date");
                  onSave(payload);
                }}
              >
                {mode === "add" ? "Save" : "Update"}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
