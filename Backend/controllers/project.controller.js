import { validationResult } from "express-validator";
import { ProjectModel } from "../models/project.model.js";
import { createProject } from "../services/project.service.js";
import { UserModel } from "../models/user.model.js";
export const createproject = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  try {
    const { name } = req.body;
    const loggedInUser = await UserModel.findOne({ email: req.user.email });
    const userId = loggedInUser._id;
    const newProject = await createProject({ name, userId });
    res.status(201).json(newProject);
  } catch (err) {
    console.log(err);
    res.status(400).send(err.message);
  }
};
