
"use client";

import React, { useState, useEffect } from 'react';
import { AppShell } from "@/components/layout/app-shell";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Microscope, ClipboardList, FlaskConical, AlertTriangle, CheckCircle2, PlusCircle, Users, RefreshCw, FileText, Edit3, Loader2 } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { toast } from "@/hooks/use-toast";
import { Separator } from '@/components/ui/separator';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose,
} from "@/components/ui/dialog";
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { cn } from "@/lib/utils";

// --- Data Structures ---
interface TestDetail {
  id: string;
  name: string;
  unit: string;
  normalRangeMin?: number;
  normalRangeMax?: number;
  normalRangeDisplay: string; // e.g., "70-110", or "Negative"
  interpretRanges?: { // For more complex, non-linear interpretations or very specific boundaries
    veryLow?: number; // Upper bound for "Very Low"
    low?: number;     // Upper bound for "Low"
    high?: number;    // Lower bound for "High"
    veryHigh?: number;// Lower bound for "Very High"
  };
  isNumeric: boolean;
}

interface ResultInputItem {
  testId: string;
  testName: string;
  value: string;
  unit: string;
  normalRangeDisplay: string;
  interpretation: string;
  isNumeric: boolean;
}

interface LabRequest {
  id: string;
  patientName: string;
  nationalId: string;
  testsRequested: string[]; // Array of test IDs like "glucose_random", "hemoglobin"
  orderingDoctor: string;
  requestDate: string;
  status: "Sample Pending" | "Sample Collected" | "Processing" | "Results Ready" | "Cancelled";
  results?: ResultInputItem[] | string; // Can store structured results or a simple string
}

interface Reagent {
  id: string;
  name: string;
  currentStock: number;
  threshold: number;
  unit: string;
  supplier?: string;
  lastOrdered?: string;
}

// --- Mock Data ---
const MOCK_TEST_DEFINITIONS: Record<string, TestDetail> = {
  "glucose_random": { id: "glucose_random", name: "Glucose, Random", unit: "mg/dL", normalRangeMin: 70, normalRangeMax: 140, normalRangeDisplay: "70-140", isNumeric: true, interpretRanges: { low: 70, high: 140, veryHigh: 200 } },
  "hemoglobin": { id: "hemoglobin", name: "Hemoglobin (Hgb)", unit: "g/dL", normalRangeMin: 12, normalRangeMax: 16, normalRangeDisplay: "12-16 (Female), 14-18 (Male)", isNumeric: true, interpretRanges: { veryLow: 7, low: 10, high: 18 } }, // Example generic range
  "wbc_count": { id: "wbc_count", name: "White Blood Cell Count (WBC)", unit: "x10^9/L", normalRangeMin: 4.0, normalRangeMax: 11.0, normalRangeDisplay: "4.0-11.0", isNumeric: true, interpretRanges: { low: 3.0, high: 12.0, veryHigh: 20.0 } },
  "platelet_count": {id: "platelet_count", name: "Platelet Count", unit: "x10^9/L", normalRangeMin: 150, normalRangeMax: 450, normalRangeDisplay: "150-450", isNumeric: true, interpretRanges: {low: 100, veryLow: 50, high: 500, veryHigh: 600 } },
  "tsh": { id: "tsh", name: "TSH", unit: "mIU/L", normalRangeMin: 0.4, normalRangeMax: 4.0, normalRangeDisplay: "0.4-4.0", isNumeric: true, interpretRanges: { low: 0.1, high: 5.0, veryHigh: 10.0 } },
  "free_t4": { id: "free_t4", name: "Free T4", unit: "ng/dL", normalRangeMin: 0.8, normalRangeMax: 1.8, normalRangeDisplay: "0.8-1.8", isNumeric: true, interpretRanges: { low: 0.6, high: 2.0 } },
  "creatinine_serum": { id: "creatinine_serum", name: "Creatinine, Serum", unit: "mg/dL", normalRangeMin: 0.6, normalRangeMax: 1.2, normalRangeDisplay: "0.6-1.2", isNumeric: true, interpretRanges: { high: 1.5, veryHigh: 2.5 } },
  "sodium": { id: "sodium", name: "Sodium (Na)", unit: "mEq/L", normalRangeMin: 135, normalRangeMax: 145, normalRangeDisplay: "135-145", isNumeric: true, interpretRanges: {low: 130, veryLow: 125, high: 150, veryHigh: 155}},
  "potassium": { id: "potassium", name: "Potassium (K)", unit: "mEq/L", normalRangeMin: 3.5, normalRangeMax: 5.0, normalRangeDisplay: "3.5-5.0", isNumeric: true, interpretRanges: {low: 3.0, veryLow: 2.5, high: 5.5, veryHigh: 6.0}},
  "cholesterol_total": { id: "cholesterol_total", name: "Cholesterol, Total", unit: "mg/dL", normalRangeMax: 200, normalRangeDisplay: "<200 Desirable", isNumeric: true, interpretRanges: { high: 200, veryHigh: 240 } },
  "hiv_screen": { id: "hiv_screen", name: "HIV 1/2 Antibody/Antigen Screen", unit: "", normalRangeDisplay: "Non-Reactive", isNumeric: false},
  "urinalysis_re": { id: "urinalysis_re", name: "Urinalysis, Routine & Microscopy", unit: "", normalRangeDisplay: "Refer to report", isNumeric: false},
};


const initialLabRequests: LabRequest[] = [
    { id: "LR001", patientName: "Alice Wonderland", nationalId: "NID001", testsRequested: ["hemoglobin", "glucose_random", "urinalysis_re"], orderingDoctor: "Dr. Smith", requestDate: "2024-07-30", status: "Sample Pending" },
    { id: "LR002", patientName: "Bob The Builder", nationalId: "NID002", testsRequested: ["wbc_count", "platelet_count", "creatinine_serum"], orderingDoctor: "Dr. Jones", requestDate: "2024-07-30", status: "Processing" },
    { id: "LR003", patientName: "Charlie Brown", nationalId: "NID003", testsRequested: ["tsh", "free_t4"], orderingDoctor: "Dr. Eve", requestDate: "2024-07-29", status: "Results Ready", results: [{testId: "tsh", testName:"TSH", value: "2.5", unit: "mIU/L", normalRangeDisplay: "0.4-4.0", interpretation: "Normal", isNumeric:true}, {testId: "free_t4", testName:"Free T4", value:"1.2", unit:"ng/dL", normalRangeDisplay: "0.8-1.8", interpretation: "Normal", isNumeric:true}]},
];

const initialReagents: Reagent[] = [
    { id: "RG001", name: "Hematology Reagent Pack", currentStock: 50, threshold: 20, unit: "packs" },
    { id: "RG002", name: "Glucose Test Strips", currentStock: 150, threshold: 100, unit: "strips (box of 50)" },
    { id: "RG003", name: "Microscope Slides", currentStock: 80, threshold: 50, unit: "boxes (100/box)" },
    { id: "RG004", name: "Saline Solution", currentStock: 5, threshold: 10, unit: "liters" },
];

export default function LaboratoryManagementPage() {
  const [labRequests, setLabRequests] = useState<LabRequest[]>([]);
  const [isLoadingLabRequests, setIsLoadingLabRequests] = useState(true);
  const [reagents, setReagents] = useState<Reagent[]>([]);
  const [isLoadingReagents, setIsLoadingReagents] = useState(true);

  const [selectedRequestForResults, setSelectedRequestForResults] = useState<LabRequest | null>(null);
  const [currentResultInputs, setCurrentResultInputs] = useState<ResultInputItem[]>([]);
  const [isResultModalOpen, setIsResultModalOpen] = useState(false);
  const [isSavingResults, setIsSavingResults] = useState(false);
  
  const [isReorderingReagentId, setIsReorderingReagentId] = useState<string | null>(null);
  const [isRefreshingList, setIsRefreshingList] = useState(false);

  const [clientTime, setClientTime] = useState<Date | null>(null);

  useEffect(() => {
    // This effect runs only on the client, after the component mounts
    setClientTime(new Date()); // Set the initial time

    const timerId = setInterval(() => {
      setClientTime(new Date()); // Update the time every minute
    }, 60000);

    return () => {
      clearInterval(timerId); // Cleanup interval on component unmount
    };
  }, []); // Empty dependency array means this effect runs once on mount and cleans up on unmount


  useEffect(() => {
    setIsLoadingLabRequests(true);
    // Simulate API call: GET /api/v1/lab/requests
    setTimeout(() => {
      setLabRequests(initialLabRequests);
      setIsLoadingLabRequests(false);
    }, 1200);

    setIsLoadingReagents(true);
    // Simulate API call: GET /api/v1/lab/reagents
    setTimeout(() => {
      setReagents(initialReagents);
      setIsLoadingReagents(false);
    }, 1500);
  }, []);
  
  const fetchLabRequests = async () => {
    setIsRefreshingList(true);
    // Simulate API Call: GET /api/v1/lab/requests
    await new Promise(resolve => setTimeout(resolve, 1000));
    setLabRequests([...initialLabRequests].sort(() => 0.5 - Math.random())); 
    toast({ title: "Lab Request List Refreshed", description: "List updated with latest requests (mock)." });
    setIsRefreshingList(false);
  };

  const samplesProcessedToday = labRequests.filter(r => r.status === "Results Ready").length;
  const pendingResults = labRequests.filter(r => r.status === "Processing" || r.status === "Sample Collected").length;
  const criticalReagentAlerts = reagents.filter(r => r.currentStock < r.threshold).length;

  const handleUpdateStatus = async (requestId: string, newStatus: LabRequest["status"]) => {
    // Simulate API Call: PUT /api/v1/lab/requests/{requestId}/status
    await new Promise(resolve => setTimeout(resolve, 500));
    setLabRequests(prev => prev.map(req => req.id === requestId ? { ...req, status: newStatus } : req));
    toast({ title: "Status Updated", description: `Request ${requestId} status changed to ${newStatus}.` });
  };

  const interpretNumericResult = (valueStr: string, testDef: TestDetail): string => {
    if (!testDef.isNumeric || valueStr === "") return "N/A";
    const value = parseFloat(valueStr);
    if (isNaN(value)) return "Invalid Input";

    const { normalRangeMin, normalRangeMax, interpretRanges } = testDef;

    if (interpretRanges) {
        if (interpretRanges.veryLow !== undefined && value < interpretRanges.veryLow) return "Very Low";
        if (interpretRanges.low !== undefined && value < (interpretRanges.low ?? normalRangeMin ?? -Infinity)) return "Low";
        if (interpretRanges.veryHigh !== undefined && value > interpretRanges.veryHigh) return "Very High";
        if (interpretRanges.high !== undefined && value > (interpretRanges.high ?? normalRangeMax ?? Infinity)) return "High";
    } else { // Fallback to simple range if interpretRanges not fully defined
        if (normalRangeMin !== undefined && value < normalRangeMin) return "Low";
        if (normalRangeMax !== undefined && value > normalRangeMax) return "High";
    }
    return "Normal";
  };

  const handleOpenResultModal = (request: LabRequest) => {
    setSelectedRequestForResults(request);
    const initialInputs: ResultInputItem[] = request.testsRequested.map(testIdOrName => {
      const testDef = MOCK_TEST_DEFINITIONS[testIdOrName] || 
                      Object.values(MOCK_TEST_DEFINITIONS).find(def => def.name === testIdOrName);
      
      let existingResultValue = "";
      let existingInterpretation = "N/A";

      if (Array.isArray(request.results)) {
        const foundResult = request.results.find(r => r.testId === testIdOrName || r.testName === testIdOrName);
        if (foundResult) {
            existingResultValue = foundResult.value;
            existingInterpretation = foundResult.interpretation;
        }
      } else if (typeof request.results === 'string' && !testDef) {
        existingResultValue = request.results; // For general text area fallback
      }


      if (testDef) {
        return {
          testId: testDef.id,
          testName: testDef.name,
          value: existingResultValue,
          unit: testDef.unit,
          normalRangeDisplay: testDef.normalRangeDisplay,
          interpretation: existingResultValue && testDef.isNumeric ? interpretNumericResult(existingResultValue, testDef) : existingInterpretation,
          isNumeric: testDef.isNumeric,
        };
      }
      // Fallback for tests not in definitions (e.g. "Lipid Profile" which is a panel)
      return {
        testId: testIdOrName,
        testName: testIdOrName,
        value: existingResultValue,
        unit: "",
        normalRangeDisplay: "N/A",
        interpretation: "N/A",
        isNumeric: false, // Assume false if not defined
      };
    });
    setCurrentResultInputs(initialInputs);
    setIsResultModalOpen(true);
  };
  
  const handleResultInputChange = (index: number, newValue: string) => {
    setCurrentResultInputs(prevInputs => 
      prevInputs.map((input, i) => {
        if (i === index) {
          const testDef = MOCK_TEST_DEFINITIONS[input.testId];
          const interpretation = testDef && testDef.isNumeric 
            ? interpretNumericResult(newValue, testDef) 
            : "N/A";
          return { ...input, value: newValue, interpretation };
        }
        return input;
      })
    );
  };

  const handleSaveResults = async () => {
    if (!selectedRequestForResults) return;
    setIsSavingResults(true);
    // Simulate API Call: POST /api/v1/lab/requests/{selectedRequestForResults.id}/results
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    setLabRequests(prevReqs => prevReqs.map(req => 
      req.id === selectedRequestForResults.id 
        ? { ...req, results: currentResultInputs, status: "Results Ready" as LabRequest["status"] } 
        : req
    ));
    toast({ title: "Results Saved (Mock)", description: `Results for ${selectedRequestForResults.patientName} saved and (mock) sent to consultation.` });
    setIsResultModalOpen(false);
    setSelectedRequestForResults(null);
    setCurrentResultInputs([]);
    setIsSavingResults(false);
  };
  
  const handleReorderReagent = async (reagent: Reagent) => {
      setIsReorderingReagentId(reagent.id);
      // Simulate API Call: POST /api/v1/lab/reagents/requisition
      await new Promise(resolve => setTimeout(resolve, 1500));
      toast({title: "Reagent Reorder (Mock)", description: `Reorder request placed for ${reagent.name}.`});
      setIsReorderingReagentId(null);
  }

  return (
    <AppShell>
      <div className="flex flex-col gap-6">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold tracking-tight flex items-center gap-2">
            <Microscope className="h-8 w-8" /> Laboratory Information & Management
          </h1>
           <div className="text-sm text-muted-foreground">
            {clientTime ? (
              `${clientTime.toLocaleDateString(undefined, { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })} ${clientTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`
            ) : (
              "\u00A0" // Non-breaking space as placeholder
            )}
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          <Card className="lg:col-span-2 shadow-sm">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <ClipboardList className="h-6 w-6 text-primary" /> Incoming Lab Requests
              </CardTitle>
              <CardDescription>Manage and process pending laboratory test requests.</CardDescription>
            </CardHeader>
            <CardContent>
              {isLoadingLabRequests ? (
                 <div className="flex items-center justify-center py-10">
                    <Loader2 className="h-8 w-8 animate-spin text-primary" />
                    <p className="ml-2 text-muted-foreground">Loading lab requests...</p>
                  </div>
              ) : labRequests.length > 0 ? (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Patient</TableHead>
                      <TableHead>Tests</TableHead>
                      <TableHead>Doctor</TableHead>
                      <TableHead>Date</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {labRequests.map((req) => (
                      <TableRow key={req.id}>
                        <TableCell className="font-medium">
                          {req.patientName} <br/> 
                          <span className="text-xs text-muted-foreground">{req.nationalId}</span>
                        </TableCell>
                        <TableCell className="text-xs">
                          {req.testsRequested.map(testId => MOCK_TEST_DEFINITIONS[testId]?.name || testId).join(', ')}
                        </TableCell>
                        <TableCell>{req.orderingDoctor}</TableCell>
                        <TableCell>{new Date(req.requestDate).toLocaleDateString()}</TableCell>
                        <TableCell>
                          <Select 
                              value={req.status} 
                              onValueChange={(value) => handleUpdateStatus(req.id, value as LabRequest["status"])}
                          >
                              <SelectTrigger className="h-8 text-xs w-[150px]">
                                  <SelectValue placeholder="Update Status" />
                              </SelectTrigger>
                              <SelectContent>
                                  <SelectItem value="Sample Pending">Sample Pending</SelectItem>
                                  <SelectItem value="Sample Collected">Sample Collected</SelectItem>
                                  <SelectItem value="Processing">Processing</SelectItem>
                                  <SelectItem value="Results Ready">Results Ready</SelectItem>
                                  <SelectItem value="Cancelled">Cancelled</SelectItem>
                              </SelectContent>
                          </Select>
                        </TableCell>
                        <TableCell className="text-right">
                          <Button size="sm" variant="outline" onClick={() => handleOpenResultModal(req)} disabled={isSavingResults}>
                            <Edit3 className="mr-1 h-3 w-3" /> {req.status === "Results Ready" ? "View/Edit" : "Enter"} Results
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              ) : (
                <p className="text-center py-10 text-muted-foreground">No lab requests found.</p>
              )}
            </CardContent>
             <CardFooter>
                <Button variant="outline" onClick={fetchLabRequests} disabled={isRefreshingList || isLoadingLabRequests}>
                    {isRefreshingList ? <Loader2 className="mr-2 h-4 w-4 animate-spin"/> : <RefreshCw className="mr-2 h-4 w-4"/>}
                    {isRefreshingList ? "Refreshing..." : "Refresh Request List"}
                </Button>
            </CardFooter>
          </Card>

          <div className="space-y-6">
            <Card className="shadow-sm">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    <FileText className="h-6 w-6 text-primary"/> Daily Lab Report
                </CardTitle>
                 <CardDescription>Summary of today's lab activities.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
               {isLoadingLabRequests || isLoadingReagents ? (
                 <div className="flex items-center justify-center py-4">
                    <Loader2 className="h-5 w-5 animate-spin text-primary mr-2"/> Loading summary...
                  </div>
               ) : (
                <>
                  <div className="flex justify-between items-center p-3 bg-muted/50 rounded-md">
                      <span className="text-sm font-medium">Samples Processed:</span>
                      <Badge variant="secondary" className="text-base">{samplesProcessedToday}</Badge>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-muted/50 rounded-md">
                      <span className="text-sm font-medium">Pending Results:</span>
                      <Badge className="text-base">{pendingResults}</Badge>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-muted/50 rounded-md">
                      <span className="text-sm font-medium">Critical Reagent Alerts:</span>
                      <Badge variant={criticalReagentAlerts > 0 ? "destructive" : "default"} className="text-base">{criticalReagentAlerts}</Badge>
                  </div>
                  <Button className="w-full mt-2" variant="outline" disabled>View Full Daily Report</Button>
                </>
               )}
              </CardContent>
            </Card>

            <Card className="shadow-sm">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FlaskConical className="h-6 w-6 text-primary" /> Reagent Inventory
                </CardTitle>
                <CardDescription>Overview of lab reagent stock levels.</CardDescription>
              </CardHeader>
              <CardContent className="max-h-[300px] overflow-y-auto pr-1">
                {isLoadingReagents ? (
                  <div className="flex items-center justify-center py-6">
                      <Loader2 className="h-6 w-6 animate-spin text-primary mr-2"/> Loading reagents...
                  </div>
                ) : reagents.length > 0 ? (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Reagent Name</TableHead>
                        <TableHead>Stock</TableHead>
                        <TableHead className="text-right">Action</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {reagents.map((item) => {
                        const isLowStock = item.currentStock < item.threshold;
                        return (
                          <TableRow key={item.id} className={isLowStock ? "bg-destructive/10 dark:bg-destructive/20" : ""}>
                            <TableCell className="font-medium">{item.name}</TableCell>
                            <TableCell>
                              {item.currentStock} <span className="text-xs text-muted-foreground">({item.unit})</span>
                              {isLowStock && <Badge variant="destructive" className="ml-2 text-xs">Low</Badge>}
                            </TableCell>
                            <TableCell className="text-right">
                              {isLowStock && (
                                <Button 
                                  size="sm" 
                                  variant="outline" 
                                  onClick={() => handleReorderReagent(item)}
                                  disabled={isReorderingReagentId === item.id}
                                >
                                  {isReorderingReagentId === item.id ? <Loader2 className="mr-1 h-3 w-3 animate-spin"/> : <RefreshCw className="mr-1 h-3 w-3"/>}
                                  {isReorderingReagentId === item.id ? "Ordering..." : "Re-order"}
                                </Button>
                              )}
                            </TableCell>
                          </TableRow>
                        );
                      })}
                    </TableBody>
                  </Table>
                ) : (
                   <p className="text-center py-6 text-muted-foreground">No reagent data available.</p>
                )}
              </CardContent>
               <CardFooter className="pt-4">
                 <Alert variant="default" className="border-primary/50">
                    <AlertTriangle className="h-4 w-4 text-primary" />
                    <AlertTitle className="text-sm">System Note</AlertTitle>
                    <AlertDescription className="text-xs">
                        Automated reagent requisition from central stores is a backend process.
                    </AlertDescription>
                </Alert>
               </CardFooter>
            </Card>
          </div>
        </div>

        {/* Result Entry Modal */}
        <Dialog open={isResultModalOpen} onOpenChange={setIsResultModalOpen}>
            <DialogContent className="sm:max-w-2xl"> {/* Increased width */}
                <DialogHeader>
                    <DialogTitle>Enter/Edit Lab Results for {selectedRequestForResults?.patientName}</DialogTitle>
                    <DialogDescription>
                        Request ID: {selectedRequestForResults?.id} | Tests: {selectedRequestForResults?.testsRequested.map(testId => MOCK_TEST_DEFINITIONS[testId]?.name || testId).join(", ")}
                    </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4 max-h-[60vh] overflow-y-auto pr-2">
                    {currentResultInputs.map((inputItem, index) => (
                        <div key={inputItem.testId || index} className="p-3 border rounded-md space-y-2 bg-muted/20">
                            <Label htmlFor={`result-${inputItem.testId}`} className="font-semibold">{inputItem.testName}</Label>
                            {inputItem.isNumeric ? (
                                <div className="grid grid-cols-1 sm:grid-cols-[1fr_auto_1fr_auto] gap-2 items-center">
                                    <Input
                                        id={`result-${inputItem.testId}`}
                                        type="number"
                                        step="any"
                                        value={inputItem.value}
                                        onChange={(e) => handleResultInputChange(index, e.target.value)}
                                        placeholder="Enter result"
                                        className="sm:col-span-1"
                                        disabled={isSavingResults}
                                    />
                                    <span className="text-xs text-muted-foreground sm:col-span-1">{inputItem.unit}</span>
                                    <span className="text-xs text-muted-foreground sm:col-span-1">
                                        Range: {inputItem.normalRangeDisplay}
                                    </span>
                                     <Badge 
                                        variant={
                                            inputItem.interpretation === "Normal" ? "default" : 
                                            inputItem.interpretation === "N/A" || inputItem.interpretation === "Invalid Input" ? "outline" :
                                            "secondary" // For Low, High, Very Low, Very High
                                        }
                                        className={cn("text-xs sm:col-span-1 justify-center", {
                                            "bg-green-100 text-green-800 dark:bg-green-800/30 dark:text-green-300": inputItem.interpretation === "Normal",
                                            "bg-yellow-100 text-yellow-800 dark:bg-yellow-800/30 dark:text-yellow-300": inputItem.interpretation === "Low" || inputItem.interpretation === "High",
                                            "bg-red-100 text-red-800 dark:bg-red-800/30 dark:text-red-300": inputItem.interpretation === "Very Low" || inputItem.interpretation === "Very High",
                                        })}
                                    >
                                        {inputItem.interpretation}
                                    </Badge>
                                </div>
                            ) : (
                                <Textarea
                                    id={`result-${inputItem.testId}`}
                                    value={inputItem.value}
                                    onChange={(e) => handleResultInputChange(index, e.target.value)}
                                    placeholder="Enter qualitative results, comments, or panel summary..."
                                    className="min-h-[60px]"
                                    disabled={isSavingResults}
                                />
                            )}
                        </div>
                    ))}
                    <Separator className="my-3"/>
                    <div className="space-y-2">
                        <Label htmlFor="labTechComments">Overall Lab Technician Comments (Optional)</Label>
                        <Textarea
                        id="labTechComments"
                        placeholder="Any comments on sample quality, overall findings, etc."
                        className="min-h-[80px]"
                        disabled={isSavingResults}
                        />
                    </div>
                </div>
                <DialogFooter>
                <DialogClose asChild><Button type="button" variant="outline" disabled={isSavingResults}>Cancel</Button></DialogClose>
                <Button type="button" onClick={handleSaveResults} disabled={isSavingResults}>
                    {isSavingResults ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                    {isSavingResults ? "Saving..." : "Save Results"}
                </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>

      </div>
    </AppShell>
  );
}


    