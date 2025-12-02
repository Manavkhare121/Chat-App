import { validationResult } from "express-validator";
import { ProjectModel } from "../models/project.model.js";
import { createProject, getAllProjectByUserId,addUsersToProject,GetProjectById,updateProjectFileTree  } from "../services/project.service.js";
import { UserModel } from "../models/user.model.js";
import mongoose, { mongo } from "mongoose";

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


export const getAllProject=async (req,res)=>{
  try{
    const loggedInUser=await UserModel.findOne({
      email:req.user.email
    })

    const allUserProjects=await getAllProjectByUserId({
      userId:loggedInUser._id
    })

    return res.status(200).json({
      projects:allUserProjects
    })
  }catch(err){
    console.log(err)
    res.status(400).jsone({error:err.message})
  }
}

export const addUserToProject = async (req, res) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    try {

        const { projectId, users } = req.body

        const loggedInUser = await UserModel.findOne({
            email: req.user.email
        })


        const project = await addUsersToProject({
            projectId,
            users,
            userId: loggedInUser._id
        })

        return res.status(200).json({
            project,
        })

    } catch (err) {
        console.log(err)
        res.status(400).json({ error: err.message })
    }


}

export const getProjectById=async (req,res)=>{
  const {projectId}=req.params;
  try{
    const project=await GetProjectById({projectId});
    return res.status(200).json({
      project
    })
  }
  catch(err){
    
    res.status(400).json({
      error:err.message
    })
  }
}

export const updateFileTree = async (req, res) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    try {

        const { projectId, fileTree } = req.body;

        const project = await updateProjectFileTree ({
            projectId,
            fileTree
        })

        return res.status(200).json({
            project
        })

    } catch (err) {
        console.log(err)
        res.status(400).json({ error: err.message })
    }

}