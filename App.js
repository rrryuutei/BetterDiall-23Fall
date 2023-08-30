import { StatusBar } from "expo-status-bar";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { NavigationContainer } from "@react-navigation/native";
import Colors from "./components/Colors";
import Watch from "./screens/Watch";
import Ask from "./screens/Ask";
import Search from "./screens/Search";
import { Entypo } from "@expo/vector-icons";
import { FontAwesome5 } from "@expo/vector-icons";
import { FontAwesome } from "@expo/vector-icons";
const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

function HomeScreen(props2) {
  return (
    <Tab.Navigator
      screenOptions={({ navigation }) => ({
        headerStyle: { backgroundColor: Colors.primary },
        headerTintColor: "white",
        tabBarStyle: { backgroundColor: Colors.primary },
        tabBarActiveTintColor: "#fff",
        tabBarInactiveTintColor: "#000",
      })}
    >
      <Tab.Screen
        name="Watch"
        options={{
          unmountOnBlur: true,
          title: "Watch",
          headerTitleAlign: "center",
          tabBarIcon: ({ color, size }) => (
            <Entypo name="home" size={24} color={color} />
          ),
        }}
      >
        {(props) => <Watch {...props2} {...props} />}
      </Tab.Screen>
      <Tab.Screen
        name="Ask"
        options={{
          unmountOnBlur: true,
          title: "Ask",
          tabBarIcon: ({ color, size }) => (
            <FontAwesome5 name="record-vinyl" size={size} color={color} />
          ),
        }}
      >
        {(props) => <Ask {...props2} {...props} />}
      </Tab.Screen>
      <Tab.Screen
        name="Search"
        options={{
          title: "Search",
          tabBarIcon: ({ color, size }) => (
            <FontAwesome name="search" size={size} color={color} />
          ),
        }}
      >
        {(props) => <Search {...props2} {...props} />}
      </Tab.Screen>
    </Tab.Navigator>
  );
}
export default function App() {
  return (
    <>
      <NavigationContainer>
        <Stack.Navigator
          screenOptions={{
            headerStyle: { backgroundColor: Colors.primary },
            headerTintColor: "white",
          }}
        >
          <Stack.Screen name="HomeScreen" options={{ headerShown: false }}>
            {(props) => (
              <HomeScreen
                {...props}
              />
            )}
          </Stack.Screen>
        </Stack.Navigator>
      </NavigationContainer>
      <StatusBar style="auto" />
    </>
  );
}
