#include <iostream>
using namespace std;
#include <map>
#include <stack>
#include <vector>
#include <climits>
#include <algorithm>




int main(){

    // vector<int>heights = {2,1,5,6,2,3};
    vector<int>heights = {3,2,1,5,6,2,3};
    int res=0;
    int w = 1,h=0;

    for(int i =0; i<heights.size(); i++){
        if(i==0){
            h=heights[i];
            continue;
        } 

        if(heights[i-1] > heights[i]){//declining graph
            h= heights[i]; //updating  smaller height
            w+=1; // adding the width

        }else{
            //if graph is increasing (we check if the cuurent rec area is greater than the previously stored height*width)
            if(heights[i] >= h*w){
                //starting storing new possible reactangle's dimension
                h=heights[i];
                w=1;// new width 
            }else{
                w+=1; // just increasing width,, as its heigtht will remain same
            }
        }

    cout<<"h-"<<h<<endl;
    cout<<"w-"<<w<<endl;

    cout<<"======================"<<endl;

    }

    // cout<<"h-"<<h;
    // cout<<"w-"<<w;




    
    
    return res;
}