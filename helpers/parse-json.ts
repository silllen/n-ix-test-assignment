import { JsonParseError } from '../errors/json-parse.error';

export function parseJson(json: string): any {
  try {
    return JSON.parse(json);
  } catch (error) {
    throw new JsonParseError(error)
  }
}

