export function randint(start: number, end: number): number {
    if ((end - start) <= 0)
        throw new Error("Invalid domain")
    return Math.floor(start + (end - start + 1) * Math.random());
}