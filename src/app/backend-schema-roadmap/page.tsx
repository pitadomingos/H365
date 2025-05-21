
"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Database, FileText, BookOpenCheck } from "lucide-react";
import { Separator } from "@/components/ui/separator";

export default function BackendSchemaRoadmapPage() {

  // Helper to render SQL code blocks nicely
  const SqlCode = ({ children }: { children: React.ReactNode }) => (
    <pre className="bg-muted p-3 rounded-md text-sm overflow-x-auto my-2">
      <code className="font-mono">{children}</code>
    </pre>
  );

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight flex items-center gap-2">
          <Database className="h-8 w-8" /> H365: Backend Development Plan
        </h1>
      </div>

      <Card className="shadow-sm">
        <CardHeader>
          <CardTitle className="text-xl">1. Introduction</CardTitle>
        </CardHeader>
        <CardContent className="prose dark:prose-invert max-w-none">
          <p>
            This document outlines a phased roadmap for developing the backend for the H365 Hospital Management System, 
            along with initial database schema definitions and dummy data. The backend will be built using Node.js 
            with the Express framework and MySQL as the database, hosted on Aiven.
          </p>
        </CardContent>
      </Card>

      <Card className="shadow-sm">
        <CardHeader>
          <CardTitle className="text-xl">2. Technology Stack</CardTitle>
        </CardHeader>
        <CardContent className="prose dark:prose-invert max-w-none">
          <ul>
            <li><strong>Backend Framework:</strong> Node.js with Express.js</li>
            <li><strong>Database:</strong> MySQL (hosted on Aiven)</li>
            <li><strong>Authentication:</strong> JWT (JSON Web Tokens)</li>
            <li><strong>ORM/Query Builder (Recommended):</strong> Sequelize, Knex.js, or TypeORM (or use a direct MySQL driver like `mysql2`)</li>
            <li><strong>Validation:</strong> A library like Joi or express-validator</li>
            <li><strong>Logging:</strong> Winston or Pino</li>
            <li><strong>API Documentation (Recommended):</strong> Swagger/OpenAPI</li>
          </ul>
        </CardContent>
      </Card>

      <Card className="shadow-sm">
        <CardHeader>
          <CardTitle className="text-xl">3. Phased Development Roadmap & Database Schema</CardTitle>
          <CardDescription>Initial schema definitions and dummy data examples for MySQL.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          
          {/* --- Phase 1 --- */}
          <section>
            <h3 className="text-lg font-semibold mb-2">Phase 1: Core Infrastructure, User Management & Patient Registration</h3>
            <p className="text-sm text-muted-foreground mb-2">
              Establish the basic backend server, connect to the database, and implement core user authentication and patient registration functionalities.
            </p>
            <h4 className="font-medium mt-3 mb-1">Key Entities & Tables:</h4>
            <ul className="list-disc list-inside text-sm pl-4">
              <li><code>Users</code> (for system users like doctors, nurses, admins)</li>
              <li><code>Patients</code></li>
            </ul>
            <h4 className="font-medium mt-3 mb-1">API Endpoints to Implement:</h4>
            <ul className="list-disc list-inside text-sm pl-4">
              <li><code>POST /api/v1/auth/login</code></li>
              <li><code>GET /api/v1/auth/me</code></li>
              <li><code>POST /api/v1/patients</code></li>
              <li><code>GET /api/v1/patients/search?nationalId={'{nationalId}'}</code></li>
              <li><code>GET /api/v1/patients/{'{patientId}'}</code> (basic version)</li>
            </ul>

            <h4 className="font-medium mt-4 mb-1">Table: <code>Users</code></h4>
            <SqlCode>{
`CREATE TABLE Users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(100) NOT NULL UNIQUE,
    passwordHash VARCHAR(255) NOT NULL,
    fullName VARCHAR(255) NOT NULL,
    role VARCHAR(50) NOT NULL, -- e.g., 'Doctor', 'Nurse', 'Admin', 'LabTech', 'Pharmacist'
    facilityId VARCHAR(100), -- Link to hospital/clinic if applicable
    isActive BOOLEAN DEFAULT TRUE,
    createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);`
            }</SqlCode>
            <h5 className="text-xs font-semibold">Dummy Data for Users:</h5>
            <SqlCode>{
`INSERT INTO Users (username, passwordHash, fullName, role, facilityId) VALUES
('dr.smith', 'hashed_password_placeholder_1', 'Dr. John Smith', 'Doctor', 'HOSP001'),
('nurse.anna', 'hashed_password_placeholder_2', 'Nurse Anna Miller', 'Nurse', 'HOSP001'),
('admin.h365', 'hashed_password_placeholder_3', 'H365 System Admin', 'Admin', NULL);`
            }</SqlCode>

            <h4 className="font-medium mt-4 mb-1">Table: <code>Patients</code></h4>
            <SqlCode>{
`CREATE TABLE Patients (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nationalId VARCHAR(255) NOT NULL UNIQUE,
    fullName VARCHAR(255) NOT NULL,
    dateOfBirth DATE NOT NULL,
    gender VARCHAR(50) NOT NULL,
    contactNumber VARCHAR(50) NOT NULL,
    email VARCHAR(255),
    address TEXT NOT NULL,
    district VARCHAR(255) NOT NULL,
    province VARCHAR(255) NOT NULL,
    homeHospital VARCHAR(255),
    nextOfKinName VARCHAR(255),
    nextOfKinNumber VARCHAR(50),
    nextOfKinAddress TEXT,
    allergies TEXT,
    chronicConditions TEXT,
    photo LONGBLOB,
    createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);`
            }</SqlCode>
             <h5 className="text-xs font-semibold">Dummy Data for Patients:</h5>
            <SqlCode>{
`INSERT INTO Patients (nationalId, fullName, dateOfBirth, gender, contactNumber, email, address, district, province, allergies, chronicConditions) VALUES
('123456789', 'Demo Patient One', '1985-06-15', 'Male', '555-0101', 'demo.one@example.com', '123 Health St, Wellness City', 'Wellness District', 'Health Province', 'Penicillin, Dust Mites', 'Asthma'),
('987654321', 'Jane Sample Doe', '1990-11-22', 'Female', '555-0202', 'jane.doe@example.com', '456 Cure Ave, Remedy Town', 'Remedy District', 'Health Province', NULL, 'Hypertension, Type 2 Diabetes'),
('112233445', 'Aisha Sharma', '1996-03-01', 'Female', '555-0303', 'aisha.s@example.com', '789 Care Rd, Maternity Ville', 'Hope District', 'Life Province', 'Penicillin', 'Mild Asthma');`
            }</SqlCode>
          </section>
          <Separator />

          {/* --- Phase 2 --- */}
          <section>
            <h3 className="text-lg font-semibold mb-2">Phase 2: Appointments & Visiting Patients (Intake)</h3>
            <p className="text-sm text-muted-foreground mb-2">
              Implement appointment scheduling and the workflow for patients arriving at the hospital.
            </p>
             <h4 className="font-medium mt-3 mb-1">Key Entities & Tables:</h4>
            <ul className="list-disc list-inside text-sm pl-4">
              <li><code>Doctors</code> (if distinct from Users, or use Users table with role 'Doctor')</li>
              <li><code>Appointments</code></li>
              <li><code>Visits</code></li>
            </ul>
             <h4 className="font-medium mt-3 mb-1">API Endpoints to Implement:</h4>
            <ul className="list-disc list-inside text-sm pl-4">
              <li><code>GET /api/v1/doctors</code></li>
              <li><code>POST /api/v1/appointments</code></li>
              <li><code>GET /api/v1/appointments</code></li>
              <li><code>POST /api/v1/visits</code></li>
              <li><code>GET /api/v1/visits/waiting-list</code></li>
            </ul>
            <h4 className="font-medium mt-4 mb-1">Table: <code>Appointments</code></h4>
            <SqlCode>{
`CREATE TABLE Appointments (
    id INT AUTO_INCREMENT PRIMARY KEY,
    patientId INT NOT NULL,
    doctorId INT NOT NULL, 
    appointmentDate DATE NOT NULL,
    appointmentTime TIME NOT NULL,
    type VARCHAR(255) NOT NULL,
    status VARCHAR(50) NOT NULL DEFAULT 'Pending', -- 'Pending', 'Confirmed', 'Cancelled', 'Completed'
    notes TEXT,
    createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (patientId) REFERENCES Patients(id),
    FOREIGN KEY (doctorId) REFERENCES Users(id) -- Assuming doctorId refers to Users.id
);`
            }</SqlCode>
            <h5 className="text-xs font-semibold">Dummy Data for Appointments:</h5>
            <SqlCode>{
`-- Assuming dr.smith has Users.id = 1
-- Assuming Demo Patient One has Patients.id = 1, Jane Sample Doe Patients.id = 2
INSERT INTO Appointments (patientId, doctorId, appointmentDate, appointmentTime, type, status) VALUES
(1, 1, CURDATE() + INTERVAL 1 DAY, '10:00:00', 'Consultation', 'Confirmed'),
(2, 1, CURDATE() + INTERVAL 1 DAY, '11:00:00', 'Check-up', 'Pending');`
            }</SqlCode>

            <h4 className="font-medium mt-4 mb-1">Table: <code>Visits</code></h4>
            <SqlCode>{
`CREATE TABLE Visits (
    id INT AUTO_INCREMENT PRIMARY KEY,
    patientId INT NOT NULL,
    visitDate DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    department VARCHAR(255) NOT NULL,
    reasonForVisit TEXT,
    assignedDoctorId INT,
    status VARCHAR(100) NOT NULL DEFAULT 'Waiting', -- 'Waiting', 'With Doctor', 'Dispatched' etc.
    timeAdded TIME,
    createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (patientId) REFERENCES Patients(id),
    FOREIGN KEY (assignedDoctorId) REFERENCES Users(id)
);`
            }</SqlCode>
            <h5 className="text-xs font-semibold">Dummy Data for Visits:</h5>
            <SqlCode>{
`INSERT INTO Visits (patientId, department, reasonForVisit, status, timeAdded) VALUES
(1, 'Outpatient General Consultation', 'Fever and cough', 'Waiting for Doctor', CURTIME()),
(2, 'Laboratory (Scheduled Tests)', 'Routine blood work', 'Awaiting Sample Collection', CURTIME());`
            }</SqlCode>
          </section>
          <Separator />

          {/* --- Phase 3: Consultations & Diagnostic Orders --- */}
          <section>
            <h3 className="text-lg font-semibold mb-2">Phase 3: Consultations (General & Specialist) & Diagnostic Orders</h3>
             <h4 className="font-medium mt-3 mb-1">Key Entities & Tables:</h4>
            <ul className="list-disc list-inside text-sm pl-4">
              <li><code>Consultations</code></li>
              <li><code>LabOrders</code></li>
              <li><code>LabOrderItems</code> (linking order to specific tests)</li>
              <li><code>LabResults</code></li>
              <li><code>ImagingOrders</code></li>
              <li><code>ImagingReports</code></li>
            </ul>
             <h4 className="font-medium mt-3 mb-1">API Endpoints to Implement:</h4>
            <ul className="list-disc list-inside text-sm pl-4">
              <li><code>POST /api/v1/consultations</code></li>
              <li><code>POST /api/v1/consultations/drafts</code></li>
              <li><code>GET /api/v1/consultations/drafts?doctorId={'{id}'}</code></li>
              <li><code>POST /api/v1/consultations/{'{consultationId}'}/lab-orders</code></li>
              <li><code>POST /api/v1/consultations/{'{consultationId}'}/imaging-orders</code></li>
            </ul>

            <h4 className="font-medium mt-4 mb-1">Table: <code>Consultations</code></h4>
            <SqlCode>{
`CREATE TABLE Consultations (
    id INT AUTO_INCREMENT PRIMARY KEY,
    patientId INT NOT NULL,
    visitId INT UNIQUE, -- Optional: Link to an initial Visit record
    consultationDate DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    consultingDoctorId INT NOT NULL,
    department VARCHAR(255) NOT NULL, -- e.g., "Outpatient", "Cardiology"
    referringDoctorId INT,
    reasonForReferral TEXT,
    vitalsTemperatureCelsius DECIMAL(4,1),
    vitalsWeightKg DECIMAL(5,1),
    vitalsHeightCm DECIMAL(5,1),
    vitalsBmi DECIMAL(4,1),
    vitalsBloodPressure VARCHAR(50),
    symptoms TEXT,
    labResultsSummaryInput TEXT,
    imagingDataSummaryInput TEXT,
    aiDiagnosis TEXT,
    aiPrescription TEXT,
    aiRecommendations TEXT,
    doctorNotes TEXT, -- Or specialistComments
    -- finalDiagnosis TEXT, -- Consider separate table for structured diagnoses
    -- prescription TEXT, -- Consider separate table for structured prescriptions
    outcome VARCHAR(255),
    status VARCHAR(50) DEFAULT 'Completed', -- 'Draft', 'Completed'
    createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (patientId) REFERENCES Patients(id),
    FOREIGN KEY (visitId) REFERENCES Visits(id),
    FOREIGN KEY (consultingDoctorId) REFERENCES Users(id),
    FOREIGN KEY (referringDoctorId) REFERENCES Users(id)
);`
            }</SqlCode>
            <h5 className="text-xs font-semibold">Dummy Data for Consultations:</h5>
            <SqlCode>{
`INSERT INTO Consultations (patientId, consultingDoctorId, department, symptoms, doctorNotes, outcome, status) VALUES
(1, 1, 'Outpatient General Consultation', 'Patient presented with fever, cough for 3 days. Vitals: Temp 38.5C, BP 120/80.', 'Advised rest, fluids. Prescribed Paracetamol. Ordered CBC.', 'Sent Home', 'Completed'),
(2, 1, 'Cardiology', 'Follow-up for hypertension. BP 140/90 today.', 'Adjusted Lisinopril dosage. Schedule follow-up in 1 month.', 'Schedule Specialist Follow-up', 'Draft');`
            }</SqlCode>

            <h4 className="font-medium mt-4 mb-1">Table: <code>LabOrders</code></h4>
             <SqlCode>{
`CREATE TABLE LabOrders (
    id INT AUTO_INCREMENT PRIMARY KEY,
    consultationId INT NOT NULL,
    patientId INT NOT NULL,
    orderingDoctorId INT NOT NULL,
    orderDate DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    clinicalNotes TEXT,
    status VARCHAR(50) DEFAULT 'Pending', -- 'Pending', 'Sample Collected', 'Processing', 'Results Ready'
    createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (consultationId) REFERENCES Consultations(id),
    FOREIGN KEY (patientId) REFERENCES Patients(id),
    FOREIGN KEY (orderingDoctorId) REFERENCES Users(id)
);`
            }</SqlCode>
            {/* Further tables like LabOrderItems, LabResults, ImagingOrders, ImagingReports would follow */}
          </section>
          <Separator />

          {/* --- Phase 4: Ward Management & In-Patient Care --- */}
          <section>
            <h3 className="text-lg font-semibold mb-2">Phase 4: Ward Management & In-Patient Care</h3>
            <h4 className="font-medium mt-3 mb-1">Key Entities & Tables:</h4>
            <ul className="list-disc list-inside text-sm pl-4">
              <li><code>Wards</code></li>
              <li><code>Beds</code></li>
              <li><code>Admissions</code></li>
              <li><code>MedicationSchedules</code></li>
              <li><code>DoctorNotes</code> (for admissions)</li>
            </ul>
             <h4 className="font-medium mt-4 mb-1">Table: <code>Wards</code></h4>
             <SqlCode>{
`CREATE TABLE Wards (
    id VARCHAR(50) PRIMARY KEY, -- e.g., W001
    name VARCHAR(255) NOT NULL,
    totalBeds INT NOT NULL,
    facilityId VARCHAR(100), -- Link to hospital
    createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);`
            }</SqlCode>
             <h5 className="text-xs font-semibold">Dummy Data for Wards:</h5>
            <SqlCode>{
`INSERT INTO Wards (id, name, totalBeds, facilityId) VALUES
('W001', 'General Medicine Ward A', 20, 'HOSP001'),
('W002', 'Surgical Ward B', 15, 'HOSP001');`
            }</SqlCode>

             <h4 className="font-medium mt-4 mb-1">Table: <code>Beds</code></h4>
             <SqlCode>{
`CREATE TABLE Beds (
    id VARCHAR(50) PRIMARY KEY, -- e.g., B001-A
    wardId VARCHAR(50) NOT NULL,
    bedNumber VARCHAR(50) NOT NULL,
    status VARCHAR(50) DEFAULT 'Available', -- 'Available', 'Occupied', 'Cleaning'
    currentPatientId INT,
    createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (wardId) REFERENCES Wards(id),
    FOREIGN KEY (currentPatientId) REFERENCES Patients(id)
);`
            }</SqlCode>
             <h5 className="text-xs font-semibold">Dummy Data for Beds:</h5>
            <SqlCode>{
`INSERT INTO Beds (id, wardId, bedNumber, status) VALUES
('B001-W001', 'W001', 'Bed 1', 'Available'),
('B002-W001', 'W001', 'Bed 2', 'Cleaning');`
            }</SqlCode>

             <h4 className="font-medium mt-4 mb-1">Table: <code>Admissions</code></h4>
             <SqlCode>{
`CREATE TABLE Admissions (
    id INT AUTO_INCREMENT PRIMARY KEY,
    patientId INT NOT NULL,
    wardId VARCHAR(50) NOT NULL,
    bedId VARCHAR(50) NOT NULL,
    admissionDate DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    dischargeDate DATETIME,
    admittingDoctorId INT NOT NULL,
    primaryDiagnosis TEXT,
    treatmentPlan TEXT,
    codeStatus VARCHAR(50), -- 'Full Code', 'DNR'
    status VARCHAR(50) DEFAULT 'Admitted', -- 'Admitted', 'Discharged', 'Transferred'
    createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (patientId) REFERENCES Patients(id),
    FOREIGN KEY (wardId) REFERENCES Wards(id),
    FOREIGN KEY (bedId) REFERENCES Beds(id),
    FOREIGN KEY (admittingDoctorId) REFERENCES Users(id)
);`
            }</SqlCode>
             <h5 className="text-xs font-semibold">Dummy Data for Admissions:</h5>
            <SqlCode>{
`-- Assuming Demo Patient One (Patients.id=1) is admitted by Dr. Smith (Users.id=1) to Bed 1 of Ward A
INSERT INTO Admissions (patientId, wardId, bedId, admittingDoctorId, primaryDiagnosis, treatmentPlan) VALUES
(1, 'W001', 'B001-W001', 1, 'Severe Pneumonia', 'IV Antibiotics, Oxygen PRN, Monitor Vitals Q4H');`
            }</SqlCode>
            {/* Further tables like MedicationSchedules, DoctorNotes (for admissions) would follow */}
          </section>
          <Separator />
           {/* --- Phase 5: Laboratory & Imaging Management --- */}
          <section>
            <h3 className="text-lg font-semibold mb-2">Phase 5: Laboratory & Imaging Inventory & Requisitions</h3>
             <h4 className="font-medium mt-3 mb-1">Key Entities & Tables:</h4>
            <ul className="list-disc list-inside text-sm pl-4">
                <li><code>LabReagents</code> (Inventory)</li>
                <li><code>LabRequisitions</code> (Requisition Log)</li>
                <li><code>ImagingInstruments</code> (Conceptual, part of future Biomedical module)</li>
                <li><code>ImagingConsumables</code> (Inventory, if applicable)</li>
            </ul>
             <h4 className="font-medium mt-4 mb-1">Table: <code>LabReagents</code> (Inventory)</h4>
             <SqlCode>{
`CREATE TABLE LabReagents (
    id VARCHAR(50) PRIMARY KEY, -- e.g., RG001
    name VARCHAR(255) NOT NULL,
    currentStock INT NOT NULL DEFAULT 0,
    threshold INT NOT NULL DEFAULT 10,
    unit VARCHAR(100) NOT NULL, -- e.g., 'packs', 'strips (box of 50)'
    facilityId VARCHAR(100), -- Which lab/hospital this stock belongs to
    lastOrderedDate DATE,
    supplier VARCHAR(255),
    createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);`
            }</SqlCode>
             <h5 className="text-xs font-semibold">Dummy Data for LabReagents:</h5>
            <SqlCode>{
`INSERT INTO LabReagents (id, name, currentStock, threshold, unit, facilityId) VALUES
('RG001', 'Hematology Reagent Pack', 50, 20, 'packs', 'HOSP001_LAB'),
('RG002', 'Glucose Test Strips', 150, 100, 'strips (box of 50)', 'HOSP001_LAB');`
            }</SqlCode>

             <h4 className="font-medium mt-4 mb-1">Table: <code>LabRequisitions</code></h4>
             <SqlCode>{
`CREATE TABLE LabRequisitions (
    id INT AUTO_INCREMENT PRIMARY KEY,
    requestingLabId VARCHAR(100) NOT NULL, -- e.g., HOSP001_LAB
    submittedByUserId INT NOT NULL,
    dateSubmitted DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    status VARCHAR(50) DEFAULT 'Pending', -- 'Pending', 'Partially Fulfilled', 'Fulfilled', 'Cancelled'
    notes TEXT,
    createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (submittedByUserId) REFERENCES Users(id)
);`
            }</SqlCode>
            {/* A linking table LabRequisitionItems (requisitionId, reagentId, requestedQuantity, fulfilledQuantity) would be needed */}
          </section>
          <Separator />

          {/* --- Phase 6: Pharmacy & Drug Dispensing --- */}
          <section>
            <h3 className="text-lg font-semibold mb-2">Phase 6: Pharmacy & Drug Dispensing</h3>
             <h4 className="font-medium mt-3 mb-1">Key Entities & Tables:</h4>
            <ul className="list-disc list-inside text-sm pl-4">
                <li><code>PharmacyItems</code> (Inventory)</li>
                <li><code>PharmacyPrescriptions</code> (could link to Consultations or be standalone)</li>
                <li><code>PharmacyRequisitions</code></li>
            </ul>
             <h4 className="font-medium mt-4 mb-1">Table: <code>PharmacyItems</code> (Inventory)</h4>
             <SqlCode>{
`CREATE TABLE PharmacyItems (
    id VARCHAR(50) PRIMARY KEY, -- e.g., MED001
    name VARCHAR(255) NOT NULL, -- e.g., Amoxicillin 250mg
    currentStock INT NOT NULL DEFAULT 0,
    threshold INT NOT NULL DEFAULT 20,
    unit VARCHAR(100) NOT NULL, -- e.g., 'capsules', 'tablets'
    facilityId VARCHAR(100), -- Which pharmacy this stock belongs to
    lastOrderedDate DATE,
    supplier VARCHAR(255),
    createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);`
            }</SqlCode>
             <h5 className="text-xs font-semibold">Dummy Data for PharmacyItems:</h5>
            <SqlCode>{
`INSERT INTO PharmacyItems (id, name, currentStock, threshold, unit, facilityId) VALUES
('MED001', 'Amoxicillin 250mg', 50, 100, 'capsules', 'HOSP001_PHARM'),
('MED002', 'Paracetamol 500mg', 200, 150, 'tablets', 'HOSP001_PHARM');`
            }</SqlCode>
            {/* Tables for PharmacyPrescriptions and PharmacyRequisitions would follow a similar pattern to their Lab counterparts. */}
          </section>
          <Separator />

          {/* --- Phase 7: Specialized Modules & Advanced Features --- */}
          <section>
            <h3 className="text-lg font-semibold mb-2">Phase 7: Specialized Modules & Advanced Features</h3>
            <p className="text-sm text-muted-foreground mb-2">
              Implement Maternity Care details, Emergency Room workflows, Epidemic Control, Campaigns, Comprehensive Reporting, Billing, Telemedicine, etc.
              Database schemas for these will be defined as each module is tackled. This will involve new tables and potentially modifications to existing ones.
            </p>
          </section>
          <Separator />

          <h3 className="text-lg font-semibold mt-4 mb-2">4. Data Relationships (High-Level Overview)</h3>
          <ul className="list-disc list-inside text-sm pl-4 space-y-1">
            <li><strong>Patients to Appointments/Visits/Consultations/Admissions:</strong> One-to-Many.</li>
            <li><strong>Users (Doctors/Nurses) to Appointments/Consultations/Admissions:</strong> One-to-Many.</li>
            <li><strong>Wards to Beds:</strong> One-to-Many.</li>
            <li><strong>Beds to Admissions:</strong> One-to-One (a bed has one current admission, an admission is in one bed).</li>
            <li><strong>Wards to Admissions:</strong> One-to-Many.</li>
            <li><strong>Patients to Admissions:</strong> One-to-Many (a patient can have multiple admissions over time).</li>
            <li><strong>Consultations to LabOrders/ImagingOrders:</strong> One-to-Many.</li>
            <li><strong>LabOrders to LabOrderItems/LabResults:</strong> One-to-Many.</li>
            <li><strong>Prescriptions to Patients/Consultations.</strong></li>
            <li><strong>(Pharmacy/Lab)Requisitions to RequisitionItems:</strong> One-to-Many.</li>
          </ul>
          <p className="text-xs text-muted-foreground mt-1">(A more detailed Entity Relationship Diagram (ERD) would be beneficial in a full backend design document).</p>
          <Separator />

          <h3 className="text-lg font-semibold mt-4 mb-2">5. Key Backend Considerations</h3>
           <ul className="list-disc list-inside text-sm pl-4 space-y-1">
            <li><strong>Error Handling:</strong> Consistent error responses (e.g., standard JSON error objects with status codes).</li>
            <li><strong>Validation:</strong> Robust input validation for all API requests (e.g., using Joi or express-validator).</li>
            <li><strong>Security:</strong> Password hashing (e.g., bcrypt), protection against SQL injection, XSS, CSRF. Implement HTTPS.</li>
            <li><strong>Data Integrity:</strong> Use of database transactions for operations involving multiple table updates.</li>
            <li><strong>Hierarchical Data Access:</strong> Design logic for filtering and aggregating data based on user role and their assigned facility level (hospital, district, province, national).</li>
            <li><strong>Logging:</strong> Comprehensive logging for API requests, errors, and significant events for debugging and auditing.</li>
            <li><strong>Configuration Management:</strong> Securely manage database credentials, API keys, and other sensitive configurations using environment variables.</li>
            <li><strong>Scalability:</strong> Design with scalability in mind (e.g., efficient queries, potential for read replicas, caching strategies).</li>
            <li><strong>Testing:</strong> Implement unit, integration, and end-to-end tests for the backend APIs.</li>
            <li><strong>Database Migrations:</strong> Use a migration tool (e.g., db-migrate, Sequelize migrations, Knex migrations) to manage schema changes versionally.</li>
          </ul>
        </CardContent>
      </Card>
    </div>
  );
}

