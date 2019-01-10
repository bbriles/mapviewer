import { Map } from "./map";
import * as mapsJson from "../assets/maps/maps.json";

export class MapManager {

    public loadMap(name:string):Map {
        for (var i in mapsJson.maps) {
            if (mapsJson.maps[i].name == name) {
                return mapsJson.maps[i];
            }
        }
    }
}