// components/auth/ProviderConflictModal.jsx
import React from "react";
import Button from "../ui/Button"; // Your existing Button

const ProviderConflictModal = ({ isOpen, onClose, onResolve, provider }) => {
  if (!isOpen) return null;

  const providerName =
    provider === "google.com"
      ? "Google"
      : provider === "github.com"
      ? "GitHub"
      : "another provider";

  return (
    <dialog className="modal modal-open">
      <div className="modal-box">
        <h3 className="font-bold text-lg">Account Already Exists</h3>
        <p className="py-4 text-sm text-gray-700">
          The email you're trying to sign in with is already linked to an
          account using <strong>{providerName}</strong>.
          <br />
          Please continue with <strong>{providerName}</strong> to link your
          account.
        </p>
        <div className="modal-action">
          <Button variant="secondary" onClick={onClose}>
            Cancel
          </Button>
          <Button variant="primary" onClick={onResolve}>
            Continue with {providerName}
          </Button>
        </div>
      </div>
    </dialog>
  );
};

export default ProviderConflictModal;
