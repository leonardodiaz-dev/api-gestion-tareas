import { Request, Response, Router } from "express";
export const routerBoard = Router()
import { clearBoard, createBoard, deleteBoard, editBoard, getAllBoards, getFirstIdBoard, resetBoards } from "../controllers/boardController";

routerBoard.get('/boards',(req:Request,res:Response) => {
  getAllBoards(req,res)
})

routerBoard.post('/boards', (req: Request, res: Response) => {
  createBoard(req, res);
});

routerBoard.get('/boards/first', (req: Request, res: Response) => {
  getFirstIdBoard(req, res);
});

routerBoard.put('/boards', (req: Request, res: Response) => {
  editBoard(req,res)
});

routerBoard.put('/boards/:id', (req: Request, res: Response) => {
  clearBoard(req,res)
});

routerBoard.delete('/boards/delete/:id', (req: Request, res: Response) => {
  deleteBoard(req,res)
});

routerBoard.delete('/boards/reset', (req: Request, res: Response) => {
  resetBoards(req,res)
});