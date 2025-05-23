import { Request, Response, Router } from "express";
import { getColumnsByBoard } from "../controllers/columnController";

export const routerColumn = Router()

routerColumn.get("/columns/:id",(req:Request,res:Response) => {
    getColumnsByBoard(req,res)
})