# solution to config file security
- you expose keys with no problem. To make it safe, you can restrict it with specific domain in production so that no one else can make call API call from any random domain name. To make it more safe remove localhost from production app


- Q. So it means that other people would be able to access all the data in my firebase database? – 
- Answer is Yes and No. Yes, if you allow or want the other people to access all the data in the database. And No, if you don't want them to. Firebase database has rules, rules that you control


-- CONCLUSION: if you r going with client than set rules for every user like the user can get and modify his own data only,

## IMPORTANT NOTE:whenever you try to add orderBy make sure that indexing is enabled in firestore

# NOTE : connection are only made when user sends someone a text
- ALWAYS in your app add how the app works,,
- in this one , on any corner show the feature your provide , like security, functionalities etc



# MANAGING FREQUENT DB Calls
- need to call db only when users doc is updated, like a connection is made or request recieved,,
- for msgs their will be cache,, maybe with a cron job




### Edge cases:
- can user send himself texts? NO, as this will create confusion bcz the user itself will recieve request and also it is not that important




# ISSUE (1=done,0=open)
1. [1] when chat is cleared and user goes back to connection list and then opens the chat, and texts then all the deleted msgs are also showing (// NOTE ::: SENDING MSGS RIGHT AFTER CLEARING CHATS IS PULLING BACK ALL THNE DELETE CHATS ),, ( //when msgs are sent than the deleted msgs were also getting loaded bcz msg query was not running, only the snapshot was running which pulls the new records, thats the reason that when on first load it works fine bcz then the query used to run nut on sendText it does not)  {maybe this can be done by setting mewssagelist to  null when user press back btn to go to chatlist}
2. [1] when texting someone for first time than the msg is not showing immmediately in the ui [fixed by calling the realtime-listener function with connection id for new connection]
3. [1] unable to get realtime chat msgs (possible solution,, either convert the getDocs to onsnapshot and store the messages like obj of obj not array of obj to avoid having duplicate data)
4. [1] ANOTEHR PROBLEM IS THAT right after deleting chats and then there are new msgs,, than these msgs wont have a lasvisible element set due to which load more texts wont work (how to set this?)





# done
- make sure username is unique
- when user declines a request, the person is removed from request list,, and, now when the sender will send msg again to this user than the msgs will not be sent to receiver as the sender already has the receievrr as the connection,,NEED SOLUTION
- whenever a request is declined,, set the selectedusertochat to undef so that that the request should not be kept showing
- // when i send a msg to a unknown user,, the msg doesnt show in ui right then
- scroll down is not working
- show err msg on incorrect login




### Possible edge cases for group;
- check if you can add a blocked connection to a group,, if yes than you have to unblock the person,,,either show that blocked person in the searched list with a text that ythis person cant be added bcz its blocked.. i like this way better as compared to throw a popup to unblock the person right there,,,,implement whatever is easy[show a popup that go to blocklist and unloack to add this member to group]
- [done]do not show yourself in the search list of users



# Defects
- for member list in groupifo, we stored the images while creating group,,,but the images should be latest,, what if user changes their profile after he as been added to group,,, get latest image on groupInfo
- when connection who is deleted texts again than he is not shown in req listb dynamicaaly,, i dont think req list is working in real time [solution: either we have snapshot for every conecction and request (have to get all the ids by connection and put it in a snapshot query), so that whenever a msg is there from any of the user, than the i will get notified,,,also this can be helpful to show msg on the chatlist window,, to show latest msg]
- hide the author name if its private chat,,,only show when its group
- there is a memory leak error on signinform
- add loading more msgs feature, only showing latest 20 rn

# Todo 
-implement group chat/option to create a group and add members 
- implement that when clicked on profile photo of user/// it zooms up and shows since when you are in touch ... maybe this is too much
-delete msg
- **** it is very import to add a setting that will let user control who can text them or add to a group,, by default its off
- there will be a setting optipons for user,, that action will ytabel to a setting page and from where user will be able to see their blocked users, change avatars, change background theme, add the feature to make your account private;;;,,,try push notifications
- on every action like [delete/accept/block connection, logout etc] create a popup that if user wanna do this,, will have yes no option 
- username can not be changed , add regex for usernmae , set criteria (username can only be in lowercase, cannot start with digits and characters)

- encrypt messages/passwords
- check db security using other domain
- remove localhost and add app's real domain to authorized domain from firebase in production 
- try firebase push notifications

- use localstoreage or some othr place to store msg,, later u can update those msgs with db,, this way you wont have to query db on evry msgs,,,u can use redis,,,also can use a job here to run after every certain hours to backup the chats to db


**Style**
- on desktop show the sidebar..hide it only for mobile
- the height of chat body changes as we go from connection to req window, and opens a req chat
- increase the width of overall chatbody
- u can try  a techy UI with matt or sharp balck clr , can combinate it with red or yellow  or purple like the old one
- add a search icon next to user serch input
- create the chat buuble like it was in v1,, the body and the top will be darkewr whoch will have senders name an d time,, can try to hide this dark strip and on hover show that, for one to one chat it will have only time 
- create a text like hovered toast if toasts are ever neeeded


- **least priority**
- all the parts like sidebar, chathead etc can go to different component
- add loader (while loading mssgs or for dates)
- set the users usernsme in displayname of firebase and avatar in photourl
- add professional and other versions
- add a option to share the app with your frnds,, create links to share on social media apps




https://pngtree.com/freepng/programmer-computer-3d-character-cartoon-three-dimensional-cute-profession_14126497.html




## FINDINGS
- firebase is keeeping user logged in forever(can be good , like if user wants out than he can logout , or elese he will be logged in always)



# wouldnt hurt to have
- delete a SINGLE MSG
- add msgs copy and reply feature (least pripority)
- msg delete option for both parties if the msg was sent in between a specific hour 
- when sqwitcinh between users or interfaces in chat body,, add animation like slide in up down when iterface is changed



## Components
- # ChatBox 
   - in chatbox there is everything that happens inside the chatbox,, (sending and retrieving msgs)
   - for retrieving and handling realtime msgs update there are two functions in useEffct, "retrieveTexts" is used to get the msgs when the chat is openend, and "realtimeListener" is used for realtime chats update,,
   - also this realtimeListener could have been avoided as we could have used onsnapshot instead of getDocs() in retrieveTexts (if onsnapshot has is fetching 20 docs and the same snapshot you want to use as realtimelister, than it will work fine as the snapshot will only read the changed or added items in the query)


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
    - when a chat is opened at the top header the selected person to chat dp will be shown, which will have a dropdown for basic operation such as block, clear chat, delete connection, this dropdown will only be available for a connection and not for conection in req list
    - In UI there will be two headers compartments. one of which will always be 90% width, initailly it will be "CONNECTIONS", which will show all the connections of user and the Second header will be of "CONNECTION REQUEST",
    - on clicking either of them will shrink the other header down. (also when shrinked , replace the header with a relatable icon [can use user icon or chat icon])
    - on hovering over userlist in both connection and request list, it should show basic actions like delete chat, remove connection,,,, on request like there can be like accept or remove connection
    - **CONNECTION_REQUEST**: connection request will be shown on the basis the if there is any new msgs from the sender(which is not a connection). This will be implemented as while rendering the request list we will check if that connection has a deletedTill value, if not than we will just render that req,, if it has a valid deletedTill value than we will check the db for just one last(latest) message document and compare the time of doc with the deletedTill value to check if the message is sent after the deletion, if yes than we will show this on req list otherwise hide
    - when user opens a requested chat, than he will have to opt in from one of two options i.e. Accept/Delete,[later a Block option will also be given] (user is prohibited to reply or text until he/she makes a decision)
    - when a connection request is **accepted** than that connection will be moved to connections field in db and will be removed from request field,
    - when a connection request is **declined** than the connection will be ~~removed from requests list~~
      + **case_1**: if the sender sends the message again after his previous request is declined. in this case we need to check on every msg send that if the receiver has the sender in request list, if not than add him in the req list otherwise ignore.(not happy with this,, why? bcs here we required to access the receiver's doc, which cause two problems, 1:- that its gonna make one extra read from db on every msg sent, 2:- we wanted to implement the security rules in db that user can only access their own records,, so it contradicts that thought) 
        + **solution**: so when the receiver declines the connection reuqest than instead of deleting connection req, we will delete all the messages from the reciever's side .... and when the person sends the msg again then we show him back in the req list by checking if the msg is recieved after the user declined his previous request(by checking deletedTill timestamp)
    - when a connection request is **blocked** .. refer to Block action

    - **group**: 
      - on *creating group* user can add any user by searching the user name
      - there will be modal.. first there will be a text box to enter username then when user click on search to search,,, it is exactly like search on sidebar
      - next below that there will be all the users in the connection list(maybe show req list or blocked connection too but then before adding them user has to unlock or approve his reuqest)
      - selected users  will also be shown on the top and can be unseletected too.
      - minimum 2 user must be selected to create a group.
      - for groups, instead of group name the group id will be used as key in the connection/request list (this is why bcz there can be groups of similar name)
      - how it will be determined that given connection is a group or not? ... on connections/req list it will be checked if the connection has a group name.. if it has a groupname field than its a group.
      - when a group is created, the groupName and connection id is stored in connections of the user who created the group and in the request list of all the user who are the member of the group..
      - group also has charcaterstics similar to connections,, like when someone creates a group and adds you than it will show up in request list.. you need to join the group in order to text.. you will get accept and delete group options there..
      - on the connections ui you will get a button to exit on hover,, this will remove you from the group...
      - on openeing a group,, on the top right,, there will be  a dropdown which will have the options to delete chat and exit group.
      - `NOTE:`as we are not storing much information in the connection object about the group,,, there will be a separate collection
      - this collection will store all the neccessary information related to group, such as members list, created at/by, {the main motive of having this collection is to have  a common source of keeping track of members of group.. bcz we dont want to modify every users connection list wheneever someone joins or exists..}
      - whenever users is added/join.. the other user will get a message like notification(like date one) that this user has been adeded, same with someone leaves the group
      - we have to keep record of this in the user's connection object of relative group along with the group name,,, we will store the date time when the user has joined this group... this will help us to show the msgs only after the user has joined,,,
      - `incorporated features`: 


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
    - user himself?// cant have user texting himself,, as it would try to send a request to hisself
  - all of them.. why? test one by one to check why not
  - dont let user search the person who are in the request list, and which has a deletedTill (this is why bcz if we dont do this than on search it will show that the request thing with accept and decline button even if the user has declined him earlier,, so better not show it)
  








### forever notes
- setU(u=>[...u,user]);,,,,use spread operator to append in exisiting array,,and while using setter function,,use it this way