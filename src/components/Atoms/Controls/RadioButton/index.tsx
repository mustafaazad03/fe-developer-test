import React from "react";
import { VariantProps } from "class-variance-authority";
import { tv } from "tailwind-variants";
import { RadioOptions } from "@/types";
import { useFormContext, Controller } from "react-hook-form";

const radioGroupVariants = tv({
  base: "flex",
  variants: {
    orientation: {
      vertical: "flex-col gap-4",
      horizontal: "flex-row gap-6",
    },
  },
  defaultVariants: {
    orientation: "vertical",
  },
});

const radioVariants = tv({
  base: "flex items-center space-x-2 cursor-pointer transition-opacity",
  variants: {
    disabled: {
      true: "opacity-50 cursor-not-allowed",
      false: "hover:opacity-90",
    },
  },
  defaultVariants: {
    disabled: false,
  },
});

const bulletClassName = tv({
  base: "bg-[#8390A4] rounded-full transition-all duration-200 ease-in-out relative cursor-pointer flex-shrink-0",
  variants: {
    active: {
      true: "bg-white border-primary-400 border-[3px]",
      false: "",
    },
    error: {
      true: "!border-red-500",
      false: "",
    },
    size: {
      sm: "w-4 h-4",
      md: "w-6 h-6",
      lg: "w-8 h-8",
    },
  },
  defaultVariants: {
    size: "md",
    active: false,
    error: false,
  },
});

const labelClassName = tv({
  base: "transition-colors",
  variants: {
    active: {
      true: "text-white",
      false: "text-white/80",
    },
    error: {
      true: "text-red-500",
      false: "",
    },
  },
  defaultVariants: {
    active: false,
    error: false,
  },
});

type RadioProps = {
  name?: string;
  labelClassName?: string;
  options: RadioOptions[];
  defaultValue?: string;
  value?: string;
  className?: string;
  error?: boolean;
  errorMessage?: string;
  orientation?: "vertical" | "horizontal";
  onChange?: (option: RadioOptions) => void;
} & VariantProps<typeof bulletClassName>;

const Radio: React.FC<RadioProps> = ({
  name,
  options,
  defaultValue,
  value: controlledValue,
  className,
  labelClassName: customLabelClassName,
  error = false,
  errorMessage,
  orientation = "vertical",
  onChange,
  size,
}) => {
  const isControlled = controlledValue !== undefined;
  const [selectedValue, setSelectedValue] = React.useState(defaultValue || "");

  // Get actual current value based on controlled/uncontrolled status
  const currentValue = isControlled ? controlledValue : selectedValue;

  const formContext = useFormContext();
  const isInForm = Boolean(name && formContext);

  const handleChange = (option: RadioOptions) => {
    if (option.disabled) return;

    if (!isControlled) {
      setSelectedValue(option.value);
    }

    if (onChange) {
      onChange(option);
    }
  };

  // When controlled value changes, update selected value
  React.useEffect(() => {
    if (isControlled && controlledValue !== selectedValue) {
      setSelectedValue(controlledValue);
    }
  }, [controlledValue, isControlled]);

  // Render normal radio group when not in a form
  const renderRadioGroup = (
    value: string,
    onChange: (option: RadioOptions) => void,
  ) => (
    <div className={radioGroupVariants({ orientation, className })}>
      {options.map((option) => (
        <label
          key={option.value}
          className={radioVariants({ disabled: option.disabled })}
        >
          <input
            type="radio"
            value={option.value}
            name={name}
            checked={value === option.value}
            onChange={() => onChange(option)}
            disabled={option.disabled}
            className="sr-only"
            aria-checked={value === option.value}
          />
          <div
            className={bulletClassName({
              size,
              active: value === option.value,
              error,
            })}
            role="presentation"
          />

          <span
            className={
              customLabelClassName ||
              labelClassName({
                active: value === option.value,
                error,
              })
            }
          >
            {option.label}
          </span>
        </label>
      ))}
      {error && errorMessage && (
        <p className="text-red-500 text-sm mt-1">{errorMessage}</p>
      )}
    </div>
  );

  // If using React Hook Form, use the Controller component
  if (isInForm && name) {
    return (
      <Controller
        name={name}
        control={formContext.control}
        defaultValue={defaultValue || ""}
        render={({ field }) =>
          renderRadioGroup(field.value, (option) => {
            field.onChange(option.value);
            handleChange(option);
          })
        }
      />
    );
  }

  return renderRadioGroup(currentValue, handleChange);
};

export default Radio;
