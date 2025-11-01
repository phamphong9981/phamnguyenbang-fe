import { useReducer } from "react";

interface initialStateType {
  isChoosing: boolean;
  isConfirmed: 'none' | 'Tư duy Toán học' | 'Tư duy Khoa học & Giải quyết vấn đề' | 'Tư duy Đọc hiểu';
  testTaken: {
    isMathDone: boolean;
    isScienceDone: boolean;
    isReadingDone: boolean;
  };
}
const initialState: initialStateType = {
  isChoosing: true,
  isConfirmed: 'none',
  testTaken: {
    isMathDone: false,
    isScienceDone: false,
    isReadingDone: false,
  },
};

type Action = 
  "RESET_CONFIRM" 
  | "RESET_CHOOSING"
  | "MATH_DONE"
  | "SCIENCE_DONE"
  | "READING_DONE";

interface ActionWithPayload {
  type: Action;
  payload?: any;
}

const reducer = (state: typeof initialState, action: ActionWithPayload) => {
  switch (action.type) {
    case "RESET_CONFIRM":
      return { ...state, isConfirmed: action.payload || 'none' };
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