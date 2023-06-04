import {
  View,
  Text,
  TouchableOpacity,
  FlatList,
  Modal,
  RefreshControl,
} from "react-native";
import React, { useCallback, useEffect, useState } from "react";
import Background from "../components/Background";
import Topscreen from "../components/Topscreen";
import { actuatedNormalizeVertical, styles } from "../styles/stylesheet";
import { FontAwesome5 } from "@expo/vector-icons";
import LowerButton from "../components/LowerButton";
import SearchComponent from "../components/SearchComponent";
import DetailsCard from "../components/DetailsCard";
import UserDetails from "../components/UserDetails";
import JobDetails from "../components/JobDetails";
import { useSelector, useDispatch } from "react-redux";
import { replaceTask, setTask } from "../store/slice-reducers/JobSlice";
import OdinaryButton from "../components/OdinaryButton";
import SelectComponent from "../components/SelectComponent";
import { TextInput } from "react-native";
import { AccountRealmContext } from "../models";
import { category } from "../models/Task";
import { Object } from "realm";
import { setFilter } from "../store/slice-reducers/Formslice";

const { useRealm, useQuery } = AccountRealmContext;

export default function Jobs({ navigation }) {
  const [modalVisible, setModalVisible] = useState(false);
  const [name, setName] = useState("");
  const [edit, setEdit] = useState({ name: "", id: new Realm.BSON.ObjectId() });
  const [refreshing, setRefreshing] = useState(false);
  const realm = useRealm();
  const Cat = useQuery(category);
  const value =
    realm.objectForPrimaryKey("category", Realm.BSON.ObjectId(edit.id)) || [];

  const dispatch = useDispatch();

  const addCat = useCallback(
    (item) => {
      if (item == "") {
        alert("Name cannot be empty");
        return;
      }

      if (value.length == 0) {
        realm.write(() => {
          return new category(realm, item);
        });
        alert("New Category added!");
      } else {
        realm.write(() => {
          value.name = item.name;
          alert("Category Edited");
        });
      }
    },
    [realm, edit]
  );
  const editCat = useCallback(
    (item) => {
      if (item.name == "") {
        alert("Name cannot be empty");
        return;
      }

      realm.write(() => {
        const value = realm.objectForPrimaryKey("category", item.id);
      });
    },
    [realm]
  );
  const deleteCat = useCallback(
    (item) => {
      if (edit.name == "") {
        alert("Name cannot be empty");
        return;
      }

      realm.write(() => {
        const value = realm.objectForPrimaryKey(
          "category",
          Realm.BSON.ObjectId(edit.id)
        );
        realm.delete(value);
        alert("Category deleted!s");
      });
    },
    [realm]
  );

  useEffect(() => {
    dispatch(setFilter("Name"));
    // dispatch(setvi)
  }, []);

  const render = ({ item }) => {
    return (
      <TouchableOpacity
        onPress={() => {
          setEdit({ name: item.name, id: item._id });
          setName(item.name);
        }}
      >
        <View
          style={{
            backgroundColor:
              edit.name == item.name && edit.id == item._id.toString()
                ? "pink"
                : "transparent",
          }}
          className='flex mb-1 border-b-[.5px] py-[1vh] border-b-primary_light  flex-row'
        >
          <Text style={styles.text_sm} className='w-[50%] text-left text-white'>
            {item.name}
          </Text>
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
          <SearchComponent filterItems={["Name", "Category"]} />
        </View>
        <View>
          <JobDetails />
        </View>
      </View>
      <View className='flex-row flex justify-around self-center absolute bottom-[2vh] w-[100vw]'>
        <OdinaryButton
          style={"bg-primary  "}
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
                text={"ADD"}
                navigate={() => {
                  addCat({ name: name });
                }}
                style={"mt-5 relative bg-[#E59F71] left-[15%]"}
              />
              <OdinaryButton
                text={"DEL"}
                navigate={() => {
                  deleteCat();
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
          <LowerButton text={"Done"} navigate={() => setModalVisible(false)} />
        </View>
      </Modal>
    </Background>
  );
}
