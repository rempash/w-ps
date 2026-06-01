
we miss context for llm

proposed solution:
we need conversation-context module that will store messages in collectio by user id(assuming one user has only one session at the moment),
so we store messages both from ai and user, and with every request to llm we adjust context with that messages
when stage is changed by workflow.service we mark all the messages in the collection with attribute is_history: boolean, if they were not market previously
to adjust llm request context we use only messages with is_history=false
 

