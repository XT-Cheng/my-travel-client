declare namespace AMap {

  class Map {
    constructor(element: HTMLElement, callback: any);
    addControl(control: any): void;
    remove(marker: Marker | Polyline | Array<Marker> | Array<Polyline>): void;
    clearInfoWindow(): void;
    setZoomAndCenter(zoomLevel: Number, center: LngLat): void;
    setCenter(center: LngLat): void;
    setFitView(): void;
    setCity(code: string): void;
  }

  class MarkerClusterer {
    constructor(map: Map, markers: Array<Marker>, config: any);
    addMarker(marker: Marker): void;
  }

  class InfoWindow {
    constructor(config: any);
    close(): void;
    open(map: Map, pos: LngLat): void;
  }

  class ToolBar {
    constructor(config: any);
  }

  function plugin(plugins: Array<string>, callback: any): any;

  class Marker {
    constructor(config: any);
    setExtData(viewPoint: any): void;
    getExtData(): any;
    getPosition(): LngLat;
    setPosition(lnglat: LngLat);
    setAnimation(animate: String);
  }

  class LngLat {
    constructor(longtitude: number, latitude: number);
    getLng(): number;
    getLat(): number;
    distance(next: AMap.LngLat): number;
  }

  class event {
    static addListener(mapObject: any, name: string, callback: any): any;
    static removeListener(listener: any): void;
  }

  class Polyline {
    constructor(config: any);
  }

  class Pixel {
    constructor(left: number, top: number);
  }
}