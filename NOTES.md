# solution to config file security
- you expose keys with no problem. To make it safe, you can restrict it with specific domain in production so that no one else can make call API call from any random domain name. To make it more safe remove localhost from production app


- Q. So it means that other people would be able to access all the data in my firebase database? – 
- Answer is Yes and No. Yes, if you allow or want the other people to access all the data in the database. And No, if you don't want them to. Firebase database has rules, rules that you control


-- CONCLUSION: if you r going with client than set rules for every user like the user can get and modify his own data only,

## IMPORTANT NOTE:whenever you try to add orderBy make sure that indexing is enabled in firestore

# NOTE :
- ALWAYS in your app add how the app works,,



# MANAGING FREQUENT DB Calls
- need to call db only when users doc is updated, like a connection is made or request recieved,,
- for msgs their will be cache,, maybe with a cron job






# ISSUE (1=done,0=open)
1. [1] when chat is cleared and user goes back to connection list and then opens the chat, and texts then all the deleted msgs are also showing (// NOTE ::: SENDING MSGS RIGHT AFTER CLEARING CHATS IS PULLING BACK ALL THNE DELETE CHATS ),, ( //when msgs are sent than the deleted msgs were also getting loaded bcz msg query was not running, only the snapshot was running which pulls the new records, thats the reason that when on first load it works fine bcz then the query used to run nut on sendText it does not)  {maybe this can be done by setting mewssagelist to  null when user press back btn to go to chatlist}
2. [1] when texting someone for first time than the msg is not showing immmediately in the ui [fixed by calling the realtime-listener function with connection id for new connection]
3. [1] unable to get realtime chat msgs (possible solution,, either convert the getDocs to onsnapshot and store the messages like obj of obj not array of obj to avoid having duplicate data)
4. [1] ANOTEHR PROBLEM IS THAT right after deleting chats and then there are new msgs,, than these msgs wont have a lasvisible element set due to which load more texts wont work (how to set this?)
5. [1] when conection who is deleted texts again than he is not shown in req list dynamically,, i dont think req list is working in real time [this is why bcz the user is not added in request list in userData when user sends msg again,, bcz we never removed the user and just added a deletedTill date, thats why]{this is partially solved that,, whenever user goes to request page than the request list will be rendered,, but if the user is on req list already and than he gets a msg(like above case) than he wont see it in real time}




# done
- make sure username is unique
- when user declines a request, the person is removed from request list,, and, now when the sender will send msg again to this user than the msgs will not be sent to receiver as the sender already has the receievrr as the connection,,NEED SOLUTION
- whenever a request is declined,, set the selectedusertochat to undef so that that the request should not be kept showing
- when i send a msg to a unknown user,, the msg doesnt show in ui in realtime
- scroll down is not working
- show err msg on incorrect login
- hide the author name if its private chat,,,only show when its group




### Possible edge cases for group;
- [done]check if you can add a blocked connection to a group,, if yes than you have to unblock the person,,,either show that blocked person in the searched list with a text that ythis person cant be added bcz its blocked.. i like this way better as compared to throw a popup to unblock the person right there,,,,implement whatever is easy[show a popup that go to blocklist and unloack to add this member to group]
- [done]do not show yourself in the search list of users



# Defects
- [done](sol:added the memberlist with avatar in localstorage, only updating data if its lastUpdated before 6hrs otherwise just get data from localstorage and show)for member list in groupinfo, we stored the images while creating group,,,but the images should be latest,, what if user changes their profile after he as been added to group,,, get latest image on groupInfo
- [done](sol:now showing the req realted actions to only those requests which are visible in request list,, not to the removed connections{which are hidden})if a conenction is removed he is sent to req lis,, what if the same is done by the other user too,, than none of them will ever be able to text each other (if req list connections are removed from searchlist),, if they are not removed from search lisy than on opening those connections it will show the requset ui in chatBOX
- [done]add a notification when a connection is accepted "connection added" something like that
- [done]there is a memory leak error on signinform
- [done]about getalluserlist,,,we have implemented onsnapshot instead of getdocs for now, bcz if a new user is created than it was not showing in other peoples search list,, people would need to refrresh in order to see all users list...Also solved the problem of getting this function called multiple times on any state change as its on top most level and will only run when component is initially rendered. 
- [done]or we can try and put this getalluserlist func in search compo only,,, it will be called with username constraint search by user,,,, this way this function will only be called when necessary,,, for other place we need only avatar and we can save the avatar[problem here,, if we save avatar and user change his avatar than its a stale data,,, so `rejecting this approach`]
- [done]check that there are scrolling options for every interface,,, like for serchuser list the scrollbar is default{i think i left it like that intentionally}
- [done]NEWrtc is rendering two times on few actions such as toggling header, or on loading ( it is bcz of two useeffects and also there is a state update in fetchdata in useeffect) [investigating about this.. is it really a problem or is normal behaviour]{finding:: its a necessity,, and also its not causing its child to rerender so its not that expensive. also on the second rerender fetchdata is not called as the second ue has dependency array}
- [done]have to do something about onchange in search comopnent,, onevery key press its making newrtc rerender,,, maybe we are passing a state from newrtc to searchcomonnent thats why its rerendering,, bcz techinically it shouldnt,, as serchcomp is a child of newrtc [removed setSearchduserlist from newrtc,, it was passed down the line,now the state in serch component itself]
- [done]maybe add a boolean to check if sidebar is visible,, only than show sidebar,, this will prevent unnecessary rerender of sidebar even when its not in use
- [done]add custom attribute in emoji picker
- [done]add a layer to close the emoji picker
- [done]create action creator for toast state
- [done]on every modal we have created a state in parent from where the modal will be publised,,, we did this to control visisibility,, this way the parent component itself renders when this state toggles as well as the child,, but what if we dispatch an action from parent,,, and get the state in child only, than maybe we will be able to save parent to rerender,, and from child componnet we can return null if the state is false and the child if its true
- [done]need to have overlay for few modals(block,entity,editavatar,theme), so that the specific modal is closed,, now whats happening is that if you close editavatar modal than it will close the usermodal too,bcz its using usermodal's overlay,, same with blocked connection modal.. if the above modal visibility approcah is implemented than we can hve
- [done]maybe try the modal thing for sidebar too
- [done]for modals  that has some complex calculations insidemm should not be rendered before they needed,,, revert those modals to previous approach ,, ex entityInfoModal... in useeefect,, its fetching all data before the enfinity modal is loaded
- [done]there is a need of a loader mostly on every action
- [done]add theme in document
- [done]fix signin ui 
- [done]need to check and optimize chatbox componnet
- [done]when a group chat is openend than opening some user from search is not happening
- [done]all the state which are being passed to child ,, can be converted in redux state, for eg,, selectedUserToChat and setSelectedUserToChat,, this can be moved to redux as its widely used
- [done]what about google login????? (google login implemented)

- have to check for email too,, currently a user is able to create multiple acc with single email
- add email verification and password reset for email password signin
- fix the toast position since overall width of chatbody is increased {try putting at bottom center}


# Todo 
- [done]delete msg
- [done]implement group chat/option to create a group and add members 
- [done]**** it is very import to add a setting that will let user control who can text them or add to a group,, by default its off
- [done]there will be a setting optipons for user,, that action will ytabel to a setting page and from where user will be able to see their blocked users, change avatars, change background theme, add the feature to make your account private;;;,,,
- [done]add list icon on dp inside chatbox
- [done]username can not be changed , add regex for usernmae , set criteria (username can only be in lowercase and number, cannot have characters)
- [done]fix theme and add layer
- [done]on every action like [delete/accept/block connection, logout etc] create a popup that if user wanna do this,, will have yes no option 
- [done]on creating new account, its taking too long ,,, show a loader that or show creating your account,, and also check why its taking so long
- [done]add a layer or loader on loading action

- in the info of the app (on the bottom right) add that to keep the account and secure we have made ur account private, you can change it anytime... your msgs are end to end encrypted, other info
- maybe send a notification to user when he is logged in first time after creating account that his privacy setting is off by deafult
- try push notifications
- add a fallback component on error,,,, 
- add lazy loading in pattern images
- change fonts
- there is screnshot for ui dated 2nd feb
- create env file for secret keys, like collection name etc
- in this one , on any corner show the feature your provide , like security, functionalities etc
- encrypt messages/passwords
- check db security using other domain
- remove localhost and add app's real domain to authorized domain from firebase in production 
- try firebase push notifications
- optimize code... check if there is unnecessary prop drilling.. create another branch to do this
- use localstoreage or some othr place to store msg,, later u can update those msgs with db,, this way you wont have to query db on evry msgs,,,u can use redis,,,also can use a job here to run after every certain hours to backup the chats to db


**Style**
- [done]u can try  a techy UI with matt or sharp balck clr , can combinate it with red or yellow  or purple like the old one
- [done]the height of chat body changes as we go from connection to req window, and opens a req chat
- [done]increase the width of overall chatbody
- [done]add a search icon next to user serch input
- [done]create a text like hovered toast if toasts are ever neeeded


**things to do before deploying**
- check responsivness
- fix splash screen  with logo
- add by kygoskyrus at bottom
- add loading more msgs feature, only showing latest 20 rn
- add dummy accounts 
- add your on acc as creator

## OPTIMIZATION
- at end when defects are cleared ,, add console in every compnnets and than check on what actions how many times which compo are rerendering,, should they rerender? are child rendering for no reason?



- **least priority**
- all the parts like sidebar, chathead etc can go to different component
- set the users usernsme in displayname of firebase and avatar in photourl
- add professional and other versions
- add a option to share the app with your frnds,, create links to share on social media apps
- implement that when clicked on profile photo of user/// it zooms up and shows since when you are in touch ... maybe this is too much (show this only for connections)
- add emojis


https://pngtree.com/freepng/programmer-computer-3d-character-cartoon-three-dimensional-cute-profession_14126497.html
https://css-tricks.com/methods-contrasting-text-backgrounds/



## FINDINGS
- firebase is keeeping user logged in forever(can be good , like if user wants out than he can logout , or elese he will be logged in always)



# wouldnt hurt to have
- delete a SINGLE MSG
- add msgs copy and reply feature (least pripority)
- msg delete option for both parties if the msg was sent in between a specific hour 
- when switching between users or interfaces in chat body,, add animation like slide in up down when iterface is changed
- can add reactions on msgs ,, on click add a function that will show reactions ,,a common reaction will be there for all msgs.. or maybe use the exiting picker... that on msg documnet adda key reaction.. which willl hold the reaction value.. one person can only have one reaction on a msg


# Things to implement in version #3
- add a single snapshot to get the msgs and to handle realtime changes, this will also help with the delete msg(for both participant). currently we just have a snapshot for single msg as it dont listen to every document in the collection, so the feature(delete for both) is not available in this version


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
  
- # Settings
 setting consists of the following actions
 - Blocklist
 - Theme / (dark mode)
 - Privacy: allows user to make the account private(by default its true). No one can text and add you to a group
   - on search all users will be displayed but onCLick it will show that user has a private account
   - while creating or adding in group, show a lock sign on the right to portray that its a private account and also show a popup

- # About
 SKYCHAT comes with a various unique features to enhance the messaging experience
 - **Privacy** : We have a privacy setting (turned on by default) which let users to controll who can text them and add them to a group. Even though the msg sent by someone or if you are added to a group, in both case connection-req/group-req will be shown in request list. But we have considered user's privacy to control who can text them by this feature.




## Questions
- whats the solution to two time rendering of a component if we have a state updated inside a useeefect?? is it even a bad approach?? are there any alternatives??? is it supposed to be like this??
- [answer] If you want to prevent your useEffect from running twice, make sure to list all of its dependencies correctly and avoid changing state inside the effect. With this change, the useEffect will only run when the count changes, and not every time the component re-renders.


### forever notes
- setU(u=>[...u,user]);,,,,use spread operator to append in exisiting array,,and while using setter function,,use it this way
- if there is a state whhich is object of object or an array of object,, and if you update a key in the object,, than the state wont be updated bcz for react the object is same as the reference is same ,, so in order to get the changes reflected you have to create another object with same data,,this can be done by suing spread operator,,, [...arr ]
- **Redux thunk**: Redux-Thunk is a middleware that allows you to write asynchronous logic that interacts with the Redux store. It is used to handle asynchronous actions in Redux, such as fetching data from an API or dispatching multiple actions in a sequence.
  - what `middleware` is in the context of Redux? Middleware provides a way to interact with actions dispatched to the Redux store before they reach the reducer. It sits between the action dispatch and the reducer, allowing you to intercept, modify, or delay actions as needed. It provides a way to extend Redux's functionality by intercepting and potentially modifying actions before they reach the reducers.
  - what are `asynchronous actions`? Asynchronous actions in Redux are actions that perform asynchronous operations, such as fetching data from an API, saving data to a server, or compressing images. These actions are often used to update the Redux store with the response, allowing the application to display up-to-date data to the user without requiring a page refresh.
  - `Writing thunk functions` in Redux involves defining asynchronous action creators that return a function instead of a plain action object. These functions have access to the dispatch and getState methods of the Redux store, allowing you to perform asynchronous operations and dispatch actions based on the results.

- dont pass dispatch and other unnecessary stuff in functions parameter if you have a function that calls an api and then dispatch to store,,, just use thunk in those case
- use usecontext whenever there are mutiple data that needed to passed down to child,,, u can create context of functions also
- if you have onchange which is setting a state in parent component than on every key press the child componnet will rerender,, to avoid this either wrap the child component in `React.memo` or use useRef for the input field instead of dstate
- very important when using img tag to show images instead of backgroundImage... sometimes image gets stretched bcz of specific width and height given(in a grid sometimes all images are not of same ratio),,, to overcome that apply `object-fit: cover;` with width and height `width: 100%; height: 80px;`

- `useStore`: This hook returns a reference to the same Redux store that was passed in to the <Provider> component.
  - this may be useful for less common scenarios that do require access to the store, such as replacing reducers.
  - returns an instance of the store. Generally not recommended, because the component which uses this will not get updated. In such case use have to use react hooks like useEffect o explicitly update the component. 
```js
 const pageArrayTwo = useStore();
  const pageArray = pageArrayTwo.getState().pages;
```

- `useSelector`: You should not get entire object in useSelector ? bcz if we are getting the whole object ,than if any of the other state of that object changes than the component will re-render for no reason
```js
 const {test1State} = useSelector(state=>state.test); /// getting whole object
 const test1State = useSelector(state=>state.test.test1State); /// getting the value which is needed
```
  - this is the reason why only related states should be present in a reducer,,, the state that gonna be used in a single componnet.. that way even if you get the whole object,, it wont matter bcz you gonna use every state in that componnet
  - *NOTE*: unlike connect(), useSelector() does not prevent the component from re-rendering due to its parent re-rendering, even if the component's props did not change.

- `createSelector`:  It is used to create a memoized selector function that can efficiently compute derived data from the Redux store.
  - A selector is a function that takes the Redux store state as input and returns a derived value. createSelector allows you to define a selector function that will only recalculate its output if its input values change. This can improve the performance of your application by reducing unnecessary recalculations of derived data.
  - its needed when you have complex calculation on state u are fetching..in the below example the selector functions performs a taskk now this task can be a performace overhead is the component rerenders too mmuch,, to solve thios prpblem we can have a createSelector which will memoize the result
  ```js
    let xyz = "test4";
    const {testArr} = useSelector(state=>state.testArr.map(x=> x!= xyz)); 

    //with createSelector
    const clickedBtnId = createSelector(
      (state) => {return state.testArr.map(x=> x!= xyz)},
      (retTestArr) => {console.log('arr to return',retTestArr); return retTestArr}
    )
    const {testArr} = useSelector(clickedBtnId); 
  ```

- `connect`: connect still works and is supported in React-Redux 8.x. However, we recommend using the hooks API (means useSelector) as the default.
  - The connect() function connects a React component to a Redux store.
  - connect can be used with both React class components and function components whereas hooks can be used with function components only. Using hooks is simpler. The simplicity comes at a price: you have less performance tweaks at your disposal in comparison with connect.
  - *better performance*: connect is a HOC, which means you pass your own component, and connect returns a wrapper component that does all the work of subscribing to the store, running your mapState and mapDispatch, and passing the combined props down to your own component. And the connect will make your component renders if the props passing down changed, beside that, all the new values from the mapState also causes it to re-render, and the component acts the a PureComponent . This means connect has better performance by default
  - On the other hand, useSelector is just a hook that you called inside your function components, and you have no way to alter the rendering when the parents props changed. This is a very important when it comes to optimization, but you can optimize the function components that use useSelector with useMemo to prevent unnecessary re-renders
  - *arguemnets*:
    - As the first argument passed in to connect, `mapStateToProps` is used for selecting the part of the data from the store that the connected component needs.
    - As the second argument passed in to connect, `mapDispatchToProps` is used for dispatching actions to the store.
  - https://dev.to/am20dipi/redux-what-is-connect-1c6l
  - in my words: 
  ```js
  const ConfirmationModal = ({ isConfirmationModalVisible,  hideConfirmationModal }) => {

    //const isConfirmationModalVisible = useSelector((state) => state.ui.isConfirmationModalVisible); NOTE::: this is not needed ,, you can directly use the state,, as all the states are passed as props

    const handleConfirm = () => {
      if (onConfirm) onConfirm();
      hideConfirmationModal();
    }

    if (!isConfirmationModalVisible) return null;

    return (
        <ul className='list d-flex mt-3'>
            <li onClick={() => hideConfirmationModal()}>Cancel</li>// HERE you dont need to dispatch this action like dispatch(hideConfirmationModal()) bcz the component has access to dispatch
        </ul>
    )
  }
  const mapStateToProps = (state) => ({
    isConfirmationModalVisible: state.ui.isConfirmationModalVisible,
  });

  const mapDispatchToProps = {
    hideConfirmationModal
  };
  export default connect(mapStateToProps, mapDispatchToProps)(ConfirmationModal);
  ```
  - [Common ways of calling `connect`](https://react-redux.js.org/tutorials/connect#common-ways-of-calling-connect)
  - Q: How using connect is better than useSelector??


- `Currying` is a technique in functional programming that transforms a function with multiple arguments into a sequence of functions,  each accepting a single argument and ultimately returning the final result. In JavaScript, currying can be achieved using closures. a good example can be how you implemented debouncing,, you created a chain of functions
```js
function add(a, b) {
  return a + b;
}
const addOne = add(1);
console.log(addOne(2)); // 3
//In this example, the add function takes two arguments and returns their sum. The addOne function is a curried version of the add function that takes one argument and returns a function that adds that argument to 1.
```

- in firebase auth.onAuthStateChanged is a very usefull asset to know if a user is till logged in or not,, this is for every auth method(firebase ogin, google etc),,, without setting any extra cookie or session
