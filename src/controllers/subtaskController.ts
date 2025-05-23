import { PrismaClient } from "@prisma/client";
import { Request, Response } from "express";

const prisma = new PrismaClient()

export const changeStatusSubtask = async (req: Request, res: Response) => {
    try {
        const { id } = req.params
        const { isCompleted } = req.body
        const subtask = await prisma.subtask.update({
            where: {
                id_subtask: Number(id)
            },
            data: {
                isCompleted
            }, include: {
                task: true
            }
        })
        return res.json(subtask)
    } catch (error) {
        if (error instanceof Error) {
            return res.status(500).json({ message: error.message })
        }
    }
}