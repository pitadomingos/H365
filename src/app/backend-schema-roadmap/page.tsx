
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
              <li><code>Facilities</code> (basic table for hospitals/clinics)</li>
            </ul>
            <h4 className="font-medium mt-3 mb-1">API Endpoints to Implement:</h4>
            <ul className="list-disc list-inside text-sm pl-4">
              <li><code>POST /api/v1/auth/login</code></li>
              <li><code>GET /api/v1/auth/me</code></li>
              <li><code>POST /api/v1/patients</code></li>
              <li><code>GET /api/v1/patients/search?nationalId={'{nationalId}'}</code></li>
              <li><code>GET /api/v1/patients/{'{patientId}'}</code> (basic version)</li>
            </ul>

            <h4 className="font-medium mt-4 mb-1">Table: <code>Facilities</code></h4>
            <SqlCode>{
`CREATE TABLE Facilities (
    id VARCHAR(100) PRIMARY KEY, -- e.g., HOSP001, CLINIC002
    name VARCHAR(255) NOT NULL,
    type VARCHAR(50) NOT NULL, -- e.g., 'Hospital', 'Clinic', 'District Warehouse', 'National Warehouse'
    district VARCHAR(255),
    province VARCHAR(255),
    level VARCHAR(50), -- e.g., 'Primary', 'Secondary', 'Tertiary', 'District', 'Provincial', 'National'
    createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);`
            }</SqlCode>
            <h5 className="text-xs font-semibold">Dummy Data for Facilities:</h5>
            <SqlCode>{
`INSERT INTO Facilities (id, name, type, district, province, level) VALUES
('HOSP001', 'HealthFlow Central Hospital', 'Hospital', 'Wellness District', 'Health Province', 'Tertiary'),
('WH_DIST_WELL', 'Wellness District Warehouse', 'District Warehouse', 'Wellness District', 'Health Province', 'District');`
            }</SqlCode>


            <h4 className="font-medium mt-4 mb-1">Table: <code>Users</code></h4>
            <SqlCode>{
`CREATE TABLE Users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(100) NOT NULL UNIQUE,
    passwordHash VARCHAR(255) NOT NULL,
    fullName VARCHAR(255) NOT NULL,
    role VARCHAR(50) NOT NULL, -- e.g., 'Doctor', 'Nurse', 'Admin', 'LabTech', 'Pharmacist', 'DistrictOfficer'
    facilityId VARCHAR(100), -- Link to a facility in the Facilities table
    isActive BOOLEAN DEFAULT TRUE,
    createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (facilityId) REFERENCES Facilities(id)
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
              <li><code>Appointments</code></li>
              <li><code>Visits</code></li>
            </ul>
             <h4 className="font-medium mt-3 mb-1">API Endpoints to Implement:</h4>
            <ul className="list-disc list-inside text-sm pl-4">
              <li><code>GET /api/v1/doctors</code> (filter Users by role 'Doctor')</li>
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
    FOREIGN KEY (doctorId) REFERENCES Users(id)
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
    facilityId VARCHAR(100) NOT NULL, -- Where the visit is happening
    visitDate DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    department VARCHAR(255) NOT NULL,
    reasonForVisit TEXT,
    assignedDoctorId INT,
    status VARCHAR(100) NOT NULL DEFAULT 'Waiting', -- 'Waiting', 'With Doctor', 'Dispatched' etc.
    timeAdded TIME,
    createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (patientId) REFERENCES Patients(id),
    FOREIGN KEY (facilityId) REFERENCES Facilities(id),
    FOREIGN KEY (assignedDoctorId) REFERENCES Users(id)
);`
            }</SqlCode>
            <h5 className="text-xs font-semibold">Dummy Data for Visits:</h5>
            <SqlCode>{
`INSERT INTO Visits (patientId, facilityId, visitDate, department, reasonForVisit, status, timeAdded) VALUES
(1, 'HOSP001', NOW(), 'Outpatient General Consultation', 'Fever and cough', 'Waiting for Doctor', CURTIME()),
(2, 'HOSP001', NOW(), 'Laboratory (Scheduled Tests)', 'Routine blood work', 'Awaiting Sample Collection', CURTIME());`
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
              <li><code>LabResults</code> (detailed, per test item)</li>
              <li><code>ImagingOrders</code></li>
              <li><code>ImagingReports</code></li>
              <li><code>Notifications</code> (For lab/imaging results, referrals etc.)</li>
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
    facilityId VARCHAR(100) NOT NULL,
    department VARCHAR(255) NOT NULL, -- e.g., "Outpatient", "Cardiology"
    referringDoctorId INT,
    reasonForReferral TEXT,
    vitalsTemperatureCelsius DECIMAL(4,1),
    vitalsWeightKg DECIMAL(5,1),
    vitalsHeightCm DECIMAL(5,1),
    vitalsBmi DECIMAL(4,1),
    vitalsBloodPressure VARCHAR(50),
    symptoms TEXT,
    labResultsSummaryInput TEXT, -- Summary entered by doctor for AI
    imagingDataSummaryInput TEXT, -- Summary entered by doctor for AI
    aiDiagnosis TEXT,
    aiPrescription TEXT,
    aiRecommendations TEXT,
    doctorNotes TEXT, -- Or specialistComments
    finalDiagnosis TEXT, -- Doctor's final diagnosis
    prescription TEXT, -- Doctor's final prescription
    outcome VARCHAR(255), -- e.g., "Sent Home", "Admitted", "Referred"
    status VARCHAR(50) DEFAULT 'Completed', -- 'Draft', 'Completed'
    createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (patientId) REFERENCES Patients(id),
    FOREIGN KEY (visitId) REFERENCES Visits(id),
    FOREIGN KEY (consultingDoctorId) REFERENCES Users(id),
    FOREIGN KEY (facilityId) REFERENCES Facilities(id),
    FOREIGN KEY (referringDoctorId) REFERENCES Users(id)
);`
            }</SqlCode>
            <h5 className="text-xs font-semibold">Dummy Data for Consultations:</h5>
            <SqlCode>{
`INSERT INTO Consultations (patientId, consultingDoctorId, facilityId, department, symptoms, doctorNotes, outcome, status) VALUES
(1, 1, 'HOSP001', 'Outpatient General Consultation', 'Patient presented with fever, cough for 3 days. Vitals: Temp 38.5C, BP 120/80.', 'Advised rest, fluids. Prescribed Paracetamol. Ordered CBC.', 'Sent Home', 'Completed'),
(2, 1, 'HOSP001', 'Cardiology', 'Follow-up for hypertension. BP 140/90 today.', 'Adjusted Lisinopril dosage. Schedule follow-up in 1 month.', 'Schedule Specialist Follow-up', 'Draft');`
            }</SqlCode>

            <h4 className="font-medium mt-4 mb-1">Table: <code>LabOrders</code></h4>
             <SqlCode>{
`CREATE TABLE LabOrders (
    id INT AUTO_INCREMENT PRIMARY KEY,
    consultationId INT NOT NULL,
    patientId INT NOT NULL,
    orderingDoctorId INT NOT NULL,
    facilityId VARCHAR(100) NOT NULL,
    orderDate DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    clinicalNotes TEXT,
    status VARCHAR(50) DEFAULT 'Pending', -- 'Pending', 'Sample Collected', 'Processing', 'Results Ready', 'Cancelled'
    createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (consultationId) REFERENCES Consultations(id),
    FOREIGN KEY (patientId) REFERENCES Patients(id),
    FOREIGN KEY (orderingDoctorId) REFERENCES Users(id),
    FOREIGN KEY (facilityId) REFERENCES Facilities(id)
);`
            }</SqlCode>

             <h4 className="font-medium mt-4 mb-1">Table: <code>LabOrderItems</code></h4>
             <SqlCode>{
`CREATE TABLE LabOrderItems (
    id INT AUTO_INCREMENT PRIMARY KEY,
    labOrderId INT NOT NULL,
    testId VARCHAR(255) NOT NULL, -- Corresponds to COMMON_ORDERABLE_LAB_TESTS IDs
    testName VARCHAR(255) NOT NULL, -- Human-readable test name at time of order
    createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (labOrderId) REFERENCES LabOrders(id)
);`
            }</SqlCode>

            <h4 className="font-medium mt-4 mb-1">Table: <code>Notifications</code></h4>
            <SqlCode>{
`CREATE TABLE Notifications (
    id INT AUTO_INCREMENT PRIMARY KEY,
    userId INT NOT NULL, -- Recipient User ID
    type VARCHAR(100) NOT NULL, -- e.g., 'LAB_RESULT_READY', 'IMAGING_REPORT_READY', 'NEW_REFERRAL'
    message TEXT NOT NULL,
    relatedEntityId VARCHAR(255), -- e.g., patientId, consultationId, labOrderId
    relatedEntityType VARCHAR(100), -- e.g., 'PATIENT', 'CONSULTATION', 'LAB_ORDER'
    isRead BOOLEAN DEFAULT FALSE,
    link VARCHAR(1024), -- Optional deep link into the application
    createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (userId) REFERENCES Users(id)
);`
            }</SqlCode>
            <h5 className="text-xs font-semibold">Dummy Data for Notifications:</h5>
             <SqlCode>{
`-- Assuming Dr. Smith (Users.id = 1) ordered tests for Patient One (Patients.id = 1) via LabOrder LO001
INSERT INTO Notifications (userId, type, message, relatedEntityId, relatedEntityType, link) VALUES
(1, 'LAB_RESULT_READY', 'Lab results for Demo Patient One (Order LO001) are now available.', 'LO001', 'LAB_ORDER', '/laboratory-management?requestId=LO001'),
(1, 'NEW_REFERRAL', 'New referral: Jane Sample Doe to Cardiology by Dr. Primary Care.', '2', 'PATIENT', '/specializations?patientId=2');`
            }</SqlCode>
            {/* Further tables like LabResults, ImagingOrders, ImagingReports would follow */}
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
              <li><code>AdmissionDoctorNotes</code></li>
            </ul>
             <h4 className="font-medium mt-4 mb-1">Table: <code>Wards</code></h4>
             <SqlCode>{
`CREATE TABLE Wards (
    id VARCHAR(50) PRIMARY KEY, -- e.g., W001
    name VARCHAR(255) NOT NULL,
    facilityId VARCHAR(100) NOT NULL,
    totalBeds INT NOT NULL,
    createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (facilityId) REFERENCES Facilities(id)
);`
            }</SqlCode>
             <h5 className="text-xs font-semibold">Dummy Data for Wards:</h5>
            <SqlCode>{
`INSERT INTO Wards (id, name, facilityId, totalBeds) VALUES
('W001', 'General Medicine Ward A', 'HOSP001', 20),
('W002', 'Surgical Ward B', 'HOSP001', 15);`
            }</SqlCode>

             <h4 className="font-medium mt-4 mb-1">Table: <code>Beds</code></h4>
             <SqlCode>{
`CREATE TABLE Beds (
    id VARCHAR(50) PRIMARY KEY, -- e.g., B001-W001
    wardId VARCHAR(50) NOT NULL,
    bedNumber VARCHAR(50) NOT NULL,
    status VARCHAR(50) DEFAULT 'Available', -- 'Available', 'Occupied', 'Cleaning'
    currentAdmissionId INT, -- Changed from currentPatientId to currentAdmissionId
    createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (wardId) REFERENCES Wards(id),
    FOREIGN KEY (currentAdmissionId) REFERENCES Admissions(id)
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
    bedId VARCHAR(50), -- Can be initially null if assigned later
    facilityId VARCHAR(100) NOT NULL,
    admissionDate DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    dischargeDate DATETIME,
    admittingDoctorId INT NOT NULL,
    primaryDiagnosis TEXT,
    treatmentPlan TEXT,
    codeStatus VARCHAR(50), -- 'Full Code', 'DNR'
    status VARCHAR(50) DEFAULT 'Admitted', -- 'Admitted', 'Discharged', 'Transferred'
    referringDepartment VARCHAR(255),
    reasonForAdmission TEXT,
    transferType VARCHAR(50), -- 'internal_ward', 'external_hospital'
    destinationWardId VARCHAR(50),
    destinationFacility VARCHAR(255),
    transferReason TEXT,
    transferredByUserId INT,
    dischargeSummary TEXT,
    dischargedByUserId INT,
    vitalsTemperatureCelsius DECIMAL(4,1),
    vitalsWeightKg DECIMAL(5,1),
    vitalsHeightCm DECIMAL(5,1),
    vitalsBloodPressure VARCHAR(50),
    createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (patientId) REFERENCES Patients(id),
    FOREIGN KEY (wardId) REFERENCES Wards(id),
    FOREIGN KEY (bedId) REFERENCES Beds(id),
    FOREIGN KEY (facilityId) REFERENCES Facilities(id),
    FOREIGN KEY (admittingDoctorId) REFERENCES Users(id),
    FOREIGN KEY (transferredByUserId) REFERENCES Users(id),
    FOREIGN KEY (dischargedByUserId) REFERENCES Users(id),
    FOREIGN KEY (destinationWardId) REFERENCES Wards(id)
);`
            }</SqlCode>
             <h5 className="text-xs font-semibold">Dummy Data for Admissions:</h5>
            <SqlCode>{
`-- Assuming Demo Patient One (Patients.id=1) is admitted by Dr. Smith (Users.id=1)
INSERT INTO Admissions (patientId, wardId, bedId, facilityId, admittingDoctorId, primaryDiagnosis, treatmentPlan) VALUES
(1, 'W001', 'B001-W001', 'HOSP001', 1, 'Severe Pneumonia', 'IV Antibiotics, Oxygen PRN, Monitor Vitals Q4H');
-- Update Bed B001-W001 to be occupied by this admission (assuming admission ID is 1)
-- UPDATE Beds SET status = 'Occupied', currentAdmissionId = 1 WHERE id = 'B001-W001';`
            }</SqlCode>

             <h4 className="font-medium mt-4 mb-1">Table: <code>MedicationSchedules</code></h4>
             <SqlCode>{
`CREATE TABLE MedicationSchedules (
    id INT AUTO_INCREMENT PRIMARY KEY,
    admissionId INT NOT NULL,
    medicationItemId VARCHAR(100) NOT NULL, -- Could be a temporary ID if added ad-hoc, or from a drug master
    medication VARCHAR(255) NOT NULL,
    dosage VARCHAR(255) NOT NULL,
    route VARCHAR(100), -- e.g., PO, IV, IM
    frequency VARCHAR(100), -- e.g., TID, BID, PRN
    time VARCHAR(50) NOT NULL, -- Scheduled time or 'PRN'
    status VARCHAR(50) DEFAULT 'Pending', -- 'Pending', 'Administered', 'Skipped'
    notes TEXT,
    administeredByUserId INT,
    administeredAt DATETIME,
    createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (admissionId) REFERENCES Admissions(id),
    FOREIGN KEY (administeredByUserId) REFERENCES Users(id)
);`
            }</SqlCode>

             <h4 className="font-medium mt-4 mb-1">Table: <code>AdmissionDoctorNotes</code></h4>
             <SqlCode>{
`CREATE TABLE AdmissionDoctorNotes (
    id INT AUTO_INCREMENT PRIMARY KEY,
    admissionId INT NOT NULL,
    doctorId INT NOT NULL,
    note TEXT NOT NULL,
    noteDate DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (admissionId) REFERENCES Admissions(id),
    FOREIGN KEY (doctorId) REFERENCES Users(id)
);`
            }</SqlCode>

          </section>
          <Separator />
           {/* --- Phase 5: Laboratory & Imaging Management --- */}
          <section>
            <h3 className="text-lg font-semibold mb-2">Phase 5: Laboratory & Imaging Inventory & Requisitions</h3>
             <h4 className="font-medium mt-3 mb-1">Key Entities & Tables:</h4>
            <ul className="list-disc list-inside text-sm pl-4">
                <li><code>LabReagents</code> (Inventory)</li>
                <li><code>LabRequisitions</code> (Requisition Log)</li>
                <li><code>LabRequisitionItems</code></li>
                <li><code>EquipmentMalfunctions</code> (Shared for Lab/Imaging)</li>
            </ul>
             <h4 className="font-medium mt-4 mb-1">Table: <code>LabReagents</code> (Inventory)</h4>
             <SqlCode>{
`CREATE TABLE LabReagents (
    id VARCHAR(50) PRIMARY KEY, -- e.g., RG001
    name VARCHAR(255) NOT NULL,
    currentStock INT NOT NULL DEFAULT 0,
    threshold INT NOT NULL DEFAULT 10,
    unit VARCHAR(100) NOT NULL, -- e.g., 'packs', 'strips (box of 50)'
    facilityId VARCHAR(100) NOT NULL,
    lastOrderedDate DATE,
    supplier VARCHAR(255),
    createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (facilityId) REFERENCES Facilities(id)
);`
            }</SqlCode>
             <h5 className="text-xs font-semibold">Dummy Data for LabReagents:</h5>
            <SqlCode>{
`INSERT INTO LabReagents (id, name, currentStock, threshold, unit, facilityId) VALUES
('RG001', 'Hematology Reagent Pack', 50, 20, 'packs', 'HOSP001'),
('RG002', 'Glucose Test Strips', 150, 100, 'strips (box of 50)', 'HOSP001');`
            }</SqlCode>

             <h4 className="font-medium mt-4 mb-1">Table: <code>LabRequisitions</code></h4>
             <SqlCode>{
`CREATE TABLE LabRequisitions (
    id INT AUTO_INCREMENT PRIMARY KEY,
    requestingFacilityId VARCHAR(100) NOT NULL,
    submittedByUserId INT NOT NULL,
    dateSubmitted DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    status VARCHAR(50) DEFAULT 'Pending', -- 'Pending', 'Partially Fulfilled', 'Fulfilled', 'Cancelled'
    notes TEXT,
    createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (requestingFacilityId) REFERENCES Facilities(id),
    FOREIGN KEY (submittedByUserId) REFERENCES Users(id)
);`
            }</SqlCode>

            <h4 className="font-medium mt-4 mb-1">Table: <code>LabRequisitionItems</code></h4>
             <SqlCode>{
`CREATE TABLE LabRequisitionItems (
    id INT AUTO_INCREMENT PRIMARY KEY,
    labRequisitionId INT NOT NULL,
    reagentId VARCHAR(50) NOT NULL,
    reagentName VARCHAR(255) NOT NULL,
    requestedQuantity INT NOT NULL,
    fulfilledQuantity INT DEFAULT 0,
    createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (labRequisitionId) REFERENCES LabRequisitions(id),
    FOREIGN KEY (reagentId) REFERENCES LabReagents(id)
);`
            }</SqlCode>

             <h4 className="font-medium mt-4 mb-1">Table: <code>EquipmentMalfunctions</code></h4>
             <SqlCode>{
`CREATE TABLE EquipmentMalfunctions (
    id INT AUTO_INCREMENT PRIMARY KEY,
    assetNumber VARCHAR(255) NOT NULL,
    instrumentName VARCHAR(255),
    department VARCHAR(100) NOT NULL, -- 'Laboratory', 'Imaging/Radiology', 'Ward'
    problemDescription TEXT NOT NULL,
    reportedByUserId INT NOT NULL,
    reportDateTime DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    status VARCHAR(50) DEFAULT 'Reported', -- 'Reported', 'In Progress', 'Resolved'
    resolvedAt DATETIME,
    resolutionNotes TEXT,
    createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (reportedByUserId) REFERENCES Users(id)
);`
            }</SqlCode>

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
                <li><code>PharmacyRequisitionItems</code></li>
            </ul>
             <h4 className="font-medium mt-4 mb-1">Table: <code>PharmacyItems</code> (Inventory)</h4>
             <SqlCode>{
`CREATE TABLE PharmacyItems (
    id VARCHAR(50) PRIMARY KEY, -- e.g., MED001
    name VARCHAR(255) NOT NULL, -- e.g., Amoxicillin 250mg
    currentStock INT NOT NULL DEFAULT 0,
    threshold INT NOT NULL DEFAULT 20,
    unit VARCHAR(100) NOT NULL, -- e.g., 'capsules', 'tablets'
    facilityId VARCHAR(100) NOT NULL,
    lastOrderedDate DATE,
    supplier VARCHAR(255),
    createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (facilityId) REFERENCES Facilities(id)
);`
            }</SqlCode>
             <h5 className="text-xs font-semibold">Dummy Data for PharmacyItems:</h5>
            <SqlCode>{
`INSERT INTO PharmacyItems (id, name, currentStock, threshold, unit, facilityId) VALUES
('MED001', 'Amoxicillin 250mg', 50, 100, 'capsules', 'HOSP001'),
('MED002', 'Paracetamol 500mg', 200, 150, 'tablets', 'HOSP001');`
            }</SqlCode>
             {/* Tables for PharmacyPrescriptions, PharmacyRequisitions, PharmacyRequisitionItems would follow a similar pattern. */}
          </section>
          <Separator />

          {/* --- Phase 7: Specialized Modules & Advanced Features --- */}
          <section>
            <h3 className="text-lg font-semibold mb-2">Phase 7: Specialized Modules & Advanced Features</h3>
            <p className="text-sm text-muted-foreground mb-2">
              Implement Maternity Care details, Emergency Room workflows, Epidemic Control, Campaigns, Comprehensive Reporting, Billing, Telemedicine, etc.
              Database schemas for these will be defined as each module is tackled. This will involve new tables and potentially modifications to existing ones.
            </p>
            <h4 className="font-medium mt-4 mb-1">Example Table: <code>AntenatalVisits</code> (for Maternity Care)</h4>
            <SqlCode>{
`CREATE TABLE AntenatalVisits (
    id INT AUTO_INCREMENT PRIMARY KEY,
    patientId INT NOT NULL,
    maternityProfileId INT, -- If you have a separate MaternityPatientProfiles table
    visitDate DATE NOT NULL,
    gestationalAge VARCHAR(50),
    weightKg DECIMAL(5,1),
    bp VARCHAR(50),
    fhrBpm VARCHAR(50),
    fundalHeightCm VARCHAR(50),
    notes TEXT,
    nextAppointmentDate DATE,
    bodyTemperatureCelsius DECIMAL(4,1),
    heightCm DECIMAL(5,1),
    createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (patientId) REFERENCES Patients(id)
    -- FOREIGN KEY (maternityProfileId) REFERENCES MaternityPatientProfiles(id)
);`
            }</SqlCode>
          </section>
          <Separator />

          <h3 className="text-lg font-semibold mt-4 mb-2">4. Data Considerations for Dynamic Lists & History</h3>
            <h4 className="font-medium mt-3 mb-1">Patient Visit History:</h4>
            <p className="text-sm text-muted-foreground">
              Patient visit history is not stored in a single table. It's a derived view or a result of querying and combining data from <code>Visits</code>, <code>Appointments</code>, <code>Consultations</code>, and <code>Admissions</code> tables, all linked by <code>patientId</code> and ordered by date. The backend API serving this history (e.g., <code>GET /api/v1/patients/{'{patientId}'}/history</code>) would handle this complex query logic.
            </p>
             <h4 className="font-medium mt-3 mb-1">Waiting Lists:</h4>
            <p className="text-sm text-muted-foreground">
              The <code>Visits</code> table (with its <code>status</code>, <code>department</code>, <code>facilityId</code>, and <code>visitDate</code> fields) serves as the basis for various waiting lists. Different modules (e.g., Consultation Room, Lab, Imaging) would query this table with appropriate filters (e.g., by department, status='Waiting', facilityId).
            </p>
             <h4 className="font-medium mt-3 mb-1">Lab/Imaging Notifications:</h4>
            <p className="text-sm text-muted-foreground">
              A dedicated <code>Notifications</code> table (schema provided in Phase 3) is crucial. This table links users to events like "Lab result ready" or "New referral". The backend would create entries in this table when relevant events occur (e.g., lab results are finalized).
            </p>
            <h4 className="font-medium mt-3 mb-1">Incomplete/Drafted Consultations:</h4>
            <p className="text-sm text-muted-foreground">
              The <code>Consultations</code> table, with its <code>status</code> field (e.g., 'Draft', 'Completed') and <code>consultingDoctorId</code>, is queried to populate lists of drafted consultations for a specific doctor (e.g., via <code>GET /api/v1/consultations/drafts?doctorId={'{id}'}</code>).
            </p>


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
      