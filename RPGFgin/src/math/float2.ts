export class float2 {
    x: number;
    y: number;

    constructor(x: number = 0, y: number = 0, z: number = 0) {
        this.x = x;
        this.y = y;
    }

    set(x: number, y: number): float2 {
        this.x = x;
        this.y = y;

        return this;
    }

    length(): number {
        return Math.sqrt(this.x ** 2 + this.y ** 2);
    }

    divideScalar(val: number): float2 {
        this.x /= val;
        this.y /= val;

        return this;
    }

}
