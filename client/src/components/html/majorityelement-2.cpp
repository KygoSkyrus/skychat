#include <iostream>
using namespace std;
#include<vector>
#include <map>

int main() {

    // vector<int> nums={2,2,1,3,2,2,1,1,1};
    vector<int> nums={1,2};

  //optimized solution (Boyer-Moore Majority Vote Algorithm).. tc=O(n) sc=O(1)
  int candidate = 0, count = 0;
  int candidate2 = 0, count2 = 0;

  for (int i=0; i<nums.size(); ++i){
    if (count == 0) {
      candidate = nums[i];
    }
    if (count2 == 0 && i>=1) {
      cout<<"xnbcj\n";
      candidate = nums[i];
    }

    // count += (num == candidate) ? 1 : -1;
    if(nums[i]==candidate){
      count++;
    }else{
      count--;
    }

    if(nums[i]==candidate2  && i>=1){
      count2++;
    }else{
      count2--;
    }
    cout<<count<<" "<<count2<<endl;
    cout<<"-----------------------------------"<<endl;
  }
    
    cout<<candidate<<" "<<candidate2<<endl;


  if (count > 0) {
    cout << "Candidate: " << candidate << endl;
  } else {
    cout << "No majority element found" << endl;
  }
  //return candidate;

}