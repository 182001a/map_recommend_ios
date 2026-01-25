// src/api/route.ts (新規作成)

import { Coordinate } from "../screens/CourseListScreen";

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