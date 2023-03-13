"use client";

import { forwardRef, InputHTMLAttributes, useState } from "react";
import { IoCloseCircleOutline } from "react-icons/io5";
import { MdFileDownload } from "react-icons/md";
import { IconButton } from "./IconButton";

interface IProps extends InputHTMLAttributes<HTMLInputElement> {
  id: string;
  label: string;
  hint?: string;
  url?: string;
}

const FileInput = forwardRef<HTMLInputElement, IProps>(
  ({ id, label, hint, url, ...rest }, ref) => {
    const [showInput, setShowInput] = useState(!url);

    const handleDownload = (url: string) => {
      fetch(url).then((response) => {
        response.blob().then((blob) => {
          const url = window.URL.createObjectURL(blob);
          const a = document.createElement("a");
          a.href = url;
          a.download = "file.";
          a.click();
        });
      });
    };

    return (
      <div className="flex-1">
        {!showInput && (
          <div className="flex justify-between gap-4">
            <p className="block leading-10 max-w-[400px] line-clamp-1">{url}</p>
            <div>
              {url && (
                <IconButton
                  icon={MdFileDownload}
                  onClick={(e) => handleDownload(url)}
                  className="text-light-surface-tint"
                />
              )}
              <IconButton
                icon={IoCloseCircleOutline}
                onClick={() => setShowInput(true)}
                className="text-light-error"
              />
            </div>
          </div>
        )}

        {showInput && (
          <label
            htmlFor={id}
            className="text-light-on-surface-variant block flex-1"
          >
            {label}
            {hint && (
              <p className="flex items-center mb-2 text-sm text-light-on-surface-variant">
                {hint}
              </p>
            )}
            <input
              type="file"
              className="block w-full mt-2 text-sm text-light-on-surface-variant file:mr-4 file:p-2 file:rounded-full file:border-0 file:text-sm file:font-semibold
      file:bg-light-tertiary file:text-light-on-tertiary
      hover:file:brightness-90 duration-200"
              id={id}
              ref={ref}
              {...rest}
            />
          </label>
        )}
      </div>
    );
  }
);
FileInput.displayName = "FileInput";

export { FileInput };
