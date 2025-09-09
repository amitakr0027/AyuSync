// app/problems/page.tsx — Frontend-only CRUD with Autocomplete + Automap 
"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Plus, RefreshCw, Search, Edit3, Trash2, Link2 } from "lucide-react";

type Coding = { system: string; code: string; display?: string; version?: string };
type DemoCondition = {
  id: string;
  display: string;
  namaste?: Coding;
  icd11?: Coding;
  clinical: "active" | "inactive" | "resolved" | "remission" | "recurrence" | "relapse" | "unknown";
  verification: "provisional" | "differential" | "confirmed" | "refuted" | "entered-in-error" | "unconfirmed";
  encounter?: string;
};

const SYS_NAMASTE = "https://ayusync.org/fhir/CodeSystem/namaste";
const SYS_ICD11 = "http://id.who.int/icd/release/11/mms";
const SYS_ICD11_TM2 = "http://id.who.int/icd/entity";

// Demo master suggestions (autocomplete)
const NAMASTE_SUGGEST = [
  { system: SYS_NAMASTE, code: "VAT.DIG.001", display: "Vata Dosha Imbalance" },
  { system: SYS_NAMASTE, code: "VAT.DIG.010", display: "Grahani Vikara" },
  { system: SYS_NAMASTE, code: "PIT.SKN.002", display: "Kustha (minor)" },
  { system: SYS_NAMASTE, code: "KAP.RES.004", display: "Pratishyaya" },
  { system: SYS_NAMASTE, code: "MAD.MET.001", display: "Madhumeha" },
  { system: SYS_NAMASTE, code: "RAK.CIR.003", display: "Rakta Vridhi" },
] satisfies Coding[];

const ICD11_SUGGEST = [
  { system: SYS_ICD11_TM2, code: "TM2.A01.1Z", display: "Traditional medicine disorder (unspecified)", version: "2025-01" },
  { system: SYS_ICD11, code: "K59.1", display: "Functional diarrhea", version: "2025-01" },
  { system: SYS_ICD11, code: "L20.9", display: "Atopic dermatitis, unspecified", version: "2025-01" },
  { system: SYS_ICD11, code: "CA20.0", display: "Acute sinusitis", version: "2025-01" },
  { system: SYS_ICD11, code: "5A11", display: "Type 2 diabetes mellitus", version: "2025-01" },
  { system: SYS_ICD11, code: "BA00", display: "Hypertension", version: "2025-01" },
] satisfies Coding[];

// Automap dictionary (NAMASTE -> ICD-11 guess)
const AUTO_MAP: Record<string, Coding> = {
  "VAT.DIG.001": { system: SYS_ICD11_TM2, code: "TM2.A01.1Z", display: "Traditional medicine disorder (unspecified)", version: "2025-01" },
  "VAT.DIG.010": { system: SYS_ICD11, code: "K59.1", display: "Functional diarrhea", version: "2025-01" },
  "PIT.SKN.002": { system: SYS_ICD11, code: "L20.9", display: "Atopic dermatitis, unspecified", version: "2025-01" },
  "KAP.RES.004": { system: SYS_ICD11, code: "CA20.0", display: "Acute sinusitis", version: "2025-01" },
  "MAD.MET.001": { system: SYS_ICD11, code: "5A11", display: "Type 2 diabetes mellitus", version: "2025-01" },
  "RAK.CIR.003": { system: SYS_ICD11, code: "BA00", display: "Hypertension", version: "2025-01" },
};

// Demo dataset (initial)
const DEMO: DemoCondition[] = [
  {
    id: "c1",
    display: "Vata Imbalance with Digestive Issues",
    namaste: NAMASTE_SUGGEST,
    icd11: AUTO_MAP["VAT.DIG.001"],
    clinical: "active",
    verification: "confirmed",
    encounter: "Encounter/1001",
  },
  {
    id: "c2",
    display: "Functional bowel disorder",
    namaste: NAMASTE_SUGGEST[17],
    icd11: AUTO_MAP["VAT.DIG.010"],
    clinical: "active",
    verification: "provisional",
    encounter: "Encounter/1002",
  },
  {
    id: "c3",
    display: "Pitta-related skin rash",
    namaste: NAMASTE_SUGGEST[18],
    icd11: AUTO_MAP["PIT.SKN.002"],
    clinical: "recurrence",
    verification: "confirmed",
  },
  {
    id: "c4",
    display: "Kapha-dominant sinusitis",
    namaste: NAMASTE_SUGGEST[19],
    icd11: AUTO_MAP["KAP.RES.004"],
    clinical: "inactive",
    verification: "confirmed",
  },
  {
    id: "c5",
    display: "Type 2 diabetes (Madhumeha)",
    namaste: NAMASTE_SUGGEST[20],
    icd11: AUTO_MAP["MAD.MET.001"],
    clinical: "active",
    verification: "confirmed",
  },
  {
    id: "c6",
    display: "Hypertension (Rakta Vridhi)",
    namaste: NAMASTE_SUGGEST[21],
    icd11: AUTO_MAP["RAK.CIR.003"],
    clinical: "resolved",
    verification: "confirmed",
  },
];

export default function ProblemsDemoPage() {
  const [rows, setRows] = useState<DemoCondition[]>(DEMO);
  const [q, setQ] = useState("");
  const [modal, setModal] = useState<null | { mode: "add" | "edit"; row?: DemoCondition }>(null);

  const filtered = useMemo(() => {
    const s = q.trim().toLowerCase();
    if (!s) return rows;
    return rows.filter((c) => {
      const hay = `${c.display} ${c.namaste?.code ?? ""} ${c.namaste?.display ?? ""} ${c.icd11?.code ?? ""} ${c.icd11?.display ?? ""} ${c.clinical} ${c.verification}`.toLowerCase();
      return hay.includes(s);
    });
  }, [rows, q]);

  return (
    <div className="p-4 md:p-6 space-y-4">
      <Card>
        <CardHeader className="flex items-center justify-between">
          <div>
            <CardTitle>Problem List</CardTitle>
            <CardDescription>Dual-coded (NAMASTE + ICD‑11) demo without backend</CardDescription>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={() => setRows((r) => [...r])}>
              <RefreshCw className="h-4 w-4 mr-2" />
              Refresh
            </Button>
            <Button onClick={() => setModal({ mode: "add" })}>
              <Plus className="h-4 w-4 mr-2" />
              Add Problem
            </Button>
          </div>
        </CardHeader>

        <CardContent>
          <div className="flex items-center gap-2 mb-3">
            <Search className="h-4 w-4 text-muted-foreground" />
            <Input placeholder="Filter problems…" value={q} onChange={(e) => setQ(e.target.value)} />
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-sm border">
              <thead className="bg-gray-50">
                <tr>
                  <th className="p-2 text-left">Display</th>
                  <th className="p-2 text-left">NAMASTE</th>
                  <th className="p-2 text-left">ICD‑11</th>
                  <th className="p-2 text-left">Clinical</th>
                  <th className="p-2 text-left">Verified</th>
                  <th className="p-2 text-left">Encounter</th>
                  <th className="p-2 text-left">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((c) => (
                  <tr key={c.id} className="border-t">
                    <td className="p-2">{c.display}</td>
                    <td className="p-2">
                      {c.namaste ? (
                        <div>
                          <div className="font-medium">{c.namaste.display}</div>
                          <div className="text-xs text-muted-foreground">{c.namaste.code}</div>
                        </div>
                      ) : (
                        "-"
                      )}
                    </td>
                    <td className="p-2">
                      {c.icd11 ? (
                        <div>
                          <div className="font-medium">{c.icd11.display}</div>
                          <div className="text-xs text-muted-foreground">
                            {c.icd11.code} {c.icd11.version ? `• ${c.icd11.version}` : ""}
                          </div>
                        </div>
                      ) : (
                        "-"
                      )}
                    </td>
                    <td className="p-2">
                      <Badge variant="outline">{c.clinical}</Badge>
                    </td>
                    <td className="p-2">
                      <Badge variant="secondary">{c.verification}</Badge>
                    </td>
                    <td className="p-2">{c.encounter || "-"}</td>
                    <td className="p-2">
                      <div className="flex gap-2">
                        <Button size="sm" variant="outline" onClick={() => setModal({ mode: "edit", row: c })}>
                          <Edit3 className="h-4 w-4" />
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => {
                            const ok = confirm("Delete this problem?");
                            if (!ok) return;
                            setRows((prev) => prev.filter((r) => r.id !== c.id));
                          }}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                        <Button size="sm" variant="ghost" onClick={() => alert("Demo: link labs as evidence")}>
                          <Link2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}

                {filtered.length === 0 && (
                  <tr>
                    <td colSpan={7} className="p-4 text-center text-muted-foreground">
                      No problems match your search
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {modal && (
        <ProblemModal
          mode={modal.mode}
          initial={modal.row}
          onClose={() => setModal(null)}
          onSave={(payload) => {
            if (modal.mode === "add") {
              const id = `c${Math.floor(Math.random() * 100000)}`;
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

function ProblemModal({
  mode,
  initial,
  onClose,
  onSave,
}: {
  mode: "add" | "edit";
  initial?: DemoCondition;
  onClose: () => void;
  onSave: (payload: DemoCondition) => void;
}) {
  const [display, setDisplay] = useState<string>(initial?.display ?? "");
  const [clinical, setClinical] = useState<DemoCondition["clinical"]>(initial?.clinical ?? "active");
  const [verification, setVerification] = useState<DemoCondition["verification"]>(initial?.verification ?? "confirmed");
  const [encounter, setEncounter] = useState<string>(initial?.encounter ?? "");

  const [search, setSearch] = useState("");
  const [namaste, setNamaste] = useState<Coding | undefined>(initial?.namaste);
  const [icd11, setIcd11] = useState<Coding | undefined>(initial?.icd11);

  const searchBoxRef = useRef<HTMLInputElement>(null);
  useEffect(() => {
    searchBoxRef.current?.focus();
  }, []);

  const filteredNAMASTE = useMemo(() => {
    const s = search.toLowerCase().trim();
    if (!s) return NAMASTE_SUGGEST;
    return NAMASTE_SUGGEST.filter((x) => `${x.code} ${x.display}`.toLowerCase().includes(s));
  }, [search]);

  const filteredICD11 = useMemo(() => {
    const s = search.toLowerCase().trim();
    if (!s) return ICD11_SUGGEST;
    return ICD11_SUGGEST.filter((x) => `${x.code} ${x.display}`.toLowerCase().includes(s));
  }, [search]);

  function autoMap() {
    if (!namaste) {
      alert("Select a NAMASTE term first");
      return;
    }
    const mapped = AUTO_MAP[namaste.code];
    if (mapped) setIcd11(mapped);
    else alert("No automap found in demo");
  }

  function handleSave() {
    if (!display.trim()) return alert("Enter Display (problem name)");
    if (!namaste || !icd11) return alert("Pick both NAMASTE and ICD‑11");
    const payload: DemoCondition = {
      id: initial?.id ?? "",
      display: display.trim(),
      namaste,
      icd11,
      clinical,
      verification,
      encounter: encounter.trim() || undefined,
    };
    onSave(payload);
  }

  return (
    <div className="fixed inset-0 bg-black/40 grid place-items-center z-50">
      <div className="bg-white rounded-lg w-[960px] max-w-[95vw] p-5 space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="font-semibold">{mode === "add" ? "Add Problem" : "Edit Problem"}</h3>
          <Button variant="ghost" onClick={onClose}>Close</Button>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-xs text-muted-foreground mb-1">Search terms (shows NAMASTE + ICD‑11)</label>
            <div className="flex gap-2">
              <Input ref={searchBoxRef} placeholder="Type to search…" value={search} onChange={(e) => setSearch(e.target.value)} />
              <Button variant="outline" onClick={autoMap}>Auto‑map</Button>
            </div>

            <div className="grid grid-cols-2 gap-3 mt-3">
              <div>
                <div className="text-xs mb-1">NAMASTE</div>
                <div className="border rounded max-h-56 overflow-auto">
                  {filteredNAMASTE.map((s) => (
                    <div
                      key={`nam-${s.code}`}
                      className={`p-2 text-sm cursor-pointer ${namaste?.code === s.code ? "bg-blue-50" : ""}`}
                      onClick={() => {
                        setNamaste(s);
                        // If ICD not selected yet, try automap
                        if (!icd11 && AUTO_MAP[s.code]) setIcd11(AUTO_MAP[s.code]);
                      }}
                    >
                      {s.code} — {s.display}
                    </div>
                  ))}
                </div>
              </div>
              <div>
                <div className="text-xs mb-1">ICD‑11</div>
                <div className="border rounded max-h-56 overflow-auto">
                  {filteredICD11.map((s) => (
                    <div
                      key={`icd-${s.code}`}
                      className={`p-2 text-sm cursor-pointer ${icd11?.code === s.code ? "bg-green-50" : ""}`}
                      onClick={() => setIcd11(s)}
                    >
                      {s.code} — {s.display} {s.version ? `• ${s.version}` : ""}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-3">
            <div>
              <label className="block text-xs text-muted-foreground mb-1">Display (problem name)</label>
              <Input placeholder="e.g., Functional bowel disorder" value={display} onChange={(e) => setDisplay(e.target.value)} />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs text-muted-foreground mb-1">Clinical Status</label>
                <select className="w-full border rounded p-2 text-sm" value={clinical} onChange={(e) => setClinical(e.target.value as any)}>
                  <option value="active">active</option>
                  <option value="recurrence">recurrence</option>
                  <option value="relapse">relapse</option>
                  <option value="inactive">inactive</option>
                  <option value="remission">remission</option>
                  <option value="resolved">resolved</option>
                  <option value="unknown">unknown</option>
                </select>
              </div>
              <div>
                <label className="block text-xs text-muted-foreground mb-1">Verification Status</label>
                <select className="w-full border rounded p-2 text-sm" value={verification} onChange={(e) => setVerification(e.target.value as any)}>
                  <option value="provisional">provisional</option>
                  <option value="differential">differential</option>
                  <option value="confirmed">confirmed</option>
                  <option value="refuted">refuted</option>
                  <option value="entered-in-error">entered-in-error</option>
                  <option value="unconfirmed">unconfirmed</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-xs text-muted-foreground mb-1">Encounter (optional)</label>
              <Input placeholder="Encounter/123" value={encounter} onChange={(e) => setEncounter(e.target.value)} />
            </div>

            <div className="p-2 border rounded bg-muted/30 text-xs">
              <div className="font-medium mb-1">Preview</div>
              <div>
                <Badge variant="outline" className="mr-2">{namaste ? `NAMASTE: ${namaste.code}` : "NAMASTE: -"}</Badge>
                <Badge variant="outline" className="mr-2">{icd11 ? `ICD‑11: ${icd11.code}` : "ICD‑11: -"}</Badge>
                <Badge variant="secondary" className="mr-2">{clinical}</Badge>
                <Badge variant="secondary">{verification}</Badge>
              </div>
            </div>

            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={onClose}>Cancel</Button>
              <Button onClick={handleSave}>{mode === "add" ? "Save" : "Update"}</Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
