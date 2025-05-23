import { Request, Response, Router } from "express";
import { changeCurrentStatus, changeOrderTasks, createTask, deleteTask, editTask, getAllTaskByBoard } from "../controllers/taskController";

export const routerTask = Router()

routerTask.get("/tasks/:id",(req:Request,res:Response) => {
    getAllTaskByBoard(req,res)
})

routerTask.put("/tasks/change-order",(req:Request,res:Response) => {
    changeOrderTasks(req,res)
})

routerTask.post("/tasks",(req:Request,res:Response) => {
    createTask(req,res)
})

routerTask.put("/tasks",(req:Request,res:Response) => {
    editTask(req,res)
})

routerTask.put("/tasks/:id",(req:Request,res:Response) => {
    changeCurrentStatus(req,res)
})

routerTask.delete("/tasks/:id",(req:Request,res:Response) => {
    deleteTask(req,res)
})
