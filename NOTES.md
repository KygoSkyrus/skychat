# solution to config file security
- you expose keys with no problem. To make it safe, you can restrict it with specific domain in production so that no one else can make call API call from any random domain name. To make it more safe remove localhost from production app


- Q. So it means that other people would be able to access all the data in my firebase database? – 
- Answer is Yes and No. Yes, if you allow or want the other people to access all the data in the database. And No, if you don't want them to. Firebase database has rules, rules that you control


-- CONCLUSION: if you r going with client than set rules for every user like the user can get and modify his own data only,



# Defects
- firebase is keeeping user logged in forever(can be good , like if user wants out than he can logout , or elese he will be logged in always)
- u can try  a techy UI with matt or sharp balck clr , can combinate it with red or yellow  or purple like the old one
- scroll down is not working

# NOTE : connection are only made when user sends someone a text

# Todo 
- encrypt messages/passwords
- add vc
- user can search other users by therir username and send them msgs
- the receipient will have to accet the msg rqst to see the msgs and then he can start with sender
- option to create a group and add members 
- webrtc
- check db security using other domain
- remove localhost and add app's real domain to authorized domain from firebase in production 
- create a text like hovered toast if toasts are ever neeeded
- set the users usernsme in displayname of firebase and avatar in photourl
- show err msg on incorrect login
- username can npot be changed , add reges for usernmae , set criteria (username can only be in lowercase, cannot start with digits and characters)
- there will be a setting optipons for user,, that action will ytabel to a setting page and from where user will be able to see their blocked users, change avatars, change background theme etc,,,try push notifications
- try firebase push notifications

- use localstoreage or some othr place to store msg,, later u can update those msgs with db,, thi sway you wont have to query db on evry msgs,,,u can use redis,,,also can use a job here to run after every certain hours to backup the chats to db






# wouldnt hurt to have
- add msgs copy and reply feature (least pripority)








##### OLD STUFF-------------------------------

#you can register a new user with a unique email id then later login with that email and password,,,

-while login the displayname and email will be save in cookies which will later used to terminate session,,,set the expiry time around 4-5hours..


#do the functionalities in the chat ui...

#create message 


//for development there is temporry route rtca to develop all the new eatures. when everything will be done then merge this route with home route


problems:::
-the user is being create at the join page which is too early(may or may not be problem)

-fix prop drilling from app.js to char.js


- the message coming from database are the messages from all the rooms,, filter that to show only the msgs of the current room



added this in css



//IMPORTANT NOTE:whenever you try to add orderBy make sure that indexing is enabled in fiirestore


### WHYYY
- firebase if for storing msgs..,,,but cuould have working with firebase only bcz we are using its realtime feature to show msgs then why useee SOCKET.IO


### TODO
- add feature where when the chat is from didfrent day,,put the date in between chats
- convert the time to standard time like 17 shpuld be 5




### structure
- hide the author name if its private chat,,,only show when its group





### forever notes
- setU(u=>[...u,user]);,,,,use spread operator to append in exisiting array,,and while using setter function,,use it this way