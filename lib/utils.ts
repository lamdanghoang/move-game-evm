import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

// Safer formatting functions
export function toSuiU64(amount: number): string {
    if (isNaN(amount) || amount < 0) {
        throw new Error(`Invalid SUI amount: ${amount}`);
    }

    try {
        const scaled = BigInt(Math.floor(amount * 1e9));
        return scaled.toString();
    } catch (error) {
        throw new Error(`Error converting ${amount} to SUI U64:`);
    }
}

export function fromSuiU64(u64BigInt: bigint): number {
    try {
        const result = Number(u64BigInt) / 1e9;
        return result;
    } catch (error) {
        throw new Error(`Error converting ${u64BigInt} from SUI U64:`);
    }
}
