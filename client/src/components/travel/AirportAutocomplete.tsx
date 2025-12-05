import React, { useState, useEffect, useRef } from 'react';
import { Plane, MapPin } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { US_AIRPORTS, Airport } from '../../data/airports';

interface AirportAutocompleteProps {
    value: string;
    onChange: (value: string) => void;
    placeholder?: string;
    label: string;
    icon?: React.ElementType;
    required?: boolean;
}

const AirportAutocomplete: React.FC<AirportAutocompleteProps> = ({
    value,
    onChange,
    placeholder = "Search city or airport...",
    label,
    icon: Icon = Plane,
    required = false
}) => {
    const [isOpen, setIsOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState(value);
    const [suggestions, setSuggestions] = useState<Airport[]>([]);
    const wrapperRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        setSearchTerm(value);
    }, [value]);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
        const term = e.target.value;
        setSearchTerm(term);
        onChange(term);

        if (term.length > 1) {
            const lowerTerm = term.toLowerCase();
            const filtered = US_AIRPORTS.filter(airport =>
                airport.code.toLowerCase().includes(lowerTerm) ||
                airport.city.toLowerCase().includes(lowerTerm) ||
                airport.name.toLowerCase().includes(lowerTerm) ||
                airport.state.toLowerCase().includes(lowerTerm)
            ).slice(0, 8); // Limit to 8 suggestions
            setSuggestions(filtered);
            setIsOpen(true);
        } else {
            setSuggestions([]);
            setIsOpen(false);
        }
    };

    const handleSelect = (airport: Airport) => {
        const newValue = `${airport.city} (${airport.code})`;
        setSearchTerm(newValue);
        onChange(newValue);
        setIsOpen(false);
    };

    return (
        <div className="relative" ref={wrapperRef}>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">
                {label} {required && <span className="text-red-500">*</span>}
            </label>
            <div className="relative group">
                <Icon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 group-focus-within:text-primary-500 transition-colors" />
                <input
                    type="text"
                    value={searchTerm}
                    onChange={handleSearch}
                    onFocus={() => searchTerm.length > 1 && setIsOpen(true)}
                    className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-gray-200 bg-gray-50/50 focus:bg-white focus:ring-2 focus:ring-primary-100 focus:border-primary-500 outline-none transition-all"
                    placeholder={placeholder}
                    required={required}
                />
            </div>

            <AnimatePresence>
                {isOpen && suggestions.length > 0 && (
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 10 }}
                        className="absolute z-50 w-full mt-2 bg-white rounded-xl shadow-xl border border-gray-100 overflow-hidden max-h-60 overflow-y-auto"
                    >
                        {suggestions.map((airport) => (
                            <button
                                key={airport.code}
                                onClick={() => handleSelect(airport)}
                                className="w-full px-4 py-3 text-left hover:bg-gray-50 transition-colors flex items-center justify-between group border-b border-gray-50 last:border-0"
                            >
                                <div>
                                    <div className="font-medium text-gray-900 flex items-center gap-2">
                                        {airport.city}, {airport.state}
                                        <span className="text-xs font-bold bg-primary-50 text-primary-700 px-1.5 py-0.5 rounded border border-primary-100">
                                            {airport.code}
                                        </span>
                                    </div>
                                    <div className="text-xs text-gray-500 truncate max-w-[250px]">
                                        {airport.name}
                                    </div>
                                </div>
                                <MapPin className="w-4 h-4 text-gray-300 group-hover:text-primary-500" />
                            </button>
                        ))}
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default AirportAutocomplete;
