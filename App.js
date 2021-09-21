import React from 'react';
import { useState } from 'react';
import { StyleSheet, View, Button, Text, TextInput, FlatList, TouchableOpacity } from 'react-native';
import { WebView } from 'react-native-webview';
import mapTemplate from './map-template';
import axios from 'axios';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome'
import { faMapMarkerAlt } from '@fortawesome/free-solid-svg-icons'

export default function App() {
  let webRef = undefined;
  let searchWaiting = undefined;
  let [mapCenter, setMapCenter] = useState('-121.913, 37.361');
  let [showList, setShowList] = useState(false);
  let [suggestionListData, setSuggestionListData] = useState([])

  const run = `
      document.body.style.backgroundColor = 'blue';
      true;
    `;
    
  const onButtonClick = () => {
    const [lng, lat] = mapCenter.split(",");
    webRef.injectJavaScript(`map.setCenter([${parseFloat(lng)}, ${parseFloat(lat)}])`);
  }

  const onPressItem = (item) => {
    setShowList(false);
    webRef.injectJavaScript(`map.setCenter([${parseFloat(item.lon)}, ${parseFloat(item.lat)}])`);
  }

  const handleMapEvent = (event) => {
    setMapCenter(event.nativeEvent.data)
  }

  const handleSearchTextChange = event => {
    let baseUrl = `https://api.tomtom.com/search/2/search/${event}.json?`;
    let tomtomKey = process.env.TOMTOM_DEVELOPER_KEY;
    let searchUrl = baseUrl + `key=${tomtomKey}`;
    
    axios.get(searchUrl)
    .then(response => {

      let addresses = response.data.results.map(v => { 
        let parts = v.address.freeformAddress.split(',');
        return {
          p1: parts.length > 0 ? parts[0] : null,
          p2: parts.length > 1 ? parts[1] : null,
          p3: parts.length > 2 ? parts[2] : null,
          lat: v.position.lat,
          lon: v.position.lon
        };
      });

      setSuggestionListData(addresses);
      setShowList(true);
    })
  }

  return (
    <View style={styles.container}>
      <View style={styles.buttons}>
        <TextInput 
        style={styles.textInput}
        onChangeText={setMapCenter}
        value={mapCenter}></TextInput>
        <Button title="Set Center" onPress={onButtonClick}></Button>
      </View>

        <View style={styles.suggestionListContainer}>
          <TextInput 
            style={styles.searchInput}
            placeholder="Query e.g. Washington"
            onChangeText={handleSearchTextChange}>
          </TextInput>
          {showList &&
          <FlatList
            style={styles.searchList}
            keyExtractor={(item, index) => index.toString()}
            keyboardShouldPersistTaps="always"
            initialNumToRender={5}
            data={suggestionListData}
            renderItem={({item}) => (
              <TouchableOpacity onPress={ () => onPressItem(item)}>
                <View style={styles.searchListItem}>
                  <View style={styles.searchListItemIcon}>
                    <FontAwesomeIcon icon={ faMapMarkerAlt } />
                  </View>
                  <View>
                    <Text style={styles.searchListItemTitle}>{item.p1}</Text>
                    {(item.p2 && item.p3) ? (<Text>{item.p2} {item.p3}</Text>) : null}
                    {(item.p2 && !item.p3) ? (<Text>{item.p2}</Text>) : null}
                  </View>
                </View>
              </TouchableOpacity>
            )}
            />
          }
        </View>

      <WebView
        ref={(r) => (webRef = r)}
        onMessage={handleMapEvent}
        style={styles.map}
        originWhitelist={['*']}
        source={{ html: mapTemplate }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'column',
    flex: 1
  },
  buttons: {
    flexDirection: 'row',
    height: '10%',
    backgroundColor: '#fff',
    color: '#000',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 12,
    marginBottom: 0
  },
  textInput: {
    height: 40,
    width: "60%",
    marginRight: 12,
    paddingLeft: 5,
    borderWidth: 1
  },
  map: {
    width: '100%',
    height: '85%',
    alignItems: 'center',
    justifyContent: 'center'    
  },
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
  searchInput:  {
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
  },
  searchListItemIcon: {
    marginLeft: 10,
    marginRight: 10,
    marginTop: 10
  },
  searchListItem: {
    marginTop: 5,
    marginBottom: 5,
    flexDirection:"row"
  },
  searchListItemTitle: {
    fontWeight: 'bold'
  }
});
