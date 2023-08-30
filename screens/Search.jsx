import React, { useRef, useState, useEffect } from "react";
import {
  View,
  StyleSheet,
  ScrollView,
  Alert,
  Share,
} from "react-native";
import Colors from "../components/Colors";
import {
  Avatar,
  Button,
  Card,
  Text,
  Chip,
  Searchbar,
} from "react-native-paper";
import { getTherapists } from "../firebase/firestore";

export default function Com({ navigation, route }) {
  const onShare = async () => {
    try {
      const result = await Share.share({
        message:
          "Join this therapist platform now",
      });
      if (result.action === Share.sharedAction) {
        if (result.activityType) {
          // shared with activity type of result.activityType
        } else {
          // shared
        }
      } else if (result.action === Share.dismissedAction) {
        // dismissed
      }
    } catch (error) {
      Alert.alert(error.message);
    }
  };
  const [cacheData, setCacheData] = useState([]);
  const [data, setData] = useState(cacheData);
  const [searchQuery, setSearchQuery] = React.useState("");
  const onChangeSearch = (query) => setSearchQuery(query);
  const searchbarRef = useRef(null);
  const getData = async () => {
    const res = await getTherapists();
    // console.log("res5111 = ", res);
    setCacheData(res);
    setData(res);
  };
  useEffect(() => {
    // console.log("searchQuery = ", searchQuery);
    if (searchQuery) {
      const result = cacheData.filter((item) => {
        const usernameMatch = item.username
          .toLowerCase()
          .includes(searchQuery.toLowerCase());
        const tagsMatch = item.tags.some((tag) =>
          tag.toLowerCase().includes(searchQuery.toLowerCase())
        );
        return usernameMatch || tagsMatch;
      });

    //   console.log("result = ", result);
      setData(result);
    } else {
      setData(cacheData);
    }
  }, [searchQuery]);
  useEffect(() => {
    if (searchbarRef.current) {
      searchbarRef.current.focus();
    }
    getData();
  }, []);

  return (
    <View
      style={{
        flex: 1,
      }}
    >
      <View
        style={{
          padding: 10,
        }}
      >
        <Searchbar
          ref={searchbarRef}
          placeholder="Search"
          onChangeText={onChangeSearch}
          value={searchQuery}
        />
      </View>
      <ScrollView style={styles.container}>
        <View style={styles.cardBox}>
          {data.length == 0 && (
            <View>
              <Text style={styles.noData}>Don`t see your therapist</Text>
              <Button onPress={onShare}>Invite your therapist</Button>
            </View>
          )}

          {data.map((v, i) => {
            return (
              <Card
                key={i}
                style={{
                  width: "80%",
                  marginTop: 20,
                }}
              >
                <Card.Title
                  title={v.username}
                  left={() => {
                    return (
                      <Avatar.Image
                        size={24}
                        source={{
                          uri: `https://firebasestorage.googleapis.com/v0/b/video-f9152.appspot.com/o/${v.avatar}?alt=media&token=b31ef365-515f-493b-96d4-435e287ea226`,
                        }}
                      />
                    );
                  }}
                />
                <Card.Content>
                  {v?.tags?.map((item, index) => {
                    return (
                      <Chip
                        key={`${index}_${index}`}
                        style={{
                          marginBottom: 5,
                        }}
                      >
                        <Text>{item}</Text>
                      </Chip>
                    );
                  })}
                </Card.Content>
                <Card.Actions>
                  <Button
                    onPress={() => {
                      navigation.navigate("Ask", {
                        username: v.username,
                      });
                    }}
                  >
                    Ask
                  </Button>
                </Card.Actions>
              </Card>
            );
          })}
          <View
            style={{
              height: 20,
            }}
          ></View>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  btnBox: {
    flexDirection: "row",
    justifyContent: "flex-end",
    paddingVertical: 20,
    paddingHorizontal: 20,
  },
  cardBox: {
    alignItems: "center",
  },
  card: {
    width: "80%",
  },
  cardTop: {
    flexDirection: "row",
  },
  cardDate: {
    marginLeft: 5,
  },
  cardLeft: {},
  cardLeftTop: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 5,
  },
  cardRight: {
    flex: 1,
    marginLeft: 10,
  },
  cardDesc: {
    color: Colors.textColor,
    fontSize: 13,
  },
  optBox: {
    flexDirection: "row",
    justifyContent: "flex-end",
  },
  paddingRight: {
    width: 20,
  },
  noData: {
    color: Colors.textColor,
  },
  location: {
    fontSize: 10,
    paddingBottom: 5,
    color: Colors.grey,
  },
});
