import Anthropic from '@anthropic-ai/sdk';

// Initialize the Anthropic client
const anthropic = new Anthropic({
  apiKey: import.meta.env.VITE_ANTHROPIC_API_KEY,
  dangerouslyAllowBrowser: true, // Note: For personal use only!
});

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
 * Send a message to Claude and get a response
 * @param systemPrompt - The system instruction for Claude
 * @param messages - Conversation history
 * @param maxTokens - Maximum tokens in response (default: 2000)
 */
export const sendMessageToClaude = async (
  systemPrompt: string,
  messages: ClaudeMessage[],
  maxTokens: number = 2000
): Promise<ClaudeResponse> => {
  try {
    const response = await anthropic.messages.create({
      model: 'claude-sonnet-4-20250514',
      max_tokens: maxTokens,
      system: systemPrompt,
      messages: messages.map((msg) => ({
        role: msg.role,
        content: msg.content,
      })),
    });

    // Extract text content from response
    const textContent = response.content
      .filter((block: any) => block.type === 'text')
      .map((block: any) => (block.type === 'text' ? block.text : ''))
      .join('\n');

    return {
      content: textContent,
      usage: {
        input_tokens: response.usage.input_tokens,
        output_tokens: response.usage.output_tokens,
      },
    };
  } catch (error: any) {
    console.error('Error calling Claude API:', error);

    if (error instanceof Anthropic.APIError) {
      throw new Error(`Claude API Error: ${error.message}`);
    }

    throw new Error('Failed to communicate with Claude');
  }
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
