import React from 'react';
import PropTypes from 'prop-types';

const RadioOption = React.forwardRef(({ option, isSelected, onSelect, index }, ref) => (
  <div
    ref={ref}
    role="radio"
    aria-checked={isSelected}
    tabIndex={0}
    onClick={() => onSelect(option.id)}
    onKeyDown={(e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        onSelect(option.id);
      }
    }}
    className={`group relative flex items-start p-4 sm:p-6 rounded-xl border cursor-pointer transition-all duration-300 w-full ${
      isSelected 
        ? 'border-blue-600 dark:border-[#c7d7e9] bg-blue-50 dark:bg-[#1a2634] shadow-lg scale-[1.02]' 
        : 'border-gray-200 dark:border-[#3f4c5a] hover:border-blue-400 dark:hover:border-[#8ba3c7] hover:shadow-md'
    }`}
  >
    <div className="min-w-0 flex-1 w-full">
      <div className="flex items-start gap-4 sm:gap-6 w-full">
        {option.image && (
          <div className="relative flex-shrink-0">
            <div className={`w-16 h-16 sm:w-20 sm:h-20 rounded-full overflow-hidden transition-all duration-300 ${
              isSelected 
                ? 'ring-2 ring-blue-400 dark:ring-[#c7d7e9]' 
                : 'ring-1 ring-gray-200 dark:ring-[#3f4c5a] group-hover:ring-blue-300 dark:group-hover:ring-[#8ba3c7]'
            }`}>
              <img 
                src={option.image} 
                alt={option.text}
                className="w-full h-full object-cover"
              />
            </div>
            {isSelected && (
              <div className="absolute -bottom-1 -right-1 bg-blue-600 dark:bg-[#c7d7e9] rounded-full p-1.5 animate-scale-in">
                <svg className="w-3 h-3 sm:w-4 sm:h-4 text-white dark:text-[#15191e]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
            )}
          </div>
        )}
        <div className="flex-1 min-w-0 w-full">
          <div className="flex items-center justify-between gap-3 sm:gap-4 w-full">
            <h3 className={`text-base sm:text-lg font-semibold ${
              isSelected 
                ? 'text-blue-900 dark:text-[#c7d7e9]' 
                : 'text-gray-900 dark:text-white'
            }`}>
              {option.text}
            </h3>
            <div className={`h-5 w-5 sm:h-6 sm:w-6 rounded-full border-2 flex items-center justify-center transition-all duration-300 ${
              isSelected 
                ? 'border-blue-600 dark:border-[#c7d7e9] bg-blue-600 dark:bg-[#c7d7e9]' 
                : 'border-gray-300 dark:border-[#3f4c5a] group-hover:border-blue-400 dark:group-hover:border-[#8ba3c7]'
            }`}>
              {isSelected && (
                <div className="h-2.5 w-2.5 sm:h-3 sm:w-3 rounded-full bg-white dark:bg-[#15191e] animate-scale-in" />
              )}
            </div>
          </div>
          {option.description && (
            <p className={`mt-1 text-xs sm:text-sm ${
              isSelected 
                ? 'text-blue-700 dark:text-[#8ba3c7]' 
                : 'text-gray-500 dark:text-gray-400'
            }`}>
              {option.description}
            </p>
          )}
          {option.party && (
            <div className={`mt-2 sm:mt-3 inline-flex items-center px-2.5 sm:px-3 py-0.5 sm:py-1 rounded-full text-xs font-medium ${
              isSelected
                ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-200'
                : 'bg-gray-100 dark:bg-[#2c353f] text-gray-600 dark:text-gray-300'
            }`}>
              {option.party}
            </div>
          )}
        </div>
      </div>
    </div>
  </div>
));

RadioOption.propTypes = {
  option: PropTypes.shape({
    id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    text: PropTypes.string.isRequired,
    image: PropTypes.string,
    description: PropTypes.string,
    party: PropTypes.string,
  }).isRequired,
  isSelected: PropTypes.bool.isRequired,
  onSelect: PropTypes.func.isRequired,
  index: PropTypes.number,
};

RadioOption.displayName = 'RadioOption';

export default RadioOption; 