#include <iostream>
using namespace std;
#include <map>
#include <stack>
#include <vector>
#include <climits>
#include <algorithm>




// THE QUESTION :: asks to get the number of car fleet to reach the destination,, whenever a car catches up to another car, it than matches it speed(the less speed)
// given positions = [10,8,0,5,3] and speed = [2,4,4,1,3]
//   |SPEED|                           _....2...4...1...3...4
//   |destination(12)|                 _...10...8...5...3...0       (after puting them in order) (10 will be at the top and 0 at bottom)
//   |TIME TAKEN TO REACH DESTINATION| _....1...1...7...3...3
// THE SOLUTION :: we need to have a map or pair to have these position and speed in descending order (farthest car should be at to {or to the left}),,, the positiob shoould be in descending order,,why positions are in descending order???? This is very important ,,bcz the car which is behind like at position 2 will never be able to overtake car which are ahead of it,, bcz even if its speed is more than the car ahead of it, but when it catches up to that car than it would have to slow it down to drive side by side to that car...ALSO NOTE THAT:: the speed of the car which is ahead will be the speed of fleet, bcz its obvious that this car has low speed as it got caught by the previous car
// to get the cars in descending order we used a map to store the position and time to reach the destination..so the car which is closest to destination is at the front of and so on,,, this is simple as the higher position means the car is closer to destination,, and we used map,, but in map the keys are stored in asending order,,,and this way it would have the farthest car first,,, so we just negate the position(key) so that we get closest car first
// we calculate the time a car takes to reach destination ,, and then we start comparing fron left (see the order above){the car closest to destination}....if the time taken by the second car is less than or same as first car than it means it will catch up to first car before or at destination,,,so they form a fleet.... we keep doing this comparison 

// in the second for loop we calculate the fleet, this can be done using a stack as well as just a count,,, count one is optimal as it wont need much space...
//the logic is that we have a current varable which will hold the highest time taken by a car,,
// as looping over the map,, if we find a car whose time to reach the target is greater than the current highest than it means that this car wont able to catch upto the current highest car .... and if its less than it means that there may come a point where this car can catch upto the current highest car and make a fleet.
// as if we get a car with higher time ,, we update the current highest value and increment the res(which is the total no of fleet)

int main(){

    int target = 12;
    vector<int>position = {10,8,0,5,3};
    vector<int>speed    = { 2,4,1,1,3};

    map<int, double> m;
    stack<double> s;
    for (int i = 0; i < position.size(); i++){
        m[-position[i]] = (double)(target - position[i]) / speed[i];
    }

    for(auto &[x,y]: m){
        cout<<x<<" : "<<y<<endl;
    }


    int res = 0; 
    double cur = 0;

    for (auto it : m) {
        // if (s.empty() || it.second > s.top() ) {
        //     s.push(it.second);
        // }
 
        // the above can also be done as this without using a stack
        if (it.second > cur) {
            cur = it.second; 
            res++;
        }
        cout<<"\ncur="<<cur;
        cout<<"\nres="<<res;
        cout<<"\n------------------------------\n";
    }
    
    cout<<"ANS---"<<res; 
    
    return res;
}