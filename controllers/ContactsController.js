
import { User } from "../models/UserModel.js";

export const SearchContacts = async (req, res, next) => {
  const { searchTerm } = req.body;
  try {
    if (searchTerm==undefined || searchTerm ==null) {
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
    console.error(error.message);
    return res.status(500).json({ error: "Internal server error" });
  }
};
