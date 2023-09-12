import { View, Text, Button, Modal, ScrollView } from "react-native";
import React, { useCallback, useEffect, useState } from "react";
import Background from "../../components/Background";
import Topscreen from "../../components/Topscreen";
import { actuatedNormalize, styles } from "../../styles/stylesheet";
import OdinaryButton from "../../components/OdinaryButton";
// import DatePicker from "react-native-date-picker";
import { useDispatch, useSelector } from "react-redux";
import { AddHoliday } from "../../store/slice-reducers/Formslice";
import { AccountRealmContext } from "../../models";
import { holiday } from "../../models/Account";
import LowerButton from "../../components/LowerButton";
import DateTimePicker, {
  DateTimePickerAndroid,
} from "@react-native-community/datetimepicker";

const { useRealm, useQuery, useObject } = AccountRealmContext;

export default function Actions() {
  const [open, setOpen] = useState(false);
  const [date, setDate] = useState(new Date());

  const hols = useQuery(holiday);
  const isTodayHoliday = hols.some((holiday) => {
    const holidayDate = new Date(holiday.day);
    const today = new Date();

    return (
      holidayDate.getFullYear() === today.getFullYear() &&
      holidayDate.getMonth() === today.getMonth() &&
      holidayDate.getDate() === today.getDate()
    );
  });
  const realm = useRealm();
  const dispatch = useDispatch();

  const addHoliday = useCallback(
    (item) => {
      const isAlreadyAdded = hols.some((holiday) => {
        const holidayDate = new Date(holiday.day);
        const chosenDate = new Date(item);

        return (
          holidayDate.getFullYear() === chosenDate.getFullYear() &&
          holidayDate.getMonth() === chosenDate.getMonth() &&
          holidayDate.getDate() === chosenDate.getDate()
        );
      });

      if (isAlreadyAdded) {
        return;
      }
      realm.write(() => {
        const publicHoliday = { day: item };
        try {
          return new holiday(realm, publicHoliday);
        } catch (error) {
          console.log({ error, msg: "Error adding holiday" });
        }
      });
    },
    [realm]
  );
  const clear = useCallback(() => {
    realm.write(() => {
      try {
        realm.delete(realm.objects("holiday"));
      } catch (error) {
        console.log({ error, msg: "Error deleting holiday" });
      }
    });
  }, [realm]);

  const onChange = (event, selectedDate) => {
    const currentDate = selectedDate;
    setDate(currentDate);
    addHoliday(selectedDate);
  };

  const showDatePicker = () => {
    DateTimePickerAndroid.open({
      value: date,
      onChange,
      mode: "date",
      is24Hour: true,
    });
  };

  return (
    <Background>
      <Topscreen>
        <ScrollView>
          <View className='flex m-[6vw] px-[5vw]  w-[90vw] flex-row flex-wrap'>
            {hols.map((item, index) => (
              <Text
                key={index.toString()}
                style={[styles.text_md, { fontSize: actuatedNormalize(18) }]}
                className='mx-[1vw] border-r-[1px] border-r-white pr-[1vh] text-white my-[1vh]'
              >
                {`${item.day.getDate()} / ${item.day.getMonth() + 1}`}
              </Text>
            ))}
          </View>
        </ScrollView>
      </Topscreen>
      <View className='py-[2vh] w-[100vw] h-[55vh] justify-between'>
        <Text
          className='self-center'
          style={[styles.text_md, { fontSize: actuatedNormalize(17) }]}
        >
          Public Holidays
        </Text>
        <OdinaryButton navigate={showDatePicker} text='ADD' />
        <OdinaryButton navigate={() => clear()} text='RESET' />

        {/* <Modal visible={open}>
          <View className='flex items-center justify-center h-full'>
            <DatePicker
              mode='date'
              date={date}
              onDateChange={(date) => {
                setDate(date);
              }}
            />
            <View className='flex w-[60vw] flex-row'>
              <OdinaryButton
                style={"top-[15vh]"}
                navigate={() => {
                  setOpen(!open);
                  addHoliday(date);
                }}
                text={"DONE"}
              />
              <OdinaryButton
                style={"top-[15vh] ml-[2vw]"}
                navigate={() => {
                  setOpen(!open);
                }}
                text={"CANCEL"}
              />
            </View>
          </View>
        </Modal> */}
      </View>
    </Background>
  );
}
