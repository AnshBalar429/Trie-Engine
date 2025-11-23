# 🔍 C++ Trie Engine

A high-performance search engine built with C++ Trie data structure, featuring real-time autocomplete recommendations and fast file search capabilities. The engine processes text documents, builds an efficient Trie index, and provides instant search results with a beautiful dark-themed web interface.

![C++](https://img.shields.io/badge/C++-17-blue)
![React](https://img.shields.io/badge/React-19.2-blue)
![Docker](https://img.shields.io/badge/Docker-Ready-green)
![License](https://img.shields.io/badge/License-MIT-yellow)

## ✨ Features

- **⚡ Lightning-Fast Search**: Trie-based data structure for O(m) search complexity where m is the word length
- **🎯 Smart Autocomplete**: Real-time word recommendations with frequency-based scoring
- **📁 Multi-File Search**: Search across 1500+ text files simultaneously
- **🔍 OR Query Support**: Find files containing any of the search terms (space-separated)
- **💡 Word Highlighting**: Highlighted search terms in file viewer
- **🌙 Modern Dark UI**: Beautiful dark theme with pure black and white design
- **🐳 Docker Support**: Easy deployment with Docker Compose
- **📊 Frequency Tracking**: Word frequency-based recommendations
- **🚀 Optimized Performance**: O(word_length) search time and O(partial_word_length) recommendation time
- **🧠 Dynamic Programming**: DFS-based recommendation algorithm using dynamic programming on trees

## 🎯 Key Highlights

- **1500+ Text Files**: Indexes and searches across 1500+ preprocessed text documents
- **Optimal Time Complexity**: 
  - Search: O(word_length) - find which files contain a word
  - Recommendations: O(partial_word_length) - get autocomplete suggestions
- **Dynamic Programming**: Single DFS traversal builds all recommendations using DP on trees
- **Preprocessing Pipeline**: Automatic text normalization, stop word removal, and character filtering
- **Scalable**: Performance remains consistent even with massive datasets

## 🏗️ Architecture

### Backend (C++)
- **Trie Data Structure**: Efficient prefix tree for fast word lookups
- **HTTP Server**: Built with httplib for RESTful API endpoints
- **File Processing**: Preprocesses 1500+ text files, removes stop words, normalizes text, and builds index
- **Recommendation Engine**: DFS-based algorithm using dynamic programming on trees concept
  - Pre-computes recommendations for each node in a single DFS traversal
  - Stores top-k recommendations at each node for O(partial_word_length) retrieval
- **Data Preprocessing**: 
  - Removes invalid characters
  - Converts to lowercase
  - Filters stop words
  - Normalizes text for optimal indexing

### Frontend (React)
- **Real-time Search**: Debounced input with instant recommendations
- **File Viewer**: Modal popup with syntax highlighting
- **Responsive Design**: Modern, mobile-friendly interface

## 📋 Prerequisites

- **C++ Compiler**: GCC with C++17 support
- **Node.js**: v16 or higher
- **Docker & Docker Compose**: (Optional, for containerized deployment)
- **Make**: (Optional, for build scripts)

## 🚀 Quick Start

### Local Development

#### 1. Clone the Repository

```bash
git clone https://github.com/HarshBoghani/Trie-Engine.git
cd Trie-Engine
```

#### 2. Backend Setup

```bash
cd build

# Compile the data preprocessor
g++ -std=c++17 -o data-pre-process data-pre-process.cpp

# Preprocess data files (removes stop words, normalizes text)
./data-pre-process

# Compile the main server
g++ -std=c++17 Trie.cpp -o server -lpthread

# Run the server
./server
```

The backend server will start on `http://localhost:8080`

#### 3. Frontend Setup

```bash
cd frontend

# Install dependencies
npm install

# Start development server
npm run dev
```

The frontend will be available at `http://localhost:5173`

### Docker Deployment

#### Using Docker Compose (Recommended)

```bash
# Build and start all services
docker-compose up --build

# Run in detached mode
docker-compose up --build -d

# Stop services
docker-compose down
```

This will start:
- **Backend**: `http://localhost:8080`
- **Frontend**: `http://localhost:5173`

## 📁 Project Structure

```
Trie-Engine/
├── build/                 # C++ backend code
│   ├── Trie.cpp          # Main server and Trie implementation
│   ├── data-pre-process.cpp  # Text preprocessing utility
│   ├── stop-words.txt     # Stop words list
│   ├── data/             # Text files to index
│   └── Dockerfile         # Backend Docker configuration
├── frontend/              # React frontend
│   ├── src/
│   │   ├── App.jsx       # Main application component
│   │   ├── App.css       # Styling
│   │   └── useDebounce.jsx  # Debounce hook
│   └── Dockerfile        # Frontend Docker configuration
├── docker-compose.yml     # Multi-container setup
└── README.md             # This file
```

## 🎯 Usage

### Search Features

1. **Single Word Search**: Type a word and press Enter or click Search
   - Example: `harsh`

2. **OR Query**: Search for files containing any of multiple words (space-separated)
   - Example: `harsh programming` finds files with "harsh" OR "programming"

3. **Autocomplete**: Start typing to see real-time recommendations
   - Recommendations appear automatically as you type
   - Click on a suggestion to select it

4. **File Viewer**: Click on any file in search results to view its content
   - Search terms are highlighted in yellow
   - Close the modal by clicking X or outside the modal

### API Endpoints

- `GET /recommend?q=<prefix>` - Get autocomplete recommendations
- `GET /search?q=<query>` - Search for files containing the query
- `GET /file?name=<filename>` - Get file content

## 🔧 Configuration

### Adding Data Files

1. Place your `.txt` files in `build/data/` directory
2. Run the preprocessor: `./data-pre-process`
3. Restart the server

### Stop Words

Edit `build/stop-words.txt` to customize stop words that are filtered during indexing.

## 🛠️ Development

### Building from Source

```bash
# Backend
cd build
g++ -std=c++17 -o data-pre-process data-pre-process.cpp
g++ -std=c++17 Trie.cpp -o server -lpthread

# Frontend
cd frontend
npm install
npm run build
```

### Testing

```bash
# Test backend API
curl http://localhost:8080/recommend?q=har
curl http://localhost:8080/search?q=harsh
```

## 📊 Performance

### Time Complexity
- **Search**: O(m) where m is the word length - optimal for finding which files contain a word
- **Recommendations**: O(k) where k is the partial word length - optimal for autocomplete suggestions
- **Indexing**: O(n) where n is total number of words across all 1500+ files
- **Build Recommendations**: O(n) single DFS traversal using dynamic programming on trees

### How It Works
1. **Preprocessing**: All 1500+ text files are preprocessed (stop words removed, normalized)
2. **Insertion**: Each word from preprocessed files is inserted into the Trie with file tracking
3. **Build Recommendations**: A single DFS traversal builds recommendations for all nodes using dynamic programming
   - At each node, we compute top-k recommendations by merging child recommendations
   - This is done once during initialization, making subsequent queries extremely fast
4. **Query**: 
   - Search queries take O(word_length) to traverse the Trie
   - Recommendation queries take O(partial_word_length) to reach the node and retrieve pre-computed suggestions

### Why It's Optimal
- **For Huge Data**: With 1500+ files and potentially millions of words, the O(word_length) complexity ensures consistent performance regardless of data size
- **Pre-computation**: Recommendations are built once using dynamic programming, eliminating repeated calculations
- **Memory Efficient**: Trie structure shares common prefixes, minimizing memory usage

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 👨‍💻 Author

**Harsh Boghani**

- GitHub: [@HarshBoghani](https://github.com/HarshBoghani)
- Repository: [Trie-Engine](https://github.com/HarshBoghani/Trie-Engine)

## 🙏 Acknowledgments

- Built with [httplib](https://github.com/yhirose/cpp-httplib) for HTTP server
- React for frontend framework
- Docker for containerization

---

⭐ Star this repo if you find it helpful!

