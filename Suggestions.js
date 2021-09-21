import React from 'react';
import { StyleSheet, View, TextInput, FlatList } from 'react-native';
import { SuggestionListItem } from "./SuggestionListItem";

export function Suggestions(props) {
  let searchInputRef = undefined;

  const handleOnPressItem = (item, event) => {
    this.searchInputRef.blur()
    props.onPressItem(item, event)
  }

  return (<View style={styles.suggestionListContainer}>
    <TextInput 
      ref={(ref) => {this.searchInputRef = ref}}
      style={styles.searchInput} 
      placeholder={props.placeholder} 
      onChangeText={props.handleSearchTextChange}>
    </TextInput>
    {props.showList && <FlatList style={styles.searchList} keyExtractor={(item, index) => index.toString()} keyboardShouldPersistTaps="always" initialNumToRender={5} data={props.suggestionListData} renderItem={({
      item
    }) => <SuggestionListItem onPressItem={handleOnPressItem} item={item}></SuggestionListItem>} />}
  </View>);
}

const styles = StyleSheet.create({
  searchButtons: {
    flexDirection: 'row',
    height: '10%',
    backgroundColor: '#fff',
    color: '#000',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 0,
    paddingLeft: 18,
    paddingRight: 18
  },
  searchInput: {
    height: 40,
    paddingLeft: 10,
    paddingRight: 10,
    borderWidth: 1
  },
  suggestionListContainer: {
    width: "90%",
    marginLeft: "5%",
  },
  searchList: {
    width: "95%",
    marginTop: 10,
  }
});
