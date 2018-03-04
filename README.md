
Introduction : MyGooglePlacesAnaylitcs is a web service API which helps a user to search nearest ATM, Hospital, Hotel, Bank, etc. in his/her location. For availing this feature a person has to create an account by following few simple steps.


# Steps to Setup code on Local :-

1:- Install node from official nodejs.org website and required node which are included in package.json file.

2:- # Setup DataBase Redis as we are using redis as DB download required files from web sites accroding to os platform.
    # Run Redis instance on port by default port used by redis is 6379
    # Want to run DB on another port add port value in directory "models/dbConfig.js".

3:- # Start the Backend Server by running server.js ex: node server.js or nodemon server.js
    # Node Process Manager can also be used 



# Hit API's and Required parameters :-

1:- Signup :- 
    # headers:
    appkey

    # payload:
    firstName: Input form frontend,
    lastName: Input form frontend,
    username: Input form frontend,
    password: Input form frontend,
    emailId: Input form frontend

2:- Login :-
    
    # headers:
    appkey

    # payload:
    username: Input form frontend,
    password: Input form frontend,
    emailId: Input form frontend

    # Response:
    ssotoken store it FrontEnd 

3:- Logout :-

    # headers:
    appkey,
    ssotoken

    # payload:
    username: Input form frontend

4:- Find Google Places :-
    latitute : input from frontEnd
    longitude : input from frontEnd
    searchedkeyword : input from frontEnd

    http://localhost:3000/getplaces/fetch/latitute/longitude/searchedkeyword 

    ex: http://localhost:3000/getplaces/fetch/19.195678/72.9881369/hospital 


# Features:- 

# Authentication Mechanism and Session management:- 
    • Signup : We are creatating the document with unique username and password is stored in database by using hash-md5 method for every new user
        Once the user fill all these parameters, it will be send to backend. backend will match the parameters with the existing data. If the user name or e-mail ID matches than the error will occur saying user already exist; If not than new account will be created for the user. In backend password will be saved in #md5

    • Login: Login is for existing users. It has the same parameters as sign up. In login page 	only 2 input parameter is displayed; user name and password. If the input 	match parameter match the backend parameter than the user login is 	successful and SSO token will be displayed in the header section; else invalid 	user id or password error will occur on the screen.

    • Logout : Logout also has the same parameter. Once the user is log out from the 	application user name will be displayed on the screen. SSO token and user 	token will be displayed in the header section.


#  Route management :- 
   • Every API is seperate file and it consists of different http method we have created route by using express.router module and this api file is exported 
   
   • Middleware is used to match the correct routes 

# Log Management :- 
    
    • Logs for every hit is mantain at path  "/tmp/myApisLogs.log" wherever it is hosted, logs  debug , reference etc.

# Analytics :- 

    • Database Schema is desinged in three part 
      - User Document which contains user infomations

      example:

        firstName: String,
        lastName: String,
        username: String,
        password: String,
        emailId: String


      - Places Document accroding to cities or town available data document are created (ex : Banks,hospitals,hotels,offies,it park,atm etc)

      example:

        id: String,
		address: String,
		icon: String,
		name: String,
		openNow: Array,
		rating: Number,
	    types: String   

      - User based searced Document 
      
      example:

        firstName: String,
        lastName: String,
        userName: String,
        emailId: String,
        current_location: {
            lat: String,
            long: String,
            DBRes: String
        },
        home_location: String,
        current_search_location: {
            lat: String,
            long: String,
            place: String
        },
        job_location: String,
        recent_search_place: String,
        searchedKeyword: Array,
        attemptsKeyWord: String,
        attemptsFromPlace: String,
        updatedAt: new Date()
    
    • These data will help in finding user's home location, work location, weather a user is working or a student, his/her working hours, most visited place, most searched place, number of working days, number of off days, etc. which will help in providing more accurate result in every new search of a user.




