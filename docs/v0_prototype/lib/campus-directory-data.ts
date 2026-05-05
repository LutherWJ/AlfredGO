import {
  GraduationCap,
  BookOpen,
  Users,
  Calendar,
  Mail,
  HardDrive,
  Wifi,
  Shield,
  MessageSquare,
  Laptop,
  FileText,
  CreditCard,
  Building,
  ClipboardList,
  type LucideIcon,
} from "lucide-react"

export interface Service {
  id: string
  name: string
  description: string
  icon: LucideIcon
  status?: "active" | "maintenance" | "new"
  url?: string
}

export interface ServiceCategory {
  id: string
  name: string
  services: Service[]
}

export const campusDirectory: ServiceCategory[] = [
  {
    id: "learning",
    name: "Learning & Academics",
    services: [
      {
        id: "canvas",
        name: "Canvas LMS",
        description: "Access courses, assignments, and grades",
        icon: GraduationCap,
        status: "active",
        url: "#",
      },
      {
        id: "library",
        name: "Digital Library",
        description: "Research databases and e-books",
        icon: BookOpen,
        status: "active",
        url: "#",
      },
      {
        id: "turnitin",
        name: "Turnitin",
        description: "Plagiarism detection and feedback",
        icon: FileText,
        url: "#",
      },
      {
        id: "zoom",
        name: "Zoom Meetings",
        description: "Virtual classes and office hours",
        icon: Laptop,
        status: "active",
        url: "#",
      },
    ],
  },
  {
    id: "campus-life",
    name: "Campus Life",
    services: [
      {
        id: "events",
        name: "Campus Events",
        description: "Browse upcoming events and activities",
        icon: Calendar,
        status: "new",
        url: "#",
      },
      {
        id: "clubs",
        name: "Student Organizations",
        description: "Join clubs and student groups",
        icon: Users,
        url: "#",
      },
      {
        id: "housing",
        name: "Housing Portal",
        description: "Room selection and housing services",
        icon: Building,
        url: "#",
      },
      {
        id: "dining",
        name: "Dining Services",
        description: "Meal plans and dining locations",
        icon: CreditCard,
        url: "#",
      },
    ],
  },
  {
    id: "communication",
    name: "Communication",
    services: [
      {
        id: "email",
        name: "Student Email",
        description: "University email powered by Microsoft 365",
        icon: Mail,
        status: "active",
        url: "#",
      },
      {
        id: "teams",
        name: "Microsoft Teams",
        description: "Chat and collaborate with classmates",
        icon: MessageSquare,
        url: "#",
      },
    ],
  },
  {
    id: "it-services",
    name: "IT Services",
    services: [
      {
        id: "cloud-storage",
        name: "Cloud Storage",
        description: "OneDrive with 1TB of storage",
        icon: HardDrive,
        status: "active",
        url: "#",
      },
      {
        id: "wifi",
        name: "Campus Wi-Fi",
        description: "Connect to eduroam network",
        icon: Wifi,
        url: "#",
      },
      {
        id: "vpn",
        name: "VPN Access",
        description: "Secure remote access to campus resources",
        icon: Shield,
        status: "maintenance",
        url: "#",
      },
      {
        id: "helpdesk",
        name: "IT Help Desk",
        description: "Submit tickets and get support",
        icon: ClipboardList,
        url: "#",
      },
    ],
  },
]
