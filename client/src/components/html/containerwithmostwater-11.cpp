#include <bits/stdc++.h> 
using namespace std;

// Q: the question gives some random numbers in an arrays.. now you need to tell the height of the water can be held in between two numbers so that the product of width and the container should be maximum.. means that the distance between two index should be maximum and also the two numbers should be maximum as only these two scenarios will get you the container with most water
//NOTE : YOU CANT CREATE A SLOPE in container

// MY SOLUTION<<<< using two pointer ,, i had two varibles to track distance and height of the lth and rth index... initially when h and d are 0 than the distance btween them is calculated along with the height(min of these two value,, as you cant create a slope).. these two values are stored in d and h,,, for every l and r we compare the current distance and height with the stored value in d and h to see if the current product of difference and height is greater than product of previously stored distance height,, if yes thatn we update the distance and height..

int main() {
    //                     0,1,2,3,4,5,6,7,8
    // vector<int> height={1,8,6,2,5,4,8,3,7};

    vector<int> height={2,3,4,5,18,17,6};

    /*
    int l=0,r=height.size()-1; 
    int d=0,h=0;//distance and height

    int currDistance=0, currHeight=0;
    while(l<r){
        cout<<"l="<< l<<", r="<<r<<endl;

        currDistance = r-l; 
        currHeight = min(height[l],height[r]);
        cout<<"d2="<< currDistance<<", currHeight="<<currHeight<<",  ANS="<<currDistance*currHeight<<endl;

        if((d*h)<(currDistance*currHeight) || d==0 || h==0){
           d = currDistance; 
           h = currHeight;
        }

         
        if(height[l]>height[r]){
            r--;
        }else{
            l++;  
        } 

        cout<<"d="<< d<<", h="<<h<<",  ANS="<<d*h<<endl;

        cout<<"------------------------"<<endl;
    }
    //return d*h;
    */



    // the above code can also be done as
    int l = 0, r = height.size() - 1;
    int area = 0; // distance * height
    while (l < r) {
        int a = (r - l) * (min(height[l], height[r]) ); // has current area by calulcating current distance and height

        if (area < a) area= a;

        if(height[l]>height[r]){
            r--;
        }else{
            l++;  
        } 
    }
    return area;


}