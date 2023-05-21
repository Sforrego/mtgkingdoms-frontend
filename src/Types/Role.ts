import { z } from "zod";
import { allRoles, RoleType } from "./RoleType";

export type Role = {
    Type: RoleType;
    Name: string;
    Ability: string;
    Image: string;
};

const roleValidator = z.object({
    Name: z.string(),
    Type: z.string().refine((roleType) => roleType in allRoles),
    Ability: z.string(),
    Image: z.string(),
});

/**
 * Checks if the given object is a valid Role so TS can assign the type to it
 * @param role object to check
 * @returns whether the object is a valid Role
 */
export const ValidateRole = (role: unknown): role is Role => roleValidator.safeParse(role).success;

export const sampleRoles: Role[] = [
    {
        Type: "Monarch",
        Name: "The King",
        Ability: "{tap}:The King {W} is the leader of the kingdom. They are the only player who can appoint Knights and grant them the ability to use the Knight's ability. The King can also appoint a new King if they wish to abdicate the throne.\n The King is the only player who can kill the Assassin.",
        Image: "https://mtgkingdomsstorage.blob.core.windows.net/mtgkingdomsaiimages/King.jpeg",
    },
    {
        Type: "Knight",
        Name: "The Angel",
        Ability: "The Angel is the King's right hand. They are the only player who can use the Knight's ability. The Angel is the only player who can kill the Assassin.\n The Angel is the only player who can kill the Assassin.",
        Image: "https://mtgkingdomsstorage.blob.core.windows.net/mtgkingdomsaiimages/Angel.jpeg",
    },
] 