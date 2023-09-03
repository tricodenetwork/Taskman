import {
  View,
  Text,
  TouchableOpacity,
  FlatList,
  RefreshControl,
  TextInput,
} from "react-native";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import Background from "../../components/Background";
import Topscreen from "../../components/Topscreen";
import {
  actuatedNormalize,
  actuatedNormalizeVertical,
  styles,
} from "../../styles/stylesheet";
import { FontAwesome } from "@expo/vector-icons";
import LowerButton from "../../components/LowerButton";
import SearchComponent from "../../components/SearchComponent";
import TaskDetails from "../../components/TaskDetails";
import { Modal } from "react-native";
import OdinaryButton from "../../components/OdinaryButton";
import { useRoute } from "@react-navigation/native";
import { AccountRealmContext } from "../../models";
import SelectComponent from "../../components/SelectComponent";

const { useRealm, useQuery } = AccountRealmContext;

export default function Tasks({ navigation }) {
  //--------------------------------------------------------------------------------------STATE AND VARIABLES
  const route = useRoute();
  const realm = useRealm();
  const [modalVisible, setModalVisible] = useState(false);
  const [name, setName] = useState("");
  const [duration, setDuration] = useState({ days: 0, hours: 0, minutes: 0 });
  const { days, hours, minutes } = duration;
  const day = days ?? 0;
  const hour = hours ?? 0;
  const minute = minutes ?? 0;

  const [edit, setEdit] = useState({
    name: "",
    duration: { days: 0, hours: 0, minutes: 0 },
  });
  const [refreshing, setRefreshing] = useState(false);
  const job = realm.objectForPrimaryKey(
    "job",
    Realm.BSON.ObjectId(route.params.id)
  );
  const [task, setTask] = useState(job.tasks);

  // const value = job.tasks.filtered(`name == $0`, edit.name);
  const value = task.filter((obj) => obj.name == edit.name);

  //-------------------------------------------------------------EFFECTS AND FUNCTIONS

  useEffect(() => {
    setEdit({ name: "", duration: { days: 0, hours: 0, minutes: 0 } });
    return () => {
      setRefreshing(false);
    };
  }, [refreshing, modalVisible]);

  const addTask = useCallback(
    (item) => {
      if (
        item.name == "" ||
        item.duration == { days: 0, hours: 0, minutes: 0 }
      ) {
        alert("Field cannot be empty ❗");
        return;
      }
      const sameName =
        job.tasks.filtered(`name == $0`, item.name)[0]?.name ?? "";
      if (sameName !== "") {
        alert(`${sameName} already exist ❗ `);
        return;
      }

      const index = job.tasks.findIndex((obj) => obj.name == item.name);

      if (value.length !== 0) {
        realm.write(() => {
          if (item.name)
            job.tasks.map((task) => {
              const { name, duration } = task;

              if (name == edit.name) {
                task.name = item.name;
                task.duration = item.duration;
                alert("Task edited successfully!");
                setName("");

                return;
              }
            });
        });
      } else if (index == -1) {
        let days = item?.duration?.days == null ? 0 : item?.duration?.days;
        let hours = item?.duration?.hours == null ? 0 : item?.duration?.hours;
        let minutes =
          item?.duration?.minutes == null ? 0 : item?.duration?.minutes;
        let newDuration = { days, hours, minutes };

        const Task = { name: item.name, duration: newDuration };
        realm.write(() => {
          Task && job.tasks.push(Task);
          alert("Task added successfully!");
          setName("");
          setDuration({ days: 0, hours: 0, minutes: 0 });
        });
      } else {
        alert("Task already exist");
        return;
      }
      setTask(job.tasks);
    },
    [realm, edit]
  );

  const deleteTask = useCallback(() => {
    realm.write(() => {
      // Alternatively if passing the ID as the argument to handleDeleteTask:
      // realm?.delete(value);

      const index = job.tasks.findIndex((obj) => obj.name == edit.name);
      // setTask(job.tasks);

      if (index !== -1) {
        navigation.navigate("jobs");
        job.tasks.splice(index, 1);
        alert("Task deleted successfully! 🚮");
        setTask(job.tasks);
      }
    });
  }, [realm, edit]);

  const reArrange = (array) => {
    if (!array) {
      return;
    }
    realm.write(() => {
      const tasksArray = JSON.parse(JSON.stringify(array));
      navigation.goBack();
      job.tasks = tasksArray;
      navigation.navigate("tasks", { id: route.params.id });
    });
  };
  const render = ({ item }) => {
    return (
      <TouchableOpacity
        onPress={() => {
          setName(item.name);
          setDuration(item.duration);
          setEdit({ name: item.name });
        }}
      >
        <View
          style={{
            backgroundColor:
              edit.name == item.name ? "rgba(200,60,150,.4)" : "transparent",
          }}
          className='flex mb-1 border-b-[.5px] py-[1vh] px-[1vw]  border-b-primary_light pr-[2vw] justify-around  flex-row'
          key={item.name}
        >
          <Text style={styles.text_sm} className='w-[50%] text-left text-white'>
            {item.name}
          </Text>
          <Text style={styles.text_sm} className='w-[50%] text-white'>
            {`${item.duration.days == null ? 0 : item.duration.days}d ${
              item.duration.hours == null ? 0 : item.duration.hours
            }h ${item.duration.minutes == null ? 0 : item.duration.minutes}m`}
          </Text>
          <TouchableOpacity
            onPress={() => {
              setEdit({ name: "" });
              setName("");
            }}
          >
            {edit.name == item.name && (
              <View className=''>
                <FontAwesome
                  name='close'
                  size={actuatedNormalize(17)}
                  color='gold'
                />
              </View>
            )}
          </TouchableOpacity>
        </View>
      </TouchableOpacity>
    );
  };

  //----------------------------------------------------RENDERED COMPONENT
  return (
    <Background>
      <Topscreen
        Edit={() => {
          navigation.navigate("CreateJob", {
            id: route.params.id,
          });
        }}
        text2={job ? job.tasks.length : item.supervisor}
        text={job.name}
      />

      <View
        className='bg-slate-200 h-[85vh] rounded-t-3xl  p-2 w-full absolute bottom-0
      '
      >
        <View className='mb-1'>{/* <SearchComponent /> */}</View>
        <View>
          <TaskDetails
            reArrange={(e) => {
              reArrange(e);
            }}
            taskdata={task}
            jobId={route.params.id}
          />
        </View>
      </View>
      <LowerButton
        style={"w-[90vw]"}
        navigate={() => {
          setModalVisible(true);
        }}
        text={"Add /Edit Task"}
      />
      <Modal
        animationType='slide'
        className='h-[50vh]'
        onRequestClose={() => {
          setModalVisible(false);
        }}
        visible={modalVisible}
      >
        <Background>
          <View className='bg-primary pt-10  min-h-screen'>
            <View className=' mb-[2vh]'>
              <View className='flex items-center justify-between self-center mb-[2vh] w-[90%] flex-row'>
                <Text className='text-Handler2' style={styles.text_md2}>
                  Name:
                </Text>
                <TextInput
                  value={name}
                  style={[
                    styles.averageText,
                    { height: actuatedNormalizeVertical(50) },
                  ]}
                  onChangeText={(value) => {
                    setName(value);
                  }}
                  className='w-[70%] bg-slate-300 mb-2 rounded-sm h-10'
                />
              </View>
              <View
                id='DURATION_BOX'
                className='flex items-center bottom-[5vh]  justify-between self-center w-[90%] flex-row'
              >
                <Text className='text-Handler2' style={styles.text_md2}>
                  Duration:
                </Text>
                <View className='flex flex-row w-[70%] justify-around'>
                  <View className='flex flex-row items-center'>
                    <Text className='text-Handler2' style={[styles.text_md2]}>
                      D
                    </Text>
                    <SelectComponent
                      value={day.toString()}
                      setData={(e) => {
                        setDuration({ ...duration, days: e });
                      }}
                      data={[...Array(31)].map((_, index) => {
                        const obj = { name: index };
                        return obj;
                      })}
                      visibleStyles='w-[15vw]'
                      inputStyles='w-[11vw]'
                    />
                  </View>
                  <View className='flex flex-row items-center'>
                    <Text className='text-Handler2' style={[styles.text_md2]}>
                      H
                    </Text>
                    <SelectComponent
                      value={hour.toString()}
                      setData={(e) => {
                        setDuration({ ...duration, hours: e });
                      }}
                      data={[...Array(24)].map((_, index) => {
                        const obj = { name: index };
                        return obj;
                      })}
                      visibleStyles='w-[15vw]'
                      inputStyles='w-[11vw]'
                    />
                  </View>
                  <View className='flex flex-row items-center'>
                    <Text className='text-Handler2' style={[styles.text_md2]}>
                      M
                    </Text>
                    <SelectComponent
                      value={minute.toString()}
                      setData={(e) => {
                        setDuration({ ...duration, minutes: e });
                      }}
                      data={[...Array(60)].map((_, index) => {
                        const obj = { name: index };
                        return obj;
                      })}
                      visibleStyles='w-[15vw]'
                      inputStyles='w-[11vw]'
                    />
                  </View>
                </View>
              </View>
              <View
                className='flex flex-row bottom-[10vh]'
                style={[styles.Pcard]}
              >
                <OdinaryButton
                  text={edit.name !== "" ? "EDIT" : "ADD"}
                  navigate={() => {
                    addTask({ name: name, duration: duration });
                    setEdit({ name: "" });
                  }}
                  style={"mt-5 relative bg-[#E59F71] left-[15%]"}
                />
                <OdinaryButton
                  text={"DEL"}
                  navigate={() => {
                    deleteTask();
                  }}
                  style={"mt-5 relative bg-[#B22222] left-[15%]"}
                />
              </View>
            </View>
            <View id='TASKS_CONTAINER' className='mx-[4vw] bottom-[10vh]'>
              <Text className='text-white  underline' style={styles.text}>
                Tasks
              </Text>
              <FlatList
                refreshControl={
                  <RefreshControl
                    refreshing={refreshing}
                    onRefresh={() => {
                      setRefreshing(true);
                    }}
                  />
                }
                data={task}
                renderItem={render}
                keyExtractor={(item, index) => index.toString()}
                style={{ height: "55%" }}
              />
            </View>
            <LowerButton
              style={"w-[90vw]"}
              text={"Done"}
              navigate={() => {
                setModalVisible(false);
                setEdit({ name: "" });
                setName("");
              }}
            />
          </View>
        </Background>
      </Modal>
    </Background>
  );
}
