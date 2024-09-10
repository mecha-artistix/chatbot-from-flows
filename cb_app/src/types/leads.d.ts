export interface ILeadsStore {
  leadsCollection: any[];
  status: '' | 'loading' | 'failed' | 'success';
  leadStatus:
    | 'Successful'
    | 'Unsuccessful'
    | 'Call Later'
    | 'Do Not Call'
    | 'Not Interested'
    | 'No Pitch No Price'
    | 'Answering machine'
    | 'Hang up';
  //   leadStatus:['Successful,'Unsuccessful','Call Later','Do Not Call','Not Interested','No Pitch No Price','Answering machine','Hang up'];
  error?: string;
  addFlowcharts: () => Promise<void>;
  deleteFlowchart: (id: string) => Promise<void>;
  addLead: (lead: any) => void;
}
