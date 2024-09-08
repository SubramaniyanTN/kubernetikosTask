import { AxiosRequestConfig } from "axios";
import api from "../axios";

export type GetPropsType = {
  url: string;
  config?: AxiosRequestConfig<any>;
};

const GET = <TResponse = any>({
  url,
  config,
}: GetPropsType): Promise<TResponse> =>
  api.get(url, config).then((res) => {
    console.log(res);
    return res.data;
  });

export default GET;
