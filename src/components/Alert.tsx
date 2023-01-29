interface AlertProps {
  message: string;
}

export function Alert({ message }: AlertProps) {
  return (
    <div className="bg-light-error-container p-4 rounded mb-4">
      <p className="text-center text-light-error">{message}</p>
    </div>
  );
}
