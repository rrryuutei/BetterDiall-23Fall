import React, { useState, useEffect, useRef } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Pressable,
  Alert,
  TextInput,
} from "react-native";
import { Camera } from "expo-camera";
import { AntDesign } from "@expo/vector-icons";
import { storage } from "../firebase/firebase-setup";
import { ref, uploadBytes } from "firebase/storage";
import { writeToVideos } from "../firebase/firestore";
import Svg, { Circle } from "react-native-svg";
import { Octicons } from "@expo/vector-icons";
import { Feather } from "@expo/vector-icons";
import moment from "moment";

export default function Com({ navigation, route }) {
  const timerRef = useRef(null);
  const curNumRef = useRef(0);
  const [show, setShow] = useState(false);
  const [isStart, setIsStart] = useState(false);
  const [isFinish, setIsFinish] = useState(false);
  const [username, setUsername] = useState(
    route?.params?.username || "anonymous"
  );
  const [title, setTitle] = useState("");
  const [uri, setUri] = useState("");
  const [hasCameraPermission, setHasCameraPermission] = useState(null);
  const [hasAudioPermission, setHasAudioPermission] = useState(null);
  const cameraRef = useRef(null);

  const getImageBlob = async (uri) => {
    try {
      const response = await fetch(uri);
      const blob = await response.blob();
      return blob;
    } catch (err) {
      console.log("fetch image ", err);
    }
  };

  useEffect(() => {
    (async () => {
      const { status: cameraStatus } =
        await Camera.requestCameraPermissionsAsync();
      setHasCameraPermission(cameraStatus === "granted");
      const { status: audioStatus } =
        await Camera.requestMicrophonePermissionsAsync();
      setHasAudioPermission(audioStatus === "granted");
    })();
    return () => {
      console.log('Over...') 
    }
  }, []);

  const startRecording = async () => {
    console.log("cameraRef.current = ", cameraRef.current);
    if (hasCameraPermission && hasAudioPermission && cameraRef.current) {
      try {
        const options = {
          maxDuration: 15,
          quality: Camera.Constants.VideoQuality["480p"],
        };
        const data = await cameraRef.current.recordAsync(options);
        curNumRef.current = 0;
        setIsStart(false);
        setIsFinish(true);
        console.log("Video recorded at: ", data.uri);
        setUri(data.uri);
      } catch (error) {
        console.error("Failed to record video: ", error);
      }
    }
  };

  const stopRecording = () => {
    if (cameraRef.current) {
      cameraRef.current.stopRecording();
    }
  };
  const [progressPercentage, setProgressPercentage] = useState(0);
  const radius = 40; // radius of the circle
  const strokeWidth = 5; // width of the circle
  const circumference = 2 * Math.PI * radius; // Circumference of the circle
  const progress = (circumference * progressPercentage) / 100;
  const progressColor = "#fff"; // Color of progress completed
  return (
    <View style={{ flex: 1 }}>
      {hasCameraPermission === null || hasAudioPermission === null ? (
        <Text>Requesting permission...</Text>
      ) : !hasCameraPermission || !hasAudioPermission ? (
        <View>
          <Text>Unable to access camera or record audio</Text>
          <TouchableOpacity
            onPress={() => Camera.requestMicrophonePermissionsAsync()}
          >
            <Text>Click here to manually grant permissions</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <View>
          <View
            style={{
              height: "100%",
              width: "100%",
            }}
          >
            <Camera
              ref={cameraRef}
              style={{ flex: 1 }}
              type={Camera.Constants.Type.front}
            />
          </View>

          {isFinish && (
            <View
              style={{
                width: "100%",
                height: "100%",
                position: "absolute",
                left: 0,
                top: 0,
                zIndex: 10000,
                justifyContent: "space-around",
                alignItems: "center",
              }}
            >
              <TouchableOpacity
                onPress={() => {
                  setUri("");
                  setIsFinish(false);
                  setIsStart(false);
                }}
                style={{
                  position: "absolute",
                  left: 20,
                  top: 20,
                }}
              >
                <AntDesign name="close" size={25} color="#fff" />
              </TouchableOpacity>

              <TextInput
                style={{
                  width: "80%",
                  backgroundColor: title ? "rgba(0,0,0,1)" : "rgba(0,0,0,0.3)",
                  height: 50,
                  borderColor: title ? "black" : "#fff",
                  borderRadius: 10,
                  borderWidth: 1,
                  color: "#fff",
                  paddingHorizontal: 20,
                }}
                placeholderTextColor="#fff"
                placeholder="Title of your question..."
                label="Title"
                value={title}
                multiline
                numberOfLines={1}
                onChangeText={(text) => setTitle(text)}
              />

              <TouchableOpacity
                style={{
                  backgroundColor: "rgb(147,196,69)",
                  width: 200,
                  height: 70,
                  borderRadius: 35,
                  flexDirection: "row",
                  justifyContent: "center",
                  alignItems: "center",
                  borderColor: "rgb(168,208,98)",
                  borderWidth: 5,
                }}
                onPress={async () => {
                  if (!title) {
                    Alert.alert("Title can not be empty!");
                    return;
                  }
                  if (title.length > 40) {
                    Alert.alert("Title can be 40characters max!");
                    return;
                  }
                  let imgBlob = await getImageBlob(uri);
                  let uuid = moment().valueOf();
                  let video_name = `${uuid}_video`;
                  const storageRef = ref(storage, video_name);
                  uploadBytes(storageRef, imgBlob)
                    .then(async (snapshot) => {
                      console.log("Uploaded a blob!");
                      await writeToVideos({
                        username,
                        title,
                        url: video_name,
                      });
                      setUri("");
                      setIsFinish(false);
                      setIsStart(false);
                      navigation.navigate("Watch", {
                        // username: v.username,
                      });
                      Alert.alert("Successfully sent!");
                    })
                    .catch((err) => {
                      console.log("err = ", err);
                    });
                }}
              >
                <Text
                  style={{
                    fontSize: 20,
                    fontWeight: "bold",
                    color: "#fff",
                    marginRight: 5,
                  }}
                >
                  Send it
                </Text>
                <Feather name="send" size={24} color="#fff" />
              </TouchableOpacity>
            </View>
          )}

          <View
            style={{
              position: "absolute",
              width: "100%",
              left: 0,
              bottom: 50,
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            {!isStart && !isFinish && (
              <TouchableOpacity
                onPress={() => {
                  setIsStart(true);
                  startRecording();
                  clearInterval(timerRef.current);
                  curNumRef.current = 0;
                  timerRef.current = setInterval(() => {
                    // console.log("curNumRef.current = ", curNumRef.current);
                    if (curNumRef.current == 15) {
                      // console.log("15 seconds is over...");
                      clearInterval(timerRef.current);
                      curNumRef.current = 0;
                      setIsStart(false);
                      stopRecording();
                      return;
                    }
                    setProgressPercentage((curNumRef.current / 15) * 100);
                    curNumRef.current += 1;
                  }, 1000);
                }}
                style={{
                  width: 50,
                  height: 50,
                  borderRadius: 25,
                  borderColor: "#fff",
                  borderWidth: 5,
                }}
              ></TouchableOpacity>
            )}

            {isStart && !isFinish && (
              <TouchableOpacity
                onPress={() => {
                  clearInterval(timerRef.current);
                  curNumRef.current = 0;
                  setIsStart(false);
                  setIsFinish(false);
                  setUri(false);
                  stopRecording();
                }}
                style={{
                  position: "relative",
                  justifyContent: "center",
                  alignItems: "center",
                  width: 80,
                  height: 80,
                }}
              >
                <Svg
                  style={{
                    position: "absolute",
                    left: 0,
                    top: 0,
                    transform: [
                      {
                        rotate: "-90deg",
                      },
                    ],
                  }}
                  width={radius * 2}
                  height={radius * 2}
                >
                  <Circle
                    cx={radius}
                    cy={radius}
                    r={radius - strokeWidth / 2}
                    stroke={progressColor}
                    strokeWidth={strokeWidth}
                    strokeDasharray={circumference}
                    strokeDashoffset={circumference - progress}
                    strokeLinecap="round"
                  />
                </Svg>
                <View
                  style={{
                    width: 50,
                    height: 50,
                    borderRadius: 25,
                    backgroundColor: "rgba(255,255,255,0.8)",
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  <View
                    style={{
                      height: 20,
                      width: 20,
                      borderRadius: 6,
                      backgroundColor: "#fff",
                    }}
                  ></View>
                </View>
              </TouchableOpacity>
            )}
          </View>
          {show && (
            <Pressable
              onPress={() => {
                setShow(false);
              }}
              style={{
                position: "absolute",
                width: "100%",
                height: "100%",
                left: 0,
                top: 0,
                backgroundColor: "rgba(0,0,0,0.6)",
              }}
            >
              <View
                style={{
                  width: 250,
                  borderRadius: 10,
                  backgroundColor: "#fff",
                  position: "absolute",
                  right: 80,
                  top: 23,
                  zIndex: 100,
                  padding: 20,
                }}
              >
                <Octicons
                  style={{
                    position: "absolute",
                    right: -10,
                    top: 5,
                  }}
                  name="triangle-right"
                  size={50}
                  color="#fff"
                />
                <Text
                  style={{
                    marginBottom: 20,
                  }}
                >
                  This is not a substitute for diagnosis or treatment, but if
                  you have a question, you can ask a therapist.
                </Text>
                <Text>if you are in crisis,please call 988.</Text>
              </View>
            </Pressable>
          )}

          {!isFinish && (
            <TouchableOpacity
              style={{
                alignItems: "flex-end",
                padding: 10,
                position: "absolute",
                right: 30,
                top: 30,
                zIndex: 1000,
              }}
              onPress={() => {
                setShow(true);
              }}
            >
              <AntDesign name="infocirlceo" size={24} color="#fff" />
            </TouchableOpacity>
          )}
        </View>
      )}
    </View>
  );
}
