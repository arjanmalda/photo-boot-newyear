import React, { ReactNode, useEffect, useRef } from "react";
import XMarkIcon from "@heroicons/react/24/outline/XMarkIcon";
import cx from "classnames";

interface ModalProperties {
  onClose?: () => void;
  padding?: "small" | "large";
  children: ReactNode;
}

const FOCUS_ELEMENTS_QUERY =
  'a[href], button:not([disabled]), details, input:not([readonly]), select, textarea, [tabindex]:not([tabindex^="-"])';

const trapFocusInsideModal = (
  event: KeyboardEvent,
  element: HTMLElement | undefined | null
) => {
  if (event.key !== "Tab") return;

  const focusableModalElements =
    element?.querySelectorAll<HTMLElement>(FOCUS_ELEMENTS_QUERY);

  if (focusableModalElements && focusableModalElements?.length > 0) {
    const firstElement = focusableModalElements[0];
    const lastElement =
      focusableModalElements[focusableModalElements.length - 1];

    // if going forward by pressing tab and lastElement is active shift focus to first focusable element
    if (!event.shiftKey && document.activeElement === lastElement) {
      firstElement.focus();
      event.preventDefault();
    }

    if (event.shiftKey && document.activeElement === firstElement) {
      lastElement.focus();
      event.preventDefault();
    }
  }
};

export const Modal = ({
  onClose,
  children,
  padding = "large",
}: ModalProperties) => {
  const contentReference = useRef<HTMLElement>(null);

  useEffect(() => {
    function onKeyDown(event: KeyboardEvent) {
      if (onClose && event.key === "Escape") {
        onClose();
      }

      if (event.key === "Tab") {
        trapFocusInsideModal(event, contentReference?.current);
      }
    }

    document.addEventListener("keydown", onKeyDown, false);

    return () => document.removeEventListener("keydown", onKeyDown, false);
  }, [onClose]);

  useEffect(() => {
    const firstElementInContent =
      contentReference.current?.querySelector<HTMLElement>(
        FOCUS_ELEMENTS_QUERY
      );

    if (firstElementInContent) {
      firstElementInContent.focus();
    }
  }, []);

  return (
    <div className="fixed inset-0 z-[999] flex h-full w-full animate-containerShow items-center justify-center">
      <div
        className="absolute inset-0 h-full w-full bg-black bg-opacity-40"
        onClick={onClose}
        aria-hidden="true"
      />
      <section
        aria-modal="true"
        className={cx(
          "relative max-h-[calc(100svh-4rem)] w-full max-w-screen-lg animate-itemShow overflow-y-scroll rounded-xl bg-white"
          // padding === "small" ? "p-2.5 md:p-5" : "p-5 md:p-10"
        )}
        role="dialog"
        ref={contentReference}
      >
        {onClose ? (
          <button
            className={cx(
              "z-10 absolute flex h-6 w-6 cursor-pointer items-center justify-center border-0 bg-primary-50 bg-opacity-50 transition-all hover:bg-opacity-100 md:h-12 md:w-12",
              padding === "small"
                ? "right-2.5 top-2.5 md:right-5 md:top-5"
                : "right-5 top-5"
            )}
            onClick={onClose}
            type="button"
          >
            <XMarkIcon style={{ stroke: "black" }} width={24} height={24} />
          </button>
        ) : undefined}
        {children}
      </section>
    </div>
  );
};
