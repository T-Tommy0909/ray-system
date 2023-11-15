import axios, { AxiosRequestConfig, AxiosResponse } from "axios";
import qs from "qs";

const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

const setOptions = async (
  options: AxiosRequestConfig
): Promise<AxiosRequestConfig> => {
  options = { ...options, withCredentials: true };
  if (options.headers == null) options.headers = {};

  // baseURLを付加する
  if (options.baseURL == null) {
    options.baseURL = BASE_URL;
  }

  // 配列クエリのシリアライズ
  options.paramsSerializer = (params) => {
    return qs.stringify(params, {
      arrayFormat: "indices",
    });
  };

  return options;
};

export const requestGet = async <T>(
  url: string,
  options: AxiosRequestConfig = {}
): Promise<AxiosResponse<T>> => {
  options = await setOptions(options);

  return axios.get<T>(url, options);
};

export const requestPost = async <T, U = undefined>(
  url: string,
  payload: U,
  options: AxiosRequestConfig = {}
): Promise<AxiosResponse<T>> => {
  options = await setOptions(options);

  return axios.post<T>(url, payload, options);
};

export const requestPut = async <T, U = undefined>(
  url: string,
  payload: U,
  options: AxiosRequestConfig = {}
): Promise<AxiosResponse<T>> => {
  options = await setOptions(options);

  return axios.put<T>(url, payload, options);
};

export const requestPatch = async <T, U = undefined>(
  url: string,
  payload: U,
  options: AxiosRequestConfig = {}
): Promise<AxiosResponse<T>> => {
  options = await setOptions(options);

  return axios.patch<T>(url, payload, options);
};

export const requestDelete = async <T>(
  url: string,
  options: AxiosRequestConfig = {}
): Promise<AxiosResponse<T>> => {
  options = await setOptions(options);

  return axios.delete<T>(url, options);
};
