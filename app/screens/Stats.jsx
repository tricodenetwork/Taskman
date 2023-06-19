import { View, Text, Button } from "react-native";
import React from "react";
import Background from "../components/Background";
import { FlatList } from "react-native-gesture-handler";
import { AccountRealmContext } from "../models";
import { activejob } from "../models/Task";
import { useSelector } from "react-redux";
import OdinaryButton from "../components/OdinaryButton";
import {
  SCREEN_WIDTH,
  actuatedNormalize,
  actuatedNormalizeVertical,
  styles,
} from "../styles/stylesheet";
// import PDFLib, { PDFDocument, PDFPage } from "react-native-pdf-lib";
// import * as Print from "expo-print";
// import * as Sharing from "expo-sharing";
import * as MediaLibrary from "expo-media-library";
import RNHTMLtoPDF from "react-native-html-to-pdf";
import * as FileSystem from "expo-file-system";
import { PermissionsAndroid } from "react-native";
import { StorageAccessFramework } from "expo-file-system";
import { useEffect } from "react";

// Call the function to check permissions

const { useRealm, useQuery, useObject } = AccountRealmContext;

export default function Stats() {
  const activeJobs = useQuery(activejob);
  const { user } = useSelector((state) => state);
  const [permissionResponse, requestPermission] = MediaLibrary.usePermissions();

  function calculateTaskStats(data) {
    const taskStats = [];

    data.forEach((object) => {
      object.tasks.forEach((task) => {
        const handler = task.handler;

        // Skip tasks with null or empty string handler
        if (!handler) {
          return;
        }

        let handlerStats = taskStats.find((stats) => stats.handler === handler);

        if (!handlerStats) {
          handlerStats = {
            id: Realm.BSON.ObjectId(),
            handler: handler,
            Assigned: 0,
            promptCompleted: 0,
            promptInPercentage: 0,
            pending: 0,
            completed: 0,
          };
          taskStats.push(handlerStats);
        }

        handlerStats.Assigned++;

        if (task.status === "Completed") {
          handlerStats.completed++;

          const duration = task.duration;
          const taskDurationInMinutes =
            duration.days * 24 * 60 + duration.hours * 60 + duration.minutes;
          const timeDifferenceInMinutes = Math.round(
            task.completedIn.getTime() / (1000 * 60)
          );
          const isPromptCompleted =
            timeDifferenceInMinutes <= taskDurationInMinutes;

          if (isPromptCompleted) {
            handlerStats.promptCompleted++;
          }
        } else if (task.status === "Pending") {
          handlerStats.pending++;
        }
      });
    });

    taskStats.forEach((stats) => {
      const promptCompletionPercentage =
        (stats.promptCompleted / stats.completed) * 100 || 0;
      stats.promptInPercentage = promptCompletionPercentage.toFixed(2);
    });

    return taskStats;
  }

  async function savePDFToDirectory(filePath) {
    const permissions =
      await StorageAccessFramework.requestDirectoryPermissionsAsync();
    if (!permissions.granted) {
      return;
    }

    const fileName = "statistics";
    const directoryUri = permissions.directoryUri;

    try {
      const fileContents = await FileSystem.readAsStringAsync(filePath, {
        encoding: FileSystem.EncodingType.Base64,
      });

      const uri = await StorageAccessFramework.createFileAsync(
        directoryUri,
        fileName,
        "application/pdf"
      );

      await FileSystem.writeAsStringAsync(uri, fileContents, {
        encoding: FileSystem.EncodingType.Base64,
      });

      console.log("PDF file saved:", uri);
    } catch (e) {
      console.log("Error:", e);
    }
  }

  async function generatePDF(data) {
    // checkExternalStoragePermissions();

    try {
      if (permissionResponse.status !== "granted") {
        const perm = await requestPermission();
        if (perm.status != "granted") {
          console.log("permissions not granted");
          return;
        }
      }

      // Create the HTML content dynamically based on the data
      let htmlContent =
        "<h1>Transcript Tracking And Performance Evaluation (TTAPE)</h1>";
      data.forEach((item) => {
        htmlContent += `<p>Handler: ${item.handler}</p>`;
        htmlContent += `<p>Assigned: ${item.Assigned}</p>`;
        htmlContent += `<p>Prompt Completed: ${item.promptCompleted}</p>`;
        htmlContent += `<p>Prompt Completion Percentage: ${item.promptInPercentage}%</p>`;
        htmlContent += "<hr/>";
      });

      const options = {
        html: htmlContent,
        fileName: "stats",
        directory: "Documents",
      };

      const pdf = await RNHTMLtoPDF.convert(options);

      const sourcePath =
        "file:///storage/emulated/0/Android/data/tasks.uniben.vic/files/Documents/stats.pdf";
      const destinationPath =
        "file:///data/user/0/tasks.uniben.vic/files/stats.pdf";

      savePDFToDirectory(sourcePath);
      // const asset = await MediaLibrary.createAssetAsync(sourcePath);

      // asset && console.log("Asset created:", asset);

      // const album = await MediaLibrary.getAlbumAsync("Taskman");
      // if (album == null) {
      //   await MediaLibrary.createAlbumAsync("Taskman", asset, false);
      // } else {
      //   await MediaLibrary.addAssetsToAlbumAsync([asset], album, false);
      // }

      console.log("Pdf Saved Succesfully", pdf.filePath);
      alert("Pdf Saved ", pdf.filePath);
    } catch (error) {
      console.log("Error generating PDF:", error);
    }
  }

  useEffect(() => {});
  const handlerTaskStats = calculateTaskStats(activeJobs);

  const render = ({ item }) => {
    return (
      <View className='flex px-[1vw] border-b-[1px] py-[1vh] flex-row justify-center items-center'>
        <Text style={[styles.text_sm]} className='w-[40%] text-left'>
          {item.handler}
        </Text>
        <Text style={[styles.text_sm]} className='w-[20%] text-center'>
          {item.Assigned}
        </Text>
        <Text style={[styles.text_sm]} className='w-[20%] text-center'>
          {item.promptCompleted}
        </Text>
        <Text style={[styles.text_sm]} className='w-[20%] text-center'>
          {item.promptInPercentage}
        </Text>
      </View>
    );
  };

  return (
    <Background bgColor='flex flex-row items-start'>
      <FlatList
        style={{ height: "100%", padding: 0.01 * SCREEN_WIDTH }}
        contentContainerStyle={{ height: "100%" }}
        ListHeaderComponent={
          <View className='flex px-[1vw] border-b-[1px] flex-row items-center'>
            <Text
              style={[styles.text_sm, { fontSize: actuatedNormalize(10) }]}
              className='w-[40%] border-r-[1px] pt-[1vh] h-full'
            >
              Handler
            </Text>
            <Text
              style={[styles.text_sm, { fontSize: actuatedNormalize(10) }]}
              className='w-[20%] pt-[1vh] border-r-[1px] h-full text-center'
            >
              Assigned
            </Text>
            <Text
              style={[styles.text_sm, { fontSize: actuatedNormalize(10) }]}
              className='w-[20%] border-r-[1px] h-full text-center'
            >
              Prompt Completed
            </Text>
            <Text
              style={[styles.text_sm, { fontSize: actuatedNormalize(10) }]}
              className='w-[20%] text-center'
            >
              Prompt Completion(%)
            </Text>
          </View>
        }
        data={handlerTaskStats}
        renderItem={render}
        keyExtractor={(item) => item.id}
        ListFooterComponent={
          <OdinaryButton
            navigate={() => {
              generatePDF(handlerTaskStats);
            }}
            text='Print'
            style={"bg-Handler3"}
          />
        }
        ListFooterComponentStyle={{
          position: "absolute",
          bottom: actuatedNormalizeVertical(10),
          right: actuatedNormalize(15),
        }}
      />
    </Background>
  );
}
