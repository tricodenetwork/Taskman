import { View, Text, Button, Modal, ScrollView } from "react-native";
import React, { useCallback, useState } from "react";
import Background from "../components/Background";
import Topscreen from "../components/Topscreen";
import { actuatedNormalize, styles } from "../styles/stylesheet";
import OdinaryButton from "../components/OdinaryButton";
import DatePicker from "react-native-date-picker";
import { useDispatch, useSelector } from "react-redux";
import { AddHoliday } from "../store/slice-reducers/Formslice";
import { AccountRealmContext } from "../models";
import { holiday } from "../models/Account";
import LowerButton from "../components/LowerButton";

const { useRealm, useQuery, useObject } = AccountRealmContext;

export default function Actions() {
  const [open, setOpen] = useState(false);
  const [date, setDate] = useState(new Date());

  const hols = useQuery(holiday);
  const realm = useRealm();
  const dispatch = useDispatch();
  console.log(hols);

  const addHoliday = useCallback(
    (item) => {
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

  return (
    <Background>
      <Topscreen>
        <ScrollView>
          <View className='flex m-[6vw] px-[5vw]  w-[90vw] flex-row flex-wrap'>
            {hols.map((item) => (
              <Text
                style={[styles.text_md, { fontSize: actuatedNormalize(18) }]}
                className='mx-[1vw] border-r-[1px] border-r-white pr-[1vh] text-white my-[1vh]'
              >
                {`${item.day.getDate()}/${item.day.getMonth() + 1}`}
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
        <OdinaryButton navigate={() => setOpen(!open)} text='ADD' />
        <OdinaryButton navigate={() => clear()} text='RESET' />

        <Modal visible={open}>
          <View className='flex items-center justify-center h-full'>
            <DatePicker
              mode='date'
              date={date}
              onDateChange={(date) => {
                setDate(date);
              }}
            />
            <OdinaryButton
              style={"top-[15vh]"}
              navigate={() => {
                setOpen(!open);
                addHoliday(date);
              }}
              text={"DONE"}
            />
          </View>
        </Modal>
      </View>
    </Background>
  );
}
