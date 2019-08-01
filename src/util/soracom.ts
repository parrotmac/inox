const fetch = require("node-fetch");

export interface ISoracomAuth {
  apiKey: string;
  operatorId: string;
  token: string;
}

export enum SessionEventType {
  CREATED = "Created",
  MODIFIED = "Modified",
  DELETED = "Deleted",
}

export interface ISoracomSession {
  imsi: string;
  "time": number;
  createdTime: Date;
  operatorId: string;
  event: SessionEventType;
  ueIpAddress: string;
  imei: string;
  apn: string;
  dns0: string;
  dns1: string;
  cell: {
    radioType: string,
    mcc: number,
    mnc: number,
    tac: number,
    eci: number,
  };
}

export default class Soracom {
  apiBaseUrl: string;
  authKeys: ISoracomAuth;
  constructor(auth: ISoracomAuth, apiBaseUrl = "https://g.api.soracom.io/v1") {
    this.apiBaseUrl = apiBaseUrl;
    this.authKeys = auth;
  }


  private makeFetch = (targetUrl: string): Promise<Response> => {
    return fetch(`${this.apiBaseUrl}${targetUrl}`, {
      headers: {
        "X-Soracom-API-Key": this.authKeys.apiKey,
        "X-Soracom-Token": this.authKeys.token,
      }
    });
  };

  public listSessionEvents = (imsi: string): Promise<Array<ISoracomSession>> => {
    const listSessionEventsEndpoint = `/subscribers/${imsi}/events/sessions`;
    return new Promise((resolve, reject) => {
      if (imsi === "") {
        // FIXME
        reject("no imsi available -- this is a FIXME");
      }
      this.makeFetch(listSessionEventsEndpoint).then(
        res => {
          res.json().then(
            resData => {
              resolve(resData);
            }
          ).catch(reject);
        }
      ).catch(reject);
    });
  };

  public getCellLocations = (mcc: number, mnc: number, tac: number, ecid: number): Promise<any> => {
    const getCellLocationsEndpoint = `/cell_locations?mcc=${mcc}&mnc=${mnc}&tac=${tac}&ecid=${ecid}`;
    return new Promise(((resolve, reject) => {
      this.makeFetch(getCellLocationsEndpoint).then(
        res => {
          res.json().then(
            resData => resolve(resData)
          ).catch(reject);
        }
      ).catch(reject);
    }));
  };

}
