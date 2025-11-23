#include <bits/stdc++.h>
#include <filesystem>
using namespace std;
namespace fs = filesystem;

bool isValidChar(char c) {
    return (c >= 'a' && c <= 'z') || (c >= 'A' && c <= 'Z') || (c >= '0' && c <= '9');
}


set<string> stopWords;

void loadStopWords() {
    ifstream fin("stop-words.txt");
    string s;
    while (fin >> s) {
        string t;
        for (char c : s) {
            if (c >= 'A' && c <= 'Z') c = c - 'A' + 'a';
            if ((c >= 'a' && c <= 'z') || (c >= '0' && c <= '9'))
                t.push_back(c);
        }
        if (!t.empty()) stopWords.insert(t);
    }
    fin.close();
}

bool isStopWord(const string &s) {
    return (stopWords.find(s)!=stopWords.end());
}


int main() {
    ios::sync_with_stdio(false);
    cin.tie(nullptr);

    loadStopWords();

    int processedCount = 0;
    string dataDir = "./data";
    if (!fs::exists(dataDir) || !fs::is_directory(dataDir)) {
        cerr << "Error: Data directory not found: " << dataDir << "\n";
        return 1;
    }
    
    for (auto &p : fs::directory_iterator(dataDir)) {
        if (!fs::is_regular_file(p) || p.path().extension() != ".txt") continue;

        string filepath = p.path().string();
        ifstream fin(filepath);
        if (!fin.is_open()) {
            cerr << "Error: Cannot open file: " << filepath << "\n";
            continue;
        }

        vector<string> v;
        string t;
        char c;

        while (fin.get(c)) {
            if (isValidChar(c)) {
                if (c >= 'A' && c <= 'Z') c = char(c - 'A' + 'a');
                t.push_back(c);
            } else {
                if (!t.empty() && !isStopWord(t)) {
                    v.push_back(t);
                    t.clear();
                }else{
                    t.clear();
                }
            }
        }
        if (!t.empty() && !isStopWord(t)) {
            v.push_back(t);
        }else{
            t.clear();
        }
        fin.close();
        
        // Remove existing file and create new one to ensure write
        fs::remove(filepath);
        ofstream fout(filepath, ios::out);
        if (!fout.is_open()) {
            cerr << "Error: Cannot write to file: " << filepath << "\n";
            continue;
        }

        for (int i = 0; i < (int)v.size(); i++) {
            fout << v[i];
            if (i + 1 < (int)v.size()) fout << ' ';
        }
        fout.flush();
        if (fout.fail()) {
            cerr << "Error: Write failed for file: " << filepath << "\n";
            fout.close();
            continue;
        }
        fout.close();
        
        // Verify file was written
        if (!fs::exists(filepath) || fs::file_size(filepath) == 0) {
            cerr << "Error: File not written properly: " << filepath << "\n";
            continue;
        }
        
        processedCount++;
    }
    
    cout << "Processed " << processedCount << " files." << endl;
}
