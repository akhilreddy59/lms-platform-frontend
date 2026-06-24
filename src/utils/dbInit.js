const defaultCategories = [
  { id: 'cat-1', name: 'Cloud & Infrastructure', description: 'Google Cloud Platform, AWS, DevOps, and Kubernetes architectures.', status: 'Active' },
  { id: 'cat-2', name: 'Software Development', description: 'React, Next.js, Node.js, and Modern Javascript engineering.', status: 'Active' },
  { id: 'cat-3', name: 'Agile & Leadership', description: 'Scrum, Kanban, Agile coaching, and Product Management.', status: 'Active' },
  { id: 'cat-4', name: 'Data & Artificial Intelligence', description: 'Machine Learning, BigQuery, Spark, and Generative AI.', status: 'Inactive' },
];

const defaultCourses = [
  { id: 'course-1', categoryId: 'cat-1', name: 'Google Cloud Architect Academy', description: 'Master GCP services, VPCs, GKE clusters, and professional cloud architect practices.', thumbnail: 'https://images.unsplash.com/photo-1544383835-bda2bc66a55d?auto=format&fit=crop&w=500&q=80', status: 'Active' },
  { id: 'course-2', categoryId: 'cat-2', name: 'Advanced React & Architecture Patterns', description: 'Explore performance optimization, custom hook frameworks, and global state topologies.', thumbnail: 'https://images.unsplash.com/photo-1633356122544-f134324a6cee?auto=format&fit=crop&w=500&q=80', status: 'Active' },
  { id: 'course-3', categoryId: 'cat-3', name: 'Certified Agile Professional Guide', description: 'Align team structures, manage backlogs, and run effective sprint ceremonies.', thumbnail: 'https://images.unsplash.com/photo-1531403009284-440f080d1e12?auto=format&fit=crop&w=500&q=80', status: 'Active' },
];

const defaultModules = [
  // Modules for Course 1
  { id: 'mod-1', courseId: 'course-1', name: 'Module 1: GCP Compute & Networking Foundations', description: 'Understand VPCs, Subnets, Compute Engines, and Cloud Load Balancers.', position: 1 },
  { id: 'mod-2', courseId: 'course-1', name: 'Module 2: Containerization with Google Kubernetes Engine (GKE)', description: 'Deploy, scale, and manage workloads on GKE.', position: 2 },
  { id: 'mod-3', courseId: 'course-1', name: 'Module 3: GCP Databases & Storage Systems', description: 'Compare Cloud SQL, Spanner, Bigtable, and Cloud Storage.', position: 3 },
  
  // Modules for Course 2
  { id: 'mod-4', courseId: 'course-2', name: 'Module 1: Rendering Strategies & Hydration', description: 'Client-side rendering, Server-side rendering, and Static site generation.', position: 1 },
  { id: 'mod-5', courseId: 'course-2', name: 'Module 2: Custom Hook Architecture & Context API', description: 'Build reusable logic modules and separate state boundaries.', position: 2 },
  
  // Modules for Course 3
  { id: 'mod-6', courseId: 'course-3', name: 'Module 1: Agile Manifesto & Principles', description: 'Origins of agile, standard values, and core principles.', position: 1 },
];

const defaultSubmodules = [
  // Submodules for Module 1 (GCP Foundations)
  { id: 'submod-1', moduleId: 'mod-1', name: 'Submodule 1.1: Designing Custom VPC Networks', description: 'Configuration of firewalls, subnets, and routing tables.', position: 1 },
  { id: 'submod-2', moduleId: 'mod-1', name: 'Submodule 1.2: Compute Engine VM Deployments', description: 'Provisioning VMs, startup scripts, and instance templates.', position: 2 },

  // Submodules for Module 2 (GKE)
  { id: 'submod-3', moduleId: 'mod-2', name: 'Submodule 2.1: Pods, Services, and Deployments', description: 'Basic Kubernetes objects and workload specifications.', position: 1 },
  { id: 'submod-4', moduleId: 'mod-2', name: 'Submodule 2.2: Scaling & Ingress Management', description: 'Horizontal pod autoscaling and GKE ingress controllers.', position: 2 },

  // Submodules for Module 4 (Rendering Strategies)
  { id: 'submod-5', moduleId: 'mod-4', name: 'Submodule 4.1: React Server Components (RSC) Deep Dive', description: 'Understanding server vs client boundaries.', position: 1 },
];

const defaultContents = [
  // Content for Submodule 1.1 (VPC)
  { id: 'cont-1', submoduleId: 'submod-1', moduleId: 'mod-1', courseId: 'course-1', name: 'VPC Design Guide & Best Practices', contentType: 'PDF', description: 'Detailed architecture diagram and documentation for designing VPC networks.', fileName: 'gcp_vpc_design_patterns.pdf', fileSize: '4.2 MB', fileUrl: '#', status: 'Active' },
  { id: 'cont-2', submoduleId: 'submod-1', moduleId: 'mod-1', courseId: 'course-1', name: 'VPC vs Shared VPC Comparison', contentType: 'Comparison Table', description: 'Feature grid comparing normal VPC networks against Shared VPCs in GCP.', fileName: 'vpc_shared_vpc_comparison.html', fileSize: '128 KB', fileUrl: '#', status: 'Reviewed' },
  
  // Content for Submodule 1.2 (Compute Engines)
  { id: 'cont-3', submoduleId: 'submod-2', moduleId: 'mod-1', courseId: 'course-1', name: 'Provisioning VM Instances with Startup Scripts', contentType: 'Notes', description: 'Code snippets and bash scripts to initialize VMs automatically.', fileName: 'vm_startup_scripts.txt', fileSize: '12 KB', fileUrl: '#', status: 'Draft' },

  // Content for Submodule 2.1 (Pods & Services)
  { id: 'cont-4', submoduleId: 'submod-3', moduleId: 'mod-2', courseId: 'course-1', name: 'Deploying your First GKE Workload', contentType: 'Video', description: 'Step-by-step video demonstration of deployment configuration.', fileName: 'gke_first_deployment.mp4', fileSize: '45.8 MB', fileUrl: 'https://www.w3schools.com/html/mov_bbb.mp4', status: 'Active' },

  // Content for Submodule 4.1 (RSC)
  { id: 'cont-5', submoduleId: 'submod-5', moduleId: 'mod-4', courseId: 'course-2', name: 'Server Components vs Client Components PPT', contentType: 'PPT', description: 'Presentation slides explaining rendering life cycle.', fileName: 'rsc_vs_client_components.pptx', fileSize: '18.4 MB', fileUrl: '#', status: 'Pending' },
];

const defaultRecentActivities = [
  { id: 'act-1', text: 'Category "Cloud & Infrastructure" was updated.', timestamp: new Date(Date.now() - 1000 * 60 * 15).toISOString(), type: 'info' }, // 15 mins ago
  { id: 'act-2', text: 'New Course "Advanced React & Architecture Patterns" was created.', timestamp: new Date(Date.now() - 1000 * 60 * 120).toISOString(), type: 'success' }, // 2 hrs ago
  { id: 'act-3', text: 'Content file "gcp_vpc_design_patterns.pdf" was uploaded.', timestamp: new Date(Date.now() - 1000 * 60 * 600).toISOString(), type: 'success' }, // 10 hrs ago
  { id: 'act-4', text: 'Module "Module 3: GCP Databases & Storage Systems" was created.', timestamp: new Date(Date.now() - 1000 * 60 * 1440).toISOString(), type: 'info' }, // 1 day ago
];

export const initDB = () => {
  if (!localStorage.getItem('lms_categories')) {
    localStorage.setItem('lms_categories', JSON.stringify(defaultCategories));
  }
  if (!localStorage.getItem('lms_courses')) {
    localStorage.setItem('lms_courses', JSON.stringify(defaultCourses));
  }
  if (!localStorage.getItem('lms_modules')) {
    localStorage.setItem('lms_modules', JSON.stringify(defaultModules));
  }
  if (!localStorage.getItem('lms_submodules')) {
    localStorage.setItem('lms_submodules', JSON.stringify(defaultSubmodules));
  }
  if (!localStorage.getItem('lms_contents')) {
    localStorage.setItem('lms_contents', JSON.stringify(defaultContents));
  }
  if (!localStorage.getItem('lms_recent_activities')) {
    localStorage.setItem('lms_recent_activities', JSON.stringify(defaultRecentActivities));
  }
};

export const getDBTable = (tableName) => {
  initDB();
  const data = localStorage.getItem(`lms_${tableName}`);
  return data ? JSON.parse(data) : [];
};

export const saveDBTable = (tableName, data) => {
  localStorage.setItem(`lms_${tableName}`, JSON.stringify(data));
};

export const addRecentActivity = (text, type = 'info') => {
  const activities = getDBTable('recent_activities');
  const newActivity = {
    id: `act-${Date.now()}`,
    text,
    timestamp: new Date().toISOString(),
    type,
  };
  activities.unshift(newActivity);
  // Keep only last 50 activities
  saveDBTable('recent_activities', activities.slice(0, 50));
};
