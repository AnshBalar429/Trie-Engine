#include <bits/stdc++.h>
using namespace std;

int getIndex(char x){
    if(x>='a' && x<='z') return x-'a'+10;
    return x-'0';
}

const int SIZE = 36;

class TrieNode {
public:
    TrieNode* children[SIZE];
    bool isEndOfWord;
    int cntOfWord;
    set<string> presentIn;
    vector<pair<string,int>> recommend;
    TrieNode() {
        isEndOfWord = false;
        cntOfWord=0;
        for (int i = 0; i < SIZE; ++i) {
            children[i] = nullptr;
        }
    }
};


class Trie {
private:
    string file;
    TrieNode* root;

public:

    Trie(string& filename) {
        file = filename;
        root = new TrieNode();
    }

    void insert(const string& word) {
        TrieNode* current = root;
        for (char ch : word) {
            int index = getIndex(ch);
            if (!current->children[index]) {
                current->children[index] = new TrieNode();
            }
            current = current->children[index];
        }
        current->presentIn.insert(file);
        current->cntOfWord++;
        current->isEndOfWord = true;
    }

    set<string> search(const string& word) {
        TrieNode* current = root;
        set<string> listOfFiles;
        for (char ch : word) {
            int index = ch - 'a';
            if (!current->children[index]) {
                return listOfFiles;
            }
            current = current->children[index];
        }
        
        return listOfFiles = current->presentIn;
    }

    vector<pair<string,int>> recs_dfs(char &lastLetter,TrieNode* node){

        vector<pair<string,int>> recs;
        set<pair<int,string>> children_recs;

        for(int i=0;i<SIZE;i++){
            char letter;
            if(i<10) letter = i+'0';
            else letter = i-10+'a';
            vector<pair<string,int>> child_recs = recs_dfs(letter,node->children[i]);

            for(int j=0;j<child_recs.size();j++){

                if(children_recs.size()<5) {
                    children_recs.insert({child_recs[j].second,child_recs[j].first});
                }else{
                    if(children_recs.begin()->first < child_recs[j].second){
                        children_recs.erase(children_recs.begin());
                        children_recs.insert({child_recs[j].second,child_recs[j].first});
                    }
                }

            }
            
        }

        for(auto &it : children_recs){
            string temp = "";
            temp+=lastLetter;
            temp+=it.second;
            recs.push_back({temp,it.first});
        }

        node->recommend=recs;

        if(node->isEndOfWord){
            string temp = "";
            temp+=lastLetter;
            int currCnt = node->cntOfWord;
            if(children_recs.size()<5) {
                recs.push_back({temp,currCnt});
            }else{
                if(currCnt > children_recs.begin()->first){
                    for(int i=0;i<recs.size();i++){
                        if(recs[i].first==children_recs.begin()->second && recs[i].second==children_recs.begin()->first){
                            recs[i].first=temp;
                            recs[i].second=currCnt;
                        }
                    }
                }
            }
        }
        return recs;
    }

    
};

int main(){
    
}