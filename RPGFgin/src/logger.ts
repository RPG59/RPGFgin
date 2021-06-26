export enum DebugLevel {
  Warnings,
  Errors,
  None,
}

export class Logger {
  private static _instance: Logger;

  private debugLevel: DebugLevel = DebugLevel.Warnings;

  static getInstance(): Logger {
    if (Logger._instance) {
      Logger._instance = new Logger();
    }

    return Logger._instance;
  }

  setDebugLevel(debugLevel: DebugLevel) {
    this.debugLevel = debugLevel;
  }
}
