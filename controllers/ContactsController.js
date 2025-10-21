
import { User } from "../models/UserModel.js";
import mongoose from 'mongoose';
import { Message } from './../models/MessageModel.js';

export const SearchContacts = async (req, res, next) => {
  const { searchTerm } = req.body;
  try {
    if (searchTerm === undefined || searchTerm === null) {
      return res.status(400).send("SearchTerm is required");
    }
    const sanitizedSearchTerm = searchTerm.replace(
        /[.*+?^${}()|[\]\\]/g,
        "\\$&"
    );
    const regex = new RegExp(sanitizedSearchTerm,"i")
    const contacts = await User.find({
      $and: [
        { _id: { $ne: req.userId } },   
        {
          $or: [{ firstname: regex},{lastname: regex},{email: regex}]
        }
      ]
    });

    return res.status(200).json({ contacts });
  } catch (error) {
    console.error(error.message)
    return res.status(500).json({ error: "Internal server error" });
  }
};

export const getRecentChats = async (req, res, next) => {
  try {
      const userId = new mongoose.Types.ObjectId(req.userId);

      const contacts = await Message.aggregate([

          {
              $match: {
                  $or: [{ sender: userId }, { recipient: userId }],
              },
          },
 
          {
              $sort: { timestamp: -1 },
          },

          {
              $group: {
                  _id: {
                      $cond: {
                          if: { $eq: ["$sender", userId] },
                          then: "$recipient",
                          else: "$sender",
                      },
                  },
                  lastMessageTime: { $first: "$timestamp" },
              },
          },
          {
              $lookup: {
                  from: "users",
                  localField: "_id",
                  foreignField: "_id",
                  as: "contactInfo",
              },
          },
          {
              $unwind: "$contactInfo",
          },

          {
              $project: {
                  _id: 1,
                  lastMessageTime: 1,
                  email: "$contactInfo.email",
                  firstname: "$contactInfo.firstname",
                  lastname: "$contactInfo.lastname",
                  image: "$contactInfo.image",
                  color: "$contactInfo.color",
              },
          },
          {
              $sort:{lastMessageTime:-1},
          }
      ]);

      return res.status(200).json({ contacts });
  } catch (error) {
      console.error("Error fetching recent chats:", error);
      return res.status(500).json({ message: "Internal server error." });
  }
};
