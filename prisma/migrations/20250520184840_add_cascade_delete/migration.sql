-- DropForeignKey
ALTER TABLE "Column" DROP CONSTRAINT "Column_id_board_fkey";

-- DropForeignKey
ALTER TABLE "Subtask" DROP CONSTRAINT "Subtask_id_task_fkey";

-- DropForeignKey
ALTER TABLE "Task" DROP CONSTRAINT "Task_id_column_fkey";

-- AddForeignKey
ALTER TABLE "Column" ADD CONSTRAINT "Column_id_board_fkey" FOREIGN KEY ("id_board") REFERENCES "Board"("id_board") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Task" ADD CONSTRAINT "Task_id_column_fkey" FOREIGN KEY ("id_column") REFERENCES "Column"("id_column") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Subtask" ADD CONSTRAINT "Subtask_id_task_fkey" FOREIGN KEY ("id_task") REFERENCES "Task"("id_task") ON DELETE CASCADE ON UPDATE CASCADE;
