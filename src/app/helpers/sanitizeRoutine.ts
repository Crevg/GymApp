import { Routine } from "../../../public/types";

export default function sanitizeRoutine(routine: Routine) {
    const updatedDays = [...routine.days];
    routine.days = updatedDays.map(day =>
        day.exercises ? { ...day } : {
            ...day, exercises: []
        })
}