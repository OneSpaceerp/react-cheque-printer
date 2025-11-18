import React, { useRef } from 'react';
import { useLocalization } from '../hooks/useLocalization';
import { Bank, Field } from '../types';

interface ControlsPanelProps {
  banks: Bank[];
  selectedBank: Bank | undefined;
  setSelectedBankId: (id: string) => void;
  selectedTemplateId: string | undefined;
  setSelectedTemplateId: (id: string) => void;
  fields: Field[];
  updateField: (id: string, value: Partial<Field>) => void;
  handlePrint: () => void;
  resetCurrentLayout: () => void;
  printOffset: { x: number, y: number };
  setPrintOffset: (offset: { x: number, y: number }) => void;
  selectedFieldId: string | null;
  setSelectedFieldId: (id: string | null) => void;
  previewMode: boolean;
  setPreviewMode: (mode: boolean) => void;
  onExportTemplate: () => void;
  onImportTemplate: (data: string) => void;
}

const LanguageSwitcher: React.FC = () => {
    const { language, setLanguage } = useLocalization();

    const toggleLanguage = () => {
        const newLang = language === 'en' ? 'ar' : 'en';
        setLanguage(newLang);
    };

    return (
        <button
            onClick={toggleLanguage}
            className="px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 transition-colors text-sm"
        >
            {language === 'en' ? 'العربية' : 'English'}
        </button>
    );
};

export const ControlsPanel: React.FC<ControlsPanelProps> = ({
  banks,
  selectedBank,
  setSelectedBankId,
  selectedTemplateId,
  setSelectedTemplateId,
  fields,
  updateField,
  handlePrint,
  resetCurrentLayout,
  printOffset,
  setPrintOffset,
  selectedFieldId,
  setSelectedFieldId,
  previewMode,
  setPreviewMode,
  onExportTemplate,
  onImportTemplate,
}) => {
  const { t, language } = useLocalization();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const getFieldValue = (id: string) => fields.find(f => f.id === id)?.value || '';
  const selectedField = fields.find(f => f.id === selectedFieldId);

  const handleInputChange = (id: string, value: string) => {
    updateField(id, { value });
  };

  const handleExport = () => {
    onExportTemplate();
  };

  const handleImport = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        try {
          const content = event.target?.result as string;
          onImportTemplate(content);
        } catch (error) {
          alert(language === 'en' ? 'Failed to import template. Invalid file format.' : 'فشل استيراد القالب. تنسيق الملف غير صالح.');
        }
      };
      reader.readAsText(file);
    }
    // Reset input
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const isRTL = language === 'ar';

  return (
    <div className={`w-full lg:w-1/3 xl:w-1/4 bg-gray-50 dark:bg-gray-800 p-6 overflow-y-auto h-screen no-print ${isRTL ? 'rtl' : 'ltr'}`}>
      <div className={`flex ${isRTL ? 'flex-row-reverse' : 'flex-row'} justify-between items-center mb-6`}>
        <h1 className={`text-2xl font-bold text-gray-800 dark:text-white ${isRTL ? 'text-right' : 'text-left'}`}>
          {t('appTitle')}
        </h1>
        <LanguageSwitcher />
      </div>

      <div className="space-y-6">
        {/* Bank Selection */}
        <div>
          <label htmlFor="bank-select" className={`block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 ${isRTL ? 'text-right' : 'text-left'}`}>
            {t('selectBank')}
          </label>
          <select
            id="bank-select"
            value={selectedBank?.id || ''}
            onChange={(e) => setSelectedBankId(e.target.value)}
            className="w-full pl-3 pr-10 py-2 text-base border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
          >
            <option value="" disabled>-- {t('selectBank')} --</option>
            {banks.map(bank => <option key={bank.id} value={bank.id}>{bank.name}</option>)}
          </select>
        </div>

        {/* Template Selection */}
        {selectedBank && (
          <div>
            <label htmlFor="template-select" className={`block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 ${isRTL ? 'text-right' : 'text-left'}`}>
              {t('selectTemplate')}
            </label>
            <select
              id="template-select"
              value={selectedTemplateId || ''}
              onChange={(e) => setSelectedTemplateId(e.target.value)}
              className="w-full pl-3 pr-10 py-2 text-base border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
            >
              <option value="" disabled>-- {t('selectTemplate')} --</option>
              {selectedBank.templates.map(template => <option key={template.id} value={template.id}>{template.name}</option>)}
            </select>
          </div>
        )}

        {/* Preview Mode Toggle */}
        {selectedTemplateId && (
          <div className="flex items-center space-x-2">
            <input
              type="checkbox"
              id="preview-mode"
              checked={previewMode}
              onChange={(e) => setPreviewMode(e.target.checked)}
              className="w-4 h-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
            />
            <label htmlFor="preview-mode" className="text-sm font-medium text-gray-700 dark:text-gray-300">
              {t('previewMode')}
            </label>
          </div>
        )}

        {/* Cheque Information */}
        {selectedTemplateId && (
          <div className="space-y-4 p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
            <h2 className={`text-lg font-semibold text-gray-900 dark:text-white ${isRTL ? 'text-right' : 'text-left'}`}>
              {t('chequeInfo')}
            </h2>
            
            {/* Payee Name */}
            <div>
              <label htmlFor="payee" className={`block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 ${isRTL ? 'text-right' : 'text-left'}`}>
                {t('payeeName')}
              </label>
              <input 
                type="text" 
                id="payee" 
                value={getFieldValue('payee')} 
                onChange={e => handleInputChange('payee', e.target.value)} 
                className="w-full shadow-sm sm:text-sm border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-md p-2" 
              />
            </div>

            {/* Amount in Digits */}
            <div>
              <label htmlFor="amount-digits" className={`block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 ${isRTL ? 'text-right' : 'text-left'}`}>
                {t('amountDigits')}
              </label>
              <input 
                type="number" 
                id="amount-digits" 
                step="0.01"
                value={getFieldValue('amountDigits')} 
                onChange={e => handleInputChange('amountDigits', e.target.value)} 
                className="w-full shadow-sm sm:text-sm border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-md p-2" 
              />
            </div>

            {/* Amount in Words */}
            <div>
              <label htmlFor="amount-words" className={`block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 ${isRTL ? 'text-right' : 'text-left'}`}>
                {t('amountWords')}
              </label>
              <textarea 
                id="amount-words" 
                value={getFieldValue('amountWords')} 
                readOnly 
                className="w-full shadow-sm sm:text-sm border-gray-300 dark:border-gray-600 dark:bg-gray-900 dark:text-gray-300 rounded-md p-2 h-24 resize-none" 
                dir="rtl"
              />
            </div>

            {/* Date */}
            <div>
              <label htmlFor="date" className={`block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 ${isRTL ? 'text-right' : 'text-left'}`}>
                {t('date')}
              </label>
              <input 
                type="date" 
                id="date" 
                value={getFieldValue('date')} 
                onChange={e => handleInputChange('date', e.target.value)} 
                className="w-full shadow-sm sm:text-sm border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-md p-2" 
              />
            </div>

            {/* Signature */}
            <div>
              <label htmlFor="signature" className={`block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 ${isRTL ? 'text-right' : 'text-left'}`}>
                {t('signature')}
              </label>
              <input 
                type="text" 
                id="signature" 
                value={getFieldValue('signature')} 
                onChange={e => handleInputChange('signature', e.target.value)} 
                className="w-full shadow-sm sm:text-sm border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-md p-2" 
              />
            </div>

            {/* Field Selection */}
            <div>
              <label htmlFor="field-select" className={`block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 ${isRTL ? 'text-right' : 'text-left'}`}>
                {t('selectField')}
              </label>
              <select
                id="field-select"
                value={selectedFieldId || ''}
                onChange={(e) => setSelectedFieldId(e.target.value || null)}
                className="w-full pl-3 pr-10 py-2 text-base border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
              >
                <option value="">-- {t('noFieldSelected')} --</option>
                {fields.map(field => (
                  <option key={field.id} value={field.id}>
                    {field.id} ({field.value.substring(0, 20)}...)
                  </option>
                ))}
              </select>
            </div>

            {/* Field Properties */}
            {selectedField && (
              <div className="mt-4 p-3 bg-blue-50 dark:bg-blue-900 rounded-lg border border-blue-200 dark:border-blue-700">
                <h3 className={`text-sm font-semibold text-gray-900 dark:text-white mb-3 ${isRTL ? 'text-right' : 'text-left'}`}>
                  {t('fieldProperties')}: {selectedField.id}
                </h3>
                
                {/* Font Size */}
                <div className="mb-3">
                  <label htmlFor="font-size" className={`block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1 ${isRTL ? 'text-right' : 'text-left'}`}>
                    {t('fontSize')}
                  </label>
                  <input 
                    type="number" 
                    id="font-size" 
                    min="8"
                    max="72"
                    value={selectedField.fontSize} 
                    onChange={e => updateField(selectedField.id, { fontSize: parseInt(e.target.value) || 16 })} 
                    className="w-full shadow-sm text-sm border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-md p-2" 
                  />
                </div>

                {/* Font Weight */}
                <div className="mb-3">
                  <label htmlFor="font-weight" className={`block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1 ${isRTL ? 'text-right' : 'text-left'}`}>
                    {t('fontWeight')}
                  </label>
                  <select
                    id="font-weight"
                    value={selectedField.fontWeight}
                    onChange={(e) => updateField(selectedField.id, { fontWeight: e.target.value as 'normal' | 'bold' })}
                    className="w-full pl-3 pr-10 py-2 text-sm border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 rounded-md"
                  >
                    <option value="normal">{t('normal')}</option>
                    <option value="bold">{t('bold')}</option>
                  </select>
                </div>

                {/* Text Alignment */}
                <div className="mb-3">
                  <label htmlFor="text-align" className={`block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1 ${isRTL ? 'text-right' : 'text-left'}`}>
                    {t('textAlign')}
                  </label>
                  <select
                    id="text-align"
                    value={selectedField.textAlign}
                    onChange={(e) => updateField(selectedField.id, { textAlign: e.target.value as 'left' | 'center' | 'right' })}
                    className="w-full pl-3 pr-10 py-2 text-sm border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 rounded-md"
                  >
                    <option value="left">{t('left')}</option>
                    <option value="center">{t('center')}</option>
                    <option value="right">{t('right')}</option>
                  </select>
                </div>
              </div>
            )}

            {/* Print Offset */}
            <div className='space-y-3'>
              <div className='mb-2'>
                <p className={`text-xs text-gray-600 dark:text-gray-400 ${isRTL ? 'text-right' : 'text-left'}`}>
                  {language === 'en' 
                    ? 'Note: Offsets are relative to printable area (8mm page margins + 5mm top padding)'
                    : 'ملاحظة: الإزاحة نسبية للمنطقة القابلة للطباعة (حواف الصفحة 8 مم + حشو علوي 5 مم)'}
                </p>
              </div>
              <div className='grid grid-cols-2 gap-2'>
                <div>
                  <label htmlFor="offset-x" className={`block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1 ${isRTL ? 'text-right' : 'text-left'}`}>
                    {t('printOffsetX')}
                  </label>
                  <input 
                    type="number" 
                    id="offset-x" 
                    step="0.1"
                    value={printOffset.x} 
                    onChange={e => setPrintOffset({...printOffset, x: parseFloat(e.target.value) || 0})} 
                    className="w-full shadow-sm text-sm border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-md p-2" 
                  />
                </div>
                <div>
                  <label htmlFor="offset-y" className={`block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1 ${isRTL ? 'text-right' : 'text-left'}`}>
                    {t('printOffsetY')}
                  </label>
                  <input 
                    type="number" 
                    id="offset-y" 
                    step="0.1"
                    value={printOffset.y} 
                    onChange={e => setPrintOffset({...printOffset, y: parseFloat(e.target.value) || 0})} 
                    className="w-full shadow-sm text-sm border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-md p-2" 
                  />
                </div>
              </div>
              
              {/* Fine Adjustment Buttons */}
              <div>
                <label className={`block text-xs font-medium text-gray-700 dark:text-gray-300 mb-2 ${isRTL ? 'text-right' : 'text-left'}`}>
                  {language === 'en' ? 'Fine Adjustment (0.5mm per click)' : 'ضبط دقيق (0.5 مم لكل نقرة)'}
                </label>
                <div className='flex flex-col items-center gap-2'>
                  {/* Move Up Button */}
                  <button
                    type="button"
                    onClick={() => setPrintOffset({...printOffset, y: (printOffset.y || 0) - 0.5})}
                    className="w-full px-3 py-2 text-sm font-medium text-white bg-gray-600 hover:bg-gray-700 rounded-md transition-colors"
                    title={t('moveUp')}
                  >
                    ↑ {t('moveUp')}
                  </button>
                  {/* Left and Right Buttons */}
                  <div className='grid grid-cols-2 gap-2 w-full'>
                    <button
                      type="button"
                      onClick={() => setPrintOffset({...printOffset, x: (printOffset.x || 0) - 0.5})}
                      className="px-3 py-2 text-sm font-medium text-white bg-gray-600 hover:bg-gray-700 rounded-md transition-colors"
                      title={t('moveLeft')}
                    >
                      {isRTL ? '→' : '←'} {t('moveLeft')}
                    </button>
                    <button
                      type="button"
                      onClick={() => setPrintOffset({...printOffset, x: (printOffset.x || 0) + 0.5})}
                      className="px-3 py-2 text-sm font-medium text-white bg-gray-600 hover:bg-gray-700 rounded-md transition-colors"
                      title={t('moveRight')}
                    >
                      {isRTL ? '←' : '→'} {t('moveRight')}
                    </button>
                  </div>
                  {/* Move Down Button */}
                  <button
                    type="button"
                    onClick={() => setPrintOffset({...printOffset, y: (printOffset.y || 0) + 0.5})}
                    className="w-full px-3 py-2 text-sm font-medium text-white bg-gray-600 hover:bg-gray-700 rounded-md transition-colors"
                    title={t('moveDown')}
                  >
                    ↓ {t('moveDown')}
                  </button>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col space-y-2 pt-4">
              <button 
                onClick={handlePrint} 
                className="w-full bg-indigo-600 text-white font-bold py-2 px-4 rounded-md hover:bg-indigo-700 transition-colors"
              >
                {t('printCheque')}
              </button>
              <button 
                onClick={resetCurrentLayout} 
                className="w-full bg-red-600 text-white font-bold py-2 px-4 rounded-md hover:bg-red-700 transition-colors"
              >
                {t('resetLayout')}
              </button>
              <div className="grid grid-cols-2 gap-2">
                <button 
                  onClick={handleExport} 
                  className="bg-green-600 text-white font-bold py-2 px-4 rounded-md hover:bg-green-700 transition-colors text-sm"
                >
                  {t('exportTemplate')}
                </button>
                <button 
                  onClick={handleImport} 
                  className="bg-purple-600 text-white font-bold py-2 px-4 rounded-md hover:bg-purple-700 transition-colors text-sm"
                >
                  {t('importTemplate')}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Hidden file input for import */}
      <input
        ref={fileInputRef}
        type="file"
        accept=".json"
        onChange={handleFileChange}
        className="hidden"
        aria-label={t('importTemplate')}
      />
    </div>
  );
};
