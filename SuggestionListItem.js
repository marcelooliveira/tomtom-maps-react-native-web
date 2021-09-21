import React from 'react';
import { StyleSheet, View, Text, TouchableOpacity } from 'react-native';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faMapMarkerAlt } from '@fortawesome/free-solid-svg-icons';

export function SuggestionListItem(props) {
  return (<TouchableOpacity onPress={() => props.onPressItem(props.item)}>
    <View style={styles.searchListItem}>
      <View style={styles.searchListItemIcon}>
        <FontAwesomeIcon icon={faMapMarkerAlt} />
      </View>
      <View>
        <Text style={styles.searchListItemTitle}>{props.item.p1}</Text>
        {props.item.p2 && props.item.p3 ? <Text>{props.item.p2} {props.item.p3}</Text> : null}
        {props.item.p2 && !props.item.p3 ? <Text>{props.item.p2}</Text> : null}
      </View>
    </View>
  </TouchableOpacity>);
}

const styles = StyleSheet.create({
  searchListItemIcon: {
    marginLeft: 10,
    marginRight: 10,
    marginTop: 10
  },
  searchListItem: {
    marginTop: 5,
    marginBottom: 5,
    flexDirection: "row"
  },
  searchListItemTitle: {
    fontWeight: 'bold'
  }
});
