#include <iostream>
using namespace std;
#include<vector>
#include <map>
#include <algorithm>

// product of array except self... lc-#238

// the thing is that you have to get the product of all the elements of the array except tle element itself... you cannot use division and also try solving it with space complexity of O(1) and tc-O(n).... .. The output array does not count as extra space for space complexity analysis.)

// my ##first_solution## was that ,, in ret array i calculated the prefix product.. by multiplying the previous elemnt's prod and stioring them in the curent index...
// the idea was the same for the postfix,, and for that i used another vector,, ret1...
// and to calculate the ans.. i used another vector ans... for ans i multiplied the ith element of both postand prefix array,,, this way we got the products... later i  got rid of ans arrays.. as i can store the result in nums itself,,, but still we have used more than one vector(ret,ret1),, thats why my second solution is optimal

// my ##Second_solution##.. in this after creating the prefix prod array,,, when we go to create the postfix array,,, right there we can calculate the resullt side by side calculating the postfix..... 
// if you observe the second and third loop in your first solution.. youll find that these loops can be merged and also this extra vector can be avoided...
// so in this i keep calculating the postfix in prod variable,, and as soon as the prosuct of right most elemts are calculated i multiply it with the prefix calculated earlier which is in the same array.... and then we put the evaluated result at the same index... bcz now we dont need the prefix product right.. we have used it,, no need now,,


int main() {

    vector<int> nums={2,3,4,5,6};

    //   2    2    6   24  120      - prefix product
    // 360  120   30    6    6      - postfix product
    // ------------------------     
    // 360, 240, 180, 144, 120      - final output


/* //my first solution,,, (the flaw is that we have to do this with O(1) space complexity).. output array is not counted as extra space
    vector<int> ret(nums.size());
    int prod=1;
    for(int i=0;i<nums.size();i++){
        if(i==0){
            ret[i]=nums[i];
        }else{
            prod*=nums[i-1];
            ret[i]=prod;
        }
    }

    for(auto num:ret){
        cout<<num<<" ";
    }

    cout<<endl<<"------------------------\n";

    prod=1;
    vector<int> ret1(nums.size());
    for(int i=nums.size()-1; i>=0; i--){
        if(i==nums.size()-1){
            ret1[i]=nums[i];
        }else{
            prod*=nums[i+1];
            ret1[i]=prod;
        }
    }

    for(auto num:ret1){
        cout<<num<<" ";
    }

    cout<<endl<<"------------------------\n";

    // vector<int> ans(nums.size());
    for(int i=0;i<nums.size();i++){
        if(i==0){
            nums[i]=ret1[i];
        }else if(i==nums.size()-1){
            nums[i]=ret[i];
        }else{
            nums[i]=ret1[i]*ret[i];
        }
    }

    for(auto num:nums){
        cout<<num<<" ";
    }
    //return nums;
*/

    /*
    //my second soltuion
    vector<int> ret(nums.size());
    int prod=1;
    for(int i=0;i<nums.size();i++){
        if(i==0){
            ret[i]=nums[i];
        }else{
            prod*=nums[i-1];
            ret[i]=prod;
        }
    }

    for(auto num:ret){
        cout<<num<<" ";
    }

    cout<<endl<<"------------------------\n";

    prod=1;

    // for(int i=nums.size()-1; i>=0; i--){
    //     if(i==nums.size()-1){
    //         continue;
    //     }else if(i==0){
    //         prod*=nums[i+1];
    //         ret[i]=prod;
    //     }else{
    //         prod*=nums[i+1];
    //         ret[i]=prod*ret[i];
    //     }
    // }
    // the following code can be wrrite as below

    ret[0]=1;// handled i=0 condition outside
    for(int i=nums.size()-1; i>=0; i--){
        if(i!=nums.size()-1){
            prod*=nums[i+1];
            ret[i]=prod*ret[i];
        }
    }

    for(auto num:ret){
        cout<<num<<" ";
    }
    //return ret;
    */


    // most optimal solution..(just bcz it does it in a single pass)
    // if you observer closely you can see that left is used to calculate prefix prod and right is used to calculate postfix prod..
    // its like having two pointers,, with this we will have to chnage values of an element at an index two times,,
    // for. example at index 1 wil will first put the prefix there (this will be done by left variable) and then by the right variable which technically has the postfix,,, we will get to the same index again by using (n-1-i) and then we will multiply its prefix value by the postfix value(right variable)

    // the left has prod of all elem up untill index which itself is at... same with right but in opposite way
    int n = nums.size();
    vector<int> result(n, 1); // Initialize result vector with all 1s
    // 2,3,4,5,6
    int left = 1, right = 1;
    for (int i = 0; i < n; i++) {
        cout<<"i="<<i<<" ,left="<<left<<" ,right="<<right<<"\n";

        result[i] *= left; // Multiply by left product
        left *= nums[i]; // Update left product

        result[n - 1 - i] *= right; // Multiply by right product
        right *= nums[n - 1 - i]; // Update right product
  
        for(auto num:result){
            cout<<num<<" ";
        }

        cout<<endl<<"------------------------\n";
    }
    // return result;
}