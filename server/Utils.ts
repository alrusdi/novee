export function shuffle(array: Array<any>) {
    for (let i = array.length - 1; i > 0; i--) {
        let j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
}

export function randomId() {
    return Math.floor(Math.random() * Math.pow(16, 12)).toString(16);
}
