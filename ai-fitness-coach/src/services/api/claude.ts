/**
 * Claude API client — proxied through the backend server.
 * The API key never touches the frontend.
 */

export interface ClaudeMessage {
  role: 'user' | 'assistant';
  content: string;
}

export interface ClaudeResponse {
  content: string;
  usage?: {
    input_tokens: number;
    output_tokens: number;
  };
}

/**
 * Send a message to Claude via the backend proxy
 */
export const sendMessageToClaude = async (
  systemPrompt: string,
  messages: ClaudeMessage[],
  maxTokens: number = 2000
): Promise<ClaudeResponse> => {
  const token = localStorage.getItem('token');

  const res = await fetch('/api/ai/chat', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    body: JSON.stringify({ systemPrompt, messages, maxTokens }),
  });

  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    throw new Error(body.error || `AI request failed (${res.status})`);
  }

  return res.json();
};

/**
 * Test the API connection
 */
export const testClaudeConnection = async (): Promise<boolean> => {
  try {
    const response = await sendMessageToClaude(
      'You are a helpful assistant.',
      [{ role: 'user', content: 'Say "Connection successful" if you can read this.' }],
      50
    );
    return response.content.includes('Connection successful');
  } catch {
    return false;
  }
};
