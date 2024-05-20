#include <iostream>
using namespace std;
#include<vector>
#include <map>
#include <algorithm>
#include <stack>
#include <climits>


// THE QUESTION>>> wants to you design a stack whcih will perform the various function in O(1) time,, the difficult this is finding minimum element from the stack

// there are several solutions to this problem
//1>>> storing mininum up untill every element.. fo example if an element is inserted than store somewhere the min elemen up until that element,, to do that you can create another stack which will have minimum elem,, ans you can keep storng the minimum on push command by comapring the currnt value to be pushed and the previous min elem,,, on pop you remove from both the stack..this way at any given time at the top the other stack you will get the minimum element of the stack.
// other way to do this is have a vector of pairs,,in pair the first will have the element and second will have the min elem,,, (this costs an extra space)
//2>>> in this we stored both the minelement and the value in the stack,, we didint had to use another stack,,whenever we encounter an element which is less than the minelem than we update the minelem and push minelem and value to the stackk,,the reason to do this is that now we can track thhe minlement at every value we have pushed,,,for evrery elemenet the minelem at that point is also stored just below the value,,, so when we have to pop an elemnent , we will pop an extra time to get rid of the minleme but before doing that extra pop we will updated the minelem with this value
// ALSO you should check comments in code 

//3>>> there is another solution in which we will store mortifed value when we get a lesser value than the previously recorded min... check striver's solution

// SOLUTION 1
/*
class MinStack {
public:
    vector<int> s,m;
    MinStack() {
    }
    
    void push(int val) {
        if(s.empty()){
            m.push_back(val);
        }else{
            m.push_back(min(m.back(), val));
        }
        s.push_back(val); 
    }
    
    void pop() {
        s.pop_back();
        m.pop_back();
    }
    
    int top() {
        return s.back();
    }
    
    int getMin() {
        return m.back();
    }
};
*/


// SOLUTION 2
	class MinStack {
	public:
		stack<int>s;
		int minElement = INT_MAX;//initalize with max value

		void push(int val) {
			if(minElement>=val){// whenever val is lesser than current minElement, store current minElement in stack and make val as current minElement
				s.push(minElement);
				minElement = val; // updating the new min value
			}
			s.push(val);
		}

		void pop() {
			if(minElement==s.top()){//top is minElement then previous element will be previous minElement, so pop and store current top as current MinElement
				s.pop();
				minElement = s.top();// after popping updating it with previous min element
			}
			s.pop();
		}

		int top() {// return stack top
			return s.top();
		}

		int getMin() {//return minElement
			return minElement;
		}
	};

// SOLUTION 3
/*
class MinStack {
public:
    vector<int> s;
    long long int min;
    MinStack() {
    }
    
    void push(int val) {
        if(s.empty()){
            s.push_back(val);
            min=val;
        }else{
            if(min>val){
                s.push_back(2*val-min);
                min=val;
            }else{
                s.push_back(val);
            }
        }
    }
    
    void pop() {
        if(s.back()<min){
            min=(2*min-s.back());
        }
        s.pop_back();
    }
    
    int top() {
        if(s.back()<min) return min;
        else return s.back();
    }
    
    int getMin() {
        return min;
    }
};
*/

int main() {

//   input ["MinStack","push","push","push","getMin","pop","top","getMin"] on giving these commands the following output should be returned

  //output [[],[-2],[0],[-3],[],[],[],[]]

}
