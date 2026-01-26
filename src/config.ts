const localIp = process.env.EXPO_PUBLIC_LOCAL_IP || 'localhost';
export const API_BASE_URL = `http://${localIp}:8000/api`;