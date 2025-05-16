
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
import { Users, ListChecks, UserPlus, CalendarIcon, Camera, UserCircle, Trash2, ArrowRightCircle, MapPin, Activity, UploadCloud, Download, Info, Loader2 } from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { toast } from "@/hooks/use-toast";
import Image from "next/image";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { useForm, SubmitHandler, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

interface WaitingListItem {
  id: number | string;
  name: string;
  time: string;
  location: string;
  status: string;
  photoUrl: string;
  gender?: "Male" | "Female" | "Other";
}

const patientFormSchema = z.object({
  nationalId: z.string().min(1, "National ID is required."),
  fullName: z.string().min(1, "Full name is required."),
  dateOfBirth: z.date({ required_error: "Date of birth is required."}),
  gender: z.string().min(1, "Gender is required."),
  contactNumber: z.string().min(1, "Contact number is required."),
  email: z.string().email("Invalid email address.").optional().or(z.literal('')),
  address: z.string().min(1, "Address is required."),
  district: z.string().min(1, "District is required."),
  province: z.string().min(1, "Province is required."),
  homeHospital: z.string().optional(),
  nextOfKinName: z.string().optional(),
  nextOfKinNumber: z.string().optional(),
  nextOfKinAddress: z.string().optional(),
});

type PatientFormValues = z.infer<typeof patientFormSchema>;


export default function PatientRegistrationPage() {
  const form = useForm<PatientFormValues>({
    resolver: zodResolver(patientFormSchema),
    defaultValues: {
      nationalId: "",
      fullName: "",
      dateOfBirth: undefined,
      gender: "",
      contactNumber: "",
      email: "",
      address: "",
      district: "",
      province: "",
      homeHospital: "",
      nextOfKinName: "",
      nextOfKinNumber: "",
      nextOfKinAddress: "",
    }
  });
  
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [hasCameraPermission, setHasCameraPermission] = useState<boolean | null>(null);
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [currentDate, setCurrentDate] = useState('');
  const hospitalName = "HealthFlow Central Hospital";
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isUploading, setIsUploading] = useState(false); // New state for bulk upload

  const [waitingList, setWaitingList] = useState<WaitingListItem[]>([]);
  const [isWaitingListLoading, setIsWaitingListLoading] = useState(true);

  useEffect(() => {
    setCurrentDate(new Date().toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' }));
    
    // Simulate fetching waiting list data
    setIsWaitingListLoading(true);
    setTimeout(() => {
      const initialWaitingList: WaitingListItem[] = [
        { id: 1, name: "Alice Wonderland", gender: "Female", time: "10:30 AM", location: "Outpatient", status: "Waiting for Doctor", photoUrl: "https://placehold.co/40x40.png" },
        { id: 2, name: "Bob The Builder", gender: "Male", time: "10:45 AM", location: "Consultation Room 1", status: "Dispatched to Ward A", photoUrl: "https://placehold.co/40x40.png" },
        { id: 3, name: "Charlie Brown", gender: "Male", time: "11:00 AM", location: "Laboratory", status: "Awaiting Results", photoUrl: "https://placehold.co/40x40.png" },
        { id: 4, name: "Diana Prince", gender: "Female", time: "11:15 AM", location: "Pharmacy", status: "Collecting Medication", photoUrl: "https://placehold.co/40x40.png" },
        { id: 5, name: "Edward Scissorhands", gender: "Male", time: "11:30 AM", location: "Specialized Dentist", status: "Procedure Complete", photoUrl: "https://placehold.co/40x40.png" },
        { id: 6, name: "Fiona Gallagher", gender: "Female", time: "11:45 AM", location: "Outpatient", status: "Dispatched to Homecare", photoUrl: "https://placehold.co/40x40.png" },
      ];
      setWaitingList(initialWaitingList);
      setIsWaitingListLoading(false);
    }, 1500); // Simulate 1.5 second fetch

    return () => {
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
      }
    };
  }, [stream]); // stream dependency to handle cleanup

  const enableCamera = async () => {
    if (hasCameraPermission === false) {
      setHasCameraPermission(null);
      setStream(null); 
    }

    if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
      try {
        const mediaStream = await navigator.mediaDevices.getUserMedia({ video: true });
        setStream(mediaStream);

        if (videoRef.current) {
          videoRef.current.srcObject = mediaStream;
          videoRef.current.onloadedmetadata = () => {
            videoRef.current?.play().catch(err => {
              console.error("Error playing video:", err);
              toast({
                variant: "destructive",
                title: "Video Playback Error",
                description: "Could not start the camera preview.",
              });
            });
          };
        } else {
            console.error("videoRef.current is not available when setting srcObject");
            toast({
                variant: "destructive",
                title: "Camera Error",
                description: "Camera preview element not ready. Please try again.",
            });
            mediaStream.getTracks().forEach(track => track.stop());
            setStream(null);
            setHasCameraPermission(false);
            return;
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
        const targetAspectRatio = targetWidth / targetHeight;
        
        let sx = 0, sy = 0, sWidth = video.videoWidth, sHeight = video.videoHeight;

        if (videoAspectRatio > targetAspectRatio) {
            sWidth = video.videoHeight * targetAspectRatio;
            sx = (video.videoWidth - sWidth) / 2;
        } else {
            sHeight = video.videoWidth / targetAspectRatio;
            sy = (video.videoHeight - sHeight) / 2;
        }
        
        context.drawImage(video, sx, sy, sWidth, sHeight, 0, 0, targetWidth, targetHeight);
        const dataUrl = canvas.toDataURL('image/png');
        setCapturedImage(dataUrl);
        stream.getTracks().forEach(track => track.stop());
        setStream(null);
      }
    }
  };

  const discardPhoto = () => {
    setCapturedImage(null);
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
      setStream(null);
    }
  };


  const downloadCSVTemplate = () => {
    const headers = [
      "NationalID", "FullName", "DateOfBirth (YYYY-MM-DD)", "Gender",
      "ContactNumber", "EmailAddress", "Address", "District", "Province",
      "HomeHospital", "NextOfKinName", "NextOfKinNumber", "NextOfKinAddress"
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

  const handleFileUpload = async () => {
    if (selectedFile) {
      setIsUploading(true);
      // Mock upload processing
      await new Promise(resolve => setTimeout(resolve, 1500)); // Simulate network delay
      toast({
        title: "File Upload (Mock)",
        description: `${selectedFile.name} would be processed. This is a mock action.`,
      });
      // Reset file input
      setSelectedFile(null);
      const fileInput = document.getElementById('bulkPatientFile') as HTMLInputElement;
      if (fileInput) fileInput.value = ""; // Clear the file input
      setIsUploading(false);
    } else {
      toast({
        variant: "destructive",
        title: "No File Selected",
        description: "Please select a file to upload.",
      });
    }
  };

  const onSubmit: SubmitHandler<PatientFormValues> = async (data) => {
    setIsSubmitting(true);

    if (!capturedImage) {
      toast({
        variant: "destructive",
        title: "Photo Required",
        description: "Please capture a patient photo for registration via this form.",
      });
      setIsSubmitting(false);
      return;
    }

    const payload = {
      ...data,
      dateOfBirth: data.dateOfBirth ? format(data.dateOfBirth, "yyyy-MM-dd") : undefined,
      photoDataUri: capturedImage,
    };

    console.log("Submitting to /api/v1/patients:", payload);

    try {
      // Simulate API Call
      await new Promise(resolve => setTimeout(resolve, 1500)); 
      const mockSuccess = Math.random() > 0.1; 

      if (mockSuccess) {
        const mockResult = { 
            message: "Patient registered successfully",
            patient: {
                id: `BE${Date.now()}`, 
                nationalId: data.nationalId,
                fullName: data.fullName,
                age: data.dateOfBirth ? new Date().getFullYear() - data.dateOfBirth.getFullYear() : 'N/A', 
                gender: data.gender,
                address: data.address,
                homeClinic: data.homeHospital || 'N/A'
            }
        };
        toast({ 
            title: "Patient Registered (Mock API)", 
            description: `${mockResult.patient.fullName} (ID: ${mockResult.patient.nationalId}) registered. Age: ${mockResult.patient.age}, Gender: ${mockResult.patient.gender}. Address: ${mockResult.patient.address}, Home Clinic: ${mockResult.patient.homeClinic}` 
        });
        form.reset();
        setCapturedImage(null);
        if (stream) {
            stream.getTracks().forEach(track => track.stop());
            setStream(null);
        }
        setHasCameraPermission(null); 
      } else {
        const mockErrorResult = { error: "Failed to register patient (Mock API Error - e.g. National ID already exists)" };
        toast({
          variant: "destructive",
          title: "Registration Failed (Mock API)",
          description: mockErrorResult.error,
        });
      }
    } catch (error) {
      console.error("API submission error:", error);
      toast({
        variant: "destructive",
        title: "Submission Error",
        description: "An unexpected error occurred. Please try again.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const getAvatarHint = (gender?: "Male" | "Female" | "Other") => {
    if (gender === "Male") return "male avatar";
    if (gender === "Female") return "female avatar";
    return "patient avatar";
  };

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
            <form onSubmit={form.handleSubmit(onSubmit)}>
              <CardContent className="py-6">
                <div className="space-y-8">
                  <div className="grid lg:grid-cols-3 gap-x-6 gap-y-4 items-start">
                    <div className="lg:col-span-1">
                      <div className="relative w-[240px] h-[308px] bg-muted rounded-md flex items-center justify-center overflow-hidden border border-dashed border-primary/50">
                        {!capturedImage && (
                          <video
                            ref={videoRef}
                            className={cn("w-full h-full object-cover", !stream && "hidden")}
                            autoPlay
                            muted
                            playsInline
                          />
                        )}
                        {capturedImage ? (
                          <Image src={capturedImage} alt="Captured patient photo" width={240} height={308} className="w-full h-full object-contain rounded-md" data-ai-hint={getAvatarHint(form.watch("gender") as any || "Other")}/>
                        ) : (
                           <>
                            { !(hasCameraPermission && stream) && (
                                <div className="absolute inset-0 flex items-center justify-center bg-muted">
                                    <UserCircle className="w-24 h-24 text-muted-foreground" />
                                </div>
                            )}
                           </>
                        )}
                      </div>
                      <canvas ref={canvasRef} className="hidden"></canvas>
                       {hasCameraPermission === false && !stream && (
                          <Alert variant="destructive" className="w-full mt-2">
                              <AlertTitle>Camera Access Denied</AlertTitle>
                              <AlertDescription>
                                Please allow camera access in your browser settings.
                                <Button onClick={enableCamera} variant="link" className="p-0 h-auto ml-1">Retry</Button>
                              </AlertDescription>
                          </Alert>
                      )}
                    </div>

                    <div className="lg:col-span-2 space-y-4">
                      <h3 className="text-md font-semibold border-b pb-1">Personal Information</h3>
                      <div className="grid md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="nationalId">National ID Number <span className="text-destructive">*</span></Label>
                          <Input id="nationalId" placeholder="e.g., 1234567890" {...form.register("nationalId")} />
                          {form.formState.errors.nationalId && <p className="text-xs text-destructive">{form.formState.errors.nationalId.message}</p>}
                          <p className="text-xs text-muted-foreground">Patient's National ID must be unique.</p>
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="fullName">Full Name <span className="text-destructive">*</span></Label>
                          <Input id="fullName" placeholder="e.g., John Michael Doe" {...form.register("fullName")} />
                           {form.formState.errors.fullName && <p className="text-xs text-destructive">{form.formState.errors.fullName.message}</p>}
                        </div>
                      </div>
                      <div className="grid md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="dob">Date of Birth <span className="text-destructive">*</span></Label>
                          <Controller
                            control={form.control}
                            name="dateOfBirth"
                            render={({ field }) => (
                              <Popover>
                                <PopoverTrigger asChild>
                                  <Button
                                    variant={"outline"}
                                    className={cn(
                                      "w-full justify-start text-left font-normal",
                                      !field.value && "text-muted-foreground"
                                    )}
                                  >
                                    <CalendarIcon className="mr-2 h-4 w-4" />
                                    {field.value ? format(field.value, "PPP") : <span>Pick a date</span>}
                                  </Button>
                                </PopoverTrigger>
                                <PopoverContent className="w-auto p-0">
                                  <Calendar mode="single" selected={field.value} onSelect={field.onChange} initialFocus captionLayout="dropdown-buttons" fromYear={1900} toYear={new Date().getFullYear()} />
                                </PopoverContent>
                              </Popover>
                            )}
                          />
                           {form.formState.errors.dateOfBirth && <p className="text-xs text-destructive">{form.formState.errors.dateOfBirth.message}</p>}
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="gender">Gender <span className="text-destructive">*</span></Label>
                          <Controller
                            control={form.control}
                            name="gender"
                            render={({ field }) => (
                              <Select onValueChange={field.onChange} value={field.value} >
                                <SelectTrigger id="gender">
                                  <SelectValue placeholder="Select gender" />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="Male">Male</SelectItem>
                                  <SelectItem value="Female">Female</SelectItem>
                                  <SelectItem value="Other">Other</SelectItem>
                                  <SelectItem value="Prefer not to say">Prefer not to say</SelectItem>
                                </SelectContent>
                              </Select>
                            )}
                          />
                          {form.formState.errors.gender && <p className="text-xs text-destructive">{form.formState.errors.gender.message}</p>}
                        </div>
                      </div>
                        <div className="pt-2">
                            <h3 className="text-md font-semibold flex items-center gap-2 border-b pb-1">
                            <Camera className="h-5 w-5" /> Patient Photo Capture <span className="text-destructive">*</span>
                            </h3>
                            <p className="text-sm text-muted-foreground">Capture a clear photo. Aim for a passport-style image. Photo is mandatory for this form.</p>
                            <div className="flex gap-2 mt-2">
                            {!stream && !capturedImage && (
                                <Button type="button" onClick={enableCamera} variant="outline">
                                <Camera className="mr-2 h-4 w-4" /> Enable Camera
                                </Button>
                            )}
                            {stream && hasCameraPermission && !capturedImage && (
                                <Button type="button" onClick={capturePhoto}>
                                <Camera className="mr-2 h-4 w-4" /> Capture Photo
                                </Button>
                            )}
                            {capturedImage && (
                                <Button type="button" onClick={discardPhoto} variant="destructive" className="flex items-center">
                                <Trash2 className="mr-2 h-4 w-4" /> Discard Photo
                                </Button>
                            )}
                            </div>
                            {hasCameraPermission === null && !stream && !capturedImage &&(
                            <p className="text-xs text-muted-foreground mt-1">Click "Enable Camera" to start.</p>
                            )}
                        </div>
                    </div>
                  </div>

                  <div className="space-y-6 pt-4">
                    <div className="space-y-4">
                      <h3 className="text-md font-semibold border-b pb-1">Contact Information</h3>
                      <div className="grid md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="contactNumber">Phone/Cell Number <span className="text-destructive">*</span></Label>
                          <Input id="contactNumber" type="tel" placeholder="e.g., (555) 123-4567" {...form.register("contactNumber")} />
                          {form.formState.errors.contactNumber && <p className="text-xs text-destructive">{form.formState.errors.contactNumber.message}</p>}
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="email">Email Address</Label>
                          <Input id="email" type="email" placeholder="e.g., john.doe@example.com" {...form.register("email")} />
                           {form.formState.errors.email && <p className="text-xs text-destructive">{form.formState.errors.email.message}</p>}
                        </div>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="address">Full Address <span className="text-destructive">*</span></Label>
                        <Textarea id="address" placeholder="e.g., 123 Main St, Anytown, Province, Postal Code" {...form.register("address")} />
                         {form.formState.errors.address && <p className="text-xs text-destructive">{form.formState.errors.address.message}</p>}
                      </div>
                    </div>

                    <div className="space-y-4">
                      <h3 className="text-md font-semibold border-b pb-1">Location & Origin</h3>
                      <div className="grid md:grid-cols-3 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="district">District <span className="text-destructive">*</span></Label>
                          <Input id="district" placeholder="e.g., Central District" {...form.register("district")}/>
                           {form.formState.errors.district && <p className="text-xs text-destructive">{form.formState.errors.district.message}</p>}
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="province">Province <span className="text-destructive">*</span></Label>
                          <Input id="province" placeholder="e.g., Capital Province" {...form.register("province")}/>
                          {form.formState.errors.province && <p className="text-xs text-destructive">{form.formState.errors.province.message}</p>}
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="homeHospital">Home Hospital / Clinic</Label>
                          <Input id="homeHospital" placeholder="e.g., City General Hospital" {...form.register("homeHospital")} />
                        </div>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <h3 className="text-md font-semibold border-b pb-1">Next of Kin (Optional)</h3>
                      <div className="grid md:grid-cols-2 gap-4">
                         <div className="space-y-2">
                          <Label htmlFor="nextOfKinName">Full Name</Label>
                          <Input id="nextOfKinName" placeholder="e.g., Jane Doe (Spouse)" {...form.register("nextOfKinName")}/>
                           {form.formState.errors.nextOfKinName && <p className="text-xs text-destructive">{form.formState.errors.nextOfKinName.message}</p>}
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="nextOfKinNumber">Contact Number</Label>
                          <Input id="nextOfKinNumber" type="tel" placeholder="e.g., (555) 987-6543" {...form.register("nextOfKinNumber")}/>
                          {form.formState.errors.nextOfKinNumber && <p className="text-xs text-destructive">{form.formState.errors.nextOfKinNumber.message}</p>}
                        </div>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="nextOfKinAddress">Address</Label>
                        <Textarea id="nextOfKinAddress" placeholder="e.g., 456 Oak Ln, Anytown" {...form.register("nextOfKinAddress")}/>
                         {form.formState.errors.nextOfKinAddress && <p className="text-xs text-destructive">{form.formState.errors.nextOfKinAddress.message}</p>}
                      </div>
                    </div>

                    <div className="space-y-4 pt-4 border-t">
                       <h3 className="text-md font-semibold flex items-center gap-2 pt-2">
                          <UploadCloud className="h-6 w-6" /> Bulk Patient Registration
                      </h3>
                      <p className="text-sm text-muted-foreground">
                        Upload an Excel or CSV file to register multiple patients at once. Download the template for the correct format. Photos must be added individually post-registration.
                      </p>
                      <Button type="button" onClick={downloadCSVTemplate} variant="outline" className="w-full md:w-auto">
                        <Download className="mr-2 h-4 w-4" /> Download CSV Template
                      </Button>
                      <div className="space-y-2">
                        <Label htmlFor="bulkPatientFile">Upload File</Label>
                        <Input
                          id="bulkPatientFile"
                          type="file"
                          accept=".csv, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel"
                          onChange={handleFileChange}
                          disabled={isUploading}
                        />
                        {selectedFile && <p className="text-xs text-muted-foreground">Selected: {selectedFile.name}</p>}
                      </div>
                      <Button type="button" onClick={handleFileUpload} className="w-full md:w-auto" disabled={!selectedFile || isUploading}>
                        {isUploading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <UploadCloud className="mr-2 h-4 w-4" />}
                        {isUploading ? "Uploading..." : "Upload and Process File"}
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="border-t px-6 py-4">
                <Button type="submit" disabled={isSubmitting}>
                  {isSubmitting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                  {isSubmitting ? "Registering..." : "Register Patient"}
                </Button>
              </CardFooter>
            </form>
          </Card>

          <div className="lg:col-span-1 space-y-6">
            <Card className="shadow-sm">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-base">
                  <ListChecks className="h-5 w-5 text-primary" />
                  Today's Waiting List - {currentDate} at {hospitalName}
                </CardTitle>
                <CardDescription className="text-xs">
                  Patients currently waiting for service.
                </CardDescription>
              </CardHeader>
              <CardContent>
                {isWaitingListLoading ? (
                  <div className="flex items-center justify-center py-8">
                    <Loader2 className="h-8 w-8 animate-spin text-primary" />
                    <p className="ml-2 text-muted-foreground">Loading waiting list...</p>
                  </div>
                ) : waitingList.length > 0 ? (
                  <ul className="space-y-3 max-h-[600px] overflow-y-auto pr-2">
                    {waitingList.map((patient) => (
                      <li key={patient.id} className="p-3 border rounded-md shadow-sm bg-background hover:bg-muted/50 flex items-start gap-3">
                        <Image
                            src={patient.photoUrl}
                            alt={patient.name}
                            width={40}
                            height={40}
                            className="rounded-full mt-1"
                            data-ai-hint={getAvatarHint(patient.gender)}
                        />
                        <div className="flex-1">
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
                        </div>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <div className="text-center py-8 text-muted-foreground">
                    <Users className="mx-auto h-12 w-12 mb-2" />
                    <p>No patients currently in the waiting list.</p>
                  </div>
                )}
                 <Button type="button" variant="outline" className="w-full mt-6" disabled={isWaitingListLoading}>
                    {isWaitingListLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin"/> : null}
                    Refresh List
                 </Button>
              </CardContent>
            </Card>

            <Card className="shadow-sm">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-base">
                  <Info className="h-5 w-5 text-primary" />
                  Reception Quick Tips
                </CardTitle>
              </CardHeader>
              <CardContent className="text-sm space-y-2">
                <p>Ensure patient details are entered accurately.</p>
                <p>Verify National ID for all new and returning patients.</p>
                <p>For emergencies, follow standard hospital protocol.</p>
                <p>Keep patient discussions confidential.</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </AppShell>
  );
}
    

    