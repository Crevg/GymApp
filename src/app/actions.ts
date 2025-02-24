"use server"
import { cookies } from "next/headers";

export async function login(token: string, name: string, id: string) {
    try {
        const cookieStore = await cookies();
        cookieStore.set("gym-clapp-session", JSON.stringify({
            name: name ?? "New user",
            id: id,
            token: token
        }), { maxAge: 2600000 });
        return true;
    } catch (e) { return false }
}

export async function checkIfSignedIn() {
    const cookieStore = await cookies();
    const exists = cookieStore.has("gym-clapp-session");
    if (exists) {
        const value = cookieStore.get("gym-clapp-session")?.value;
        if (value) {
            return JSON.parse(value);
        }
    }
    return null;
}



