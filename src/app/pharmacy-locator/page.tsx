
"use client";

import React, { useState, useEffect } from 'react';
import { AppShell } from "@/components/layout/app-shell";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Pill, ClipboardList, AlertTriangle, CheckCircle2, PackageCheck, FileText, RefreshCw, BellDot } from "lucide-react";
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

interface Prescription {
  id: string;
  patientName: string;
  medication: string;
  quantity: number;
  doctor: string;
  status: "Waiting" | "Dispensed" | "Partial";
}

interface StockItem {
  id: string;
  name: string;
  currentStock: number;
  threshold: number;
  unit: string;
}

export default function DrugDispensingPage() {
  const [prescriptions, setPrescriptions] = useState<Prescription[]>([
    { id: "RX001", patientName: "Alice Wonderland", medication: "Amoxicillin 250mg", quantity: 20, doctor: "Dr. Smith", status: "Waiting" },
    { id: "RX002", patientName: "Bob The Builder", medication: "Paracetamol 500mg", quantity: 30, doctor: "Dr. Jones", status: "Waiting" },
    { id: "RX003", patientName: "Charlie Brown", medication: "Atorvastatin 10mg", quantity: 60, doctor: "Dr. Eve", status: "Dispensed" },
    { id: "RX004", patientName: "Diana Prince", medication: "Lisinopril 5mg", quantity: 30, doctor: "Dr. Smith", status: "Waiting" },
  ]);

  const [stockLevels, setStockLevels] = useState<StockItem[]>([
    { id: "MED001", name: "Amoxicillin 250mg", currentStock: 50, threshold: 100, unit: "capsules" },
    { id: "MED002", name: "Paracetamol 500mg", currentStock: 200, threshold: 150, unit: "tablets" },
    { id: "MED003", name: "Atorvastatin 10mg", currentStock: 150, threshold: 50, unit: "tablets" },
    { id: "MED004", name: "Lisinopril 5mg", currentStock: 25, threshold: 30, unit: "tablets" },
    { id: "MED005", name: "Salbutamol Inhaler", currentStock: 10, threshold: 20, unit: "inhalers" },
  ]);

  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 60000);
    return () => clearInterval(timer);
  }, []);

  const handleDispense = (id: string) => {
    setPrescriptions(prev =>
      prev.map(p => (p.id === id ? { ...p, status: "Dispensed" } : p))
    );
    const patient = prescriptions.find(p=>p.id === id);
    toast({
      title: "Medication Dispensed",
      description: `${patient?.medication} dispensed to ${patient?.patientName}.`,
    });
  };

  const handleNotifyLowStock = (item: StockItem) => {
    toast({
      variant: "default",
      title: "Low Stock Notification Sent",
      description: `Alert for ${item.name} (Stock: ${item.currentStock} ${item.unit}) sent to main warehouse & relevant personnel.`,
    });
    // In a real app, this would trigger backend notifications
  };
  
  const dispensedToday = prescriptions.filter(p => p.status === "Dispensed").length;
  const pendingToday = prescriptions.filter(p => p.status === "Waiting").length;
  const lowStockItems = stockLevels.filter(item => item.currentStock < item.threshold).length;

  return (
    <AppShell>
      <div className="flex flex-col gap-6">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold tracking-tight flex items-center gap-2">
            <Pill className="h-8 w-8" /> Drug Dispensing Pharmacy
          </h1>
          <div className="text-sm text-muted-foreground">
            {time.toLocaleDateString(undefined, { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })} {time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          <Card className="lg:col-span-2 shadow-sm">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <ClipboardList className="h-6 w-6 text-primary" /> Pending Prescriptions
              </CardTitle>
              <CardDescription>Manage and dispense medications for patients.</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Patient Name</TableHead>
                    <TableHead>Medication</TableHead>
                    <TableHead>Qty</TableHead>
                    <TableHead>Doctor</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Action</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {prescriptions.map((rx) => (
                    <TableRow key={rx.id} className={rx.status === 'Dispensed' ? 'opacity-60' : ''}>
                      <TableCell className="font-medium">{rx.patientName}</TableCell>
                      <TableCell>{rx.medication}</TableCell>
                      <TableCell>{rx.quantity}</TableCell>
                      <TableCell>{rx.doctor}</TableCell>
                      <TableCell>
                        <Badge variant={rx.status === "Dispensed" ? "secondary" : rx.status === "Waiting" ? "default" : "outline"}>
                          {rx.status}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        {rx.status === "Waiting" ? (
                          <Button size="sm" onClick={() => handleDispense(rx.id)}>
                            <PackageCheck className="mr-2 h-4 w-4" /> Dispense
                          </Button>
                        ) : (
                           <Button size="sm" variant="outline" disabled>
                            <CheckCircle2 className="mr-2 h-4 w-4" /> Dispensed
                          </Button>
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
               {pendingToday === 0 && <p className="text-center py-4 text-muted-foreground">No prescriptions currently waiting for dispensing.</p>}
            </CardContent>
            <CardFooter>
                <Button variant="outline">
                    <RefreshCw className="mr-2 h-4 w-4"/> Refresh List
                </Button>
            </CardFooter>
          </Card>

          <div className="space-y-6">
            <Card className="shadow-sm">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    <FileText className="h-6 w-6 text-primary"/> Daily Dispensing Report
                </CardTitle>
                 <CardDescription>Summary of today's dispensing activities.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex justify-between items-center p-3 bg-muted/50 rounded-md">
                    <span className="text-sm font-medium">Prescriptions Dispensed:</span>
                    <Badge variant="secondary" className="text-base">{dispensedToday}</Badge>
                </div>
                <div className="flex justify-between items-center p-3 bg-muted/50 rounded-md">
                    <span className="text-sm font-medium">Prescriptions Pending:</span>
                    <Badge className="text-base">{pendingToday}</Badge>
                </div>
                 <Button className="w-full mt-2" variant="outline" disabled>View Full Report</Button>
              </CardContent>
            </Card>

            <Card className="shadow-sm">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <AlertTriangle className="h-6 w-6 text-primary" /> Pharmacy Stock Levels
                </CardTitle>
                <CardDescription>Overview of current medication inventory.</CardDescription>
              </CardHeader>
              <CardContent className="max-h-[300px] overflow-y-auto pr-1">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Medication</TableHead>
                      <TableHead>Stock</TableHead>
                      <TableHead className="text-right">Action</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {stockLevels.map((item) => {
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
                              <Button size="sm" variant="outline" onClick={() => handleNotifyLowStock(item)}>
                                <BellDot className="mr-1 h-3 w-3"/> Notify
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
                        Automated stock requisition from the Main Warehouse occurs daily at midnight for items below threshold. Real-time warehouse link is a backend integration.
                    </AlertDescription>
                </Alert>
               </CardFooter>
            </Card>
          </div>
        </div>
      </div>
    </AppShell>
  );
}
