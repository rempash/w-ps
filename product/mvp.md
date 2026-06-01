MVP
чат с ии женским психологом
хранит историю сообщений и помнит контекст разговора


Psychology session flow:
- it should act by a specific psychological algorithm
- backend shoud store session with session id, client token, stage of the session, and potentially the result of the session
- backend should somehow store summary of the previous sessions
- backend should store current state messages count and if there are more than 4 messages per state it should move to next session state
- session should be end when algorithm is finished
- backend should store the summary of the session in database to the external table

sessions table {
  session_id,
  user_token,
  session_state = 1,
  current_messages_count = 0,
  prev_step_summary,
}
