
"use client";

import React, { useState, useEffect } from 'react';
import { AppShell } from "@/components/layout/app-shell";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { MonitorPlay, ClipboardList, ScanSearch, AlertTriangle, CheckCircle2, PlusCircle, Users, RefreshCw, FileText, Edit3, Loader2 } from "lucide-react";
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

interface ImagingRequest {
  id: string;
  patientName: string;
  nationalId: string;
  studyRequested: string;
  orderingDoctor: string;
  requestDate: string;
  status: "Scheduled" | "Pending Scan" | "Scan Complete - Awaiting Report" | "Report Ready" | "Cancelled";
  report?: string; 
  impression?: string;
}

const initialImagingRequests: ImagingRequest[] = [
  { id: "IMG001", patientName: "Eva Green", nationalId: "NID004", studyRequested: "Chest X-Ray (PA View)", orderingDoctor: "Dr. Smith", requestDate: "2024-07-30", status: "Scheduled" },
  { id: "IMG002", patientName: "Tom Hanks", nationalId: "NID005", studyRequested: "MRI Brain with Contrast", orderingDoctor: "Dr. Jones", requestDate: "2024-07-30", status: "Scan Complete - Awaiting Report" },
  { id: "IMG003", patientName: "Lucy Liu", nationalId: "NID006", studyRequested: "Ultrasound Abdomen", orderingDoctor: "Dr. Eve", requestDate: "2024-07-29", status: "Report Ready", report:"Liver and spleen appear normal. No focal lesions identified. Gallbladder is unremarkable.", impression: "Normal abdominal ultrasound." },
];

export default function ImagingManagementPage() {
  const [imagingRequests, setImagingRequests] = useState<ImagingRequest[]>([]);
  const [isLoadingImagingRequests, setIsLoadingImagingRequests] = useState(true);

  const [selectedRequest, setSelectedRequest] = useState<ImagingRequest | null>(null);
  const [reportInput, setReportInput] = useState("");
  const [impressionInput, setImpressionInput] = useState("");
  const [isReportModalOpen, setIsReportModalOpen] = useState(false);
  const [isSavingReport, setIsSavingReport] = useState(false);
  const [isRefreshingList, setIsRefreshingList] = useState(false);
  
  const [clientTime, setClientTime] = useState<Date | null>(null);

  useEffect(() => {
    setClientTime(new Date());
    const timer = setInterval(() => setClientTime(new Date()), 60000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    setIsLoadingImagingRequests(true);
    setTimeout(() => {
      setImagingRequests(initialImagingRequests);
      setIsLoadingImagingRequests(false);
    }, 1000);
  }, []);

  const fetchImagingRequests = async () => {
    setIsRefreshingList(true);
    setIsLoadingImagingRequests(true);
    await new Promise(resolve => setTimeout(resolve, 1000));
    setImagingRequests([...initialImagingRequests].sort(() => 0.5 - Math.random())); // Mock refresh
    toast({ title: "Imaging Request List Refreshed", description: "List updated with latest requests (mock)." });
    setIsLoadingImagingRequests(false);
    setIsRefreshingList(false);
  };

  const scansPerformedToday = imagingRequests.filter(r => r.status === "Report Ready" || r.status === "Scan Complete - Awaiting Report").length;
  const pendingReports = imagingRequests.filter(r => r.status === "Scan Complete - Awaiting Report").length;

  const handleUpdateStatus = async (requestId: string, newStatus: ImagingRequest["status"]) => {
    // Simulate API call: PUT /api/v1/imaging/requests/{requestId}/status
    await new Promise(resolve => setTimeout(resolve, 500));
    setImagingRequests(prev => prev.map(req => req.id === requestId ? { ...req, status: newStatus } : req));
    toast({ title: "Status Updated", description: `Request ${requestId} status changed to ${newStatus}.` });
  };

  const handleOpenReportModal = (request: ImagingRequest) => {
    setSelectedRequest(request);
    setReportInput(request.report || "");
    setImpressionInput(request.impression || "");
    setIsReportModalOpen(true);
  };

  const handleSaveReport = async () => {
    if (selectedRequest) {
      setIsSavingReport(true);
      const payload = {
        reportContent: reportInput,
        impression: impressionInput
      };
      console.log("Saving report (mock):", payload);
      // Simulate API call: POST /api/v1/imaging/requests/{selectedRequest.id}/report
      await new Promise(resolve => setTimeout(resolve, 1500));
      setImagingRequests(prev => prev.map(req => 
        req.id === selectedRequest.id ? { ...req, report: reportInput, impression: impressionInput, status: "Report Ready" } : req
      ));
      toast({ title: "Report Saved (Mock)", description: `Report for ${selectedRequest.patientName} (ID: ${selectedRequest.id}) saved.` });
      setIsReportModalOpen(false);
      setSelectedRequest(null);
      setReportInput("");
      setImpressionInput("");
      setIsSavingReport(false);
    }
  };
  
  return (
    <AppShell>
      <div className="flex flex-col gap-6">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold tracking-tight flex items-center gap-2">
            <MonitorPlay className="h-8 w-8" /> Imaging & Radiology Management
          </h1>
           <div className="text-sm text-muted-foreground">
            {clientTime ? (
              `${clientTime.toLocaleDateString(undefined, { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })} ${clientTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`
            ) : (
              "\u00A0" 
            )}
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          <Card className="lg:col-span-2 shadow-sm">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <ClipboardList className="h-6 w-6 text-primary" /> Incoming Imaging Requests
              </CardTitle>
              <CardDescription>Manage and process pending imaging study requests.</CardDescription>
            </CardHeader>
            <CardContent>
              {isLoadingImagingRequests ? (
                <div className="flex items-center justify-center py-10">
                  <Loader2 className="h-8 w-8 animate-spin text-primary" />
                  <p className="ml-2 text-muted-foreground">Loading imaging requests...</p>
                </div>
              ) : imagingRequests.length > 0 ? (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Patient</TableHead>
                      <TableHead>Study Requested</TableHead>
                      <TableHead>Doctor</TableHead>
                      <TableHead>Date</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {imagingRequests.map((req) => (
                      <TableRow key={req.id}>
                        <TableCell className="font-medium">
                          {req.patientName} <br/> 
                          <span className="text-xs text-muted-foreground">{req.nationalId}</span>
                        </TableCell>
                        <TableCell className="text-xs">{req.studyRequested}</TableCell>
                        <TableCell>{req.orderingDoctor}</TableCell>
                        <TableCell>{new Date(req.requestDate + 'T00:00:00').toLocaleDateString()}</TableCell>
                        <TableCell>
                          <Select 
                              value={req.status} 
                              onValueChange={(value) => handleUpdateStatus(req.id, value as ImagingRequest["status"])}
                          >
                              <SelectTrigger className="h-8 text-xs w-[180px]">
                                  <SelectValue placeholder="Update Status" />
                              </SelectTrigger>
                              <SelectContent>
                                  <SelectItem value="Scheduled">Scheduled</SelectItem>
                                  <SelectItem value="Pending Scan">Pending Scan</SelectItem>
                                  <SelectItem value="Scan Complete - Awaiting Report">Scan Complete - Awaiting Report</SelectItem>
                                  <SelectItem value="Report Ready">Report Ready</SelectItem>
                                  <SelectItem value="Cancelled">Cancelled</SelectItem>
                              </SelectContent>
                          </Select>
                        </TableCell>
                        <TableCell className="text-right">
                          <Button size="sm" variant="outline" onClick={() => handleOpenReportModal(req)} disabled={isSavingReport}>
                            <Edit3 className="mr-1 h-3 w-3" /> {req.status === "Report Ready" ? "View/Edit" : "Enter"} Report
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              ) : (
                <p className="text-center py-10 text-muted-foreground">No imaging requests found.</p>
              )}
            </CardContent>
             <CardFooter>
                <Button variant="outline" onClick={fetchImagingRequests} disabled={isRefreshingList || isLoadingImagingRequests}>
                    {isRefreshingList ? <Loader2 className="mr-2 h-4 w-4 animate-spin"/> : <RefreshCw className="mr-2 h-4 w-4"/>}
                    {isRefreshingList ? "Refreshing..." : "Refresh Request List"}
                </Button>
            </CardFooter>
          </Card>

          <div className="space-y-6">
            <Card className="shadow-sm">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    <FileText className="h-6 w-6 text-primary"/> Daily Imaging Summary
                </CardTitle>
                 <CardDescription>Summary of today's imaging activities.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                {isLoadingImagingRequests ? (
                   <div className="flex items-center justify-center py-4">
                    <Loader2 className="h-5 w-5 animate-spin text-primary mr-2"/> Loading summary...
                  </div>
                ) : (
                <>
                  <div className="flex justify-between items-center p-3 bg-muted/50 rounded-md">
                      <span className="text-sm font-medium">Scans Performed:</span>
                      <Badge variant="secondary" className="text-base">{scansPerformedToday}</Badge>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-muted/50 rounded-md">
                      <span className="text-sm font-medium">Pending Reports:</span>
                      <Badge className="text-base">{pendingReports}</Badge>
                  </div>
                  <Button className="w-full mt-2" variant="outline" disabled>View Full Daily Report</Button>
                </>
                )}
              </CardContent>
            </Card>

            <Card className="shadow-sm">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <ScanSearch className="h-6 w-6 text-primary" /> Equipment Status
                </CardTitle>
                <CardDescription>Overview of imaging equipment.</CardDescription>
              </CardHeader>
              <CardContent>
                <Alert variant="default" className="border-primary/50">
                    <AlertTriangle className="h-4 w-4 text-primary" />
                    <AlertTitle className="text-sm">System Note</AlertTitle>
                    <AlertDescription className="text-xs">
                        Equipment status, maintenance schedules, and fault reporting will be managed by the Biomedical Engineering module. This module is planned for future development.
                    </AlertDescription>
                </Alert>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Report Entry Modal */}
        <Dialog open={isReportModalOpen} onOpenChange={setIsReportModalOpen}>
          <DialogContent className="sm:max-w-lg">
            <DialogHeader>
              <DialogTitle>Enter/Edit Imaging Report for {selectedRequest?.patientName}</DialogTitle>
              <DialogDescription>
                Request ID: {selectedRequest?.id} | Study: {selectedRequest?.studyRequested}
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="reportInput">Radiologist's Report</Label>
                <Textarea
                  id="reportInput"
                  value={reportInput}
                  onChange={(e) => setReportInput(e.target.value)}
                  placeholder="Enter detailed imaging report here. Include findings, impressions, and conclusions."
                  className="min-h-[250px]"
                  disabled={isSavingReport}
                />
              </div>
               <div className="space-y-2">
                <Label htmlFor="impressionInput">Key Findings / Impression (Optional)</Label>
                <Textarea
                  id="impressionInput"
                  value={impressionInput}
                  onChange={(e) => setImpressionInput(e.target.value)}
                  placeholder="Summarize key findings or clinical impression."
                  className="min-h-[80px]"
                  disabled={isSavingReport}
                />
              </div>
            </div>
            <DialogFooter>
              <DialogClose asChild><Button type="button" variant="outline" disabled={isSavingReport}>Cancel</Button></DialogClose>
              <Button type="button" onClick={handleSaveReport} disabled={isSavingReport}>
                {isSavingReport ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                {isSavingReport ? "Saving..." : "Save Report"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

      </div>
    </AppShell>
  );
}

    