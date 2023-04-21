// File: AppContext.tsx

import React, { createContext, useContext, useReducer } from "react";

// Define the shape of the state
type State = {
  messages: { ai: string; user: string; ts: number }[];
};

// Define the type of actions that can be dispatched to update the state
type Action =
  | { type: "saveMessages"; message: { ai: string; user: string } }
  | { type: "unknown" };

const messageList = [
  {
    user: "Hello, how are things going? How are you?",
    ai: "Hi there! I don't have feelings like humans, but I'm working perfectly fine. Thanks for asking! How can I assist you toda",
    ts: 123456789,
  },
  {
    user: "Hello, how are things going? How are you?",
    ai: "Hi there! I don't have feelings like humans, but I'm working perfectly fine. Thanks for asking! How can I assist you toda",
    ts: 1234562789,
  },
  {
    user: "Hello, how are things going? How are you?",
    ai: "Hi there! I don't have feelings like humans, but I'm working perfectly fine. Thanks for asking! How can I assist you toda",
    ts: 1234567489,
  },
];

// Create the initial state
const initialState: State = {
  messages: process.env.NODE_ENV === "production" ? [] : messageList,
};

// Define the reducer function
const reducer = (state: State, action: Action): State => {
  switch (action.type) {
    case "saveMessages":
      return {
        messages: [
          ...state.messages,
          { ai: action.message.ai, user: action.message.user, ts: Date.now() },
        ],
      };
    default:
      throw new Error(`Unhandled action type: ${action.type}`);
  }
};

type Dispatch = (action: Action) => void;

// Create the context
export const AppContext = createContext<
  { state: State; dispatch: Dispatch } | undefined
>(undefined);

// Create the context provider component
export const AppContextProvider: React.FC<React.PropsWithChildren<{}>> = ({
  children,
}): JSX.Element => {
  const [state, dispatch] = useReducer(reducer, initialState);

  return (
    <AppContext.Provider value={{ state, dispatch }}>
      {children}
    </AppContext.Provider>
  );
};

export function useAppContext() {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error("useCount must be used within a CountProvider");
  }
  return context;
}
