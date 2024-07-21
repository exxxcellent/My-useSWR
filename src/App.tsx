import useSWR from './hooks/useSWR';

interface User {
    id: number;
    name: string;
}

const fetcher = (url: string) => fetch(url).then(res => res.json());

function App() {
    const { data, isLoading, error } = useSWR<User[]>({
        url: "https://jsonplaceholder.typicode.com/users",
        fetcher,
        options: {
            revalidate: 5
        }
    });

    return <ul>
        {isLoading ? <div>Loading...</div> : null}
        {error !== null ? <div>{error.message}</div> : null}
        {data?.map(user => <li key={user.id}>{user.name}</li>)}
    </ul>
}

export default App
