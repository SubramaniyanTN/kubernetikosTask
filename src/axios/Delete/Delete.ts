import { AxiosRequestConfig } from "axios";
import api from "../axios";

export type DeletePropsType<T = any> = {
  url: string;
  config?: AxiosRequestConfig<T>;
};

const DELETE = <TBody = any, TResponse = any>({
  url,
  config,
}: DeletePropsType<TBody>): Promise<TResponse> =>
  api.delete(url, config).then((res) => res.data);

export default DELETE;
