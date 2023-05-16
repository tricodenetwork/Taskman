import React from "react";
import { Keyboard, TouchableWithoutFeedback } from "react-native";
import { useSelector, useDispatch } from "react-redux";
import { setVisible } from "../../src/store/slice-reducers/Formslice";

const DismissKeyboard = ({ children }) => {
  const dispatch = useDispatch();

  return (
    <TouchableWithoutFeedback
      onPress={() => Keyboard.dismiss() & dispatch(setVisible(false))}
    >
      {children}
    </TouchableWithoutFeedback>
  );
};

export default DismissKeyboard;
