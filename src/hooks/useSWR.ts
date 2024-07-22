import { useEffect, useState } from "react";
/**
    * Interface of hook for Props. Get a generic <Data>
    * @property url <string>
    * @property fetcher <(url: string)> returns Promise<Data>
    * @property options <Options<Data> | undefined>
*/
interface Props<Data> {
    url: string;
    fetcher: (url: string) => Promise<Data>;
    options?: Options<Data> | undefined;
}
/**
    * Interface of hook for return. Get a generic <Data>
    * @property data <Data | null>
    * @property isLoading <boolean>
    * @property error <Error | null>
*/
interface Return<Data> {
    data: Data | null;
    isLoading: boolean;
    error: Error | null;
}
/**
    * Interface of hook for Options. Get a generic <Data>
    * @property Revalidate <number | undefined>
    * @property onSuccess <(data: Data)> returns Data
    * @property onError <(error: Error)> returns none
*/
interface Options<Data> {
    revalidate?: number;
    onSuccess?: (data: Data) => Data;
    onError?: (error: Error) => void;
}
/**
 * useSWR hook for server requests
 * @param url The url
 * @param fetcher The fetcher function that requests data
 * @param options The options is optional parameters of hook for revalidate, onSuccess, cache and etc
 * @returns Data, isLoading, error as object
 */
export default function useSWR<Data>({ url, fetcher, options }: Props<Data>): Return<Data> {
    const [data, setData] = useState<Data | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [error, setError] = useState<Error | null>(null);

    useEffect(() => {
        fetcher(url)
            .then((data: Data) => {
                if (!sessionStorage.getItem(url)) {
                    sessionStorage.setItem(url, JSON.stringify(data));
                    console.log("Recording");
                    setData(data);
                } else {
                    const cacheItem = sessionStorage.getItem(url);
                    console.log("Get");
                    setData(cacheItem != null ? JSON.parse(cacheItem) : null)
                }
                setIsLoading(false);
                if (options?.onSuccess) {
                    const filteredData = options.onSuccess(data);
                    setData(filteredData)
                }

            })
            .catch((error: Error) => {
                setIsLoading(false);
                setError(error);
                options?.onError ? options.onError(error) : null;
            })
            .finally(() => {
                setIsLoading(false);
            })
    }, []);

    useEffect(() => {
        if (options?.revalidate && options.revalidate >= 0) {
            const intervalId = setInterval(() => {
                fetcher(url)
                    .then((data: Data) => {
                        if (!sessionStorage.getItem(url)) {
                            sessionStorage.setItem(url, JSON.stringify(data));
                            console.log("Recording");
                            setData(data);
                        } else {
                            const cacheItem = sessionStorage.getItem(url);
                            console.log("Get");
                            setData(cacheItem != null ? JSON.parse(cacheItem) : null)
                        }
                        setIsLoading(false);
                        if (options?.onSuccess) {
                            const filteredData = options.onSuccess(data);
                            setData(filteredData)
                        }
                    })
                    .catch((error: Error) => {
                        setIsLoading(false);
                        setError(error);
                        options?.onError ? options.onError(error) : null;
                    })
                    .finally(() => {
                        setIsLoading(false);
                    })
            }, options.revalidate * 1000);
            return () => {
                clearInterval(intervalId);
            }
        }
        return;
    }, [options?.revalidate]);

    return { data, isLoading, error };
}