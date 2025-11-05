import { ProjectModel } from "../models/project.model.js";
import mongoose from "mongoose";

export const createProject=async ({name,userId})=>{
    if(!name){
        throw new Error('Name is required')
    }
    if(!userId){
        throw new Error('UserId is required')
    }

     let project;
    try{
        project =await ProjectModel.create({
        name,
        users:[userId]
    })
}catch(error){
    if(error.code===11000){
        throw new Error('Project name already exisit')
    }
    throw error;
}

    return project;
}

export const getAllProjectByUserId=async ({userId})=>{
    if(!userId){
        throw new Error('UserId is required');
    }
    const allUserProjects=await ProjectModel.find({
        users:userId
    })
    return allUserProjects;
}


export const addUsersToProject=async ({projectId,users,userId})=>{
  if(!projectId){
    throw new Error("ProjectId is required")
  }
  if(!mongoose.Types.ObjectId.isValid(projectId)){
    throw new Error("Invalid projectId")
  }
  if(!users){
    throw new error("Users are required")
  }
  if(!Array.isArray(users) || users.some(userId=>!mongoose.Types.ObjectId.isValid(userId))){
    throw new Error("Invalid userId(s) in users array")
  }
  
  const project=await ProjectModel.findOne({
    _id:projectId,
    users:userId
  })

  if(!project){
    throw new Error("user not belong to this Project")
  }

  const updatedProject=await ProjectModel.findOneAndUpdate({
    _id:projectId
  },{
    $addToSet:{
      users:{
        $each:users
      }
    }
  },{
    new:true
  })
  return updatedProject;

}

export const GetProjectById=async ({projectId})=>{
    if(!projectId){
        throw new Error("ProjectId is required")
    }
    if(!mongoose.Types.ObjectId.isValid(projectId)){
        throw new Error("Invalid Project")
    }
    const project=await ProjectModel.findOne({
        _id:projectId
    })
    return project
}