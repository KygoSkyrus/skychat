#include <iostream>
using namespace std;
#include<vector>
#include <map>

int main() {

    // vector<int> nums={2,2,1,1,1,3,2,2};
    vector<int> nums={2,2,1,3,2,2,1,1};

  //optimized solution (Boyer-Moore Majority Vote Algorithm).. tc=O(n) sc=O(1)
  int candidate = 0;
  int count = 0;

  for (int num : nums) {
    if (count == 0) {
      candidate = num;
    }
    count += (num == candidate) ? 1 : -1;
    // if(num==candidate){
    //     count++;
    // }else{
    //     count--;
    // }
    cout<<count<<endl;
  }

  if (count > 0) {
    cout << "Candidate: " << candidate << endl;
  } else {
    cout << "No majority element found" << endl;
  }
  //return candidate;


    // my solution.. tc=O(n) sc=O(n)
    // map<int, int> m;
    // for(auto it: nums){
    //     m[it]++;
    // }
    
    // for(auto &[x,y]: m){
    //     if(y > nums.size()/2){
    //         cout<<"ans"<<x;
    //         return x;
    //     }
    // }
    // return 0;

}