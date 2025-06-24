import { View, Text } from 'react-native'
import React from 'react'
import { COLORS } from '@/constants/colors'

const HomeScreen = () => {
  return (
    <View className='flex-1 items-center justify-center bg-background text-white' style={{backgroundColor: COLORS.background, flex: 1}}>
      <Text>HomeScreen</Text>
    </View>
  )
}

export default HomeScreen