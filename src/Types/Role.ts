import { z } from "zod";
import { allRoles, RoleType } from "./RoleType";

export type Role = {
    type: RoleType;
    name: string;
    ability: string;
    image: string;
};

const roleValidator = z.object({
    name: z.string(),
    type: z.string().refine((roleType) => roleType in allRoles),
    ability: z.string(),
    image: z.string(),
});

/**
 * Checks if the given object is a valid Role so TS can assign the type to it
 * @param role object to check
 * @returns whether the object is a valid Role
 */
export const ValidateRole = (role: unknown): role is Role => roleValidator.safeParse(role).success;

export const sampleRoles: Role[] = [
    {
        type: "Monarch",
        name: "The King",
        ability: "{tap}:The King {W} is the leader of the kingdom. They are the only player who can appoint Knights and grant them the ability to use the Knight's ability. The King can also appoint a new King if they wish to abdicate the throne.\n The King is the only player who can kill the Assassin.",
        image: "https://mtgkingdomsstorage.blob.core.windows.net/mtgkingdomsaiimages/King.jpeg",
    },
    {
        type: "Knight",
        name: "The Angel",
        ability: "The Angel is the King's right hand. They are the only player who can use the Knight's ability. The Angel is the only player who can kill the Assassin.\n The Angel is the only player who can kill the Assassin.",
        image: "https://mtgkingdomsstorage.blob.core.windows.net/mtgkingdomsaiimages/Angel.jpeg",
    },
    {
        type: "Bandit",
        name: "The Bandit",
        ability: "The Bandit is a lone wolf. They are the only player who can use the Bandit's ability. The Bandit is the only player who can kill the Assassin.",
        image: "https://mtgkingdomsstorage.blob.core.windows.net/mtgkingdomsaiimages/Bandit.jpeg",
    },
    {
        type: "Renegade",
        name: "The Renegade",
        ability: "The Renegade is a lone wolf. They are the only player who can use the Renegade's ability. The Renegade is the only player who can kill the Assassin.",
        image: "https://mtgkingdomsstorage.blob.core.windows.net/mtgkingdomsaiimages/Renegade.jpeg",
    },
    {
        type: "Noble",
        name: "The Noble",
        ability: "The Noble is a lone wolf. They are the only player who can use the Noble's ability. The Noble is the only player who can kill the Assassin.",
        image: "https://mtgkingdomsstorage.blob.core.windows.net/mtgkingdomsaiimages/Noble.jpeg",
    },
    {
        type: "SubRole",
        name: "The SubRole",
        ability: "The SubRole is a lone wolf. They are the only player who can use the SubRole's ability. The SubRole is the only player who can kill the Assassin.",
        image: "https://mtgkingdomsstorage.blob.core.windows.net/mtgkingdomsaiimages/SubRole.jpeg",
    },
] 