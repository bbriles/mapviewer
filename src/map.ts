import { TokenPosition } from "./tokenPosition";

export class Map {
    name: string;
    file: string;
    width: integer;
    height: integer;
    offsetX: integer;
    offsetY: integer;
    hidden: boolean;
    showStartX?: integer;
    showStartY?: integer;
    showEndX?: integer;
    showEndY?: integer;
    tokenPositions?: TokenPosition[];
}