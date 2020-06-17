import React from 'react';
import {
    View,
    Text,
    TouchableOpacity,
    StyleSheet
} from 'react-native';
import {Card, Header, Icon} from 'react-native-elements';
import db from '../config';
import firebase from 'firebase';

export default class ReceiverDetailsScreen extends React.Component {
constructor(props){
    super(props);
    this.state = {
    userId : firebase.auth().currentUser.email,
    receiverId : this.props.navigation.getParam('details')["userId"],
    requestId : this.props.navigation.getParam('details')["RequestId"],
    bookName : this.props.navigation.getParam('details')["book_Name"],
    requestReason : this.props.navigation.getParam('details')["Request_Reason"],
    receiverName : '',
    receiverContact : '',
    receiverAddress : '',
    receiverRequestDocId : '',
    userName : ''
    }}

getReceiver () {
    db.collection('Users').where('emailId', '==', this.state.receiverId)
    .get().then(snapshot => {
        snapshot.forEach(doc => {
            this.setState({
                receiverName : doc.data().FirstName,
                receiverContact : doc.data().Contact,
                receiverAddress : doc.data().Address
            })
        })
    })

db.collection('Requested_Books').where('Request_Id', '==', this.state.Request_Id).
get().then(snapshot => {
    snapshot.forEach(doc => {
        this.setState({
            receiverRequestDocId : doc.id
        })
    })
})
}

getUserDetails () {
    db.collection('Users').where('emailId', '==', this.state.userId)
    .get().then(snapshot => {
        snapshot.forEach(doc => {
            this.setState({
                userName : doc.data().FirstName + " " + doc.data().LastName
            })
        })
    })
}

componentDidMount (){
    this.getReceiver()
    this.getUserDetails(this.state.userId)
}

updateBookStatus = () => {
db.collection('All_Donations').add({
    Book_Name : this.state.bookName,
    Request_Id : this.state.requestId,
    Requested_By : this.state.receiverName,
    Requestor_Address : this.state.receiverAddress,
    Donor_Id : this.state.userId,
    Requestor_Contact : this.state.Requestor_Contact,
    Request_Status : "Donor Interested"
})
}

addNotification = () => {
var Message = this.state.userName + "has show interest in donating you the book."
db.collection('All_Notifications').add({
    requestorUserId : this.state.receiverId,
    Donor_id : this.state.userId,
    Request_id : this.state.requestId,
    Book_Name : this.state.bookName,
    Date : firebase.firestore.FieldValue.serverTimestamp(),
    Notification_Status : "unread",
    Message : Message
})
}

    render () {
        return (
    <View style = {{flex : 1}}>
    <View style = {{flex : 0.1}}>
    <Header
    leftComponent = {
    <Icon 
        name = 'arrow-left' 
        type = 'feather'
        onPress = {() => this.props.navigation.goBack()}
        /> 
    }
    centerComponent = {{
        style : {fontSize : 20},
        text : "Donate Books"
    }}
    />
    <View style = {{flex : 0.3}}>
        <Card title = {"Book Information"}>
        <Card>
<Text>Name : {this.state.bookName}</Text>
        </Card>
        <Card>
<Text>Reason : {this.state.requestReason}</Text>
        </Card>
        </Card>
    </View>
    <View style = {{flex : 0.3}}>
<Card title = {"Receiver Information"}>
<Card>
<Text>Receiver : {this.state.receiverName}</Text>
</Card>

<Card>
<Text>Contact : {this.state.Contact}</Text>
</Card>

<Card>
<Text>Address : {this.state.Address}</Text>
</Card>
</Card>
    </View>
    </View>
    <View>
{
    this.state.receiverId !== this.state.userId
    ? (
<TouchableOpacity 
style = {styles.DonateButton}
onPress = {() => {
    this.updateBookStatus()
    this.props.navigation.navigate('MyDonations')
}}
>
<Text>Donate Book</Text>
</TouchableOpacity>
    )
: null
}
    </View>
    </View>        
    )
    }
}

const styles = StyleSheet.create ({
DonateButton : {
    justifyContent : 'center',
    alignItems : 'center',
    backgroundColor : '#ff5722'
}
})