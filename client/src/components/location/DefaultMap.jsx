import React, { useEffect, useState } from "react";
import {
  AzureMap,
  AzureMapsProvider,
  IAzureMapOptions,
  AzureMapDataSourceProvider,
  AzureMapFeature,
  AzureMapLayerProvider,
  AzureMapPopup,
  AzureMapHtmlMarker,
} from "react-azure-maps";
import { AuthenticationType, data } from "azure-maps-control";

let option = {
  authOptions: {
    authType: AuthenticationType.subscriptionKey,
    subscriptionKey: process.env.REACT_APP_AZURE_KEY, // Your subscription key
  },
  zoom: 15,
  view: "Auto",
};
let option2={};

function DefaultMap({coordinates}) {

  console.log("map", coordinates)
  useEffect(() => {
    option.center = [coordinates.longitude, coordinates.latitude];
    option2.position = [coordinates.longitude, coordinates.latitude];
    console.log(option.center);
  }, []);


  return (
    <AzureMapsProvider>
      <div style={{ height: "300px", width: "300px" }}>
        {option.center && <AzureMap options={option} >
          <AzureMapHtmlMarker options = {option2}/>
        </AzureMap>}
      </div>
    </AzureMapsProvider>
  );
}

export default DefaultMap;
