import React from 'react';
import PropTypes from 'prop-types';

const ProgressBar = ({ progress, totalQuestions, currentQuestion }) => (
  <div className="flex flex-col gap-3 p-4" role="progressbar" aria-valuenow={progress} aria-valuemin={0} aria-valuemax={100}>
    <div className="flex gap-6 justify-between items-center">
      <div className="flex items-center gap-2">
        <p className="text-gray-900 dark:text-white text-base font-medium leading-normal">Progress</p>
        <span className="px-2 py-0.5 rounded-full text-xs font-medium bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-400">
          {currentQuestion}/{totalQuestions}
        </span>
      </div>
      <p className="text-gray-600 dark:text-[#a0acbb] text-sm font-normal leading-normal">{progress}%</p>
    </div>
    <div className="rounded bg-gray-200 dark:bg-[#3f4c5a] overflow-hidden">
      <div 
        className="h-2 rounded bg-blue-600 dark:bg-[#c7d7e9] transition-all duration-500 ease-out"
        style={{ width: `${progress}%` }}
      />
    </div>
  </div>
);

ProgressBar.propTypes = {
  progress: PropTypes.number.isRequired,
  totalQuestions: PropTypes.number.isRequired,
  currentQuestion: PropTypes.number.isRequired,
};

export default ProgressBar; 