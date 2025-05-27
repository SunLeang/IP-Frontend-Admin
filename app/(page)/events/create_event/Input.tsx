import React from "react";

interface InputProps {
  children: React.ReactNode;
  label: (props: { htmlFor: string }) => React.ReactNode;
  type: string;
  value: string;
  id: string;
  otherProps?: React.InputHTMLAttributes<HTMLInputElement>;
  handleChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export default function Input({
  children,
  type,
  label,
  value,
  id,
  handleChange,
  ...otherProps
}: InputProps) {
  return (
    <div>
      {label && label({ htmlFor: id })}
      {children}
      <input
        // className="hidden"
        type={type}
        id={id}
        value={value}
        onChange={handleChange}
        {...otherProps}
      />
      {/* ... */}
    </div>
  );
}
