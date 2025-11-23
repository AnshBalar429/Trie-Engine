import React, { useState, useEffect } from 'react';
import './App.css';
import useDebounce from './useDebounce.jsx';

function App() {
    const [searchTerm, setSearchTerm] = useState('');
    const [suggestions, setSuggestions] = useState([]);

    // Debounce the search term: wait 300ms after user stops typing
    const debouncedSearchTerm = useDebounce(searchTerm, 300);

    useEffect(() => {
        // Only call API if term is not empty
        if (debouncedSearchTerm) {
            fetchSuggestions(debouncedSearchTerm);
        } else {
            setSuggestions([]);
        }
    }, [debouncedSearchTerm]);

    const fetchSuggestions = async (query) => {
        try {
            const response = await fetch(`http://localhost:8080/recommend?q=${query}`);
            const data = await response.json();
            // Data format expected: [{word: "harsh", score: 10}, ...]
            // Sort by score descending just in case
            const sorted = data ? data.sort((a,b) => b.score - a.score) : [];
            setSuggestions(sorted);
        } catch (error) {
            console.error("Error connecting to C++ backend:", error);
        }
    };

    const handleSelect = (word) => {
        setSearchTerm(word);
        setSuggestions([]); // Close dropdown
    };

    return (
        <div className="App">
            <div className="search-container">
                <h1>C++ Trie Autocomplete</h1>

                <div className="input-wrapper">
                    <input
                        type="text"
                        placeholder="Type something (e.g. harsh)..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>

                {suggestions.length > 0 && (
                    <ul className="suggestions-list">
                        {suggestions.map((item, index) => (
                            <li key={index} onClick={() => handleSelect(item.word)}>
                                <span className="word">{item.word}</span>
                                <span className="score">freq: {item.score}</span>
                            </li>
                        ))}
                    </ul>
                )}
            </div>
        </div>
    );
}

export default App;