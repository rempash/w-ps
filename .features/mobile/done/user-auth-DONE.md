
we need to identify users
every time the app is started we create a unique token for the user
this token is stored in async storage
we send this token to the backend and the backend creates a user with this token
if the user already exists then we do not create a new user but we retrieve the existing user
you need to add a way to run this mechanism in development mode allowing to create new user every time when we want on dev mode
