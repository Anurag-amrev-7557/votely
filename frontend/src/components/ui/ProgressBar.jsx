import React from 'react';
import PropTypes from 'prop-types';

const ProgressBar = ({ progress, totalQuestions, currentQuestion }) => (
  <div className="flex flex-col gap-3 p-4">
    <div className="flex items-center gap-2">
      <p className="text-gray-950 dark:text-gray-50 text-base font-medium leading-normal" id="progress-label">Progress</p>
      <span className="px-2 py-0.5 rounded-full text-xs font-bold bg-blue-100 dark:bg-blue-900/40 text-blue-900 dark:text-blue-200" aria-hidden="true">
        {currentQuestion}/{totalQuestions}
      </span>
    </div>
    <p className="text-gray-700 dark:text-gray-300 text-sm font-medium leading-normal" role="progressbar" aria-valuenow={progress} aria-valuemin={0} aria-valuemax={100}>{progress}%</p>
    <div className="rounded bg-gray-200 dark:bg-[#3f4c5a] overflow-hidden" role="progressbar" aria-labelledby="progress-label" aria-valuenow={progress} aria-valuemin={0} aria-valuemax={100}>
      <div
        className="h-2 rounded bg-blue-700 dark:bg-blue-400 transition-all duration-500 ease-out"
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