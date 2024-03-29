"use client";

import { KeyboardEventHandler, forwardRef } from "react";
import { Label } from "../ui/label";
import { Textarea } from "../ui/textarea";
import { cn } from "@/lib/utils";
import { FormErrors } from "./form-error";
import { useFormStatus } from "react-dom";

interface FormTextAreaProps {
  id: string;
  name?: string;
  label?: string;
  placeHolder?: string;
  required?: boolean;
  disabled?: boolean;
  errors?: Record<string, string[] | undefined>;
  className?: string;
  onBlur?: () => void;
  onClick?: () => void;
  onKeyDown?: KeyboardEventHandler<HTMLTextAreaElement> | undefined;
  defaultValue?: string;
}

const FormTextarea = forwardRef<HTMLTextAreaElement, FormTextAreaProps>(
  (
    {
      id,
      name,
      label,
      placeHolder,
      required,
      disabled,
      errors,
      className,
      onBlur,
      onClick,
      onKeyDown,
      defaultValue,
    },
    ref
  ) => {
    const { pending } = useFormStatus();

    return (
      <div className="space-y-2 w-full">
        <div className="space-y-1 w-full">
          {label && (
            <Label
              htmlFor="id"
              className="text-xs font-semibold text-neutral-700"
            />
          )}
          <Textarea
            onKeyDown={onKeyDown}
            onBlur={onBlur}
            onClick={onClick}
            ref={ref}
            required={required}
            disabled={disabled || pending}
            placeholder={placeHolder}
            name={name}
            id={id}
            className={cn(
              className,
              "resize-none focus-visible:ring-0 focus-visible:right-offset-0 ring-0 focus:ring-0 outline-none shadow-sm"
            )}
            aria-describedby={`${id}-error`}
            defaultValue={defaultValue}
          />
        </div>
        <FormErrors id={id} errors={errors} />
      </div>
    );
  }
);

export default FormTextarea;

FormTextarea.displayName = "FormTextArea";
