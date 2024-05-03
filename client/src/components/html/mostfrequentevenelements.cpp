#include <iostream>
using namespace std;
#include<vector>
#include <map>
#include <unordered_map>
#include <algorithm>

int main() {

    vector<int> nums={0,1,2,2,4,4,1};

    unordered_map<int,int>  m;
    for(auto num: nums){
        if(num%2==0)
           m[num]++;

    }

     pair<int,int> p(-1,-1);
     for(auto i: m){
        //here....first== num, second== count
        cout<<p.first<<endl;
        cout<<i.first<<":"<<i.second<<endl;
        /*
        if(p.first==-1){
           p.first=i.first;
           p.second=i.second;
        }else{
            if(i.second>p.second){
                p.first=i.first;
                p.second=i.second;
            }
            if(i.second==p.second){
                if(i.first<p.first){
                    p.first=i.first;
                    p.second=i.second;
                }
            }
        }
        */
       // the above if else can be written as this
         // when there is no value in pair(first time), when the count is greater than that of current pair, if count is same and the num is smaller than of current pair  
         if (p.first == -1 || i.second > p.second || (i.second == p.second && i.first < p.first)) {
                p.first = i.first;
                p.second = i.second;
         }
     }
     cout<<"ANS="<<p.first<<endl;


    //  much better code with one pass
    int most_frequent = -1;
    for (auto num : nums) {
        if (num % 2 == 0) {
            m[num]++;
            if (m[num] > m[most_frequent]) {
                most_frequent = num;
            }
        }
    }

    return most_frequent;





    /* NOT WORKING as well as with sort it will a tc of (nlogn+N) 
    // if(nums.size()==1 && k==1) {
    //     return nums;
    // }
    sort(nums.begin(), nums.end());
    int count=1;
    for(int i = 0; i < nums.size()-1; i++){
        if (nums[i]%2==0) {
            if(nums[i]==nums[i+1]){
                count++;
                if(i==nums.size()-2){
                    cout<<"last\n";
                    cout<<"COUNT="<<count<<endl;
                    cout<<"nums[i]="<<nums[i]<<endl;
                    
                    if(m.count(count)==0){
                        cout<<"111111111\n";
                        m[count]=nums[i];  
                    }else{
                        cout<<"222222222\n";
                        if(nums[i]<m[count] && nums[i]%2==0){
                           m[count]=nums[i];  
                        }
                    }
                } 
            }else{
                cout<<"yes-"<<i<<endl;
                if(m.at(count)){
                  m[count]=nums[i];
                  count=1;
                }
                if(i==nums.size()-2){
                    cout<<"2nd last\n";
                    m[count]=nums[i+1];
                }
            }
        }
        cout<<"-----------------------------"<<endl;
    }


    for(auto i: m){
        cout<<i.first<<":"<<i.second<<endl;
    }


    for(auto it = m.rbegin(); it != m.rend(); it++){
        cout<< "ANS"<<it->second;
        // return it->second;
    }
    */
}