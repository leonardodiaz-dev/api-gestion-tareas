import { PrismaClient } from "@prisma/client";
import { Column } from "../interfaces/Board";
import { Request, Response } from "express";

const prisma = new PrismaClient()

export const getColumnsByBoard = async (req : Request,res : Response) => {
    const { id } = req.params
    try {
        const columns = await prisma.column.findMany({
            where:{
                id_board:Number(id)
            },
            include:{
                tasks:{
                    include:{
                        subtasks:true
                    }
                }
            }
        })
        return res.json(columns)
    } catch (error) {
          if (error instanceof Error) {
            return res.status(500).json({ message: error.message })
        }
    }
}