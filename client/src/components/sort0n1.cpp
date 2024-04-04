
#include <iostream>
using namespace std;
#include <vector>

// SORT 0s and 1s

int main()
{
    vector<int> nums = {1, 0, 0, 0, 1,0};
    vector<int> ret(nums.size());

    int l = 0, r = nums.size() - 1;

//in-place
    while(l<r)
    {
        // cout<<"'test'"<<endl;
        if (nums[l] < nums[r]){
            // cout<<"ss"<<nums[l]<<nums[r]<<endl;
            l++;
            r--;
            continue;
        }else if(nums[l] > nums[r]){
            int temp=nums[l];
            nums[l] = nums[r];
            nums[r]=temp;
             l++;
             r--;
        }else{
            // cout<<"equal"<<endl;
            if(nums[l]==0){
                l++;
            }else{
                r--;
            }
        }
    }

    // out of place
    // for (int i = 0; i < nums.size(); i++)
    // {
    //     if (nums[i] ==0)
    //     {
    //         ret[l] = nums[i];
    //         l++;
    //     }else{
    //         ret[r] = nums[i];
    //         r--;
    //     }
           
    // }

    for (auto i : nums)
    {
        // access by value, the type of i is int
        cout << i << endl;
    }
}



// SORT 0s, 1s and 2s (in-place)
// int main()
// {
//     vector<int> nums={2,0,2,1,1,0};

//     vector<int> ret(nums.size());

//     int l = 0, r = nums.size() - 1;
//     for (int i = 0; i < nums.size(); i++)
//     {
//         if (nums[i] ==0)
//         {
//             ret[l] = nums[i];
//             l++;
//         }else{
//             ret[r] = nums[i];
//             r--;
//         }
           
//     }

//     for (auto i : ret)
//     {
//         // access by value, the type of i is int
//         cout << i << endl;
//     }
// }