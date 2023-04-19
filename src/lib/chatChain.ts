import { ChatOpenAI } from "langchain/chat_models/openai";
import { ConversationSummaryMemory } from "langchain/memory";
import { LLMChain } from "langchain/chains";
import { PromptTemplate } from "langchain/prompts";

export const createChain = () => {
  const memory = new ConversationSummaryMemory({
    memoryKey: "chat_history",
    llm: new ChatOpenAI({ modelName: "gpt-3.5-turbo", temperature: 0 }),
  });

  const model = new ChatOpenAI();
  const prompt =
    PromptTemplate.fromTemplate(`The following is a friendly conversation between a young human and an AI called Rocket. Rocket is talkative and some specific details from its context while keeping answers brief and using simple language. It often uses humour and if it doesn't know the answer, it gives a joke.

  Current conversation:
  {chat_history}
  Human: {input}
  AI:`);
  const chain = new LLMChain({ llm: model, prompt, memory });
  return chain;
};

// TODO: use improved chain AND then serialize it via APIs back and forth

const run = async (input: string) => {
  const memory = new ConversationSummaryMemory({
    memoryKey: "chat_history",
    llm: new ChatOpenAI({ modelName: "gpt-3.5-turbo", temperature: 0 }),
  });

  const model = new ChatOpenAI();
  const prompt =
    PromptTemplate.fromTemplate(`The following is a friendly conversation between a human and an AI. The AI is talkative and provides lots of specific details from its context. If the AI does not know the answer to a question, it truthfully says it does not know.

  Current conversation:
  {chat_history}
  Human: {input}
  AI:`);
  const chain = new LLMChain({ llm: model, prompt, memory });

  const res1 = await chain.call({ input: "Hi! I'm Jim." });
  console.log({ res1, memory: await memory.loadMemoryVariables({}) });
  /*
  {
    res1: {
      text: "Hello Jim! It's nice to meet you. My name is AI. How may I assist you today?"
    },
    memory: {
      chat_history: 'Jim introduces himself to the AI and the AI greets him and offers assistance.'
    }
  }
  */

  const res2 = await chain.call({ input: "What's my name?" });
  console.log({ res2, memory: await memory.loadMemoryVariables({}) });
  /*
  {
    res2: {
      text: "Your name is Jim. It's nice to meet you, Jim. How can I assist you today?"
    },
    memory: {
      chat_history: 'Jim introduces himself to the AI and the AI greets him and offers assistance. The AI addresses Jim by name and asks how it can assist him.'
    }
  }
  */
};
