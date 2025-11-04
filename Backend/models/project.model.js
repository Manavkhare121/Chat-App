import mongoose, { Schema } from "mongoose";

const ProjectSchema=new Schema({
    name:{
        type:String,
        lowercase:true,
        required:true,
        trim:true,
        unique:true
    },
    users:[{
        type:mongoose.Schema.Types.ObjectId,
        ref:'User'
    }]
},{
    timestamps:true
})

export const ProjectModel = mongoose.model("Project", ProjectSchema);