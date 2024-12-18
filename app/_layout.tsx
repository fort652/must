import { Stack } from "expo-router";
import CustomHeader from "../components/CustomHeader";

export default function RootLayout() {
  return (
    <Stack initialRouteName="index">
      <Stack.Screen
        name="index"
        options={{
          header: () => (
            <CustomHeader
              title="Sales"
              backgroundColor="#AC415B"
              titleColor="#fff"
            />
          ),
        }}
      />
      <Stack.Screen
        name="home"
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="data"
        options={{ header: () => <CustomHeader title="Data" /> }}
      />
      <Stack.Screen
        name="stock"
        options={{ header: () => <CustomHeader title="Stock" /> }}
      />
    </Stack>
  );
}
