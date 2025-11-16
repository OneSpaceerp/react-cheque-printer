import { Field, Bank } from '../types';

// Note: Dimensions are based on a typical cheque size of approx. 7in x 3.5in at 150 DPI.
// This results in image dimensions of 1050x525 pixels.
const CHEQUE_WIDTH = 1050;
const CHEQUE_HEIGHT = 525;

const commonFields = {
    payee: { id: 'payee', value: 'Example Payee Name', fontSize: 18, fontWeight: 'bold', textAlign: 'left', isEditable: true, isResizable: true, fontFamily: 'Cairo' },
    amountWords: { id: 'amountWords', value: 'فقط ألفان وثلاثمائة وخمسة وأربعون جنيهاً مصرياً لا غير', fontSize: 16, fontWeight: 'normal', textAlign: 'right', isEditable: false, isResizable: true, fontFamily: 'Cairo' },
    amountDigits: { id: 'amountDigits', value: '2345.00', fontSize: 20, fontWeight: 'bold', textAlign: 'center', isEditable: true, isResizable: true, fontFamily: 'Roboto' },
    date: { id: 'date', value: new Date().toLocaleDateString('en-CA'), fontSize: 18, fontWeight: 'normal', textAlign: 'center', isEditable: true, isResizable: true, fontFamily: 'Roboto' },
    signature: { id: 'signature', value: '', x: 100, y: 350, width: 300, height: 60, fontSize: 16, fontWeight: 'normal', textAlign: 'left', isEditable: false, isResizable: true, fontFamily: 'Cairo' },
} as const;

const createCIBWealthFields = (): Field[] => [
    { ...commonFields.payee, x: 250, y: 180, width: 550, height: 40 },
    { ...commonFields.amountWords, x: 150, y: 240, width: 650, height: 40 },
    { ...commonFields.amountDigits, x: 840, y: 175, width: 170, height: 45 },
    { ...commonFields.date, x: 100, y: 90, width: 180, height: 40 },
    { ...commonFields.signature },
];

const createCIBDateBoxFields = (): Field[] => [
    { ...commonFields.payee, x: 100, y: 140, width: 650, height: 40 },
    { ...commonFields.amountWords, x: 100, y: 195, width: 700, height: 40 },
    { ...commonFields.amountDigits, x: 800, y: 235, width: 200, height: 50 },
    { ...commonFields.date, x: 800, y: 50, width: 200, height: 40 },
    { ...commonFields.signature },
];

const createCIBStandardFields = (): Field[] => [
    { ...commonFields.payee, x: 300, y: 180, width: 500, height: 40 },
    { ...commonFields.amountWords, x: 150, y: 240, width: 650, height: 40 },
    { ...commonFields.amountDigits, x: 840, y: 175, width: 170, height: 45 },
    { ...commonFields.date, x: 100, y: 90, width: 180, height: 40 },
    { ...commonFields.signature },
];

const createBanqueMisrFields = (): Field[] => [
    { ...commonFields.payee, x: 200, y: 150, width: 600, height: 40 },
    { ...commonFields.amountWords, x: 150, y: 200, width: 650, height: 40 },
    { ...commonFields.amountDigits, x: 800, y: 235, width: 200, height: 50 },
    { ...commonFields.date, x: 800, y: 50, width: 200, height: 40 },
    { ...commonFields.signature },
];

const createADIBFields = (): Field[] => [
    { ...commonFields.payee, x: 200, y: 140, width: 600, height: 40 },
    { ...commonFields.amountWords, x: 150, y: 195, width: 650, height: 40 },
    { ...commonFields.amountDigits, x: 800, y: 240, width: 200, height: 50 },
    { ...commonFields.date, x: 800, y: 50, width: 200, height: 40 },
    { ...commonFields.signature, x: 450, y: 280, width: 300, height: 60, textAlign: 'center' },
];


export const banks: Bank[] = [
  {
    id: 'cib',
    name: 'CIB',
    templates: [
      {
        id: 'cib-01',
        name: 'Wealth',
        imageUrl: '/cheques/CIB01.png',
        width: CHEQUE_WIDTH,
        height: CHEQUE_HEIGHT,
        fields: createCIBWealthFields(),
      },
      {
        id: 'cib-02',
        name: 'Standard (Date Box)',
        imageUrl: '/cheques/CIB02.png',
        width: CHEQUE_WIDTH,
        height: CHEQUE_HEIGHT,
        fields: createCIBDateBoxFields(),
      },
      {
        id: 'cib-03',
        name: 'Standard 1',
        imageUrl: '/cheques/CIB03.png',
        width: CHEQUE_WIDTH,
        height: CHEQUE_HEIGHT,
        fields: createCIBStandardFields(),
      },
      {
        id: 'cib-04',
        name: 'Standard 2',
        imageUrl: '/cheques/CIB04.png',
        width: CHEQUE_WIDTH,
        height: CHEQUE_HEIGHT,
        fields: createCIBStandardFields(),
      },
      {
        id: 'cib-05',
        name: 'Standard 3',
        imageUrl: '/cheques/CIB05.png',
        width: CHEQUE_WIDTH,
        height: CHEQUE_HEIGHT,
        fields: createCIBStandardFields(),
      },
      {
        id: 'cib-06',
        name: 'Growth',
        imageUrl: '/cheques/CIB06.png',
        width: CHEQUE_WIDTH,
        height: CHEQUE_HEIGHT,
        fields: createCIBStandardFields(),
      }
    ],
  },
  {
    id: 'banque-misr',
    name: 'Banque Misr',
    templates: [
      {
        id: 'bm-01',
        name: 'Standard Template',
        imageUrl: '/cheques/Banqe_Misr.png',
        width: CHEQUE_WIDTH,
        height: CHEQUE_HEIGHT,
        fields: createBanqueMisrFields(),
      },
    ],
  },
  {
    id: 'adib',
    name: 'ADIB',
    templates: [
      {
        id: 'adib-01',
        name: 'Standard Template',
        imageUrl: '/cheques/ADIB01.png',
        width: CHEQUE_WIDTH,
        height: CHEQUE_HEIGHT,
        fields: createADIBFields(),
      },
    ],
  },
];