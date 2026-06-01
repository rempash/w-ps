
we need a users service with a corresponding mongodb document
it should has unique user_id which is generated when user is created
it shoud has a user_token which we get through request and store it

the user schema in mongodb should be like this:
{
    user_id: string
    user_token: string
}

in controller we need this name of endpoint - POST /signup and return
{
    user_token: string
}

users service should expose method to get user by user_token and vice versa