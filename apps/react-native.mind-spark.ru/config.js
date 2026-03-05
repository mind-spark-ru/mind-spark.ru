import Constants from 'expo-constants';

export const API_URL = `http://mind-spark.ru:8000`
export const REACT_URL = `http://mind-spark.ru:8000`
export const API_URL_dev =`http://${Constants.expoConfig?.hostUri?.split(':')[0]}:8000`;
export const REACT_URL_dev =`http://${Constants.expoConfig?.hostUri?.split(':')[0]}:3000`;
