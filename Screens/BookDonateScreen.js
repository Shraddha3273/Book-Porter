import React from 'react';
import {
    Text,
    TouchableOpacity,
    StyleSheet,
    View,
    TextInput,
    Alert,
    Modal,
    ScrollView,
    KeyboardAvoidingView,
    FlatList
} from 'react-native';
import {ListItem} from 'react-native-elements';
import db from '../config';
import firebase from 'firebase';
import MyHeader from '../Components/MyHeader';

export default class BookDonateScreen extends React.Component{
constructor(){
    super();
        this.state = {
   requestedBookList : [],
   userId : firebase.auth().currentUser.email
    }
    this.requestRef = null
}

getRequestedBookList = () => {
    this.requestRef = db.collection("Requested_Books").onSnapshot((snapshot)=>{
    var requestedBookList = snapshot.docs.map((doc) => doc.data())
    this.setState({requestedBookList : requestedBookList})    
})
}

componentDidMount() {this.getRequestedBookList()}
componentWillUnmount() {this.requestRef()}

keyExtractor = (item, index) => index.toString()
renderItem = ({item, i}) => {
    return(
        <ListItem
        key={i}
        title={item.book_Name}
        subtitle={item.Request_Reason}
        titleStyle={{ color: 'black', fontWeight: 'bold' }}
        rightElement={
            <TouchableOpacity 
            style={styles.button}
            onPress = {() => {
            this.props.navigation.navigate("ReceiverDetails", {"details" : item})
            }}
            >
              <Text style={{color:'#ffff'}}>View</Text>
            </TouchableOpacity>
          }
        bottomDivider
      />
    )
  }

render(){
    return(
        <View style={{flex:1}}>
        <MyHeader title="Donate Books" navigation ={this.props.navigation}/>
        <View style={{flex:1}}>
          {
            this.state.requestedBookList.length === 0
            ?(
              <View style={styles.subContainer}>
                <Text style={{ fontSize: 20}}>List Of All Requested Books</Text>
              </View>
            )
            :(
              <FlatList
                keyExtractor={this.keyExtractor}
                data={this.state.requestedBookList}
                renderItem={this.renderItem}
              />
            )
          }
        </View>
      </View>
    )
  }
}

const styles = StyleSheet.create({
subContainer:{
    flex:1,
    fontSize: 20,
    justifyContent:'center',
    alignItems:'center'
  },
button:{
    width:100,
    height:30,
    justifyContent:'center',
    alignItems:'center',
    backgroundColor:"#ff5722",
    shadowColor: "#000",
    shadowOffset: {
    width: 0,
    height: 8
     }
  }
})