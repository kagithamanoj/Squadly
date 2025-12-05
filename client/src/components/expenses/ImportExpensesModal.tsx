import React, { useState } from 'react';
import { X, Upload, FileText, CheckCircle, AlertCircle } from 'lucide-react';
import Papa from 'papaparse';
import api from '../../api/axios';

interface ImportExpensesModalProps {
    isOpen: boolean;
    onClose: () => void;
    tripId: string;
    onImportComplete: () => void;
}

const ImportExpensesModal: React.FC<ImportExpensesModalProps> = ({ isOpen, onClose, tripId, onImportComplete }) => {
    const [file, setFile] = useState<File | null>(null);
    const [preview, setPreview] = useState<any[]>([]);
    const [importing, setImporting] = useState(false);
    const [imported, setImported] = useState(false);
    const [error, setError] = useState('');

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const selectedFile = e.target.files?.[0];
        if (!selectedFile) return;

        setFile(selectedFile);
        setError('');

        // Parse CSV
        Papa.parse(selectedFile, {
            header: true,
            complete: (results) => {
                setPreview(results.data.slice(0, 5)); // Show first 5 rows
            },
            error: (err) => {
                setError(`Failed to parse CSV: ${err.message}`);
            }
        });
    };

    const handleImport = async () => {
        if (!file) return;

        setImporting(true);
        setError('');

        try {
            Papa.parse(file, {
                header: true,
                complete: async (results) => {
                    const expenses = results.data
                        .filter((row: any) => row.description && row.amount)
                        .map((row: any) => ({
                            tripId,
                            description: row.description || row.Description,
                            amount: parseFloat(row.amount || row.Amount),
                            date: row.date || row.Date || new Date().toISOString(),
                            category: (row.category || row.Category || 'other').toLowerCase(),
                            importSource: 'csv',
                            importMetadata: {
                                fileName: file.name,
                                importDate: new Date(),
                                originalData: row
                            }
                        }));

                    // Bulk create expenses
                    await Promise.all(
                        expenses.map(expense => api.post('/expenses', expense))
                    );

                    setImported(true);
                    setTimeout(() => {
                        onImportComplete();
                        onClose();
                    }, 2000);
                },
                error: (err) => {
                    setError(`Import failed: ${err.message}`);
                    setImporting(false);
                }
            });
        } catch (err: any) {
            setError(err.response?.data?.message || 'Import failed');
            setImporting(false);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
            <div className="bg-white rounded-2xl w-full max-w-2xl p-6 shadow-xl max-h-[90vh] overflow-y-auto">
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-xl font-bold text-gray-900">Import Expenses from CSV</h2>
                    <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-lg">
                        <X className="w-5 h-5" />
                    </button>
                </div>

                {!imported ? (
                    <>
                        {/* File Upload */}
                        <div className="mb-6">
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Upload CSV File
                            </label>
                            <div className="border-2 border-dashed border-gray-300 rounded-xl p-8 text-center hover:border-blue-400 transition-colors">
                                <Upload className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                                <input
                                    type="file"
                                    accept=".csv"
                                    onChange={handleFileChange}
                                    className="hidden"
                                    id="csv-upload"
                                />
                                <label htmlFor="csv-upload" className="cursor-pointer">
                                    <span className="text-blue-600 hover:text-blue-700 font-medium">
                                        Click to upload
                                    </span>
                                    <span className="text-gray-500"> or drag and drop</span>
                                </label>
                                <p className="text-xs text-gray-500 mt-2">CSV file with columns: description, amount, date, category</p>
                            </div>
                        </div>

                        {/* Preview */}
                        {preview.length > 0 && (
                            <div className="mb-6">
                                <h3 className="font-bold text-gray-900 mb-3 flex items-center gap-2">
                                    <FileText className="w-4 h-4" />
                                    Preview (first 5 rows)
                                </h3>
                                <div className="overflow-x-auto">
                                    <table className="w-full text-sm">
                                        <thead className="bg-gray-50">
                                            <tr>
                                                <th className="px-3 py-2 text-left">Description</th>
                                                <th className="px-3 py-2 text-left">Amount</th>
                                                <th className="px-3 py-2 text-left">Date</th>
                                                <th className="px-3 py-2 text-left">Category</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {preview.map((row, idx) => (
                                                <tr key={idx} className="border-t border-gray-100">
                                                    <td className="px-3 py-2">{row.description || row.Description}</td>
                                                    <td className="px-3 py-2">${row.amount || row.Amount}</td>
                                                    <td className="px-3 py-2">{row.date || row.Date || 'Today'}</td>
                                                    <td className="px-3 py-2">{row.category || row.Category || 'other'}</td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        )}

                        {/* Error */}
                        {error && (
                            <div className="mb-6 p-4 bg-red-50 border border-red-100 rounded-xl flex items-center gap-2 text-red-600">
                                <AlertCircle className="w-5 h-5" />
                                {error}
                            </div>
                        )}

                        {/* Actions */}
                        <div className="flex gap-3">
                            <button
                                onClick={onClose}
                                className="flex-1 px-4 py-2 border border-gray-200 text-gray-700 rounded-xl hover:bg-gray-50 transition-colors"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleImport}
                                disabled={!file || importing}
                                className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {importing ? 'Importing...' : 'Import Expenses'}
                            </button>
                        </div>
                    </>
                ) : (
                    <div className="text-center py-12">
                        <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
                        <h3 className="text-xl font-bold text-gray-900 mb-2">Import Successful!</h3>
                        <p className="text-gray-500">Expenses have been imported to your trip.</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ImportExpensesModal;
