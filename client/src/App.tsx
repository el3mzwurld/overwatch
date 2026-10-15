import { UseBookSearch } from "./hooks/useBookSearch";

function App() {
  const { books, isLoading, isPending } = UseBookSearch("Harry Potter");

  if (isLoading || isPending) {
    return <h3>...loading</h3>;
  }

  return (
    <div>
      <ul>
        {books.map((item) => (
          <li key={item.externalId}>{item.title}</li>
        ))}
      </ul>
    </div>
  );
}

export default App;
