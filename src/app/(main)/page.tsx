import Link from 'next/link';
import {
  Brain,
  Calendar,
  Contact2,
  FileText,
  Heart,
  HelpCircle,
  MapPin,
  Pill,
  Stethoscope,
} from 'lucide-react';

const features = [
  {
    name: 'Symptom Analysis',
    description:
      'AI-powered analysis of your symptoms for quick health insights',
    icon: Brain,
    href: '/symptom-analysis',
  },
  {
    name: 'Treatment Recommendations',
    description:
      'Personalized treatment suggestions based on your condition',
    icon: Stethoscope,
    href: '/treatment-recommendations',
  },
  {
    name: 'Medication Tracking',
    description: 'Smart medication reminders and adherence monitoring',
    icon: Pill,
    href: '/medication-tracking',
  },
  {
    name: 'Appointment Management',
    description: 'Schedule and manage your medical appointments',
    icon: Calendar,
    href: '/appointment-management',
  },
  {
    name: 'Find Medical Help',
    description: 'Locate nearby hospitals, clinics, and pharmacies',
    icon: MapPin,
    href: '/find-medical-help',
  },
  {
    name: 'Medical Q&A',
    description: 'Get AI-powered answers to your medical questions',
    icon: HelpCircle,
    href: '/medical-q-and-a',
  },
  {
    name: 'Health Metrics',
    description: 'Track vital signs and health measurements',
    icon: Heart,
    href: '/health-metrics',
  },
  {
    name: 'Medical Records',
    description: 'Securely store and access your medical history',
    icon: FileText,
    href: '/medical-records',
  },
  {
    name: 'Emergency Contacts',
    description: 'Quick access to emergency contacts and services',
    icon: Contact2,
    href: '/emergency-contacts',
  },
  {
    name: 'Health Reports',
    description: 'Generate comprehensive health reports',
    icon: FileText,
    href: '/health-reports',
  },
];

export default function Home() {
  return (
    <div className="bg-background min-h-screen">
      {/* Header */}
      <header className="bg-background py-4 shadow-sm">
        <div className="container mx-auto px-4 flex items-center justify-between">
          <a href="/" className="text-2xl font-bold">
            MedAi Navigator
          </a>
          <nav>
            <ul className="flex space-x-6">
              <li>
                <a href="#" className="hover:text-primary">
                  Dashboard
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-primary">
                  Profile
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-primary">
                  Settings
                </a>
              </li>
            </ul>
          </nav>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          <div className="bg-primary text-white rounded-2xl py-12 px-8">
            <h1 className="text-4xl font-bold text-center mb-4">
              Your Personal AI Health Assistant
            </h1>
            <p className="text-lg text-center">
              Get instant health insights, track symptoms, and manage your
              medications with advanced AI assistance.
            </p>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-8">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, index) => (
              <Link
                key={index}
                href={feature.href}
                className="bg-card rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow duration-300 block transform hover:scale-105 hover:rotate-3"
              >
                <feature.icon className="h-6 w-6 text-primary mb-2" />
                <h2 className="text-lg font-semibold mb-2">{feature.name}</h2>
                <p className="text-sm text-muted-foreground">
                  {feature.description}
                </p>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
