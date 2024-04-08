#include <iostream>
using namespace std;
#include <algorithm>

// check if given integer is palindrom(same from back and front) or not... lc-#9
int main(){
    int x = 121234;

        //  if (x < 0) {
        //     return false;
        // }
        // long long y = x, reversed = 0;// that we we can eleminate the error of  integer overflow 
        // while (y != 0) {
        //     int mod = y % 10;
        //     cout << "mod"<< mod << endl;
        //     reversed = reversed * 10 + mod;
        //     y /= 10;
        // }
        // cout << "rev" << reversed << endl;

        // if (x == reversed){
        //     return true;
        // }
        // //  return (reversed == x); //the above if statment can also we written as this
        // return false;


  int reversed = 0;
        while (x > reversed) {
            cout << "rev"<< reversed << endl;
            cout<<"calc"<<reversed * 10 + x % 10<<endl;
            
            reversed = reversed * 10 + x % 10;
            x /= 10;
            cout<<"-------------------------"<<endl;
        }
        return (x == reversed) || (x == reversed / 10);



}
