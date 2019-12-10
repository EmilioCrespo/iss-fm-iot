export class Measure {
  temperature: JSON;
  humidity: JSON;
  luminosity: JSON;
  comfort: JSON;
}
export interface RoomMeasure {
  key: string;
  value: Measure;
}
