export default defineAppConfig({
  ui: {
    colors: {
      neutral: "zinc",
      primary: "rose",
    },
    card: {
      slots: {
        root: "flex flex-col divide-y-0 ring-[var(--ui-border-accented)] focus-visible:ring-2 focus-visible:ring-[var(--ui-border-inverted)] focus:outline-none rounded-[calc(var(--ui-radius)*2)]",
        body: "grow-1 sm:p-4",
        footer: "sm:p-4 pt-2 sm:pt-2",
        header: "sm:p-4 pb-2 sm:pb-2",
      },
    },
    modal: {
      slots: {
        header: "pt-4 pb-0 flex justify-end items-center gap-x-2",
        title: "grow top-auto",
        footer: "justify-end",
        content: "divide-y-0",
        description: "mt-2",
        body: "pt-2 sm:pt-2",
        close: "relative top-auto end-auto",
      },
    },
  },
});
