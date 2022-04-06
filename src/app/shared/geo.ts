import { BBox2d } from '@turf/helpers/dist/js/lib/geojson';
import { Position } from 'geojson';

export const BRITISH_ISLES_BBOX: BBox2d = [-7.57216793459, 49.959999905, 1.68153079591, 58.6350001085];

export const position: (obj: { lon: number; lat: number }) => Position = (obj) => [obj.lon, obj.lat];
