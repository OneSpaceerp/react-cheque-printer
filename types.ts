
export interface Field {
  id: string;
  value: string;
  x: number;
  y: number;
  width: number;
  height: number;
  fontSize: number;
  fontWeight: 'normal' | 'bold';
  textAlign: 'left' | 'center' | 'right';
  isEditable: boolean;
  isResizable: boolean;
  fontFamily: string;
}

export interface ChequeTemplate {
  id: string;
  name: string;
  imageUrl: string;
  width: number; // in pixels
  height: number; // in pixels
  fields: Field[];
}

export interface Bank {
  id: string;
  name: string;
  templates: ChequeTemplate[];
}
