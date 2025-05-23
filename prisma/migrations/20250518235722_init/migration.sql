-- CreateTable
CREATE TABLE "Board" (
    "id_board" SERIAL NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "Board_pkey" PRIMARY KEY ("id_board")
);

-- CreateTable
CREATE TABLE "Column" (
    "id_column" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "color" TEXT NOT NULL,
    "id_board" INTEGER NOT NULL,

    CONSTRAINT "Column_pkey" PRIMARY KEY ("id_column")
);

-- CreateTable
CREATE TABLE "Task" (
    "id_task" SERIAL NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "status" TEXT NOT NULL,
    "id_column" INTEGER NOT NULL,

    CONSTRAINT "Task_pkey" PRIMARY KEY ("id_task")
);

-- CreateTable
CREATE TABLE "Subtask" (
    "id_subtask" SERIAL NOT NULL,
    "title" TEXT NOT NULL,
    "isCompleted" BOOLEAN NOT NULL,
    "id_task" INTEGER NOT NULL,

    CONSTRAINT "Subtask_pkey" PRIMARY KEY ("id_subtask")
);

-- AddForeignKey
ALTER TABLE "Column" ADD CONSTRAINT "Column_id_board_fkey" FOREIGN KEY ("id_board") REFERENCES "Board"("id_board") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Task" ADD CONSTRAINT "Task_id_column_fkey" FOREIGN KEY ("id_column") REFERENCES "Column"("id_column") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Subtask" ADD CONSTRAINT "Subtask_id_task_fkey" FOREIGN KEY ("id_task") REFERENCES "Task"("id_task") ON DELETE RESTRICT ON UPDATE CASCADE;
