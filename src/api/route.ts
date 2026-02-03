// src/api/route.ts (新規作成)

import { Coordinate } from "../screens/CourseListScreen";

const haversineDistanceKm = (from: Coordinate, to: Coordinate): number => {
  const toRad = (value: number) => (value * Math.PI) / 180;
  const earthRadiusKm = 6371;
  const dLat = toRad(to.latitude - from.latitude);
  const dLon = toRad(to.longitude - from.longitude);
  const lat1 = toRad(from.latitude);
  const lat2 = toRad(to.latitude);

  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.sin(dLon / 2) * Math.sin(dLon / 2) * Math.cos(lat1) * Math.cos(lat2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return earthRadiusKm * c;
};

/**
 * OSRM APIを使用して、複数の地点を結ぶ歩行ルートを取得する
 */
export const fetchWalkingRoute = async (waypoints: Coordinate[]): Promise<Coordinate[]> => {
  // 1. 座標を "経度,緯度" の形式に変換し、セミコロンで繋ぐ (OSRMは経度が先です！)
  const coordsString = waypoints
    .map(p => `${p.longitude},${p.latitude}`)
    .join(';');

  // 2. OSRM APIを叩く (geometries=geojson を指定すると扱いやすいデータが返ります)
  const url = `http://router.project-osrm.org/route/v1/walking/${coordsString}?overview=full&geometries=geojson`;

  try {
    const response = await fetch(url);
    const data = await response.json();

    if (data.code !== 'Ok') {
      throw new Error('ルートの取得に失敗しました');
    }

    // 3. 返ってきた [経度, 緯度] の配列を {latitude, longitude} の形式に変換
    const route = data.routes[0].geometry.coordinates.map((coord: number[]) => ({
      latitude: coord[1],
      longitude: coord[0],
    }));

    return route;
  } catch (error) {
    console.error("OSRM Error:", error);
    return waypoints; // 失敗時は元の直線データを返す（フォールバック）
  }
};

/**
 * OSRM APIを使用して、2地点間の歩行距離(km)を取得する
 */
export const fetchWalkingDistance = async (from: Coordinate, to: Coordinate): Promise<number> => {
  const coordsString = `${from.longitude},${from.latitude};${to.longitude},${to.latitude}`;
  const url = `http://router.project-osrm.org/route/v1/walking/${coordsString}?overview=false`;

  try {
    const response = await fetch(url);
    const data = await response.json();

    if (data.code !== 'Ok' || !data.routes?.length) {
      throw new Error('距離の取得に失敗しました');
    }

    const meters = data.routes[0].distance as number;
    return meters / 1000;
  } catch (error) {
    console.error("OSRM Distance Error:", error);
    return haversineDistanceKm(from, to);
  }
};
