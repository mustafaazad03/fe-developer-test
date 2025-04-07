import React from "react";
import { Meta, StoryObj } from "@storybook/react";
import Input from "./index"; // Adjust this import path as needed
import { Button, Form } from "@/components";

const meta: Meta<typeof Input> = {
  title: "Atoms/Control/Input",
  component: Input,
  tags: ["autodocs"],
  parameters: {
    componentSubtitle:
      "A versatile input component with various types and built-in validation",
  },
};

export default meta;
type Story = StoryObj<typeof Input>;

const InputWrapper: React.FC<React.ComponentProps<typeof Input>> = (args) => {
  return (
    <Form onSubmit={(data) => console.log(data)}>
      <Input {...args} />
      <Button type="submit" style={{ marginTop: "10px" }}>
        Submit
      </Button>
    </Form>
  );
};

const StandaloneInputWrapper: React.FC<React.ComponentProps<typeof Input>> = (
  args,
) => {
  const [value, setValue] = React.useState(args.defaultValue || "");
  const [error, setError] = React.useState<string | undefined>();

  return (
    <div>
      <Input
        {...args}
        standalone={true}
        errorMessage={error}
        onChange={(e) => {
          setValue(e.target.value as string);
          if (args.required && !e.target.value) {
            setError("This field is required");
          } else {
            setError(undefined);
          }
        }}
      />
      <div style={{ marginTop: "10px" }}>
        Current value: {value ? JSON.stringify(value) : "(empty)"}
      </div>
    </div>
  );
};

export const Text: Story = {
  args: {
    name: "textInput",
    type: "text",
    label: "Text Input",
    required: true,
    disabled: true,
    tooltip: "This is a tooltip",

    placeholder: "Enter text",
    defaultValue: "Hi theres",
  },
  render: (args) => <InputWrapper {...args} />,
};

export const TextNotRequired: Story = {
  args: {
    ...Text.args,
    required: false,
    disabled: false,
  },
  render: (args) => <InputWrapper {...args} />,
};

export const Email: Story = {
  args: {
    name: "emailInput",
    type: "email",
    label: "Email Input",
    placeholder: "Enter email",
  },
  render: (args) => <InputWrapper {...args} />,
};

export const Password: Story = {
  args: {
    name: "passwordInput",
    type: "password",
    label: "Password Input",
    placeholder: "Enter password",
  },
  render: (args) => <InputWrapper {...args} />,
};

export const Number: Story = {
  args: {
    name: "numberInput",
    type: "number",
    label: "Number Input",
    placeholder: "Enter number",
  },
  render: (args) => <InputWrapper {...args} />,
};

export const Tel: Story = {
  args: {
    name: "telInput",
    type: "tel",
    label: "Telephone Input",
    placeholder: "Enter phone number",
  },
  render: (args) => <InputWrapper {...args} />,
};

export const Radio: Story = {
  args: {
    name: "radioInput",
    type: "radio",
    label: "Radio Input",
    radioOptions: [
      { label: "Option 1", value: "1" },
      { label: "Option 2", value: "2", disabled: true },
      { label: "Option 3", value: "3" },
    ],
  },
  render: (args) => <InputWrapper {...args} />,
};

export const Switch: Story = {
  args: {
    name: "switchInput",
    type: "switch",
    label: "Switch Input",
  },
  render: (args) => <InputWrapper {...args} />,
};

export const Dropdown: Story = {
  args: {
    name: "dropdownInput",
    type: "dropdown",
    label: "Dropdown Input",
    defaultValue: "Option 1",
    dropdownOptions: [
      { label: "Option 1", key: "1" },
      { label: "Option 2", key: "2" },
      { label: "Option 3", key: "3" },
    ],
  },
  render: (args) => <InputWrapper {...args} />,
};

export const WithBadge: Story = {
  args: {
    name: "badgeInput",
    type: "text",
    label: "Input with Badge",
    badge: "Optional",
    placeholder: "Enter text",
  },
  render: (args) => <InputWrapper {...args} />,
};

export const Disabled: Story = {
  args: {
    name: "disabledInput",
    type: "text",
    label: "Disabled Input",
    placeholder: "This input is disabled",
    disabled: true,
  },
  render: (args) => <InputWrapper {...args} />,
};

export const WithCustomValidation: Story = {
  args: {
    name: "customValidationInput",
    type: "text",
    label: "Custom Validation Input",
    placeholder: "Enter more than 5 characters",
    customValidation: {
      validate: (value: string) =>
        value.length > 5 || "Must be more than 5 characters",
    },
  },
  render: (args) => <InputWrapper {...args} />,
};

export const WithCustomOnChange: Story = {
  args: {
    name: "customOnChangeInput",
    type: "text",
    label: "Custom OnChange Input",
    placeholder: "Type something",
    onChange: (
      e: React.ChangeEvent<HTMLInputElement> | { value: string } | any,
    ) => {
      if ("target" in e) {
        console.log("Custom onChange:", e.target.value);
      } else {
        console.log("Custom onChange:", e.value);
      }
    },
  },
  render: (args) => <InputWrapper {...args} />,
};

export const RadioWithDisabledOption: Story = {
  args: {
    name: "radioWithDisabled",
    type: "radio",
    label: "Radio With Disabled Option",
    radioOptions: [
      { label: "Option 1", value: "1" },
      { label: "Option 2", value: "2", disabled: true },
      { label: "Option 3", value: "3" },
    ],
  },
  render: (args) => <InputWrapper {...args} />,
};

export const RadioEmpty: Story = {
  args: {
    name: "radioEmpty",
    type: "radio",
    label: "Radio With No Options",
    radioOptions: [],
  },
  render: (args) => <InputWrapper {...args} />,
};

export const DropdownEmpty: Story = {
  args: {
    name: "dropdownEmpty",
    type: "dropdown",
    label: "Dropdown With No Options",
    dropdownOptions: [],
  },
  render: (args) => <InputWrapper {...args} />,
};

export const StandaloneInput: Story = {
  args: {
    name: "standaloneInput",
    type: "text",
    label: "Standalone Input",
    placeholder: "This input works without Form context",
    required: true,
  },
  render: (args) => <StandaloneInputWrapper {...args} />,
};

export const PasswordWithWeakValue: Story = {
  args: {
    name: "weakPassword",
    type: "password",
    label: "Weak Password Input",
    placeholder: "Enter password",
    defaultValue: "weak",
  },
  render: (args) => <InputWrapper {...args} />,
};

Text.parameters = {
  docs: {
    description: {
      story: "A basic text input field.",
    },
  },
};

Email.parameters = {
  docs: {
    description: {
      story: "An email input field with built-in email validation.",
    },
  },
};

Password.parameters = {
  docs: {
    description: {
      story: "A password input field with strong password validation.",
    },
  },
};

Number.parameters = {
  docs: {
    description: {
      story: "A number input field that only accepts numeric values.",
    },
  },
};

Tel.parameters = {
  docs: {
    description: {
      story: "A telephone input field with phone number validation.",
    },
  },
};

Radio.parameters = {
  docs: {
    description: {
      story: "A radio button group input.",
    },
  },
};

Switch.parameters = {
  docs: {
    description: {
      story: "A switch input for boolean values.",
    },
  },
};

Dropdown.parameters = {
  docs: {
    description: {
      story: "A dropdown select input.",
    },
  },
};

WithBadge.parameters = {
  docs: {
    description: {
      story:
        "An input field with an additional badge, useful for showing extra information.",
    },
  },
};

Disabled.parameters = {
  docs: {
    description: {
      story: "A disabled input field.",
    },
  },
};

WithCustomValidation.parameters = {
  docs: {
    description: {
      story: "An input field with custom validation rules.",
    },
  },
};

WithCustomOnChange.parameters = {
  docs: {
    description: {
      story: "An input field with a custom onChange handler.",
    },
  },
};

RadioWithDisabledOption.parameters = {
  docs: {
    description: {
      story: "A radio button group with a disabled option.",
    },
  },
};

RadioEmpty.parameters = {
  docs: {
    description: {
      story: "Testing edge case: Radio input with empty options array.",
    },
  },
};

DropdownEmpty.parameters = {
  docs: {
    description: {
      story: "Testing edge case: Dropdown with empty options array.",
    },
  },
};

StandaloneInput.parameters = {
  docs: {
    description: {
      story: "Input used outside FormContext with standalone validation.",
    },
  },
};

PasswordWithWeakValue.parameters = {
  docs: {
    description: {
      story: "Testing password validation with a weak password.",
    },
  },
};

meta.parameters = {
  docs: {
    description: {
      component: `
# Input Component

The Input component is a versatile and customizable input field that supports various types of inputs including text, email, password, number, telephone, radio buttons, switches, and dropdowns. It integrates seamlessly with react-hook-form for form state management and validation.

## Features

- Supports multiple input types: text, email, password, number, tel, radio, switch, and dropdown
- Built-in validation for common input types
- Custom validation support
- Integrates with react-hook-form
- Customizable styling with Tailwind CSS
- Accessibility features
- Support for additional badges
- Custom onChange handler support

## Usage

To use the Input component, wrap it inside a \`FormProvider\` from react-hook-form:

\`\`\`jsx
import { useForm, FormProvider } from 'react-hook-form';
import Input from './Input';

const MyForm = () => {
  const methods = useForm();
  
  return (
    <FormProvider {...methods}>
      <form onSubmit={methods.handleSubmit(onSubmit)}>
        <Input name="email" type="email" label="Email" required />
        <Input name="password" type="password" label="Password" required />
        <button type="submit">Submit</button>
      </form>
    </FormProvider>
  );
};
\`\`\`

## Props

The following table shows which props are applicable to each input type:

### Prop Descriptions

| Prop Name | Type | Description |
|-----------|------|-------------|
| name | string | The name of the input field (required) |
| label | string | The label for the input field |
| required | boolean | Whether the field is required (default: true) |
| disabled | boolean | Whether the input is disabled |
| className | string | Additional CSS classes |
| placeholder | string | Placeholder text for the input |
| options | Array<{ label: string; value: string; disabled?: boolean }> | Options for radio inputs |
| dropdownOptions | Array<Array<MenuItem> | Options for dropdown inputs |
| customOnChange | function | Custom onChange handler |
| customValidation | RegisterOptions | Custom validation rules |
| badge | string | Text to display in a badge next to the label |

Note: All standard HTML input attributes are also supported and will be passed to the underlying input element.
      `,
    },
  },
};
