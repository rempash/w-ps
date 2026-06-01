we need to start user session and show messages list inside sessions

integrate new api method POST /start-session, it returns session_id, store it and attach to every /chat request

we need so separate app in two screeens while keeping layot same, on first screen there is a button 'Начать сессию', when users clicks on the button the /start-session request is initialized and then second screen is opened, on second screen we see the messages list that we have now

