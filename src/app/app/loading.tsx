const LoadingApp = () => {
  return (
    <div className="grid grid-cols-5 grid-rows-[64px_1fr] overflow-y-hidden w-full h-screen bg-light-surface-1">
      <header className="flex items-center justify-between px-4 col-span-5 bg-light-primary-container" />

      <aside className="absolute duration-200 ease-in-out lg:translate-x-0 lg:p-4 top-0 left-0 z-10 w-full min-h-screen h-full lg:relative lg:w-full lg:col-span-1 bg-light-primary-container" />

      <main className="col-span-5 lg:col-span-4 h-full overflow-y-auto">
        <div className=" p-4 bg-light-primary" />
      </main>
    </div>
  );
};

export default LoadingApp;
