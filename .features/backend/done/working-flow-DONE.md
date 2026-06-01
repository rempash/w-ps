
We need to make the chat bot to follow the psychological consultation flow.

we have 3 stages that are describe in 'system-prompt.constants.ts', 3 const vars - introPrompt, interventionPrompt, outroPrompt.

backend flow:
- we init session with introPrompt and after we reach stage_limit we change the stage to the next one, unless we reach max stage_limit in the last_phase, we should pass the correct adjustement to the main system prompt and the context of messages from previous stage to llm to provide better quality of conversation and psychology work
- each stage can only have 4 messages

technical implemetation proposals:
- we have collection in db for stage messages
  - structure: { session_id: uniqueId, messages: string[], stage: enum SESSION_STATE }
- we have collection in db for sessions state
  - structure: { session_id: uniqueId, stage: enum SESSION_STATE, context: string }
- this module doesn't have api interface, only services
- service is able to interact with database
- when we change the stage we need to pass previous context, it means that service should call llm service method with current messages, llm should use getSummaryPrompt and return the result to our service, our service should context
- our service should be included in workflow of app.service when message are send to the chat
- llm service should be able to get from our service current stage and use appropriate prompt before every response to client



