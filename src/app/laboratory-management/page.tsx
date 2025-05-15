
"use client";

import React, { useState, useEffect } from 'react';
import { AppShell } from "@/components/layout/app-shell";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Microscope, ClipboardList, FlaskConical, AlertTriangle, CheckCircle2, PlusCircle, Users, RefreshCw, FileText, Edit3 } from "lucide-react";
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


interface LabRequest {
  id: string;
  patientName: string;
  nationalId: string;
  testsRequested: string[];
  orderingDoctor: string;
  requestDate: string;
  status: "Sample Pending" | "Sample Collected" | "Processing" | "Results Ready" | "Cancelled";
  results?: string; // To store entered results
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

export default function LaboratoryManagementPage() {
  const [labRequests, setLabRequests] = useState<LabRequest[]>([
    { id: "LR001", patientName: "Alice Wonderland", nationalId: "NID001", testsRequested: ["CBC", "Lipid Profile"], orderingDoctor: "Dr. Smith", requestDate: "2024-07-30", status: "Sample Pending" },
    { id: "LR002", patientName: "Bob The Builder", nationalId: "NID002", testsRequested: ["Urinalysis", "Glucose"], orderingDoctor: "Dr. Jones", requestDate: "2024-07-30", status: "Processing" },
    { id: "LR003", patientName: "Charlie Brown", nationalId: "NID003", testsRequested: ["TSH", "Free T4"], orderingDoctor: "Dr. Eve", requestDate: "2024-07-29", status: "Results Ready", results:"TSH: 2.5 mIU/L, Free T4: 1.2 ng/dL. Normal." },
  ]);

  const [reagents, setReagents] = useState<Reagent[]>([
    { id: "RG001", name: "Hematology Reagent Pack", currentStock: 50, threshold: 20, unit: "packs" },
    { id: "RG002", name: "Glucose Test Strips", currentStock: 150, threshold: 100, unit: "strips (box of 50)" },
    { id: "RG003", name: "Microscope Slides", currentStock: 80, threshold: 50, unit: "boxes (100/box)" },
    { id: "RG004", name: "Saline Solution", currentStock: 5, threshold: 10, unit: "liters" },
  ]);

  const [selectedRequest, setSelectedRequest] = useState<LabRequest | null>(null);
  const [resultInput, setResultInput] = useState("");
  const [isResultModalOpen, setIsResultModalOpen] = useState(false);

  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 60000);
    return () => clearInterval(timer);
  }, []);

  const samplesProcessedToday = labRequests.filter(r => r.status === "Results Ready").length;
  const pendingResults = labRequests.filter(r => r.status === "Processing" || r.status === "Sample Collected").length;
  const criticalReagentAlerts = reagents.filter(r => r.currentStock < r.threshold).length;

  const handleUpdateStatus = (requestId: string, newStatus: LabRequest["status"]) => {
    setLabRequests(prev => prev.map(req => req.id === requestId ? { ...req, status: newStatus } : req));
    toast({ title: "Status Updated", description: `Request ${requestId} status changed to ${newStatus}.` });
  };

  const handleOpenResultModal = (request: LabRequest) => {
    setSelectedRequest(request);
    setResultInput(request.results || "");
    setIsResultModalOpen(true);
  };

  const handleSaveResults = () => {
    if (selectedRequest) {
      setLabRequests(prev => prev.map(req => 
        req.id === selectedRequest.id ? { ...req, results: resultInput, status: "Results Ready" } : req
      ));
      toast({ title: "Results Saved", description: `Results for ${selectedRequest.patientName} (ID: ${selectedRequest.id}) saved.` });
      setIsResultModalOpen(false);
      setSelectedRequest(null);
      setResultInput("");
    }
  };
  
  const handleReorderReagent = (reagentName: string) => {
      toast({title: "Reagent Reorder (Mock)", description: `Reorder request placed for ${reagentName}.`});
  }

  return (
    <AppShell>
      <div className="flex flex-col gap-6">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold tracking-tight flex items-center gap-2">
            <Microscope className="h-8 w-8" /> Laboratory Information & Management
          </h1>
           <div className="text-sm text-muted-foreground">
            {time.toLocaleDateString(undefined, { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })} {time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
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
                      <TableCell className="text-xs">{req.testsRequested.join(', ')}</TableCell>
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
                        <Button size="sm" variant="outline" onClick={() => handleOpenResultModal(req)}>
                          <Edit3 className="mr-1 h-3 w-3" /> {req.status === "Results Ready" ? "View/Edit" : "Enter"} Results
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
              {labRequests.length === 0 && <p className="text-center py-4 text-muted-foreground">No lab requests found.</p>}
            </CardContent>
             <CardFooter>
                <Button variant="outline">
                    <RefreshCw className="mr-2 h-4 w-4"/> Refresh Request List
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
                              <Button size="sm" variant="outline" onClick={() => handleReorderReagent(item.name)}>
                                <RefreshCw className="mr-1 h-3 w-3"/> Re-order
                              </Button>
                            )}
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
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
          <DialogContent className="sm:max-w-lg">
            <DialogHeader>
              <DialogTitle>Enter/Edit Lab Results for {selectedRequest?.patientName}</DialogTitle>
              <DialogDescription>
                Request ID: {selectedRequest?.id} | Tests: {selectedRequest?.testsRequested.join(", ")}
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="resultInput">Lab Results</Label>
                <Textarea
                  id="resultInput"
                  value={resultInput}
                  onChange={(e) => setResultInput(e.target.value)}
                  placeholder="Enter detailed lab results here..."
                  className="min-h-[200px]"
                />
              </div>
               <div className="space-y-2">
                <Label htmlFor="labTechComments">Lab Technician Comments (Optional)</Label>
                <Textarea
                  id="labTechComments"
                  placeholder="Any comments on sample quality, specific findings, etc."
                  className="min-h-[80px]"
                />
              </div>
            </div>
            <DialogFooter>
              <DialogClose asChild><Button type="button" variant="outline">Cancel</Button></DialogClose>
              <Button type="button" onClick={handleSaveResults}>Save Results</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

      </div>
    </AppShell>
  );
}
