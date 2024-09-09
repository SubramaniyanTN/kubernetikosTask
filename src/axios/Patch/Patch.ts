import { AxiosRequestConfig } from "axios";
import api from "../axios";

export type PatchPropsType<T = any> = {
  url: string;
  data?: T;
  config?: AxiosRequestConfig<any>;
};

const PATCH = <TData = any, TResponse = any>({
  url,
  data,
  config,
}: PatchPropsType<TData>): Promise<TResponse> =>
  api.patch(url, data, config).then((res) => res.data);

export default PATCH;
