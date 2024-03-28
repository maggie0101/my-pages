import SongModel from "../models/song";
import ListModel from "../models/list";
import { genericErrorHandler } from "../utils/errors";
import type {
  SongData,
  CreateListPayload,
  CreateListResponse,
  GetListsResponse,
  ListData,
  UpdateListPayload,
} from "@lib/shared_types";
import type { Request, Response } from "express";

// Get all lists
export const getLists = async (_: Request, res: Response<GetListsResponse>) => {
  try {
    const lists = await ListModel.find({});

    // Return only the id and name of the list
    const listsToReturn = lists.map((list) => {
      return {
        id: list.id,
        list_name: list.list_name,
        description: list.description,
      };
    });

    return res.status(200).json(listsToReturn);
  } catch (error) {
    genericErrorHandler(error, res);
  }
};

// Get a list
export const getList = async (
  req: Request<{ id: string }>,
  res: Response<ListData | { error: string }>,
) => {
  try {
    const { id } = req.params;
    const lists = await ListModel.findById(id).populate("songs");
    if (!lists) {
      return res.status(404).json({ error: "id is not valid" });
    }

    return res.status(200).json({
      id: lists.id,
      list_name: lists.list_name,
      description: lists.description,
      songs: lists.songs as unknown as SongData[],
    });
  } catch (error) {
    genericErrorHandler(error, res);
  }
};

// Create a list
export const createList = async (
  req: Request<never, never, CreateListPayload>,
  res: Response<CreateListResponse>,
) => {
  try {
    const { id } = await ListModel.create(req.body);
    return res.status(201).json({ id });
  } catch (error) {
    genericErrorHandler(error, res);
  }
};

// Update a list
export const updateList = async (
  req: Request<{ id: string }, never, UpdateListPayload>,
  res: Response,
) => {
  try {
    const { id } = req.params;
    const { list_name, description } = req.body;

    // Update the list
    const newList = await ListModel.findByIdAndUpdate(
      id,
      {
        list_name: list_name,
        description: description,
      },
      { new: true },
    );

    // If the list is not found, return 404
    if (!newList) {
      return res.status(404).json({ error: "id is not valid" });
    }

    return res.status(200).send("OK");
  } catch (error) {
    genericErrorHandler(error, res);
  }
};

// Delete a list
export const deleteList = async (
  req: Request<{ id: string }>,
  res: Response,
) => {
  // Create a transaction
  const session = await ListModel.startSession();
  session.startTransaction();

  try {
    const { id } = req.params;
    const deletedList = await ListModel.findByIdAndDelete(id).session(session);
    if (!deletedList) {
      throw new Error("id is not valid");
    }
    await SongModel.deleteMany({ list_id: id }).session(session);
    await session.commitTransaction();
    res.status(200).send("OK");
  } catch (error) {
    await session.abortTransaction();
    genericErrorHandler(error, res);
  } finally {
    session.endSession();
  }
};
