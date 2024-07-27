type ErrorModalChildren = {
  show: boolean;
  onClose: () => void;
  message: string;
};

function ErrorModal({ show, onClose, message }: ErrorModalChildren) {
  if (!show) return null;

  return (
    <div className="fixed inset-0 bg-gray-900 bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-lg w-full max-w-md mx-4 sm:mx-auto">
        <div className="p-5 border-b border-gray-200">
          <h3 className="text-lg font-bold text-gray-800">Error</h3>
        </div>
        <div className="p-5">
          <p className="text-black font-semibold">{message}</p>
        </div>
        <div className="p-5 flex justify-end border-t border-gray-200">
          <button
            className=" py-2 px-4 bg-black text-white rounded-md hover:bg-gray-800"
            onClick={onClose}
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}

export default ErrorModal;
