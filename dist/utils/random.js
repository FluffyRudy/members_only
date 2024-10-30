"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.randint = randint;
function randint(start, end) {
    if ((end - start) <= 0)
        throw new Error("Invalid domain");
    return Math.floor(start + (end - start + 1) * Math.random());
}
