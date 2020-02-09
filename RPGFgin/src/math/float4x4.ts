export class float4x4 {
    elements;

    constructor() {
        this.elements = new Float32Array([
            1, 0, 0, 0,
            0, 1, 0, 0,
            0, 0, 1, 0,
            0, 0, 0, 1
        ]);
    }

    rotateX(angle) {
        const rad = Math.PI * angle / 180;

        this.elements[1 + 1 * 4] = Math.cos(rad);
        this.elements[2 + 1 * 4] = -Math.sin(rad);

        this.elements[1 + 2 * 4] = Math.sin(rad);
        this.elements[2 + 2 * 4] = Math.cos(rad);

        return this;
    }

    rotateY(angle) {
        const rad = Math.PI * angle / 180;

        this.elements[0 + 0 * 4] = Math.cos(rad);
        this.elements[2 + 0 * 4] = Math.sin(rad);

        this.elements[0 + 3 * 4] = -Math.sin(rad);
        this.elements[2 + 3 * 4] = Math.cos(rad);

        return this;
    }

    rotateZ(angle) {
        const rad = Math.PI * angle / 180;

        this.elements[0 + 0 * 4] = Math.cos(rad);
        this.elements[1 + 0 * 4] = Math.sin(rad);

        this.elements[0 + 1 * 4] = -Math.sin(rad);
        this.elements[1 + 1 * 4] = Math.cos(rad);

        return this;
    }

    translate(arr) {
        this.elements[0 + 3 * 4] = arr[0];
        this.elements[1 + 3 * 4] = arr[1];
        this.elements[2 + 3 * 4] = arr[2];

        return this;
    }

    scale(x, y, z) {
        this.elements[0] = x;
        this.elements[5] = y;
        this.elements[10] = z;

        return this;
    }

    lookAt(pos, at, up) {
        let zx = pos[0] - at[0];
        let zy = pos[1] - at[1];
        let zz = pos[2] - at[2];
        let zrmag = 1 / Math.sqrt((zx * zx + zy * zy + zz * zz));

        zx *= zrmag;
        zy *= zrmag;
        zz *= zrmag;

        let xx = up[1] * zz - up[2] * zy;
        let xy = up[2] * zx - up[0] * zz;
        let xz = up[0] * zy - up[1] * zx;
        let xrmag = 1 / Math.sqrt(xx * xx + xy * xy + xz * xz);

        xx *= xrmag;
        xy *= xrmag;
        xz *= xrmag;

        let yx = zy * xz - zz * xy;
        let yy = zz * xx - zx * xz;
        let yz = zx * xy - zy * xx;
        let yrmag = 1 / Math.sqrt(yx * yx + yy * yy + yz * yz);

        yx *= yrmag;
        yy *= yrmag;
        yz *= yrmag;

        this.elements[0] = xx;
        this.elements[1] = yx;
        this.elements[2] = zx;
        this.elements[3] = 0;

        this.elements[4] = xy;
        this.elements[5] = yy;
        this.elements[6] = zy;
        this.elements[7] = 0;

        this.elements[8] = xz;
        this.elements[9] = yz;
        this.elements[10] = zz;
        this.elements[11] = 0;

        this.elements[12] = -(xx * pos[0] + xy * pos[1] + xz * pos[2]);
        this.elements[13] = -(yx * pos[0] + yy * pos[1] + yz * pos[2]);
        this.elements[14] = -(zx * pos[0] + zy * pos[1] + zz * pos[2]);
        this.elements[15] = 1;

        return this;
    };

    multiply(matrix: float4x4) {
        const res = new Array(16).fill(0);

        for (let y = 0; y < 4; ++y) {
            for (let x = 0; x < 4; ++x) {
                let sum = 0;
                for (let e = 0; e < 4; ++e) {
                    sum += this.elements[x + e * 4] * matrix.elements[e + y * 4];
                }
                res[x + y * 4] = sum;
            }
        }
        this.elements = new Float32Array(res);

        return this;
    }
    perspective(fovy, aspect, near, far) {
        const f = 1 / Math.tan(fovy / 2);
        const nf = 1 / (near - far);
        const res = new float4x4();

        res.elements = new Float32Array([
            f / aspect, 0, 0, 0,
            0, f, 0, 0,
            0, 0, (far + near) * nf, -1,
            0, 0, 2 * far * near * nf, 0
        ]);

        return res;
    }
}
