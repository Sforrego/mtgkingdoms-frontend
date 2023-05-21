export const RoleTypes = {
    Monarch: "Monarch",
    Noble: "Noble",
    Renegade: "Renegade",
    Outlaw: "Outlaw",
    Knight: "Knight",
} as const;

export const allRoles: RoleType[] = Object.values(RoleTypes);

export type RoleType = typeof RoleTypes[keyof typeof RoleTypes];