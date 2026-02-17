import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import { withLayoutContext } from 'expo-router';

const Tab = createMaterialTopTabNavigator();
const TopTabs = withLayoutContext(Tab.Navigator);

export default function ProfileLayout() {
  return (
    <TopTabs
      screenOptions={{
        tabBarIndicatorStyle: { backgroundColor: '#000' },
        tabBarStyle: { backgroundColor: '#fff' },
      }}
    >
      <TopTabs.Screen name="index" options={{ title: 'Stats' }} />
     
    </TopTabs>
  );
}
