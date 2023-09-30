import {
  View,
  Text,
  TouchableOpacity,
  FlatList,
  Modal,
  RefreshControl,
  ActivityIndicator,
} from "react-native";
import React, { useCallback, useEffect, useState } from "react";
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
import JobDetails from "../../components/JobDetails";
import { TextInput } from "react-native";
import { AccountRealmContext } from "../../models";
import { category, job } from "../../models/Task";
import {
  convertToMinutes,
  formatDuration,
  sumField,
} from "../../api/Functions";
import OdinaryButton from "../../components/OdinaryButton";

const { useRealm, useQuery } = AccountRealmContext;

export default function Jobs({ navigation }) {
  const [modalVisible, setModalVisible] = useState(false);
  const [name, setName] = useState("");
  const [edit, setEdit] = useState({ name: "", id: new Realm.BSON.ObjectId() });
  const [refreshing, setRefreshing] = useState(false);
  const realm = useRealm();
  const Cat = useQuery(category);
  const jobs = useQuery(job);
  // const value = realm.objectForPrimaryKey("category", edit.id) ?? [];
  const value = Cat.filtered(`name == $0`, name);
  const [update, setUpdate] = useState(false);
  useEffect(() => {
    setTimeout(() => {
      setUpdate(true);
    }, 0);
  }, []);

  const addCat = useCallback(
    (item) => {
      if (item.name == "") {
        alert("Name cannot be empty");
        return;
      }
      const sameName = Cat.filtered(`name == $0`, item.name)[0]?.name ?? "";
      if (sameName !== "") {
        alert(`${sameName} already exist `);
        return;
      }

      if (value.length == 0) {
        realm.write(() => {
          return new category(realm, item);
        });
        alert("New Category added!");
      } else {
        realm.write(() => {
          value[0].name = item.name;
          alert("Category Edited");
        });
      }
    },
    [realm, edit]
  );

  const deleteCat = useCallback(
    (item) => {
      if (item.name == "") {
        alert("Select category and try again");
        return;
      }
      realm.write(() => {
        const val = Cat.filtered(`name ==$0`, item.name)[0];
        realm.delete(
          // realm.objectForPrimaryKey("category", Realm.BSON.ObjectId(edit.id))
          val
        );
        alert("Deleted!!");
        setName("");
        setEdit({ name: "" });
      });
    },
    [realm]
  );

  useEffect(() => {
    try {
      realm.write(() => {
        jobs.forEach((job) => {
          const tempSum1 = sumField(job.tasks, "duration");
          const tempSum2 = convertToMinutes(tempSum1);

          job.duration = formatDuration(tempSum2);
        });
      });
    } catch (error) {
      console.log(error);
    }
  }, [jobs.length]);

  const render = ({ item }) => {
    const highlight =
      edit.name == item.name ? "rgba(200,60,150,.4)" : "transparent";

    return (
      <TouchableOpacity
        onPress={() => {
          setName(item.name);
          setEdit({ name: item.name, id: item._id });
        }}
      >
        <View
          style={{
            backgroundColor: highlight,
          }}
          className='flex mb-1 pl-[2vw] border-b-[.5px] px-[1vw] py-[1vh] justify-between border-b-primary_light  flex-row'
        >
          <Text
            style={styles.text_sm}
            className='w-[50%]  text-left text-white'
          >
            {item.name}
          </Text>
          <TouchableOpacity onPress={() => setEdit({ name: "" })}>
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

  return (
    <Background bgColor='min-h-[98vh]'>
      <Topscreen text={"Jobs"} />
      <View
        className='bg-slate-200 h-[85vh] rounded-t-3xl  p-2 w-full absolute bottom-0
      '
      >
        <View className='mb-1'>
          <SearchComponent
            initialFilter={"Name"}
            filterItems={["Name", "Category"]}
          />
        </View>
        <View>
          {!update ? (
            <View className='relative bg-primary_light w-[35%] self-center flex items-center justify-between rounded- py-[2vh] top-[5vh]'>
              <ActivityIndicator size={"small"} color={"rgb(13 3 122)"} />
              <Text className='text-Blue relative top-2' style={styles.text_sm}>
                Loading...
              </Text>
            </View>
          ) : (
            <JobDetails />
          )}
        </View>
      </View>
      <View className='flex-row flex justify-around self-center absolute bottom-[2vh] w-[100vw]'>
        <OdinaryButton
          navigate={() => {
            setModalVisible(true);
          }}
          text={"Add Category"}
        />
        <OdinaryButton
          style={"bg-primary "}
          navigate={() => {
            navigation.navigate("CreateJob");
          }}
          text={"New Job"}
        />
      </View>
      <Modal
        animationType='slide'
        className='h-[50vh]'
        onRequestClose={() => {
          setModalVisible(false);
        }}
        visible={modalVisible}
      >
        <View className='bg-primary min-h-[97vh] pt-10 h-full'>
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
              id='ADD_DELETE_BUTTONS'
              className='flex flex-row'
              style={[styles.Pcard]}
            >
              <OdinaryButton
                text={edit.name !== "" ? "EDIT" : "ADD"}
                navigate={() => {
                  addCat({ name: name });
                  setEdit({ name: "" });
                }}
                style={"mt-5 relative bg-[#E59F71] left-[15%]"}
              />
              <OdinaryButton
                text={"DEL"}
                navigate={() => {
                  deleteCat({ name: name });
                }}
                style={"mt-5 relative bg-[#B22222] left-[15%]"}
              />
            </View>
          </View>
          <View id='TASKS_CONTAINER' className='mx-[4vw]'>
            <Text className='text-white  underline' style={styles.text}>
              Categories
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
              data={Cat}
              renderItem={render}
              keyExtractor={(item) => item._id}
              style={{ height: "55%" }}
            />
          </View>
          <LowerButton
            style={"w-[90vw]"}
            text={"Done"}
            navigate={() => setModalVisible(false)}
          />
        </View>
      </Modal>
    </Background>
  );
}
