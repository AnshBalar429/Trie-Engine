import React, { useState, useEffect } from 'react';
import './App.css';
import useDebounce from './useDebounce.jsx';

function App() {
    const [searchTerm, setSearchTerm] = useState('');
    const [suggestions, setSuggestions] = useState([]);
    const [searchResults, setSearchResults] = useState([]);
    const [hasSearched, setHasSearched] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [fileContent, setFileContent] = useState('');
    const [selectedFileName, setSelectedFileName] = useState('');
    const [isInfoOpen, setIsInfoOpen] = useState(false);

    // Debounce the search term: wait 300ms after user stops typing
    const debouncedSearchTerm = useDebounce(searchTerm, 300);

    useEffect(() => {
        // Extract last word (after last space) for recommendations
        const parts = debouncedSearchTerm.trim().split(/\s+/);
        const lastWord = parts[parts.length - 1] || '';
        
        // Only call API if last word is not empty
        if (lastWord) {
            fetchSuggestions(lastWord);
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
        // Get all words except the last one, then append the selected word
        const words = searchTerm.trim().split(/\s+/);
        
        if (words.length > 1) {
            words.pop(); // Remove the last incomplete word
            words.push(word); // Add the selected word
            setSearchTerm(words.join(' ') + ' ');
        } else {
            setSearchTerm(word + ' ');
        }
        setSuggestions([]); // Close dropdown
    };

    const handleSearch = async () => {
        setSuggestions([]); // Clear recommendations when searching
        
        if (!searchTerm.trim()) {
            setSearchResults([]);
            setHasSearched(false);
            return;
        }

        setHasSearched(true);
        try {
            const response = await fetch(`http://localhost:8080/search?q=${encodeURIComponent(searchTerm.trim())}`);
            const data = await response.json();
            setSearchResults(data || []);
        } catch (error) {
            console.error("Error searching:", error);
            setSearchResults([]);
        }
    };

    const handleKeyPress = (e) => {
        if (e.key === 'Enter') {
            handleSearch();
        }
    };

    const handleFileClick = async (filename) => {
        try {
            const response = await fetch(`http://localhost:8080/file?name=${encodeURIComponent(filename)}`);
            const content = await response.text();
            setFileContent(content);
            setSelectedFileName(filename);
            setIsModalOpen(true);
        } catch (error) {
            console.error("Error fetching file:", error);
        }
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setFileContent('');
        setSelectedFileName('');
    };

    const highlightText = (text, searchTerm) => {
        if (!searchTerm.trim()) return text;
        
        // Split search term into words
        const words = searchTerm.trim().split(/\s+/).filter(w => w.length > 0);
        if (words.length === 0) return text;
        
        // Create regex pattern for all words
        const escapedTerms = words.map(term => term.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'));
        const pattern = `(${escapedTerms.join('|')})`;
        const regex = new RegExp(pattern, 'gi');
        const parts = text.split(regex);
        
        return parts.map((part, index) => {
            const isMatch = words.some(word => {
                const wordRegex = new RegExp(`^${word.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}$`, 'i');
                return wordRegex.test(part);
            });
            return isMatch ? (
                <mark key={index} className="highlight">{part}</mark>
            ) : (
                <span key={index}>{part}</span>
            );
        });
    };

    return (
        <div className="App">
            <div className="top-links">
                <button 
                    onClick={() => setIsInfoOpen(true)}
                    className="info-button"
                    title="About Trie Engine"
                >
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <circle cx="12" cy="12" r="10"/>
                        <path d="M12 16v-4M12 8h.01"/>
                    </svg>
                </button>
                <a 
                    href="https://github.com/HarshBoghani/Trie-Engine" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="github-link"
                >
                    <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                    </svg>
                    GitHub
                </a>
            </div>
            <div className="search-container">
                <h1>Trie Engine</h1>

                <div className="input-wrapper">
                    <input
                        type="text"
                        placeholder="Type something (e.g. harsh)..."
                        value={searchTerm}
                        onChange={(e) => {
                            setSearchTerm(e.target.value);
                            setSearchResults([]);
                            setHasSearched(false);
                        }}
                        onKeyPress={handleKeyPress}
                    />
                    <button onClick={handleSearch} className="search-button">Search</button>
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

                {searchResults.length > 0 && (
                    <div className="search-results">
                        <h2>Files containing: {(() => {
                            const words = searchTerm.trim().split(/\s+/).filter(w => w.length > 0);
                            return words.map((word, i, arr) => 
                                i < arr.length - 1 ? `${word} OR ` : word
                            ).join('');
                        })()}</h2>
                        <ul className="files-list">
                            {searchResults.map((file, index) => (
                                <li key={index} onClick={() => handleFileClick(file)} className="file-item">
                                    {file}
                                </li>
                            ))}
                        </ul>
                    </div>
                )}

                {hasSearched && searchResults.length === 0 && searchTerm.trim() !== '' && (
                    <div className="search-results">
                        <p>No files found containing: {(() => {
                            const words = searchTerm.trim().split(/\s+/).filter(w => w.length > 0);
                            return words.map((word, i, arr) => 
                                i < arr.length - 1 ? `${word} OR ` : word
                            ).join('');
                        })()}</p>
                    </div>
                )}
            </div>

            {isModalOpen && (
                <div className="modal-overlay" onClick={closeModal}>
                    <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                        <div className="modal-header">
                            <h2>{selectedFileName}</h2>
                            <button className="close-button" onClick={closeModal}>×</button>
                        </div>
                        <div className="modal-body">
                            <div className="file-content">
                                {highlightText(fileContent, searchTerm)}
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {isInfoOpen && (
                <div className="modal-overlay" onClick={() => setIsInfoOpen(false)}>
                    <div className="info-modal" onClick={(e) => e.stopPropagation()}>
                        <div className="modal-header">
                            <h2>About Trie Engine</h2>
                            <button className="close-button" onClick={() => setIsInfoOpen(false)}>×</button>
                        </div>
                        <div className="modal-body">
                            <div className="info-content">
                                <h3>Overview</h3>
                                <p>This search engine indexes and searches across 1500+ preprocessed text files using a Trie data structure, providing real-time autocomplete recommendations and fast file search capabilities.</p>
                                
                                <h3>How It Works</h3>
                                <ol>
                                    <li><strong>Preprocessing:</strong> All 1500+ text files are preprocessed - invalid characters are removed, text is converted to lowercase, and stop words are filtered out.</li>
                                    <li><strong>Insertion:</strong> Each word from the preprocessed files is inserted into the Trie data structure, with each node tracking which files contain that word.</li>
                                    <li><strong>Build Recommendations:</strong> A single DFS traversal builds recommendations for all nodes using dynamic programming on trees concept. At each node, we compute top-k recommendations by merging child recommendations.</li>
                                    <li><strong>Query:</strong> 
                                        <ul>
                                            <li>Search queries take O(word_length) time to traverse the Trie and find which files contain the word.</li>
                                            <li>Recommendation queries take O(partial_word_length) time to reach the node and retrieve pre-computed suggestions.</li>
                                        </ul>
                                    </li>
                                </ol>
                                
                                <h3>Performance</h3>
                                <ul>
                                    <li><strong>Search Complexity:</strong> O(word_length) - optimal for finding which files contain a word</li>
                                    <li><strong>Recommendation Complexity:</strong> O(partial_word_length) - optimal for autocomplete suggestions</li>
                                    <li><strong>Build Time:</strong> O(n) where n is total number of words - single DFS traversal</li>
                                    <li><strong>Scalability:</strong> Performance remains consistent even with massive datasets due to O(word_length) complexity</li>
                                </ul>
                                
                                <h3>Features</h3>
                                <ul>
                                    <li>Real-time autocomplete recommendations as you type</li>
                                    <li>OR query support (space-separated words)</li>
                                    <li>File viewer with highlighted search terms</li>
                                    <li>Pre-computed recommendations for instant retrieval</li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default App;