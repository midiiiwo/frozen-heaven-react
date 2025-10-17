import { useState, useCallback } from "react";

interface ConfirmationModalConfig
  extends Pick<
    ConfirmationModalProps,
    "title" | "message" | "confirmText" | "variant"
  > {
  onConfirm: () => void | Promise<void>;
}

export function useConfirmationModal() {
  const [modalState, setModalState] = useState<
    ConfirmationModalProps & { isOpen: boolean; isLoading?: boolean }
  >({
    isOpen: false,
    title: "",
    message: "",
    onConfirm: () => {},
    onClose: () => {},
    variant: "default",
    isLoading: false,
  });

  const showConfirmation = useCallback((config: ConfirmationModalConfig) => {
    setModalState({
      isOpen: true,
      title: config.title,
      message: config.message,
      confirmText: config.confirmText,
      variant: config.variant,
      onConfirm: config.onConfirm,
      onClose: () => setModalState((prev) => ({ ...prev, isOpen: false })),
      isLoading: false,
    });
  }, []);

  const closeModal = useCallback(() => {
    setModalState((prev) => ({ ...prev, isOpen: false }));
  }, []);

  const setLoading = useCallback((isLoading: boolean) => {
    setModalState((prev) => ({ ...prev, isLoading }));
  });

  const handleConfirm = useCallback(async () => {
    setModalState((prev) => ({ ...prev, isLoading: true }));
    try {
      await modalState.onConfirm();
      closeModal();
    } catch (error) {
      // Error handling can be done here if needed
      setModalState((prev) => ({ ...prev, isLoading: false }));
    }
  }, [modalState.onConfirm, closeModal]);

  return {
    modalProps: {
      ...modalState,
      onConfirm: handleConfirm,
      onClose: closeModal,
    },
    showConfirmation,
    closeModal,
    setLoading,
  };
}
