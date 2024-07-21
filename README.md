# My implementation of hook useSWR
## This repo is small copy of hook useSWR by Vercel.

My hook can:
- Fetch data on url,
- Revalidate data,
- Return state of query: 
  - Data,
  - Loading,
  - Error,
- Function on success,
- Function on error,
- TypeScript.

## Quick start

```tsx
const fetcher = (url: string) => fetch(url).then(res => res.json());

function App() {
  const { data, isLoading, error } = useSWR<User[]>(
    {
      url: "https://jsonplaceholder.typicode.com/users",
      fetcher,
    }
  });

  return <ul>
    {isLoading ? <div>Loading...</div> : null}
    {error !== null ? <div>{error.message}</div> : null}
    {data?.map(user => <li key={user.id}>{user.name}</li>)}
  </ul>
}
```
In this example we get users thanks to useSWR. <br />
The first parameter we pass is the `url` from where we are requesting the data, and the second parameter is the `fetcher`. <br />

`useSWR` also returns 3 values: `data`, `isLoading` and `error`. 
When the request (fetcher) is not yet finished, `data` will be `null` and `isLoading` will be true.
When we get a response, it sets `data` and `error` based on the result of fetcher, `isLoading` to false and rerenders the component. <br />

Note that fetcher can be any asynchronous function, you can use your favourite data-fetching library to handle that part.

## Options
The `useSWR` may contain additional options. <br />
He accept: 
- revalidate: takes a number (in seconds), after which the request is revalidated,
- onSuccess: takes a callback function, after response he runs,
- onError: takes a callback function, after error he runs.

## Revalidate
In this example, `data` is requested every `5` seconds.
```tsx
const fetcher = (url: string) => fetch(url).then(res => res.json());

function App() {
  const { data, isLoading, error } = useSWR<User[]>(
    {
      url: "https://jsonplaceholder.typicode.com/users",
      fetcher,
      options: {
        revalidate: 5
      }
    }
  );

  return <ul>
    {isLoading ? <div>Loading...</div> : null}
    {error !== null ? <div>{error.message}</div> : null}
    {data?.map(user => <li key={user.id}>{user.name}</li>)}
  </ul>
}
```

## OnSuccess
In this example, after `response` run `onSuccess`.
```tsx
const fetcher = (url: string) => fetch(url).then(res => res.json());

function App() {
  const { data, isLoading, error } = useSWR<User[]>(
    {
      url: "https://jsonplaceholder.typicode.com/users",
      fetcher,
      options: {
        onSuccess: () => {
          console.log("Data is fetched!");
        }
      }
    }
  );

  return <ul>
    {isLoading ? <div>Loading...</div> : null}
    {error !== null ? <div>{error.message}</div> : null}
    {data?.map(user => <li key={user.id}>{user.name}</li>)}
  </ul>
}
```

## OnError
In this example, after `error` run `onError`.
```tsx
const fetcher = (url: string) => fetch(url).then(res => res.json());

function App() {
  const { data, isLoading, error } = useSWR<User[]>(
    {
      url: "https://jsonplaceholder.typicode.com/users",
      fetcher,
      options: {
        onError: (error) => {
          console.error("Error: " + error.message);
        }
      }
    }
  );

  return <ul>
    {isLoading ? <div>Loading...</div> : null}
    {error !== null ? <div>{error.message}</div> : null}
    {data?.map(user => <li key={user.id}>{user.name}</li>)}
  </ul>
}
```