// noinspection SpellCheckingInspection
const range = "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ+/".split("");
const ID_LENGTH = 9;
const BASE = range.length;
const MAX_ID = Math.min(Math.pow(BASE, ID_LENGTH) - 1, Number.MAX_SAFE_INTEGER);

export function makeId(): string {
    if (Memory.id === undefined || Memory.id >= MAX_ID) {
        Memory.id = 0;
    } else {
        Memory.id++;
    }
    return idToBase64Str(Memory.id);
}

function idToBase64Str(id: number): string {
    // use base64 conversion (Not standard base64)
    const idStringArray: string[] = new Array(ID_LENGTH).fill("0");
    for (let i = ID_LENGTH - 1; i >= 0 && id > 0; i--) {
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        idStringArray[i] = range[id % BASE]!;
        id = Math.floor(id / BASE);
    }
    const processedArray = insertSeparators(idStringArray, 3, "-");
    return processedArray.join("");
}

function insertSeparators(input: string[], interval: number, separator: string): string[] {
    const outputArray: string[] = [];
    input.map((value, index) => {
        if (index > 0 && index % interval === 0) {
            outputArray.push(separator);
        }
        outputArray.push(value);
    });
    return outputArray;
}
