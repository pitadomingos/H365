import { AppShell } from "@/components/layout/app-shell";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Users, ListChecks, UserPlus, CalendarIcon } from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { format } from "date-fns";
import { cn } from "@/lib/utils";

// This would typically be a client component with form handling (e.g. react-hook-form)
// For now, it's a server component rendering a static form structure.

export default function PatientRegistrationPage() {
  // Placeholder for date of birth state
  // const [date, setDate] = React.useState<Date>()

  const waitingList = [
    { id: 1, name: "Alice Wonderland", reason: "Annual Checkup", time: "10:30 AM" },
    { id: 2, name: "Bob The Builder", reason: "Flu Symptoms", time: "10:45 AM" },
    { id: 3, name: "Charlie Brown", reason: "Follow-up", time: "11:00 AM" },
  ];

  return (
    <AppShell>
      <div className="flex flex-col gap-6">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold tracking-tight flex items-center gap-2">
            <UserPlus className="h-8 w-8" /> Patient Registration
          </h1>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          <Card className="lg:col-span-2 shadow-sm">
            <CardHeader>
              <CardTitle>New Patient Details</CardTitle>
              <CardDescription>Please fill in the patient's information accurately. This form is for hospital reception use.</CardDescription>
            </CardHeader>
            <CardContent className="grid gap-6">
              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="fullName">Full Name</Label>
                  <Input id="fullName" placeholder="e.g., John Doe" />
                </div>
                 <div className="space-y-2">
                  <Label htmlFor="dob">Date of Birth</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant={"outline"}
                        className={cn(
                          "w-full justify-start text-left font-normal",
                          // !date && "text-muted-foreground" // Enable if using state
                        )}
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {/* {date ? format(date, "PPP") : <span>Pick a date</span>} */}
                        <span>Pick a date</span> 
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                      {/* <Calendar mode="single" selected={date} onSelect={setDate} initialFocus /> */}
                       <Calendar mode="single" initialFocus />
                    </PopoverContent>
                  </Popover>
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="contactNumber">Contact Number</Label>
                  <Input id="contactNumber" type="tel" placeholder="e.g., (555) 123-4567" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email Address (Optional)</Label>
                  <Input id="email" type="email" placeholder="e.g., john.doe@example.com" />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="address">Full Address</Label>
                <Textarea id="address" placeholder="e.g., 123 Main St, Anytown, USA 12345" />
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                 <div className="space-y-2">
                  <Label htmlFor="gender">Gender</Label>
                  <Select>
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
                <div className="space-y-2">
                  <Label htmlFor="emergencyContact">Emergency Contact Name</Label>
                  <Input id="emergencyContact" placeholder="e.g., Jane Doe (Spouse)" />
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
