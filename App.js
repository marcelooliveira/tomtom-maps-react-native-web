import React from 'react';
import { useState } from 'react';
import { StyleSheet, View, Button, TextInput } from 'react-native';
import { WebView } from 'react-native-webview';
import mapTemplate from './map-template';
import axios from 'axios';
import { Suggestions } from './Suggestions';

export default function App() {
  let webRef = undefined;
  let [placeholder, setPlaceholder] = useState('Query e.g. Washington');
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
    setPlaceholder(item.address);
    setMapCenter(`${item.lat}, ${item.lon}`)
    setShowList(false);
    webRef.injectJavaScript(`map.setCenter([${parseFloat(item.lon)}, 
      ${parseFloat(item.lat)}])`);
  }

  const handleMapEvent = (event) => {
    setMapCenter(event.nativeEvent.data)
  }

  const handleSearchTextChange = changedSearchText => {
    if (!changedSearchText || changedSearchText.length < 5) 
      return;

    let baseUrl = `https://api.tomtom.com/search/2/search/${changedSearchText}.json?`;
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
            address: v.address.freeformAddress,
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

      <Suggestions 
        placeholder={placeholder}
        showList={showList} 
        suggestionListData={suggestionListData} 
        onPressItem={onPressItem} 
        handleSearchTextChange={handleSearchTextChange}>
      </Suggestions>

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
    transform: [{ scale: 3 }],
    width: '100%',
    height: '85%',
    alignItems: 'center',
    justifyContent: 'center'
  }
});
