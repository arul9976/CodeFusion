// server/controllers/fileController.js
const FileModel = require('../models/fileModel');

// API Controllers
exports.getAllFiles = async (req, res) => {
  try {
    const userId = req.user.id; // Assuming authentication middleware sets req.user
    const files = await FileModel.getAllFilesForUser(userId);
    res.json(files);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.createFile = async (req, res) => {
  try {
    const userId = req.user.id;
    const newFile = await FileModel.createFile(userId, req.body);
    res.status(201).json(newFile);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

exports.updateFile = async (req, res) => {
  try {
    const userId = req.user.id;
    const updatedFile = await FileModel.updateFile(userId, req.params.id, req.body);
    if (!updatedFile) {
      return res.status(404).json({ message: 'File not found' });
    }
    res.json(updatedFile);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

exports.deleteFile = async (req, res) => {
  try {
    const userId = req.user.id;
    const success = await FileModel.deleteFile(userId, req.params.id);
    if (!success) {
      return res.status(404).json({ message: 'File not found' });
    }
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Socket Controllers - updated to use userId
exports.getAllFilesData = async (userId) => {
  return await FileModel.getAllFilesForUser(userId);
};

exports.createFileData = async (userId, fileData) => {
  return await FileModel.createFile(userId, fileData);
};

exports.updateFileData = async (userId, fileData) => {
  return await FileModel.updateFile(userId, fileData.id, fileData);
};

exports.deleteFileData = async (userId, fileId) => {
  return await FileModel.deleteFile(userId, fileId);
};