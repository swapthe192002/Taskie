import { currentUser } from "@/lib/auth"
import { db } from "@/lib/db";

export const getTasks = async () => {
    try {

        const user = await currentUser();

        const tasks = await db.task.findMany({
            where: {
                userId: user?.id
            }
        })

        return tasks

    } catch {
        return null;
    }
}