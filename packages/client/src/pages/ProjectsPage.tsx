import { useEffect, useState } from 'react';
import { PageHeader } from '../components/PageHeader';
import { PlusIcon } from '../icons';
import { ProjectSummaryCard } from '../components/shared/ProjectSummaryCard';
import { useUIStore } from '../stores/uiStore';

interface Project {
  id: string;
  name: string;
  type: string;
  stage: string | null;
  healthStatus: string;
  contractStatus: string | null;
  estimatedValue: number | null;
  winLikelihood: number | null;
  coverageScore: number | null;
  organization: { id: string; name: string };
  _count: { members: number };
}

export function ProjectsPage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const { openNewProject } = useUIStore();

  useEffect(() => {
    fetch('/api/projects?limit=100')
      .then((r) => r.json())
      .then((res) => setProjects(res.data || []))
      .catch(() => setProjects([]))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div>
      <PageHeader
        title="Projects"
        subtitle="Track engagements and deal pipeline"
        actions={
          <button
            onClick={openNewProject}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-[var(--color-accent)] text-white text-sm hover:bg-[var(--color-accent-hover)] transition-colors"
          >
            <PlusIcon size={16} />
            New Project
          </button>
        }
      />
      <div className="p-6">
        {loading ? (
          <div className="text-[var(--color-text-muted)] text-sm">Loading...</div>
        ) : projects.length === 0 ? (
          <div className="text-center py-12 text-[var(--color-text-muted)]">
            No projects yet. Press Cmd+P to create your first project.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {projects.map((p) => (
              <ProjectSummaryCard key={p.id} project={p} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
