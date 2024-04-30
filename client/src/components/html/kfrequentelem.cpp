#include <iostream>
using namespace std;
#include<vector>
#include <map>

int main() {

    // vector<int> nums={1,1,1,2,2,3};
    vector<int> nums={1,2};

    int k=2;




    map<int,int>  m;

    vector<int> ret;
    
    // if(nums.size()==1 && k==1) {
    //     return nums;
    // }
    int count=1;
    for(int i = 0; i < nums.size()-1; i++){
        if(nums[i]==nums[i+1]){
            count++;
            if(i==nums.size()-2) m[count]=nums[i+1];
        }else{
            m[count]=nums[i];
            count=1;
            if(i==nums.size()-2) m[count]=nums[i+1];
        }
    }

    //  for(int i = 0; i < nums.size()-1; i++){
    //     cout<<"i="<<i<<endl;

    //     if(nums[i]==nums[i+1]){
    //         count++;
    //         if(i==nums.size()-2) ret.push_back(nums[i]);
    //     }else{
    //         if(count>=k){
    //             ret.push_back(nums[i]);
    //             count=1;
    //         }
    //     }

    // }


    
    for(auto i: m){
        cout<<i.first<<":"<<i.second<<endl;
    }
    
    for(auto it = m.rbegin(); it != m.rend(); it++){
        ret.push_back(it->second);
        if(ret.size() == k) break;
    }

cout<<"-----------------------------"<<endl;
    for(auto i: ret){
        cout<<i<<" ";
    }
    
    // return ret;

}