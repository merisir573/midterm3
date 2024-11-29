NOTE: I was unsure wether or not the README had to be in English or not, just in case I am writing in English.

Github Link:
https://github.com/merisir573/midterm3

Swagger Link:
https://midterm-project-5qy1.onrender.com/swagger

Video Link:
https://youtu.be/sMKO3MxqExs (NOTE: The video is send only, if it doesn't work, please send an E-Mail so I can change it to public)

---My Design---
I originally tried using Python Flask, however it proved to be a bit too difficult for me, hence why I switched over to Nest.JS.
Nest.JS made making an API much easier. Easy to write functions, implementations of libraries and Swagger. It also auto generates the basics of controllers, modules and services.
Due to this easiness my design is relatively straightforward, when inserted that object is pushed into an array of other same-type objects. When quaried, the system checks for the parameters given and outputs an object from the array.
My JWT implementation was rather sloppy, moslty due to the nature of not knowing anything about it. It tries to generate a JWT secret key upon a successful login but Swagger doesn't seem to authenticate it right as it can accept anything as a key.

---Assumptions Made---
As I was not sure what some of the instructions meant, I made report by rating also require a rating to be specified even if the instruction did not specify so. I also made the assumption that when the dates weren't specified, all the listings would be shown when quaried and only when the dates were specified would it omit specific listings that were booked.
I also assumed that it would have been much harder to implement the system into a cloud service, services like Azure make it seem more complex than it really was.

---Issues I Encountered---
As I stated above, originally I went for a Python Flask project, however due to the last minute change to Nest.JS my API couldn't be as polished as it could have been.
I initially tried to use Github for the authentication process, however, for some reason I could not figure out the redirect would just not work upon authenticating.
Due to my lack of knowledge regarding authentication, what I ended up with is a half working system, I could have kept it to where certain functions would require authentication, but then the project would be unusable as it gives an error.
I also tried to use Render's builtin PostgresSQL dataabase system, however I could not get it to work despite my multiple attempts, losing me several hours. 
This was to be expected as this was my first ever time trying to authenticate or use a complex data base as a Computer Engineer.
