import { PropsWithChildren, useEffect, useRef } from "react";
import styles from "./Dialog.module.css";

interface DialogProps {
  submitText: string;
  onSubmit: () => void;
  cancelText: string;
  onCancel: () => void;
}

function Dialog({
  children,
  submitText,
  onSubmit,
  cancelText,
  onCancel,
}: PropsWithChildren<DialogProps>) {
  const ref = useRef<HTMLDialogElement>(null);

  useEffect(() => ref?.current?.showModal(), []);

  return (
    <dialog ref={ref} className={styles.dialog}>
      <div className={styles.body}>{children}</div>
      <div className={styles.footer}>
        <button autoFocus onClick={onSubmit} className={styles.button}>
          {submitText}
        </button>
        <button autoFocus onClick={onCancel} className={styles.button}>
          {cancelText}
        </button>
      </div>
    </dialog>
  );
}

export default Dialog;
