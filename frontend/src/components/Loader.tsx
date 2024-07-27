function Loader() {
  return (
    <div className="fixed inset-0 bg-gray-900 bg-opacity-50 flex items-center justify-center backdrop-blur-md z-50">
      <div className="flex flex-col items-center">
        <div className="loader ease-linear rounded-full border-8 border-t-8 border-gray-200 h-32 w-32 mb-4"></div>
        <h2 className="text-white text-xl font-semibold">Loading...</h2>
        <p className="text-gray-300 mt-2">Please wait a moment.</p>
      </div>
    </div>
  );
}

export default Loader;
