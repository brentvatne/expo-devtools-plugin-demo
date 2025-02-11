import {
  ApolloClient,
  InMemoryCache,
  ApolloProvider,
  useQuery,
  gql,
} from "@apollo/client";
import { connectPluginFromAppAsync } from "expo/devtools";
import { StatusBar } from "expo-status-bar";
import { StyleSheet, Text, View, Image, ScrollView } from "react-native";
import { bindExpoPlugin } from "react-native-apollo-devtools-client";

const client = new ApolloClient({
  uri: "https://flyby-router-demo.herokuapp.com/",
  cache: new InMemoryCache(),
});

(async function() {
  if (__DEV__) {
    const devToolsClient = await connectPluginFromAppAsync();
    bindExpoPlugin(devToolsClient, client);
  }
})();

const GET_LOCATIONS = gql`
  query GetLocations {
    locations {
      id
      name
      description
      photo
    }
  }
`;

export function Main() {
  const { loading, error, data } = useQuery(GET_LOCATIONS);

  if (loading) {
    return <Text>Loading...</Text>;
  }
  if (error) {
    return <Text>Error: </Text>;
  }
  return data?.locations.map(({ id, name, description, photo }) => (
    <View key={id} style={styles.item}>
      <Text style={styles.name}>{name}</Text>
      <Image source={{ uri: photo }} style={styles.photo} />
      <Text style={styles.aboutCaption}>About this location:</Text>
      <Text style={styles.description}>{description}</Text>
    </View>
  ));
}

export default function App() {
  return (
    <ApolloProvider client={client}>
      <View style={styles.container}>
        <ScrollView>
          <Main />
        </ScrollView>
        <StatusBar style="auto" />
      </View>
    </ApolloProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    justifyContent: "center",
    marginTop: 60,
  },
  item: {
    padding: 8,
    marginVertical: 16,
    flexDirection: "column",
  },
  name: {
    fontSize: 24,
    fontWeight: "bold",
  },
  photo: {
    width: 350,
    height: 200,
    alignSelf: "center",
    marginVertical: 8,
  },
  aboutCaption: {
    fontSize: 18,
    marginVertical: 8,
  },
  description: {
    fontSize: 12,
  },
});
