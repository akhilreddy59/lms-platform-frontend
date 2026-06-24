import { getDBTable, saveDBTable, addRecentActivity } from '../utils/dbInit';
import { delay, generateId } from './api';

export const courseService = {
  async getAll() {
    await delay();
    const courses = getDBTable('courses');
    const categories = getDBTable('categories');

    // Join with Category Name
    return courses.map((course) => ({
      ...course,
      categoryName: categories.find((cat) => cat.id === course.categoryId)?.name || 'Unknown Category',
    }));
  },

  async getById(id) {
    await delay();
    const courses = getDBTable('courses');
    const categories = getDBTable('categories');
    
    const course = courses.find((c) => c.id === id);
    if (!course) throw new Error('Course not found');

    return {
      ...course,
      categoryName: categories.find((cat) => cat.id === course.categoryId)?.name || 'Unknown Category',
    };
  },

  async create(data) {
    await delay();
    const courses = getDBTable('courses');

    // Validate category exists
    const categories = getDBTable('categories');
    const categoryExists = categories.some((cat) => cat.id === data.categoryId);
    if (!categoryExists) throw new Error('Selected Category does not exist.');

    // Check duplicate name
    if (courses.some((c) => c.name.toLowerCase() === data.name.toLowerCase())) {
      throw new Error('A course with this name already exists.');
    }

    const newCourse = {
      id: generateId('course'),
      categoryId: data.categoryId,
      name: data.name,
      description: data.description || '',
      thumbnail: data.thumbnail || 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=500&q=80',
      status: data.status || 'Active',
    };

    courses.push(newCourse);
    saveDBTable('courses', courses);
    addRecentActivity(`Course "${newCourse.name}" was created.`, 'success');
    return newCourse;
  },

  async update(id, data) {
    await delay();
    const courses = getDBTable('courses');
    const index = courses.findIndex((c) => c.id === id);
    if (index === -1) throw new Error('Course not found');

    // Validate category exists
    const categories = getDBTable('categories');
    const categoryExists = categories.some((cat) => cat.id === data.categoryId);
    if (!categoryExists) throw new Error('Selected Category does not exist.');

    // Check duplicate name
    if (courses.some((c) => c.id !== id && c.name.toLowerCase() === data.name.toLowerCase())) {
      throw new Error('Another course with this name already exists.');
    }

    const updatedCourse = {
      ...courses[index],
      categoryId: data.categoryId,
      name: data.name,
      description: data.description || '',
      thumbnail: data.thumbnail || courses[index].thumbnail,
      status: data.status || 'Active',
    };

    courses[index] = updatedCourse;
    saveDBTable('courses', courses);
    addRecentActivity(`Course "${updatedCourse.name}" was updated.`, 'info');
    return updatedCourse;
  },

  async delete(id) {
    await delay();
    const courses = getDBTable('courses');
    const course = courses.find((c) => c.id === id);
    if (!course) throw new Error('Course not found');

    // Validate if modules are attached to this course
    const modules = getDBTable('modules');
    const hasModules = modules.some((m) => m.courseId === id);
    if (hasModules) {
      throw new Error('Cannot delete course. It contains active modules. Please delete or reassign modules first.');
    }

    const filtered = courses.filter((c) => c.id !== id);
    saveDBTable('courses', filtered);
    addRecentActivity(`Course "${course.name}" was deleted.`, 'warning');
    return { success: true, id };
  },
};
