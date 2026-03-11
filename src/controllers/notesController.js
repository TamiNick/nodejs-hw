import { Note } from '../models/note.js';
import createHttpError from 'http-errors';

export const getAllNotes = async (req, res, next) => {
  try {
    const page = Number(req.query.page);
    const perPage = Number(req.query.perPage);
    const tag = req.query.tag;
    const search = req.query.search;
    let queryFilter = {};
    if (tag) {
      queryFilter.tag = tag;
    }
    if (search) {
      queryFilter.$text = { $search: search };
    }
    const query = Note.find(queryFilter)
      .skip((page - 1) * perPage)
      .limit(perPage);
    const [notes, totalNotes] = await Promise.all([
      query.exec(),
      Note.countDocuments(queryFilter),
    ]);
    const totalPages = Math.ceil(totalNotes / perPage);

    res.status(200).json({
      page,
      perPage,
      totalNotes,
      totalPages,
      notes,
    });
  } catch (error) {
    next(error);
  }
};

export const getNoteById = async (req, res, next) => {
  try {
    const { noteId } = req.params;
    const note = await Note.findById(noteId);

    if (!note) {
      throw createHttpError(404, 'Note not found');
    }

    res.status(200).json(note);
  } catch (error) {
    next(error);
  }
};

export const createNote = async (req, res, next) => {
  try {
    const noteData = req.body;
    const newNote = new Note(noteData);
    const savedNote = await newNote.save();
    res.status(201).json(savedNote);
  } catch (error) {
    next(error);
  }
};

export const deleteNote = async (req, res, next) => {
  try {
    const { noteId } = req.params;
    const deletedNote = await Note.findByIdAndDelete(noteId);

    if (!deletedNote) {
      throw createHttpError(404, 'Note not found');
    }

    res.status(200).json(deletedNote);
  } catch (error) {
    next(error);
  }
};

export const updateNote = async (req, res, next) => {
  try {
    const { noteId } = req.params;
    const updatedData = req.body;

    const updatedNote = await Note.findByIdAndUpdate(noteId, updatedData, {
      new: true,
      runValidators: true,
    });

    if (!updatedNote) {
      throw createHttpError(404, 'Note not found');
    }

    res.status(200).json(updatedNote);
  } catch (error) {
    next(error);
  }
};