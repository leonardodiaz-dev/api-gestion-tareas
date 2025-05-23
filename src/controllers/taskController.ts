import { PrismaClient, Task } from "@prisma/client";
import { Request, Response } from "express";
import { Subtask } from "@prisma/client";

const prisma = new PrismaClient()

export const getAllTaskByBoard = async (req: Request, res: Response) => {
    try {
        const { id } = req.params

        const tasks = await prisma.task.findMany({
            where: {
                column: {
                    board: {
                        id_board: Number(id)
                    }
                }
            },orderBy: {
                order: 'asc' 
            },include: {
            subtasks: true
        }
        })
    res.json(tasks)
} catch (error) {
    if (error instanceof Error) {
        return res.status(500).json({ message: error.message })
    }
}
}

export const createTask = async (req: Request, res: Response) => {
    try {
        const { title, id_column, description, subtasks, status } = req.body
        console.log(req.body)
        const new_task = await prisma.task.create({
            data: {
                title,
                description,
                status,
                id_column: Number(id_column),
                subtasks: {
                    create: subtasks.map((subtask: Subtask) => ({
                        title: subtask.title,
                        isCompleted: subtask.isCompleted
                    }))
                }
            },
            include: {
                subtasks: true
            }

        })
        return res.json(new_task)
    } catch (error) {
        if (error instanceof Error) {
            return res.status(500).json({ message: error.message })
        }
    }
}

export const editTask = async (req: Request, res: Response) => {

    const { id_task, title, description, id_column, status, subtasks } = req.body

    try {
        const existingSubtasks = await prisma.subtask.findMany({
            where: {
                id_task: Number(id_task)
            },
            select: {
                id_subtask: true
            }
        })

        const incomingIds = subtasks
            .filter((subtask: Subtask) => subtask.id_subtask !== 0)
            .map((subtask: Subtask) => subtask.id_subtask)

        const deleteSubtasks = existingSubtasks
            .filter(subtask => !incomingIds.includes(subtask.id_subtask))

        await prisma.subtask.deleteMany({
            where: {
                id_subtask: {
                    in: deleteSubtasks.map(d => d.id_subtask)
                }
            }
        })

        const existingTask = await prisma.task.findUnique({
            where: {
                id_task: Number(id_task)
            },
            include: {
                column: {
                    select: {
                        id_board: true
                    }
                }
            }
        })

        const columnToChange = await prisma.column.findMany({
            where: {
                id_board: existingTask?.column.id_board,
                name: {
                    equals: status
                }
            }
        })

        const task_edit = await prisma.task.update({
            where: {
                id_task: Number(id_task)
            },
            data: {
                title,
                description,
                status,
                id_column: Number(existingTask?.status !== status ? columnToChange[0].id_column : id_column),
                subtasks: {
                    update: subtasks
                        .filter((s: Subtask) => s.id_subtask && s.id_subtask > 0)
                        .map((s: Subtask) => ({
                            where: { id_subtask: s.id_subtask },
                            data: {
                                title: s.title,
                                isCompleted: s.isCompleted
                            }
                        })),
                    create: subtasks
                        .filter((s: Subtask) => s.id_subtask === 0)
                        .map((s: Subtask) => ({
                            title: s.title,
                            isCompleted: s.isCompleted
                        }))
                }
            }, include: {
                subtasks: true
            }
        })
        return res.json(task_edit)
    } catch (error) {
        if (error instanceof Error) {
            return res.status(500).json({ message: error.message });
        }
    }
}

export const changeCurrentStatus = async (req: Request, res: Response) => {
    const { id } = req.params;
    const { id_column } = req.body;

    try {
        const columnToChange = await prisma.column.findUnique({
            where: {
                id_column: Number(id_column)
            }
        })
        const updatedTask = await prisma.task.update({
            where: { id_task: Number(id) },
            data: {
                id_column: Number(id_column),
                status: columnToChange?.name
            },
            include: {
                subtasks: true
            }
        });

        return res.json(updatedTask);
    } catch (error) {
        if (error instanceof Error) {
            return res.status(500).json({ message: error.message });
        }
    }
};

export const deleteTask = async (req: Request, res: Response) => {
    const { id } = req.params

    try {
        const taskDelete = await prisma.task.delete({
            where: {
                id_task: Number(id)
            }
        })
        return res.json(taskDelete)
    } catch (error) {
        if (error instanceof Error) {
            return res.status(500).json({ message: error.message });
        }
    }
}

export const changeOrderTasks = async (req: Request, res: Response) => {
    const { tasks } = req.body
    console.log(tasks)
    try {
        const task_update = await Promise.all(
            tasks.map((task: Task) =>
                prisma.task.update(
                    {
                        where: {
                            id_task: task.id_task
                        },
                        data: {
                            id_column:task.id_column,
                            order: task.order
                        }, include: {
                            subtasks: true
                        }
                    }
                )
            )
        )
        return res.json(task_update)
    } catch (error) {
        if (error instanceof Error) {
            return res.status(500).json({ message: error.message });
        }
    }
}
