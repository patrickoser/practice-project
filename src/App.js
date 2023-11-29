import Header from './header';
import SearchItem from './searchItem';
import AddItem from './addItem';
import Content from './content';
import Footer from './footer';
import { useState, useEffect } from 'react';
import apiRequest from './apiRequest';

function App() {
  const API_URL = 'http://localhost:3500/itemss';

  const [items, setItems] = useState([]);
  const [newItem, setNewItem] = useState('')
  const [search, setSearch] = useState('')
  const [fetchError, setFetchError] = useState(null);
  const [isLoading, setIsLoading] = useState(true);


useEffect(() => {
  
  const fetchItems = async () => {
    try {
      const response = await fetch(API_URL);
      if (!response.ok) throw Error('Did not receive expected data');
      const listItems = await response.json();
      setItems(listItems)
      setFetchError(null);
    } catch (err) {
      setFetchError(err.message)
    } finally {
      setIsLoading(false);
    }
  }

  setTimeout(() => {
    (async () => await fetchItems())();
  }, 2000)

}, [])

  const addItem = (item) => {
    const id = items.length ? items[items.length - 1].id + 1 : 1;
    const myNewItem = { id, checked: false, item };
    const listItems = [...items, myNewItem];
    setItems(listItems);

    const postOptions = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(myNewItem)
    }
  }

  const handleCheck = (id) => {
    const listItems = items.map((item) => item.id === id ? { ...item, checked: !item.checked} : item)
    setItems(listItems);
  }

  const handleDelete = (id) => {
    const listItems =items.filter((item) => item.id !== id)
    setItems(listItems);
  }

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!newItem) return;
    // add item
    addItem(newItem)
    setNewItem('')
  }

  return (
    <div className="App">
      <Header title="Grocery List"/>
      <AddItem 
        newItem={newItem}
        setNewItem={setNewItem}
        handleSubmit={handleSubmit}
      />
      <SearchItem 
        search={search}
        setSearch={setSearch}
      />
      <main>
        {isLoading && <p>Loading Items...</p>}
        {fetchError && <p style={{color: 'red'}}>{`Error: ${fetchError}`}</p>}
        {!fetchError && !isLoading && <Content 
          items={items.filter(item => ((item.item).toLowerCase()).includes(search.toLowerCase()))}
          handleCheck={handleCheck}
          handleDelete={handleDelete}
        />}
      </main>
      <Footer length={items.length} />
    </div>
  );
}

export default App;
