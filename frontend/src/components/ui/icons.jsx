import React from 'react';

// Enhanced: All icons accept props for size, color, className, and aria-label for accessibility

const defaultSize = 24;

export const MagnifyingGlass = ({
  size = defaultSize,
  color = "currentColor",
  className = "",
  "aria-label": ariaLabel = "Magnifying glass icon",
  ...props
}) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    strokeWidth={1.5}
    stroke={color}
    width={size}
    height={size}
    className={`w-6 h-6 ${className}`}
    aria-label={ariaLabel}
    role="img"
    {...props}
  >
    <title>{ariaLabel}</title>
    <path strokeLinecap="round" strokeLinejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" />
  </svg>
);

export const Bell = ({
  size = defaultSize,
  color = "currentColor",
  className = "",
  "aria-label": ariaLabel = "Bell icon",
  ...props
}) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    strokeWidth={1.5}
    stroke={color}
    width={size}
    height={size}
    className={`w-6 h-6 ${className}`}
    aria-label={ariaLabel}
    role="img"
    {...props}
  >
    <title>{ariaLabel}</title>
    <path strokeLinecap="round" strokeLinejoin="round" d="M14.857 17.082a23.848 23.848 0 0 0 5.454-1.31A8.967 8.967 0 0 1 18 9.75V9A6 6 0 0 0 6 9v.75a8.967 8.967 0 0 1-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 0 1-5.714 0m5.714 0a3 3 0 1 1-5.714 0" />
  </svg>
);

export const Moon = ({
  size = defaultSize,
  color = "currentColor",
  className = "",
  "aria-label": ariaLabel = "Moon icon",
  ...props
}) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    strokeWidth={1.5}
    stroke={color}
    width={size}
    height={size}
    className={`w-6 h-6 ${className}`}
    aria-label={ariaLabel}
    role="img"
    {...props}
  >
    <title>{ariaLabel}</title>
    <path strokeLinecap="round" strokeLinejoin="round" d="M21.752 15.002A9.72 9.72 0 0 1 18 15.75c-5.385 0-9.75-4.365-9.75-9.75 0-1.33.266-2.597.748-3.752A9.753 9.753 0 0 0 3 11.25C3 16.635 7.365 21 12.75 21a9.753 9.753 0 0 0 9.002-5.998Z" />
  </svg>
);

export const CaretDown = ({
  size = defaultSize,
  color = "currentColor",
  className = "",
  "aria-label": ariaLabel = "Caret down icon",
  ...props
}) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    strokeWidth={1.5}
    stroke={color}
    width={size}
    height={size}
    className={`w-6 h-6 ${className}`}
    aria-label={ariaLabel}
    role="img"
    {...props}
  >
    <title>{ariaLabel}</title>
    <path strokeLinecap="round" strokeLinejoin="round" d="m19.5 8.25-7.5 7.5-7.5-7.5" />
  </svg>
);

export const X = ({
  size = defaultSize,
  color = "currentColor",
  className = "",
  "aria-label": ariaLabel = "Close icon",
  ...props
}) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    strokeWidth={1.5}
    stroke={color}
    width={size}
    height={size}
    className={`w-6 h-6 ${className}`}
    aria-label={ariaLabel}
    role="img"
    {...props}
  >
    <title>{ariaLabel}</title>
    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
  </svg>
);

export const Globe = ({
  size = defaultSize,
  color = "currentColor",
  className = "",
  "aria-label": ariaLabel = "Globe icon",
  ...props
}) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    strokeWidth={1.5}
    stroke={color}
    width={size}
    height={size}
    className={`w-6 h-6 ${className}`}
    aria-label={ariaLabel}
    role="img"
    {...props}
  >
    <title>{ariaLabel}</title>
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 21a9.004 9.004 0 0 0 8.716-6.747M12 21a9.004 9.004 0 0 1-8.716-6.747M12 21c2.485 0 4.5-4.03 4.5-9S14.485 3 12 3m0 18c-2.485 0-4.5-4.03-4.5-9S9.515 3 12 3m0 0a8.997 8.997 0 0 1 7.843 4.582M12 3a8.997 8.997 0 0 0-7.843 4.582m15.686 0A11.953 11.953 0 0 1 12 10.5c-2.998 0-5.74-1.1-7.843-2.918m15.686 0A8.959 8.959 0 0 1 21 12c0 .778-.099 1.533-.284 2.253m0 0A17.919 17.919 0 0 1 12 16.5c-3.162 0-6.133-.815-8.716-2.247m0 0A9.015 9.015 0 0 1 3 12c0-1.605.42-3.113 1.157-4.418" />
  </svg>
);

export const ArrowLeft = ({
  size = defaultSize,
  color = "currentColor",
  className = "",
  "aria-label": ariaLabel = "Arrow left icon",
  ...props
}) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    strokeWidth={1.5}
    stroke={color}
    width={size}
    height={size}
    className={`w-6 h-6 ${className}`}
    aria-label={ariaLabel}
    role="img"
    {...props}
  >
    <title>{ariaLabel}</title>
    <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5 3 12m0 0 7.5-7.5M3 12h18" />
  </svg>
);

export const ArrowRight = ({
  size = defaultSize,
  color = "currentColor",
  className = "",
  "aria-label": ariaLabel = "Arrow right icon",
  ...props
}) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    strokeWidth={1.5}
    stroke={color}
    width={size}
    height={size}
    className={`w-6 h-6 ${className}`}
    aria-label={ariaLabel}
    role="img"
    {...props}
  >
    <title>{ariaLabel}</title>
    <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3" />
  </svg>
);

export const Eye = ({
  size = defaultSize,
  color = "currentColor",
  className = "",
  "aria-label": ariaLabel = "Eye icon",
  ...props
}) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    strokeWidth={1.5}
    stroke={color}
    width={size}
    height={size}
    className={`w-6 h-6 ${className}`}
    aria-label={ariaLabel}
    role="img"
    {...props}
  >
    <title>{ariaLabel}</title>
    <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 0 1 0-.639C3.423 7.51 7.36 4.5 12 4.5c4.639 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.639 0-8.573-3.007-9.963-7.178Z" />
    <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
  </svg>
);

export const Share = ({
  size = defaultSize,
  color = "currentColor",
  className = "",
  "aria-label": ariaLabel = "Share icon",
  ...props
}) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    strokeWidth={1.5}
    stroke={color}
    width={size}
    height={size}
    className={`w-6 h-6 ${className}`}
    aria-label={ariaLabel}
    role="img"
    {...props}
  >
    <title>{ariaLabel}</title>
    <path strokeLinecap="round" strokeLinejoin="round" d="M7.217 10.907a2.25 2.25 0 1 0 0 2.186m0-2.186c.18.324.283.696.283 1.093s-.103.77-.283 1.093m0-2.186 9.566-5.314m-9.566 7.5 9.566 5.314m0 0a2.25 2.25 0 1 0 3.935 2.186 2.25 2.25 0 0 0-3.935-2.186Zm0-12.814a2.25 2.25 0 1 0-3.933-2.185 2.25 2.25 0 0 0 3.933 2.185Z" />
  </svg>
);

export const Download = ({
  size = defaultSize,
  color = "currentColor",
  className = "",
  "aria-label": ariaLabel = "Download icon",
  ...props
}) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    strokeWidth={1.5}
    stroke={color}
    width={size}
    height={size}
    className={`w-6 h-6 ${className}`}
    aria-label={ariaLabel}
    role="img"
    {...props}
  >
    <title>{ariaLabel}</title>
    <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5M16.5 12 12 16.5m0 0L7.5 12m4.5 4.5V3" />
  </svg>
);

export const Users = ({
  size = defaultSize,
  color = "currentColor",
  className = "",
  "aria-label": ariaLabel = "Users icon",
  ...props
}) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    strokeWidth={1.5}
    stroke={color}
    width={size}
    height={size}
    className={`w-6 h-6 ${className}`}
    aria-label={ariaLabel}
    role="img"
    {...props}
  >
    <title>{ariaLabel}</title>
    <path strokeLinecap="round" strokeLinejoin="round" d="M15 19.128a9.38 9.38 0 0 0 2.625.372 9.337 9.337 0 0 0 4.121-.952 4.125 4.125 0 0 0-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 0 1 8.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0 1 11.964-3.07M12 6.375a3.375 3.375 0 1 1-6.75 0 3.375 3.375 0 0 1 6.75 0Zm8.25 2.25a2.625 2.625 0 1 1-5.25 0 2.625 2.625 0 0 1 5.25 0Z" />
  </svg>
);

export const AlertTriangle = ({
  size = defaultSize,
  color = "currentColor",
  className = "",
  "aria-label": ariaLabel = "Alert triangle icon",
  ...props
}) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    strokeWidth={1.5}
    stroke={color}
    width={size}
    height={size}
    className={`w-6 h-6 ${className}`}
    aria-label={ariaLabel}
    role="img"
    {...props}
  >
    <title>{ariaLabel}</title>
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126ZM12 15.75h.007v.008H12v-.008Z" />
  </svg>
);

export const Clock = ({
  size = defaultSize,
  color = "currentColor",
  className = "",
  "aria-label": ariaLabel = "Clock icon",
  ...props
}) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    strokeWidth={1.5}
    stroke={color}
    width={size}
    height={size}
    className={`w-6 h-6 ${className}`}
    aria-label={ariaLabel}
    role="img"
    {...props}
  >
    <title>{ariaLabel}</title>
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
  </svg>
);

export const Calendar = ({
  size = defaultSize,
  color = "currentColor",
  className = "",
  "aria-label": ariaLabel = "Calendar icon",
  ...props
}) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    strokeWidth={1.5}
    stroke={color}
    width={size}
    height={size}
    className={`w-6 h-6 ${className}`}
    aria-label={ariaLabel}
    role="img"
    {...props}
  >
    <title>{ariaLabel}</title>
    <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 0 1 2.25-2.25h13.5A2.25 2.25 0 0 1 21 7.5v11.25m-18 0A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75m-18 0v-7.5A2.25 2.25 0 0 1 5.25 9h13.5A2.25 2.25 0 0 1 21 11.25v7.5" />
  </svg>
);

export const TrendingUp = ({
  size = defaultSize,
  color = "currentColor",
  className = "",
  "aria-label": ariaLabel = "Trending up icon",
  ...props
}) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    strokeWidth={1.5}
    stroke={color}
    width={size}
    height={size}
    className={`w-6 h-6 ${className}`}
    aria-label={ariaLabel}
    role="img"
    {...props}
  >
    <title>{ariaLabel}</title>
    <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 18L9 11.25l4.306 4.307a11.95 11.95 0 015.814-5.519l2.74-1.22m0 0l-5.94-2.28m5.94 2.28l-2.28 5.941" />
  </svg>
);

export const Activity = ({
  size = defaultSize,
  color = "currentColor",
  className = "",
  "aria-label": ariaLabel = "Activity icon",
  ...props
}) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    strokeWidth={1.5}
    stroke={color}
    width={size}
    height={size}
    className={`w-6 h-6 ${className}`}
    aria-label={ariaLabel}
    role="img"
    {...props}
  >
    <title>{ariaLabel}</title>
    <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 3v11.25A2.25 2.25 0 0 0 6 16.5h2.25M3.75 3h-1.5m1.5 0h16.5m0 0h1.5m-1.5 0v11.25A2.25 2.25 0 0 1 18 16.5h-2.25m-7.5 0h7.5m-7.5 0-1 3m8.5-3 1 3m0 0 .5 1.5m-.5-1.5h-9.5m0 0-.5 1.5m.75-9 3-3 2.148 2.148A12.061 12.061 0 0 1 16.5 7.605" />
  </svg>
);

export const Award = ({
  size = defaultSize,
  color = "currentColor",
  className = "",
  "aria-label": ariaLabel = "Award icon",
  ...props
}) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    strokeWidth={1.5}
    stroke={color}
    width={size}
    height={size}
    className={`w-6 h-6 ${className}`}
    aria-label={ariaLabel}
    role="img"
    {...props}
  >
    <title>{ariaLabel}</title>
    <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 18.75h-9m9 0a3 3 0 0 1 3 3h-15a3 3 0 0 1 3-3m9 0v-3.375c0-.621-.503-1.125-1.125-1.125h-.871M7.5 18.75v-3.375c0-.621.504-1.125 1.125-1.125h.872m5.007 0H9.497m5.007 0a7.454 7.454 0 0 1-.982-3.172M9.497 14.25a7.454 7.454 0 0 0 .981-3.172M5.25 4.236c-.982.143-1.954.317-2.916.52A6.003 6.003 0 0 0 7.73 9.728M5.25 4.236V4.5c0 2.108.966 3.99 2.48 5.228M5.25 4.236V2.721C7.456 2.41 9.71 2.25 12 2.25c2.291 0 4.545.16 6.75.47v1.516M7.73 9.728a6.726 6.726 0 0 0 2.748 1.35m8.272-6.842V4.5c0 2.108-.966 3.99-2.48 5.228m2.48-5.492a46.32 46.32 0 0 1 2.916.52 6.003 6.003 0 0 1-5.395 4.972m0 0a6.726 6.726 0 0 1-2.749 1.35m0 0a6.772 6.772 0 0 1-3.044 0" />
  </svg>
);

export const BarChart3 = ({
  size = defaultSize,
  color = "currentColor",
  className = "",
  "aria-label": ariaLabel = "Bar chart 3 icon",
  ...props
}) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    strokeWidth={1.5}
    stroke={color}
    width={size}
    height={size}
    className={`w-6 h-6 ${className}`}
    aria-label={ariaLabel}
    role="img"
    {...props}
  >
    <title>{ariaLabel}</title>
    <path strokeLinecap="round" strokeLinejoin="round" d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 0 1 3 19.875v-6.75ZM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 0 1-1.125-1.125V8.625ZM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 0 1-1.125-1.125V4.125Z" />
  </svg>
);

export const PieChart = ({
  size = defaultSize,
  color = "currentColor",
  className = "",
  "aria-label": ariaLabel = "Pie chart icon",
  ...props
}) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    strokeWidth={1.5}
    stroke={color}
    width={size}
    height={size}
    className={`w-6 h-6 ${className}`}
    aria-label={ariaLabel}
    role="img"
    {...props}
  >
    <title>{ariaLabel}</title>
    <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 6a7.5 7.5 0 1 0 7.5 7.5h-7.5V6ZM10.5 6a7.5 7.5 0 0 1 7.5 7.5M13.5 10.5H21A7.5 7.5 0 0 0 13.5 3v7.5Z" />
  </svg>
);

export const CheckCircle = ({
  size = defaultSize,
  color = "currentColor",
  className = "",
  "aria-label": ariaLabel = "Check circle icon",
  ...props
}) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    strokeWidth={1.5}
    stroke={color}
    width={size}
    height={size}
    className={`w-6 h-6 ${className}`}
    aria-label={ariaLabel}
    role="img"
    {...props}
  >
    <title>{ariaLabel}</title>
    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75 11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
  </svg>
);

export const XCircle = ({
  size = defaultSize,
  color = "currentColor",
  className = "",
  "aria-label": ariaLabel = "X circle icon",
  ...props
}) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    strokeWidth={1.5}
    stroke={color}
    width={size}
    height={size}
    className={`w-6 h-6 ${className}`}
    aria-label={ariaLabel}
    role="img"
    {...props}
  >
    <title>{ariaLabel}</title>
    <path strokeLinecap="round" strokeLinejoin="round" d="m9.75 9.75 4.5 4.5m0-4.5-4.5 4.5M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
  </svg>
);

export const Shield = ({
  size = defaultSize,
  color = "currentColor",
  className = "",
  "aria-label": ariaLabel = "Shield icon",
  ...props
}) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    strokeWidth={1.5}
    stroke={color}
    width={size}
    height={size}
    className={`w-6 h-6 ${className}`}
    aria-label={ariaLabel}
    role="img"
    {...props}
  >
    <title>{ariaLabel}</title>
    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75 11.25 15 15 9.75m5.714-1.714a1.5 1.5 0 0 1 0 2.128l-2.714 2.714a1.5 1.5 0 0 1-2.128 0l-2.714-2.714a1.5 1.5 0 0 1 0-2.128l2.714-2.714a1.5 1.5 0 0 1 2.128 0l2.714 2.714Z" />
  </svg>
);

export const Lock = ({
  size = defaultSize,
  color = "currentColor",
  className = "",
  "aria-label": ariaLabel = "Lock icon",
  ...props
}) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    strokeWidth={1.5}
    stroke={color}
    width={size}
    height={size}
    className={`w-6 h-6 ${className}`}
    aria-label={ariaLabel}
    role="img"
    {...props}
  >
    <title>{ariaLabel}</title>
    <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 1 0-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 0 0 2.25-2.25v-6.75a2.25 2.25 0 0 0-2.25-2.25H6.75a2.25 2.25 0 0 0-2.25 2.25v6.75a2.25 2.25 0 0 0 2.25 2.25Z" />
  </svg>
);

export const User = ({
  size = defaultSize,
  color = "currentColor",
  className = "",
  "aria-label": ariaLabel = "User icon",
  ...props
}) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    strokeWidth={1.5}
    stroke={color}
    width={size}
    height={size}
    className={`w-6 h-6 ${className}`}
    aria-label={ariaLabel}
    role="img"
    {...props}
  >
    <title>{ariaLabel}</title>
    <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z" />
  </svg>
);

export const Info = ({
  size = defaultSize,
  color = "currentColor",
  className = "",
  "aria-label": ariaLabel = "Info icon",
  ...props
}) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    strokeWidth={1.5}
    stroke={color}
    width={size}
    height={size}
    className={`w-6 h-6 ${className}`}
    aria-label={ariaLabel}
    role="img"
    {...props}
  >
    <title>{ariaLabel}</title>
    <path strokeLinecap="round" strokeLinejoin="round" d="m11.25 11.25.041-.02a.75.75 0 0 1 1.063.852l-.708 2.836a.75.75 0 0 0 1.063.853l.041-.021M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9-3.75h.008v.008H12V8.25Z" />
  </svg>
);

export const SparklesIcon = ({
  size = defaultSize,
  color = "currentColor",
  className = "",
  "aria-label": ariaLabel = "Sparkles icon",
  ...props
}) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    strokeWidth={1.5}
    stroke={color}
    width={size}
    height={size}
    className={`w-6 h-6 ${className}`}
    aria-label={ariaLabel}
    role="img"
    {...props}
  >
    <title>{ariaLabel}</title>
    <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904 9 18.75l-.813-2.846a4.5 4.5 0 0 0-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 0 0 3.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 0 0 3.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 0 0-3.09 3.09Z" />
  </svg>
);

export const BugIcon = ({
  size = defaultSize,
  color = "currentColor",
  className = "",
  "aria-label": ariaLabel = "Bug icon",
  ...props
}) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    strokeWidth={1.5}
    stroke={color}
    width={size}
    height={size}
    className={`w-6 h-6 ${className}`}
    aria-label={ariaLabel}
    role="img"
    {...props}
  >
    <title>{ariaLabel}</title>
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 12.75c1.148 0 2.278.08 3.383.237 1.037.146 1.866.966 1.866 2.013V19.5a2.25 2.25 0 0 1-4.5 0v-.525a2.25 2.25 0 0 1 1.866-2.013c.105-.157.235-.237.383-.237Zm0 0c1.148 0 2.278-.08 3.383-.237 1.037-.146 1.866-.966 1.866-2.013V19.5a2.25 2.25 0 0 1-4.5 0v-.525a2.25 2.25 0 0 1 1.866-2.013c.105-.157.235-.237.383-.237Zm0 0c-1.148 0-2.278.08-3.383.237-1.037.146-1.866.966-1.866 2.013V19.5a2.25 2.25 0 0 1 4.5 0v-.525a2.25 2.25 0 0 1-1.866 2.013c-.105.157-.235.237-.383.237Zm0 0c-1.148 0-2.278-.08-3.383-.237-1.037-.146-1.866-.966-1.866-2.013V19.5a2.25 2.25 0 0 1 4.5 0v-.525a2.25 2.25 0 0 1-1.866-2.013c-.105-.157-.235-.237-.383-.237Z" />
  </svg>
);

export const WrenchScrewdriverIcon = ({
  size = defaultSize,
  color = "currentColor",
  className = "",
  "aria-label": ariaLabel = "Wrench screwdriver icon",
  ...props
}) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    strokeWidth={1.5}
    stroke={color}
    width={size}
    height={size}
    className={`w-6 h-6 ${className}`}
    aria-label={ariaLabel}
    role="img"
    {...props}
  >
    <title>{ariaLabel}</title>
    <path strokeLinecap="round" strokeLinejoin="round" d="M11.42 15.17 17.25 21A2.652 2.652 0 0 0 21 17.25l-5.877-5.877M11.42 15.17l2.496-3.03c.317-.384.74-.626 1.208-.766M11.42 15.17l-4.655 5.653a2.548 2.548 0 1 1-3.586-3.586l6.837-5.63m5.108-.233c.55-.164 1.163-.188 1.743-.14a4.5 4.5 0 0 0 4.486-6.336l-3.276 3.277a3.004 3.004 0 0 1-2.25-2.25l3.276-3.276a4.5 4.5 0 0 0-6.336 4.486c.091 1.076-.071 2.264-.904 2.95l-.102.085m-1.745 1.437L5.909 7.5H4.5L2.25 3.75l1.5-1.5L7.5 4.5v1.409l4.26 4.26m-1.745 1.437 1.745-1.437m6.615 8.206L15.75 15.75M4.867 19.125h.008v.008h-.008v-.008Z" />
  </svg>
);

export const ExclamationTriangleIcon = ({
  size = defaultSize,
  color = "currentColor",
  className = "",
  "aria-label": ariaLabel = "Exclamation triangle icon",
  ...props
}) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    strokeWidth={1.5}
    stroke={color}
    width={size}
    height={size}
    className={`w-6 h-6 ${className}`}
    aria-label={ariaLabel}
    role="img"
    {...props}
  >
    <title>{ariaLabel}</title>
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126ZM12 15.75h.007v.008H12v-.008Z" />
  </svg>
);

export const CheckCircleIcon = ({
  size = defaultSize,
  color = "currentColor",
  className = "",
  "aria-label": ariaLabel = "Check circle icon",
  ...props
}) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    strokeWidth={1.5}
    stroke={color}
    width={size}
    height={size}
    className={`w-6 h-6 ${className}`}
    aria-label={ariaLabel}
    role="img"
    {...props}
  >
    <title>{ariaLabel}</title>
    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75 11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
  </svg>
);

export const PlusIcon = ({
  size = defaultSize,
  color = "currentColor",
  className = "",
  "aria-label": ariaLabel = "Plus icon",
  ...props
}) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    strokeWidth={1.5}
    stroke={color}
    width={size}
    height={size}
    className={`w-6 h-6 ${className}`}
    aria-label={ariaLabel}
    role="img"
    {...props}
  >
    <title>{ariaLabel}</title>
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
  </svg>
);

export const MinusIcon = ({
  size = defaultSize,
  color = "currentColor",
  className = "",
  "aria-label": ariaLabel = "Minus icon",
  ...props
}) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    strokeWidth={1.5}
    stroke={color}
    width={size}
    height={size}
    className={`w-6 h-6 ${className}`}
    aria-label={ariaLabel}
    role="img"
    {...props}
  >
    <title>{ariaLabel}</title>
    <path strokeLinecap="round" strokeLinejoin="round" d="M5 12h14" />
  </svg>
);

export const ArrowUpIcon = ({
  size = defaultSize,
  color = "currentColor",
  className = "",
  "aria-label": ariaLabel = "Arrow up icon",
  ...props
}) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    strokeWidth={1.5}
    stroke={color}
    width={size}
    height={size}
    className={`w-6 h-6 ${className}`}
    aria-label={ariaLabel}
    role="img"
    {...props}
  >
    <title>{ariaLabel}</title>
    <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 10.5 12 3m0 0 7.5 7.5M12 3v18" />
  </svg>
);

export const FireIcon = ({
  size = defaultSize,
  color = "currentColor",
  className = "",
  "aria-label": ariaLabel = "Fire icon",
  ...props
}) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    strokeWidth={1.5}
    stroke={color}
    width={size}
    height={size}
    className={`w-6 h-6 ${className}`}
    aria-label={ariaLabel}
    role="img"
    {...props}
  >
    <title>{ariaLabel}</title>
    <path strokeLinecap="round" strokeLinejoin="round" d="M15.362 5.214A8.252 8.252 0 0 1 12 21 8.25 8.25 0 0 1 6.038 7.048 8.287 8.287 0 0 1 9 9.6a8.983 8.983 0 0 1 3.361-6.867 8.21 8.21 0 0 1 2.001 2.481Z" />
  </svg>
);

export const StarIcon = ({
  size = defaultSize,
  color = "currentColor",
  className = "",
  "aria-label": ariaLabel = "Star icon",
  ...props
}) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    strokeWidth={1.5}
    stroke={color}
    width={size}
    height={size}
    className={`w-6 h-6 ${className}`}
    aria-label={ariaLabel}
    role="img"
    {...props}
  >
    <title>{ariaLabel}</title>
    <path strokeLinecap="round" strokeLinejoin="round" d="M11.48 3.499a.562.562 0 0 1 1.04 0l2.125 5.111a.563.563 0 0 0 .475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 0 0-.182.557l1.285 5.385a.562.562 0 0 1-.84.61l-4.725-2.885a.562.562 0 0 0-.586 0L6.982 20.54a.562.562 0 0 1-.84-.61l1.285-5.386a.562.562 0 0 0-.182-.557l-4.204-3.602a.562.562 0 0 1 .321-.988l5.518-.442a.563.563 0 0 0 .475-.345L11.48 3.5Z" />
  </svg>
);

export const RocketLaunchIcon = ({
  size = defaultSize,
  color = "currentColor",
  className = "",
  "aria-label": ariaLabel = "Rocket launch icon",
  ...props
}) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    strokeWidth={1.5}
    stroke={color}
    width={size}
    height={size}
    className={`w-6 h-6 ${className}`}
    aria-label={ariaLabel}
    role="img"
    {...props}
  >
    <title>{ariaLabel}</title>
    <path strokeLinecap="round" strokeLinejoin="round" d="M15.59 14.37a6 6 0 0 1-5.84 7.38v-4.8m5.84-2.58a14.98 14.98 0 0 0 6.16-12.12A14.98 14.98 0 0 0 9.631 8.41m5.96 5.96a14.926 14.926 0 0 1-5.841 2.58m-.119-8.54a6 6 0 0 0-7.381 5.84h4.8m2.581-5.84a14.927 14.927 0 0 0-2.58 5.84m2.699 2.7c-.103.021-.207.041-.311.06a15.09 15.09 0 0 1-2.448-2.448 14.9 14.9 0 0 1 .06-.312m-2.24 2.39a4.493 4.493 0 0 0-1.757 4.306 4.493 4.493 0 0 0 4.306-1.758M16.5 9a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0Z" />
  </svg>
);



export const UserGroupIcon = ({
  size = defaultSize,
  color = "currentColor",
  className = "",
  "aria-label": ariaLabel = "User group icon",
  ...props
}) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    strokeWidth={1.5}
    stroke={color}
    width={size}
    height={size}
    className={`w-6 h-6 ${className}`}
    aria-label={ariaLabel}
    role="img"
    {...props}
  >
    <title>{ariaLabel}</title>
    <path strokeLinecap="round" strokeLinejoin="round" d="M18 18.72a9.094 9.094 0 0 0 3.741-.479 3 3 0 0 0-4.682-2.72m.94 3.198.001.031c0 .225-.012.447-.037.666A11.944 11.944 0 0 1 12 21c-2.17 0-4.207-.576-5.963-1.584A6.062 6.062 0 0 1 6 18.719m12 0a5.971 5.971 0 0 0-.941-3.197m0 0A5.995 5.995 0 0 0 12 12.75a5.995 5.995 0 0 0-5.058 2.772m0 0a3 3 0 0 0-4.681 2.72 8.986 8.986 0 0 0 3.74.477m.94-3.197a5.971 5.971 0 0 0-.94 3.197M15 6.75a3 3 0 1 1-6 0 3 3 0 0 1 6 0Zm6 3a2.25 2.25 0 1 1-4.5 0 2.25 2.25 0 0 1 4.5 0Zm-13.5 0a2.25 2.25 0 1 1-4.5 0 2.25 2.25 0 0 1 4.5 0Z" />
  </svg>
);

export const ChatBubbleLeftRightIcon = ({
  size = defaultSize,
  color = "currentColor",
  className = "",
  "aria-label": ariaLabel = "Chat bubble left right icon",
  ...props
}) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    strokeWidth={1.5}
    stroke={color}
    width={size}
    height={size}
    className={`w-6 h-6 ${className}`}
    aria-label={ariaLabel}
    role="img"
    {...props}
  >
    <title>{ariaLabel}</title>
    <path strokeLinecap="round" strokeLinejoin="round" d="M20.25 8.511c.884.284 1.5 1.128 1.5 2.097v4.286c0 1.136-.847 2.1-1.98 2.193-.34.027-.68.052-1.02.072v3.091l-3-3c-1.354 0-2.694-.055-4.02-.163a2.115 2.115 0 0 1-.825-.242m9.345-8.334a2.126 2.126 0 0 0-.476-.095 48.64 48.64 0 0 0-8.048 0c-1.131.094-1.976 1.057-1.976 2.192v4.286c0 .837.46 1.58 1.155 1.951m9.345-8.334V6.637c0-1.621-1.152-3.026-2.76-3.235A48.455 48.455 0 0 0 11.25 3c-2.115 0-4.198.137-6.24.402-1.608.209-2.76 1.614-2.76 3.235v6.226c0 1.621 1.152 3.026 2.76 3.235.577.075 1.157.14 1.74.194V21l4.155-4.155" />
  </svg>
);

export const HeartIcon = ({
  size = defaultSize,
  color = "currentColor",
  className = "",
  "aria-label": ariaLabel = "Heart icon",
  ...props
}) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    strokeWidth={1.5}
    stroke={color}
    width={size}
    height={size}
    className={`w-6 h-6 ${className}`}
    aria-label={ariaLabel}
    role="img"
    {...props}
  >
    <title>{ariaLabel}</title>
    <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12Z" />
  </svg>
);

export const GlobeAltIcon = ({
  size = defaultSize,
  color = "currentColor",
  className = "",
  "aria-label": ariaLabel = "Globe alt icon",
  ...props
}) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    strokeWidth={1.5}
    stroke={color}
    width={size}
    height={size}
    className={`w-6 h-6 ${className}`}
    aria-label={ariaLabel}
    role="img"
    {...props}
  >
    <title>{ariaLabel}</title>
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 21a9.004 9.004 0 0 0 8.716-6.747M12 21a9.004 9.004 0 0 1-8.716-6.747M12 21c2.485 0 4.5-4.03 4.5-9S14.485 3 12 3m0 18c-2.485 0-4.5-4.03-4.5-9S9.515 3 12 3m0 0a8.997 8.997 0 0 1 7.843 4.582M12 3a8.997 8.997 0 0 0-7.843 4.582m15.686 0A11.953 11.953 0 0 1 12 10.5c-2.998 0-5.74-1.1-7.843-2.918m15.686 0A8.959 8.959 0 0 1 21 12c0 .778-.099 1.533-.284 2.253m0 0A17.919 17.919 0 0 1 12 16.5c-3.162 0-6.133-.815-8.716-2.247m0 0A9.015 9.015 0 0 1 3 12c0-1.605.42-3.113 1.157-4.418" />
  </svg>
);

export const CalendarIcon = ({
  size = defaultSize,
  color = "currentColor",
  className = "",
  "aria-label": ariaLabel = "Calendar icon",
  ...props
}) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    strokeWidth={1.5}
    stroke={color}
    width={size}
    height={size}
    className={`w-6 h-6 ${className}`}
    aria-label={ariaLabel}
    role="img"
    {...props}
  >
    <title>{ariaLabel}</title>
    <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 0 1 2.25-2.25h13.5A2.25 2.25 0 0 1 21 7.5v11.25m-18 0A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75m-18 0v-7.5A2.25 2.25 0 0 1 5.25 9h13.5A2.25 2.25 0 0 1 21 11.25v7.5" />
  </svg>
);

export const MapPinIcon = ({
  size = defaultSize,
  color = "currentColor",
  className = "",
  "aria-label": ariaLabel = "Map pin icon",
  ...props
}) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    strokeWidth={1.5}
    stroke={color}
    width={size}
    height={size}
    className={`w-6 h-6 ${className}`}
    aria-label={ariaLabel}
    role="img"
    {...props}
  >
    <title>{ariaLabel}</title>
    <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
    <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1 1 15 0Z" />
  </svg>
);

export const ArrowRightIcon = ({
  size = defaultSize,
  color = "currentColor",
  className = "",
  "aria-label": ariaLabel = "Arrow right icon",
  ...props
}) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    strokeWidth={1.5}
    stroke={color}
    width={size}
    height={size}
    className={`w-6 h-6 ${className}`}
    aria-label={ariaLabel}
    role="img"
    {...props}
  >
    <title>{ariaLabel}</title>
    <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3" />
  </svg>
);

export const PlayIcon = ({
  size = defaultSize,
  color = "currentColor",
  className = "",
  "aria-label": ariaLabel = "Play icon",
  ...props
}) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    strokeWidth={1.5}
    stroke={color}
    width={size}
    height={size}
    className={`w-6 h-6 ${className}`}
    aria-label={ariaLabel}
    role="img"
    {...props}
  >
    <title>{ariaLabel}</title>
    <path strokeLinecap="round" strokeLinejoin="round" d="M5.25 5.653c0-.856.917-1.398 1.667-.986l11.54 6.347a.563.563 0 0 0 .475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 0 0-.182.557l1.285 5.385a.562.562 0 0 1-.84.61l-4.725-2.885a.562.562 0 0 0-.586 0L6.982 20.54a.562.562 0 0 1-.84-.61l1.285-5.386a.562.562 0 0 0-.182-.557l-4.204-3.602a.562.562 0 0 1 .321-.988l5.518-.442a.563.563 0 0 0 .475-.345L11.48 3.5Z" />
  </svg>
);

export const BookOpenIcon = ({
  size = defaultSize,
  color = "currentColor",
  className = "",
  "aria-label": ariaLabel = "Book open icon",
  ...props
}) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    strokeWidth={1.5}
    stroke={color}
    width={size}
    height={size}
    className={`w-6 h-6 ${className}`}
    aria-label={ariaLabel}
    role="img"
    {...props}
  >
    <title>{ariaLabel}</title>
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.042A8.967 8.967 0 0 0 6 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 0 1 6 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 0 1 6-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0 0 18 18a8.967 8.967 0 0 0-6 2.292m0-14.25v14.25" />
  </svg>
);

export const CodeBracketIcon = ({
  size = defaultSize,
  color = "currentColor",
  className = "",
  "aria-label": ariaLabel = "Code bracket icon",
  ...props
}) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    strokeWidth={1.5}
    stroke={color}
    width={size}
    height={size}
    className={`w-6 h-6 ${className}`}
    aria-label={ariaLabel}
    role="img"
    {...props}
  >
    <title>{ariaLabel}</title>
    <path strokeLinecap="round" strokeLinejoin="round" d="M17.25 6.75 22.5 12l-5.25 5.25m-10.5 0L1.5 12l5.25-5.25m7.5-3-4.5 16.5" />
  </svg>
);

export const LightBulbIcon = ({
  size = defaultSize,
  color = "currentColor",
  className = "",
  "aria-label": ariaLabel = "Light bulb icon",
  ...props
}) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    strokeWidth={1.5}
    stroke={color}
    width={size}
    height={size}
    className={`w-6 h-6 ${className}`}
    aria-label={ariaLabel}
    role="img"
    {...props}
  >
    <title>{ariaLabel}</title>
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 18v-5.25m0 0a6.01 6.01 0 0 0 1.5-.189m-1.5.189a6.01 6.01 0 0 1-1.5-.189m3.75 7.478a12.06 12.06 0 0 1-4.5 0m3.75 2.383a14.406 14.406 0 0 1-3 0M14.25 18v-.192c0-.983.658-1.823 1.508-2.316a7.5 7.5 0 1 0-7.517 0c.85.493 1.509 1.333 1.509 2.316V18" />
  </svg>
);

export const TrophyIcon = ({
  size = defaultSize,
  color = "currentColor",
  className = "",
  "aria-label": ariaLabel = "Trophy icon",
  ...props
}) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    strokeWidth={1.5}
    stroke={color}
    width={size}
    height={size}
    className={`w-6 h-6 ${className}`}
    aria-label={ariaLabel}
    role="img"
    {...props}
  >
    <title>{ariaLabel}</title>
    <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 18.75h-9m9 0a3 3 0 0 1 3 3h-15a3 3 0 0 1 3-3m9 0v-3.375c0-.621-.503-1.125-1.125-1.125h-.871M7.5 18.75v-3.375c0-.621.504-1.125 1.125-1.125h.872m5.007 0H9.497m5.007 0a7.454 7.454 0 0 1-.982-3.172M9.497 14.25a7.454 7.454 0 0 0 .981-3.172M5.25 4.236c-.982.143-1.954.317-2.916.52A6.003 6.003 0 0 0 7.73 9.728M5.25 4.236V4.5c0 2.108.966 3.99 2.48 5.228M5.25 4.236V2.721C7.456 2.41 9.71 2.25 12 2.25c2.291 0 4.545.16 6.75.47v1.516M7.73 9.728a6.726 6.726 0 0 0 2.748 1.35m8.272-6.842V4.5c0 2.108-.966 3.99-2.48 5.228m2.48-5.492a46.32 46.32 0 0 1 2.916.52 6.003 6.003 0 0 1-5.395 4.972m0 0a6.726 6.726 0 0 1-2.749 1.35m0 0a6.772 6.772 0 0 1-3.044 0" />
  </svg>
);

export const MegaphoneIcon = ({
  size = defaultSize,
  color = "currentColor",
  className = "",
  "aria-label": ariaLabel = "Megaphone icon",
  ...props
}) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    strokeWidth={1.5}
    stroke={color}
    width={size}
    height={size}
    className={`w-6 h-6 ${className}`}
    aria-label={ariaLabel}
    role="img"
    {...props}
  >
    <title>{ariaLabel}</title>
    <path strokeLinecap="round" strokeLinejoin="round" d="M10.34 15.84c-.688-.06-1.386-.09-2.09-.09H7.5a4.5 4.5 0 1 1 0-9h.75c.704 0 1.402-.03 2.09-.09m0 5.18c.253.962.584 1.892.985 2.783.247.55.06 1.21-.463 1.511l-.657.38c-.551.318-1.26.117-1.527-.461a20.845 20.845 0 0 1-1.44-4.282m3.42.129a20.87 20.87 0 0 1-.5-2.08c-.347-.991-.672-1.995-.985-3a.75.75 0 0 1 .463-1.511l.657-.38c.551-.318 1.26.117 1.527.461.18.391.353.786.518 1.174.165.388.322.774.47 1.158l.105.319c.095.285.099.649.77.649h.75c.704 0 1.402-.03 2.09-.09m0 5.18a7.003 7.003 0 0 0 1.83-2.536M12 20.25a4.5 4.5 0 0 0 1.23-3.096M12 20.25a4.5 4.5 0 0 1-1.23-3.096M12 20.25a4.5 4.5 0 0 0 1.23-3.096M12 20.25a4.5 4.5 0 0 1-1.23-3.096" />
  </svg>
);

export const UsersIcon = ({
  size = defaultSize,
  color = "currentColor",
  className = "",
  "aria-label": ariaLabel = "Users icon",
  ...props
}) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    strokeWidth={1.5}
    stroke={color}
    width={size}
    height={size}
    className={`w-6 h-6 ${className}`}
    aria-label={ariaLabel}
    role="img"
    {...props}
  >
    <title>{ariaLabel}</title>
    <path strokeLinecap="round" strokeLinejoin="round" d="M15 19.128a9.38 9.38 0 0 0 2.625.372 9.337 9.337 0 0 0 4.121-.952 4.125 4.125 0 0 0-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 0 1 8.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0 1 11.964-3.07M12 6.375a3.375 3.375 0 1 1-6.75 0 3.375 3.375 0 0 1 6.75 0Zm8.25 2.25a2.625 2.625 0 1 1-5.25 0 2.625 2.625 0 0 1 5.25 0Z" />
  </svg>
);

export const DocumentTextIcon = ({
  size = defaultSize,
  color = "currentColor",
  className = "",
  "aria-label": ariaLabel = "Document text icon",
  ...props
}) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    strokeWidth={1.5}
    stroke={color}
    width={size}
    height={size}
    className={`w-6 h-6 ${className}`}
    aria-label={ariaLabel}
    role="img"
    {...props}
  >
    <title>{ariaLabel}</title>
    <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 0 0-3.375-3.375h-1.5A1.125 1.125 0 0 1 13.5 7.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 0 0-9-9Z" />
  </svg>
);

export const CalendarDaysIcon = ({
  size = defaultSize,
  color = "currentColor",
  className = "",
  "aria-label": ariaLabel = "Calendar days icon",
  ...props
}) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    strokeWidth={1.5}
    stroke={color}
    width={size}
    height={size}
    className={`w-6 h-6 ${className}`}
    aria-label={ariaLabel}
    role="img"
    {...props}
  >
    <title>{ariaLabel}</title>
    <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 0 1 2.25-2.25h13.5A2.25 2.25 0 0 1 21 7.5v11.25m-18 0A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75m-18 0v-7.5A2.25 2.25 0 0 1 5.25 9h13.5A2.25 2.25 0 0 1 21 11.25v7.5m-9-6h.008v.008H12v-.008ZM12 15h.008v.008H12V15Zm0 2.25h.008v.008H12v-.008ZM9.75 15h.008v.008H9.75V15Zm0 2.25h.008v.008H9.75v-.008ZM7.5 15h.008v.008H7.5V15Zm0 2.25h.008v.008H7.5v-.008Zm6.75-4.5h.008v.008h-.008v-.008Zm0 2.25h.008v.008h-.008v-.008Zm0 2.25h.008v.008h-.008v-.008Zm2.25-4.5h.008v.008H16.5v-.008Zm0 2.25h.008v.008H16.5v-.008Z" />
  </svg>
);

export const ShieldCheckIcon = ({
  size = defaultSize,
  color = "currentColor",
  className = "",
  "aria-label": ariaLabel = "Shield check icon",
  ...props
}) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    strokeWidth={1.5}
    stroke={color}
    width={size}
    height={size}
    className={`w-6 h-6 ${className}`}
    aria-label={ariaLabel}
    role="img"
    {...props}
  >
    <title>{ariaLabel}</title>
    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75 11.25 15 15 9.75m-3-7.036A11.959 11.959 0 0 1 3.598 6 11.99 11.99 0 0 0 3 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285Z" />
  </svg>
);

// Alias for ClockIcon to match import expectations
export const ClockIcon = Clock;