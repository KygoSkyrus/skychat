# solution to config file security
- you expose keys with no problem. To make it safe, you can restrict it with specific domain in production so that no one else can make call API call from any random domain name. To make it more safe remove localhost from production app


- Q. So it means that other people would be able to access all the data in my firebase database? – 
- Answer is Yes and No. Yes, if you allow or want the other people to access all the data in the database. And No, if you don't want them to. Firebase database has rules, rules that you control


-- CONCLUSION: if you r going with client than set rules for every user like the user can get and modify his own data only,


#### PRIORITY
- whenever a request is declined,, set gthe selectedusertochat to undef so that that the request should not be kept showing
- when user declines a request, the person is removed from request list,, and, now when the sender will send msg again to this user than the msgs will not be sent to receiver as the sender already has the receievrr as the connection,,NEED SOLUTION



### Edge cases:
- can user send himself texts?

## IMPORTANT NOTE:whenever you try to add orderBy make sure that indexing is enabled in firestore


# NOTE : connection are only made when user sends someone a text
- make sure username is unique
- ALWAYS in your app add how the app works,,
- in this one , on any corner show the feature your provide , like security, functionalities etc


# MANAGING FREQUENT DB Calls
- need to call db only when users doc is updated, like a connection is made or request recieved,,
- for msgs theier will be cachhe,, maybe with a cron job



# ISSUE (1=done,0=open)
1. [1] when chat is cleared and user goes back to connection list and then opens the chat, and texts then all the deleted msgs are also showing (// NOTE ::: SENDING MSGS RIGHT AFTER CLEARING CHATS IS PULLING BACK ALL THNE DELETE CHATS ),, ( //when msgs are sent than the deleted msgs were also getting loaded bcz msg query was not running, only the snapshot was running which pulls the new records, thats the reason that when on first load it works fine bcz then the query used to run nut on sendText it does not)  {maybe this can be done by setting mewssagelist to  null when user press back btn to go to chatlist}
2. [0] when texting someone for first time than the msg is not showing immmediately in the ui 

# Defects
-   //when  i send a msg to a unknown user,, the msg doesnt show in ui right then
- add debounce in typing search user
- firebase is keeeping user logged in forever(can be good , like if user wants out than he can logout , or elese he will be logged in always)
- u can try  a techy UI with matt or sharp balck clr , can combinate it with red or yellow  or purple like the old one
- scroll down is not working
- all the parts like sidebar, chathead etc can go to deifferent component
- when connection who is deleted texts again than he is not shown in req listb dynamicaaly,, i dont think req list is working in real time
- hide the author name if its private chat,,,only show when its group


# Todo 
- on every action like [delete/accept/block connection, logout etc] create a popup that if user wanna do this,, will have yes no option
- add loader (while loading mssgs or for dates)
- add loading more msgs feature, only showing latest 20 rn
- when sqwitcinh between users or interfaces in chat body,, add animation like slide in up down when iterface is changed
- add a search icon next to user serch input
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
- add professional and other versions
- there will be a setting optipons for user,, that action will ytabel to a setting page and from where user will be able to see their blocked users, change avatars, change background theme etc,,,try push notifications
- try firebase push notifications
- add a option to share the app with your frnds,, create links to share on social media apps
- use localstoreage or some othr place to store msg,, later u can update those msgs with db,, thi sway you wont have to query db on evry msgs,,,u can use redis,,,also can use a job here to run after every certain hours to backup the chats to db






# wouldnt hurt to have
- add msgs copy and reply feature (least pripority)
- msg delete option for both parties if the msg was sent in between a specific hour 
- delete a SINGLE MSG



# Workflow Architecture
- # signup
  - user create a an account with email/password and username (will add the google/facebook login later)
  - on successful signup account is create in firebase and also the user record entered in db
- # signin 
  - when user signins than userdata(record from users collection) is fetched and all the connections are shown on ui
  - user can select anyone to chat from here (also user can also search user initially through search input in sidebar to find friend)
  
  - upon texting that person is added to user's connection list (connections field is an object which has key value pair of connected username(reciever) and the unique connectionid, i.e. "test1":{id:"connectionid"})
  - but that message is not directly sent to the reciever,, that message will be known as message request and the sender's username along with the connection id generated before will be added to reciever's request list(field: requests)
  - message is added in db with the connectionid 

  - # UI
    - when a chat is opened at the top header the selected person to chat dp will be shown, which will have a dropdown for basic operation such as block, clear chat, delete connection, this dropdown will only be available for a connection and not for conecction in reqlist
    - In UI there will be two headers compartments. one of which will always be 90% width, initailly it will be "CONNECTIONS", which will show all the connections of user and the Second header will be of "CONNECTION REQUEST",
    - on clicking either of them will shrink the other header down. (also when shrinked , replace the header with a relatable icon [can use user icon or chat icon])
    - on hovering over userlist in both connection and request list, it should show basic actions like delete chat, remove connection,,,, on request like there can be like accept or remove connection
    - **CONNECTION_REQUEST**: connection request will be shown on the basis the if there is any new msgs from the sender(which is not a connection). This will be implemented as while rendering the request list we will check if that connection has a deletedTill value, if not than we will just render that req,, if it has a valid deletedTill value than we will check the db for just one last(latest) message document and compare the time of doc with the deletedTill value to check if the message is sent after the deletion, if yes than we will show this on req list otherwise hide
    - when user opens a requested chat, than he will have to opt in from one of two options i.e. Accept/Delete,[late a Block option will also be given] (user is prohibited to reply or text until he/she makes a decision)
    - when a connection request is **accepted** than that connection will be moved to connections field in db and will be removed from request field,
    - when a connection request is **declined** than the connection will be ~~removed from requests list~~
      + **case_1**: if the sender sends the message again after his previous request is declined. in this case we need to check on every msg send that if the receiver has the sender in request list, if not than add him in the req list otherwise ignore.(not happy with this,, why? bcs here we required to access the receiver's doc, which case two problems, 1:- that its gonna make one extra read from db on every msg sent, 2:- we wanted to implement the security rules in db that user can only access their own records,, so it contradics that thought) 
        + **solution**: so when the receiver declines the connection reuqest than instead of deleting connection req, we will delete all the messages from the reciever's side
    - when a connection request is **blocked** .. refer to Block action
    


- # Delete Message
  - the messsage doc will have a field deletedBy[array] which will have the username of the persom who has deleted the msg
  - this way we can handle delete msg for a group too
  - on this action, connection wont be deleted or moved anywhere

- # Delete Connection
  - messages will be deleted and the connection will be moved to the request list (so that the other person sends a text again it will show in req list, as he is not a connection anymore),, why did we moved him to req list instead of removing him from connection list?? bcz that's the case of blocking

- ##### Note
  - a deleted connection and a declined request will lie in the request list but wont be visible to user unless there are new messages , only then that connection will be shown in  req list
  - to stop receiving msgs from a connection or a requested connection user has to block that connection 

- # Block Connection
  - when blocked the connection will be moved to a field(blockedConnections) in user collection, (later can be unblocked from this list)
  - if one is blocked, will he get to know that if he is blocked? probably no
  - he can still send the message currently (maybe we can prohibit him to do so), so when he is unblocked , all the message will sent during the blocked period will also be shown to both of them
  - when someone is unblocked,, he will be shown to req list based on if he has sent any message after he was blocked.. user can still search him to send text, also all msgs will be shown(refer above statement)

- # Search User List
  - are following users allowed to be shown in search list?
    - the one who are deleted;
    - the one who are blocked?
    - the one who's request is declined?
    - user himself?
  - all of them.. why? test one by one to check why not
  








### forever notes
- setU(u=>[...u,user]);,,,,use spread operator to append in exisiting array,,and while using setter function,,use it this way