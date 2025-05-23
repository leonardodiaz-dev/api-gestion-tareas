import { Router,Request,Response } from "express";
import { changeStatusSubtask } from "../controllers/subtaskController";

export const routerSubtask = Router()

routerSubtask.put("/subtasks/:id",(req:Request,res:Response) => {
    changeStatusSubtask(req,res)
})