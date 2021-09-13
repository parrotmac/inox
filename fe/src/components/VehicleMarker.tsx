import React, { Component } from "react";

interface IVehicleMarkerProps {
  latitude: number
  longitude: number
  visible: boolean
  label: string
}

export default class VehicleMarker extends Component<IVehicleMarkerProps> {
  public render(): React.ReactNode {
    return (
      <div>Vehicle Marker</div>
    );
  }
}
