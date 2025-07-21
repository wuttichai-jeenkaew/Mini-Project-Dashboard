import React, { useState, useRef, useEffect } from "react";

interface AutoCompleteDropdownProps {
  value: string;
  onChange: (value: string) => void;
  options: string[];
  placeholder?: string;
  maxLength?: number;
  className?: string;
}

const AutoCompleteDropdown: React.FC<AutoCompleteDropdownProps> = ({
  value,
  onChange,
  options,
  placeholder,
  maxLength = 30,
  className = "",
}) => {
  const [showDropdown, setShowDropdown] = useState(false);
  const [filteredOptions, setFilteredOptions] = useState<string[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (value) {
      setFilteredOptions(
        options.filter(
          (opt) => opt.toLowerCase().includes(value.toLowerCase())
        )
      );
    } else {
      setFilteredOptions(options);
    }
  }, [value, options]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    if (val.length <= maxLength) {
      onChange(val);
      setShowDropdown(true);
    }
  };

  const handleOptionClick = (opt: string) => {
    onChange(opt);
    setShowDropdown(false);
    inputRef.current?.blur();
  };

  const handleBlur = () => {
    setTimeout(() => setShowDropdown(false), 100);
  };

  return (
    <div className={`relative w-full ${className}`}>
      <input
        ref={inputRef}
        type="text"
        value={value}
        onChange={handleInputChange}
        onFocus={() => setShowDropdown(true)}
        onBlur={handleBlur}
        className="w-full bg-white dark:bg-gray-800/80 border border-gray-600/50 rounded-lg px-3 py-2 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 backdrop-blur-sm"
        placeholder={placeholder}
        maxLength={maxLength}
        autoComplete="off"
      />
      {showDropdown && filteredOptions.length > 0 && (
        <ul className="absolute z-10 w-full mt-1 lightmode-bg lightmode-border bg-gray-800 border-gray-700 rounded-lg shadow-lg max-h-48 overflow-auto">
          {filteredOptions.map((opt) => (
            <li
              key={opt}
              className="px-3 py-2 cursor-pointer hover:bg-gray-200 dark:hover:bg-blue-900 text-gray-900 dark:text-white"
              onMouseDown={() => handleOptionClick(opt)}
            >
              {opt}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default AutoCompleteDropdown;
