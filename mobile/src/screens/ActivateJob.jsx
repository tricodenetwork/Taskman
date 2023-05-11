import React from "react";
import { View, Text, TextInput, Button } from "react-native";
import { useSelector, useDispatch } from "react-redux";
import { setMatNo, setDept, setHandler, setJob, setEmail } from "./actions";

const jobOptions = ["Option 1", "Option 2", "Option 3"];
const handlerOptions = ["Option A", "Option B", "Option C"];

const ActivateJob = () => {
  const dispatch = useDispatch();
  const { matNo, dept, handler, job, email } = useSelector((state) => state);

  const handleSubmit = () => {
    // Here, you can dispatch an action to do something with the inputs
    console.log("MatNo:", matNo);
    console.log("Dept:", dept);
    console.log("Handler:", handler);
    console.log("Job:", job);
    console.log("Email:", email);
  };

  return (
    <View>
      <Text>MatNo:</Text>
      <TextInput
        onChangeText={(text) => dispatch(setMatNo(text))}
        value={matNo}
        placeholder='Enter your MatNo'
      />

      <Text>Dept:</Text>
      <TextInput
        onChangeText={(text) => dispatch(setDept(text))}
        value={dept}
        placeholder='Enter your department'
      />

      <Text>Handler:</Text>
      <View>
        {handlerOptions.map((option) => (
          <Button
            key={option}
            onPress={() => dispatch(setHandler(option))}
            title={option}
            color={handler === option ? "#00FF00" : "#000000"}
          />
        ))}
      </View>

      <Text>Job:</Text>
      <View>
        {jobOptions.map((option) => (
          <Button
            key={option}
            onPress={() => dispatch(setJob(option))}
            title={option}
            color={job === option ? "#00FF00" : "#000000"}
          />
        ))}
      </View>

      <Text>Email:</Text>
      <TextInput
        onChangeText={(text) => dispatch(setEmail(text))}
        value={email}
        placeholder='Enter your email'
      />

      <Button onPress={handleSubmit} title='Submit' />
    </View>
  );
};

export default ActivateJob;
