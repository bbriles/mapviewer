import { TokenPosition } from "./tokenPosition";

export class Map {
    name: string;
    file: string;
    width: integer;
    height: integer;
    offsetX: integer;
    offsetY: integer;
    hidden: boolean;
    tokenPositions?: TokenPosition[];
}