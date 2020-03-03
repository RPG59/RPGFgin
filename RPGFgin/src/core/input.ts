export abstract class Input {
    static keys: boolean[] = [];

    static init() {
        window.addEventListener('keydown', e => {
            this.keys[e.code] = true;
        });

        window.addEventListener('keyup', e => {
            this.keys[e.code] = false;
        });
    }
}