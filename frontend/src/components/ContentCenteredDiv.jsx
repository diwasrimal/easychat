export default function ContentCenteredDiv({ children }) {
  return (
    <div className="bg-primary w-100 h-100 d-flex justify-content-center align-items-center">
      {children}
    </div>
  );
}
