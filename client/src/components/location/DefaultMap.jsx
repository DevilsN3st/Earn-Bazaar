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

function DefaultMap({ coordinates }) {
  let option = {
    authOptions: {
      authType: AuthenticationType.subscriptionKey,
      subscriptionKey: process.env.REACT_APP_AZURE_KEY, // Your subscription key
    },
    center: [coordinates.longitude, coordinates.latitude],
    zoom: 15,
    view: "Auto",
  };
  let option2 = { position: [coordinates.longitude, coordinates.latitude] };

  return (
    <AzureMapsProvider>
      {option.center && (
        <div style={{ height: "300px", width: "300px" }}>
          <AzureMap options={option}>
            <AzureMapHtmlMarker options={option2} />
          </AzureMap>
        </div>
      )}
    </AzureMapsProvider>
  );
}

export default DefaultMap;
