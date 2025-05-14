
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
import { Users, ListChecks, UserPlus, CalendarIcon, Camera, UserCircle, Trash2, ArrowRightCircle, MapPin, Activity, UploadCloud, Download } from "lucide-react";
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
  const [currentDate, setCurrentDate] = useState('');
  const hospitalName = "HealthFlow Central Hospital"; // Static for now
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  useEffect(() => {
    setCurrentDate(new Date().toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' }));
    return () => {
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
      }
    };
  }, [stream]);

  const enableCamera = async () => {
    if (hasCameraPermission === null || !hasCameraPermission) {
      if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
        try {
          const mediaStream = await navigator.mediaDevices.getUserMedia({ video: true });
          setStream(mediaStream);
          if (videoRef.current) {
            videoRef.current.srcObject = mediaStream;
            videoRef.current.play().catch(err => {
              console.error("Error playing video:", err);
              toast({
                variant: "destructive",
                title: "Video Playback Error",
                description: "Could not start the camera preview.",
              });
            });
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
      
      const targetWidth = 240; 
      const targetHeight = 308; 
      canvas.width = targetWidth;
      canvas.height = targetHeight;

      const context = canvas.getContext('2d');
      if (context) {
        const videoAspectRatio = video.videoWidth / video.videoHeight;
        const canvasAspectRatio = canvas.width / canvas.height;
        
        let drawWidth, drawHeight, offsetX, offsetY;

        if (videoAspectRatio > canvasAspectRatio) {
            drawHeight = canvas.height;
            drawWidth = drawHeight * videoAspectRatio;
            offsetX = (canvas.width - drawWidth) / 2;
            offsetY = 0;
        } else {
            drawWidth = canvas.width;
            drawHeight = drawWidth / videoAspectRatio;
            offsetX = 0;
            offsetY = (canvas.height - drawHeight) / 2;
        }
        context.drawImage(video, offsetX, offsetY, drawWidth, drawHeight);
        const dataUrl = canvas.toDataURL('image/png');
        setCapturedImage(dataUrl);
        
        stream.getTracks().forEach(track => track.stop());
        setStream(null);
        setHasCameraPermission(null); 
      }
    }
  };

  const discardPhoto = () => {
    setCapturedImage(null);
    setHasCameraPermission(null); 
    if (stream) {
        stream.getTracks().forEach(track => track.stop());
        setStream(null);
    }
  };

  const downloadCSVTemplate = () => {
    const headers = [
      "NationalID", "FullName", "DateOfBirth (YYYY-MM-DD)", "Gender", 
      "PhoneNumber", "EmailAddress", "FullAddress", "District", "Province", 
      "HomeHospital", "NextOfKinName", "NextOfKinNumber", "NextOfKinAddress", 
      "ReasonForVisit"
    ];
    const csvContent = "data:text/csv;charset=utf-8," + headers.join(",") + "\n";
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "patient_registration_template.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast({ title: "Template Downloaded", description: "patient_registration_template.csv" });
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      setSelectedFile(event.target.files[0]);
    } else {
      setSelectedFile(null);
    }
  };

  const handleFileUpload = () => {
    if (selectedFile) {
      toast({
        title: "File Upload (Mock)",
        description: `${selectedFile.name} would be processed. This is a mock action.`,
      });
      // In a real app, you'd send the file to the server here.
      setSelectedFile(null); // Reset file input
      // Clear the file input visually
      const fileInput = document.getElementById('bulkPatientFile') as HTMLInputElement;
      if (fileInput) fileInput.value = "";

    } else {
      toast({
        variant: "destructive",
        title: "No File Selected",
        description: "Please select a file to upload.",
      });
    }
  };

  const waitingList = [
    { id: 1, name: "Alice Wonderland", time: "10:30 AM", location: "Outpatient", status: "Waiting for Doctor" },
    { id: 2, name: "Bob The Builder", time: "10:45 AM", location: "Consultation Room 1", status: "Dispatched to Ward A" },
    { id: 3, name: "Charlie Brown", time: "11:00 AM", location: "Laboratory", status: "Awaiting Results" },
    { id: 4, name: "Diana Prince", time: "11:15 AM", location: "Pharmacy", status: "Collecting Medication" },
    { id: 5, name: "Edward Scissorhands", time: "11:30 AM", location: "Specialized Dentist", status: "Procedure Complete" },
    { id: 6, name: "Fiona Gallagher", time: "11:45 AM", location: "Outpatient", status: "Dispatched to Homecare" },
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
            <CardContent className="py-6">
              <div className="space-y-8">
                {/* Row 1: Camera Visual and Personal Info */}
                <div className="grid lg:grid-cols-3 gap-x-6 gap-y-4">
                  {/* Photo Visual Section (Left Column) */}
                  <div className="lg:col-span-1">
                    <div className="w-[240px] h-[308px] bg-muted rounded-md flex items-center justify-center overflow-hidden border border-dashed border-primary/50">
                      {!capturedImage && hasCameraPermission && stream && (
                        <video ref={videoRef} className="w-full h-full object-cover" autoPlay muted playsInline />
                      )}
                      {capturedImage && (
                        <Image src={capturedImage} alt="Captured patient photo" width={240} height={308} className="w-full h-full object-contain rounded-md" />
                      )}
                      {!capturedImage && (!stream || hasCameraPermission === false) && ( 
                        <UserCircle className="w-24 h-24 text-muted-foreground" />
                      )}
                    </div>
                    <canvas ref={canvasRef} className="hidden"></canvas>
                  </div>

                  {/* Personal Information Section (Right Column of Row 1) */}
                  <div className="lg:col-span-2 space-y-4">
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
                </div>

                {/* Row 2: Camera Controls (aligned below Personal Info) */}
                <div className="grid lg:grid-cols-3 gap-x-6">
                    <div className="lg:col-span-1"></div> {/* Empty spacer for alignment with camera visual */}
                    <div className="lg:col-span-2 space-y-4">
                        <h3 className="text-md font-semibold flex items-center gap-2 border-b pb-1">
                          <Camera className="h-5 w-5" /> Patient Photo Capture
                        </h3>
                        <p className="text-sm text-muted-foreground">Capture a clear photo. Aim for a passport-style image.</p>
                        
                        {hasCameraPermission === false && (
                           <Alert variant="destructive" className="w-full">
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
                         {hasCameraPermission === null && !stream && !capturedImage &&(
                           <p className="text-xs text-muted-foreground">Click "Enable Camera" to start.</p>
                         )}
                    </div>
                </div>


                {/* Row 3: Remaining Information Sections */}
                <div className="space-y-6 pt-4"> 
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
                    <Label htmlFor="reasonForVisit">Reason for Visit / Chief Complaint (for new registrations)</Label>
                    <Textarea id="reasonForVisit" placeholder="Describe the primary reason for the visit if known at registration" />
                  </div>
                </div>
              </div>
            </CardContent>
            <CardFooter className="border-t px-6 py-4">
              <Button onClick={() => toast({ title: "Patient Registered", description: "Patient details saved (mock)"})}>Register Patient</Button>
            </CardFooter>
          </Card>

          <div className="lg:col-span-1 space-y-6">
            <Card className="shadow-sm">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-base">
                  <ListChecks className="h-5 w-5 text-primary" />
                  Today's Waiting List
                </CardTitle>
                <CardDescription className="text-xs">
                  {currentDate} at {hospitalName}
                </CardDescription>
              </CardHeader>
              <CardContent>
                {waitingList.length > 0 ? (
                  <ul className="space-y-3 max-h-[600px] overflow-y-auto pr-2">
                    {waitingList.map((patient) => (
                      <li key={patient.id} className="p-3 border rounded-md shadow-sm bg-background hover:bg-muted/50">
                        <div className="flex justify-between items-start mb-1">
                          <p className="font-semibold">{patient.name}</p>
                          <span className="text-xs px-2 py-0.5 bg-primary/10 text-primary rounded-full whitespace-nowrap">{patient.time}</span>
                        </div>
                        <p className="text-sm text-muted-foreground flex items-center">
                          <MapPin className="h-3.5 w-3.5 mr-1.5 shrink-0" />
                          Location: {patient.location}
                        </p>
                        <p className="text-sm text-muted-foreground flex items-center mt-0.5">
                          <Activity className="h-3.5 w-3.5 mr-1.5 shrink-0" />
                          Status: {patient.status}
                        </p>
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

            <Card className="shadow-sm lg:col-span-2">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <UploadCloud className="h-6 w-6" /> Bulk Patient Registration
                </CardTitle>
                <CardDescription>
                  Upload an Excel or CSV file to register multiple patients at once. Download the template for the correct format.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <Button onClick={downloadCSVTemplate} variant="outline" className="w-full">
                  <Download className="mr-2 h-4 w-4" /> Download CSV Template
                </Button>
                
                <div className="space-y-2">
                  <Label htmlFor="bulkPatientFile">Upload File</Label>
                  <Input 
                    id="bulkPatientFile" 
                    type="file" 
                    accept=".csv, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel"
                    onChange={handleFileChange} 
                  />
                  {selectedFile && <p className="text-xs text-muted-foreground">Selected: {selectedFile.name}</p>}
                </div>

                <Button onClick={handleFileUpload} className="w-full" disabled={!selectedFile}>
                  <UploadCloud className="mr-2 h-4 w-4" /> Upload and Process File
                </Button>
                <p className="text-xs text-muted-foreground">
                  Note: Photos cannot be uploaded in bulk. They must be added individually after registration.
                </p>
              </CardContent>
            </Card>
          </div>

        </div>
      </div>
    </AppShell>
  );
}
