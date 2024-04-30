#include <iostream>
using namespace std;
#include<vector>
#include <map>
#include <unordered_map>
#include <stack>


int main() {

    // string s = "()[]{}";
    // string s = "(]";
    string s = "{[]}";  //([{   // ascci in asceding order
    stack<char> stk;

    for(int i = 0; i < s.length(); i++){

        //pushing all the starting tags in stack if encountered
        // if closing tags are encountered than its checked if its the partner of the starting tag (top elem in stack).. if it is than the starting tag is popped, if not than its clear that the tags are correctlyt paired 
        if(s[i]=='{' || s[i]=='(' || s[i]=='['){
            stk.push(s[i]);
        }else{
            if(stk.empty() || 
            s[i]=='}' && stk.top()!='{'  || 
            s[i]==')' && stk.top()!='('  || 
            s[i]==']' && stk.top()!='[' ){
                return false;
            }
            stk.pop();
        }
    }
    
    cout<<"ans== true\n";
    return stk.empty();
}