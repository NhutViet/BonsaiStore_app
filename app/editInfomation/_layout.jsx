import { Stack } from "expo-router";

export default function DetailsLayout() {
  return (
    <Stack>
      <Stack.Screen
        name="index"
        options={{ title: "Chi tiết sản phẩm", headerShown: false }}
      />
    </Stack>
  );
}
