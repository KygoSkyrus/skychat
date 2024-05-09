#include <bits/stdc++.h> 
using namespace std;



// Q:>>> the question give an array,, take the array as bar and you have to find area where the water can be stored in total...its ike a mountain ,, which has ponds along its slope ,, so when it rains than these ponds get filled,, we need the area of these ponds...
// MY SOLUTION:>>>> the idea is that we can calculate the total area ,,, its like the area of ponds including the monutain,,, than from the total area we subtract the area of the mountain and we can get the area of water.
// first we calculate the area between two bars (the width should include the bar itself as we are calculating the total area in this first for loop).,, (r-l+1),, +1 is bcz we need the whole width
// the heigt of current conrtainer is stored in prevHeight to have an idea that up until which height we have already calculated the area.
// if the current height is greater than previous height only than we will add the area to waterarea,, this is why bcz other wise we will have overlapping area.. and this is the same reason why we are subtracting the prevHeight frome the current height while calculating area,,bcz  we want the area of the region which is above previous region
// later in the second loop we calculate the area of the bars(area of mountain) simply by iterating over the array..one caveat in this is that we may encounter some bar whose some of the top portion (like a peak) is not the part of the container for holding water. so we add the bar height up until the prevHeight(height of the tallest container) only.. one other wsy to see this is that,, we are calculating the total area of water plus the mountains... but while calculating this we will get to a point(at the top) where there this top portion will be avoided bcz the currentHeight in that case would be minimum one,, so this top portion will always be left alone,, thats why we wont calculate this portion the the total of barArea too




int main() {

    // vector<int> height={1,8,6,2,4,3,7};
    vector<int> height={0,1,0,2,1,0,1,3,2,1,2,1}; // size==11


    int l = 0, r = height.size()-1;
    int waterArea = 0, barArea = 0; // area covered by all the water and bars
    int prevHeight=0; // height of the previously recorded water container

    while (l < r) {

        int currHeight = min(height[l], height[r]);

        cout<<"l="<< l<<", r="<<r<<endl;


        //should have height in order to get an area
        if(currHeight){
            if(currHeight>prevHeight){
                // caluculating area and adding it to waterArea,
                // "WIDTH": we have +1 in width bcz we want to count the bar width also in distance (width is calculated from lth bar to rth bar)
                // "HEIGHT": subtracting currheight to avoid overlapping
                waterArea +=  (r - l + 1) * (currHeight - prevHeight);
                prevHeight = currHeight; // updating height
                cout<<waterArea;
            }
        }

        
        if(height[l]>height[r]){
            r--;
        }else{
            l++;  
        } 

        cout<<"\n-----------------------"<<endl;
    }

    cout<<"waterArea="<<waterArea<<endl;;
    cout<<"prevHeight="<<prevHeight<<endl;;


    for(auto num: height){

        if(num>prevHeight){
            barArea+=prevHeight; // here we are avoiding the top part(peak) where there is only bar
        }else{
            barArea += num;
        }
    }


    cout<<"barArea="<<barArea<<endl;
    cout<<"ANS="<<waterArea-barArea;
    // return waterArea-barArea;
}
