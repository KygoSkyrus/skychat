#include <bits/stdc++.h> 
using namespace std;



int main() {

    vector<int> nums={100,4,200,1,3,2}; 
    // vector<int> nums={0,3,7,2,5,8,4,6,0,1};

    map<int,int> m;
    for(auto i:nums){
        m[i]++;
    }

    int count=1,prevKey=0,ans=0;

    
    // for(auto i: m){
    //     cout<<i.first<<" "<<endl;
    //     if(i.first==prevKey+1){
    //         count++;
    //         prevKey=i.first;
    //         ans=count;
    //     }else{
    //         if(count>ans) ans=count;
    //         count=1;
    //     }

    //     cout<<"count="<<count;
    //     cout<<"\n-----------------------"<<endl;
    // }

    cout<<"ANS="<<ans;

}