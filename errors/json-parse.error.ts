export class JsonParseError extends Error {
  constructor(error: string) {
    super(`Error during parsing json: ${error}`);
  }
}