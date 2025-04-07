import { Meta, StoryObj } from "@storybook/react";
import Chatbot from "./index";
import MableLogo from "../../../../../public/MableLogo.svg";

const meta: Meta<typeof Chatbot> = {
  title: "Atoms/Controls/FloatingChatbot",
  component: Chatbot,
  tags: ["autodocs"],
  parameters: {
    componentSubtitle:
      "A floating chatbot widget that can be toggled open and closed",
    docs: {
      description: {
        component: `
# Chatbot Component

The Chatbot component is a floating widget that provides a chat interface for users to interact with.

## Features

- Toggleable chat interface
- Customizable position (bottom-right, bottom-left, top-right, top-left)
- Custom avatar and title support
- Message handling with loading states
- Keyboard support (Enter to send messages)
- Fully responsive and accessible

## Usage

The Chatbot component can be used to provide customer support, product information, or any other interactive communication with users.
        `,
      },
    },
  },
  argTypes: {
    position: {
      control: "select",
      options: ["bottom-right", "bottom-left", "top-right", "top-left"],
      description: "Position of the chat widget on the screen",
    },
    title: {
      control: "text",
      description: "Title displayed in the chatbot header",
    },
    placeholderText: {
      control: "text",
      description: "Placeholder text for the input field",
    },
    initialOpen: {
      control: "boolean",
      description: "Whether the chatbot should be open initially",
    },
    onSendMessage: {
      action: "message sent",
      description: "Function called when a message is sent",
    },
    avatar: {
      control: false,
      description: "Custom avatar element",
    },
    className: {
      control: "text",
      description: "Additional CSS classes",
    },
  },
};

export default meta;
type Story = StoryObj<typeof Chatbot>;

// Basic example
export const Default: Story = {
  args: {
    title: "Chat Support",
    placeholderText: "Type your message...",
    position: "bottom-right",
    initialOpen: false,
    onSendMessage: async (message) => {
      // Simulate a delay
      await new Promise((resolve) => setTimeout(resolve, 1000));
      return `I received your message: "${message}". This is a demo response.`;
    },
  },
};

// Example with custom avatar
export const WithCustomAvatar: Story = {
  args: {
    ...Default.args,
    title: "Mable Assistant",
    avatar: (
      <div className="w-8 h-8 rounded-full bg-black flex items-center justify-center">
        <img src={MableLogo} alt="Mable Logo" className="w-6 h-6" />
      </div>
    ),
    initialOpen: true,
  },
};

// Example positioned in the top-left corner
export const TopLeftPosition: Story = {
  args: {
    ...Default.args,
    position: "top-left",
    title: "Help Center",
  },
};

export const CustomResponses: Story = {
  args: {
    ...Default.args,
    initialOpen: true,
    onSendMessage: async (message) => {
      await new Promise((resolve) => setTimeout(resolve, 800));

      const lowerMessage = message.toLowerCase();
      if (lowerMessage.includes("hello") || lowerMessage.includes("hi")) {
        return "Hello there! How can I help you today?";
      } else if (lowerMessage.includes("help")) {
        return "I'm here to help! What do you need assistance with?";
      } else if (lowerMessage.includes("pricing")) {
        return "Our pricing plans start at $10/month for the basic package. Would you like more details?";
      } else {
        return "Thank you for your message. Can you please provide more details so I can assist you better?";
      }
    },
  },
};

export const BusinessSupport: Story = {
  args: {
    title: "Mable Support",
    placeholderText: "Ask about our analytics services...",
    initialOpen: true,
    position: "bottom-right",
    avatar: (
      <div className="w-8 h-8 rounded-full bg-black flex items-center justify-center">
        <span className="text-primary-400 font-bold text-sm">M</span>
      </div>
    ),
    onSendMessage: async (message) => {
      await new Promise((resolve) => setTimeout(resolve, 1200));

      const lowerMessage = message.toLowerCase();
      if (lowerMessage.includes("pricing") || lowerMessage.includes("cost")) {
        return "Our analytics packages start at $49/month with a 14-day free trial. Would you like me to send you our detailed pricing guide?";
      } else if (
        lowerMessage.includes("demo") ||
        lowerMessage.includes("trial")
      ) {
        return "We offer a 14-day free trial with full access to all features. You can sign up directly from our website with no credit card required.";
      } else if (
        lowerMessage.includes("integration") ||
        lowerMessage.includes("connect")
      ) {
        return "Mable integrates seamlessly with over 20 platforms including Shopify, WooCommerce, and major social media channels. Would you like specific information about a particular integration?";
      } else {
        return "Thank you for contacting Mable Support. Our team is available 24/7 to help with your analytics needs. Could you please specify what you're looking for?";
      }
    },
  },
};
