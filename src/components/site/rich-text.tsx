import type { ComponentPropsWithoutRef, ElementType } from "react";

import clsx from "clsx";

import { translate, type LocaleText } from "@/lib/i18n";
import { useLocale } from "@/components/site/locale-context";

type RichTextProps<T extends ElementType> = {
  as?: T;
  value: LocaleText;
} & ComponentPropsWithoutRef<T>;

export function RichText<T extends ElementType = "div">({
  as,
  value,
  className,
  ...props
}: RichTextProps<T>) {
  const { locale } = useLocale();
  const Component = (as || "div") as ElementType;
  const content = translate(locale, value);

  return (
    <Component
      className={clsx("rich-text-reset", className)}
      dangerouslySetInnerHTML={{ __html: content?.replace(/\n/g, "<br />") ?? "" }}
      {...props}
    />
  );
}
