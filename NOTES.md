#you can register a new user with a unique email ad then later login with that email and password,,,

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



### TODO
- add feature where when the chat is from didfrent day,,put the date in between chats
- convert the time to standard time like 17 shpuld be 5




### structure
- hide the author name if its private chat,,,only show when its group


