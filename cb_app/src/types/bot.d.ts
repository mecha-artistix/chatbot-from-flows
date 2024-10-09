// export interface IBotData {
//   data: { data: { [key: string]: any } };
//   status: string;
// }

export interface IBotData {
  _id: string;
  user: string;
  name: string;
  model: string;
  identity: string;
  instrunctions: string;
  endPoint: string;
  promptText: string;
  source: null | string;
  createdAt: string;
}
