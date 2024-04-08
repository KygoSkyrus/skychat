#include <iostream>
using namespace std;
#include <vector>
#include <unordered_map>
#include <unordered_set>
#include <algorithm>


int main(){

      vector<int> arr={1,2};


        vector<int> ret;// this is only used to check the occurences noted for every element.. not needed in code


        ///************************************ my solution,,,, tc= O(N*logN).. bcz of the additional sort operation
        sort(arr.begin(), arr.end());
        unordered_map<int, int> umap;
        int curr_count = 1;
        for (int i = 0; i < arr.size(); i++) {
            if (i != arr.size() - 1) {
                if (arr[i] == arr[i + 1]) {
                    // if the next element is same as the current than keep on incrementing the count
                    curr_count++;
                } else {
                    // if next element is not equal to current than put the cout and the element in the map and reset the count to 1
                    cout << curr_count << "-" << arr[i] << endl;
                    if (umap.count(curr_count)) {
                        return false;
                    }
                    umap[curr_count] = arr[i];
                    curr_count = 1;
                }
            }else{
                // checking for last element,, bcz in case if there are duplicates at the end like [...,4,4,4,4] then when we get to the last second four,, the count gets calculated correct as we are caluclating one forward,, ,, but as we are only checking for index less than the arr.size()-1,, we have to handle the last element separatetly and check its occureence
                cout<<"is last elem--"<<i<<endl;
                if (umap.count(curr_count)) {
                    return false;
                }
                umap[curr_count] = arr[i];
            }
        }

        for (auto i : umap) {
            cout << i.first << ":" << i.second << endl;
            if (i.second > 1) {
                ret.push_back(i.first);
            }
        }

        cout << "ans= " << true;
        return true;


        //************************************************ optimal solution,,, it has mutilple loops which will still be a tc of O(N)
        //         unordered_map<int, int>map;
        //         unordered_set<int>set;
        //         for(auto i: arr){
        //             map[i]++;
        //         }
        //         for(auto i: map){
        //             set.insert(i.second);
        //         }
        
        //         return map.size()==set.size();

}