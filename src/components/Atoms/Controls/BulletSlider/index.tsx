import React, { useEffect, useState, useRef } from "react";
import { tv, type VariantProps } from "tailwind-variants";

const bulletSliderVariants = tv({
  base: "flex flex-row justify-between relative w-full",
  variants: {
    size: {
      sm: "gap-2",
      md: "gap-3",
      lg: "gap-4",
    },
  },
  defaultVariants: {
    size: "md",
  },
});

const bulletVariants = tv({
  base: "rounded-full transition-all duration-200 ease-in-out relative cursor-pointer bg-[#8390A4]",
  variants: {
    active: {
      true: "bg-white border-primary-400 border-[3px]",
      false: "",
    },
    passed: {
      true: "bg-primary-400",
      false: "",
    },
    size: {
      sm: "w-5 h-5",
      md: "w-6 h-6",
      lg: "w-7 h-7",
    },
    disabled: {
      true: "opacity-50 cursor-not-allowed",
      false: "hover:opacity-90",
    },
  },
  defaultVariants: {
    active: false,
    size: "md",
    disabled: false,
  },
});

const lineVariants = tv({
  base: "h-0 border-[#8390A4] absolute z-[-1] top-1/2 -translate-y-1/2",
  variants: {
    passed: {
      true: "border-primary-400",
      false: "",
    },
    size: {
      sm: "border-t-[1.5px]",
      md: "border-t-[2px]",
      lg: "border-t-[2.5px]",
    },
    dashed: {
      true: "border-dashed",
      false: "border-solid",
    },
  },
  defaultVariants: {
    size: "md",
    dashed: false,
  },
});

const inputVariants = tv({
  base: "bg-white bg-opacity-10 text-white text-center focus:outline-none focus:border-primary-400 p-1 rounded-md",
  variants: {
    size: {
      sm: "text-xs w-28",
      md: "text-sm w-[7rem]",
      lg: "text-base w-36",
    },
    error: {
      true: "border-red-500 focus:border-red-500",
      false: "",
    },
  },
  defaultVariants: {
    size: "md",
    error: false,
  },
});

const labelVariants = tv({
  base: "mt-2 text-white text-center",
  variants: {
    size: {
      sm: "text-xs",
      md: "text-sm",
      lg: "text-base",
    },
    active: {
      true: "font-medium",
      false: "",
    },
  },
  defaultVariants: {
    size: "md",
    active: false,
  },
});

// Types for the component
interface BulletSliderProps extends VariantProps<typeof bulletSliderVariants> {
  steps: JSX.Element[];
  onChange: (step: number, customValue?: string) => void;
  className?: string;
  defaultActiveStep?: number;
  value?: number;
  linePassed?: boolean;
  showCustomInput?: boolean;
  customInputPlaceholder?: string;
  defaultCustomValue?: string;
  customInputError?: boolean;
  customInputErrorMessage?: string;
  disabled?: boolean;
  size?: "sm" | "md" | "lg";
}

const Bullet = ({
  active,
  passed,
  size,
  disabled,
  onClick,
}: {
  active: boolean;
  passed: boolean;
  size?: "sm" | "md" | "lg";
  disabled?: boolean;
  onClick: () => void;
}) => (
  <button
    className={bulletVariants({ active, passed, size, disabled })}
    onClick={disabled ? undefined : onClick}
    disabled={disabled}
    aria-disabled={disabled}
    type="button"
    role="tab"
    aria-selected={active}
  />
);

const Line = ({
  passed,
  size,
  dashed,
  style,
}: {
  passed: boolean;
  size?: "sm" | "md" | "lg";
  dashed: boolean;
  style: React.CSSProperties;
}) => (
  <div
    className={lineVariants({ passed, size, dashed })}
    style={style}
    role="presentation"
  />
);

export const BulletSlider: React.FC<BulletSliderProps> = ({
  steps,
  onChange,
  defaultActiveStep = 1,
  value: controlledValue,
  className,
  linePassed = true,
  showCustomInput = false,
  customInputPlaceholder = "Custom",
  defaultCustomValue = "",
  customInputError = false,
  customInputErrorMessage,
  disabled = false,
  size = "md",
}) => {
  // State for internal tracking of active step (for uncontrolled component)
  const [activeStep, setActiveStep] = useState(defaultActiveStep);
  // State for custom input value
  const [customValue, setCustomValue] = useState(defaultCustomValue);

  // Component is controlled if value prop is provided
  const isControlled = controlledValue !== undefined;
  // Get current active step (controlled or uncontrolled)
  const currentActiveStep = isControlled ? controlledValue : activeStep;

  // Ref for container element to calculate widths
  const containerRef = useRef<HTMLDivElement>(null);
  // Track whether component is mounted
  const isMounted = useRef(false);

  // Total steps including potential custom input
  const totalSteps = showCustomInput
    ? [...steps, <div key="custom">Custom</div>]
    : steps;

  const lastIndex = totalSteps.length - 1;

  // Handle step click
  const handleStepClick = (index: number) => {
    if (disabled) return;

    if (!isControlled) {
      setActiveStep(index);
    }

    if (index === lastIndex && showCustomInput) {
      onChange(index, customValue);
    } else {
      onChange(index);
    }
  };

  // Handle custom input change
  const handleCustomInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (disabled) return;

    const value = e.target.value;
    setCustomValue(value);

    if (currentActiveStep === lastIndex) {
      onChange(lastIndex, value);
    }
  };

  // Update custom value if defaultCustomValue changes
  useEffect(() => {
    setCustomValue(defaultCustomValue);
  }, [defaultCustomValue]);

  // Update internal state when controlled value changes
  useEffect(() => {
    if (isControlled && controlledValue !== activeStep) {
      setActiveStep(controlledValue);
    }
  }, [controlledValue, isControlled]);

  // Handle responsive recalculation on resize
  useEffect(() => {
    if (!isMounted.current) {
      isMounted.current = true;
      return;
    }

    const handleResize = () => {
      // Force re-render on resize
      setActiveStep((prev) => prev);
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <div
      className={bulletSliderVariants({ size, className })}
      ref={containerRef}
      role="tablist"
      aria-orientation="horizontal"
    >
      {totalSteps.map((step, index) => {
        const isLast = index === lastIndex;
        const isCustomInput = showCustomInput && isLast;
        const shouldShowLine = !isLast;

        return (
          <div
            key={index}
            className="flex flex-col items-center flex-1 relative"
          >
            <div className="flex items-center relative w-full">
              <Bullet
                active={currentActiveStep === index}
                passed={linePassed ? currentActiveStep > index : false}
                size={size}
                disabled={disabled}
                onClick={() => handleStepClick(index)}
              />

              {shouldShowLine && (
                <Line
                  passed={linePassed ? currentActiveStep > index : false}
                  size={size}
                  dashed={showCustomInput && index === lastIndex - 1}
                  style={{
                    width: "calc(100% - 8px)",
                    left: "8px",
                  }}
                />
              )}
            </div>

            <div
              className={labelVariants({
                size,
                active: currentActiveStep === index,
              })}
              aria-hidden={currentActiveStep !== index}
            >
              {isCustomInput ? (
                <div className="flex flex-col">
                  <input
                    type="text"
                    value={customValue}
                    onChange={handleCustomInputChange}
                    placeholder={customInputPlaceholder}
                    className={inputVariants({ size, error: customInputError })}
                    onClick={() => handleStepClick(index)}
                    disabled={disabled}
                    aria-invalid={customInputError}
                  />
                  {customInputError && customInputErrorMessage && (
                    <span className="text-xs text-red-500 mt-1">
                      {customInputErrorMessage}
                    </span>
                  )}
                </div>
              ) : (
                step
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
};
