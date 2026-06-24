import { getDBTable, saveDBTable, addRecentActivity } from '../utils/dbInit';
import { delay, generateId } from './api';

export const moduleService = {
  async getAll() {
    await delay();
    const modules = getDBTable('modules');
    const courses = getDBTable('courses');

    return modules.map((mod) => ({
      ...mod,
      courseName: courses.find((c) => c.id === mod.courseId)?.name || 'Unknown Course',
    })).sort((a, b) => a.position - b.position);
  },

  async getByCourseId(courseId) {
    await delay();
    const modules = getDBTable('modules');
    const courses = getDBTable('courses');

    return modules
      .filter((m) => m.courseId === courseId)
      .map((mod) => ({
        ...mod,
        courseName: courses.find((c) => c.id === mod.courseId)?.name || 'Unknown Course',
      }))
      .sort((a, b) => a.position - b.position);
  },

  async getById(id) {
    await delay();
    const modules = getDBTable('modules');
    const courses = getDBTable('courses');
    
    const mod = modules.find((m) => m.id === id);
    if (!mod) throw new Error('Module not found');

    return {
      ...mod,
      courseName: courses.find((c) => c.id === mod.courseId)?.name || 'Unknown Course',
    };
  },

  async create(data) {
    await delay();
    const modules = getDBTable('modules');

    // Validate course exists
    const courses = getDBTable('courses');
    const courseExists = courses.some((c) => c.id === data.courseId);
    if (!courseExists) throw new Error('Selected Course does not exist.');

    // Calculate position
    const courseModules = modules.filter((m) => m.courseId === data.courseId);
    const nextPosition = courseModules.length > 0
      ? Math.max(...courseModules.map((m) => m.position)) + 1
      : 1;

    const newModule = {
      id: generateId('mod'),
      courseId: data.courseId,
      name: data.name,
      description: data.description || '',
      position: nextPosition,
    };

    modules.push(newModule);
    saveDBTable('modules', modules);
    addRecentActivity(`Module "${newModule.name}" was created.`, 'success');
    return newModule;
  },

  async update(id, data) {
    await delay();
    const modules = getDBTable('modules');
    const index = modules.findIndex((m) => m.id === id);
    if (index === -1) throw new Error('Module not found');

    // Validate course exists
    const courses = getDBTable('courses');
    const courseExists = courses.some((c) => c.id === data.courseId);
    if (!courseExists) throw new Error('Selected Course does not exist.');

    const updatedModule = {
      ...modules[index],
      courseId: data.courseId,
      name: data.name,
      description: data.description || '',
    };

    modules[index] = updatedModule;
    saveDBTable('modules', modules);
    addRecentActivity(`Module "${updatedModule.name}" was updated.`, 'info');
    return updatedModule;
  },

  async delete(id) {
    await delay();
    const modules = getDBTable('modules');
    const mod = modules.find((m) => m.id === id);
    if (!mod) throw new Error('Module not found');

    // Check if submodules are attached
    const submodules = getDBTable('submodules');
    const hasSubmodules = submodules.some((s) => s.moduleId === id);
    if (hasSubmodules) {
      throw new Error('Cannot delete module. It contains submodules. Please delete or reassign submodules first.');
    }

    const filtered = modules.filter((m) => m.id !== id);
    // Re-adjust positions for the rest of modules in the course
    const courseModules = filtered.filter((m) => m.courseId === mod.courseId)
      .sort((a, b) => a.position - b.position)
      .map((m, idx) => ({ ...m, position: idx + 1 }));

    const finalModules = [
      ...filtered.filter((m) => m.courseId !== mod.courseId),
      ...courseModules
    ];

    saveDBTable('modules', finalModules);
    addRecentActivity(`Module "${mod.name}" was deleted.`, 'warning');
    return { success: true, id };
  },

  async updatePositions(orderedIds) {
    await delay(300); // Quick response
    const modules = getDBTable('modules');
    
    // Update position of the matching ids
    orderedIds.forEach((id, index) => {
      const mod = modules.find((m) => m.id === id);
      if (mod) {
        mod.position = index + 1;
      }
    });

    saveDBTable('modules', modules);
    addRecentActivity(`Modules were reordered.`, 'info');
    return modules;
  }
};
