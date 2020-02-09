export class FileLoader {
    loader: Promise<any>;
    fileType: string;
    constructor(path: string, fileType: string) {
        this.loader = fetch(path);
        this.fileType = fileType;
    }

    load(): Promise<any> {
        return this.loader.then(x => {
            if (this.fileType in x) {
                return x[this.fileType]();
            } else {
                // exception
            }
        });
    }
}