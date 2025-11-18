import React, { useState, useEffect, useCallback } from 'react';
import { ControlsPanel } from './components/ControlsPanel';
import { ChequeEditor } from './components/ChequeEditor';
import { banks as defaultBanksData } from './data/templates';
import { Bank, ChequeTemplate, Field } from './types';
import { amountToWords } from './services/amountToWords';

const App: React.FC = () => {
  const [banksData, setBanksData] = useState<Bank[]>([]);
  const [selectedBankId, setSelectedBankId] = useState<string | undefined>();
  const [selectedTemplateId, setSelectedTemplateId] = useState<string | undefined>();
  const [selectedFieldId, setSelectedFieldId] = useState<string | null>(null);
  const [previewMode, setPreviewMode] = useState(false);
  const [printOffset, setPrintOffset] = useState({ x: 0, y: 0 });
  const [isPrinting, setIsPrinting] = useState(false);

  useEffect(() => {
    // Load data from localStorage or use defaults
    const savedData = localStorage.getItem('chequeTemplates');
    if (savedData) {
      try {
        setBanksData(JSON.parse(savedData));
      } catch (e) {
        console.error('Failed to load saved templates:', e);
        setBanksData(defaultBanksData);
      }
    } else {
      setBanksData(defaultBanksData);
    }

    const savedOffset = localStorage.getItem('printOffset');
    if(savedOffset) {
      try {
        setPrintOffset(JSON.parse(savedOffset));
      } catch (e) {
        console.error('Failed to load print offset:', e);
      }
    }
  }, []);

  useEffect(() => {
    // Save data to localStorage whenever it changes
    if (banksData.length > 0) {
      localStorage.setItem('chequeTemplates', JSON.stringify(banksData));
    }
  }, [banksData]);
  
  useEffect(() => {
    localStorage.setItem('printOffset', JSON.stringify(printOffset));
  }, [printOffset]);

  useEffect(() => {
    const handleAfterPrint = () => {
      document.body.classList.remove('is-printing');
      setIsPrinting(false);
      // Remove print offset styles after printing
      const printArea = document.querySelector('.print-area');
      const chequeContainer = printArea?.querySelector('> div') as HTMLElement;
      if (chequeContainer) {
        chequeContainer.style.removeProperty('top');
        chequeContainer.style.removeProperty('left');
      }
      if (printArea) {
        (printArea as HTMLElement).style.removeProperty('margin-top');
        (printArea as HTMLElement).style.removeProperty('margin-left');
      }
    };

    if (isPrinting) {
      document.body.classList.add('is-printing');
      
      // Apply print offset directly to cheque container for precise positioning
      // Match reference site exactly: offsets applied to cheque container from page edges
      const printArea = document.querySelector('.print-area') as HTMLElement;
      const chequeContainer = printArea?.querySelector('> div') as HTMLElement;
      if (chequeContainer && printArea) {
        const mmToPx = (mm: number) => mm * 3.7795275591;
        
        // Apply offsets directly from page edge (top and left)
        // This matches reference site's exact positioning approach
        // Offsets are in mm and applied as pixels
        chequeContainer.style.setProperty('top', `${mmToPx(printOffset.y)}px`, 'important');
        chequeContainer.style.setProperty('left', `${mmToPx(printOffset.x)}px`, 'important');
      }
      // Reset print-area margins to ensure proper positioning
      if (printArea) {
        printArea.style.setProperty('margin-top', '0', 'important');
        printArea.style.setProperty('margin-left', '0', 'important');
        printArea.style.setProperty('margin-right', '0', 'important');
        printArea.style.setProperty('margin-bottom', '0', 'important');
      }
      
      window.addEventListener('afterprint', handleAfterPrint);
      // Timeout to allow styles to apply before print dialog opens
      const timer = setTimeout(() => {
        window.print();
      }, 200);

      return () => {
        window.removeEventListener('afterprint', handleAfterPrint);
        clearTimeout(timer);
        // Ensure class is removed if component unmounts while printing
        document.body.classList.remove('is-printing');
      };
    }
  }, [isPrinting, printOffset]);

  const selectedBank = banksData.find(b => b.id === selectedBankId);
  const selectedTemplate = selectedBank?.templates.find(t => t.id === selectedTemplateId);

  const handleSetSelectedBankId = (id: string) => {
    setSelectedBankId(id);
    setSelectedTemplateId(undefined); // Reset template selection
    setSelectedFieldId(null); // Reset field selection
  };

  const updateField = useCallback((id: string, value: Partial<Field>) => {
    setBanksData(prevData => {
      const newBanksData = [...prevData];
      const bankIndex = newBanksData.findIndex(b => b.id === selectedBankId);
      if (bankIndex === -1) return prevData;

      const templateIndex = newBanksData[bankIndex].templates.findIndex(t => t.id === selectedTemplateId);
      if (templateIndex === -1) return prevData;
      
      const fieldIndex = newBanksData[bankIndex].templates[templateIndex].fields.findIndex(f => f.id === id);
      if (fieldIndex === -1) return prevData;

      const updatedField = { ...newBanksData[bankIndex].templates[templateIndex].fields[fieldIndex], ...value };
      newBanksData[bankIndex].templates[templateIndex].fields[fieldIndex] = updatedField;

      // Auto-update amount in words if amount in digits changes
      if (id === 'amountDigits') {
        const amountWordsFieldIdx = newBanksData[bankIndex].templates[templateIndex].fields.findIndex(f => f.id === 'amountWords');
        if (amountWordsFieldIdx !== -1) {
          const amountValue = updatedField.value;
          if (amountValue) {
            const numericAmount = parseFloat(amountValue);
            if (!isNaN(numericAmount)) {
              const newAmountWords = amountToWords(numericAmount);
              newBanksData[bankIndex].templates[templateIndex].fields[amountWordsFieldIdx].value = newAmountWords;
            }
          }
        }
      }

      return newBanksData;
    });
  }, [selectedBankId, selectedTemplateId]);

  const resetCurrentLayout = () => {
     if (!selectedBankId || !selectedTemplateId) return;

      const defaultBank = defaultBanksData.find(b => b.id === selectedBankId);
      const defaultTemplate = defaultBank?.templates.find(t => t.id === selectedTemplateId);

      if (!defaultTemplate) return;

      setBanksData(prevData => {
        const newBanksData = JSON.parse(JSON.stringify(prevData));
        const bankIndex = newBanksData.findIndex((b: Bank) => b.id === selectedBankId);
        if (bankIndex === -1) return prevData;

        const templateIndex = newBanksData[bankIndex].templates.findIndex((t: ChequeTemplate) => t.id === selectedTemplateId);
        if (templateIndex === -1) return prevData;
        
        newBanksData[bankIndex].templates[templateIndex].fields = JSON.parse(JSON.stringify(defaultTemplate.fields));
        return newBanksData;
      });
      setSelectedFieldId(null);
  };

  const handlePrint = () => {
    setIsPrinting(true);
  };

  const handleExportTemplate = () => {
    if (!selectedBankId || !selectedTemplateId || !selectedTemplate) return;

    const exportData = {
      bankId: selectedBankId,
      templateId: selectedTemplateId,
      template: selectedTemplate,
      exportDate: new Date().toISOString(),
    };

    const dataStr = JSON.stringify(exportData, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `cheque-template-${selectedBankId}-${selectedTemplateId}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const handleImportTemplate = (content: string) => {
    try {
      const importData = JSON.parse(content);
      
      if (!importData.template || !importData.bankId || !importData.templateId) {
        throw new Error('Invalid template format');
      }

      setBanksData(prevData => {
        const newBanksData = JSON.parse(JSON.stringify(prevData));
        const bankIndex = newBanksData.findIndex((b: Bank) => b.id === importData.bankId);
        
        if (bankIndex === -1) {
          // Bank doesn't exist, add it
          newBanksData.push({
            id: importData.bankId,
            name: importData.bankId,
            templates: [importData.template],
          });
        } else {
          // Bank exists, update or add template
          const templateIndex = newBanksData[bankIndex].templates.findIndex(
            (t: ChequeTemplate) => t.id === importData.templateId
          );
          
          if (templateIndex === -1) {
            // Template doesn't exist, add it
            newBanksData[bankIndex].templates.push(importData.template);
          } else {
            // Template exists, update it
            newBanksData[bankIndex].templates[templateIndex] = importData.template;
          }
        }

        return newBanksData;
      });

      // Select the imported template
      setSelectedBankId(importData.bankId);
      setSelectedTemplateId(importData.templateId);
      setSelectedFieldId(null);
    } catch (error) {
      console.error('Failed to import template:', error);
      alert('Failed to import template. Please check the file format.');
    }
  };

  return (
    <div className="flex flex-col lg:flex-row h-screen font-sans bg-white dark:bg-gray-900">
      <ControlsPanel
        banks={banksData}
        selectedBank={selectedBank}
        setSelectedBankId={handleSetSelectedBankId}
        selectedTemplateId={selectedTemplateId}
        setSelectedTemplateId={setSelectedTemplateId}
        fields={selectedTemplate?.fields || []}
        updateField={updateField}
        handlePrint={handlePrint}
        resetCurrentLayout={resetCurrentLayout}
        printOffset={printOffset}
        setPrintOffset={setPrintOffset}
        selectedFieldId={selectedFieldId}
        setSelectedFieldId={setSelectedFieldId}
        previewMode={previewMode}
        setPreviewMode={setPreviewMode}
        onExportTemplate={handleExportTemplate}
        onImportTemplate={handleImportTemplate}
      />
      <ChequeEditor 
        template={selectedTemplate || null} 
        updateField={updateField}
        printOffset={printOffset}
        selectedFieldId={selectedFieldId}
        onFieldSelect={setSelectedFieldId}
        previewMode={previewMode}
      />
    </div>
  );
};

export default App;
