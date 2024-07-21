import { useEffect, useState } from "react";

interface Props<Data> {
    url: string;
    fetcher: (url: string) => Promise<Data>;
    options?: Options | undefined;
}

interface Return<Data> {
    data: Data | null;
    isLoading: boolean;
    error: Error | null;
}

interface Options {
    revalidate?: number;
    onSuccess?: () => void;
    onError?: (error: Error) => void;
}

export default function useSWR<Data>({ url, fetcher, options }: Props<Data>): Return<Data> {
    const [data, setData] = useState<Data | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [error, setError] = useState<Error | null>(null);

    useEffect(() => {
        fetcher(url)
            .then((data: Data) => {
                setData(data);
                setIsLoading(false);
                options?.onSuccess ? options.onSuccess() : null;
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
                        setData(data);
                        setIsLoading(false);
                        options?.onSuccess ? options.onSuccess() : null;
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