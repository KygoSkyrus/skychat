#include <iostream>
using namespace std;
#include<vector>
#include <map>
#include<unordered_map>
#include <algorithm>
#include<bitset>

int main() {

//   vector<vector<char>> board = {
//       {'5', '3', '.', '.', '7', '.', '.', '.', '.'},
//       {'6', '.', '.', '1', '9', '5', '.', '.', '.'},
//       {'.', '9', '8', '.', '.', '.', '.', '6', '.'},
//       {'8', '.', '.', '.', '6', '.', '.', '.', '3'},
//       {'4', '.', '.', '8', '.', '3', '.', '.', '1'},
//       {'7', '.', '.', '.', '2', '.', '.', '.', '6'},
//       {'.', '6', '.', '.', '.', '.', '2', '8', '8'},
//       {'.', '.', '.', '4', '1', '9', '.', '.', '5'},
//       {'.', '.', '.', '.', '8', '.', '.', '7', '9'}
//   };
 vector<vector<int>> board = {
      {5, 3, 0, 0, 7, 0, 0, 0, 0},
      {6, 0, 0, 1, 9, 5, 0, 0, 0},
      {0, 9, 8, 0, 0, 0, 0, 6, 0},
      {8, 0, 0, 0, 6, 0, 0, 0, 3},
      {4, 0, 0, 8, 0, 3, 0, 0, 1},
      {7, 0, 0, 0, 2, 0, 0, 0, 6},
      {0, 6, 0, 0, 0, 0, 2, 8, 8},
      {0, 0, 0, 4, 1, 9, 0, 0, 5},
      {0, 0, 0, 0, 8, 0, 0, 7, 9}
  };

   
  // Initialize the bitsets.
  vector<bitset<9>> row_bitsets(9);
  vector<bitset<9>> column_bitsets(9);
  vector<bitset<9>> subgrid_bitsets(9);

  // Iterate over the puzzle.
  for (int i = 0; i < 9; i++) {
    for (int j = 0; j < 9; j++) {

      // the given solution is for when we have elemnts as integer and blank spaces as 0
      int digit = board[i][j];//=='0'? 0: (int)board[i][j];

      // row_bitsets[i][digit]=true;
      cout<<"DIGIT="<< digit<<endl;
      cout<<row_bitsets[i][digit]<<endl;

      // continues when a black space is found
      if (digit == 0) {
        continue;
      }

      // Check if the digit is already present in the row, column, or sub-grid. (for subgrod first subgrid is stored at 0 index of vector and so on)
      if (row_bitsets[i][digit] || column_bitsets[j][digit] || subgrid_bitsets[i / 3 * 3 + j / 3][digit]) {
        cout<<"false, i="<<i<<",j="<<j;
        return 0;
      }

      // Set the bitset for the current row, column, and sub-grid.
      row_bitsets[i][digit] = true;
      column_bitsets[j][digit] = true;
      subgrid_bitsets[i / 3 * 3 + j / 3][digit] = true;
      
      cout<<row_bitsets[i][digit]<<endl;

      cout<<"$$$$$$$$$$$$$$$$$$$$$===="<<(i / 3 * 3 + j / 3)<<endl;//subgrid index for vector (for i=j=8,  it will be [((8/3) * 3) + (8/3)]=8(th) index)

    }
    // Loop over each row in vector of bitset
    // for (int i = 0; i < row_bitsets.size(); ++i) {
    //     cout << "Row " << i << ": ";
    //     // Loop over each bit in the row_bitset
    //     for (int j = 0; j < row_bitsets[i].size(); ++j) {
    //         cout << row_bitsets[i][j] << " ";
    //     }
    //     cout << endl;
    // }
    cout<<"--------------"<<endl;
  }

  // The puzzle is valid.
  cout<<"true";
  return 1;
 
}