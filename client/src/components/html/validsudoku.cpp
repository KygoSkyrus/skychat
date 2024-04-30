#include <iostream>
using namespace std;
#include<vector>
#include <map>
#include<unordered_map>
#include <algorithm>


int main() {

  vector<vector<char>> board = {
      {'5', '3', '.', '.', '7', '.', '.', '.', '.'},
      {'6', '.', '.', '1', '9', '5', '.', '.', '.'},
      {'.', '9', '8', '.', '.', '.', '.', '6', '.'},
      {'8', '.', '.', '.', '6', '.', '.', '.', '3'},
      {'4', '.', '.', '8', '.', '3', '.', '.', '1'},
      {'7', '.', '.', '.', '2', '.', '.', '.', '6'},
      {'.', '6', '.', '.', '.', '.', '2', '8', '.'},
      {'.', '.', '.', '4', '1', '9', '.', '.', '5'},
      {'.', '.', '.', '.', '8', '.', '.', '7', '9'}
  };

   
   unordered_map<int,int> m1;
   for(int i=0 ;i<board.size();i++){
        for(int j=0 ;j<board[i].size();j++){
            cout<<board[i][j]<<" ";
        }
        cout<<endl;

   }    

}