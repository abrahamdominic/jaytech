import type { Metadata } from "next";
import { createClient } from "@/lib/supabase/server";
import Container from "@/components/ui/Container";
import SectionHeading from "@/components/ui/SectionHeading";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import ProjectsGrid from "./ProjectsGrid";

export const metadata: Metadata = {
  title: "Our Projects",
  description:
    "Explore JayTech's completed solar, Starlink, electrical, and repair projects across Nigeria.",
};

const PROJECTS_FALLBACK = [
  {
    id: "1",
    title: "5kW Solar Installation",
    slug: "5kw-solar-installation",
    description: "Complete solar power system for a 4-bedroom duplex in Lekki, Lagos.",
    location: "Lekki, Lagos",
    service_type: "solar",
    client_name: "Mr. Adebayo",
    is_featured: true,
    project_images: [
      {
        id: "1",
        image_url: "/images/jay10.jpeg",
        caption: "Solar panels installed on rooftop",
        display_order: 0,
      },
    ],
  },
  {
    id: "2",
    title: "Starlink Business Setup",
    slug: "starlink-business-setup",
    description: "High-speed satellite internet for a co-working space in Abuja.",
    location: "Wuse, Abuja",
    service_type: "starlink",
    client_name: "WorkHub Nigeria",
    is_featured: true,
    project_images: [
      {
        id: "2",
        image_url: "/images/jay11.jpeg",
        caption: "Starlink dish installation",
        display_order: 0,
      },
    ],
  },
  {
    id: "3",
    title: "Full House Rewiring",
    slug: "full-house-rewiring",
    description: "Complete electrical rewiring for a 3-story building in Ikeja.",
    location: "Ikeja, Lagos",
    service_type: "electrical",
    client_name: "Mrs. Okonkwo",
    is_featured: false,
    project_images: [
      {
        id: "3",
        image_url: "/images/jay12.jpeg",
        caption: "New electrical panel installation",
        display_order: 0,
      },
    ],
  },
  {
    id: "4",
    title: "Inverter System Repair",
    slug: "inverter-system-repair",
    description: "Diagnosed and repaired a 10kVA inverter system in Port Harcourt.",
    location: "Port Harcourt, Rivers",
    service_type: "repairs",
    client_name: "Chief Emeka",
    is_featured: false,
    project_images: [
      {
        id: "4",
        image_url: "/images/jay13.jpeg",
        caption: "Inverter system maintenance",
        display_order: 0,
      },
    ],
  },
  {
    id: "5",
    title: "10kW Hybrid Solar System",
    slug: "10kw-hybrid-solar-system",
    description: "Grid-tied solar system for a clinic in Ibadan with battery backup.",
    location: "Bodija, Ibadan",
    service_type: "solar",
    client_name: "MediCare Clinic",
    is_featured: true,
    project_images: [
      {
        id: "5",
        image_url: "/images/jay14.jpeg",
        caption: "Hybrid solar installation",
        display_order: 0,
      },
    ],
  },
  {
    id: "6",
    title: "Starlink Residential Install",
    slug: "starlink-residential-install",
    description: "Residential Starlink setup for a gated estate in Enugu.",
    location: "GRA, Enugu",
    service_type: "starlink",
    client_name: "Palmview Estate",
    is_featured: false,
    project_images: [
      {
        id: "6",
        image_url: "/images/jay15.jpeg",
        caption: "Residential dish mounting",
        display_order: 0,
      },
    ],
  },
];

export default async function ProjectsPage() {
  let projects = PROJECTS_FALLBACK;

  try {
    const supabase = await createClient();
    const { data } = await supabase
      .from("projects")
      .select("*, project_images(*)")
      .eq("is_published", true)
      .order("is_featured", { ascending: false })
      .order("created_at", { ascending: false });

    if (data && data.length > 0) {
      projects = data;
    }
  } catch {
    // use fallback
  }

  return (
    <>
      <Header />
      <main>
        <section className="bg-secondary py-20">
          <Container>
            <SectionHeading
              title="Our Projects"
              subtitle="Browse our portfolio of completed solar, Starlink, electrical, and repair projects across Nigeria."
              className="text-white [&_h2]:text-white [&_p]:text-white/60 [&_.bg-primary]:bg-primary"
            />
          </Container>
        </section>
        <ProjectsGrid projects={projects} />
      </main>
      <Footer />
    </>
  );
}
