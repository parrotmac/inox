import React, { Component } from "react";
import ReactMapGL, { FullscreenControl, GeolocateControl, Marker, NavigationControl, Popup } from "react-map-gl";
import WebsocketWrapper from "../containers/WebsocketWrapper";
import "./LocationPage.css";

interface ILatLng {
  lat: number
  lng: number
}

interface IViewport {
  width?: number
  height?: number
  latitude: number
  longitude: number
  zoom: number
}

interface IAppState {
  gpsReportedPosition?: ILatLng;
  primaryCellLocation?: ILatLng,
  useDefaultViewport: boolean;
  modemLocationReport: {
    position?: ILatLng,
    cellLocData?: ICellLocData,
  },
  viewport: IViewport;
  deviceName: string
}

interface ITPVReport {
  class: string
  tag: string
  device: string
  mode: object
  time: Date
  ept: number
  lat: number
  lon: number
  alt: number
  epx: number
  epy: number
  epv: number
  track: number
  speed: number
  climb: number
  epd: number
  eps: number
  epc: number
}

interface ISatellite {
  PRN: number
  az: number
  el: number
  ss: number
  used: boolean
}

interface ISKYReport {
  class: string
  tag: string
  device: string
  time: Date
  xdop: number
  ydop: number
  vdop: number
  tdop: number
  hdop: number
  pdop: number
  gdop: number
  satellites: Array<ISatellite>
}

interface IGNSSData {
  location?: ILocation
  satellite_count?: number
  fix_quality?: string
  time?: Date
  speed_kph?: number
}

interface ILocation {
  latitude: number
  longitude: number
}

// tslint:disable-next-line:no-unused
interface ISatelliteFix {
  Location: ILocation
  SatelliteCount: number
  FixQuality: string
}

interface ILol {
  topic: string
  payload: IGNSSData
}

interface ICellLocData {
  cid: string
  lac: string
  mcc: string
  mnc: string
  tac: string
}

const initialViewport: IViewport = {
  latitude: 40.488203,
  longitude: -111.820729,
  zoom: 10,
};

export default class LocationPage extends Component<{}, IAppState> {
  constructor(props: any) {
    super(props);
    this.state = {
      gpsReportedPosition: undefined,
      primaryCellLocation: undefined,
      modemLocationReport: {
        cellLocData: undefined,
        position: {
          lng: 0,
          lat: 0,
        },
      },
      useDefaultViewport: true,
      viewport: initialViewport,
      deviceName: "Unknown",
    };
  }

  private maybeUpdateStatePosition = (data: string): void => {
    const satelliteData = JSON.parse(data) as ISKYReport | ITPVReport;
    switch (satelliteData.class) {
      case "TPV":
        const { lat, lon } = satelliteData as ITPVReport;
        const newPosition: ILatLng = {
          lat,
          lng: lon,
        };
        this.setState({
          gpsReportedPosition: newPosition,
        });
        break;
      case "SKY":
        const { device } = satelliteData as ISKYReport; // Also present in TPV
        this.setState({
          deviceName: device,
        });
        break;
      default:
        const parsedData = JSON.parse(data);
        if (parsedData.topic.startsWith("evt/") && parsedData.topic.endsWith("/cell/location")) {
          // tslint:disable-next-line:no-shadowed-variable
          const { lat, lon } = parsedData.payload;
          // tslint:disable-next-line:no-console
          console.log("cell data location (from lookup)", lat, lon);
          this.setState({
            primaryCellLocation: {
              lat,
              lng: lon,
            },
          });
        } else if (parsedData.topic.startsWith("evt/") && parsedData.topic.endsWith("/cell")) {
          // tslint:disable-next-line:no-console
          console.log("cell data", parsedData.payload);
          if (parsedData.payload.location !== null) {
            const cellData = parsedData.payload.location as ICellLocData;
            this.setState({
              modemLocationReport: {
                cellLocData: cellData,
              },
            });
          }
        } else if (
          parsedData.topic.startsWith("evt/") &&
          parsedData.topic.endsWith("/cell/cell-location")
        ) {
          // tslint:disable-next-line:no-shadowed-variable
          const { lon, lat } = JSON.parse(data).payload;
          // tslint:disable-next-line:no-console
          console.warn("cell-location", lat, lon, data);
          this.setState({
            modemLocationReport: {
              position: {
                lat,
                lng: lon,
              },
            },
          });
        } else {
          // tslint:disable-next-line:no-console
          console.warn("unrecognized data", satelliteData);

          // Experimental
          const gpsdData = JSON.parse(data) as ILol;
          // tslint:disable-next-line:no-console
          console.log(gpsdData.payload);
          const { location } = gpsdData.payload;
          if (location && location.latitude && location.longitude) {
            const newLocation: ILatLng = {
              lat: location.latitude,
              lng: location.longitude,
            };
            this.setState({
              gpsReportedPosition: newLocation,
            });
          }
        }
    }
  };

  private onViewportUpdated = (viewport: IViewport): void => {
    this.setState({
      useDefaultViewport: false,
      viewport,
    });
  };

  public render(): JSX.Element {
    // tslint:disable-next-line:no-console
    console.log(this.state.gpsReportedPosition);
    const {
      gpsReportedPosition,
      primaryCellLocation,
      // useDefaultViewport,
      deviceName,
      modemLocationReport,
      viewport,
    } = this.state;

    const markers: Array<{position: ILatLng, text: string}> = [];

    if (primaryCellLocation) {
      markers.push({
        position: primaryCellLocation,
        text: "Primary Cell Tower",
      });
    }

    if (gpsReportedPosition) {
      markers.push(      {
        position: gpsReportedPosition,
        text: deviceName,
      });
    }

    if (modemLocationReport.position) {
      markers.push({
        position: modemLocationReport.position,
        text: "Modem-reported location",
      });
    }

    return (
      <>
        <div className={"map-wrapper"}>
          <ReactMapGL
            height={"100%"}
            width={"100%"}
            latitude={viewport.latitude}
            longitude={viewport.longitude}
            zoom={viewport.zoom}
            mapStyle={"mapbox://styles/mapbox/dark-v10"}
            mapboxApiAccessToken={process.env.REACT_APP_MAPBOX_API_TOKEN}
            onViewportChange={(v) => this.setState({
              viewport: v,
            })}
          >
            <div style={{ position: "absolute", right: 0, display: "flex", flexDirection: "column" }}>
              <div className={"mapbox-control mapbox-control-top"}>
                <NavigationControl />
              </div>
              <div className={"mapbox-control"}>
              <FullscreenControl container={document.querySelector("body")}/>
              </div>
              <div className={"mapbox-control"}>
              <GeolocateControl
                positionOptions={{ enableHighAccuracy: true }}
                trackUserLocation={true}
              />
              </div>
            </div>
            <Marker latitude={40.750} longitude={-111.8} offsetLeft={0} offsetTop={0}>
                <img src="http://localhost:3000/jeep.ico" />
            </Marker>
            <Popup
              latitude={40.750}
              longitude={-111.8}
              closeButton={true}
              closeOnClick={false}
              onClose={() => console.log("close")}
              anchor="bottom-left" >
              <div>Jerp</div>
            </Popup>
          </ReactMapGL>
        </div>
        <WebsocketWrapper
          url={process.env.NODE_ENV === "production" ? `wss://${window.location.host}` : "ws://localhost:4000"}
          reconnect={true}
          onMessage={this.maybeUpdateStatePosition}
        />
      </>
    );
  }
}
