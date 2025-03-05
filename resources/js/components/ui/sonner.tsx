import { useEffect, useState } from "react";
import { useTheme } from "next-themes";
import { Toaster as Sonner, toast, ToasterProps } from "sonner";
import { usePage } from "@inertiajs/react";

type FlashMessage = {
  message: string;
  type?: "success" | "error" | "info" | "warning";
};

enum ThemeEnum {
  Light = "light",
  Dark = "dark",
  System = "system",
}
const Toaster = ({ ...props }: ToasterProps) => {
    const { theme, systemTheme } = useTheme();
    const [currentTheme, setCurrentTheme] = useState<ToasterProps["theme"]>(ThemeEnum.Light);

    useEffect(() => {
        const resolvedTheme = theme === ThemeEnum.System ? systemTheme || ThemeEnum.Light : theme;
        if (Object.values(ThemeEnum).includes(resolvedTheme as ThemeEnum)) {
        setCurrentTheme(resolvedTheme as ToasterProps["theme"]);
    } else {
        setCurrentTheme(ThemeEnum.Light);
    }
}, [theme, systemTheme]);

  const { flash_message } = usePage().props as { flash_message?: FlashMessage };
  useEffect(() => {
    if (flash_message && flash_message.message) {
      switch (flash_message.type) {
        case "success":
          toast.success(flash_message.message);
          break;
        case "error":
          toast.error(flash_message.message);
          break;
        case "info":
          toast.info(flash_message.message);
          break;
        case "warning":
          toast.warning(flash_message.message);
          break;
        default:
          toast(flash_message.message);
      }
    }
  }, [flash_message]);

  return (
    <Sonner
      theme={currentTheme}
      className="toaster group"
      toastOptions={{
        classNames: {
          toast:
            "group toast group-[.toaster]:bg-background group-[.toaster]:text-foreground group-[.toaster]:border-border group-[.toaster]:shadow-lg",
          description: "group-[.toast]:text-muted-foreground",
          actionButton:
            "group-[.toast]:bg-primary group-[.toast]:text-primary-foreground font-medium",
          cancelButton:
            "group-[.toast]:bg-muted group-[.toast]:text-muted-foreground font-medium",
        },
      }}
      {...props}
    />
  );
};

export { Toaster };
