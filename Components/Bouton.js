import { View, Text,StyleSheet, TouchableOpacity } from 'react-native'
import React from 'react'
import COLORS from '../Constants/Colors'

const Button = (props) => {
    const filledBgColor=props.color||COLORS.primary
    const outlinedColor=COLORS.white
    const bgcolor=props.filled?filledBgColor:outlinedColor
    const textcolor=props.filled?COLORS.white:COLORS.primary
  return (
   <TouchableOpacity onPress={props.onPress} style={{...style.button,
   ...{backgroundColor:bgcolor,...props.style}}}>
    <Text style={{fontSize:16 , color:textcolor}}>{props.title}</Text>
   </TouchableOpacity>
  )
}
const style=StyleSheet.create({
    button:{
        paddingBottom:16,
        paddingVertical:10,
        borderColor:COLORS.primary,
        borderWidth:2,
        borderRadius:16,
        alignItems:"center",
        justifyContent:"center"
    }

})
export default Button