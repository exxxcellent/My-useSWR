import { useEffect, useState } from "react";

interface Props<Data> {
    url: string;
    fetcher: (url: string) => Promise<Data>;
    options?: Options<Data> | undefined;
}

interface Return<Data> {
    data: Data | null;
    isLoading: boolean;
    error: Error | null;
}

interface Options<Data> {
    revalidate?: number;
    onSuccess?: (data: Data) => Data;
    onError?: (error: Error) => void;
}

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