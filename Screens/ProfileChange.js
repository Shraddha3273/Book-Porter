import React from 'react';
import {
    View,
    Text,
    StyleSheet,
    KeyboardAvoidingView,
    Alert,
    TextInput,
    TouchableOpacity
} from 'react-native';
import db from '../config';
import firebase from 'firebase';

export default class ProfileChange extends React.Component {
    constructor (){
        super();
        this.state = {
            firstName : '',
            lastName : '',
            contact : '',
            address : '',
            docId : ''
        }
    }

getUserDetails = () => {
    var user = firebase.auth().currentUser
    var email = user.email

db.collection('Users').where('emailId', '==', email).get().then(snapshot => {
snapshot.forEach(doc => {
    var data = doc.data()
    this.setState({
        emailId : data.EmailId,
        firstName : data.FirstName,
        lastName : data.LastName,
        address  : data.Address,
        contact : data.Contact,
        docId : doc.id
    })
})
    }
)}

saveUserDetails = () => {
    db.collection('users').doc(this.state.docId).update({
        'FirstName' : this.state.firstName,
        'LastName' : this.state.lastName,
        'Address' : this.state.address,
        'Contact' : this.state.contact
    })
    Alert.alert ("Profile updated successfully!!")
}

componentDidMount(){this.getUserDetails()}

render (){
    return(
     <View style = {{flex : 1, alignItems  : 'center', justifyContent : 'center'}}>
<TextInput
    placeholder = {"First Name"}
    maxLength = {15}
    onChangeText = {(text) => {
    this.setState({firstName : text})
}}
value = {this.state.firstName}
/>

<TextInput
placeholder = {"Last Name"}
maxLength = {15}
onChangeText = {(text) => {
this.setState({lastName : text})
}}
value = {this.state.lastName}
/>

<TextInput
placeholder = {"Contact"}
maxLength = {10}
keyboardType = {"numeric"}
onChangeText = {(text) => {
this.setState({contact : text})
}}
value = {this.state.contact}
/>

<TextInput
placeholder = {"Address"}
multiline = {true}
onChangeText = {(text) => {
this.setState({address : text})
}}
value = {this.state.address}
/>

<TouchableOpacity 
style = {styles.button}
onPress = {() => {this.saveUserDetails() }} >
    <Text>Save</Text>
</TouchableOpacity>
        </View>
        )
    }
}

const styles = StyleSheet.create({
button : {
    justifyContent : 'center',
    alignItems : 'center',
    width : '25%',
    height : '8%',
    backgroundColor : '#ff5722'
}
})