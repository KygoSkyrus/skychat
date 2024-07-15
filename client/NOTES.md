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
      - selected users  will also be shown on the top and can be unseletected too.
      - minimum 2 user must be selected to create a group.
      - for groups, instead of group name the group id will be used as key in the connection/request list (this is why bcz there can be groups of similar name)
      - how it will be determined that given connection is a group or not? ... on connections/req list it will be checked if the connection has a group name.. if it has a 'groupName' field than its a group.
      - when a group is created, the groupName and connection id is stored in connections of the user who created the group and in the request list of all the user who are the member of the group..
      - group also has characterstics similar to connections,, like when someone creates a group and adds you than it will show up in request list.. you need to join the group in order to text.. you will get accept and delete group options there..
      - on the connections ui you will get a button to exit on hover,, this will remove you from the group...
      - on openeing a group,, on the top right,, there will be  a dropdown which will have the options to delete chat and exit group.
      - `NOTE:`as we are not storing much information in the connection object about the group,,, there will be a separate collection
      - this collection will store all the neccessary information related to group, such as members list, created at/by, {the main motive of having this collection is to have  a common source of keeping track of members of group.. bcz we dont want to modify every users connection list wheneever someone joins or exists..}
      - whenever users is added/join.. the other user will get a message like notification(like date one) that this user has been adeded, same with someone leaves the group
      - we have to keep record of this in the user's connection object of relative group along with the group name,,, we will store the date time when the user has joined this group... this will help us to show the msgs only after the user has joined,,,
      - `incorporated features`: 
      - ADDED: when a user is added to group by admin(using btn in groupinfo after the group has been already created),, than a deletedTill value should be added in user's doc so that he can see the chats after he has joined(not the previous one)
      - REMOVE: when a user is removed than first he will be removed from the group collection, and the group connection will be removed from his list
      - GROUP has basicalaly three actions,, 
        - accept: which means user accespts to be in group,, [avaiallabe in req list]
        - delete: means the user exits the group... [this is avaiallabe in both connection and req list]
        - clearChat: means the chat is cleared... [ avaialable in connection list only]
      - Add/remove member: only admin can perfrom thesse actions( let this action be displayed but throw a notifiction if anyone other than admin tries to perform these actions)


- # Delete Message
  - the messsage doc will have a field deletedBy[array] which will have the username of the persom who has deleted the msg
  - this way we can handle delete msg for a group too
  - on this action, connection wont be deleted or moved anywhere
  - maybe below "Message deleted" note the time of deletion can be shown
  - *Cases*
   - One on one (A-B): 
    1. for connection if A deletes a msg of himself than for both A and B it should show "deleted msg". [this can be done by checking the author of msg and deletedBy, if both have same username than it means the sender has deleted his msg]
    2. if A delets msg of B, than this should only reflect for the A as he has deleted msg for himself. [this can be done by checking for deletedBy, if it has the user's self name than than he has deleted that msg but if the sender of that msgs is someone else than it means we will just skip that msg and not even show "deleted msg" note]
    **NOTE**: One cannot delete someone else's msgs for both parties.
  - Group (A-B-C-D): 

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
    - user himself?// cant have user texting himself,, as it would try to send a request to himself
  - all of them.. why? test one by one to check why not
  - dont let user search the person who are in the request list, and which has a deletedTill (this is why bcz if we dont do this than on search it will show that the request thing with accept and decline button even if the user has declined him earlier,, so better not show it)
  - search bar uses debouncing and gets the matched docs from db, no snapshot is used
  
- # Settings
 setting consists of the following actions
 - Blocklist
 - Theme / (dark mode)
 - Privacy: allows user to make the account private(by default its true). No one can text and add you to a group
   - on search all users will be displayed but onCLick it will show that user has a private account
   - while creating or adding in group, show a lock sign on the right to portray that its a private account and also show a popup



# version #3 features
- add msgs copy and reply feature (least pripority)
- can add reactions on msgs, on click add a function that will show reactions, a common reaction will be there for all msgs.. or maybe use the exiting picker... that on msg document add a key reaction.. which willl hold the reaction value.. one person can only have one reaction on a msg
- msg delete option for both parties if the msg was sent in between a specific hour 
- add a single snapshot to get the msgs and to handle realtime changes, this will also help with the delete msg(for both participant). currently we just have a snapshot for single msg as it dont listen to every document in the collection, so the feature(delete for both) is not available in this version
- use localstorage or redis to store msg,, later u can update those msgs with db,, this way you wont have to query db on evry msgs,,,also can use a job here to run after every certain hours to backup the chats to db
- when messages are loaded than cache all the msgs so that when user opens that chat again, all those msgs will be displayed and he wont have to load them again n again
- if the admin leaves than there is no admin, hence no members can be added.. possible solution>> is to have 'createdBy' as an array.. which initially will have one(creator) user.. and if that user leaves than push the next member from memberlist to that array,, this will be like stack,, the top user is the current admin,,,and the first ever user will be the creator.