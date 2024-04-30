#include <iostream>
using namespace std;
#include<vector>
#include <map>
#include <algorithm>

int main() {

    vector<int> nums={0,1,2,2,3,0,4,2}; int val=2;
    // vector<int> nums={1,2};

    sort(nums.begin(),nums.end());
    // [0,0,1,2,2,2,3,4]

     int l=1, r=nums.size()-1;

     while(l<=r){
        if(nums[l]==nums[l-1]){
            nums[l]=nums[r];
            nums[r]=nums[l-1];
            l++;  
            r--;
        }
         
     }

     for(auto it: nums){
        cout<<it<<" \n";
     }

    // for(int i=0;i<nums.size();i++){

    //     if(nums[i]==nums[i+1]){
           
    //     }

    // }



}