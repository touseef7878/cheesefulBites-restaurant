import { useTheme } from "next-themes";
import { Toaster as Sonner, type ToasterProps } from "sonner";

const Toaster = ({ ...props }: ToasterProps) => {
  const { theme = "system" } = useTheme();

  return (
    <Sonner
      theme={theme as ToasterProps["theme"]}
      className="toaster group"
      duration={2500}
      style={
        {
          "--normal-bg": "#1c1b1b",
          "--normal-text": "#fcf9f8",
          "--normal-border": "#1c1b1b",
          "--success-bg": "#1c1b1b",
          "--success-text": "#fcf9f8",
          "--success-border": "#ffd200",
          "--error-bg": "#c00000",
          "--error-text": "#fff",
          "--error-border": "#1c1b1b",
        } as React.CSSProperties
      }
      {...props}
    />
  );
};

export { Toaster };
