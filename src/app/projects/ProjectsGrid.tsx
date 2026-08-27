"use client";

import { useState } from "react";
import { MapPin, X, ChevronLeft, ChevronRight } from "lucide-react";
import Container from "@/components/ui/Container";
import Badge from "@/components/ui/Badge";
import { cn, normalizeImageUrl } from "@/lib/utils";

const CATEGORIES = ["all", "solar", "starlink", "electrical", "repairs"] as const;

interface ProjectImage {
  id: string;
  image_url: string;
  caption: string;
  display_order: number;
}

interface Project {
  id: string;
  title: string;
  slug: string;
  description: string;
  location: string;
  service_type: string;
  client_name: string;
  is_featured?: boolean;
  project_images?: ProjectImage[];
}

const badgeVariant: Record<string, "default" | "secondary" | "info" | "warning"> = {
  solar: "default",
  starlink: "info",
  electrical: "secondary",
  repairs: "warning",
};

export default function ProjectsGrid({ projects }: { projects: Project[] }) {
  const [filter, setFilter] = useState<string>("all");
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const filtered =
    filter === "all"
      ? projects
      : projects.filter((p) => p.service_type === filter);

  const images = selectedProject?.project_images || [];

  return (
    <>
      <section className="py-16">
        <Container>
          <div className="mb-10 flex flex-wrap items-center gap-3">
            {CATEGORIES.map((cat) => (
              <button
                key={cat}
                onClick={() => setFilter(cat)}
                className={cn(
                  "rounded-full px-5 py-2 text-sm font-semibold transition-colors cursor-pointer",
                  filter === cat
                    ? "bg-secondary text-white"
                    : "bg-surface-dim text-muted hover:text-secondary"
                )}
              >
                {cat === "all" ? "All Projects" : cat.charAt(0).toUpperCase() + cat.slice(1)}
              </button>
            ))}
          </div>

          {filtered.length === 0 ? (
            <div className="py-20 text-center">
              <p className="text-muted">No projects found for this category.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {filtered.map((project) => {
                const img = project.project_images?.[0];
                return (
                  <button
                    key={project.id}
                    onClick={() => {
                      setSelectedProject(project);
                      setCurrentImageIndex(0);
                    }}
                    className="group cursor-pointer text-left"
                  >
                    <div className="overflow-hidden rounded-2xl border border-border bg-white shadow-sm transition-all hover:shadow-lg">
                      <div className="relative aspect-[4/3] bg-surface-dim overflow-hidden">
                        {img ? (
                          <img
                            src={normalizeImageUrl(img.image_url) || ""}
                            alt={project.title}
                            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                          />
                        ) : (
                          <div className="flex h-full w-full items-center justify-center">
                            <div className="h-16 w-16 rounded-2xl bg-primary/10" />
                          </div>
                        )}
                        {project.is_featured && (
                          <div className="absolute top-3 left-3">
                            <Badge variant="default">Featured</Badge>
                          </div>
                        )}
                      </div>
                      <div className="p-5">
                        <Badge variant={badgeVariant[project.service_type] || "secondary"} className="mb-2">
                          {project.service_type}
                        </Badge>
                        <h3 className="text-lg font-bold text-secondary mb-1">
                          {project.title}
                        </h3>
                        <p className="text-sm text-muted line-clamp-2 mb-3">
                          {project.description}
                        </p>
                        <div className="flex items-center gap-1.5 text-xs text-muted">
                          <MapPin className="h-3.5 w-3.5" />
                          {project.location}
                        </div>
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          )}
        </Container>
      </section>

      {selectedProject && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 px-4 py-8">
          <div className="relative w-full max-w-3xl max-h-[90vh] overflow-y-auto rounded-2xl bg-white shadow-2xl">
            <button
              onClick={() => setSelectedProject(null)}
              className="absolute top-4 right-4 z-10 flex h-10 w-10 items-center justify-center rounded-full bg-white/90 text-secondary shadow-lg transition-colors hover:bg-white cursor-pointer"
            >
              <X className="h-5 w-5" />
            </button>

            {images.length > 0 && (
              <div className="relative aspect-video bg-surface-dim">
                <img
                  src={normalizeImageUrl(images[currentImageIndex]?.image_url) || ""}
                  alt={selectedProject.title}
                  className="h-full w-full object-cover"
                />
                {images.length > 1 && (
                  <>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setCurrentImageIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
                      }}
                      className="absolute left-3 top-1/2 -translate-y-1/2 flex h-10 w-10 items-center justify-center rounded-full bg-white/90 text-secondary shadow-lg cursor-pointer"
                    >
                      <ChevronLeft className="h-5 w-5" />
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setCurrentImageIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
                      }}
                      className="absolute right-3 top-1/2 -translate-y-1/2 flex h-10 w-10 items-center justify-center rounded-full bg-white/90 text-secondary shadow-lg cursor-pointer"
                    >
                      <ChevronRight className="h-5 w-5" />
                    </button>
                  </>
                )}
              </div>
            )}

            <div className="p-6">
              <Badge variant={badgeVariant[selectedProject.service_type] || "secondary"} className="mb-3">
                {selectedProject.service_type}
              </Badge>
              <h2 className="text-2xl font-bold text-secondary mb-2">
                {selectedProject.title}
              </h2>
              <p className="text-sm text-muted mb-3">
                Client: {selectedProject.client_name}
              </p>
              <div className="flex items-center gap-1.5 text-sm text-muted mb-4">
                <MapPin className="h-4 w-4" />
                {selectedProject.location}
              </div>
              <p className="text-secondary leading-relaxed">
                {selectedProject.description}
              </p>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
