#include <iostream>
using namespace std;
#include<vector>
#include <map>
#include <algorithm>
#include <stack>
#include <climits>

int main(){

    // vector<int>temperatures = {73,74,75,71,69,72,76,73}; //ans = [1,1,4,2,1,1,0,0]
    vector<int>temperatures = {89,62,70,58,47,47,46,76,100,70}; // ans = [8,1,5,4,3,2,1,1,0,0]

    vector<int>ans(temperatures.size(),0);// intialling array of same size as temperatures with all values as 0
    stack<int> s;

		// move from right to left

    for(int i=temperatures.size()-1; i>=0; i--){
        cout<<temperatures[i]<<endl;
        // pop until we find next greater element to the right
		// since we came from right stack will have element from right only
		// s.top() is the index of elements so we put that index inside temperatures vector to check
        while(!s.empty() && temperatures[s.top()] <= temperatures[i]){
            s.pop();
        }
				
        // if stack not empty, then we have some next greater element, 
		// so we take distance between next greater and current temperature
		// as we are storing indexes in the stack
        if(!s.empty()) {
            ans[i] = s.top()-i; // distance between next greater and current
        }
            
		// push the index of current temperature in the stack,
		// same as pushing current temperature in stack
        s.push(i);
        cout<<"\n--------------------\n";
    }

    for(auto i: ans){
        cout<<i<<" ";
    }

}