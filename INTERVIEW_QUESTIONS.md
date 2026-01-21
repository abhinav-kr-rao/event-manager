# Technical Interview Questions - Event Manager Project

This document contains 30 technical interview questions that can be asked about the Event Manager project. These questions cover various aspects including Next.js, Prisma, React Query, TypeScript, and application architecture.

---

## Next.js & React Questions

### 1. What is the App Router in Next.js 16 and how does it differ from the Pages Router?
**Expected Answer:** The App Router is a new routing paradigm in Next.js that uses the `app/` directory. It supports React Server Components by default, offers better layouts and nested routing, and provides enhanced data fetching patterns. Unlike the Pages Router which uses file-based routing with `pages/` directory, App Router uses folder structure with special files like `page.tsx`, `layout.tsx`, and `route.ts`.

### 2. Explain the use of "use client" directive in this project. Why is it needed?
**Expected Answer:** The "use client" directive marks a component as a Client Component, which runs in the browser. It's needed for components that use React hooks (useState, useEffect), event handlers, or browser-only APIs. In this project, it's used in forms (CreateEventForm, RegisterForm) because they need interactivity, state management, and React Hook Form functionality.

### 3. How does this project implement API routes? What are the benefits of using route handlers?
**Expected Answer:** The project uses Next.js API routes with the App Router pattern (`route.ts` files in `app/api/` directory). Route handlers (GET, POST functions) are co-located with the route and provide type-safe request/response handling. They support edge runtime, can use middleware, and integrate seamlessly with React Server Components.

### 4. What is the purpose of the `params` being a Promise in the dynamic route `/api/events/[id]/register`?
**Expected Answer:** In Next.js 15+, dynamic route params are async to support streaming and partial prerendering. The code uses `await params` to access the `id` parameter. This ensures the route handler properly waits for the parameter resolution before processing the request.

### 5. How does this application handle client-side navigation and state management?
**Expected Answer:** The application uses React Query (TanStack Query) for server state management, which handles caching, synchronization, and updates. Client-side navigation is handled by Next.js automatically through the Link component and router. Local state in forms is managed using React Hook Form.

---

## Prisma & Database Questions

### 6. Explain the Prisma schema used in this project. What are the relationships between models?
**Expected Answer:** The schema has two models: Event and Attendee. There's a one-to-many relationship where one Event can have multiple Attendees. The relationship uses `eventId` as a foreign key with cascade delete (when an event is deleted, all attendees are deleted). There's also a unique constraint on `[email, eventId]` to prevent double booking.

### 7. What is the purpose of the `@@unique([email, eventId])` constraint in the Attendee model?
**Expected Answer:** This composite unique constraint ensures that a user with a specific email can only register once for a given event, preventing duplicate registrations. It's a database-level constraint that enforces business logic at the data layer.

### 8. Why does the project use two separate Prisma clients (prisma and prismaNonPooled)?
**Expected Answer:** The project uses connection pooling for regular queries (prisma) for better performance, but transactions in serverless environments like Vercel require non-pooled connections (prismaNonPooled). This is because pooled connections can cause issues with long-running transactions in serverless functions.

### 9. Explain the transaction implementation in the registration endpoint. Why is it necessary?
**Expected Answer:** The transaction ensures atomicity when registering an attendee. It first checks if the event has capacity, then creates the attendee record. Without a transaction, there could be a race condition where multiple users register simultaneously for the last spot, exceeding capacity. The transaction ensures these operations are atomic.

### 10. What is the significance of using `cuid()` as the default ID generation strategy?
**Expected Answer:** CUID (Collision-resistant Unique Identifier) provides better properties than traditional UUIDs for database primary keys: they're sortable (contain timestamp), shorter, URL-safe, and have better performance in distributed systems. They're also more secure than auto-incrementing integers.

### 11. How does the project handle database migrations? What is the purpose of `prisma generate`?
**Expected Answer:** Database migrations are managed through Prisma Migrate (`prisma migrate dev`). The `prisma generate` command generates the Prisma Client based on the schema, creating type-safe database access code. It's run as a postinstall script to ensure the client is always up-to-date during deployment.

---

## TypeScript & Validation Questions

### 12. What is Zod and why is it used in this project?
**Expected Answer:** Zod is a TypeScript-first schema validation library. It's used to validate form inputs and API request bodies at runtime while providing compile-time type inference. This ensures type safety and data validation in one place, reducing bugs and maintaining consistency between client and server validation.

### 13. Why are there two separate schemas: `eventFormInputSchema` and `eventFormSchema`?
**Expected Answer:** `eventFormInputSchema` handles HTML form inputs where capacity is a string (from input fields), while `eventFormSchema` expects capacity as a number (for the API). This separation handles the type conversion between form data and API data cleanly, with proper validation at each stage.

### 14. How does the project leverage TypeScript's type inference with Zod schemas?
**Expected Answer:** Using `z.infer<typeof schema>`, the project automatically derives TypeScript types from Zod schemas. This ensures that form data, API payloads, and validation rules always stay in sync without manually maintaining duplicate type definitions.

### 15. What is the purpose of the `EventWithCount` type? Why isn't it generated by Prisma?
**Expected Answer:** `EventWithCount` represents an Event with the count of attendees (using Prisma's `_count`). It's manually defined because Prisma's generated types don't automatically include complex query results like aggregations and counts. This custom type ensures type safety when working with events that include attendee counts.

---

## React Query (TanStack Query) Questions

### 16. How does React Query handle caching in this application?
**Expected Answer:** React Query automatically caches data using query keys (e.g., `["events"]`). When data is fetched, it's stored in the cache and subsequent requests return cached data immediately while revalidating in the background. This provides instant UI updates while keeping data fresh.

### 17. Explain the purpose of `queryClient.invalidateQueries({ queryKey: ["events"] })` after mutations.
**Expected Answer:** After creating an event or registering an attendee, invalidating the "events" query key tells React Query that the cached data is stale. This triggers a refetch of the events list, ensuring the UI shows updated information (new events or updated attendee counts) immediately.

### 18. What are the benefits of using `useMutation` for form submissions?
**Expected Answer:** `useMutation` provides loading states (`isPending`), automatic error handling, success/error callbacks, and integration with React Query's caching system. It simplifies handling async operations in forms without manually managing loading states, errors, and UI updates.

### 19. How does React Query optimize performance compared to traditional state management?
**Expected Answer:** React Query eliminates redundant API calls through caching, provides background refetching, automatic garbage collection of unused data, and built-in request deduplication. It also supports optimistic updates and handles loading/error states automatically, reducing boilerplate code.

---

## React Hook Form Questions

### 20. Why use React Hook Form with Zod resolver instead of plain controlled components?
**Expected Answer:** React Hook Form minimizes re-renders by using uncontrolled components and refs internally. Combined with Zod resolver, it provides schema-based validation, reduces boilerplate, improves performance, and maintains a single source of truth for validation rules that can be shared between client and server.

### 21. How does the `register` function work in React Hook Form?
**Expected Answer:** The `register` function connects form inputs to React Hook Form by returning ref and onChange/onBlur handlers. It registers the field for validation and value tracking without causing component re-renders on every keystroke, improving performance.

### 22. How are form errors displayed in this project?
**Expected Answer:** Form errors are accessed through `form.formState.errors.fieldName` and displayed conditionally below input fields. The error messages come from Zod schema validation rules, ensuring consistency between validation logic and error messages.

---

## API Design & Error Handling Questions

### 23. How does the registration endpoint handle different types of errors?
**Expected Answer:** The endpoint catches multiple error scenarios: event not found, capacity exceeded (returns 409 Conflict), duplicate registration via Prisma error code P2002 (returns 400), and general errors (returns 500). Each error type returns appropriate HTTP status codes and descriptive messages.

### 24. What is the significance of the HTTP status code 409 when the event is full?
**Expected Answer:** HTTP 409 (Conflict) indicates that the request conflicts with the current state of the server. In this case, it appropriately represents the conflict between the user's desire to register and the event's capacity limit being reached.

### 25. How does the application prevent race conditions during event registration?
**Expected Answer:** Database transactions ensure atomic checking of capacity and creation of attendee records. The unique constraint on `[email, eventId]` prevents duplicate registrations. These mechanisms work together to handle concurrent registration attempts safely.

---

## UI/UX & Component Architecture Questions

### 26. What is Shadcn UI and how is it different from traditional component libraries?
**Expected Answer:** Shadcn UI is not a component library in the traditional sense—it provides copy-paste components built on Radix UI primitives. Components are added to your project (not installed as dependencies), allowing full customization and ownership. It uses Tailwind CSS for styling and provides accessible, composable components.

### 27. How does the dialog state management work in CreateEventForm and RegisterForm?
**Expected Answer:** Each form maintains its own dialog open/close state using `useState`. The dialog opens via a trigger button and closes programmatically after successful mutation (`setOpen(false)`), providing a controlled modal experience with proper state management.

### 28. Explain the purpose of the Skeleton component during loading states.
**Expected Answer:** The Skeleton component provides visual placeholders while data is loading, improving perceived performance and user experience. It shows users that content is coming, reduces layout shift, and maintains consistent UI structure during loading states.

---

## Architecture & Best Practices Questions

### 29. What are the advantages of the separation of concerns in this project's structure?
**Expected Answer:** The project separates concerns into distinct layers: components (UI), API routes (server logic), lib (utilities, schemas, database client), and Prisma schema (data model). This makes the code maintainable, testable, and allows independent evolution of each layer. For example, validation schemas can be reused on both client and server.

### 30. How would you scale this application to handle high traffic and concurrent registrations?
**Expected Answer:** Several strategies: 
- Use database connection pooling (already implemented)
- Implement optimistic locking or versioning on Event records
- Add Redis caching for event lists
- Use message queues for registration processing
- Implement rate limiting on API endpoints
- Use database read replicas for read-heavy operations
- Consider implementing a waiting list feature when events are full
- Add horizontal scaling with load balancing
- Implement CDN caching for static assets

---

## Bonus Questions

These questions can be used for deeper technical discussions:

- How would you implement real-time updates using WebSockets or Server-Sent Events?
- What security measures would you add to prevent spam registrations or DDoS attacks?
- How would you implement authentication and authorization for event organizers?
- How would you optimize the database queries for large-scale events with thousands of attendees?
- What testing strategy would you implement for this application (unit, integration, e2e)?
- How would you implement event cancellation and refund logic?
- What observability and monitoring would you add to this application in production?
