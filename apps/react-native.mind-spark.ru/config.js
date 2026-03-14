import Constants from 'expo-constants';

export const API_URL = `http://mind-spark.ru/api`
export const REACT_URL = `http://mind-spark.ru`
export const ML_URL = `http://mind-spark.ru/ml`
export const API_URL_dev =`http://${Constants.expoConfig?.hostUri?.split(':')[0]}:8000`;
export const REACT_URL_dev =`http://${Constants.expoConfig?.hostUri?.split(':')[0]}:3000`;
