interface ConfirmPopupProps {
  position: { x: number; y: number };
  onDelete: () => void;
  onCancel: () => void;
  onChangeRole?: () => void;
  onEdit?: () => void;
  onCreate?: () => void;
  enableCreate?: boolean;
}

export default function ConfirmPopupBox({
  position,
  onDelete,
  onCancel,
  onChangeRole,
  onEdit,
  onCreate,
  enableCreate = false,
}: ConfirmPopupProps) {
  return (
    <div
      role="dialog"
      aria-modal="true"
      className="absolute bg-white shadow-md border border-gray-300 rounded-md z-50 min-w-[140px] animate-fadeIn"
      style={{
        top: position.y + window.scrollY,
        left: position.x,
      }}
    >
      {onEdit && (
        <button
          className="block px-4 py-2 text-sm hover:bg-gray-100 w-full text-left text-blue-600"
          onClick={onEdit}
        >
          Edit
        </button>
      )}
      {enableCreate && onCreate && (
        <button
          type="button"
          className="block px-4 py-2 text-sm hover:bg-gray-100 w-full text-left text-green-600"
          onClick={onCreate}
        >
          Create New
        </button>
      )}
      {onChangeRole && (
        <button
          type="button"
          className="block px-4 py-2 text-sm hover:bg-gray-100 w-full text-left text-yellow-600"
          onClick={onChangeRole}
        >
          Change Role
        </button>
      )}
      <button
        type="button"
        className="block px-4 py-2 text-sm text-red-600 hover:bg-gray-100 w-full text-left"
        onClick={onDelete}
      >
        Delete
      </button>
      <button
        type="button"
        className="block px-4 py-2 text-sm hover:bg-gray-100 w-full text-left"
        onClick={onCancel}
      >
        Cancel
      </button>
    </div>
  );
}
