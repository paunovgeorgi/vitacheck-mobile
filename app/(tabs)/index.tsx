import AddSupplement from '@/components/AddSupplement'
import { ICONS } from '@/constants/icons'
import { Image, ScrollView, Text, View } from 'react-native'

const HomeScreen = () => {
  return (
    <View className='flex-1 bg-primary'>
       <ScrollView className="flex-1 px-3" showsVerticalScrollIndicator={false} contentContainerStyle={{
        minHeight: '100%',
        paddingBottom: 10,
        // alignItems: 'center'
      }}>
         <Image source={ICONS.logo} className="w-16 h-16 mt-6 mx-auto animate-pulse"/>
         <Text className='mx-auto text-white mt-4 font-bold text-xl'>Add New Supplements</Text>
         <Text className='text-center text-muted text-sm'>Enter supplement details and optionally auto-categorize.</Text>

         <AddSupplement />
       </ScrollView> 

    </View>
  )
}

export default HomeScreen