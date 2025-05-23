
"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Network, Server, Share2 } from "lucide-react";
import { Separator } from "@/components/ui/separator";

export default function ArchitectureOptionsPage() {

  // Helper to render code blocks nicely
  const CodeBlock = ({ children }: { children: React.ReactNode }) => (
    <pre className="bg-muted p-3 rounded-md text-sm overflow-x-auto my-2">
      <code className="font-mono">{children}</code>
    </pre>
  );

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight flex items-center gap-2">
          <Network className="h-8 w-8" /> H365: Backend Architecture Options
        </h1>
      </div>

      <Card className="shadow-sm">
        <CardHeader>
          <CardTitle className="text-xl">Introduction</CardTitle>
        </CardHeader>
        <CardContent className="prose dark:prose-invert max-w-none">
          <p>
            This document outlines two primary architectural approaches for the H365 backend: Monolithic and Microservices.
            Understanding these options is crucial for making informed decisions about the system's development, scalability, and maintenance.
          </p>
          <p className="text-sm text-muted-foreground">
            <strong>Is H365 a SaaS (Software as a Service)?</strong> As prototyped (frontend only), it's not SaaS.
            For its intended use by a national health ministry, it would be a centrally managed enterprise application or private cloud deployment.
            If hosted and offered as a subscription to multiple independent entities, it would fit the SaaS model.
          </p>
        </CardContent>
      </Card>

      <Card className="shadow-sm">
        <CardHeader>
          <CardTitle className="text-xl flex items-center gap-2"><Server className="h-6 w-6" /> Monolithic Architecture</CardTitle>
        </CardHeader>
        <CardContent className="prose dark:prose-invert max-w-none">
          <h4>Description for H365:</h4>
          <p>
            In a monolithic architecture, the entire H365 backend application (all modules like Patient Management, Appointments, Ward Management, Laboratory, Pharmacy, etc.) would be built and deployed as a single, unified unit. It would typically connect to a single, comprehensive database (e.g., the Aiven MySQL database).
          </p>
          <p>
            All business logic, data access, and API endpoints for all modules would reside within this single codebase. The Node.js/Express application would handle routing to different module functionalities.
          </p>

          <h4>Pros:</h4>
          <ul>
            <li><strong>Simpler Development & Deployment (Initially):</strong> Easier to get started, build, test, and deploy because it's one codebase and one application.</li>
            <li><strong>Easier Code Sharing & Refactoring:</strong> Components and utilities can be easily shared across different parts of the application.</li>
            <li><strong>Simplified Local Development:</strong> Running the entire backend locally is straightforward.</li>
            <li><strong>Performance (for some use cases):</strong> Intra-application communication is via direct function calls, which can be very fast. No network latency between internal components.</li>
            <li><strong>Reduced Operational Complexity (Initially):</strong> Managing one application instance can be simpler than managing multiple services.</li>
          </ul>

          <h4>Cons:</h4>
          <ul>
            <li><strong>Scalability Challenges:</strong> Scaling the application means scaling the entire monolith, even if only one part (e.g., Pharmacy) is experiencing high load. This can be inefficient.</li>
            <li><strong>Technology Stack Lock-in:</strong> The entire application is tied to a single technology stack (Node.js/Express in this case).</li>
            <li><strong>Slower Development Cycles (as it grows):</strong> As the codebase grows, build times can increase, and making changes in one part can unintentionally impact others, leading to more complex testing.</li>
            <li><strong>Reliability/Fault Tolerance:</strong> A critical bug or failure in one module can potentially bring down the entire application.</li>
            <li><strong>Difficult to Adopt New Technologies:</strong> Rewriting or adopting new technologies for a specific module becomes a much larger undertaking.</li>
            <li><strong>Larger Codebase Complexity:</strong> Over time, a large monolithic codebase can become difficult to understand, maintain, and onboard new developers.</li>
          </ul>
        </CardContent>
      </Card>

      <Separator className="my-4" />

      <Card className="shadow-sm">
        <CardHeader>
          <CardTitle className="text-xl flex items-center gap-2"><Share2 className="h-6 w-6" /> Microservices Architecture</CardTitle>
        </CardHeader>
        <CardContent className="prose dark:prose-invert max-w-none">
          <h4>Description for H365:</h4>
          <p>
            H365 would be broken down into smaller, independent services, each focused on a specific business domain or module.
            For example:
          </p>
          <ul>
            <li><strong>User & Auth Service:</strong> Manages users, roles, authentication, authorization.</li>
            <li><strong>Patient Service:</strong> Core patient demographics and registration.</li>
            <li><strong>Scheduling Service:</strong> Handles appointments and doctor schedules.</li>
            <li><strong>Clinical Encounter Service:</strong> Manages visits, consultations (general & specialist).</li>
            <li><strong>Maternity Service:</strong> Specific maternity care records.</li>
            <li><strong>Ward Management Service:</strong> In-patient admissions, bed management, care plans.</li>
            <li><strong>Laboratory Service:</strong> Lab orders, results, reagent inventory.</li>
            <li><strong>Imaging Service:</strong> Imaging orders, reports.</li>
            <li><strong>Pharmacy Service:</strong> Prescriptions, dispensing, drug inventory.</li>
            <li><strong>Notification Service:</strong> Handles alerts and notifications.</li>
            <li><em>(And potentially separate services for ER, Epidemic Control, Reporting, Billing, etc., as they mature)</em></li>
          </ul>
          <p>
            Each service could potentially have its own database (though a shared database with clear boundaries is also an option to start) and would communicate with others through well-defined APIs (e.g., REST or gRPC) or asynchronous messaging (e.g., Kafka, RabbitMQ). An API Gateway would serve as the single entry point for the frontend.
          </p>

          <h4>Pros:</h4>
          <ul>
            <li><strong>Improved Scalability:</strong> Each service can be scaled independently based on its specific load. For example, if the Pharmacy service is heavily used, it can be scaled up without affecting the Patient Registration service.</li>
            <li><strong>Technology Diversity:</strong> Different services could potentially use different technologies best suited for their tasks (though this adds complexity).</li>
            <li><strong>Enhanced Fault Isolation:</strong> Failure in one service is less likely to bring down the entire application. Other services can continue to operate.</li>
            <li><strong>Independent Development & Deployment:</strong> Smaller, focused teams can work on individual services, leading to faster development cycles and easier deployments for specific features.</li>
            <li><strong>Better Code Organization & Maintainability:</strong> Each service has a smaller, more manageable codebase.</li>
            <li><strong>Easier to Adopt New Technologies:</strong> A single service can be rewritten or updated with new technology without impacting the entire system.</li>
          </ul>

          <h4>Cons:</h4>
          <ul>
            <li><strong>Increased Complexity:</strong> Managing multiple services, their deployments, inter-service communication, and distributed data consistency is significantly more complex than a monolith.</li>
            <li><strong>Operational Overhead:</strong> Requires more sophisticated deployment, monitoring, and orchestration tools (e.g., Kubernetes, service mesh).</li>
            <li><strong>Network Latency & Reliability:</strong> Communication between services happens over the network, which introduces latency and potential points of failure.</li>
            <li><strong>Distributed Data Management:</strong> Ensuring data consistency across multiple databases (if used) can be challenging (e.g., eventual consistency, distributed transactions).</li>
            <li><strong>Complex Testing:</strong> End-to-end testing across multiple services is more involved.</li>
            <li><strong>Requires Skilled Teams:</strong> Expertise in distributed systems, DevOps, and managing microservices is crucial.</li>
            <li><strong>Higher Initial Setup Cost & Time:</strong> Setting up the infrastructure and communication patterns for microservices can take more time upfront.</li>
          </ul>

          <h4>When to Consider Microservices for H365:</h4>
          <p>
            For a system intended for nationwide deployment with potentially high transaction volumes, varying load on different modules, and the need for long-term scalability and maintainability, a microservices architecture offers significant advantages. However, it's often practical to start with a well-structured monolith and evolve towards microservices by strategically breaking out services as the system grows and scaling needs become clearer.
          </p>
        </CardContent>
      </Card>

      <Card className="shadow-sm">
        <CardHeader>
          <CardTitle className="text-xl">Recommendation Strategy</CardTitle>
        </CardHeader>
        <CardContent className="prose dark:prose-invert max-w-none">
          <p>
            For H365, considering the initial development phase and the goal of a rapid MVP (Minimum Viable Product), an **evolutionary approach** is often recommended:
          </p>
          <ol>
            <li>
              <strong>Start with a Well-Structured Monolith:</strong> Build the initial backend as a single Node.js/Express application, but with very clear internal boundaries between modules (as outlined in the proposed folder structure). This allows for faster initial development and deployment.
            </li>
            <li>
              <strong>Identify Candidates for Microservices:</strong> As the system grows and specific modules experience high load, become complex to maintain, or require independent scaling, identify them as candidates to be extracted into separate microservices.
            </li>
            <li>
              <strong>Gradual Transition:</strong> Incrementally break out services. For example, the "User & Auth Service" or the "Notification Service" might be good early candidates.
            </li>
          </ol>
          <p>
            This approach allows leveraging the initial speed of monolithic development while planning for the scalability and resilience benefits of microservices in the long run, without incurring the full operational complexity from day one.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}

    