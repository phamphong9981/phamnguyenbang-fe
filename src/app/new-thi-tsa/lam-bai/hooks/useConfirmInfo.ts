import { useReducer } from "react";

export interface TestTaken {
  isMathDone: boolean;
  isScienceDone: boolean;
  isReadingDone: boolean;
}

const initialState = {
  isChoosing: true,
  isConfirmed: false,
  testTaken: {
    isMathDone: false,
    isScienceDone: false,
    isReadingDone: false,
  },
};

type Action =
  | { type: "RESET_CONFIRM" }
  | { type: "RESET_CHOOSING" }
  | { type: "MATH_DONE" }
  | { type: "SCIENCE_DONE" }
  | { type: "READING_DONE" };

const reducer = (state: typeof initialState, action: Action) => {
  switch (action.type) {
    case "RESET_CONFIRM":
      return { ...state, isConfirmed: !state.isConfirmed };
    case "RESET_CHOOSING":
      return { ...state, isChoosing: !state.isChoosing };
    case "MATH_DONE":
      return {
        ...state,
        testTaken: { ...state.testTaken, isMathDone: true },
      };
    case "SCIENCE_DONE":
      return {
        ...state,
        testTaken: { ...state.testTaken, isScienceDone: true },
      };
    case "READING_DONE":
      return {
        ...state,
        testTaken: { ...state.testTaken, isReadingDone: true },
      };
    default:
      return state;
  }
};

export const useConfirmInfo = () => {
  const [stateConfirm, dispatchConfirm] = useReducer(reducer, initialState);
  return {
    stateConfirm,
    dispatchConfirm,
  };
};