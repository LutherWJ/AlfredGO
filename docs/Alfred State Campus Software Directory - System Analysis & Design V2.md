# Alfred State Campus Software Directory: System Analysis and Design

## 1\. System Scope Document

### 1.1 Concise Problem Description

Alfred State offers a multitude of software solutions and digital services to support student academics, dining, residential life, and administrative needs. However, these software packages are currently fragmented and difficult to navigate, leading to user friction and a disjointed student experience.

### 1.2 Statement of the Problem

The current information delivery system for campus software lacks a centralized, mobile-optimized, and intuitive interface. Students struggle to locate necessary software efficiently, resulting in wasted time and underutilization of provided resources. The Alfred State Student Senate has identified this as a significant barrier to campus life and academic success.

### 1.3 Statement of Proposed Solutions

We propose the development of a lightweight, mobile-first Progressive Web Application (PWA) acting as a centralized campus software directory.

* **Interface:** The application will utilize an "Inset Grouped List" (Hierarchical List View) interface, keeping navigation shallow (no more than one tap of depth) and minimizing cognitive load.  
* **Search Functionality:** A sticky search bar will allow students to instantly filter through available campus services in real-time.  
* **Tech Stack:** The system will be built using Bun, Hono, and HTMX, leveraging the HATEOAS (Hypermedia As The Engine Of Application State) architectural pattern. This ensures high performance and exact synchronization between server state and client UI.  
* *Note on Scope:* A unified notification aggregate was considered during the conceptual phase but has been explicitly scoped out of the Minimum Viable Product (MVP) to focus entirely on core directory and search functionalities, as true integration would require complex vendor APIs.

### 1.4 Logical Analysis of Proposed System

The system operates via a thin-client architecture guided by HATEOAS principles. The server (Hono) acts as the single source of truth, maintaining a local database (SQLite) mapping categories, services, and users. When a user interacts with the UI, HTMX sends an asynchronous request to the server, which responds with ready-to-render HTML fragments to swap into the DOM. Authentication will be handled by the campus Microsoft Entra ID SSO, while the local system maintains user roles for authorization.

---

## 2\. Structured Analysis / Logical Design

### 2.1 Conceptual Data Models

The database will utilize a relational model to associate campus services with overarching categories while supporting user sessions and RBAC.

| Entity | Attributes | Description |
| :---- | :---- | :---- |
| **Users** | `id` (PK), `sso_id` (Unique), `email`, `display_name`, `role` | Stores SSO mapping and authorization roles (e.g., student, admin). |
| **Categories** | `id` (PK), `name`, `icon_name`, `sort_order` | Organizes services into logical groups (e.g., Academic, Dining). |
| **Services** | `id` (PK), `category_id` (FK), `name`, `description`, `url`, `date_created`, `date_modified` | Represents the actual software packages and links, tracking content freshness. |

---

## 3\. Object-Oriented Analysis / Logical Design

### 3.1 UML Models

The system interactions can be understood through the primary use cases of the student actor.

Actor: Student

Use Cases:

1\. Authenticate (via Microsoft Entra ID SSO)

   \- Extension: Mock Auth (for Prototype dev)

2\. Browse Services by Category

   \- View Category List

   \- Select Category to view contained Services

3\. Search Services

   \- Input query into sticky search

   \- View real-time filtered results via HATEOAS interaction

---

## 4\. Physical Design

### 4.1 User Interface Design Models & Technical Specifications

* **Design Paradigm:** Mobile PWA conforming to mobile operating system standards, specifically an Inset Grouped List view.  
* **Components:**  
  * Sticky header containing the search input.  
  * Grouped list items with rounded corners, distinct borders, and chevron indicators.  
* **Client Specifications:** HTMX manages client state by requesting HTML partials. CSS will be handled via a utility-first approach to maintain strict adherence to the design paradigm.

### 4.2 Data Design & Proposed Technical Specifications

* **Database Engine:** SQLite. The database will operate directly as a local `.sqlite` file on the same VM as the application. Given the read-heavy nature of a directory application, this serverless approach provides instantaneous data retrieval without network overhead.  
* **ORM/Query Builder:** Native database drivers integrated with Bun.

### 4.3 Process Design & Proposed Technical Specifications

* **Runtime:** Bun, serving as an ultra-fast JavaScript runtime.  
* **Web Framework:** Hono, a lightweight web framework.  
* **Architecture:** Adhering to HATEOAS, endpoints are structured to return HTML fragments reflecting the exact server state, avoiding complex client-side JSON parsing.

### 4.4 Physical Storage and Network Configuration

* **Hosting:** The production system will run on an Ubuntu Virtual Machine within the campus Proxmox environment.  
* **Network Gateway:** A reverse proxy (Nginx or Caddy) will handle SSL/TLS termination and route requests to the internal Hono server port.  
* **Storage:** The SQLite database will exist on the VM's persistent storage volume.

### 4.5 Logging and Monitoring

* **Application Logging:** Hono's built-in `logger` middleware will capture incoming HTTP requests, methods, paths, and response times, outputting them to standard output (`stdout`).  
* **System Logging:** The Bun runtime will be managed by `systemd`. Consequently, all application logs will be securely managed, persisted, and rotated natively by the host OS's `journalctl` utility.

---

## 5\. Security Plan

### 5.1 Authentication

* **Production:** The system integrates with Alfred State's Microsoft Entra ID via OAuth2/OIDC. The application maps the Microsoft payload to the local `users` table and issues a secure, HTTP-only session cookie. No passwords are ever stored or processed locally.  
* **Prototype:** A mock authentication route (`/dev-login`) assigns a local session cookie representing a dummy profile.

### 5.2 Authorization (RBAC)

Role-Based Access Control is enforced via the `role` column in the `users` table.

* **Students:** Granted read-only access to services and categories.  
* **Administrators:** Granted access to hidden UI routes to perform CRUD operations.  
* **Admin Bootstrap Process:** The initial administrator is created by logging in via SSO, then manually elevating their role via the local SQLite CLI over an SSH connection. Subsequent admins can be promoted by the initial admin via a protected UI dashboard.

### 5.3 OS and Application Security Concerns

* **File System Security:** Because SQLite is local, network-based database attacks are mitigated. Security relies on strict OS-level permissions (e.g., `chmod 600`) ensuring only the Bun process user can access the `.sqlite` file.  
* **Data Integrity:** All database inputs utilize parameterized queries to prevent SQL injection.  
* **Application Security:** Hono middleware provides secure HTTP headers (Content Security Policies, X-Frame-Options).  
* **Transport Security:** All external connections forced over HTTPS via the reverse proxy.

