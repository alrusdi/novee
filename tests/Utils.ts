export function wait() {
    let time = Date.now();
    while (true) {
        if (Date.now() > time) break;
    }
}
