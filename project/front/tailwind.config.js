/** @type {import('tailwindcss').Config} */
export default {
  content: ["./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      fontFamily: {
        figtree: ["Figtree", "sans-serif"],
      },
      colors: {
        "bg-base": "#FFFFFF",
        "bg-brand": "#06032B",

        "text-brand": "#06032B",
        "feedback-text-inverse": "#FFFFFF",
        "feedback-text-subtle": "#757388",
        "feedback-text-brand": "#E91C2E",

        "feedback-border-neutral": "#D1D1D6",
        "feedback-border-brand": "#06032B",
        "feedback-border-alert": "#E91C2E",

        "feedback-icon-brand": "#FF9D00",
        "feedback-icon-neutral": "#757388",

        //bg-alternate
        "bg-alternate": "#F2F2F9",
        info: "#E8F3FF",
        "info-medium": "#E8F3FFBF",
        "info-low": "#E8F3FF80",

        //feed-back-background
        "feedback-background-service": "#006EFB",
        "feedback-background-info": "#3A51C9",
        "feedback-background-info-medium": "#3A51C9BF",
        "feedback-background-info-low": "#3A51C980",

        "feedback-background-neutral": "#F2F2F9",
        "feedback-background-neutral-medium": "#F2F2F9BF",
        "feedback-background-neutral-low": "#F2F2F980",

        "feedback-background-success": "#EEFEF2",
        "feedback-background-success-medium": "#EEFEF2BF",
        "feedback-background-success-low": "#EEFEF280",
        "feedback-background-success-bold": "#188638",
        "feedback-background-success-bold-medium": "#188638BF",
        "feedback-background-success-bold-low": "#18863880",

        "feedback-background-warning": "#FFF3E6",
        "feedback-background-warning-medium": "#FFF3E6BF",
        "feedback-background-warning-low": "#FFF3E680",
        "feedback-background-warning-bold": "#CF4B01",
        "feedback-background-warning-bold-medium": "#CF4B01BF",
        "feedback-background-warning-bold-low": "#CF4B0180",

        "feedback-background-alert": "#FEF1F2",
        "feedback-background-alert-medium": "#FEF1F2BF",
        "feedback-background-alert-low": "#FEF1F280",
        "feedback-background-alert-bold": "#E91C2E",
        "feedback-background-alert-bold-medium": "#E91C2EBF",
        "feedback-background-alert-bold-low": "#E91C2E80",

        "feedback-icon-subtle": "#757388",
        //TEXT
        subtle: "#757388",
        neutral: "#33323D",
      },
    },
  },
  plugins: [],
};
