import { getDBTable, saveDBTable, addRecentActivity } from '../utils/dbInit';
import { delay, generateId } from './api';

export const contentService = {
  async getAll() {
    await delay();
    const contents = getDBTable('contents');
    const courses = getDBTable('courses');
    const modules = getDBTable('modules');
    const submodules = getDBTable('submodules');

    return contents.map((c) => ({
      ...c,
      courseName: courses.find((course) => course.id === c.courseId)?.name || 'Unknown Course',
      moduleName: modules.find((m) => m.id === c.moduleId)?.name || 'Unknown Module',
      submoduleName: submodules.find((s) => s.id === c.submoduleId)?.name || 'Unknown Submodule',
      position: c.position || 1,
    })).sort((a, b) => a.position - b.position);
  },

  async getBySubmoduleId(submoduleId) {
    await delay();
    const contents = getDBTable('contents');
    const courses = getDBTable('courses');
    const modules = getDBTable('modules');
    const submodules = getDBTable('submodules');

    return contents
      .filter((c) => c.submoduleId === submoduleId)
      .map((c, idx) => ({
        ...c,
        courseName: courses.find((course) => course.id === c.courseId)?.name || 'Unknown Course',
        moduleName: modules.find((m) => m.id === c.moduleId)?.name || 'Unknown Module',
        submoduleName: submodules.find((s) => s.id === c.submoduleId)?.name || 'Unknown Submodule',
        position: c.position || (idx + 1),
      }))
      .sort((a, b) => a.position - b.position);
  },

  async getById(id) {
    await delay();
    const contents = getDBTable('contents');
    const courses = getDBTable('courses');
    const modules = getDBTable('modules');
    const submodules = getDBTable('submodules');
    
    const c = contents.find((item) => item.id === id);
    if (!c) throw new Error('Content not found');

    return {
      ...c,
      courseName: courses.find((course) => course.id === c.courseId)?.name || 'Unknown Course',
      moduleName: modules.find((m) => m.id === c.moduleId)?.name || 'Unknown Module',
      submoduleName: submodules.find((s) => s.id === c.submoduleId)?.name || 'Unknown Submodule',
      position: c.position || 1,
    };
  },

  async create(data) {
    await delay();
    const contents = getDBTable('contents');

    // Validate relations exist
    const courses = getDBTable('courses');
    const modules = getDBTable('modules');
    const submodules = getDBTable('submodules');

    if (!courses.some((c) => c.id === data.courseId)) throw new Error('Selected Course does not exist.');
    if (!modules.some((m) => m.id === data.moduleId)) throw new Error('Selected Module does not exist.');
    if (!submodules.some((s) => s.id === data.submoduleId)) throw new Error('Selected Submodule does not exist.');

    // Calculate position within submodule
    const subContents = contents.filter((c) => c.submoduleId === data.submoduleId);
    const nextPosition = subContents.length > 0
      ? Math.max(...subContents.map((c) => c.position || 0)) + 1
      : 1;

    const newContent = {
      id: generateId('cont'),
      courseId: data.courseId,
      moduleId: data.moduleId,
      submoduleId: data.submoduleId,
      name: data.name,
      contentType: data.contentType,
      description: data.description || '',
      fileName: data.fileName || '',
      fileSize: data.fileSize || '',
      fileUrl: data.fileUrl || '#',
      status: data.status || 'Active',
      position: nextPosition,
    };

    contents.push(newContent);
    saveDBTable('contents', contents);
    addRecentActivity(`Content "${newContent.name}" was uploaded.`, 'success');
    return newContent;
  },

  async update(id, data) {
    await delay();
    const contents = getDBTable('contents');
    const index = contents.findIndex((c) => c.id === id);
    if (index === -1) throw new Error('Content not found');

    // Validate relations exist
    const courses = getDBTable('courses');
    const modules = getDBTable('modules');
    const submodules = getDBTable('submodules');

    if (!courses.some((c) => c.id === data.courseId)) throw new Error('Selected Course does not exist.');
    if (!modules.some((m) => m.id === data.moduleId)) throw new Error('Selected Module does not exist.');
    if (!submodules.some((s) => s.id === data.submoduleId)) throw new Error('Selected Submodule does not exist.');

    const updatedContent = {
      ...contents[index],
      courseId: data.courseId,
      moduleId: data.moduleId,
      submoduleId: data.submoduleId,
      name: data.name,
      contentType: data.contentType,
      description: data.description || '',
      fileName: data.fileName || contents[index].fileName,
      fileSize: data.fileSize || contents[index].fileSize,
      fileUrl: data.fileUrl || contents[index].fileUrl,
      status: data.status || 'Active',
    };

    contents[index] = updatedContent;
    saveDBTable('contents', contents);
    addRecentActivity(`Content "${updatedContent.name}" was updated.`, 'info');
    return updatedContent;
  },

  async delete(id) {
    await delay();
    const contents = getDBTable('contents');
    const content = contents.find((c) => c.id === id);
    if (!content) throw new Error('Content not found');

    const filtered = contents.filter((c) => c.id !== id);

    // Re-adjust positions within submodule
    const subContents = filtered.filter((c) => c.submoduleId === content.submoduleId)
      .sort((a, b) => (a.position || 0) - (b.position || 0))
      .map((c, idx) => ({ ...c, position: idx + 1 }));

    const finalContents = [
      ...filtered.filter((c) => c.submoduleId !== content.submoduleId),
      ...subContents
    ];

    saveDBTable('contents', finalContents);
    addRecentActivity(`Content "${content.name}" was deleted.`, 'warning');
    return { success: true, id };
  },

  async updatePositions(orderedIds) {
    await delay(300);
    const contents = getDBTable('contents');
    
    orderedIds.forEach((id, index) => {
      const c = contents.find((item) => item.id === id);
      if (c) {
        c.position = index + 1;
      }
    });

    saveDBTable('contents', contents);
    addRecentActivity(`Content items were reordered.`, 'info');
    return contents;
  },

  // Mock File Upload with progress feedback callback
  async mockUploadFile(file, onProgress) {
    const allowedExtensions = ['pdf', 'ppt', 'pptx', 'docx', 'mp4', 'png', 'jpg', 'jpeg'];
    const extension = file.name.split('.').pop().toLowerCase();
    
    if (!allowedExtensions.includes(extension)) {
      throw new Error(`Unsupported file type: .${extension}. Only PDF, PPT, DOCX, MP4, and Images are allowed.`);
    }

    // Max 100MB limit for mock validation
    const maxBytes = 100 * 1024 * 1024;
    if (file.size > maxBytes) {
      throw new Error(`File is too large. Maximum allowed size is 100MB.`);
    }

    // Simulate progress updates
    for (let progress = 10; progress <= 100; progress += 15) {
      await delay(150);
      if (onProgress) {
        onProgress(Math.min(progress, 100));
      }
    }

    const fileSizeString = file.size > 1024 * 1024
      ? `${(file.size / (1024 * 1024)).toFixed(1)} MB`
      : `${(file.size / 1024).toFixed(1)} KB`;

    return {
      fileName: file.name,
      fileSize: fileSizeString,
      fileUrl: extension === 'mp4' ? 'https://www.w3schools.com/html/mov_bbb.mp4' : '#',
    };
  }
};
