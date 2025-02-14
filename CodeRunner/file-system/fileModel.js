// server/models/fileModel.js
const fs = require('fs').promises;
const path = require('path');

// Define the directory where files will be stored
const DATA_DIR = path.join(__dirname, '../uploads');
const USERS_DIR = path.join(DATA_DIR, 'users');

class FileModel {
  static async ensureUserDirectory(userId) {
    try {
      await fs.mkdir(DATA_DIR, { recursive: true });
      await fs.mkdir(USERS_DIR, { recursive: true });

      const userDir = path.join(USERS_DIR, userId);
      await fs.mkdir(userDir, { recursive: true });

      // Check if user index file exists, create it if it doesn't
      const userIndexFile = path.join(userDir, 'index.json');
      try {
        await fs.access(userIndexFile);
      } catch (error) {
        await fs.writeFile(userIndexFile, JSON.stringify([]));
      }
    } catch (error) {
      console.error(`Error creating directories for user ${userId}:`, error);
      throw error;
    }
  }

  static async getAllFilesForUser(userId) {
    await this.ensureUserDirectory(userId);

    try {
      const userIndexFile = path.join(USERS_DIR, userId, 'index.json');
      const indexData = await fs.readFile(userIndexFile, 'utf8');
      return JSON.parse(indexData);
    } catch (error) {
      console.error(`Error reading index file for user ${userId}:`, error);
      return [];
    }
  }

  static async createFile(userId, fileData) {
    await this.ensureUserDirectory(userId);

    const newFile = {
      ...fileData,
      id: fileData.id || Date.now().toString(),
      userId: userId,
      createdAt: fileData.createdAt || new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    try {
      // Get current index for user
      const files = await this.getAllFilesForUser(userId);

      // Add new file to index
      files.push({
        id: newFile.id,
        name: newFile.name,
        createdAt: newFile.createdAt,
        updatedAt: newFile.updatedAt
      });

      // Save index
      const userIndexFile = path.join(USERS_DIR, userId, 'index.json');
      await fs.writeFile(userIndexFile, JSON.stringify(files, null, 2));

      // Save file content
      const filePath = path.join(USERS_DIR, userId, `${newFile.id}.json`);
      await fs.writeFile(filePath, JSON.stringify(newFile, null, 2));

      return newFile;
    } catch (error) {
      console.error(`Error creating file for user ${userId}:`, error);
      throw error;
    }
  }

  static async getFile(userId, fileId) {
    await this.ensureUserDirectory(userId);

    try {
      const filePath = path.join(USERS_DIR, userId, `${fileId}.json`);
      const fileData = await fs.readFile(filePath, 'utf8');
      return JSON.parse(fileData);
    } catch (error) {
      console.error(`Error reading file ${fileId} for user ${userId}:`, error);
      return null;
    }
  }

  static async updateFile(userId, fileId, fileData) {
    await this.ensureUserDirectory(userId);

    try {
      // Get the existing file
      const existingFile = await this.getFile(userId, fileId);
      if (!existingFile) return null;

      // Update the file
      const updatedFile = {
        ...existingFile,
        ...fileData,
        id: fileId, // Ensure ID doesn't change
        userId: userId, // Ensure userId doesn't change
        updatedAt: new Date().toISOString()
      };

      // Save updated file
      const filePath = path.join(USERS_DIR, userId, `${fileId}.json`);
      await fs.writeFile(filePath, JSON.stringify(updatedFile, null, 2));

      // Update index
      const files = await this.getAllFilesForUser(userId);
      const fileIndex = files.findIndex(file => file.id === fileId);
      if (fileIndex !== -1) {
        files[fileIndex] = {
          id: updatedFile.id,
          name: updatedFile.name,
          createdAt: updatedFile.createdAt,
          updatedAt: updatedFile.updatedAt
        };
        const userIndexFile = path.join(USERS_DIR, userId, 'index.json');
        await fs.writeFile(userIndexFile, JSON.stringify(files, null, 2));
      }

      return updatedFile;
    } catch (error) {
      console.error(`Error updating file ${fileId} for user ${userId}:`, error);
      return null;
    }
  }

  static async deleteFile(userId, fileId) {
    await this.ensureUserDirectory(userId);

    try {
      // Remove from index
      const files = await this.getAllFilesForUser(userId);
      const newFiles = files.filter(file => file.id !== fileId);

      if (files.length === newFiles.length) {
        return false; // File not found in index
      }

      const userIndexFile = path.join(USERS_DIR, userId, 'index.json');
      await fs.writeFile(userIndexFile, JSON.stringify(newFiles, null, 2));

      // Delete the file
      const filePath = path.join(USERS_DIR, userId, `${fileId}.json`);
      try {
        await fs.unlink(filePath);
      } catch (error) {
        console.error(`Error deleting file ${fileId} for user ${userId}:`, error);
        // Continue even if file doesn't exist
      }

      return true;
    } catch (error) {
      console.error(`Error in delete operation for ${fileId} for user ${userId}:`, error);
      return false;
    }
  }
}

module.exports = FileModel;