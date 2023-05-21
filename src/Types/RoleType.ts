export const RoleTypes = {
    Monarch: "Monarch",
    Noble: "Noble",
    Renegade: "Renegade",
    Bandit: "Bandit",
    Knight: "Knight",
    SubRole: "SubRole"
} as const;

export const allRoles: RoleType[] = Object.values(RoleTypes);

export type RoleType = typeof RoleTypes[keyof typeof RoleTypes];