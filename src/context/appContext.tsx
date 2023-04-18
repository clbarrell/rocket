// File: AppContext.tsx

import React, { createContext, useReducer } from "react";

// Define the shape of the state
type State = {
  count: number;
};

// Define the type of actions that can be dispatched to update the state
type Action =
  | { type: "INCREMENT" }
  | { type: "DECREMENT" }
  | { type: "unknown" };

// Create the initial state
const initialState: State = { count: 0 };

// Define the reducer function
const reducer = (state: State, action: Action): State => {
  switch (action.type) {
    case "INCREMENT":
      return { ...state, count: state.count + 1 };
    case "DECREMENT":
      return { ...state, count: state.count - 1 };
    default:
      throw new Error(`Unhandled action type: ${action.type}`);
  }
};

// Create the context
export const AppContext = createContext<{
  state: State;
  dispatch: React.Dispatch<Action>;
  children?: React.ReactNode; // Include 'children' prop
}>({
  state: initialState,
  dispatch: () => {
    // Empty dispatch function
  },
});

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
