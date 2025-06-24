import { Ionicons } from '@expo/vector-icons';
import { Tabs } from 'expo-router';
import { COLORS } from '../../constants/colors';

const TabsLayout = () => {

  return (
    <Tabs screenOptions={{
      headerShown: false,
      tabBarActiveTintColor: COLORS.accent,
      tabBarInactiveTintColor: COLORS.white,
      tabBarStyle: {
        backgroundColor: COLORS.background,
        borderTopColor: COLORS.border,
        borderTopWidth: 1,
        paddingBottom: 6,
        paddingTop: 6,
        height: 70
      },
      tabBarLabelStyle: {
        fontSize: 12,
        fontWeight: '600'
      }
    }}>
      <Tabs.Screen 
        name='index'
        options={{
          headerShown: false,
          title: 'Add',
          tabBarIcon: ({color, size}) => <Ionicons name='add-circle-outline' size={size} color={color}/>
        }}
      />
      <Tabs.Screen 
        name='supplements'
        options={{
          title: 'Supplements',
          tabBarIcon: ({color, size}) => <Ionicons name='leaf-outline' size={size} color={color}/>
        }}
      />
      <Tabs.Screen 
        name='stats'
        options={{
          title: 'Progress',
          tabBarIcon: ({color, size}) => <Ionicons name='fitness-outline' size={size} color={color}/>
        }}
      />
    </Tabs>
  )
}

export default TabsLayout