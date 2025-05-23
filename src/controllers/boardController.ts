import { PrismaClient } from "@prisma/client";
import { Column } from "../interfaces/Board";
import { Request, Response } from "express";


const prisma = new PrismaClient()

export const getFirstIdBoard = async (req: Request, res: Response) => {
    try {
        let id_board: number | undefined = 0
        const board = await prisma.board.findFirst()
        id_board = board?.id_board
        return res.json(id_board)
    } catch (error) {
        if (error instanceof Error) {
            return res.status(500).json({ message: error.message })
        }
    }
}

export const getAllBoards = async (req: Request, res: Response) => {
    try {
        const boards = await prisma.board.findMany({
            include: {
                columns: {
                    include: {
                        tasks: true
                    }
                }
            }
        })

        return res.json(boards)
    } catch (error) {
        if (error instanceof Error) {
            return res.status(500).json({ message: error.message })
        }
    }
}

export const createBoard = async (req: Request, res: Response) => {
    const { name, columns } = req.body

    try {
        if (!name) {
            return res.status(400).json({ message: 'El nombre es requerido' });
        }
        const new_board = await prisma.board.create({
            data: {
                name,
                columns: {
                    create: columns.map((column: Column) => ({
                        name: column.name,
                        color: column.color,
                    })),
                },
            },
            include: {
                columns: true
            }
        });

        return res.json(new_board)
    } catch (error) {
        if (error instanceof Error) {
            return res.status(500).json({ message: error.message })
        }
    }
}

export const editBoard = async (req: Request, res: Response) => {
    const { id_board, name, columns } = req.body;

    try {

        const existingColumns = await prisma.column.findMany({
            where: { id_board: Number(id_board) },
            select: { id_column: true },
        });

        const incomingIds = columns
            .filter((c: any) => c.id_column && c.id_column > 0)
            .map((c: any) => c.id_column);

        const columnsToDelete = existingColumns
            .filter((col) => !incomingIds.includes(col.id_column));

        await prisma.column.deleteMany({
            where: {
                id_column: {
                    in: columnsToDelete.map((c) => c.id_column),
                },
            },
        });

        const board_edit = await prisma.board.update({
            where: { id_board: Number(id_board) },
            data: {
                name,
                columns: {
                    update: columns
                        .filter((c: any) => c.id_column && c.id_column > 0)
                        .map((c: any) => ({
                            where: { id_column: c.id_column },
                            data: {
                                name: c.name,
                                color: c.color,
                            },
                        })),

                    create: columns
                        .filter((c: any) => !c.id_column || c.id_column === 0)
                        .map((c: any) => ({
                            name: c.name,
                            color: c.color,
                        })),
                },
            },

            include: {
                columns: {
                    include: {
                        tasks: true
                    }
                }
            }
        });

        return res.json(board_edit);
    } catch (error) {
        return res.status(500).json({ message: (error as Error).message });
    }
};

export const clearBoard = async (req: Request, res: Response) => {
    const { id } = req.params
    try {
        const board_clear = await prisma.board.update({
            where: {
                id_board: Number(id)
            }, data: {
                columns: {
                    deleteMany: {}
                }
            }, include: {
                columns: true
            }
        })
        return res.json(board_clear)
    } catch (error) {
        if (error instanceof Error) {
            return res.status(500).json({ message: error.message })
        }
    }
}

export const deleteBoard = async (req: Request, res: Response) => {
    const { id } = req.params
    try {
        const delete_board = await prisma.board.delete({
            where: {
                id_board: Number(id)
            }
        })
        return res.json(delete_board)
    } catch (error) {
        if (error instanceof Error) {
            return res.status(500).json({ message: error.message })
        }
    }
}

export const resetBoards = async (_req: Request, res: Response) => {
    try {
       
        await prisma.column.deleteMany();

        const boards = await prisma.board.findMany({
            include: {
                columns: {
                    include: {
                        tasks: true
                    }
                }
            }
        });

        return res.json(boards);
    } catch (error) {
        if (error instanceof Error) {
            return res.status(500).json({ message: error.message });
        } 
    }

};
