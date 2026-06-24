import { getDBTable, saveDBTable, addRecentActivity } from '../utils/dbInit';
import { delay, generateId } from './api';

export const categoryService = {
  async getAll() {
    await delay();
    return getDBTable('categories');
  },

  async getById(id) {
    await delay();
    const categories = getDBTable('categories');
    const category = categories.find((c) => c.id === id);
    if (!category) throw new Error('Category not found');
    return category;
  },

  async create(data) {
    await delay();
    const categories = getDBTable('categories');
    
    // Check duplicate name
    if (categories.some((c) => c.name.toLowerCase() === data.name.toLowerCase())) {
      throw new Error('A category with this name already exists.');
    }

    const newCategory = {
      id: generateId('cat'),
      name: data.name,
      description: data.description || '',
      status: data.status || 'Active',
    };

    categories.push(newCategory);
    saveDBTable('categories', categories);
    addRecentActivity(`Category "${newCategory.name}" was created.`, 'success');
    return newCategory;
  },

  async update(id, data) {
    await delay();
    const categories = getDBTable('categories');
    const index = categories.findIndex((c) => c.id === id);
    if (index === -1) throw new Error('Category not found');

    // Check duplicate name on other categories
    if (categories.some((c) => c.id !== id && c.name.toLowerCase() === data.name.toLowerCase())) {
      throw new Error('Another category with this name already exists.');
    }

    const updatedCategory = {
      ...categories[index],
      name: data.name,
      description: data.description || '',
      status: data.status || 'Active',
    };

    categories[index] = updatedCategory;
    saveDBTable('categories', categories);
    addRecentActivity(`Category "${updatedCategory.name}" was updated.`, 'info');
    return updatedCategory;
  },

  async delete(id) {
    await delay();
    const categories = getDBTable('categories');
    const category = categories.find((c) => c.id === id);
    if (!category) throw new Error('Category not found');

    // Check if courses are attached to this category
    const courses = getDBTable('courses');
    const hasCourses = courses.some((c) => c.categoryId === id);
    if (hasCourses) {
      throw new Error('Cannot delete category. It contains courses. Please delete or reassign courses first.');
    }

    const filtered = categories.filter((c) => c.id !== id);
    saveDBTable('categories', filtered);
    addRecentActivity(`Category "${category.name}" was deleted.`, 'warning');
    return { success: true, id };
  },
};
