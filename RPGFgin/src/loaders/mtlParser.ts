export class mtlParser {
    constructor(data: string) {
        if (data) {
            this.parseMtlData(data);
        } else {
            throw new Error('MLT_LOADER: invalid mtl data');
        }
    }

    parseMtlData(data) {
        const lines = data.splis('\n');
        const length = lines.length;

        for (let i = 0; i < length; ++i) {
            switch(lines[i]) {
                case 'newmtl': 

            }
        }
    }

    newmtlParse(line): void {

    }

    parse_Ns(line): void {

    }

    parse_Ni(line): void {

    }

    parse_d(line): void {

    }

}