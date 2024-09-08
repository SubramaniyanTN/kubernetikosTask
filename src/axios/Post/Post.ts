import { AxiosRequestConfig } from "axios";
import api, { authAPI } from "../axios";

export type PostPropsType<T = any> = {
  url: string;
  data?: T;
  config?: AxiosRequestConfig<any>;
};

const POST = <TData = any, TResponse = any>({
  url,
  data,
  config,
}: PostPropsType<TData>): Promise<TResponse> =>
  api.post(url, data, config).then((res) => res.data);

export const AUTHPOST = <TData = any, TResponse = any>({
  url,
  data,
  config,
}: PostPropsType<TData>): Promise<TResponse> =>
  authAPI.post(url, data, config).then((res) => res.data);

export default POST;
