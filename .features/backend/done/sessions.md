task:
we need to implement sessions service that is able to create and store user psychology sessions

db schema {
    sessionId: uniqueId;
    userId: userId (foreign key);
    title: string; // should be empty for now, will be used later
    isOpen: boolean; // true by default
}

logical flow and specification:
sessions service doesn't have its own public rest api, instead app.controller should be extended with new route POST /start-session
when session is created api should return its id to client
messages module should be changed so every message should has sessionId
app.controller /chat method should accept sessionId and attach this sessionId to appropriate messages
when session state is outro and its finished we should close session
after closing session we need to make all messages that belongs to this combination of sessionId and userId as history

