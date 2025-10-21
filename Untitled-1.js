import {mkdirSync , renameSync} from "fs"
import { Message } from './../models/MessageModel.js';
import { mongoose } from 'mongoose';

export const getAllMessages = async (req, res, next) => {
    try {
        const user1 = req.userId
        const user2 = req.body.id

        if(!user1 || !user2){
            return res.status(400).send("user id's are required for both user")
        }
        await Message.updateMany(
            {
                recipient: user1,
                sender: user2,
                read: false
            },
            { $set: { read: true } }
        );
        const messages = await Message.find({
            $or:[
                {sender:user1,recipient:user2},
                {sender:user2,recipient:user1}
            ]
        }).sort({timestamp : 1})
        return res.status(200).json({ messages });
    } catch (error) {
        console.error(error.message)
        return res.status(500).json({ error: "Internal server error" });
    }
};

export const getRecentChats = async (req, res, next) => {
    try {
        const userId = new mongoose.Types.ObjectId(req.userId);

        const recentChats = await Message.aggregate([

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
                    lastMessage: { $first: "$content" },
                    lastMessageTimestamp: { $first: "$timestamp" },
                },
            },
           
            {
                $sort: { lastMessageTimestamp: -1 },
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
                $lookup: {
                    from: "messages",
                    let: { contactId: "$_id" },
                    pipeline: [
                        {
                            $match: {
                                $expr: {
                                    $and: [
                                        { $eq: ["$sender", "$$contactId"] },
                                        { $eq: ["$recipient", userId] },
                                        { $eq: ["$read", false] },
                                    ],
                                },
                            },
                        },
                        { $count: "unreadCount" },
                    ],
                    as: "unreadInfo",
                },
            },
            {
                $project: {
                    _id: "$contactInfo._id",
                    firstname: "$contactInfo.firstname",
                    lastname: "$contactInfo.lastname",
                    image: "$contactInfo.image",
                    color: "$contactInfo.color",
                    lastMessage: "$lastMessage",
                    lastMessageTimestamp: "$lastMessageTimestamp",
                    unreadCount: {
                        $ifNull: [{ $first: "$unreadInfo.unreadCount" }, 0],
                    },
                },
            },
        ]);

        return res.status(200).json({ chats: recentChats });
    } catch (error) {
        console.error("Error fetching recent chats:", error);
        return res.status(500).json({ message: "Internal server error." });
    }
};


export const uploadFile = async (req, res, next) => {
    try {
        if(!req.file){
            return res.status(400).send("File is required")
        }
        const date = Date.now()
        let filedir = `uploads/files/${date}`
        let fileName = `${filedir}/${req.file.originalname}`
        mkdirSync(filedir,{recursive:true})
        renameSync(req.file.path,fileName)
    return res.status(200).json({filePath:fileName})
    } catch (error) {
        console.error(error.message)
        return res.status(500).json(error.message);
    }
};