import { Role } from "../Types/Role";

export const ValidateRolesBeforeStart = (selectedRolesPool: Role[]): boolean => {
    const monarchCount = selectedRolesPool.filter(role => role.type === "Monarch").length;
    const knightCount = selectedRolesPool.filter(role => role.type === "Knight").length;
    const banditCount = selectedRolesPool.filter(role => role.type === "Bandit").length;
    const renegadeCount = selectedRolesPool.filter(role => role.type === "Renegade").length;
    const nobleCount = selectedRolesPool.filter(role => role.type === "Noble").length;

    if(monarchCount < 2) {
        alert('You must have at least 2 Monarchs');
        return false;
    } else if(knightCount < 2) {
        alert('You must have at least 2 Knights');
        return false;
    } else if(banditCount < 4) {
        alert('You must have at least 4 Bandits');
        return false;
    } else if(renegadeCount < 2) {
        alert('You must have at least 2 Renegades');
        return false;
    } else if(nobleCount < 2) {
        alert('You must have at least 2 Nobles');
        return false;
    }

    return true;
}