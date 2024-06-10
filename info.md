began the project by creating our folder. going in to it then running npm init
and hitting enter a bunch of times to receive all defaults.
Then we installed the dependencies. 
There was no 'create react app', or any of that stuff.

also, to run the project, type npm start


.env
contains our port that we'll use by 'default'.

contains our mongoose connection string. In the example video, they used a local string,
but I used my existing online connection, then I made a db called /node_crud
---I had added the /node_crud a the end of the connection string.

------------------------
main.js

defined the app
defined the PORT to use what's in .env

set up the 'db connection'

used middleware
--the example video was 3 years old, so some of the things he used were depreciated. I had received error message telling me so. And at one point he added express.urlencoded, which is also depreciated, as the cmd window told me. So I just deleted these pieces and it worked--as in, when I ran npm start, it ran and did not crash.

app.use.... don't know how this works but I see it uses session that's from express-session.


next, we set the template engine to use ejs.

app.get --for testing our '/' route. After creating these lines, you can go to the url and it will display Helo World on the localhost/ path.

app.listen, will set up the server to respond and give you a webpage when the '/' is visited...and tell you so in the console.

------------------------
users.js
we set up a schema for the db.
it's in json format.
and at the end, we say modules.export and pass it "user" and userSchema.

------------------------
router.js
We moved our / route from main.js and put it in here. 
Instead of 'Hello World', now it says Home page. 