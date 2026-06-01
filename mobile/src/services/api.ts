// export const BASE_URL = 'http://192.168.9.206:3000'; // Replace with your machine's local IP for physical device testing
export const BASE_URL = 'http://localhost:3000'; // Replace with your machine's local IP for physical device testing

export type ChatResponse = {
  success: boolean;
  data: string;
  sessionFinished: boolean;
};

export const chatApi = {
  startSession: async (user_token: string): Promise<{ sessionId: string }> => {
    try {
      const response = await fetch(`${BASE_URL}/api/start-session`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ user_token }),
      });

      if (!response.ok) {
        throw new Error('Failed to start session');
      }

      return await response.json();
    } catch (error) {
      console.error('API Error:', error);
      throw error;
    }
  },

  sendMessage: async (message: string, user_token: string, session_id: string): Promise<ChatResponse> => {
    try {
      console.log(BASE_URL)
      const response = await fetch(`${BASE_URL}/api/chat`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ message, user_token, session_id }),
      });

      console.log(response);

      if (!response.ok) {
        throw new Error('Failed to send message');
      }

      return await response.json();
    } catch (error) {
      console.error('API Error:', error);
      throw error;
    }
  },

  getHistory: async (userToken: string, sessionId: string) => {
    try {
      const response = await fetch(`${BASE_URL}/messages/${userToken}/${sessionId}`);
      if (!response.ok) {
        throw new Error('Failed to fetch history');
      }
      return await response.json();
    } catch (error) {
      console.error('API Error:', error);
      throw error;
    }
  },
};
