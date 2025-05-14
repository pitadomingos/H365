
"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { AppShell } from "@/components/layout/app-shell";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Users, ListChecks, UserPlus, CalendarIcon, Camera, UserCircle, Trash2, ArrowRightCircle } from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { toast } from "@/hooks/use-toast";
import Image from "next/image";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

export default function PatientRegistrationPage() {
  const [dateOfBirth, setDateOfBirth] = useState<Date | undefined>();
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [hasCameraPermission, setHasCameraPermission] = useState<boolean | null>(null);
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const [stream, setStream] = useState<MediaStream | null>(null);

  useEffect(() => {
    return () => {
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
      }
    };
  }, [stream]);

  const enableCamera = async () => {
    if (hasCameraPermission === null || !hasCameraPermission) { // Only enable if not already enabled or explicitly denied
        if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
        try {
            const mediaStream = await navigator.mediaDevices.getUserMedia({ video: true });
            setStream(mediaStream);
            if (videoRef.current) {
            videoRef.current.srcObject = mediaStream;
            }
            setHasCameraPermission(true);
            setCapturedImage(null); 
        } catch (err) {
            console.error("Error accessing camera:", err);
            setHasCameraPermission(false);
            toast({
            variant: "destructive",
            title: "Camera Access Denied",
            description: "Please enable camera permissions in your browser settings.",
            });
        }
        } else {
        setHasCameraPermission(false);
        toast({
            variant: "destructive",
            title: "Camera Not Supported",
            description: "Your browser does not support camera access.",
        });
        }
    }
  };

  const capturePhoto = () => {
    if (videoRef.current && canvasRef.current && stream) {
      const video = videoRef.current;
      const canvas = canvasRef.current;
      // Approximate passport size aspect ratio (e.g., 3.5cm x 4.5cm, so roughly 350x450 or 300x385)
      // Let's use a fixed size for the canvas for captured image.
      const targetWidth = 300;
      const targetHeight = 385; // Approx 4:5 ratio for passport-like
      canvas.width = targetWidth;
      canvas.height = targetHeight;

      const context = canvas.getContext('2d');
      if (context) {
        // Calculate aspect ratios
        const videoAspectRatio = video.videoWidth / video.videoHeight;
        const canvasAspectRatio = canvas.width / canvas.height;
        let drawWidth, drawHeight, offsetX, offsetY;

        // Fit video into canvas, cropping as needed (center crop)
        if (videoAspectRatio > canvasAspectRatio) { // Video is wider than canvas view
          drawHeight = canvas.height;
          drawWidth = drawHeight * videoAspectRatio;
          offsetX = (canvas.width - drawWidth) / 2;
          offsetY = 0;
        } else { // Video is taller or same aspect ratio
          drawWidth = canvas.width;
          drawHeight = drawWidth / videoAspectRatio;
          offsetY = (canvas.height - drawHeight) / 2;
          offsetX = 0;
        }
        context.drawImage(video, offsetX, offsetY, drawWidth, drawHeight);
        const dataUrl = canvas.toDataURL('image/png');
        setCapturedImage(dataUrl);
        stream.getTracks().forEach(track => track.stop());
        setStream(null);
        setHasCameraPermission(null); // Reset, so user can click "Enable Camera" again if they discard
      }
    }
  };

  const discardPhoto = () => {
    setCapturedImage(null);
    setHasCameraPermission(null); // Allow re-enabling camera
    if (stream) {
        stream.getTracks().forEach(track => track.stop());
        setStream(null);
    }
  };


  const waitingList = [
    { id: 1, name: "Alice Wonderland", reason: "Annual Checkup", time: "10:30 AM" },
    { id: 2, name: "Bob The Builder", reason: "Flu Symptoms", time: "10:45 AM" },
    { id: 3, name: "Charlie Brown", reason: "Follow-up", time: "11:00 AM" },
  ];

  return (
    <AppShell>
      <div className="flex flex-col gap-8">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold tracking-tight flex items-center gap-2">
            <UserPlus className="h-8 w-8" /> Patient Registration
          </h1>
          <Button variant="outline" asChild>
            <Link href="/visiting-patients">
              <ArrowRightCircle className="mr-2 h-4 w-4" />
              Go to Visiting Patients
            </Link>
          </Button>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          <Card className="lg:col-span-2 shadow-sm">
            <CardHeader>
              <CardTitle>New Patient Details</CardTitle>
              <CardDescription>Please fill in the patient's information accurately. This form is for hospital reception use.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-8">
              
              {/* Photo Capture Section */}
              <Card className="border-dashed border-2 hover:border-primary transition-colors">
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Camera className="h-5 w-5" /> Patient Photo
                  </CardTitle>
                  <CardDescription>Capture a clear photo of the patient. Aim for a passport-style image.</CardDescription>
                </CardHeader>
                <CardContent className="flex flex-col items-center gap-4">
                  <div className="w-full max-w-xs h-auto aspect-[3/4] bg-muted rounded-md flex items-center justify-center overflow-hidden">
                    {!capturedImage && hasCameraPermission && stream && (
                      <video ref={videoRef} className="w-full h-full object-cover" autoPlay muted playsInline />
                    )}
                    {capturedImage && (
                      <Image src={capturedImage} alt="Captured patient photo" width={300} height={400} className="object-contain rounded-md" />
                    )}
                    {!capturedImage && (!hasCameraPermission || !stream) && (
                      <UserCircle className="w-24 h-24 text-muted-foreground" />
                    )}
                  </div>
                  <canvas ref={canvasRef} className="hidden"></canvas>
                  
                  {hasCameraPermission === false && (
                     <Alert variant="destructive" className="w-full max-w-xs">
                        <AlertTitle>Camera Access Denied</AlertTitle>
                        <AlertDescription>
                          Please allow camera access in your browser settings and try again.
                           <Button onClick={enableCamera} variant="link" className="p-0 h-auto ml-1">Retry</Button>
                        </AlertDescription>
                    </Alert>
                  )}

                  <div className="flex gap-2">
                    {!stream && !capturedImage && (
                      <Button onClick={enableCamera} variant="outline">
                        <Camera className="mr-2 h-4 w-4" /> Enable Camera
                      </Button>
                    )}
                    {stream && hasCameraPermission && !capturedImage && (
                      <Button onClick={capturePhoto}>
                        <Camera className="mr-2 h-4 w-4" /> Capture Photo
                      </Button>
                    )}
                    {capturedImage && (
                      <Button onClick={discardPhoto} variant="destructive" className="flex items-center">
                        <Trash2 className="mr-2 h-4 w-4" /> Discard Photo
                      </Button>
                    )}
                  </div>
                   {!(hasCameraPermission && stream) && !capturedImage && hasCameraPermission === null && (
                     <p className="text-xs text-muted-foreground">Click "Enable Camera" to start.</p>
                   )}
                </CardContent>
              </Card>

              {/* Personal Information */}
              <div className="space-y-4">
                <h3 className="text-md font-semibold border-b pb-1">Personal Information</h3>
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="nationalId">National ID Number <span className="text-destructive">*</span></Label>
                    <Input id="nationalId" placeholder="e.g., 1234567890" required />
                    <p className="text-xs text-muted-foreground">Patient's National ID must be unique.</p>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="fullName">Full Name <span className="text-destructive">*</span></Label>
                    <Input id="fullName" placeholder="e.g., John Michael Doe" required />
                  </div>
                </div>
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="dob">Date of Birth <span className="text-destructive">*</span></Label>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          variant={"outline"}
                          className={cn(
                            "w-full justify-start text-left font-normal",
                            !dateOfBirth && "text-muted-foreground"
                          )}
                        >
                          <CalendarIcon className="mr-2 h-4 w-4" />
                          {dateOfBirth ? format(dateOfBirth, "PPP") : <span>Pick a date</span>}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0">
                        <Calendar mode="single" selected={dateOfBirth} onSelect={setDateOfBirth} initialFocus captionLayout="dropdown-buttons" fromYear={1900} toYear={new Date().getFullYear()} />
                      </PopoverContent>
                    </Popover>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="gender">Gender <span className="text-destructive">*</span></Label>
                    <Select required>
                      <SelectTrigger id="gender">
                        <SelectValue placeholder="Select gender" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="male">Male</SelectItem>
                        <SelectItem value="female">Female</SelectItem>
                        <SelectItem value="other">Other</SelectItem>
                        <SelectItem value="prefer-not-to-say">Prefer not to say</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>

              {/* Contact Information */}
              <div className="space-y-4">
                <h3 className="text-md font-semibold border-b pb-1">Contact Information</h3>
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="contactNumber">Phone/Cell Number <span className="text-destructive">*</span></Label>
                    <Input id="contactNumber" type="tel" placeholder="e.g., (555) 123-4567" required />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Email Address</Label>
                    <Input id="email" type="email" placeholder="e.g., john.doe@example.com" />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="address">Full Address <span className="text-destructive">*</span></Label>
                  <Textarea id="address" placeholder="e.g., 123 Main St, Anytown, Province, Postal Code" required />
                </div>
              </div>

              {/* Location / Origin */}
              <div className="space-y-4">
                <h3 className="text-md font-semibold border-b pb-1">Location & Origin</h3>
                <div className="grid md:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="district">District <span className="text-destructive">*</span></Label>
                    <Input id="district" placeholder="e.g., Central District" required/>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="province">Province <span className="text-destructive">*</span></Label>
                    <Input id="province" placeholder="e.g., Capital Province" required/>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="homeHospital">Home Hospital / Clinic</Label>
                    <Input id="homeHospital" placeholder="e.g., City General Hospital" />
                  </div>
                </div>
              </div>
              
              {/* Next of Kin Information */}
              <div className="space-y-4">
                <h3 className="text-md font-semibold border-b pb-1">Next of Kin</h3>
                <div className="grid md:grid-cols-2 gap-4">
                   <div className="space-y-2">
                    <Label htmlFor="nextOfKinName">Full Name <span className="text-destructive">*</span></Label>
                    <Input id="nextOfKinName" placeholder="e.g., Jane Doe (Spouse)" required/>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="nextOfKinNumber">Contact Number <span className="text-destructive">*</span></Label>
                    <Input id="nextOfKinNumber" type="tel" placeholder="e.g., (555) 987-6543" required/>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="nextOfKinAddress">Address <span className="text-destructive">*</span></Label>
                  <Textarea id="nextOfKinAddress" placeholder="e.g., 456 Oak Ln, Anytown" required/>
                </div>
              </div>
             
              <div className="space-y-2">
                <Label htmlFor="reasonForVisit">Reason for Visit / Chief Complaint</Label>
                <Textarea id="reasonForVisit" placeholder="Describe the primary reason for the visit" />
              </div>
            </CardContent>
            <CardFooter className="border-t px-6 py-4">
              <Button>Register Patient</Button>
            </CardFooter>
          </Card>

          <Card className="shadow-sm">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <ListChecks className="h-6 w-6 text-primary" />
                Today's Waiting List
              </CardTitle>
              <CardDescription>Patients currently waiting for consultation.</CardDescription>
            </CardHeader>
            <CardContent>
              {waitingList.length > 0 ? (
                <ul className="space-y-4">
                  {waitingList.map((patient) => (
                    <li key={patient.id} className="p-3 border rounded-md shadow-sm bg-background hover:bg-muted/50">
                      <div className="flex justify-between items-center">
                        <p className="font-semibold">{patient.name}</p>
                        <span className="text-xs px-2 py-1 bg-primary/10 text-primary rounded-full">{patient.time}</span>
                      </div>
                      <p className="text-sm text-muted-foreground mt-1">{patient.reason}</p>
                    </li>
                  ))}
                </ul>
              ) : (
                <div className="text-center py-8 text-muted-foreground">
                  <Users className="mx-auto h-12 w-12 mb-2" />
                  <p>No patients currently in the waiting list.</p>
                </div>
              )}
               <Button variant="outline" className="w-full mt-6">Refresh List</Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </AppShell>
  );
}

    