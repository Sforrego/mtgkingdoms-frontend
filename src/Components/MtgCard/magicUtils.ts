export const manaCostMatcher = /\{(\w+)\}/g

export function manaCostParser(manaCost: string) {
    const costs: string[] = []
    for (const costMatch of manaCost.matchAll(manaCostMatcher)) {
        costs.push(costMatch[1])
    }
    return costs
}
